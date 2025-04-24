/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	angular.module('model.annotation').service('modelAnnotationMarkerConfigurationService',
		modelAnnotationMarkerConfigurationService);

	modelAnnotationMarkerConfigurationService.$inject = ['platformUIStandardConfigService',
		'platformSchemaService', 'modelAnnotationUIConfigurationService', 'modelAnnotationTranslationService'];

	function modelAnnotationMarkerConfigurationService(platformUIStandardConfigService, platformSchemaService,
		modelAnnotationUIConfigurationService, modelAnnotationTranslationService) {

		const BaseService = platformUIStandardConfigService;
		let domainSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'ModelAnnotationMarkerDto',
			moduleSubModule: 'Model.Annotation'
		});
		if (domainSchema) {
			domainSchema = domainSchema.properties;
		}

		const layout = modelAnnotationUIConfigurationService.getMarkerLayout();
		return new BaseService(layout, domainSchema, modelAnnotationTranslationService);
	}
})(angular);
