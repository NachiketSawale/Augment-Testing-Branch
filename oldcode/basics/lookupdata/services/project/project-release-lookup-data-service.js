/**
 * Created by Frank on 26.02.2015.
 */
(function (angular) {
	/* global moment */
	'use strict';

	/**
	 * @ngdoc service
	 * @name projectReleaseLookupDataService
	 * @function
	 *
	 * @description
	 * projectReleaseLookupDataService is the data service for all project release look ups
	 */
	angular.module('basics.lookupdata').factory('projectReleaseLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('projectReleaseLookupDataService', {
				valMember: 'Id',
				dispMember: 'CommentText',
				columns: [
					{
						id: 'CommentText',
						field: 'CommentText',
						name: 'CommentText',
						formatter: 'comment',
						width: 180,
						name$tr$: 'cloud.common.entityComment'
					},
					{
						id: 'ReleaseDate',
						field: 'ReleaseDate',
						name: 'Date',
						formatter: 'dateutc',
						width: 150,
						name$tr$: 'cloud.common.entityDate'
					}
				],
				uuid:'993406e2d5134f43aa6849486d661660'
			});

			var projectReleaseLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'project/main/release/', endPointRead: 'list' },
				filterParam: 'projectId',
				dataProcessor: [{
					processItem: function processItem(item) {
						item.ReleaseDate = moment.utc(item.ReleaseDate);
					}
				}]
			};

			return platformLookupDataServiceFactory.createInstance(projectReleaseLookupDataServiceConfig).service;
		}]);
})(angular);
