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
 * A component to display a simple text block
 */
/** @jsxImportSource @emotion/react */

import { css, useTheme } from "@emotion/react";
import React, { ReactElement } from "react";

interface SimpleTextProps {
  //the content (text or other content) as a React element
  children: ReactElement;
}

const SimpleText = ({ children }: SimpleTextProps): ReactElement => {
  const theme = useTheme();
  return (
    <article
      css={css`
        h3 {
          ${theme.typography.family.heading};
          ${theme.typography.heading.sm};
          margin-bottom: ${theme.spacing.lg}px;
        }
        p {
          ${theme.typography.family.text};
          ${theme.typography.text.md};
        }
      `}
    >
      {children}
    </article>
  );
};

export default SimpleText;
