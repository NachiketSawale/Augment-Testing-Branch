/**
 * Created by baf on 2016-06-09
 */
(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name schedulingScheduleProjectScheduleLookupDataService
	 * @function
	 *
	 * @description
	 * schedulingScheduleProjectScheduleLookupDataService is the data service for lookup of schedules in a project
	 */
	angular.module('basics.lookupdata').factory('schedulingScheduleProjectScheduleLookupDataService', ['platformLookupDataServiceFactory',
		'basicsLookupdataConfigGenerator', 'platformDataServiceProcessDatesBySchemeExtension',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator, platformDataServiceProcessDatesBySchemeExtension) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('schedulingScheduleProjectScheduleLookupDataService', {
				valMember: 'Id',
				dispMember: 'DescriptionInfo.Translated',
				showIcon: true,
				columns: [
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						width: 100,
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						width: 300,
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: '32dd4314e35b4cbaa5493f5d755de6cb'
			});

			var schedulingScheduleProjectScheduleLookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'scheduling/schedule/', endPointRead: 'list'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: 'ScheduleDto',
					moduleSubModule: 'Scheduling.Schedule'
				})],
				filterParam: 'mainItemId'
			};

			return platformLookupDataServiceFactory.createInstance(schedulingScheduleProjectScheduleLookupDataServiceConfig).service;
		}]);
})(angular);
