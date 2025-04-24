(function (angular) {
	'use strict';
	/* global globals */

	/**
	 * @ngdoc service
	 * @name resourceRequisitionValidationService
	 * @description provides validation methods for requisition
	 */
	var moduleName='resource.requisition';
	angular.module(moduleName).service('resourceRequisitionValidationService', ResourceRequisitionValidationService);

	ResourceRequisitionValidationService.$inject = [
		'$q', '_', 'resourceRequisitionValidationServiceFactory', 'resourceRequisitionDataService','platformValidationServiceFactory',
		'platformDataValidationService', 'platformRuntimeDataService','basicsCompanyNumberGenerationInfoService'
	];

	function ResourceRequisitionValidationService(
		$q, _, resourceRequisitionValidationServiceFactory, resourceRequisitionDataService,platformValidationServiceFactory,
		platformDataValidationService, platformRuntimeDataService, basicsCompanyNumberGenerationInfoService
	) {
		resourceRequisitionValidationServiceFactory.createRequisitionValidationService(this, resourceRequisitionDataService);

		var self = this;
		platformValidationServiceFactory.addValidationServiceInterface({

			typeName: 'RequisitionDto',
			moduleSubModule: 'Resource.Requisition'
		},
		{
			mandatory: ['RequisitionTypeFk']
		},
		self,
			resourceRequisitionDataService);


		self.asyncValidateCode = function asyncValidateCode(entity, value, model) {
			if(entity.Code !== value || entity.Version === 0) {
				if(entity.HasToGenerateCode) {
					return platformDataValidationService.finishAsyncValidation(true, entity, value, model, null, self, resourceRequisitionDataService);
				}
				return platformDataValidationService.isAsyncUnique(globals.webApiBaseUrl + 'resource/requisition/IsCodeUnique', entity, value, model).then(function (response) {
					// response.apply = response;
					return platformDataValidationService.finishAsyncValidation(response, entity, value, model, null, self, resourceRequisitionDataService);

				});
			}
			return platformDataValidationService.finishAsyncValidation(true, entity, value, model, null, self, resourceRequisitionDataService);
		};

		self.validateRubricCategoryFk = function validateRubricCategoryFk(entity, value, model) {
			if(entity.RubricCategoryFk !== value || entity.Version === 0){
				var infoService = basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('resourceRequsitionNumberInfoService', 98);

				if (infoService.hasToGenerateForRubricCategory(value)) {
					platformRuntimeDataService.readonly(entity, [{ field: 'Code', readonly: true }]);
					entity.Code = infoService.provideNumberDefaultText(value, entity.Code);
					entity.HasToGenerateCode = true;
				} else {
					entity.HasToGenerateCode = false;
					entity.Code = '';

					platformRuntimeDataService.readonly(entity, [{ field: 'Code', readonly: false }]);
				}
				platformDataValidationService.validateMandatory(entity, entity.Code, 'Code', self, resourceRequisitionDataService);
			}
			return platformDataValidationService.validateMandatory(entity, value, model, self, resourceRequisitionDataService);
		};
	}
})(angular);
