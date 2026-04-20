Feature: Fluxo completo de compras

  Scenario Outline: Fluxo completo para <nome> <sobrenome>
    Given o usuario acessa a pagina de cadastro
    When o usuario preenche o formulario de cadastro
    Then o usuario visualiza a confirmacao de cadastro
    When o usuario adiciona 3 produtos ao carrinho
    And o usuario acessa o carrinho
    And o usuario inicia o checkout
    Then o usuario visualiza a tela de checkout

    Examples:
      | nome  | sobrenome | telefone   | endereco          | cidade   | estado   | cep   |
      | Maria | Silva     | 2125551234 | 123 Fifth Avenue  | New York | New York | 10001 |
      | Ana   | Santos    | 3125551234 | 456 Michigan Ave  | Chicago  | Illinois | 60601 |
      | Julia | Oliveira  | 7135551234 | 789 Main Street   | Houston  | Texas    | 77001 |
