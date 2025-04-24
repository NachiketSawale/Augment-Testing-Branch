(function () {
	'use strict';
	const moduleName = 'basics.customize';

	/**
	 * @ngdoc service
	 * @name basicsCustomizeMaterialRoundingConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides functionality to edit basic settings of material rounding
	 */
	angular.module(moduleName).service('basicsCustomizeMaterialRoundingConfigurationService', BasicsCustomizeMaterialRoundingConfigurationService);

	BasicsCustomizeMaterialRoundingConfigurationService.$inject = ['$injector'];

	function BasicsCustomizeMaterialRoundingConfigurationService($injector) {
		this.showRoundingConfigurationDialog = function showRoundingConfigurationDialog(selectedItem) {
			let MaterialRoundingConfigTypeFk = null;
			let MaterialRoundingConfigFk = null;
			let ContextFk = null;
			if(selectedItem && selectedItem.ContextFk) {
				MaterialRoundingConfigTypeFk = selectedItem.Id;
				MaterialRoundingConfigFk = selectedItem.MaterialRoundingConfigFk;
				ContextFk = selectedItem.ContextFk;
			}

			let basicsCustomizeTypeDataService = $injector.get('basicsCustomizeTypeDataService');
			basicsCustomizeTypeDataService.update().then(function () {
				$injector.get('materialRoundingConfigDialogService').startByRoundingConfigFks(MaterialRoundingConfigTypeFk, MaterialRoundingConfigFk, ContextFk, 'MaterialRoundingConfigType');
			});
		};
	}
})();
