/**
 * Created by baf on 2016/06/13.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsCustomClerkRoleLookupDataService
	 * @function
	 *
	 * @description
	 * basicsCustomClerkRoleLookupDataService is the data service for all Address Format
	 */
	angular.module('basics.lookupdata').factory('basicsCustomClerkRoleLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicsCustomClerkRoleLookupDataService', {
				valMember: 'Id',
				dispMember: 'DescriptionInfo.Translated',
				showIcon:true,
				columns: [
					{
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						width: 300,
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: 'b192fdd6e0764900be28b1c8f1908fa1'
			});

			var basicsCustomClerkRoleLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'basics/customize/lookup/clerkrole/', endPointRead: 'list', usePostForRead: true },
				listProcessor:[
					{
						processList:function (items) {

							// ignore inactive.
							for (var i = items.length - 1; i >= 0; i--) {
								if (items[i].IsLive === false) {
									items.splice(i, 1);
								}
							}

							// sorting by ascending for Sorting filed.
							items.sort(function (a, b) {
								if (a.Sorting !== b.Sorting) {
									return a.Sorting > b.Sorting ? 1 : -1;
								}
								return 0;
							});
						}
					}
				]
			};

			return platformLookupDataServiceFactory.createInstance(basicsCustomClerkRoleLookupDataServiceConfig).service;
		}]);
})(angular);
