/**
 * Created by Shankar on 22.09.2022
 */

(function (angular) {
	/* global globals */
	'use strict';
	let moduleName = 'logistic.plantsupplier';

	/**
	 * @ngdoc service
	 * @name logisticPlantSupplierValidationService
	 * @description provides validation methods for plant supplierentities
	 */
	angular.module(moduleName).service('logisticPlantSupplierValidationService', LogisticPlantSupplierValidationService);

	LogisticPlantSupplierValidationService.$inject = ['_', 'platformValidationServiceFactory', 'logisticPlantSupplierConstantValues', 'logisticPlantSupplierDataService', 'basicsCompanyNumberGenerationInfoService', 'platformRuntimeDataService', 'platformDataValidationService'];

	function LogisticPlantSupplierValidationService(_, platformValidationServiceFactory, logisticPlantSupplierConstantValues, logisticPlantSupplierDataService, basicsCompanyNumberGenerationInfoService, platformRuntimeDataService, platformDataValidationService) {
		let self = this;

		platformValidationServiceFactory.addValidationServiceInterface(logisticPlantSupplierConstantValues.schemes.plantSupplier, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(logisticPlantSupplierConstantValues.schemes.plantSupplier)
		},
		self,
		logisticPlantSupplierDataService);


		self.validateRubricCategoryFk = function (entity, value, model) {
			if(entity.RubricCategoryFk !== value || entity.Version === 0) {
				const infoService =  basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('logisticPlantSupplierNumberInfoService',value);
				if (infoService.hasToGenerateForRubricCategory(value)) {
					platformRuntimeDataService.readonly(entity, [{field: 'Code', readonly: true}]);
					entity.Code = infoService.provideNumberDefaultText(value, entity.Code);
				} else {
					entity.Code = '';
					platformRuntimeDataService.readonly(entity, [{field: 'Code', readonly: false}]);
				}
				platformDataValidationService.validateMandatory(entity, entity.Code, 'Code', self, logisticPlantSupplierDataService);
				// TODO
				entity.__rt$data.errors = null;
				return platformDataValidationService.finishValidation(!_.isNil(entity.RubricCategoryFk), entity, value, model, self, logisticPlantSupplierDataService);
			}
			return true;
		};

	}
})(angular);
