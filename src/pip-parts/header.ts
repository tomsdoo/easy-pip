import { Tag } from "@/pip-parts/utils";
import closeButtonSvg from "@/svgs/close-button.svg";
import settingsButtonSvg from "@/svgs/settings-button.svg";

export function createHeader() {
  const header = Tag("header", {}, {
    display: "grid",
    justifyContent: "end",
    alignItems: "center",
    gridTemplateColumns: "1fr auto auto",
    boxShadow: "inset 0 0 1px",
  });

  const titleDiv = header.appendChild(Tag("div", {}, {
    textAlign: "center",
  }));
  titleDiv.textContent = "easy pip";

  const settingsButton = header.appendChild(Tag("button", {
    type: "button",
  }, {
    padding: "0.2em",
  }));
  settingsButton.innerHTML = settingsButtonSvg;

  const closeButton = header.appendChild(Tag("button", {
    type: "button",
  }, {
    padding: "0.2em",
  }));
  closeButton.addEventListener("click", () => {
    header.remove();
  });
  closeButton.innerHTML = closeButtonSvg;

  return {
    header,
    settingsButton,
    closeButton,
  };
}
