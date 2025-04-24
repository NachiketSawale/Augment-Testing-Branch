/**
 * Created by sandu on 25.08.2015.
 */
(function (angular) {
	'use strict';

	var moduleName = 'usermanagement.group';
	var configModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name usermanagementGroupMainService
	 * @function
	 *
	 * @description
	 * main data service for all group related functionality.
	 */
	angular.module(moduleName).factory('usermanagementGroupMainService', usermanagementGroupMainService);

	usermanagementGroupMainService.$inject = ['platformDataServiceFactory', 'ServiceDataProcessArraysExtension', 'usermanagementGroupParseSynchronizeDateProcessor','basicsLookupdataLookupFilterService'];

	function usermanagementGroupMainService(platformDataServiceFactory, ServiceDataProcessArraysExtension, usermanagementGroupParseSynchronizeDateProcessor, basicsLookupdataLookupFilterService) {

		var sidebarSearchOptions = {
			moduleName:moduleName,
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
				serviceName: 'usermanagementGroupMainService',
				httpCRUD: {route: globals.webApiBaseUrl + 'usermanagement/main/group/', usePostForRead: true},
				dataProcessor: [new ServiceDataProcessArraysExtension(['Group']), usermanagementGroupParseSynchronizeDateProcessor],
				entityRole: {
					root: {
						codeField: 'Name',
						descField: 'DomainSID',
						itemName: 'Group',
						moduleName: 'usermanagement.group.moduleInfoNameUsermanagementGroup',
						handleUpdateDone: function (updateData, response, data) {
							if (response.Group && response.Group.Version === 1) {
								var item = _.find(data.itemList, function (item) {
									return item.Id === -1;
								});
								_.assign(item, response.Group);
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

		var filters = [
			{
				key: 'basics-company-profit-center-filter',
				fn: function (company, entity) {
					return company.CompanyTypeFk !== 3;
				}
			}
		];

		basicsLookupdataLookupFilterService.registerFilter(filters);

		serviceContainer.service.adDisconnect = function () {
			var selected = serviceContainer.service.getSelected();
			selected.DomainSID = null;
			serviceContainer.service.markItemAsModified(selected);
			serviceContainer.service.gridRefresh();
		};

		return serviceContainer.service;
	}
})(angular);