/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const myModule = angular.module('model.annotation');
	const svcName = 'modelAnnotationReferenceValidationService';

	myModule.factory(svcName, modelAnnotationReferenceValidationService);

	modelAnnotationReferenceValidationService.$inject = ['platformDataValidationService',
		'modelAnnotationReferenceDataService'];

	function modelAnnotationReferenceValidationService(platformDataValidationService,
		modelAnnotationReferenceDataService) {

		const service = {};

		function validateAnnotationFks(entity, value, model, id1, id2) {
			if (id1 === id2) {
				const result = platformDataValidationService.createErrorObject('model.annotation.noSelfRef');
				return platformDataValidationService.finishValidation(result, entity, value, model, service, modelAnnotationReferenceDataService);
			}

			return platformDataValidationService.validateMandatory(entity, value, model, service, modelAnnotationReferenceDataService);
		}

		service.validateFromAnnotationFk = function (entity, value, model) {
			return validateAnnotationFks(entity, value, model, value, entity.ToAnnotationFk);
		};

		service.validateToAnnotationFk = function (entity, value, model) {
			return validateAnnotationFks(entity, value, model, value, entity.FromAnnotationFk);
		};

		return service;
	}
})(angular);
