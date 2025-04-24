/**
 * Created by lcn on 3/5/2019.
 */
(function (angular) {
	'use strict';
	var moduleName = 'basics.currency';
	/* jshint -W072 */
	angular.module(moduleName).factory('basicsCurrencyWizardService',
		['basicsCommonImportDataService',
			'basicsCurrencyMainService',
			function (basicsCommonImportDataService, headerDataService) {
				var service = {};
				service.importCurrency = function () {
					basicsCommonImportDataService.execute(headerDataService, moduleName);
				};
				return service;
			}]);
})(angular);
