(function () {
	'use strict';
	var moduleName = 'basics.customize';

	/**
	 * @ngdoc service
	 * @name BasicsCustomizeEstimateParameterConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides functionality to edit basic settings of estimate parameter
	 */
	angular.module(moduleName).service('basicsCustomizeEstimateParameterConfigurationService', BasicsCustomizeEstimateParameterConfigurationService);

	BasicsCustomizeEstimateParameterConfigurationService.$inject = ['$injector'];

	function BasicsCustomizeEstimateParameterConfigurationService($injector) {
		this.editEstimateParameterConfiguration = function editEstimateParameterConfiguration(paramaterConfig) {
			$injector.get('estimateParameterDialogDataService').showDialog(paramaterConfig);
		};
	}
})();
