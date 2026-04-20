import re

from playwright.sync_api import expect, Page


class HomePage:
    URL = "https://automationteststore.com"
    CADASTRO_URL = "https://automationteststore.com/index.php?rt=account/create"
    CATEGORIA_URL = "https://automationteststore.com/index.php?rt=product/category&path=68"
    CARRINHO_URL = "https://automationteststore.com/index.php?rt=checkout/cart"

    def __init__(self, page: Page):
        self.page = page

        # ── Cadastro ──────────────────────────────────────────────────────────
        self.inp_first_name = page.locator("#AccountFrm_firstname")
        self.inp_last_name = page.locator("#AccountFrm_lastname")
        self.inp_email = page.locator("#AccountFrm_email")
        self.inp_telephone = page.locator("#AccountFrm_telephone")
        self.inp_address1 = page.locator("#AccountFrm_address_1")
        self.inp_city = page.locator("#AccountFrm_city")
        self.sel_country = page.locator("#AccountFrm_country_id")
        self.sel_state = page.locator("#AccountFrm_zone_id")
        self.inp_zip = page.locator("#AccountFrm_postcode")
        self.inp_login = page.locator("#AccountFrm_loginname")
        self.inp_password = page.locator("#AccountFrm_password")
        self.inp_confirm = page.locator("#AccountFrm_confirm")
        self.chk_privacy = page.locator("#AccountFrm_agree")
        self.btn_continue = page.get_by_role("button", name="Continue")
        self.heading_sucesso = page.get_by_role("heading", name="Your Account Has Been Created!")

        # ── Checkout ──────────────────────────────────────────────────────────
        self.btn_checkout = page.locator("#cart_checkout1")

    def open(self, url: str):
        self.page.goto(url)

    # ── Navegação ─────────────────────────────────────────────────────────────

    def acessar_cadastro(self):
        self.page.goto(self.CADASTRO_URL)

    def navegar_para_categoria(self):
        self.page.goto(self.CATEGORIA_URL)
        self.page.wait_for_load_state("domcontentloaded")

    def acessar_carrinho(self):
        self.page.goto(self.CARRINHO_URL)
        self.page.wait_for_load_state("domcontentloaded")

    # ── Cadastro ──────────────────────────────────────────────────────────────

    def preencher_dados_pessoais(self, nome, sobrenome, email, telefone):
        self.inp_first_name.fill(nome)
        self.inp_last_name.fill(sobrenome)
        self.inp_email.fill(email)
        self.inp_telephone.fill(telefone)

    def preencher_endereco(self, endereco, cidade, estado, cep):
        self.inp_address1.fill(endereco)
        self.inp_city.fill(cidade)
        self.sel_country.select_option(label="United States")
        # Aguarda o dropdown de estado ser populado após trocar país
        self.page.wait_for_function(
            "document.querySelector('#AccountFrm_zone_id').options.length > 1"
        )
        self.sel_state.select_option(label=estado)
        self.inp_zip.fill(str(cep))

    def preencher_dados_login(self, login, senha):
        self.inp_login.fill(login)
        self.inp_password.fill(senha)
        self.inp_confirm.fill(senha)

    def confirmar_cadastro(self):
        self.chk_privacy.check()
        self.btn_continue.click()

    def validar_confirmacao_cadastro(self):
        expect(self.heading_sucesso).to_be_visible(timeout=15000)

    def continuar_apos_cadastro(self):
        self.page.get_by_role("link", name="Continue").click()

    # ── Produtos ──────────────────────────────────────────────────────────────

    def _adicionar_produto(self, indice: int):
        self.page.locator("a[title='Add to Cart']").nth(indice).click()
        self.page.wait_for_load_state("domcontentloaded")
        if "product/product" in self.page.url:
            self.page.locator("button:has-text('Add to Cart'), a:has-text('Add to Cart')").first.click()
            self.page.wait_for_timeout(800)
        self.page.goto(self.CATEGORIA_URL)
        self.page.wait_for_load_state("domcontentloaded")

    def adicionar_3_produtos(self):
        for i in range(3):
            self._adicionar_produto(i)

    # ── Checkout ──────────────────────────────────────────────────────────────

    def iniciar_checkout(self):
        self.btn_checkout.click()
        self.page.wait_for_load_state("domcontentloaded")

    def validar_tela_checkout(self):
        expect(self.page).to_have_url(re.compile(r"checkout"), timeout=15000)
