/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	angular.module('model.annotation').service('modelAnnotationDocumentConfigurationService',
		modelAnnotationDocumentConfigurationService);

	modelAnnotationDocumentConfigurationService.$inject = ['platformUIStandardConfigService',
		'platformSchemaService', 'modelAnnotationUIConfigurationService', 'modelAnnotationTranslationService'];

	function modelAnnotationDocumentConfigurationService(platformUIStandardConfigService, platformSchemaService,
		modelAnnotationUIConfigurationService, modelAnnotationTranslationService) {

		const BaseService = platformUIStandardConfigService;
		let domainSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'ModelAnnotationDocumentDto',
			moduleSubModule: 'Model.Annotation'
		});
		if (domainSchema) {
			domainSchema = domainSchema.properties;
		}

		const layout = modelAnnotationUIConfigurationService.getDocumentLayout();
		return new BaseService(layout, domainSchema, modelAnnotationTranslationService);
	}
})(angular);
