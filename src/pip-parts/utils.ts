export function Tag(
  name: string,
  attributes?: Record<string, string>,
  styles?: Record<string, string>
) {
  const tag = document.createElement(name);
  if (attributes != null) {
    Object.entries(attributes).forEach(([key, value]) => {
      tag.setAttribute(key, value);
    });
  }

  if (styles != null) {
    Object.entries(styles).forEach(([key,value]) => {
      // @ts-expect-error index signature
      tag.style[key] = value;
    });
  }

  return tag;
}
