class LoginService {
    constructor (BrowserService, __BASE_URL__, __USER_LOGIN__, __USER_PWD__) {
        this.BrowserService = BrowserService;
        this.__BASE_URL__ = __BASE_URL__;
        this.__USER_LOGIN__ = __USER_LOGIN__;
        this.__USER_PWD__ = __USER_PWD__;
    }

    async doLogin() {

        try {

            const page = await this.BrowserService.getPage();

            await page.goto(this.__BASE_URL__ + '/login');

            await page.type('input#UserUsername', this.__USER_LOGIN__, { delay: 100});
            await page.type('input#UserPassword', this.__USER_PWD__, { delay: 100});

            await Promise.all(
                [
                    page.waitForNavigation(),
                    page.keyboard.press('Enter')
                ]
            );

        } catch (err) {
            console.debug(err);
        }

    }
}

module.exports = LoginService;