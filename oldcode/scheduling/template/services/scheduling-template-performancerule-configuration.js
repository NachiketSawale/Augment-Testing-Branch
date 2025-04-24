/**
 * Created by leo on 23.03.2015.
 */
(function () {
	'use strict';
	var moduleName = 'scheduling.template';

	/**
	 * @ngdoc service
	 * @name schedulingScheduleStandardConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of template entities
	 */
	angular.module(moduleName).factory('schedulingTemplatePerformanceRuleConfigurationService',

		['platformUIStandardConfigService', 'schedulingTemplateTranslationService', 'basicsLookupdataConfigGenerator', 'platformSchemaService',

			function (platformUIStandardConfigService, schedulingTemplateTranslationService, basicsLookupdataConfigGenerator, platformSchemaService) {

				function createSchedulingTemplatePerformanceRuleDetailLayout() {
					return {
						'fid': 'scheduling.template.performanceruledetailform',
						'version': '1.0.0',
						addValidationAutomatically: true,
						'groups': [
							{
								'gid': 'baseGroup',
								'attributes': ['code', 'descriptioninfo', 'commenttext', 'resource', 'quantity', 'uomfk1', 'uomfk2', 'performancesheetfk']
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
						'overloads': {
							uomfk1: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsUnitLookupDataService',
								cacheEnable: true
							}),
							uomfk2: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsUnitLookupDataService',
								cacheEnable: true
							}),
							// performancesheetfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({dataServiceName: 'schedulingLookupPerformanceSheetDataService'})
							performancesheetfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.performancesheet', 'Description'),
						}
					};
				}

				var schedulingTemplatePerformanceDetailLayout = createSchedulingTemplatePerformanceRuleDetailLayout();

				var BaseService = platformUIStandardConfigService;

				var schedulingTemplatePerformanceAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'PerformanceRuleDto',
					moduleSubModule: 'Scheduling.Template'
				});
				schedulingTemplatePerformanceAttributeDomains = schedulingTemplatePerformanceAttributeDomains.properties;

				function ScheduleUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				ScheduleUIStandardService.prototype = Object.create(BaseService.prototype);
				ScheduleUIStandardService.prototype.constructor = ScheduleUIStandardService;

				return new BaseService(schedulingTemplatePerformanceDetailLayout, schedulingTemplatePerformanceAttributeDomains, schedulingTemplateTranslationService);
			}
		]);
})();
