# Copyright 2024 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
from server.webdriver.base import WebdriverBaseTest
from server.webdriver.cdc_tests.base import CDC_AUTOPUSH_URL

# Shared tests that don't work in custom DC are skipped with this reason.
# Any skipped test should be noted in b/386405593, fixed and unskipped subsequently.
SKIPPED_TEST_REASON = "Not working in custom DC. See b/386405593"


class CdcAutopushTestBase(WebdriverBaseTest):
  """Base class for CDC Autopush webdriver tests."""
  dc_title_string = "Custom Data Commons"

  @classmethod
  def get_class_server_url(cls):
    return CDC_AUTOPUSH_URL
