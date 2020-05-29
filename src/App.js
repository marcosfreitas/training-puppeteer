const BrowserService = require('./services/BrowserService');
const SearchService = require('./services/SearchService');
const LoginService = require('./services/LoginService');

class App {

    constructor () {

        this.configEnvVars();

        this.BrowserService = new BrowserService();
        this.SearchService = new SearchService(this.BrowserService, this.__BASE_URL__);
        this.LoginService = new LoginService(this.BrowserService, this.__BASE_URL__, this.__USER_LOGIN__, this.__USER_PWD__);
    }

    configEnvVars() {
        const dotenv = require('dotenv');
        dotenv.config();
        this.__BASE_URL__ = process.env.BASE_URL;
        this.__USER_LOGIN__ = process.env.USER_LOGIN;
        this.__USER_PWD__ = process.env.USER_PWD;
    }

    async init () {
        try {

            await this.BrowserService.init();
            await this.LoginService.doLogin();
            await this.SearchService.doSearch();
            await this.BrowserService.close();

            console.log(this.SearchService.dataMapping);
            console.debug('Foram encontradas ' + this.SearchService.dataMapping[0].length +' legendas na primeira página');

        } catch (err) { console.debug(err) }

    }
}

module.exports = App;