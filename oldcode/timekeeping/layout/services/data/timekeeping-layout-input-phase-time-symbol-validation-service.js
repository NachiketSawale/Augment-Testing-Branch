/**
 * Created by baf on 19.06.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.layout';

	/**
	 * @ngdoc service
	 * @name timekeepingLayoutInputPhaseTimeSymbolValidationService
	 * @description provides validation methods for timekeeping layout inputPhaseTimeSymbol entities
	 */
	angular.module(moduleName).service('timekeepingLayoutInputPhaseTimeSymbolValidationService', TimekeepingLayoutInputPhaseTimeSymbolValidationService);

	TimekeepingLayoutInputPhaseTimeSymbolValidationService.$inject = ['platformValidationServiceFactory', 'timekeepingLayoutConstantValues', 'timekeepingLayoutInputPhaseTimeSymbolDataService'];

	function TimekeepingLayoutInputPhaseTimeSymbolValidationService(platformValidationServiceFactory, timekeepingLayoutConstantValues, timekeepingLayoutInputPhaseTimeSymbolDataService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(timekeepingLayoutConstantValues.schemes.inputPhaseTimeSymbol, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(timekeepingLayoutConstantValues.schemes.inputPhaseTimeSymbol)
		},
		self,
		timekeepingLayoutInputPhaseTimeSymbolDataService);
	}
})(angular);
