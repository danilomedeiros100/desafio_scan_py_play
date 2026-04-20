@ui @allure.label.parentSuite:UI @allure.label.epic:UI @allure.label.feature:Produtos
Feature: Produtos
  Como usuário logado
  Quero visualizar e interagir com os produtos
  Para escolher o que desejo comprar

  Background:
    Given que estou logado no sistema

  @sanity @smoke @allure.label.severity:critical @allure.label.story:Listagem_de_produtos
  Scenario: Visualizar lista de produtos após login
    Then devo ver a lista de produtos
    And a quantidade de produtos deve ser maior que zero

  @sanity @allure.label.severity:normal @allure.label.story:Titulo_do_inventario
  Scenario: Título da página de inventário está correto
    Then o título da página de inventário deve ser "Products"

  @critical @allure.label.severity:critical @allure.label.story:Adicionar_ao_carrinho
  Scenario: Adicionar produto ao carrinho
    When adiciono o primeiro produto ao carrinho
    Then o contador do carrinho deve exibir "1"

  @regression @allure.label.severity:trivial @allure.label.story:Falha_intencional
  Scenario: Falha intencional - demonstração de screenshot e vídeo em falha
    Then o título da página de inventário deve ser "TITULO ERRADO INTENCIONAL"
