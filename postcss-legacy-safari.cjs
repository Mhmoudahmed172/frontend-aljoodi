/**
 * Tailwind v4 emits CSS that only Safari 16.4+ understands. Many students reach the site from older iPhones
 * (iPhone 6 is capped at iOS 12), so this plugin runs right after Tailwind and adds fallbacks for them:
 *
 * - `:where()` becomes `:is()` and `:dir()` alternatives are dropped, so `@csstools/postcss-is-pseudo-class`
 *   (next in the chain) can expand them into plain selectors. One unknown pseudo-class drops the whole rule,
 *   so selector lists that mix in `::backdrop`, `::file-selector-button`, ... are split into separate rules.
 * - Logical shorthands (`padding-inline`, `inset`, ...), `translate`/`rotate`/`scale`, flex `gap`, small
 *   viewport units and `overflow: clip` get physical equivalents inside `@supports not (...)`, so browsers that
 *   understand the modern property never see the fallback.
 *
 * The site is Arabic-only (`<html dir="rtl">`), so inline-start maps to the right side.
 */

const INLINE_SIDES = ["right", "left"];
const BLOCK_SIDES = ["top", "bottom"];
const INSET_SIDES = ["top", "right", "bottom", "left"];
const SMALL_VIEWPORT_UNIT = /(\d)(svh|dvh|lvh)\b/g;
const TAILWIND_TRANSLATE = "var(--tw-translate-x) var(--tw-translate-y)";
const TAILWIND_SCALE = "var(--tw-scale-x) var(--tw-scale-y)";
const UNKNOWN_TO_OLD_SAFARI = /::backdrop|::file-selector-button|::marker|:focus-visible|:-moz-|::-moz-/;
const SINGLE_CLASS =/^\.(?:\\.|[^\s,>+~.:[\]\\])+$/;

/**
 * Split a CSS value on top-level whitespace.
 *
 * @param {string} value
 *
 * @returns {string[]}
 */
