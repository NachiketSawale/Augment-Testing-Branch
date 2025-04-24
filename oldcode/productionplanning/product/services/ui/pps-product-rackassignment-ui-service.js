(function () {
	'use strict';
	/*global angular*/

	var moduleName = 'productionplanning.product';
	angular.module(moduleName).factory('ppsProductRackassignmentUIService', [
		'platformUIStandardConfigService',
		'platformSchemaService',
		'ppsProductRackassignmentLayoutConfig',
		'productionplanningProductTranslationService',
		function (platformUIStandardConfigService,
			platformSchemaService,
			ppsProductRackassignmentLayoutConfig,
			productTranslationService) {

			var BaseService = platformUIStandardConfigService;

			var attributeDomains = platformSchemaService.getSchemaFromCache({
				typeName: 'PpsRackAssignDto',
				moduleSubModule: 'ProductionPlanning.Product'
			}).properties;

			return new BaseService(ppsProductRackassignmentLayoutConfig, attributeDomains, productTranslationService);
		}
	]);

	angular.module(moduleName).service('ppsProductRackassignmentLayoutConfig', [
		'basicsLookupdataConfigGenerator',
		function (basicsLookupdataConfigGenerator) {
			return {
				fid: 'productionplanning.product.rackassignment.layout',
				version: '1.0.0',
				showGrouping: true,
				addValidationAutomatically: true,
				groups: [
					{
						gid: 'baseGroup',
						attributes: ['rackcode', 'resresourcerackfk','commenttext']
					},
					{
						gid: 'entityHistory',
						isHistory: true
					}
				],
				overloads: {
					resresourcerackfk: {
						grid: {
							editor: 'lookup',
							directive: 'basics-lookupdata-lookup-composite',
							editorOptions: {
								lookupDirective: 'transportplanning-package-resource-lookup',
								lookupOptions: {
									displayMember: 'Code',
									addGridColumns: [{
										id: 'Description',
										field: 'DescriptionInfo.Translated',
										name: 'Description',
										width: 200,
										formatter: 'description',
										name$tr$: 'cloud.common.entityDescription'
									}],
									additionalColumns: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'ResourceMasterResource',
								displayMember: 'Code',
								version: 3
							}
						}
					}
				}
			};
		}
	]);
})();

