/**
 * Created by shen on 7/5/2023
 */

(function () {
	'use strict';
	let moduleName = 'resource.wot';

	/**
	 * @ngdoc service
	 * @name moduleWot2PlantTypeUIStandardService
	 * @description
	 * This service is currently only used for structure container. the original one is in container-information-service.js => one day the config and logic from
	 * information-service should be moved here!
	 */
	angular.module(moduleName).factory('moduleWot2PlantTypeUIStandardService',
		['$injector', 'platformUIStandardConfigService', 'platformLayoutHelperService', 'platformSchemaService', 'basicsLookupdataConfigGenerator', 'resourceEquipmentTranslationService', 'resourceWotLookupConfigGenerator',


			function ($injector, platformUIStandardConfigService, platformLayoutHelperService, platformSchemaService, basicsLookupdataConfigGenerator, resourceEquipmentTranslationService, resourceWotLookupConfigGenerator) {

				function createMainDetailLayout() {
					return {
						fid: 'resource.equipment.wot2planttype.formdetail',
						version: '1.0.0',
						addValidationAutomatically: true,
						showGrouping: true,
						groups: [
							{
								'gid': 'baseGroup',
								'attributes': ['planttypefk', 'workoperationtypefk']
							}
						],
						overloads: {
							planttypefk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsCustomizePantTypeLookupDataService',
								readonly: true
							}),
							workoperationtypefk:resourceWotLookupConfigGenerator.provideWotLookupOverloadFilteredByPlantType(true, null, true)
						}
					};
				}

				let submoduleDetailLayout = createMainDetailLayout();

				let BaseService = platformUIStandardConfigService;

				let submoduleAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'Operation2PlantTypeDto',
					moduleSubModule: 'Resource.Wot'
				});
				submoduleAttributeDomains = submoduleAttributeDomains.properties;


				function UnitUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				UnitUIStandardService.prototype = Object.create(BaseService.prototype);
				UnitUIStandardService.prototype.constructor = UnitUIStandardService;

				let baseService = new BaseService(submoduleDetailLayout, submoduleAttributeDomains, resourceEquipmentTranslationService);
				baseService.getCreateMainLayout = function getCreateMainLayout() {
					return createMainDetailLayout();
				};
				return baseService;
			}
		]);
})();