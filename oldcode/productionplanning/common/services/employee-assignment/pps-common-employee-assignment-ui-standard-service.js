(function() {
	'use strict';

	var moduleName = 'productionplanning.common';

	angular.module(moduleName).factory('ppsCommonEmployeeAssignmentLayout', ppsCommonEmployeeAssignmentLayout);

	ppsCommonEmployeeAssignmentLayout.$inject = ['basicsLookupdataConfigGenerator'];

	function ppsCommonEmployeeAssignmentLayout( basicsLookupdataConfigGenerator) {
		return {
			fid: 'productionplanning.common.employee.assignment',
			version: '1.0.0',
			showGrouping: true,
			addValidationAutomatically: true,
			readonly: true,
			groups: [
				{
					gid: 'baseGroup',
					attributes: ['descriptioninfo', 'tksemployeefk','bassiteprodareafk', 'ppscostcodefk', 'percentage']
				},
				{
					gid: 'userDefTextGroup',
					isUserDefText: true,
					attCount: 5,
					attName: 'userdefined',
					noInfix: true
				},
				{
					gid: 'entityHistory',
					isHistory: true
				}
			],
			overloads: {
				'ppscostcodefk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'ppsCostCodesLookupDataService'
				}),
				'tksemployeefk' : basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'timekeepingEmployeeLookupDataService',
					readonly:true
				}),
				'bassiteprodareafk': {
					grid: {
						editor: 'lookup',
						editorOptions: {
							lookupOptions: {
								showClearButton: true,
								filterKey: 'pps-common-employee-assignment-site-filter',
								additionalColumns: true,
								addGridColumns: [{
									id: 'siteDesc',
									field: 'DescriptionInfo',
									name: 'Production Area Description',
									name$tr$: 'cloud.common.entityDescription',
									formatter: 'translation',
									readonly: true
								}]
							},
							directive: 'basics-site-site-lookup'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'SiteNew',
							displayMember: 'Code',
							version: 3
						},
						width: 70
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupOptions: {showclearButton: true,
								filterKey: 'pps-common-employee-assignment-site-filter'},
							lookupDirective: 'basics-site-site-lookup',
							displayMember: 'Code',
							descriptionMember: 'DescriptionInfo.Translated'
						}
					}
				}
			}
		};
	}

	angular.module(moduleName).factory('ppsCommonEmployeeAssignmentUIStandardService', ppsCommonEmployeeAssignmentUIStandardService);

	ppsCommonEmployeeAssignmentUIStandardService.$inject = ['platformUIStandardConfigService', 'platformSchemaService',
		'productionplanningCommonTranslationService',
		'ppsCommonEmployeeAssignmentLayout'];

	function ppsCommonEmployeeAssignmentUIStandardService(platformUIStandardConfigService, platformSchemaService, translationService, ppsCommonEmployeeAssignmentLayout) {
		var BaseService = platformUIStandardConfigService;

		var attributeDomains = platformSchemaService.getSchemaFromCache({
			typeName: 'PpsEmployeeAssignmentDto',
			moduleSubModule: 'ProductionPlanning.Common'
		});

		var schemaProperties = attributeDomains.properties;

		var service = new BaseService(ppsCommonEmployeeAssignmentLayout, schemaProperties, translationService);

		return service;
	}
})();