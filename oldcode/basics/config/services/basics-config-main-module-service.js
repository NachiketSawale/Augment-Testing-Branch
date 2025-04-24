/**
 * Created by sandu on 31.03.2015.
 */
(function (angular) {

	'use strict';

	var moduleName = 'basics.config';
	var configModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name basicsConfigMainService
	 * @function
	 *
	 * @description
	 * main data service for all config related functionality.
	 */

	configModule.service('basicsConfigMainService', basicsConfigMainService);

	basicsConfigMainService.$inject = ['platformDataServiceFactory', '$q', '$http', 'basicsConfigNavCommandbarService'];

	function basicsConfigMainService(platformDataServiceFactory, $q, $http, basicsConfigNavCommandbarService) {

		var sidebarSearchOptions = {
			moduleName: moduleName,
			pattern: '',
			pageSize: 500,
			includeNonActiveItems: false,
			showOptions: true,
			showProjectContext: false,
			withExecutionHints: false
		};

		var serviceFactoryOptions = {
			flatRootItem: {
				module: configModule,
				serviceName: 'basicsConfigMainService',
				httpRead: {
					route: globals.webApiBaseUrl + 'basics/config/',
					endRead: 'listFiltered',
					usePostForRead: true
				},
				httpCreate: {route: globals.webApiBaseUrl + 'basics/config/', endCreate: 'createModule'},
				httpUpdate: {route: globals.webApiBaseUrl + 'basics/config/', endUpdate: 'updateModule'},
				httpDelete: {route: globals.webApiBaseUrl + 'basics/config/', endDelete: 'deleteModule'},
				entityRole: {
					root: {
						codeField: 'DescriptionInfo.Translated',
						descField: 'InternalName',
						itemName: 'Module',
						moduleName: 'cloud.desktop.moduleDisplayNameBasicsConfig',
						handleUpdateDone: function (updateData, response, data) {
							basicsConfigNavCommandbarService.resetCache();
						}
					}
				},
				translation: {
					uid: 'basicsConfigMainService',
					title: 'basics.config.moduleListTitle',
					columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
					dtoScheme: { typeName: 'ModuleDto', moduleSubModule: 'Basics.Config' }
				},
				sidebarSearch: {options: sidebarSearchOptions},
				actions: {}
			}
		};

		var serviceContainer = platformDataServiceFactory.createNewComplete(serviceFactoryOptions);

		/**
		 *
		 * @returns {*}
		 */
		serviceContainer.service.getSelectedModuleId = function () {

			var selectedModule = serviceContainer.service.getSelected();
			if (selectedModule && selectedModule.Id) {
				return selectedModule.Id;
			}
		};

		var service = serviceContainer.service;

		function filter(list, key) {
			return _.find(list, function getByModuleId(moduleItem) {
				if (_.isNumber(key)) {
					return moduleItem.Id === key;
				}
				return moduleItem.InternalName === key;
			});
		}

		/**
		 *
		 * @param key
		 * @returns {*}
		 */
		service.getByModuleId = function (key) {
			var defer = $q.defer();
			var list = service.getList();
			if (_.isEmpty(list) || !filter(list, key)) {
				$http.get(globals.webApiBaseUrl + 'basics/config/listAll').then(function then(result) {
					service.setList(result.data);
					serviceContainer.data.doClearModifications(null, serviceContainer.data);
					defer.resolve(filter(result.data, key));
				});
			} else {
				defer.resolve(filter(list, key));
			}
			return defer.promise;
		};

		var filteredList = [];

		service.getByModuleIdSync = function (key) {
			return filter(filteredList, key);
		};

		service.getAll = function () {
			return $http.get(globals.webApiBaseUrl + 'basics/config/listAll').then(function (result) {
				service.setList(result.data);
			});
		};

		service.getByModuleNames = function (modulesNames) {
			return $http.post(globals.webApiBaseUrl + 'basics/config/listbyinternalnamelist', {ModuleNames: modulesNames}).then(function (result) {
				filteredList = result.data;
				return filteredList;
			});
		};

		return serviceContainer.service;
	}
})(angular);
