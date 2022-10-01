require('dotenv').config();
const puppeteer = require('puppeteer');
const fs = require('fs');
const schedule = require('node-schedule');

const rule = new schedule.RecurrenceRule();
rule.hour = 21;
rule.minute = 52;

const job = schedule.scheduleJob(rule, async function () {
	(async () => {
		console.log('Launching browser...');

		const browser = await puppeteer.launch({ headless: false });
		let page = await browser.newPage();

		await page.goto('https://www.instagram.com/');

		console.log('Opening Instagram...');

		console.log('Accepting Cookies (boriiiing)...');

		const accept_cookies_btn = await page.$('button.aOOlW.HoLwm');

		await accept_cookies_btn.click();

		console.log('Cookies accepeted!');

		// Sleep for 2 seconds -> wait for the page to finish loading
		console.log('Waiting for the page to finish loading...');
		await sleep();

		console.log('Searching for the username and password input...');

		const username_input = await page.$(
			'#loginForm input[name="username"]'
		);
		const password_input = await page.$(
			'#loginForm input[name="password"]'
		);

		console.log('Logging in...');

		await username_input.type(process.env.IG_USR);
		await password_input.type(process.env.IG_PWD);

		const login_btn = await page.$('#loginForm button[type="submit"]');
		login_btn.click();

		await page.waitForSelector(
			'div._ab8j._ab8s._ab8w._ab94._ab99._ab9f._ab9m._ab9p._ac8g._abcm'
		);

		const save_info_btn = await page.$(
			'div._ab8j._ab8s._ab8w._ab94._ab99._ab9f._ab9m._ab9p._ac8g._abcm div._ac8f > button'
		);
		save_info_btn.click();

		await page.waitForSelector('button._a9--._a9_1');

		console.log('Logged in!');

		//Disable notification
		const notification_btn = await page.$('button._a9--._a9_1');
		notification_btn.click();

		await sleep();

		const upload_preview_btn = await page.$(
			"._acub > button._abl-._abm2[type='button'] > ._abm0"
		);
		await upload_preview_btn.click();

		const upload_file_btn = await page.$(
			'div._ab8w._ab94._ab99._ab9f._ab9m._ab9p._ab9x._aba7._abcm > button._acan._acap._acas'
		);

		const [fileChooser] = await Promise.all([
			page.waitForFileChooser(),
			upload_file_btn.click(),
		]);

		console.log('Uploading file...');

		await fileChooser.accept(['janga.jpg']);

		await sleep(3000);

		for (let i = 0; i < 2; i++) {
			const next_btn = await page.$(
				'div[role="dialog"] button._acan._acao._acas'
			);

			await next_btn.click();
			await sleep(1000);
		}

		const caption = await page.$('div[role="dialog"] textarea._ablz._aaeg');

		const data = fs.readFileSync('time.txt', { encoding: 'utf8' });

		const str = `Day ${parseInt(data) + 1} of 365`;

		await caption.type(str);

		console.log('Sharing post...');

		const share_btn = await page.$(
			'div[role="dialog"] button._acan._acao._acas'
		);

		await share_btn.click();

		await sleep(10000);

		fs.writeFileSync('time.txt', `${parseInt(data) + 1}`);

		console.log('All done!');

		await browser.close();
	})();
});

async function sleep(ms = 2000) {
	return await new Promise((resolve) => setTimeout(resolve, ms));
}
