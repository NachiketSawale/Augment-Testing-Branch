/**
 * Created by anl on 6/5/2019.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.eventconfiguration';

	angular.module(moduleName).factory('productionplanningEventconfigurationTemplateLayout', RuleSetLayout);
	RuleSetLayout.$inject = ['basicsLookupdataConfigGenerator', 'productionplanningCommonLayoutHelperService'];

	function RuleSetLayout(basicsLookupdataConfigGenerator, ppsCommonLayoutHelperService) {
		return {
			'fid': 'productionplanning.eventconfiguration.eventconfiglayout',
			'version': '1.0.0',
			'showGrouping': true,
			'addValidationAutomatically': true,
			'groups': [
				{
					gid: 'baseGroup',
					attributes: ['eventtypefk', 'sequenceorder', 'duration', 'leadtime', 'relationkindfk', 'mintime',
						'dateshiftmode', 'calcalendarleadfk']
				},
				{
					gid: 'entityHistory',
					isHistory: true
				}
			],
			'overloads': {
				eventtypefk: ppsCommonLayoutHelperService.provideEventTypeLookupOverload(),
				relationkindfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.relationkind',
					null, {}),
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
				calcalendarleadfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'schedulingLookupCalendarDataService',
					enableCache: true
				})
			}
		};
	}

	angular.module(moduleName).factory('productionplanningEventconfigurationTemplateUIStandardService', EventconfigurationUIStandardService);

	EventconfigurationUIStandardService.$inject = ['platformUIStandardConfigService', 'productionplanningEventconfigurationTranslationService',
		'platformSchemaService', 'productionplanningEventconfigurationTemplateLayout'];

	function EventconfigurationUIStandardService(platformUIStandardConfigService, translationService,
												 platformSchemaService, eventConfigTemplateLayout) {

		var BaseService = platformUIStandardConfigService;

		var ruleSetAttributeDomains = platformSchemaService.getSchemaFromCache({
			typeName: 'EventTemplateDto',
			moduleSubModule: 'ProductionPlanning.EventConfiguration'
		});
		ruleSetAttributeDomains = ruleSetAttributeDomains.properties;

		return new BaseService(eventConfigTemplateLayout, ruleSetAttributeDomains, translationService);
	}
})(angular);