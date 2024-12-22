import { Tag } from "@/pip-parts/utils";
import addButtonSvg from "@/svgs/add-button.svg";
import saveButtonSvg from "@/svgs/save-button.svg";
import closeButtonSvg from "@/svgs/close-button.svg";
import deleteButtonSvg from "@/svgs/delete-button.svg";
import type { Config, ConfigTarget } from "@/config";

export function createSettingsForm({
  onSave,
}: {
  onSave: (targets: Config extends { targets: infer T } ? T : never) => void;
}) {
  const settingsForm = Tag("form", {
    onsubmit: "return false",
  }, {
    display: "grid",
    gap: "1em",
    padding: "1em",
    boxShadow: "inset 0 0 1px",
  });

  const buttonsSection = settingsForm.appendChild(Tag("section", {}, {
    display: "grid",
    gap: "0.5em",
    gridTemplateColumns: "repeat(3, max-content)",
    justifyContent: "end",
  }));

  const addButton = buttonsSection.appendChild(Tag("button", {
    type: "button",
  }));
  addButton.innerHTML = addButtonSvg;
  addButton.addEventListener("click", () => {
    addSelectorBox();
  });

  const saveButton = buttonsSection.appendChild(Tag("button", {
    type: "button",
  }));
  saveButton.innerHTML = saveButtonSvg;
  saveButton.addEventListener("click", () => {
    const listItems = Array.from(
      settingsForm.querySelectorAll(".targets ul li")
    );
    const nextTargets = listItems.map(listItem => ({
      selector: (listItem.querySelector(".selector-div input") as HTMLInputElement)?.value ?? "",
      pathRegExp: (listItem.querySelector(".path-div input") as HTMLInputElement)?.value ?? "",
    }));
    onSave(nextTargets);
  });

  const closeButton = buttonsSection.appendChild(Tag("button", {
    type: "button",
  }));
  closeButton.innerHTML = closeButtonSvg;
  closeButton.addEventListener("click", () => {
    settingsForm.style.display = "none";    
  });

  const targetsSection = settingsForm.appendChild(Tag("section", {
    class: "targets",
  }));
  const targetUl = targetsSection.appendChild(Tag("ul", {}, {
    display: "grid",
    gap: "0.5em",
  }));

  new MutationObserver((mutationList, observer) => {
    for (const mutation of mutationList) {
      if (mutation.type !== "attributes") {
        continue;
      }
      refreshForm();
    }
  }).observe(settingsForm, { attributes: true });

  function refreshForm() {
    settingsForm.querySelectorAll(".targets ul li").forEach(el => {
      el.remove();
    });
    const targets = (() => {
      try {
        if (settingsForm.dataset.targets == null) {
          return [] as Array<ConfigTarget>;
        } else {
          return JSON.parse(settingsForm.dataset.targets) as Array<ConfigTarget>;
        }
      } catch {
        return [] as Array<ConfigTarget>;
      }
    })();
    for (const target of targets) {
      if (target.selector == null || target.selector === "") {
        continue;
      }
      addSelectorBox(target);
    }
  }

  function addSelectorBox(initialValue?: ConfigTarget) {
    const li = Tag("li", {}, {
      display: "grid",
      gridTemplateColumns: "1fr 1fr auto",
      alignItems: "center",
      gap: "0.5em",
    });

    const selectorDiv = li.appendChild(Tag("div", {
      class: "selector-div",
    }, {
      display: "grid",
      gridTemplateColumns: "auto 1fr",
      alignItems: "center",
      gap: "0.5em",
    }));
    selectorDiv.appendChild(Tag("span")).textContent = "selector:";
    const selectorBox = selectorDiv.appendChild(Tag("input", {}, {
      boxShadow: "inset 0 0 1px",
      padding: "0.2em 0.5em",
      width: "100%",
    }));

    const pathDiv = li.appendChild(Tag("div", {
      class: "path-div",
    }, {
      display: "grid",
      gridTemplateColumns: "auto 1fr",
      alignItems: "center",
      gap: "0.5em",
    }));
    pathDiv.appendChild(Tag("span")).textContent = "path:";
    const pathBox = pathDiv.appendChild(Tag("input", {}, {
      boxShadow: "inset 0 0 1px",
      padding: "0.2em 0.5em",
      width: "100%",
    }));
  
    const button = li.appendChild(Tag("button", {
      type: "button",
    }));
    button.innerHTML = deleteButtonSvg;
    settingsForm.querySelector(".targets ul")?.appendChild(li);
    (pathBox as HTMLInputElement).value = location.pathname+location.search;
    if (initialValue != null) {
      (selectorBox as HTMLInputElement).value = initialValue.selector;
      (pathBox as HTMLInputElement).value = initialValue.pathRegExp;
    }
    button.addEventListener("click", (e) => {
      if (e.target == null) {
        return;
      }
      (e.target as HTMLElement).closest("li")?.remove();
    });
  }

  return {
    settingsForm,
  };
}

