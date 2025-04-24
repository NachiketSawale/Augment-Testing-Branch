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
	angular.module(moduleName).factory('schedulingMainClerkConfigurationService',

		['platformUIStandardConfigService', 'schedulingMainTranslationService', 'schedulingMainUIConfigurationService', 'platformSchemaService',
			'platformUIStandardExtentService', 'platformObjectHelper',

			function (platformUIStandardConfigService, schedulingMainTranslationService, schedulingMainUIConfigurationService, platformSchemaService, platformUIStandardExtentService, platformObjectHelper) {

				var BaseService = platformUIStandardConfigService;

				var clerkAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'ActivityClerkDto',
					moduleSubModule: 'Scheduling.Main'
				});

				if (clerkAttributeDomains) {
					clerkAttributeDomains = clerkAttributeDomains.properties;
				}

				function extendClerkDisplayConfig() {
					return {
						'addition': {
							'grid': platformObjectHelper.extendGrouping([
								{
									'afterId': 'clerkfk',
									'id': 'ClerkDescription_description',
									'field': 'ClerkFk',
									'name': 'Clerk Description',
									'name$tr$': 'basics.company.clerkdesc',
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'clerk',
										displayMember: 'Description'
									},
									width: 140
								}
							])
						}
					};
				}

				var schedulingMainActivityClerkDetailLayout = schedulingMainUIConfigurationService.getActivityClerkDetailLayout();

				var service = new BaseService(schedulingMainActivityClerkDetailLayout, clerkAttributeDomains, schedulingMainTranslationService);
				platformUIStandardExtentService.extend(service, extendClerkDisplayConfig().addition, clerkAttributeDomains);

				return service;
			}
		]);
})();
