/**
 * Created by janas on 07.12.2017.
 */

(function () {
	'use strict';

	var sidebar = require('rib-itwo40-e2e').pageObjects.sideBar;

	var wizardGuid = '23C8C9E88945448F9FC660683C34019A';

	var getChangeControllingUnitStatus = function getChangeControllingUnitStatus() {
		return element(by.css('.' + wizardGuid));
	};

	var openChangeControllingUnitStatusWizard = function openChangeControllingUnitStatusWizard() {
		sidebar.getWizard().click();

		getChangeControllingUnitStatus().click();
	};

	module.exports = {
		openChangeControllingUnitStatusWizard: openChangeControllingUnitStatusWizard,
		getChangeControllingUnitStatus: getChangeControllingUnitStatus
	};
})();