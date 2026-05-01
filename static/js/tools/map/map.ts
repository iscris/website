/**
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from "react";
import ReactDOM from "react-dom";

import { loadLocaleData } from "../../i18n/i18n";
import { getLocaleFromUrl } from "../../utils/url_utils";
import { AppWithContext } from "./app";

// dc-brasil diagnostic: log full stack of any unhandled promise rejection so
// we can see WHERE the React #200 error is thrown (stack is already
// symbolicated by file+line in source even though the bundle is minified —
// minified names appear only below the webpack module boundary).
window.addEventListener("unhandledrejection", (ev) => {
  // eslint-disable-next-line no-console
  console.error(
    "[dc-brasil] unhandledrejection",
    ev.reason && (ev.reason.stack || ev.reason.message || ev.reason),
    ev.reason
  );
});
window.addEventListener("error", (ev) => {
  // eslint-disable-next-line no-console
  console.error(
    "[dc-brasil] window.error",
    ev.error && (ev.error.stack || ev.error.message || ev.error),
    ev.message,
    ev.filename,
    ev.lineno
  );
});

window.addEventListener("load", (): void => {
  const locale = getLocaleFromUrl();
  loadLocaleData(locale, [
    import(`../../i18n/compiled-lang/${locale}/units.json`),
  ]).then(() => {
    ReactDOM.render(
      React.createElement(AppWithContext),
      document.getElementById("main-pane")
    );
  });
});
