import { Config } from "@/config";
import { Pip } from "@/pip";

(() => {
  const config = new Config();
  const pip = new Pip(config, {
    updateTargets(targets) {
      config.saveTargets(targets);
      pip.putBack();
      pip.setConfig(config);
      pip.open();
    }
  });
  const div = document.body.appendChild(document.createElement("div"));
  div.addEventListener("click", () => {
    pip.open();
    div.remove();
  });
  div.click();
})();
