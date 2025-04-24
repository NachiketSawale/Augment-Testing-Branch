/**
 * Created by sandu on 31.08.2015.
 */
(function () {

	'use strict';

	var moduleName = 'usermanagement.user';
	var configModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name usermanagementUserXGroupService
	 * @function
	 *
	 * @description
	 * data service for all UserXGroup related functionality.
	 */
	configModule.factory('usermanagementUserXGroupService', usermanagementUserXGroupService);

	usermanagementUserXGroupService.$inject = ['usermanagementUserMainService', 'platformDataServiceFactory'];

	function usermanagementUserXGroupService(userMainService, platformDataServiceFactory) {

		var inc = 0;

		var serviceFactoryOptions = {
			flatLeafItem: {
				module: configModule,
				serviceName: 'usermanagementUserXGroupService',
				httpCRUD: {route: globals.webApiBaseUrl + 'usermanagement/main/user2group/'},
				actions: {delete: true, create: 'flat'},
				entityRole: {leaf: {itemName: 'User2Group', parentService: userMainService}},
				entitySelection: {},
				modification: {multi: true},
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {

							creationData.mainItemId = userMainService.getSelected().Id;
							creationData.groupFk = --inc;
						}
					}
				}

			}
		};
		var serviceContainer = platformDataServiceFactory.createNewComplete(serviceFactoryOptions);
		return serviceContainer.service;
	}
})(angular);
