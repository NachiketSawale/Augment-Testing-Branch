/**
 * Created by sandu on 07.09.2015.
 */
(function () {

	'use strict';

	var moduleName = 'usermanagement.group';
	var configModule = angular.module(moduleName);

	/**
     * @ngdoc service
     * @name usermanagementGroupXRoleService
     * @function
     *
     * @description
     * data service for all GroupXRole related functionality.
     */
	configModule.factory('usermanagementGroupXRoleService', usermanagementGroupXRoleService);

	usermanagementGroupXRoleService.$inject = ['usermanagementGroupMainService', 'platformDataServiceFactory'];

	function usermanagementGroupXRoleService(groupMainService, platformDataServiceFactory) {

		var serviceFactoryOptions = {
			flatLeafItem: {
				module: configModule,
				serviceName: 'usermanagementGroupXRoleService',
				httpCRUD: {route: globals.webApiBaseUrl + 'usermanagement/main/group2role/'},
				actions: {delete: true, create: 'flat'},
				entityRole: {leaf: {
					itemName: 'Group2Role',
					parentService: groupMainService}},
				entitySelection: {},
				modification: {multi: true},
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							creationData.mainItemId = groupMainService.getSelected().Id;
						}
					}
				}

			}
		};
		var serviceContainer = platformDataServiceFactory.createNewComplete(serviceFactoryOptions);

		return serviceContainer.service;
	}
})(angular);