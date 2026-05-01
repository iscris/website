/**
 * Copyright 2024 Google LLC
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

/**
 * Entry point for the base template. This file will render two apps: one for the header and one for the footer.
 */

import { loadLocaleData } from "../../i18n/i18n";

window.addEventListener("load", async (): Promise<void> => {
  // Load locale data so pages that pull labels from compiled-lang work.
  const metadataContainer = document.getElementById("metadata-base");
  const locale = metadataContainer.dataset.locale;
  await loadLocaleData(locale, [
    import(`../../i18n/compiled-lang/${locale}/units.json`),
  ]);

  // The header and footer are rendered server-side from the Brazil-custom
  // Jinja partials (templates/custom_dc/brasil/partials/_header.html and
  // _footer.html) — no React HeaderApp or FooterApp.
});
