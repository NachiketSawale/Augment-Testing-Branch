/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global _ */
	'use strict';

	let moduleName = 'estimate.project';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('estimateProjectEstRuleScriptService', ['platformDataServiceFactory',
		'$http', 'globals', 'PlatformMessenger', 'estimateProjectEstimateRulesService',
		function (platformDataServiceFactory, $http,globals, PlatformMessenger, dataService) {

			let serviceOption = {
				flatLeafItem: {
					entityRole: {
						leaf: {
							itemName: 'PrjEstRuleScript',
							parentService : dataService
						}
					}
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);

			let service = serviceContainer.service;
			service.onFocused = new PlatformMessenger();

			let currentScriptItems = [],
				initialScriptItems = [];

			service.mergeInUpdateData = function doMergeInCustomizeTypeUpdateData(updateData) {
				// update the script items when update successed
				if(updateData.PrjEstRuleScriptToSave){
					angular.forEach(updateData.PrjEstRuleScriptToSave, function(item){

						let temp1 = _.find(currentScriptItems, {Id:item.Id});
						if(temp1){
							currentScriptItems.splice(currentScriptItems.indexOf(temp1),1);
							currentScriptItems.push(item);
						}
						let temp2 = _.find(initialScriptItems, {Id:item.Id});
						if(temp2){
							initialScriptItems.splice(initialScriptItems.indexOf(temp2),1);
							initialScriptItems.push({
								Id:item.Id,
								PrjEstRuleFk: item.PrjEstRuleFk,
								ScriptData: item.ScriptData
							});
						}
					});
				}

				if(updateData.PrjEstRuleScriptToDelete){
					angular.forEach(updateData.PrjEstRuleScriptToDelete, function(item){
						let temp = _.find(currentScriptItems, {Id:item.Id});
						if(temp){
							currentScriptItems.splice(currentScriptItems.indexOf(temp),1);
							currentScriptItems.pop(temp);
						}
					});
				}
				// initialScriptItems = angular.copy(currentScriptItems);
			};

			service.mainItem = null;
			service.readonly = 'nocursor';
			service.currentItem = {
				ScriptData: ''
			};

			service.clear = function () {
				service.currentItem = {
					ScriptData: ''
				};
				service.readonly = 'nocursor';
				initialScriptItems = [];
				currentScriptItems = [];
			};

			service.provideUpdateData = function (updateData) {
				// To Delete the PrjEstRuleScript if updateData has PrjEstRuleToDelete
				if(updateData.PrjEstRuleToDelete){
					let newPrjEstRuleToDelete = [];
					_.forEach(updateData.PrjEstRuleToDelete, function(prjEstRuleToDeleteItem){
						let prjEstRuleScriptToDeleteItem =_.find(currentScriptItems,{PrjEstRuleFk: prjEstRuleToDeleteItem.Id});

						// restructure the prjEstRuleToDelete To adapt to the prjEstRuleCompleteDto
						if(prjEstRuleScriptToDeleteItem && prjEstRuleScriptToDeleteItem.Version !== 0){
							newPrjEstRuleToDelete.push({
								MainItemId: prjEstRuleToDeleteItem.Id,
								PrjEstRule: prjEstRuleToDeleteItem,
								PrjEstRuleScriptToDelete: [prjEstRuleScriptToDeleteItem]
							});
							updateData.EntitiesCount ++;
						}
						else{
							newPrjEstRuleToDelete.push({
								MainItemId: prjEstRuleToDeleteItem.Id,
								PrjEstRule: prjEstRuleToDeleteItem
							});
							updateData.EntitiesCount ++;
						}

						// remove the unused data in the currentScriptItems
						if(prjEstRuleScriptToDeleteItem){
							currentScriptItems.pop(prjEstRuleScriptToDeleteItem);
						}
					});

					// remove the unused data in the updateData.PrjEstRuleToDelete
					updateData.PrjEstRuleToDelete = newPrjEstRuleToDelete;
				}

				// To Update or New the PrjEstRuleScript
				_.forEach(currentScriptItems, function(currentScriptItem){
					if(currentScriptItem.Id === service.currentItem.Id && currentScriptItem.ScriptData !== service.currentItem.ScriptData){
						currentScriptItem.ScriptData = service.currentItem.ScriptData;
					}

					let initialScriptItem = _.find(initialScriptItems, {Id:currentScriptItem.Id});
					if(initialScriptItem && (initialScriptItem.ScriptData !== currentScriptItem.ScriptData)){
						if(updateData.PrjEstRuleToSave){
							let prjEstRuleToSaveItem =_.find(updateData.PrjEstRuleToSave,{MainItemId: currentScriptItem.PrjEstRuleFk});

							if(prjEstRuleToSaveItem){
								prjEstRuleToSaveItem.MainItemId = currentScriptItem.PrjEstRuleFk;
								prjEstRuleToSaveItem.PrjEstRuleScriptToSave = [currentScriptItem];
							}
							else{
								updateData.PrjEstRuleToSave.push({
									MainItemId:currentScriptItem.PrjEstRuleFk,
									PrjEstRuleScriptToSave: [currentScriptItem]
								});
							}
						}
						else{
							updateData.PrjEstRuleToSave = [];
							updateData.PrjEstRuleToSave.push({
								MainItemId:currentScriptItem.PrjEstRuleFk,
								PrjEstRuleScriptToSave: [currentScriptItem]
							});
						}
						updateData.EntitiesCount ++;
					}
				});

				return updateData;
			};

			service.doHttpListOrCreate = function (prjEstRuleFk) {
				return $http.post(globals.webApiBaseUrl + 'estimate/rule/projectestrulescript/listorcreate', {
					PrjEstRuleFk: prjEstRuleFk
				});
			};

			service.load = function () {
				service.mainItem = dataService.getSelected();

				if(service.mainItem){
					service.readonly = false;

					service.currentItem = _.find(currentScriptItems, {PrjEstRuleFk:dataService.getSelected().Id});
					if(!service.currentItem){
						return service.doHttpListOrCreate(service.mainItem.Id).then(function (response) {
							service.currentItem = response.data;
							currentScriptItems.push(service.currentItem);
							initialScriptItems.push({
								Id:service.currentItem.Id,
								PrjEstRuleFk: service.currentItem.PrjEstRuleFk,
								ScriptData: service.currentItem.ScriptData
							});
						});
					}
					else{
						_.forEach(currentScriptItems, function(currentScriptItem){
							if(currentScriptItem.Id === service.currentItem.Id && currentScriptItem.ScriptData !== service.currentItem.ScriptData){
								currentScriptItem.ScriptData = service.currentItem.ScriptData;
							}
						});
					}

				}
				else{
					service.clear();
				}
			};

			dataService.onUpdateData.register(service.provideUpdateData);

			dataService.registerSelectionChanged(service.load);
			return service;
		}
	]);

})(angular);
