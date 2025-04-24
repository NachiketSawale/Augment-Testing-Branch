
(function () {

	'use strict';
	/**
	 * @ngdoc service
	 * @name basicsClerkMemberService
	 * @function
	 *
	 * @description
	 * basicsClerkMemberService is the data service for all clerk members.
	 */

	var clerkModule = angular.module('basics.clerk');

	clerkModule.factory('basicsClerkMemberService', ['globals', 'basicsClerkGroupService', 'platformDataServiceFactory', '$http',
		function (globals, basicsClerkGroupService,platformDataServiceFactory, $http) {
			var factoryOptions = {
				flatLeafItem: {
					module: clerkModule,
					serviceName: 'basicsClerkMemberService',
					entityNameTranslationID: 'basics.clerk.entityClerkMember',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'basics/clerk/group/',
						endRead: 'listbygroup',
						endCreate:'createmember',
						usePostForRead: true,
						initReadData: function initReadData(readData) {
							var selected = basicsClerkGroupService.getSelected();
							readData.Id = selected.ClerkGroupFk;
						}
					},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								var selected = basicsClerkGroupService.getSelected();
								creationData.Id = selected.ClerkGroupFk;
							}
						}
					},
					actions: {delete: true, create: 'flat'},
					entityRole: {
						leaf: {itemName: 'Members', parentService: basicsClerkGroupService}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);

			return serviceContainer.service;

		}]);
})(angular);
