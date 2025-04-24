/**
 * Created by baf on 14.06.2022
 */
(function () {
	'use strict';
	var moduleName = 'basics.customize';

	/**
	 * @ngdoc service
	 * @name basicsCustomizeAllowanceConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides functionality to edit basic settings of estimate allowances
	 */
	angular.module(moduleName).service('basicsCustomizeAllowanceConfigurationService', BasicsCustomizeAllowanceConfigurationService);

	BasicsCustomizeAllowanceConfigurationService.$inject = ['$injector'];

	function BasicsCustomizeAllowanceConfigurationService($injector) {
		this.editAllowanceConfiguration = function editAllowanceConfiguration(allowance) {

			$injector.get('estimateAllowanceDialogDataService').showDialog(allowance);
		};
	}
})();
