/**
 * $Id: basics-customize-boq-rounding-configuration-service.js 45945 2022-07-13 15:51:04Z joshi $
 * Copyright (c) RIB Software SE
 */
(function () {
	'use strict';
	const moduleName = 'basics.customize';

	/**
	 * @ngdoc service
	 * @name basicsCustomizeBoqRoundingConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides functionality to edit basic settings of boq rounding
	 */
	angular.module(moduleName).service('basicsCustomizeBoqRoundingConfigurationService', BasicsCustomizeBoqRoundingConfigurationService);

	BasicsCustomizeBoqRoundingConfigurationService.$inject = ['$injector'];

	function BasicsCustomizeBoqRoundingConfigurationService($injector) {
		this.showRoundingConfigurationDialog = function showRoundingConfigurationDialog(selectedItem) {
			let boqRoundingConfigTypeFk = null;
			let boqRoundingConfigFk = null;
			let lineItemContextFk = null;
			if(selectedItem) {
				boqRoundingConfigTypeFk = selectedItem.Id;
				boqRoundingConfigFk = selectedItem.BoqRoundingConfigFk;
				lineItemContextFk = selectedItem.LineItemContextFk;
			}

			// Check if there are modifications especially those from the instances, i.e. the boq type list and save them before opening the dialog to edit
			// the boq structure.
			let basicsCustomizeTypeDataService = $injector.get('basicsCustomizeTypeDataService');
			basicsCustomizeTypeDataService.update().then(function () {
				$injector.get('boqMainRoundingConfigDialogService').startByRoundingConfigFks(boqRoundingConfigTypeFk, boqRoundingConfigFk, lineItemContextFk, 'boqRoundingConfigType');
			});
		};
	}
})();
