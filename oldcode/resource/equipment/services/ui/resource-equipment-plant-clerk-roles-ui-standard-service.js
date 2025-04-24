/**
 * Created by cakiral on
 */

(function () {
	'use strict';
	var moduleName = 'resource.equipment';

	/**
	 * @ngdoc service
	 * @name resourceEquipmentPlantClerkRolesUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers of company entities
	 */
	angular.module(moduleName).factory('resourceEquipmentPlantClerkRolesUIStandardService',
		['platformUIStandardConfigService', 'basicsCompanyTranslationService', 'basicsLookupdataConfigGenerator', 'platformSchemaService',

			function (platformUIStandardConfigService, basicsCompanyTranslationService, basicsLookupdataConfigGenerator, platformSchemaService) {

				function createMainDetailLayout() {
					return {
						fid: 'resource.equipment.clerkdetailform',
						addValidationAutomatically: true,
						version: '1.0.0',
						showGrouping: true,
						groups: [
							{
								gid: 'baseGroup',
								attributes: ['clerkfk', 'clerkrolefk', 'validfrom', 'validto', 'commenttext']
							},
						],
						overloads: {
							clerkrolefk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsCustomClerkRoleLookupDataService',
								cacheEnable: true,
							}),
							clerkfk: {
								grid: {
									editor: 'lookup',
									editorOptions: {
										lookupDirective: 'cloud-clerk-clerk-dialog',
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'Clerk',
										displayMember: 'Description',
									},
								},
								detail: {
									type: 'directive',
									directive: 'basics-lookupdata-lookup-composite',
									options: {
										lookupDirective: 'cloud-clerk-clerk-dialog',
										descriptionMember: 'Description'
									},
								}
							},
						}
					};
				}

				var plantClerkDetailLayout = createMainDetailLayout();

				var BaseService = platformUIStandardConfigService;

				var plantClerkAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'Plant2ClerkDto',
					moduleSubModule: 'Resource.Equipment'
				}).properties;

				function Plant2ClerkUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				Plant2ClerkUIStandardService.prototype = Object.create(BaseService.prototype);
				Plant2ClerkUIStandardService.prototype.constructor = Plant2ClerkUIStandardService;

				return new BaseService(plantClerkDetailLayout, plantClerkAttributeDomains, basicsCompanyTranslationService);
			}
		]);
})();
