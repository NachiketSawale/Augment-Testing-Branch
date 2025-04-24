/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	angular.module('model.measurements').service('modelMeasurementPointConfigurationService',
		modelMeasurementPointConfigurationService);

	modelMeasurementPointConfigurationService.$inject = ['platformUIStandardConfigService',
		'platformSchemaService', 'modelMeasurementPointUIConfigurationService', 'modelMeasurementTranslationService'];

	function modelMeasurementPointConfigurationService(platformUIStandardConfigService, platformSchemaService,
		modelMeasurementPointUIConfigurationService, modelMeasurementTranslationService) {

		const BaseService = platformUIStandardConfigService;
		let domainSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'ModelMeasurementPointDto',
			moduleSubModule: 'Model.Measurements'
		});
		if (domainSchema) {
			domainSchema = domainSchema.properties;
		}

		const layout = modelMeasurementPointUIConfigurationService.getModelMeasurementPointLayout();
		return new BaseService(layout, domainSchema, modelMeasurementTranslationService);
	}
})(angular);
