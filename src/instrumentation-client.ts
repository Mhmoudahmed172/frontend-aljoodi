// Polyfills for old iOS Safari (iPhone 6 is capped at iOS 12). Next only injects its own polyfills through a
// `nomodule` script, which Safari 12 skips because it supports ES modules. Each core-js module is a no-op where
// the browser already has the feature.
import "core-js/actual/global-this";
import "core-js/actual/queue-microtask";
import "core-js/actual/object/from-entries";
import "core-js/actual/object/has-own";
import "core-js/actual/array/at";
import "core-js/actual/array/find-last";
import "core-js/actual/array/find-last-index";
import "core-js/actual/string/at";
import "core-js/actual/string/replace-all";
