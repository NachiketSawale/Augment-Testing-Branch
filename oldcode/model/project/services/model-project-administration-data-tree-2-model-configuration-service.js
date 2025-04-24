/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	angular.module('model.project').service('modelProjectAdministrationDataTree2ModelConfigurationService', [
		'platformUIStandardConfigService', 'platformSchemaService',
		'modelProjectAdministrationDataTree2ModelUiConfigurationService', 'modelProjectMainTranslationService',
		function (platformUIStandardConfigService, platformSchemaService,
		          modelProjectAdministrationDataTree2ModelUiConfigurationService, modelProjectMainTranslationService) {
			var BaseService = platformUIStandardConfigService;
			var domainSchema = platformSchemaService.getSchemaFromCache({typeName: 'DataTree2ModelDto', moduleSubModule: 'Model.Administration'});
			if (domainSchema) {
				domainSchema = domainSchema.properties;
				domainSchema.ProjectFk = { domain: 'integer' };
			}

			var layout = modelProjectAdministrationDataTree2ModelUiConfigurationService.getDataTree2ModelLayout();
			return new BaseService(layout, domainSchema, modelProjectMainTranslationService);
		}]);
})();