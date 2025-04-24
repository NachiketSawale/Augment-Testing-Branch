(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name usermanagementRightCategoryLookupService
	 * @function
	 *
	 * @description
	 * usermanagementRightCategoryLookupService is the data service providing data for Access Role Category look ups
	 */
	angular.module('usermanagement.right').factory('usermanagementRightCategoryLookupService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator', 'globals',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator, globals) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('usermanagementRightCategoryLookupService', {
				valMember: 'Id',
				dispMember: 'Name',
				columns: [
					{
						id: 'Name',
						field: 'Name',
						name: 'Name',
						formatter: 'description',
						name$tr$: 'cloud.common.entityName'
					}
				],
				uuid: '57CE3F7A22C546E4B3A3FCE4A779975B'
			});

			const locationLookupDataServiceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'basics/customize/frmaccessrolecategory/',
					endPointRead: 'list',
					usePostForRead: true
				}
			};

			return platformLookupDataServiceFactory.createInstance(locationLookupDataServiceConfig).service;
		}]);
})(angular);
