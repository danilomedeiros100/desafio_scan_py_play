import pytest

from pages.home_page import HomePage


@pytest.fixture
def home_page(page) -> HomePage:
    return HomePage(page)


@pytest.fixture
def cliente() -> dict:
    """Armazena dados do cliente corrente entre steps de um mesmo cenário."""
    return {}
