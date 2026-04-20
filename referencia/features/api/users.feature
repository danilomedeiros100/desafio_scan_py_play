@api @allure.label.parentSuite:API @allure.label.epic:API @allure.label.feature:Usuarios
Feature: API de Usuários
  Como consumidor da API
  Quero consultar dados de usuários
  Para validar o contrato do endpoint /users

  @sanity @allure.label.severity:critical @allure.label.story:Listar_usuarios
  Scenario: Listar usuários retorna status 200 com dados válidos
    When faço uma requisição GET para "/users"
    Then o status da resposta deve ser 200
    And o corpo deve conter uma lista não vazia de usuários

  @sanity @allure.label.severity:critical @allure.label.story:Buscar_usuario_por_id
  Scenario: Buscar usuário por ID retorna dados completos
    When faço uma requisição GET para "/users/2"
    Then o status da resposta deve ser 200
    And o usuário retornado deve ter id 2 com campos obrigatórios preenchidos

  @regression @allure.label.severity:minor @allure.label.story:Usuario_inexistente
  Scenario: Usuário inexistente retorna 404
    When faço uma requisição GET para "/users/9999"
    Then o status da resposta deve ser 404
