/**
 * Created by nit on 07.05.2018.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name timekeepingTimeSymbolsValidationService
	 * @description provides validation methods for Time Symbols
	 */
	const moduleName = 'timekeeping.timesymbols';
	angular.module(moduleName).service('timekeepingTimeSymbolsValidationService', TimekeepingTimeSymbolsValidationService);

	TimekeepingTimeSymbolsValidationService.$inject = ['$http', '$q','platformDataValidationService', 'timekeepingTimeSymbolsDataService', 'platformValidationServiceFactory'];

	function TimekeepingTimeSymbolsValidationService($http, $q,platformDataValidationService, timekeepingTimeSymbolsDataService, platformValidationServiceFactory) {
		let self = this;
		platformValidationServiceFactory.addValidationServiceInterface({
			typeName: 'TimeSymbolDto',
			moduleSubModule: 'Timekeeping.TimeSymbols'
		}, {
			mandatory: ['TimeSymbolGroupFk']
		},
		self,
		timekeepingTimeSymbolsDataService);

		self.validateCode = function (entity, value, model) {
			let itemList = timekeepingTimeSymbolsDataService.getList();
			return platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, itemList, self, timekeepingTimeSymbolsDataService);
		};
		self.asyncValidateCode=function asyncValidateCode(entity, value,model){

			return platformDataValidationService.isAsyncUnique(globals.webApiBaseUrl + 'timekeeping/timesymbols/isunique', entity, value, model).then(function (response) {
				if (!entity[model] && angular.isObject(response)) {
					response.apply = true;
				}
				return platformDataValidationService.finishAsyncValidation(response, entity, value, model, null, self, timekeepingTimeSymbolsDataService);
			});
		};
	}

})(angular);
