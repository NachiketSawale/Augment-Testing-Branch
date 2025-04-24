(function(angular){
	'use strict';

	angular.module('estimate.main').factory('estimateMainPlantListUIConfigService', ['$injector', 'platformUIStandardConfigService', 'platformSchemaService',
		'estimateMainTranslationService', 'platformLayoutHelperService', 'basicsLookupdataConfigGenerator', 'estimateCommonDynamicConfigurationServiceFactory',
		function($injector, platformUIStandardConfigService, platformSchemaService, estimateMainTranslationService, platformLayoutHelperService, basicsLookupdataConfigGenerator, estimateCommonDynamicConfigurationServiceFactory){

		let etmPlantFkConfig = platformLayoutHelperService.providePlantLookupOverload();
			etmPlantFkConfig.readonly = true;

			let layout = {
				'fid': 'estimate.main.plantList',
				'version': '1.0.1',
				'showGrouping': false,
				'addValidationAutomatically' : true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['etmplantgroupfk', 'etmplantfk', 'lgmjobfk', 'count', 'month', 'hourmonth', 'comment']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'overloads': {
					etmplantgroupfk:
						{
							readonly: true,
							grid: {
								editor: 'lookup',
								editorOptions: {
									directive: 'resource-equipment-group-lookup-dialog',
									lookupOptions: {
										additionalColumns: true,
										showClearButton: true,
										readonly: true,
										addGridColumns: [
											{
												id: 'description',
												field: 'DescriptionInfo',
												name: 'Description',
												name$tr$: 'cloud.common.entityDescription',
												formatter: 'translation',
												readonly: true,
											},
										],
									},
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'equipmentGroup',
									displayMember: 'Code',
									version: 3
								},
							},
							detail: {
								type: 'directive',
								directive: 'basics-lookupdata-lookup-composite',
								options: {
									lookupDirective: 'resource-equipment-group-lookup-dialog',
									displayMember: 'Code',
									descriptionMember: 'Description',
									showClearButton: true,
									lookupOptions: {
										showClearButton: true,
									},
								},
							},
						},
					etmplantfk: etmPlantFkConfig,
					lgmjobfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'estimateMainJobLookupByProjectDataService',
						cacheEnable: true,
						additionalColumns: true,
						addGridColumns: [{
							id: 'description',
							field: 'DescriptionInfo',
							name: 'Description',
							name$tr$: 'cloud.common.entityDescription',
							formatter: 'translation',
							readonly: true
						}],
						readonly: true
					})
				}
			};

			let BaseService = platformUIStandardConfigService;

			let attributeDomains = platformSchemaService.getSchemaFromCache({
				typeName: 'EstPlantListDto',
				moduleSubModule: 'Estimate.Main'
			});

			function DashboardUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			DashboardUIStandardService.prototype = Object.create(BaseService.prototype);
			DashboardUIStandardService.prototype.constructor = DashboardUIStandardService;

			let uiService = new BaseService(layout, attributeDomains.properties, estimateMainTranslationService);

			return estimateCommonDynamicConfigurationServiceFactory.getService(uiService);
		}]);
})(angular);