@ui @allure.label.parentSuite:UI @allure.label.epic:UI @allure.label.feature:Ordenacao
Feature: Ordenação de produtos
  Como usuário logado
  Quero ordenar os produtos por diferentes critérios
  Para encontrar mais facilmente o que procuro

  Background:
    Given que estou logado no sistema

  @critical @allure.label.severity:normal @allure.label.story:Dropdown_visivel
  Scenario: Dropdown de ordenação está disponível
    Then o dropdown de ordenação deve estar visível

  @regression @allure.label.severity:minor @allure.label.story:Ordenacao_padrao
  Scenario: Ordenação padrão é por nome A-Z
    Then a opção de ordenação padrão deve ser "Name (A to Z)"
