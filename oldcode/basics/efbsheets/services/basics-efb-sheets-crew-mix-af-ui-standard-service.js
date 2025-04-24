/**
 * $Id$
 * Copyright (c) RIB Software SE
 */


(function () {

	'use strict';

	let moduleName = 'basics.efbsheets';

	/**
     * @ngdoc service
     * @name basicsEfbsheetsCrewMixAfUIStandardService
     * @function
     *
     * @description
     *basicsEfbsheetsCrewMixAfUIStandardService
     */
	angular.module(moduleName).factory('basicsEfbsheetsCrewMixAfUIStandardService',
		['platformUIStandardConfigService', 'basicsEfbsheetsTranslationService', 'platformSchemaService','basicsLookupdataConfigGenerator',
			function (platformUIStandardConfigService, basicsEfbsheetsTranslationService, platformSchemaService,basicsLookupdataConfigGenerator) {

				let BaseService = platformUIStandardConfigService;
				let efbSheetsCrewMixAfLayout = {

					'fid': 'basics.efbsheets.crewmixaf.layout',
					'version': '1.0.0',
					'showGrouping': true,
					'addValidationAutomatically': true,
					'groups': [
						{
							'gid': 'basicData',
							'attributes': ['mdcwagegroupfk','percenthour','ratehour','markuprate']
						}
					],
					'overloads': {
						'mdcwagegroupfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'basicsEfbSheetsSurchargeLookupDataService',
							enableCache: true
						})
					}
				};

				let efbSheetCrewMixAfDomainSchema = platformSchemaService.getSchemaFromCache({typeName: 'EstCrewMixAfDto',moduleSubModule: 'Basics.EfbSheets'});
				if (efbSheetCrewMixAfDomainSchema) {
					efbSheetCrewMixAfDomainSchema = efbSheetCrewMixAfDomainSchema.properties;
				}

				function EfbSheetUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}
				EfbSheetUIStandardService.prototype = Object.create(BaseService.prototype);
				EfbSheetUIStandardService.prototype.constructor = EfbSheetUIStandardService;
				return new BaseService(efbSheetsCrewMixAfLayout, efbSheetCrewMixAfDomainSchema, basicsEfbsheetsTranslationService);
			}
		]);
})(angular);

