/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
     * @ngdoc service
     * @name projectLocationMainService
     * @function
     *
     * @description
     * projectLocationMainService is the data service for all location related functionality.
     */
	angular.module('estimate.main').factory('estimateMainActivityLookupDataService', ['platformLookupDataServiceFactory','basicsLookupdataConfigGenerator','$injector',

		function (platformLookupDataServiceFactory,basicsLookupdataConfigGenerator,$injector) {
			let readData = {projectFk: null};

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('estimateMainActivityLookupDataService', {
				valMember: 'Id',
				dispMember: 'Description',
				columns: [
					{
						id: 'id',
						field: 'Description',
						name: 'Activity',
						formatter: 'description',
						name$tr$: 'cloud.common.entityActivity'
					},
					{
						id: 'plannedStart',
						field: 'PlannedStart',
						name: 'Planned Start',
						formatter: 'date',
						name$tr$: 'cloud.common.entityCurrentStart'
					},
					{
						id: 'plannedFinish',
						field: 'PlannedFinish',
						name: 'Planned Finish',
						formatter: 'date',
						name$tr$: 'cloud.common.entityCurrentEnd'
					}
				],
				uuid: '21f07eba920b4f5eaf40280450bf50d5'
			});

			let locationLookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'scheduling/main/activity/', endPointRead: 'activitylist'},
				filterParam: readData,
				prepareFilter: function prepareFilter(item) {
					if (!item) {
						item = $injector.get('estimateMainService').getSelectedProjectId();
					}
					readData.projectFk = item;
					return readData;
				},
				disableDataCaching: true
			};

			return platformLookupDataServiceFactory.createInstance(locationLookupDataServiceConfig).service;
		}]);
})(angular);
