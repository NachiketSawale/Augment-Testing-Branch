/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const myModule = angular.module('model.annotation');
	const svcName = 'modelAnnotationDocumentValidationService';

	myModule.factory(svcName, modelAnnotationDocumentValidationService);

	modelAnnotationDocumentValidationService.$inject = ['platformDataValidationService',
		'modelAnnotationDocumentDataService'];

	function modelAnnotationDocumentValidationService(platformDataValidationService,
		modelAnnotationDocumentDataService) {

		const service = {};

		service.validateFileArchiveDocFk = function (entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, service, modelAnnotationDocumentDataService);
		};

		service.validateOriginFileName = function validateOriginFileName(entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, service, modelAnnotationDocumentDataService);
		};

		return service;
	}
})(angular);
