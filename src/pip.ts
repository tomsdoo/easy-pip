import { createHeader } from "@/pip-parts/header";
import { createSettingsForm } from "@/pip-parts/settings-form";
import type { Config, ConfigTarget } from "@/config";

declare global {
  interface Window {
    documentPictureInPicture: {
      requestWindow: () => Promise<Window>;
    }
  }
}

interface Options {
  updateTargets: (targets: ConfigTarget[]) => void;
}

export class Pip {
  protected store: Array<{
    target: HTMLElement;
    container: HTMLElement;
  }>;
  protected _isPip: boolean;
  protected pipWindow: Window | null;
  protected options: {
    updateTargets: (targets: Array<ConfigTarget>) => void;
  };
  constructor(public config: Config, options: Options) {
    this.store = [];
    this._isPip = false;
    this.pipWindow = null;
    this.options = options;
  }
  public isPip() {
    return this._isPip;
  }
  setConfig(config: Config) {
    this.config = config;
  }
  putBack() {
    while(this.store.length > 0) {
      const item = this.store.shift();
      if (item == null) {
        break;
      }
      const { container, target } = item;
      container.append(target);
    }
    this._isPip = false;
  }
  copyStyles() {
    Array.from(document.styleSheets).forEach((styleSheet) => {
      if (this.pipWindow == null) {
        return;
      }
      try {
        const cssRules = Array.from(styleSheet.cssRules)
          .map((rule) => rule.cssText)
          .join("");
        const style = document.createElement("style");
        style.textContent = cssRules;
        this.pipWindow.document.head.appendChild(style);
      } catch (e) {
        if (styleSheet.href != null) {
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.type = styleSheet.type;
          link.media = styleSheet.media.mediaText;
          link.href = styleSheet.href;
          this.pipWindow.document.head.appendChild(link);
        }
      }
    });

  }
  adjustStyles() {
    if (this.pipWindow == null) {
      return;
    }
    const scrollbarDisplayNone = document.createElement("style");
    scrollbarDisplayNone.textContent = `body::-webkit-scrollbar { display: none; }`;
    this.pipWindow.document.head.appendChild(scrollbarDisplayNone);
  }
  async open() {
    if (!("documentPictureInPicture" in window)) {
      return;
    }
    this.pipWindow = await window.documentPictureInPicture
      .requestWindow();
    const myInstance = this;
    this.pipWindow.addEventListener("pagehide", () => {
      myInstance.putBack();
    });

    this.copyStyles();
    this.adjustStyles();

    const { header, settingsButton, closeButton } = createHeader();
    const { settingsForm } = createSettingsForm({
      onSave: this.options.updateTargets,
    });
    this.pipWindow.document.body.appendChild(header);
    this.pipWindow.document.body.appendChild(settingsForm);
    settingsForm.style.display = this.config.targets.length === 0
      ? "grid"
      : "none";
    settingsButton.addEventListener("click", () => {
      settingsForm.style.display = "grid";
    });
    settingsForm.dataset.targets = JSON.stringify(this.config.targets);

    for (const { selector, pathRegExp } of this.config.targets) {
      if (selector == null || selector === "") {
        continue;
      }
      const regExp = new RegExp(pathRegExp);
      if (regExp.test(location.pathname+location.search) === false) {
        continue;
      }
      document.querySelectorAll(selector)
        .forEach(targetElement => {
          const container = targetElement.parentNode;
          if (container == null || this.pipWindow == null) {
            return;
          }
          this.pipWindow.document.body.append(targetElement);
          this.store.push({
            container: container as HTMLElement,
            target: targetElement as HTMLElement,
          });
        });
    }
    this._isPip = true;
  }
}
