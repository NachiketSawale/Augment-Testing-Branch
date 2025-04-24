/**
 * Created by janas on 07.12.2017.
 */

(function () {
	'use strict';

	var sidebar = require('rib-itwo40-e2e').pageObjects.sideBar;

	var wizardGuid = '891C076E2FA447A99FD3AE856300632B';

	var getCreateActivities = function getCreateActivities() {
		return element(by.css('.' + wizardGuid));
	};

	var openCreateActivitiesWizard = function openCreateActivitiesWizard() {
		sidebar.getWizard().click();

		getCreateActivities().click();
	};

	module.exports = {
		openCreateActivitiesWizard: openCreateActivitiesWizard,
		getCreateActivities: getCreateActivities
	};
})();