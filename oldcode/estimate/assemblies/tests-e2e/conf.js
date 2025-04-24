exports.config = {
  
  seleniumAddress: 'http://localhost:4444/wd/hub',

  specs: ['estimate-assemblies-module-spec.js'],

  multiCapabilities: [
	  {'browserName': 'chrome'}
//	  {'browserName': 'firefox'},
//	  {'browserName': 'internet explorer'}
  ],

	// eslint-disable-next-line strict
  onPrepare: function() {
	  'use strict';

	// fullscreen
	browser.driver.manage().window().maximize();
	// browserName
	browser.getCapabilities().then(function (caps) {
		browser.browserName = caps.get('browserName');
	});
  },

  allScriptsTimeout: 30000 // TODO: it's temporary set to 30 sec
};