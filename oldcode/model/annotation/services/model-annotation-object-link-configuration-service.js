/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	angular.module('model.annotation').service('modelAnnotationObjectLinkConfigurationService',
		modelAnnotationObjectLinkConfigurationService);

	modelAnnotationObjectLinkConfigurationService.$inject = ['platformUIStandardConfigService',
		'platformSchemaService', 'modelAnnotationUIConfigurationService', 'modelAnnotationTranslationService'];

	function modelAnnotationObjectLinkConfigurationService(platformUIStandardConfigService, platformSchemaService,
		modelAnnotationUIConfigurationService, modelAnnotationTranslationService) {

		const BaseService = platformUIStandardConfigService;
		let domainSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'ModelAnnotationObjectLinkDto',
			moduleSubModule: 'Model.Annotation'
		});
		if (domainSchema) {
			domainSchema = domainSchema.properties;
		}

		const layout = modelAnnotationUIConfigurationService.getObjectLinkLayout();
		return new BaseService(layout, domainSchema, modelAnnotationTranslationService);
	}
})(angular);
