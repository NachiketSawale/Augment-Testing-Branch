/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	angular.module('model.measurements').service('modelMeasurementGroupConfigurationService',
		modelMeasurementGroupConfigurationService);

	modelMeasurementGroupConfigurationService.$inject = ['platformUIStandardConfigService',
		'platformSchemaService', 'modelMeasurementGroupUIConfigurationService', 'modelMeasurementTranslationService'];

	function modelMeasurementGroupConfigurationService(platformUIStandardConfigService, platformSchemaService,
		modelMeasurementGroupUIConfigurationService, modelMeasurementTranslationService) {

		const BaseService = platformUIStandardConfigService;
		let domainSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'ModelMeasurementGroupDto',
			moduleSubModule: 'Model.Measurements'
		});
		if (domainSchema) {
			domainSchema = domainSchema.properties;
		}

		const layout = modelMeasurementGroupUIConfigurationService.getModelMeasurementGroupLayout();
		return new BaseService(layout, domainSchema, modelMeasurementTranslationService);
	}
})(angular);
