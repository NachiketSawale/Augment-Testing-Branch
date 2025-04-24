/**
 * Created by baf on 14.06.2022
 */
(function () {
	'use strict';
	var moduleName = 'basics.customize';

	/**
	 * @ngdoc service
	 * @name basicsCustomizeEstimateAllowanceConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides functionality to edit basic settings of estimate allowances
	 */
	angular.module(moduleName).service('basicsCustomizeEstimateAllowanceConfigurationService', BasicsCustomizeEstimateAllowanceConfigurationService);

	BasicsCustomizeEstimateAllowanceConfigurationService.$inject = ['$injector'];

	function BasicsCustomizeEstimateAllowanceConfigurationService($injector) {
		this.editAllowanceConfiguration = function editAllowanceConfiguration(allowanceConfig) {
			$injector.get('estimateAllowanceConfigTypeDialogDataService').showDialog(allowanceConfig);
		};
	}
})();
