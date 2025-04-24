/**
 * Created by sandu on 16.09.2015.
 */
(function () {

	'use strict';

	var moduleName = 'usermanagement.right';
	var configModule = angular.module(moduleName);

	/**
     * @ngdoc service
     * @name usermanagementRoleXRoleService
     * @function
     *
     * @description
     * data service for all roleXrole related functionality.
     */
	configModule.factory('usermanagementRoleXRoleService', usermanagementRoleXRoleService);

	usermanagementRoleXRoleService.$inject = ['usermanagementRightMainService', 'platformDataServiceFactory'];

	function usermanagementRoleXRoleService(rightMainService, platformDataServiceFactory) {

		var inc = 0;

		var serviceFactoryOptions = {
			flatLeafItem: {
				module: configModule,
				serviceName: 'usermanagementRoleXRoleService',
				httpCRUD: {route: globals.webApiBaseUrl + 'usermanagement/main/role2role/'},
				actions: {delete: true, create: 'flat'},
				entityRole: {leaf: {itemName: 'Role2Role', parentService: rightMainService}},
				entitySelection: {},
				modification: {multi: true},
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selectedItem = rightMainService.getSelected();
							creationData.mainItemId = selectedItem.Id;
							creationData.roleFk2 = --inc;

						}
					}
				}

			}
		};
		var serviceContainer = platformDataServiceFactory.createNewComplete(serviceFactoryOptions);

		return serviceContainer.service;
	}
})(angular);