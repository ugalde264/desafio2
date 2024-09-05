const { describe, it, beforeEach, afterEach } = require('mocha');
const expect = require('chai').expect;
const puppeteer = require('puppeteer');

describe('Pruebas de Amazon México - "Los más vendidos"', function() {
    this.timeout(60000); 

    let browser;
    let page;

    beforeEach(async () => {
        browser = await puppeteer.launch({ headless: false }); 
        page = await browser.newPage();
        await page.goto('http://www.amazon.com.mx');
        console.log('Navegador lanzado y página cargada');
    });

    afterEach(async () => {
        await browser.close();
        console.log('Navegador cerrado');
    });

    it('Debería acceder a "Los más vendidos" usando el texto del enlace', async () => {
       
        await page.waitForSelector('a[href*="bestsellers"]', { timeout: 30000 });
        console.log('Selector de enlace "Los más vendidos" encontrado');

        // Hacer clic en el enlace con el texto "Los más vendidos"
        await page.evaluate(() => {
            const link = Array.from(document.querySelectorAll('a')).find(el => el.textContent.includes('Los más vendidos'));
            if (link) link.click();
        });
        console.log('Clic en el enlace "Los más vendidos"');

        // Esperar a que el banner de "Los más vendidos" aparezca 
        await page.waitForSelector('#zg_banner_text', { timeout: 30000 });
        const title = await page.$eval('#zg_banner_text', el => el.textContent);
        console.log(`Título encontrado: ${title}`);
        expect(title).to.include('Los más vendidos');
    });

    it('Debería acceder a "Los más vendidos" usando un selector CSS ', async () => {
        await page.waitForSelector('a[href*="bestsellers"]', { timeout: 30000 });
        console.log('Selector CSS de enlace "Los más vendidos" encontrado');
        await page.click('a[href*="bestsellers"]');
        console.log('Clic en el enlace "Los más vendidos"');
        
        await page.waitForSelector('#zg_banner_text', { timeout: 30000 });
        const title = await page.$eval('#zg_banner_text', el => el.textContent);
        console.log(`Título encontrado: ${title}`);
        expect(title).to.include('Los más vendidos');
    });

    it('Debería acceder a "Los más vendidos" usando un XPath ', async () => {
        await page.waitForXPath('//a[contains(@href, "bestsellers")]', { timeout: 30000 });
        console.log('XPath de enlace "Los más vendidos" encontrado');
        const [link] = await page.$x('//a[contains(@href, "bestsellers")]');
        await link.click();
        console.log('Clic en el enlace "Los más vendidos" usando XPath');

        await page.waitForSelector('#zg_banner_text', { timeout: 30000 });
        const title = await page.$eval('#zg_banner_text', el => el.textContent);
        console.log(`Título encontrado: ${title}`);
        expect(title).to.include('Los más vendidos');
    });
});
