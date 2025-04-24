/**
 * Created by baf on 07.02.2022
 */

(function (angular) {
	'use strict';
	var moduleName = 'object.main';

	/**
	 * @ngdoc service
	 * @name objectMainUnitInstallmentValidationService
	 * @description provides validation methods for object main unitInstallment entities
	 */
	angular.module(moduleName).service('objectMainUnitInstallmentValidationService', ObjectMainUnitInstallmentValidationService);

	ObjectMainUnitInstallmentValidationService.$inject = ['platformValidationServiceFactory', 'objectMainConstantValues', 'objectMainUnitInstallmentDataService'];

	function ObjectMainUnitInstallmentValidationService(platformValidationServiceFactory, objectMainConstantValues, objectMainUnitInstallmentDataService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(objectMainConstantValues.schemes.unitInstallment, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(objectMainConstantValues.schemes.unitInstallment)
		},
		self,
		objectMainUnitInstallmentDataService);
	}
})(angular);
