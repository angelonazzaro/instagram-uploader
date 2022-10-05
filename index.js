require('dotenv').config();
const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {

	const last_run_time = fs.readFileSync(process.env.TIME_FILE, { encoding: 'utf8' });

	let current_date = new Date();
	const current_date_str = `${current_date.getDay()}/${current_date.getMonth()}/${current_date.getFullYear()}`;

	if (last_run_time === current_date_str) return;
	
	console.log('Launching browser...');

	const browser = await puppeteer.launch({ headless: true });
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

	const username_input = await page.$('#loginForm input[name="username"]');
	const password_input = await page.$('#loginForm input[name="password"]');

	console.log('Logging in...');

	await username_input.type(process.env.IG_USR);
	await password_input.type(process.env.IG_PWD);

	const login_btn = await page.$('#loginForm button[type="submit"]');
	login_btn.click();

	await page
		.waitForSelector(
			'div._ab8j._ab8s._ab8w._ab94._ab99._ab9f._ab9m._ab9p._ac8g._abcm'
		)
		.catch((err) => {
			console.error('Selector could not be found: Save Information Page');
		});

	const save_info_btn = await page
		.$(
			'div._ab8j._ab8s._ab8w._ab94._ab99._ab9f._ab9m._ab9p._ac8g._abcm div._ac8f > button'
		)
		.catch((err) => {
			console.error(
				'Selector could not be found: Save Information Button'
			);
		});

	if (save_info_btn != null) save_info_btn.click();

	await page.waitForSelector('button._a9--._a9_1').catch((err) => {
		console.error('Selector could not be found: Notification Page');
	});

	console.log('Logged in!');

	//Disable notification
	const notification_btn = await page.$('button._a9--._a9_1').catch((err) => {
		console.error('Selector could not be found: Notification Button');
	});

	if (notification_btn != null) notification_btn.click();

	await page.waitForSelector(
		"._acub > button._abl-._abm2[type='button'] > ._abm0"
	);

	const upload_preview_btn = await page.$(
		"._acub > button._abl-._abm2[type='button'] > ._abm0"
	);

	await upload_preview_btn.click();

	await page.waitForSelector(
		'div[role="dialog"] button._acan._acap._acas'
	);

	const upload_file_btn = await page.$(
		'div[role="dialog"] button._acan._acap._acas'
	);

	const [fileChooser] = await Promise.all([
		page.waitForFileChooser(),
		upload_file_btn.click(),
	]);

	console.log('Uploading file...');

	await fileChooser.accept([process.env.PHOTO_PATH]);

	await sleep(5000);

	for (let i = 0; i < 2; i++) {
		const next_btn = await page.$(
			'div[role="dialog"] button._acan._acao._acas'
		);

		await next_btn.click();
		await sleep(1000);
	}

	await page.waitForSelector('div[role="dialog"] textarea._ablz._aaeg');

	const caption = await page.$('div[role="dialog"] textarea._ablz._aaeg');

	const data = fs.readFileSync(process.env.DAYS_FILE, { encoding: 'utf8' });

	const str = `Day ${parseInt(data) + 1} of 365`;

	await caption.type(str);

	console.log('Sharing post...');

	const share_btn = await page.$(
		'div[role="dialog"] button._acan._acao._acas'
	);

	await share_btn.click();

	await sleep(10000);

	fs.writeFileSync(process.env.DAYS_FILE, `${parseInt(data) + 1}`);
	current_date = new Date();
	fs.writeFileSync(process.env.TIME_FILE, `${current_date.getDay()}/${current_date.getMonth()}/${current_date.getFullYear()}`);

	console.log('All done!');

	await browser.close();
})();

async function sleep(ms = 2000) {
	return await new Promise((resolve) => setTimeout(resolve, ms));
}
