/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	angular.module('model.measurements').service('modelMeasurementConfigurationService',
		modelMeasurementConfigurationService);

	modelMeasurementConfigurationService.$inject = ['platformUIStandardConfigService',
		'platformSchemaService', 'modelMeasurementUIConfigurationService', 'modelMeasurementTranslationService'];

	function modelMeasurementConfigurationService(platformUIStandardConfigService, platformSchemaService,
		modelMeasurementUIConfigurationService, modelMeasurementTranslationService) {

		const BaseService = platformUIStandardConfigService;
		let domainSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'ModelMeasurementDto',
			moduleSubModule: 'Model.Measurements'
		});
		if (domainSchema) {
			domainSchema = domainSchema.properties;
		}

		const layout = modelMeasurementUIConfigurationService.getModelMeasurementLayout();
		return new BaseService(layout, domainSchema, modelMeasurementTranslationService);
	}
})(angular);
