"""Fluxo completo via Scenario Outline — 3 clientes."""
import uuid

import config
from pytest_bdd import given, scenarios, then, when

scenarios("fluxo_compras_completo.feature")


@given("o usuario acessa a pagina de cadastro")
def usuario_acessa_cadastro_outline(home_page):
    home_page.acessar_cadastro()


@when("o usuario preenche o formulario de cadastro")
def preenche_cadastro_outline(_pytest_bdd_example, home_page):
    d = _pytest_bdd_example
    sufixo = uuid.uuid4().hex[:6]
    email = f"{d['nome'].lower()}{d['sobrenome'].lower()}{sufixo}@mailtest.com"
    login = f"{d['nome'].lower()}{d['sobrenome'].lower()}{sufixo}"
    home_page.preencher_dados_pessoais(d["nome"], d["sobrenome"], email, d["telefone"])
    home_page.preencher_endereco(d["endereco"], d["cidade"], d["estado"], d["cep"])
    home_page.preencher_dados_login(login, config.SENHA_PADRAO)
    home_page.confirmar_cadastro()


@then("o usuario visualiza a confirmacao de cadastro")
def valida_confirmacao_outline(home_page):
    home_page.validar_confirmacao_cadastro()
    home_page.continuar_apos_cadastro()


@when("o usuario adiciona 3 produtos ao carrinho")
def adiciona_produtos_outline(home_page):
    home_page.navegar_para_categoria()
    home_page.adicionar_3_produtos()


@when("o usuario acessa o carrinho")
def acessa_carrinho_outline(home_page):
    home_page.acessar_carrinho()


@when("o usuario inicia o checkout")
def inicia_checkout_outline(home_page):
    home_page.iniciar_checkout()


@then("o usuario visualiza a tela de checkout")
def valida_checkout_outline(home_page):
    home_page.validar_tela_checkout()
