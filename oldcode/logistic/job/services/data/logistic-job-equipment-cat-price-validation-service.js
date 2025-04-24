/**
 * Created by baf on 08.02.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.job';

	/**
	 * @ngdoc service
	 * @name logisticJobEquipmentCatPriceValidationService
	 * @description provides validation methods for logistic job EquipmentCatPrice entities
	 */
	angular.module(moduleName).service('logisticJobEquipmentCatPriceValidationService', LogisticJobEquipmentCatPriceValidationService);

	LogisticJobEquipmentCatPriceValidationService.$inject = ['platformValidationServiceFactory','platformDataValidationService', 'logisticJobEquipmentCatPriceDataService'];

	function LogisticJobEquipmentCatPriceValidationService(platformValidationServiceFactory, platformDataValidationService, logisticJobEquipmentCatPriceDataService) {
		var self = this;

        platformValidationServiceFactory.addValidationServiceInterface({

                typeName: 'LogisticEquipmentCatalogPriceDto',
                moduleSubModule: 'Logistic.Job'
            },
            {
                mandatory: ['JobFk','EquipmentPriceListFk','EvaluationOrder','']
            },
            self,
            logisticJobEquipmentCatPriceDataService);

		self.validateEquipmentCatalogFk = function (entity, value) {
			return platformDataValidationService.validateMandatory(entity, value, 'EquipmentCatalogFk', self, logisticJobEquipmentCatPriceDataService);
		};
		self.validateEquipmentPriceListFk = function (entity, value) {
			return platformDataValidationService.validateMandatory(entity, value, 'EquipmentPriceListFk', self, logisticJobEquipmentCatPriceDataService);
		};
	}
})(angular);
