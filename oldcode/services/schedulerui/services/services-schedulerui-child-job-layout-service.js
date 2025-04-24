/**
 * Created by aljami on 25.03.2022
 */
(function () {
	'use strict';
	const servicesSchedulerUIModule = angular.module('services.schedulerui');

	/**
	 * @ngdoc service
	 * @name servicesSchedulerUIChildJobLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for grid / form for translation resource entities
	 */
	servicesSchedulerUIModule.service('servicesSchedulerUIChildJobLayoutService', servicesSchedulerUIChildJobLayoutService);

	servicesSchedulerUIChildJobLayoutService.$inject = ['_', 'servicesScheduleruiUIConfigurationService', 'servicesScheduleruiContainerInformationService', 'platformUIStandardConfigService', 'platformSchemaService', 'servicesScheduleruiTranslationService'];

	function servicesSchedulerUIChildJobLayoutService(_, servicesScheduleruiUIConfigurationService, servicesScheduleruiContainerInformationService, platformUIStandardConfigService, platformSchemaService, servicesScheduleruiTranslationService) {

		var jobLayout = servicesScheduleruiUIConfigurationService.getChildJobEntityLayout();

		var BaseService = platformUIStandardConfigService;

		var jobAttributeDomains = platformSchemaService.getSchemaFromCache({
			typeName: 'JobDto',
			moduleSubModule: 'Services.Schedulerui'
		});
		if (jobAttributeDomains) {
			jobAttributeDomains = jobAttributeDomains.properties;
			jobAttributeDomains.Log = {domain: 'action'};
			jobAttributeDomains.Parameter = {domain: 'remark'};
		}

		return new BaseService(jobLayout, jobAttributeDomains, servicesScheduleruiTranslationService);
	}
})();