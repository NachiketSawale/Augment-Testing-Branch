/**
 * Created by wui on 12/21/2015.
 */

(function (angular) {
	'use strict';
	/* global globals */

	var moduleName = 'constructionsystem.master';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('constructionsystemMasterScriptDataService', [
		'platformDataServiceFactory',
		'$http',
		'constructionSystemMasterHeaderService',
		'PlatformMessenger',
		'platformPermissionService',
		function (
			platformDataServiceFactory,
			$http,
			constructionSystemMasterHeaderService,
			PlatformMessenger,
			platformPermissionService
		) {
			var serviceOption = {
				flatLeafItem: {
					entityRole: {
						leaf: {
							itemName: 'CosScript',
							parentService: constructionSystemMasterHeaderService
						}
					},
					httpRead: {
						route: globals.webApiBaseUrl + 'constructionsystem/master/script/',
						endRead: 'listorcreate',
						usePostForRead: true,
						initReadData: function (readData) {
							var mainItem = constructionSystemMasterHeaderService.getSelected();
							readData.mainItemId = mainItem.Id;
						}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);

			var service = serviceContainer.service;

			// var data = serviceContainer.data;

			service.currentItem = {
				ScriptData: '',
				ValidateScriptData: ''
			};

			service.setContainerReadOnly = function($scope){
				var permissionUuid = $scope.getContentValue('permission');
				var hasCreate = platformPermissionService.hasCreate(permissionUuid);
				var hasWrite =  platformPermissionService.hasWrite(permissionUuid);
				var hasDelete = platformPermissionService.hasDelete(permissionUuid);
				if (hasWrite || hasCreate || hasDelete){
					service.readonly = false;
				}
				else{
					service.readonly = true;
				}
			};

			service.doHttpListOrCreate = function (mainItemId) {
				return $http.post(globals.webApiBaseUrl + 'constructionsystem/master/script/listorcreate', {
					mainItemId: mainItemId
				});
			};

			service.clear = function () {
				service.currentItem = {
					ScriptData: '',
					ValidateScriptData: ''
				};
			};

			service.executeScript = function () {
				var mainItem = constructionSystemMasterHeaderService.getSelected();
				return $http.post(globals.webApiBaseUrl + 'constructionsystem/master/script/test', {
					Script: service.currentItem.ScriptData,
					CosHeaderFk: mainItem.Id
				}).then(function (response) {
					service.onScriptResultUpdated.fire(response.data);
				});
			};

			service.onScriptResultUpdated = new PlatformMessenger();

			var executionResult = {};

			service.setExecutionResult = function (value) {
				executionResult = value;
				service.onScriptResultUpdated.fire(value);
			};

			service.getExecutionResult = function () {
				return executionResult;
			};

			service.getDefinition = function () {
				return service.currentItem.ScriptData;
			};

			service.setDefinition = function (value) {
				service.currentItem.ScriptData = value;
				service.markItemAsModified(service.currentItem);
			};

			service.registerListLoadStarted(function () {
				service.clear();
			});

			service.registerListLoaded(function () {
				var list = service.getList();

				if (list.length > 0) {
					service.currentItem = list[0];
					service.onScriptResultUpdated.fire([]);
				}
				else {
					service.clear();
				}
			});

			service.onDataChange = function () {
				service.markItemAsModified(service.currentItem);
			};

			return service;
		}
	]);

})(angular);