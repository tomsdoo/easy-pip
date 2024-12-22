import { beforeEach, describe, it, expect, vi } from "vitest";
import { Tag } from "@/pip-parts/utils";

describe("Tag()", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("tag will be created", () => {
    document.body.appendChild(Tag("div"));
    expect(document.body.innerHTML).toBe(`<div></div>`);
  });

  it("with attributes", () => {
    document.body.appendChild(Tag("a", {
      href: "https://dummy.com/some",
    }));
    expect(document.body.innerHTML).toBe(`<a href="https://dummy.com/some"></a>`);
  });

  it("with styles", () => {
    document.body.appendChild(Tag("div", {}, {
      display: "grid",
      gap: "1rem",
    }));
    expect(document.body.innerHTML).toBe(`<div style="display: grid; gap: 1rem;"></div>`);
  });
});
