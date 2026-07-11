import logging

from fastapi import HTTPException, status

logger = logging.getLogger(__name__)


def raise_database_error(detail: str) -> None:
     logger.exception(detail)
     raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=detail)
