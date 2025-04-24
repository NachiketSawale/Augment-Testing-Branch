/**
 * Created by leo on 15.02.2021
 */

(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.timesymbols';

	/**
	 * @ngdoc service
	 * @name timekeepingTimeSymbols2GroupValidationService
	 * @description provides validation methods for timekeeping time symbol account entities
	 */
	angular.module(moduleName).service('timekeepingTimeSymbols2GroupValidationService', TimekeepingTimeSymbols2GroupValidationService);

	TimekeepingTimeSymbols2GroupValidationService.$inject = ['_', '$http', '$q', '$injector', 'platformValidationServiceFactory', 'platformDataValidationService', 'platformRuntimeDataService',
		'timekeepingTimeSymbols2GroupDataService', 'timekeepingTimeSymbolsConstantValues'];

	function TimekeepingTimeSymbols2GroupValidationService(_, $http, $q, $injector, platformValidationServiceFactory, platformDataValidationService, platformRuntimeDataService, timekeepingTimeSymbols2GroupDataService, timekeepingTimeSymbolsConstantValues) {
		let self = this;
		platformValidationServiceFactory.addValidationServiceInterface(timekeepingTimeSymbolsConstantValues.schemes.timeSymbol2Group, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(timekeepingTimeSymbolsConstantValues.schemes.timeSymbol2Group)
		},
		self,
		timekeepingTimeSymbols2GroupDataService);
	}

})(angular);
