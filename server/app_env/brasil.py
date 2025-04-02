from server.app_env import _base


class Config(_base.Config):
  NAME = "Brasil Data Commons"
  CUSTOM = True
  LOCAL = True
  USE_LLM = True
  LOG_QUERY = True
  ENABLE_BQ = True
