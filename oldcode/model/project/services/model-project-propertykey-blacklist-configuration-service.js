/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	angular.module('model.project').service('modelProjectPropertyKeyBlackListConfigurationService', [
		'platformUIStandardConfigService', 'platformSchemaService', 'modelProjectPropertyKeyBlackListUIConfigurationService',
		'projectMainTranslationService',
		function (platformUIStandardConfigService, platformSchemaService, modelProjectPropertyKeyBlackListUIConfigurationService,
		          projectMainTranslationService) {
			var BaseService = platformUIStandardConfigService;
			var modelAdministrationBlackListDomainSchema = platformSchemaService.getSchemaFromCache({
				typeName: 'ModelComparePropertykeyBlackListDto',
				moduleSubModule: 'Model.Administration'
			});
			if (modelAdministrationBlackListDomainSchema) {
				modelAdministrationBlackListDomainSchema = modelAdministrationBlackListDomainSchema.properties;
			}

			var layout = modelProjectPropertyKeyBlackListUIConfigurationService.getBlackListLayout();
			return new BaseService(layout, modelAdministrationBlackListDomainSchema, projectMainTranslationService);
		}]);
})(angular);
