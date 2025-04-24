/**
 * Created by leo on 17.08.2015.
 */
(function () {
	'use strict';
	let moduleName = 'scheduling.main';

	/**
	 * @ngdoc service
	 * @name schedulingMainEventConfigurationService
	 * @function
	 *
	 * @description
	 * schedulingService is the data service for all scheduling data functions.
	 */
	angular.module(moduleName).factory('schedulingMainBaselineConfigurationService',

		['platformUIStandardConfigService', 'schedulingMainTranslationService', 'basicsLookupdataConfigGenerator', 'platformSchemaService',

			function (platformUIStandardConfigService, schedulingMainTranslationService, basicsLookupdataConfigGenerator, platformSchemaService) {

				let BaseService = platformUIStandardConfigService;

				function createBaselineDetailLayout() {
					return {
						fid: 'scheduling.main.baselinedetailform',
						version: '0.2.4',
						showGrouping: true,
						groups: [
							{
								gid: 'baseGroup',
								attributes: ['description', 'remark']
							},
							{
								gid: 'entityHistory',
								isHistory: true
							}
						],
						overloads: {
							psdschedulefk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'schedulingLookupScheduleDataService',
								filter: function (item) {
									let prj;
									if (item) {
										prj = item.ProjectFk;
									}

									return prj;
								}
							})
						}
					};
				}

				let baselineDetailLayout = createBaselineDetailLayout();

				let baselineAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'BaselineDto',
					moduleSubModule: 'Scheduling.Main'
				});
				if (baselineAttributeDomains) {
					baselineAttributeDomains = baselineAttributeDomains.properties;
				}

				return new BaseService(baselineDetailLayout, baselineAttributeDomains, schedulingMainTranslationService);
			}
		]);
})();
