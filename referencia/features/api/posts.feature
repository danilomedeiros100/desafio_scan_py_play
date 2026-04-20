@api @allure.label.parentSuite:API @allure.label.epic:API @allure.label.feature:Posts
Feature: API de Posts
  Como consumidor da API
  Quero gerenciar posts
  Para validar o contrato do endpoint /posts

  @sanity @allure.label.severity:critical @allure.label.story:Listar_posts
  Scenario: Listar posts retorna status 200 com dados válidos
    When faço uma requisição GET para "/posts"
    Then o status da resposta deve ser 200
    And o corpo deve conter uma lista não vazia de posts

  @sanity @allure.label.severity:critical @allure.label.story:Buscar_post_por_id
  Scenario: Buscar post por ID retorna dados completos
    When faço uma requisição GET para "/posts/1"
    Then o status da resposta deve ser 200
    And o post retornado deve ter id 1 com campos obrigatórios preenchidos

  @critical @allure.label.severity:critical @allure.label.story:Criar_post
  Scenario: Criar post retorna status 201 com id gerado
    When crio um post com título "Automação BDD" e corpo "Teste via playwright-bdd"
    Then o status da resposta deve ser 201
    And o post criado deve conter o título "Automação BDD"

  @regression @allure.label.severity:minor @allure.label.story:Comentarios_do_post
  Scenario: Buscar comentários de um post retorna emails válidos
    When faço uma requisição GET para "/comments?postId=1"
    Then o status da resposta deve ser 200
    And todos os comentários devem pertencer ao postId 1 e ter email válido

  @regression @allure.label.severity:minor @allure.label.story:Post_inexistente
  Scenario: Post inexistente retorna 404
    When faço uma requisição GET para "/posts/99999"
    Then o status da resposta deve ser 404
