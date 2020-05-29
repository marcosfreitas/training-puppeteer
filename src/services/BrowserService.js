require('events').defaultMaxListeners = 70;

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

class BrowserService {

    constructor () {
        this.browser = null;
    }

    async init() {
        this.browser = await puppeteer.launch({
            args: [
                '--no-sandbox'
            ]
        });
    }

    async getPage() {
        let g = await this.browser.newPage();
        return g;
    }

    async close() {
        await this.browser.close();
    }

    async takeScreenshot (url) {
        try {
            const page = await this.getPage();

            await page.goto(url);

            await page.screenshot({ path : 'prints/demo.png', fullPage: true });

        } catch(err) {
            console.log(err);
        }
    };
}

module.exports = BrowserService;