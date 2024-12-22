import { describe, it, expect } from "vitest";
import { Config } from "@/config";
import { STORAGE_KEY } from "@/constants";

describe("Config", () => {
  describe("initial value", () => {
    it("storage key not exists", () => {
      localStorage.clear();
      const config = new Config();
      expect(config).toHaveProperty("targets", []);
    });

    it("storage key exists", () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        targets: [],
      }));
      const config = new Config();
      expect(config).toHaveProperty("targets", []);
    });

    it("storage key and value exist", () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        targets: [
          {
            selector: "dummySelector",
            pathRegExp: "dummyPathRegExp",
          },
        ],
      }));
      const config = new Config();
      expect(config).toHaveProperty("targets", [
        {
          selector: "dummySelector",
          pathRegExp: "dummyPathRegExp",
        },
      ]);
    });
  });

  describe("saveTargets()", () => {
    it("value will be written", () => {
      const config = new Config();
      config.saveTargets([
        {
          selector: "dummySelector",
          pathRegExp: "dummyPathRegExp",
        },
      ]);
      expect(localStorage.getItem(STORAGE_KEY)).toBe(JSON.stringify({
        targets: [
          {
            selector: "dummySelector",
            pathRegExp: "dummyPathRegExp",
          },
        ],
      }));
    });
  });
});
