"""Database connection and session management"""
import psycopg2
from psycopg2.extras import RealDictCursor
from contextlib import contextmanager
from typing import Generator
from config import settings


class Database:
    """Database connection manager"""
    
    def __init__(self, database_url: str):
        self.database_url = database_url
    
    @contextmanager
    def get_connection(self) -> Generator[psycopg2.extensions.connection, None, None]:
        """Get a database connection with context manager"""
        conn = psycopg2.connect(self.database_url)
        try:
            yield conn
            conn.commit()
        except Exception:
            conn.rollback()
            raise
        finally:
            conn.close()
    
    @contextmanager
    def get_cursor(self) -> Generator[RealDictCursor, None, None]:
        """Get a database cursor with context manager"""
        with self.get_connection() as conn:
            cursor = conn.cursor(cursor_factory=RealDictCursor)
            try:
                yield cursor
            finally:
                cursor.close()


# Global database instance
db = Database(settings.database_url)
