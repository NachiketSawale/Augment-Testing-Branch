/**
 * Created by ong on 27.04.2022.
 */
(function () {
	'use strict';

	const moduleName = 'basics.config';
	const configModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name basicsConfigNavCommandbarService
	 * @function
	 *
	 * @description
	 *
	 */
	configModule.factory('basicsConfigNavCommandbarService', basicsConfigNavCommandbarService);
	basicsConfigNavCommandbarService.$inject = ['$http', '$log', '$q', 'platformContextService'];

	function basicsConfigNavCommandbarService($http, $log, $q, platformContextService) {
		const service = {};

		service.moduleConfigurations = {};

		service.resetCache = function () {
			service.moduleConfigurations = {};
		};

		// commandBar, navBar, commandbarPortal, navbarPortal- true, false or null
		service.saveModuleConfig = function (moduleName, commandBar, navBar, commandbarPortal, navbarPortal) {
			let dto = {
				InternalName: moduleName,
				CommandBar: commandBar,
				NavBar: navBar,
				CommandBarPortal: commandbarPortal,
				NavBarPortal: navbarPortal
			};
			return $http({
				method: 'POST',
				url: globals.webApiBaseUrl + 'basics/config/saveModuleConfig',
				data: dto
			}).then(function (result) {
				delete service.moduleConfigurations[moduleName];
				return result.data;
			}, function (error) {
				$log.error(error);
			});
		};

		service.saveDefaultConfig = function(navbarItems, commandBarItems, internalName) {
			if(!platformContextService.isLoggedIn) {
				// prevent from additional 401 errors after logout
				return;
			}

			let combarDtos = [];
			let navbarDtos = [];
			let sortOrder = 0;

			_.forEach(commandBarItems, function(item) {
				combarDtos.push(
					{
						TranslationKey: item.caption$tr$ ? item.caption$tr$ : item.caption,
						Visibility: !item.hideItem,
						SortOrder: sortOrder,
						Code: item.id.replace('#', ''),
						BuildVersion: globals.buildversion
					});
				sortOrder += 1;
			});

			sortOrder = 0;
			_.forEach(navbarItems, function(item) {
				navbarDtos.push(
					{
						TranslationKey: item.description$tr$,
						Visibility: item.visible,
						Code: item.key,
						SortOrder: sortOrder,
						IsMenuItem: item.group === 'defaultOptions' ? true : false,
						BuildVersion: globals.buildversion
					});
				sortOrder += 1;
			});
			return $http({
				method: 'POST',
				url: globals.webApiBaseUrl + 'basics/config/savedefaultconfig',
				data: {'CommandbarItems': combarDtos, 'NavbarItems': navbarDtos, 'InternalName': internalName, 'IsPortal': globals.portal}
			}).then(function (response) {
				delete service.moduleConfigurations[moduleName];
				return response.data;
			}, function (error) {
				$log.error(error);
			});
		};

		service.getNavBarConfig = function (moduleInternalName) {
			if (service.navbarConfigurations.hasOwnProperty(moduleInternalName)) {
				return $q.when(service.navbarConfigurations[moduleInternalName]);
			}
			return $http({
				method: 'GET',
				url: globals.webApiBaseUrl + 'basics/config/navbar/listbyinternalname',
				params: {'internalName': moduleInternalName, 'isPortal': globals.portal}
			}).then(function (response) {
				service.navbarConfigurations[moduleInternalName] = response.data;
				return response.data;
			}, function (error) {
				$log.error(error);
			});
		};

		service.getCommandBarConfig = function (moduleName) {
			// if (service.combarConfigurations.hasOwnProperty(moduleName)) {
			//	return $q.when(service.combarConfigurations[moduleName]);
			// }
			return $http({
				method: 'GET',
				url: globals.webApiBaseUrl + 'basics/config/commandbar/listbyinternalname',
				params: {'internalName': moduleName, 'isPortal': globals.portal}
			}).then(function (response) {
				// service.combarConfigurations[moduleName] = response.data;
				return response.data;
			}, function (error) {
				$log.error(error);
			});
		};

		service.getModuleConfig = function (moduleInternalName) {
			if (service.moduleConfigurations.hasOwnProperty(moduleInternalName)) {
				return $q.when(service.moduleConfigurations[moduleInternalName]);
			}
			return $http({
				method: 'GET',
				url: globals.webApiBaseUrl + 'basics/config/listmodulenavcomconfig',
				params: {'internalName': moduleInternalName}
			}).then(function (response) {
				service.moduleConfigurations[moduleInternalName] = response.data;
				return response.data;
			}, function (error) {
				$log.error(error);
			});
		};

		service.getModuleListApi = function () {
			return $http({
				method: 'GET',
				url: globals.webApiBaseUrl + 'basics/config/listAll'
			}).then(function (response) {
				return response.data;
			});
		};

		return service;
	}
})(angular);