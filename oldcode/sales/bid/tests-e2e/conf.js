(() => {
	'use strict';

	exports.config = {
		seleniumAddress: 'http://localhost:4444/wd/hub',
		specs: ['sales-bid-module-spec.js'],
		multiCapabilities: [
			{'browserName': 'chrome'}
			//	  {'browserName': 'firefox'},
			//	  {'browserName': 'internet explorer'}
		],
		onPrepare: () => {
			// fullscreen
			browser.driver.manage().window().maximize();
			// browserName
			browser.getCapabilities().then((caps) => {
				browser.browserName = caps.get('browserName');
			});
		},
		allScriptsTimeout: 30000 // TODO: it's temporary set to 30 sec
	};
})();
