/**
 * Created by wui on 12/21/2015.
 */

(function (angular) {
	'use strict';

	let moduleName = 'estimate.rule';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('estimateRuleScriptDataService', ['_', 'platformDataServiceFactory',
		'$http', 'globals', 'PlatformMessenger', 'estimateRuleService',
		function (_, platformDataServiceFactory, $http,globals, PlatformMessenger, estimateRuleService) {

			let serviceOption = {
				flatLeafItem: {
					entityRole: {
						leaf: {
							itemName: 'EstRuleScript',
							parentService : estimateRuleService
						}
					}
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);

			let service = serviceContainer.service;

			service.mainItem = null;
			service.readonly = 'nocursor';
			service.currentItem = {
				ScriptData: ''
			};
			service.onFocused = new PlatformMessenger();

			let currentScriptItems = [],
				initialScriptData = '';

			service.provideUpdateData = function (updateData) {
				// To Update or New the PrjEstRuleScript
				if(service.currentItem && initialScriptData !== service.currentItem.ScriptData){
					updateData.EstRuleScriptToSave = [service.currentItem];
					updateData.EntitiesCount += 1;
				}
			};

			service.doHttpListOrCreate = function (estRuleFk) {
				return $http.post(globals.webApiBaseUrl + 'estimate/rule/script/listorcreate', {
					EstRuleFk: estRuleFk
				});
			};

			service.clear = function () {
				service.currentItem = {
					ScriptData: ''
				};
				service.readonly = 'nocursor';
				currentScriptItems = [];
				initialScriptData = '';
			};

			service.mergeInUpdateData = function doMergeInCustomizeTypeUpdateData(updateData) {
				if(updateData.EstRuleScriptToSave){
					service.currentItem = updateData.EstRuleScriptToSave[0];
					let temp = _.find(currentScriptItems, {PrjEstRuleFk:service.mainItem.Id});
					if(temp){
						currentScriptItems.pop(temp);
					}
					currentScriptItems.push(service.currentItem);
					initialScriptData = service.currentItem.ScriptData;
				}
			};

			service.load = function () {
				service.mainItem = estimateRuleService.getSelected();
				if (service.mainItem) {
					service.readonly = false;
					service.currentItem = _.find(currentScriptItems, {PrjEstRuleFk:service.mainItem.Id});
					if(!service.currentItem){
						return service.doHttpListOrCreate(service.mainItem.Id).then(function (response) {
							service.currentItem = response.data;
							initialScriptData = service.currentItem.ScriptData;
							currentScriptItems.push(service.currentItem);
						});
					}
					else{
						initialScriptData = service.currentItem.ScriptData;
					}
				}
				else{
					service.clear();
				}
			};

			estimateRuleService.registerSelectionChanged(service.load);

			service.load();

			return service;
		}
	]);

})(angular);
