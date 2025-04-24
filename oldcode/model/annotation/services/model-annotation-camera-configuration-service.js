/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	angular.module('model.annotation').service('modelAnnotationCameraConfigurationService',
		modelAnnotationCameraConfigurationService);

	modelAnnotationCameraConfigurationService.$inject = ['platformUIStandardConfigService',
		'platformSchemaService', 'modelAnnotationUIConfigurationService', 'modelAnnotationTranslationService'];

	function modelAnnotationCameraConfigurationService(platformUIStandardConfigService, platformSchemaService,
		modelAnnotationUIConfigurationService, modelAnnotationTranslationService) {

		const BaseService = platformUIStandardConfigService;
		let domainSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'ModelAnnotationCameraDto',
			moduleSubModule: 'Model.Annotation'
		});
		if (domainSchema) {
			domainSchema = domainSchema.properties;
		}

		const layout = modelAnnotationUIConfigurationService.getCameraLayout();
		return new BaseService(layout, domainSchema, modelAnnotationTranslationService);
	}
})(angular);
