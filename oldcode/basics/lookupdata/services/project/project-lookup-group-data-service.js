/**
 * Created by Frank on 25.02.2015.
 */
(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name projectLookupGroupDataService
	 * @function
	 *
	 * @description
	 * projectLookupGroupDataService is the data service for project groups look ups
	 */
	angular.module('basics.lookupdata').factory('projectLookupGroupDataService', ['platformLookupDataServiceFactory', 'ServiceDataProcessArraysExtension', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, ServiceDataProcessArraysExtension, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('projectLookupGroupDataService', {
				valMember: 'Id',
				dispMember: 'DescriptionInfo.Translated',
				columns: [
					{
						id: 'Description',
						field: 'DescriptionInfo.Translated',
						name: 'Description',
						formatter: 'description',
						width: 300,
						name$tr$: 'cloud.common.entityDescription'
					},

				],
				uuid: '0ecbb96487ce4433baf69a4833c80f6a',
			});

			let projectGroupLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'project/main/projectgroup/', endPointRead: 'tree' },
				dataProcessor: [new ServiceDataProcessArraysExtension(['SubGroups'])],
				tree: { parentProp: 'PrjGroupParentFk', childProp: 'SubGroups' },

				selectableCallback: function selectableCallback(dataItem) {
					let result = false;
					if (dataItem.IsActive) {
						result = true;
					}
					return result;
				}
			};

			return platformLookupDataServiceFactory.createInstance(projectGroupLookupDataServiceConfig).service;
		}]);
})(angular);
