/**
 * $Id$
 * Copyright (c) RIB Software SE
 */
(function () {
	'use strict';
	const moduleName = 'basics.customize';

	/**
	 * @ngdoc service
	 * @name basicsCustomizeEstimateRoundingConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides functionality to edit basic settings of estimate rounding
	 */
	angular.module(moduleName).service('basicsCustomizeEstimateRoundingConfigurationService', BasicsCustomizeEstimateRoundingConfigurationService);

	BasicsCustomizeEstimateRoundingConfigurationService.$inject = ['$injector'];

	function BasicsCustomizeEstimateRoundingConfigurationService($injector) {
		this.showRoundingConfigurationDialog = function showRoundingConfigurationDialog(selectedItem) {
			let dialogConfig = {};
			if(selectedItem){
				dialogConfig = {
					editType: 'customizeforroundingconfig',
					estRoundingConfigTypeFk: selectedItem.Id,
					estRoundingConfigFk: selectedItem.EstimateRoundingConfigFk,
					lineItemcontextFk: selectedItem.LineItemContextFk
				};
			}

			$injector.get('estimateMainDialogDataService').showDialog(dialogConfig);
		};
	}
})();
