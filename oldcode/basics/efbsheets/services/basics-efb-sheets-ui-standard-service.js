/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';

	angular.module('basics.efbsheets').factory('basicsEfbsheetsUIStandardService', ['platformUIStandardConfigService', 'platformUIStandardExtentService',
		'basicsEfbsheetsTranslationService', 'basicsEfbsheetsUIConfigurationService', 'platformSchemaService',
		function (platformUIStandardConfigService, platformUIStandardExtentService,
			basicsEfbsheetsTranslationService, basicsEfbsheetsUIConfigurationService, platformSchemaService) {

			let BaseService = platformUIStandardConfigService;

			let estCrewMixDomainSchema = platformSchemaService.getSchemaFromCache({
				typeName: 'EstCrewMixDto',
				moduleSubModule: 'Basics.EfbSheets'
			});

			if (estCrewMixDomainSchema) {
				estCrewMixDomainSchema = estCrewMixDomainSchema.properties;
			}

			function EfbSheetUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			EfbSheetUIStandardService.prototype = Object.create(BaseService.prototype);
			EfbSheetUIStandardService.prototype.constructor = EfbSheetUIStandardService;

			return new BaseService(basicsEfbsheetsUIConfigurationService.getBasicsEfbSheetsDetailLayout(), estCrewMixDomainSchema, basicsEfbsheetsTranslationService);
		}]);
})(angular);




