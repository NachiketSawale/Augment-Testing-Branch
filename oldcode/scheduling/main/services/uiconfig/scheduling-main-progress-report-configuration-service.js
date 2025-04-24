/**
 * Created by welss on 10.06.2014.
 */
(function () {
	'use strict';
	var moduleName = 'scheduling.main';

	/**
	 * @ngdoc service
	 * @name schedulingService
	 * @function
	 *
	 * @description
	 * schedulingService is the data service for all scheduling data functions.
	 */
	angular.module(moduleName).factory('schedulingMainProgressReportConfigurationService',

		['platformUIStandardConfigService', 'schedulingMainTranslationService', 'schedulingMainUIConfigurationService', 'platformSchemaService',

			function (platformUIStandardConfigService, schedulingMainTranslationService, schedulingMainUIConfigurationService, platformSchemaService) {

				var BaseService = platformUIStandardConfigService;

				var progressReportAttributeDomains = platformSchemaService.getSchemaFromCache( { typeName: 'ActivityProgressReportDto', moduleSubModule: 'Scheduling.Main'} );
				if(progressReportAttributeDomains) {
					progressReportAttributeDomains = progressReportAttributeDomains.properties;
				}
			

				var schedulingMainActivityProgressReportDetailLayout = schedulingMainUIConfigurationService.getActivityProgressReportDetailLayout();

				return new BaseService(schedulingMainActivityProgressReportDetailLayout, progressReportAttributeDomains, schedulingMainTranslationService);
			}
		]);
})();
