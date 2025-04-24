/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const myModule = angular.module('model.annotation');
	const svcName = 'modelAnnotationValidationService';

	myModule.factory(svcName, modelAnnotationValidationService);

	modelAnnotationValidationService.$inject = ['platformDataValidationService',
		'modelAnnotationDataService', 'modelAnnotationTypes', '_', 'businessPartnerLogicalValidator'];

	function modelAnnotationValidationService(platformDataValidationService,
		modelAnnotationDataService, modelAnnotationTypes, _, businessPartnerLogicalValidator) {

		const service = {};
		const businessPartnerValidatorService = businessPartnerLogicalValidator.getService({dataService : modelAnnotationDataService});

		service.validateCategoryFk = function (entity, value, model) {
			if (entity.RawType === modelAnnotationTypes.byCode.standalone.id) {
				if (!_.isInteger(value)) {
					const result = platformDataValidationService.createErrorObject('model.annotation.noCategorylessStandalone');
					return platformDataValidationService.finishValidation(result, entity, value, model, service, modelAnnotationDataService);
				}
			}
			return platformDataValidationService.validateMandatory(entity, value, model, service, modelAnnotationDataService);
		};

		service.validateClerkFk = function (entity) {
			modelAnnotationDataService.updateItemDisabledStates(entity);
		};
		service.validateSubsidiaryFk = function (entity) {
			modelAnnotationDataService.updateItemDisabledStates(entity);
		};
		service.validateBusinessPartnerFk = function (entity, value) {
			modelAnnotationDataService.updateItemDisabledStates(entity);
			businessPartnerValidatorService.resetArgumentsToValidate();
			businessPartnerValidatorService.businessPartnerValidator.apply(null, arguments);
			businessPartnerValidatorService.setDefaultContact(entity, value, 'ContactFk').then(function () {
				modelAnnotationDataService.fireItemModified(entity);
			});
		};
		service.validateContactFk = function (entity, value) {
			return platformDataValidationService.validateMandatory(entity, value, 'ContactFk', service, modelAnnotationDataService);
		};

		return service;
	}
})(angular);