function splitSpaces(value) {
  const parts = [];
  let depth = 0;
  let current = "";

  for (const char of value.trim()) {
    if (char === "(") depth++;
    if (char === ")") depth--;

    if (/\s/.test(char) && depth === 0) {
      if (current) parts.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  if (current) parts.push(current);

  return parts;
}

/**
 * Map a logical shorthand to its physical declarations, or null when the property is not one.
 *
 * @param {string} prop
 * @param {string} value
 *
 * @returns {Array<[string, string]>|null}
 */
function physicalDeclarations(prop, value) {
  const parts = splitSpaces(value);

  if (prop === "inset") {
    const [top, right = top, bottom = top, left = right] = parts;

    return INSET_SIDES.map((side, i) => [side, [top, right, bottom, left][i]]);
  }

  const match = /^(padding|margin|inset)-(inline|block)$/.exec(prop);
  if (!match) return null;

  const [, base, axis] = match;
  const sides = axis === "inline" ? INLINE_SIDES : BLOCK_SIDES;
  const [start, end = start] = parts;

  return sides.map((side, i) => [base === "inset" ? side : `${base}-${side}`, i === 0 ? start : end]);
}

/**
 * Convert a Tailwind scale value (`105%`, `1.05`) to a plain number usable inside `scale()`.
 *
 * @param {string} value
 *
 * @returns {string}
 */
function scaleNumber(value) {
  const percent = /^(-?[\d.]+)%$/.exec(value.trim());

  return percent ? String(Number(percent[1]) / 100) : value;
}

/**
 * Build the fallback declarations that turn individual transform properties into a `transform`.
 *
 * @param {import("postcss").Rule} rule
 *
 * @returns {Array<[string, string]>}
 */
function transformDeclarations(rule) {
  const declarations = [];
  let usesTransform = false;

  rule.each((decl) => {
    if (decl.type !== "decl") return;

    if (decl.prop === "translate") {
      usesTransform = true;
      if (decl.value === TAILWIND_TRANSLATE) return;

      const [x, y = "0"] = decl.value === "none" ? ["0", "0"] : splitSpaces(decl.value);
      declarations.push(["--tw-translate-x", x], ["--tw-translate-y", y]);
    }

    if (decl.prop === "rotate") {
      usesTransform = true;
      declarations.push(["--tw-rotate-fallback", decl.value === "none" ? "0deg" : decl.value]);
    }

    if (decl.prop === "scale") {
      usesTransform = true;
      if (decl.value === TAILWIND_SCALE) return;

      const [x, y = x] = decl.value === "none" ? ["1", "1"] : splitSpaces(decl.value);
      declarations.push(["--tw-scale-x-fallback", scaleNumber(x)], ["--tw-scale-y-fallback", scaleNumber(y)]);
    }

    if (decl.prop === "--tw-scale-x" || decl.prop === "--tw-scale-y") {
      declarations.push([`${decl.prop}-fallback`, scaleNumber(decl.value)]);
    }
  });

  if (!usesTransform) return [];

  declarations.push([
    "transform",
    "translate(var(--tw-translate-x, 0), var(--tw-translate-y, 0)) rotate(var(--tw-rotate-fallback, 0deg)) " +
      "scale(var(--tw-scale-x-fallback, 1), var(--tw-scale-y-fallback, 1))",
  ]);

  return declarations;
}

/**
 * Build flex-gap fallback rules (child margins) for a single-class gap utility such as `.gap-4`.
 *
 * @param {import("postcss").Rule} rule
 *
 * @returns {Array<{selector: string, declarations: Array<[string, string]>}>}
 */
function flexGapRules(rule) {
  if (!SINGLE_CLASS.test(rule.selector)) return [];

  let rowGap = null;
  let columnGap = null;

  rule.each((decl) => {
    if (decl.type !== "decl") return;

    if (decl.prop === "gap") {
      const [row, column = row] = splitSpaces(decl.value);
      rowGap = row;
      columnGap = column;
    }
    if (decl.prop === "row-gap") rowGap = decl.value;
    if (decl.prop === "column-gap") columnGap = decl.value;
  });

  const target = rule.selector;
  const rules = [];

  if (columnGap) {
    rules.push(
      {
        selector: `.flex${target}:not(.flex-col) > * + *, .inline-flex${target}:not(.flex-col) > * + *`,
        declarations: [["margin-right", columnGap]],
      },
      {
        selector: `[dir="ltr"].flex${target}:not(.flex-col) > * + *, [dir="ltr"].inline-flex${target}:not(.flex-col) > * + *`,
        declarations: [
          ["margin-right", "0"],
          ["margin-left", columnGap],
        ],
      },
    );
  }

  if (rowGap) {
    rules.push(
      { selector: `.flex-col${target} > * + *`, declarations: [["margin-top", rowGap]] },
      { selector: `.flex-wrap${target} > *`, declarations: [["margin-bottom", rowGap]] },
    );
  }

  return rules;
}

/**
 * Create the PostCSS plugin.
 *
 * @returns {import("postcss").Plugin}
 */
function legacySafari() {
  return {
    postcssPlugin: "postcss-legacy-safari",
    Once(root, { AtRule, Rule, Declaration }) {
      const fallbacks = [];

      root.walkRules((rule) => {
        if (rule.parent?.type === "atrule" && /keyframes$/.test(rule.parent.name)) return;

        rule.selector = rule.selector.replace(/:dir\((?:rtl|ltr)\),\s*/g, "").replace(/:where\(/g, ":is(");

        // Preflight lists such as `*, ::before, ::after, ::backdrop` would be dropped whole by old Safari.
        const unknown = rule.selectors.filter((selector) => UNKNOWN_TO_OLD_SAFARI.test(selector));
        if (unknown.length && unknown.length < rule.selectors.length) {
          for (const selector of unknown.reverse()) rule.after(rule.clone({ selector }));
          rule.selectors = rule.selectors.filter((selector) => !UNKNOWN_TO_OLD_SAFARI.test(selector));
        }

        const byCondition = new Map();
        const add = (condition, declarations, selector = rule.selector) => {
          if (!declarations.length) return;

          const key = `${condition}|${selector}`;
          if (!byCondition.has(key)) byCondition.set(key, { condition, selector, declarations: [] });
          byCondition.get(key).declarations.push(...declarations);
        };

        rule.each((decl) => {
          if (decl.type !== "decl") return;

          const physical = physicalDeclarations(decl.prop, decl.value);
          if (physical) add(`${decl.prop}: 0`, physical);

          if (SMALL_VIEWPORT_UNIT.test(decl.value)) {
            add("height: 1svh", [[decl.prop, decl.value.replace(SMALL_VIEWPORT_UNIT, "$1vh")]]);
          }
          SMALL_VIEWPORT_UNIT.lastIndex = 0;

          if (/^overflow(-[xy])?$/.test(decl.prop) && decl.value === "clip") {
            add("overflow: clip", [[decl.prop, "hidden"]]);
          }
        });

        add("translate: 0", transformDeclarations(rule));

        for (const gap of flexGapRules(rule)) add("inset: 0", gap.declarations, gap.selector);

        if (byCondition.size) fallbacks.push({ rule, groups: [...byCondition.values()] });
      });

      for (const { rule, groups } of fallbacks) {
        let anchor = rule;

        for (const { condition, selector, declarations } of groups) {
          const fallbackRule = new Rule({ selector });
          for (const [prop, value] of declarations) fallbackRule.append(new Declaration({ prop, value }));

          const supports = new AtRule({ name: "supports", params: `not (${condition})` });
          supports.append(fallbackRule);
          anchor.after(supports);
          anchor = supports;
        }
      }
    },
  };
}

legacySafari.postcss = true;

module.exports = legacySafari;
