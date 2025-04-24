/**
 * Created by sandu on 14.09.2015.
 */
(function (angular) {
	'use strict';

	var moduleName = 'usermanagement.right';
	var configModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name usermanagementRightMainService
	 * @function
	 *
	 * @description
	 * main data service for all right related functionality.
	 */
	angular.module(moduleName).factory('usermanagementRightMainService', usermanagementRightMainService);

	usermanagementRightMainService.$inject = ['platformDataServiceFactory', '$http', '$log', '_', 'globals', 'userManagementRoleReadOnlyProcessor'];

	function usermanagementRightMainService(platformDataServiceFactory, $http, $log, _, globals, userManagementRoleReadOnlyProcessor) {

		var sidebarSearchOptions = {
			moduleName: moduleName,
			pattern: '',
			pageSize: 100,
			useCurrentClient: false,
			includeNonActiveItems: false,
			showOptions: false,
			showProjectContext: false,
			withExecutionHints: true
		};

		var serviceFactoryOptions = {
			flatRootItem: {
				module: configModule,
				serviceName: 'usermanagementRightMainService',
				entityNameTranslationID: 'usermanagement.right.entityRole',
				httpCRUD: {route: globals.webApiBaseUrl + 'usermanagement/main/role/', usePostForRead: true},
				dataProcessor: [userManagementRoleReadOnlyProcessor],
				entityRole: {
					root: {
						codeField: 'Name',
						descField: 'Description',
						itemName: 'Role',
						moduleName: 'usermanagement.right.moduleInfoNameUsermanagementRight',
						handleUpdateDone: function (updateData, response, data) {
							if (response.Role && response.Role.Version === 1) {
								var item = _.find(data.itemList, function (item) {
									return item.Id >= 1000000;
								});
								_.assign(item, response.Role);
								data.handleOnUpdateSucceeded(updateData, response, data, true);
							}
						}

					}
				},
				entitySelection: {},
				modification: {multi: true},
				actions: {delete: true, create: 'flat'},
				sidebarSearch: {options: sidebarSearchOptions}
			}
		};

		var serviceContainer = platformDataServiceFactory.createNewComplete(serviceFactoryOptions);

		serviceContainer.service.getSelectedRoleId = function () {

			var selectedRole = serviceContainer.service.getSelected();
			if (selectedRole && selectedRole.Id) {
				return selectedRole.Id;
			}
		};

		serviceContainer.service.deleteRole = function () {

			var role = serviceContainer.service.getSelectedEntities();

			$http.post(globals.webApiBaseUrl + 'usermanagement/main/role/delete', role[0]
			).then(function (response) {
				_.remove(serviceContainer.data.itemList, e => e.Id === response.data);
				serviceContainer.service.gridRefresh();
			}, function (error) {
				$log.error(error);
			});
		};

		return serviceContainer.service;
	}
})(angular);