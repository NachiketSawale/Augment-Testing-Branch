/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	angular.module('privacy.config').service('privacyConfigHandleTypedConfigurationService', [
		'platformUIStandardConfigService', 'platformSchemaService', 'privacyConfigUIConfigurationService',
		'privacyConfigTranslationService',
		function (platformUIStandardConfigService, platformSchemaService, privacyConfigUIConfigurationService,
			privacyConfigTranslationService) {
			var BaseService = platformUIStandardConfigService;
			var domainSchema = platformSchemaService.getSchemaFromCache( { typeName: 'PrivacyHandledTypeDto', moduleSubModule: 'Privacy.Config'} );
			if (domainSchema) {
				domainSchema = domainSchema.properties;
			}

			var layout = privacyConfigUIConfigurationService.getHandledTypeLayout();
			return new BaseService(layout, domainSchema, privacyConfigTranslationService);
		}]);
})();
