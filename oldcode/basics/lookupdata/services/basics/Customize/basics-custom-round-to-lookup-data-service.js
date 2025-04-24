/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/* global globals, _ */
	/**
	 * @ngdoc service
	 * @name basicsCustomRoundToLookupDataService
	 * @function
	 *
	 * @description
	 * basicsCustomRoundToLookupDataService is the data service for RoundTo list.
	 */
	angular.module('basics.lookupdata').factory('basicsCustomRoundToLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicsCustomRoundToLookupDataService', {
				valMember: 'Id',
				dispMember: 'RoundTo',
				columns: [
					{
						id: 'Description',
						field: 'RoundTo',
						name: 'Description',
						formatter: 'description',
						width: 300,
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: 'a9947d2f3eb74770859721221cb36c30'
			});

			let basicsCustomClerkRoleLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'basics/customize/roundto/', endPointRead: 'list' , usePostForRead: true},
				listProcessor:[
					{
						processList:function (items) {
							_.remove(items, function(item) {
								return item.Id === 3;
							});
							return items;
						}
					}
				]
			};

			return platformLookupDataServiceFactory.createInstance(basicsCustomClerkRoleLookupDataServiceConfig).service;
		}]);
})(angular);
