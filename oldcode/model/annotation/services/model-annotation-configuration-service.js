/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	angular.module('model.annotation').service('modelAnnotationConfigurationService',
		modelAnnotationConfigurationService);

	modelAnnotationConfigurationService.$inject = ['platformUIStandardConfigService',
		'platformSchemaService', 'modelAnnotationUIConfigurationService', 'modelAnnotationTranslationService'];

	function modelAnnotationConfigurationService(platformUIStandardConfigService, platformSchemaService,
		modelAnnotationUIConfigurationService, modelAnnotationTranslationService) {

		const BaseService = platformUIStandardConfigService;
		let domainSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'ModelAnnotationDto',
			moduleSubModule: 'Model.Annotation'
		});
		if (domainSchema) {
			domainSchema = domainSchema.properties;
		}

		const layout = modelAnnotationUIConfigurationService.getModelAnnotationLayout();
		return new BaseService(layout, domainSchema, modelAnnotationTranslationService);
	}
})(angular);
