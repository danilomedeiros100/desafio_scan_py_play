@ui @allure.label.parentSuite:UI @allure.label.epic:UI @allure.label.feature:Sobre
Feature: Sobre
  Como usuário logado
  Quero acessar o link Sobre no menu
  Para abrir a página institucional da Sauce Labs

  Background:
    Given que estou logado no sistema

  @critical @allure.label.severity:normal @allure.label.story:Link_Sobre_visivel
  Scenario: Link Sobre está disponível no menu lateral
    When abro o menu lateral
    Then devo ver o link Sobre

  @regression @allure.label.severity:minor @allure.label.story:Abrir_Sobre_Sauce_Labs
  Scenario: Abrir Sobre navega para o site da Sauce Labs
    When abro o link Sobre no menu lateral
    Then devo acessar uma página com URL contendo "saucelabs"
