/**
 * Created by csalopek on 14.08.2017.
 */
(function () {
	'use strict';
	var moduleName = 'scheduling.extsys';

	/**
	 * @ngdoc service
	 * @name schedulingExtSysCalendarMainUIConfig
	 * @function
	 *
	 * @description
	 * schedulingService is the data service for all scheduling data functions.
	 */
	angular.module(moduleName).factory('schedulingExtSysUIStandardService', ['basicsLookupdataConfigGenerator', 'platformUIConfigInitService', 'schedulingExtSysTranslationService', 'platformSchemaService',

		function (basicsLookupdataConfigGenerator, platformUIConfigInitService, schedulingExtSysTranslationService, platformSchemaService) {
			var conf = null;

			function getLayout() {
				return {
					fid: 'scheduling.extsys.calendaruiconfig',
					version: '1.0.0',
					addValidationAutomatically: true,
					showGrouping: true,
					groups: [
						{
							gid: 'baseGroup',
							attributes: ['calendarfk', 'externalsourcefk', 'extguid']
						},
						{
							gid: 'entityHistory',
							isHistory: true
						}
					],
					overloads: {
						calendarfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'schedulingLookupCalendarDataService',
							enableCache: true,
							navigator: {
								moduleName: 'scheduling.calendar',
								registerService: 'schedulingCalendarMainService'
							}
						}),
						externalsourcefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.externalsource', 'Description')
					}
				};
			}

			function getDtoScheme() {
				return platformSchemaService.getSchemaFromCache({
					typeName: 'Calendar2ExternalDto',
					moduleSubModule: 'Scheduling.ExtSys'
				}).properties;
			}

			function createConfiguration() {
				var scheme = getDtoScheme();

				var configs = {};

				var layout = getLayout();
				configs.detailLayout = platformUIConfigInitService.provideConfigForDetailView(layout, scheme, schedulingExtSysTranslationService);
				configs.listLayout = platformUIConfigInitService.provideConfigForListView(layout, scheme, schedulingExtSysTranslationService);

				return configs;
			}

			return {
				getCalendarLayout: function () {
					return getLayout();
				},
				getStandardConfigForDetailView: function getStandardConfigForDetailView() {
					if (conf === null) {
						conf = createConfiguration();
					}

					return conf.detailLayout;
				},
				getStandardConfigForListView: function getStandardConfigForListView() {
					if (conf === null) {
						conf = createConfiguration();
					}

					return conf.listLayout;
				}
			};
		}
	]);
})(angular);

