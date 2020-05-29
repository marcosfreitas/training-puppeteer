class SearchService {
    constructor (BrowserService, __BASE_URL__) {
        this.BrowserService = BrowserService;
        this.__BASE_URL__ = __BASE_URL__;
        this.dataMapping = [];
    }

    async doSearch() {
        try {

            const page = await this.BrowserService.getPage();

            await page.goto(this.__BASE_URL__ + '/busca', {
                waitUntil: 'load',
                timeout: 0
            });

            await page.type('input#search-box', 'os simpsons');

            await Promise.all(
                [
                    page.waitForNavigation(),
                    page.keyboard.press('Enter')
                ]
            );

            await this.doScrap(page);

            for (let i = 0; i < this.dataMapping.length; i++) {
                this.dataMapping[i] = await this.getDetailed(this.dataMapping[i]);
            }

        } catch (err) {
            console.debug(err);
        }
    };

    async doScrap (page) {
        try {

            let data = await page.evaluate(() => {

                let subtitles = document.querySelectorAll('.list_element > article > div');
                let data = [];
                subtitles.forEach(subtitle => {


                    let link = subtitle.querySelector('.f_left > p:not(.data) > a');

                    let metadata = subtitle.querySelector('.f_left > p.data');

                    let user = metadata.querySelector('a').text;

                    metadata = metadata.innerText.split(',');

                    let downloads = metadata[0];
                    downloads = downloads.split(' ')[0];

                    let points = metadata[1];
                    points = downloads.split(' ')[1];

                    let submission_date = metadata[2].trim();
                    submission_date = submission_date.split(' ')[4];
                    submission_date = submission_date.split('/');
                    submission_date = (new Date(submission_date[2] +'-'+ submission_date[1] + '-' + submission_date[0])).toJSON();

                    let language = subtitle.querySelector('img').getAttribute('title');

                    let download_url_parts = link.getAttribute('href').split('/');

                    let map = {
                        page_url: 'http://legendas.tv' + link.getAttribute('href'),
                        download_url: 'http://legendas.tv/downloadarquivo/' + download_url_parts[2],
                        name: link.text,
                        downloads: parseInt(downloads),
                        user: user,
                        submission_date: submission_date,
                        language
                    };

                    data.push(map);
                });

                return data;
            });

            // add scrapped data per page
            this.dataMapping.push(data);

        } catch (err) {
            console.debug(err);
        }
    }

    /**
     * @deprecated do not is necessary anymore
     * @param {*} page
     */
    async hideModal (page) {

        try {

            await page.evaluate( () => {
                document.getElementById('help-box-close').outerHTML = "";
            });

            //const c = await page.$eval('#help-box-close', el => console.log(el));

            await page.setCookie({
                name: 'popup-mensagem',
                url: 'http://legendas.tv',
                domain: 'legendas.tv',
                value: 'yes',
                httpOnly: false,
                secure: false
            });

            await page.setCookie({
                name: 'popup-likebox',
                url: 'http://legendas.tv',
                domain: 'legendas.tv',
                value: 'yes',
                httpOnly: false,
                secure: false
            });

        } catch (err) {
            console.debug(err);
        }

    };

    /**
     * @deprecated
     */
    async getDetailed (arr) {
        try {

            const page = await this.BrowserService.getPage();

            const detailed = arr.map(
                async function (item, index) {

                    await page.waitForNavigation();
                    await page.goto(item['url'], {
                        waitUntil: 'load',
                        timeout: 0
                    }).catch(e => { console.debug(e); });
                    await page.waitFor(600);

                    //await page.waitForSelector('.middle.download section.qualificacoes');

                    let data = await page.evaluate(() => {
                        // Link de download direto (string)
                        let like_ratio_up = (document.querySelector('.middle.download > section.first + section > aside:nth-child(4) > p').textContent);
                        let like_ratio_down = (document.querySelector('.middle.download > section.first + section > aside:nth-child(4) > p:last-of-type').textContent);
                        let like_ratio = (like_ratio_up/like_ratio_down).toFixed(2);

                        return {'like_ratio' : like_ratio};

                    });

                    item['like_ratio'] = data.like_ratio;

                    return item;

                }
            );

            const resolved = await Promise.all(detailed);

            return arr;

        } catch (err) {
            console.log('err',err);
        }
    }
}

module.exports = SearchService;