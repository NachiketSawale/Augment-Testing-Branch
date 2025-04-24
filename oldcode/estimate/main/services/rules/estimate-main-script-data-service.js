/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/* global globals */
	let moduleName = 'estimate.main';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('estimateMainScriptDataService', ['platformDataServiceFactory',
		'$http',
		'constructionSystemMasterHeaderService',
		'PlatformMessenger',
		function (platformDataServiceFactory,
			$http,
			constructionSystemMasterHeaderService,
			PlatformMessenger) {

			let serviceOption = {
				flatLeafItem: {
					entityRole: {
						leaf: {
							itemName: 'CosScript',
							parentService: constructionSystemMasterHeaderService
						}
					}
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);

			let service = serviceContainer.service;

			let data = serviceContainer.data;

			service.mainItem = null;
			service.readonly = 'nocursor';
			service.currentItem = {
				ScriptData: '',
				ValidateScriptData: ''
			};

			let initialScriptData = '';
			let initialValidationScriptData = '';

			service.provideUpdateData = function (updateData) {
				if (service.collectTestInput.fire(service.currentItem) ||
                    initialScriptData !== service.currentItem.ScriptData ||
                    initialValidationScriptData !== service.currentItem.ValidateScriptData) {
					updateData.CosScriptToSave = [service.currentItem];
					updateData.EntitiesCount += 1;
					// make mergeInLeafUpdateData work as it depend "data.itemList".
					data.itemList = [service.currentItem];
					initialScriptData = service.currentItem.ScriptData;
					initialValidationScriptData = service.currentItem.ValidateScriptData;
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
				service.readonly = 'nocursor';
				initialScriptData = '';
				initialValidationScriptData = '';
			};

			service.load = function () {
				service.mainItem = constructionSystemMasterHeaderService.getSelected();
				service.clear();
				if (service.mainItem) {
					service.readonly = false;
					return service.doHttpListOrCreate(service.mainItem.Id).then(function (response) {
						service.currentItem = response.data;
						service.currentItem.readonly = false;
						initialScriptData = service.currentItem.ScriptData;
						initialValidationScriptData = service.currentItem.ValidateScriptData;
					});
				}
			};

			service.executeScript = function () {
				return $http.post(globals.webApiBaseUrl + 'constructionsystem/master/script/test', {
					Script: service.currentItem.ScriptData,
					CosHeaderFk: service.mainItem.Id
				}).then(function (response) {
					service.onScriptResultUpdated.fire(response.data);
				});
			};

			service.onScriptResultUpdated = new PlatformMessenger();
			service.collectTestInput = new PlatformMessenger();

			let executionResult = {};

			service.setExecutionResult = function (value) {
				executionResult = value;
				service.onScriptResultUpdated.fire(value);
			};

			service.getExecutionResult = function () {
				return executionResult;
			};

			constructionSystemMasterHeaderService.registerSelectionChanged(service.load);

			service.load();

			return service;
		}
	]);

})(angular);
