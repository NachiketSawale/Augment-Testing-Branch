/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	let moduleName = 'basics.textmodules';

	/**
	 * @ngdoc service
	 * @name basicsTextModulesStandardConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers of text modules
	 */
	angular.module(moduleName).factory('basicsTextModulesStandardConfigurationService', ['platformUIStandardConfigService', 'basicsTextModulesTranslationService', 'platformSchemaService', 'basicsTextModulesUIConfigurationService',

		function (platformUIStandardConfigService, basicsTextModulesTranslationService, platformSchemaService, basicsTextModulesUIConfigurationService) {

			let BaseService = platformUIStandardConfigService;
			let basTextModulesDomainSchema = platformSchemaService.getSchemaFromCache( {typeName: 'TextModuleDto', moduleSubModule: 'Basics.TextModules'} );
			if(basTextModulesDomainSchema) {
				basTextModulesDomainSchema = basTextModulesDomainSchema.properties;
			}

			function BasTextModulesUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			BasTextModulesUIStandardService.prototype = Object.create(BaseService.prototype);
			BasTextModulesUIStandardService.prototype.constructor = BasTextModulesUIStandardService;
			let basTextModulesDetailLayout = basicsTextModulesUIConfigurationService.getBasTextModulesDetailLayout();
			if (basTextModulesDomainSchema && basTextModulesDomainSchema.Code) {
				basTextModulesDomainSchema.Code.mandatory = true;
			}
			return new BaseService( basTextModulesDetailLayout, basTextModulesDomainSchema, basicsTextModulesTranslationService);
		}
	]);
})();
