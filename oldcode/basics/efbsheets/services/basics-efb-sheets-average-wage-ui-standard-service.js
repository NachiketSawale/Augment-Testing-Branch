/**
 * $Id$
 * Copyright (c) RIB Software SE
 */


(function () {

	'use strict';

	let moduleName = 'basics.efbsheets';

	/**
     * @ngdoc service
     * @name basicsEfbsheetsAverageWageUIStandardService
     * @function
     *
     * @description
     *basicsEfbsheetsAverageWageUIStandardService
     */
	angular.module(moduleName).factory('basicsEfbsheetsAverageWageUIStandardService',
		['platformUIStandardConfigService', 'basicsEfbsheetsTranslationService', 'platformSchemaService','basicsLookupdataConfigGenerator',
			function (platformUIStandardConfigService, basicsEfbsheetsTranslationService, platformSchemaService,basicsLookupdataConfigGenerator) {

				let BaseService = platformUIStandardConfigService;
				let efbSheetsCrewMixAfLayout = {

					'fid': 'basics.efbsheets.averagewage.layout',
					'version': '1.0.0',
					'showGrouping': true,
					'addValidationAutomatically': true,
					'groups': [
						{
							'gid': 'basicData',
							'attributes': ['mdcwagegroupfk', 'count', 'supervisory','markuprate']
						}
					],

					'overloads': {
						'mdcwagegroupfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'basicsEfbSheetsWageGroupLookupDataService',
							enableCache: true
						})
					}
				};

				let efbSheetCrewMixAfsnDomainSchema = platformSchemaService.getSchemaFromCache({ typeName: 'EstAverageWageDto',moduleSubModule: 'Basics.EfbSheets'});
				if (efbSheetCrewMixAfsnDomainSchema) {
					efbSheetCrewMixAfsnDomainSchema = efbSheetCrewMixAfsnDomainSchema.properties;
				}

				function EfbSheetUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}
				EfbSheetUIStandardService.prototype = Object.create(BaseService.prototype);
				EfbSheetUIStandardService.prototype.constructor = EfbSheetUIStandardService;
				return new BaseService(efbSheetsCrewMixAfLayout, efbSheetCrewMixAfsnDomainSchema, basicsEfbsheetsTranslationService);
			}
		]);
})(angular);

