/**
 * Created by sandu on 26.08.2015.
 */
(function (angular) {
	'use strict';

	var moduleName = 'usermanagement.user';
	var configModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name usermanagementUserMainService
	 * @function
	 *
	 * @description
	 * main data service for all user related functionality.
	 */
	angular.module(moduleName).factory('usermanagementUserMainService', usermanagementUserMainService);

	usermanagementUserMainService.$inject = ['platformDataServiceFactory', 'ServiceDataProcessArraysExtension', 'ServiceDataProcessDatesExtension', 'usermanagementUserModifyProcessor', 'usermanagementUserValidationProcessor'];

	function usermanagementUserMainService(platformDataServiceFactory, ServiceDataProcessArraysExtension, ServiceDataProcessDatesExtension, usermanagementUserModifyProcessor, usermanagementUserValidationProcessor) {
		var sidebarSearchOptions = {
			moduleName: moduleName,
			pattern: '',
			pageSize: 1000,
			useCurrentClient: false,
			includeNonActiveItems: false,
			showOptions: false,
			showProjectContext: false,
			withExecutionHints: true
		};

		var serviceFactoryOptions = {
			flatRootItem: {
				module: configModule,
				serviceName: 'usermanagementUserMainService',
				entityNameTranslationID: 'usermanagement.user.entityUser',
				// httpCRUD: {route: globals.webApiBaseUrl + 'usermanagement/main/user/', usePostForRead: true},
				httpCreate: {
					route: globals.webApiBaseUrl + 'usermanagement/main/user/',
					endCreate: 'createUser'
				},
				httpRead: {
					usePostForRead: true,
					route: globals.webApiBaseUrl + 'usermanagement/main/user/',
					endRead: 'listFiltered'
				},
				httpUpdate: {route: globals.webApiBaseUrl + 'usermanagement/main/user/'},
				httpDelete: {
					route: globals.webApiBaseUrl + 'usermanagement/main/user/',
					endDelete: 'deleteUser'
				},
				dataProcessor: [new ServiceDataProcessArraysExtension(['User']),
					usermanagementUserModifyProcessor,
					new ServiceDataProcessDatesExtension(['Lastlogin'])],
				entityRole: {
					root: {
						codeField: 'LogonName',
						descField: 'Description',
						itemName: 'User',
						moduleName: 'usermanagement.user.moduleInfoNameUsermanagementUser',
						handleUpdateDone: function (updateData, response, data) {
							if (response.User && response.User.Version === 1) {
								var item = _.find(data.itemList, function (item) {
									return item.Id === -1;
								});
								_.assign(item, response.User);
								data.handleOnUpdateSucceeded(updateData, response, data, true);
							}
							if (response.User) {
								response.User.ConfirmPassword = null;
								response.User.Password = null;
							}
						}
					}
				},
				modification: {multi: true},
				actions: {delete: true, create: 'flat'},
				sidebarSearch: {options: sidebarSearchOptions}
			}
		};

		var serviceContainer = platformDataServiceFactory.createNewComplete(serviceFactoryOptions);
		serviceContainer.data.newEntityValidator = usermanagementUserValidationProcessor;

		serviceContainer.service.adDisconnect = function () {
			var selected = serviceContainer.service.getSelected();
			selected.DomainSID = null;
			serviceContainer.service.markItemAsModified(selected);
			serviceContainer.service.gridRefresh();
		};

		serviceContainer.service.getSelectedUserId = function () {

			var selectedUser = serviceContainer.service.getSelected();
			if (selectedUser && selectedUser.Id) {
				return selectedUser.Id;
			}
		};
		return serviceContainer.service;
	}
})(angular);
