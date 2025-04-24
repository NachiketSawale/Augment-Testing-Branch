/**
 * Created by Frank on 2017/07/17.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name schedulingProjectExecutionScheduleLookupDataService
	 * @function
	 *
	 * @description
	 * schedulingProjectExecutionScheduleLookupDataService is the data service for calendar look ups
	 */
	angular.module('basics.lookupdata').factory('schedulingProjectExecutionScheduleLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator', 'schedulingLookupScheduleDataProcessor',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator, scheduleStyleProcessor) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('schedulingProjectExecutionScheduleLookupDataService', {
				valMember: 'Id',
				dispMember: 'Code',
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
						field: 'ProjectName',
						name: 'Description',
						formatter: 'description',
						width: 250,
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: 'e9c76a097e164156b99c65a5ef3a1c48'
			});

			var schedulingPrjExecScheduleDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'scheduling/schedule/', endPointRead: 'execution' },
				filterParam: 'projectId',
				dataProcessor: [scheduleStyleProcessor]
			};

			return platformLookupDataServiceFactory.createInstance(schedulingPrjExecScheduleDataServiceConfig).service;
		}]);
})(angular);
