Feature: Fluxo completo de compras

  Scenario: Fluxo de compras para Maria Silva
    Given o usuario "Maria Silva" acessa a pagina de cadastro
    When o usuario preenche o formulario de cadastro
    Then o usuario visualiza a confirmacao de cadastro
    When o usuario adiciona 3 produtos ao carrinho
    And o usuario acessa o carrinho
    And o usuario inicia o checkout
    Then o usuario visualiza a tela de checkout

  Scenario: Fluxo de compras para Ana Santos
    Given o usuario "Ana Santos" acessa a pagina de cadastro
    When o usuario preenche o formulario de cadastro
    Then o usuario visualiza a confirmacao de cadastro
    When o usuario adiciona 3 produtos ao carrinho
    And o usuario acessa o carrinho
    And o usuario inicia o checkout
    Then o usuario visualiza a tela de checkout

  Scenario: Fluxo de compras para Julia Oliveira
    Given o usuario "Julia Oliveira" acessa a pagina de cadastro
    When o usuario preenche o formulario de cadastro
    Then o usuario visualiza a confirmacao de cadastro
    When o usuario adiciona 3 produtos ao carrinho
    And o usuario acessa o carrinho
    And o usuario inicia o checkout
    Then o usuario visualiza a tela de checkout
