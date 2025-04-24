/**
 * Created by baf on 08.02.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.job';

	/**
	 * @ngdoc service
	 * @name logisticJobMaterialCatPriceValidationService
	 * @description provides validation methods for logistic job MaterialCatPrice entities
	 */
	angular.module(moduleName).service('logisticJobMaterialCatPriceValidationService', LogisticJobMaterialCatPriceValidationService);

	LogisticJobMaterialCatPriceValidationService.$inject = ['platformValidationServiceFactory','platformDataValidationService',
		'platformRuntimeDataService', 'logisticJobMaterialCatPriceDataService'];

	function LogisticJobMaterialCatPriceValidationService(platformValidationServiceFactory,platformDataValidationService,
		platformRuntimeDataService, logisticJobMaterialCatPriceDataService) {

		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface({
			typeName: 'LogisticMaterialCatalogPriceDto',
			moduleSubModule: 'Logistic.Job'
		}, {
			mandatory: ['MaterialCatalogFk', 'MaterialPriceListFk','MaterialPriceVersionFk']
		},
		self, logisticJobMaterialCatPriceDataService);

		self.validateAdditionalMaterialCatalogFk = function (entity) {
			if(entity.MaterialPriceListFk) {
				entity.MaterialPriceListFk = null;
				platformDataValidationService.validateMandatory(entity, null, 'MaterialPriceListFk', self, logisticJobMaterialCatPriceDataService);
				platformRuntimeDataService.applyValidationResult(false, entity, 'MaterialPriceListFk');
			}

			return true;
		};
	}
})(angular);
