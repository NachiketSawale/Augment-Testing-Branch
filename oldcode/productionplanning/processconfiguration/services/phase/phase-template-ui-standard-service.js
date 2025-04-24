
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.processconfiguration';

	angular.module(moduleName).factory('ppsProcessConfigurationPhaseTemplateUIStandardService', UIStandardService);

	UIStandardService.$inject = ['platformUIStandardConfigService',
		'productionplanningProcessConfigurationTranslationService',
		'platformSchemaService',
		'basicsLookupdataConfigGenerator',
		'productionplanningCommonLayoutHelperService',
		'ppsProcessConfigurationPhaseTemplateDataService'];

	function UIStandardService(platformUIStandardConfigService,
		translationService,
		platformSchemaService,
		basicsLookupdataConfigGenerator,
		ppsCommonLayoutHelperService,
		ppsProcessConfigurationPhaseTemplateDataService) {

		var layoutConfig =
			{
				'fid': 'productionplanning.processconfiguration.phasetemplatelayout',
				'version': '1.0.0',
				'showGrouping': true,
				'addValidationAutomatically': true,
				'groups': [
					{
						gid: 'baseGroup',
						attributes: ['phasetypefk', 'sequenceorder', 'duration', 'successorleadtime', 'psdrelationkindfk', 'successorminslacktime',
							'dateshiftmode', 'calcalendarleadfk']
					},
					{
						gid: 'placeHolder',
						attributes: ['isplaceholder', 'processtemplatedeffk', 'executionlimit']
					},
					{
						gid: 'entityHistory',
						isHistory: true
					}
				],
				'overloads': {
					phasetypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.ppsphasetype',
						null, {}),
					psdrelationkindfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.relationkind',
						null, {}),
					successorminslacktime:{
						disallowNegative: true
					},
					dateshiftmode:  {
						grid: {
							formatter: 'select',
							formatterOptions: {
								serviceName : 'productionplanningCommonDateShiftModeService',
								valueMember: 'Id',
								displayMember: 'Description'
							},
							editor: 'select',
							editorOptions: {
								serviceName : 'productionplanningCommonDateShiftModeService',
								valueMember: 'Id',
								displayMember: 'Description'
							}
						},
						detail: {
							type: 'select',
							required: false,
							options: {
								serviceName : 'productionplanningCommonDateShiftModeService',
								valueMember: 'Id',
								displayMember: 'Description'
							}
						}
					},
					processtemplatedeffk: {
						grid: {
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'ProcessTemplate',
								displayMember: 'DescriptionInfo.Translated',
								version: 3
							},
							editor: 'lookup',
							editorOptions: {
								lookupOptions: {
									showClearButton: true,
									filterKey: 'pps-phase-template-process-filter'
								},
								directive: 'pps-process-configuration-process-template-dialog-lookup'
							},
							width: 100
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupOptions: {
									showClearButton: true,
									filterKey: 'pps-phase-template-process-filter'
								},
								lookupDirective: 'pps-process-configuration-process-template-dialog-lookup',
							}
						}
					},
					executionlimit:{
						disallowNegative: true
					},
					calcalendarleadfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'schedulingLookupCalendarDataService',
						enableCache: true
					})
				}
			};

		var BaseService = platformUIStandardConfigService;

		var ruleSetAttributeDomains = platformSchemaService.getSchemaFromCache({
			typeName: 'PhaseTemplateDto',
			moduleSubModule: 'Productionplanning.ProcessConfiguration'
		});
		ruleSetAttributeDomains = ruleSetAttributeDomains.properties;

		let service = new BaseService(layoutConfig, ruleSetAttributeDomains, translationService);
		var detailView = service.getStandardConfigForDetailView();
		_.forEach(detailView.rows, function (row) {
			row.change = function (entity, field) {
				ppsProcessConfigurationPhaseTemplateDataService.handleFieldChanged(entity, field);
			};
		});

		return service;
	}
})(angular);