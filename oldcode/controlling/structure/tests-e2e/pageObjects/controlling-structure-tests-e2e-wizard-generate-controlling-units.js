/**
 * Created by janas on 07.12.2017.
 */

(function () {
	'use strict';

	var sidebar = require('rib-itwo40-e2e').pageObjects.sideBar;

	var wizardGuid = 'D876F8BAA9DC4D5BB17EC3B581C917C1';

	var getGenerateControllingUnits = function getGenerateControllingUnits() {
		return element(by.css('.' + wizardGuid));
	};

	var openGenerateControllingUnitsWizard = function openGenerateControllingUnitsWizard() {
		sidebar.getWizard().click();

		getGenerateControllingUnits().click();
	};

	var getTabs = function getTabs() {
		return {
			settings: element(by.css('.tabsWrapper')).element(by.css('li[heading="Settings"]')),
			custom: element(by.css('.tabsWrapper')).element(by.css('li[heading="Custom"]')),
			preview: element(by.css('.tabsWrapper')).element(by.css('li[heading="Preview"]'))
		};
	};

	var getButtons = function getButtons() {
		return {
			generate: element(by.binding('modalOptions.actionButtonText')),
			cancel: element(by.binding('modalOptions.closeButtonText'))
		};
	};

	module.exports = {
		openGenerateControllingUnitsWizard: openGenerateControllingUnitsWizard,
		getGenerateControllingUnits: getGenerateControllingUnits,
		getTabs: getTabs,
		getButtons: getButtons
	};
})();