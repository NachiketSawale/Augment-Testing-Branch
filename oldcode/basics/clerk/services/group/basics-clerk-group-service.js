
(function () {

	'use strict';
	/**
	 * @ngdoc service
	 * @name basicsClerkGroupService
	 * @function
	 *
	 * @description
	 * basicsClerkGroupService is the data service for all clerk groups.
	 */

	var clerkModule = angular.module('basics.clerk');

	clerkModule.factory('basicsClerkGroupService', ['globals', 'basicsClerkMainService','platformDataServiceFactory',
		function (globals, basicsClerkMainService,platformDataServiceFactory) {
			var factoryOptions = {
				flatNodeItem: {
					module: clerkModule,
					serviceName: 'basicsClerkGroupService',
					entityNameTranslationID: 'basics.clerk.entityClerkGroup',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'basics/clerk/group/',
						endRead: 'listbyparent',
						usePostForRead: true,
						initReadData: function initReadData(readData) {
							var selected = basicsClerkMainService.getSelected();
							readData.PKey1 = selected.Id;
						}
					},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								var selected = basicsClerkMainService.getSelected();
								creationData.PKey1 = selected.Id;
							}
						}
					},
					actions: {delete: true, create: 'flat'},
					entityRole: {
						node: {itemName: 'Groups', parentService: basicsClerkMainService}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);

			return serviceContainer.service;

		}]);
})(angular);
