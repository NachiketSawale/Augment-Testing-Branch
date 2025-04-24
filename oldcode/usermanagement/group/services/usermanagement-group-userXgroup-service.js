/**
 * Created by sandu on 07.09.2015.
 */
(function () {

	'use strict';

	var moduleName = 'usermanagement.group';
	var configModule = angular.module(moduleName);

	/**
     * @ngdoc service
     * @name usermanagementGroupUserXGroupService
     * @function
     *
     * @description
     * data service for all UserXGroup related functionality.
     */
	configModule.factory('usermanagementGroupUserXGroupService', usermanagementGroupUserXGroupService);

	usermanagementGroupUserXGroupService.$inject = ['usermanagementGroupMainService', 'platformDataServiceFactory','ServiceDataProcessArraysExtension','usermanagementGroupUserXGroupProcessor'];

	function usermanagementGroupUserXGroupService(groupMainService, platformDataServiceFactory, ServiceDataProcessArraysExtension, usermanagementGroupUserXGroupProcessor) {

		var inc=0;

		var serviceFactoryOptions = {
			flatLeafItem: {
				module: configModule,
				serviceName: 'usermanagementGroupUserXGroupService',
				httpCreate: { route: globals.webApiBaseUrl + 'usermanagement/main/user2group/', endCreate: 'createUserInGroup' },
				httpRead: { route: globals.webApiBaseUrl + 'usermanagement/main/user2group/', endRead: 'listByGroupId' },
				httpDelete: { route: globals.webApiBaseUrl + 'usermanagement/main/user2group/', endDelete: 'delete' },
	            dataProcessor: [new ServiceDataProcessArraysExtension(['User2Group']), usermanagementGroupUserXGroupProcessor],
				actions: {delete: true, create: 'flat'},
				entityRole: {leaf: {
					itemName: 'User2Group',
					parentService: groupMainService}},
				entitySelection: {},
				modification: {multi: true},
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selectedItem = groupMainService.getSelected();
							creationData.mainItemId = selectedItem.Id;
							creationData.userFk =  --inc;

						}
					}
				}

			}
		};
		var serviceContainer = platformDataServiceFactory.createNewComplete(serviceFactoryOptions);

		return serviceContainer.service;
	}
})(angular);