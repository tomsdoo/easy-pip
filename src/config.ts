import { STORAGE_KEY } from "@/constants";

interface IConfig {
  targets: Array<{
    selector: string;
    pathRegExp: string;
  }>;
}

export type ConfigTarget = IConfig extends { targets: Array<infer T>} ? T : never;

const defaultConfig: IConfig = {
  targets: [],
};

function getConfig() {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (value == null) {
      return defaultConfig;
    }
    return JSON.parse(value) as IConfig;
  } catch {
    return defaultConfig;
  }
}

function saveConfig(config: IConfig) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export class Config {
  protected value: IConfig;
  constructor() {
    this.value = getConfig();
  }
  public get targets() {
    return this.value.targets;
  }
  saveTargets(targets: IConfig extends { targets: infer T } ? T : never) {
    this.value = {
      ...this.value,
      targets,
    };
    saveConfig(this.value);
  }
}
