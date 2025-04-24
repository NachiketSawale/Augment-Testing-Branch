/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	angular.module('model.changeset').service('modelChangeSetConfigurationService', ['platformUIStandardConfigService', 'platformSchemaService', 'modelChangeSetUIConfigurationService', 'modelChangeSetTranslationService',
		function (platformUIStandardConfigService, platformSchemaService, modelChangeSetUIConfigurationService, modelChangeSetTranslationService) {
			var BaseService = platformUIStandardConfigService;
			var modelChangeSetDomainSchema = platformSchemaService.getSchemaFromCache( { typeName: 'ChangeSetDto', moduleSubModule: 'Model.ChangeSet'} );
			if (modelChangeSetDomainSchema) {
				modelChangeSetDomainSchema = modelChangeSetDomainSchema.properties;
				modelChangeSetDomainSchema.ChangeCount = { domain: 'integer' };
				modelChangeSetDomainSchema.Status = { domain: 'action' };
			}

			var modelChangeSetDetailLayout = modelChangeSetUIConfigurationService.getModelChangeSetLayout();
			return new BaseService(modelChangeSetDetailLayout, modelChangeSetDomainSchema, modelChangeSetTranslationService);
		}]);
})();