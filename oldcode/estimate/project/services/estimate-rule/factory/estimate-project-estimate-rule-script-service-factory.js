/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global _ */
	'use strict';

	const moduleName = 'estimate.project';

	/**
	 * @ngdoc Factory
	 * @name
	 * * estimateProjectEstRuleScriptServiceFactory
	 * @function
	 *
	 * @description
	 * Factory for the list view of any kind of entity causing a change in the Estimate rules script
	 **/
	angular.module(moduleName).factory('estimateProjectEstRuleScriptServiceFactory', ['platformDataServiceFactory',
		'$http', 'globals', 'PlatformMessenger',
		function (platformDataServiceFactory, $http,globals, PlatformMessenger) {

			let factoryService = {};

			factoryService.createRuleScriptDataService = function createRuleScriptDataService(options) {
				let parentService = options.parentService,
					entityItemName = _.isString(options.entityItemName) ? options.entityItemName : 'PrjEstRuleScript';
				let parentItemName = options.parentService.getItemName();

				let serviceOption = {
					flatLeafItem: {
						entityRole: {
							leaf: {
								itemName: entityItemName,// todo 'PrjEstRuleScript',
								parentService : parentService
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
					if(updateData[entityItemName+'ToSave']) // .PrjEstRuleScriptToSave){
					{
						angular.forEach(updateData[entityItemName+'ToSave'], function(item){

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

					if(updateData[entityItemName+'ToDelete']) // .PrjEstRuleScriptToDelete){
					{
						angular.forEach(updateData[entityItemName+'ToDelete'], function(item){
							let temp = _.find(currentScriptItems, {Id:item.Id});
							if(temp){
								currentScriptItems.splice(currentScriptItems.indexOf(temp),1);
								currentScriptItems.pop(temp);
							}
						});
					}
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
					if(updateData[parentItemName+'ToDelete']){
						let newPrjEstRuleToDelete = [];
						_.forEach(updateData[parentItemName+'ToDelete'], function(prjEstRuleToDeleteItem){
							let prjEstRuleScriptToDeleteItem =_.find(currentScriptItems,{PrjEstRuleFk: prjEstRuleToDeleteItem.OriginalMainId});

							// restructure the prjEstRuleToDelete To adapt to the prjEstRuleCompleteDto
							if(prjEstRuleScriptToDeleteItem && prjEstRuleScriptToDeleteItem.Version !== 0){
								newPrjEstRuleToDelete.push({
									MainItemId: prjEstRuleToDeleteItem.OriginalMainId,
									PrjEstRule: prjEstRuleToDeleteItem,
									PrjEstRuleScriptToDelete: [prjEstRuleScriptToDeleteItem]
								});
								updateData.EntitiesCount ++;
							}
							else{
								newPrjEstRuleToDelete.push({
									MainItemId: prjEstRuleToDeleteItem.OriginalMainId,
									PrjEstRule: prjEstRuleToDeleteItem
								});
								updateData.EntitiesCount ++;
							}

							// remove the unused data in the currentScriptItems
							if(prjEstRuleScriptToDeleteItem){
								currentScriptItems.pop(prjEstRuleScriptToDeleteItem);
							}
						});

						// remove the unused data in the updateData[entityItemName+'ToDelete']
						updateData[parentItemName+'ToDelete'] = newPrjEstRuleToDelete;
					}

					// To Update or New the PrjEstRuleScript
					_.forEach(currentScriptItems, function(currentScriptItem){
						if(!currentScriptItem || !service.currentItem){
							return;
						}
						if(currentScriptItem.Id === service.currentItem.Id && currentScriptItem.ScriptData !== service.currentItem.ScriptData){
							currentScriptItem.ScriptData = service.currentItem.ScriptData;
						}

						let initialScriptItem = _.find(initialScriptItems, {Id:currentScriptItem.Id});
						if(initialScriptItem && (initialScriptItem.ScriptData !== currentScriptItem.ScriptData)){
							if(updateData[parentItemName+'ToSave']){
								let prjEstRuleToSaveItem =_.find(updateData[parentItemName+'ToSave'],{MainItemId: currentScriptItem.PrjEstRuleFk});

								if(prjEstRuleToSaveItem){
									prjEstRuleToSaveItem.MainItemId = currentScriptItem.PrjEstRuleFk;
									prjEstRuleToSaveItem.PrjEstRuleScriptToSave = [currentScriptItem];
								}
								else{
									updateData[parentItemName+'ToSave'].push({
										MainItemId:currentScriptItem.PrjEstRuleFk,
										PrjEstRuleScriptToSave: [currentScriptItem]
									});
								}
							}
							else{
								updateData[parentItemName+'ToSave'] = [];
								updateData[parentItemName+'ToSave'].push({
									MainItemId:currentScriptItem.PrjEstRuleFk,
									PrjEstRuleScriptToSave: [currentScriptItem]
								});
							}
							updateData.EntitiesCount ++;
						}
					});

					return updateData;
				};

				service.doHttpListOrCreate = function (ruleItem,prjEstRuleFk) {
					if(ruleItem.IsPrjRule){
						return $http.post(globals.webApiBaseUrl + 'estimate/rule/projectestrulescript/listorcreate', {
							PrjEstRuleFk: prjEstRuleFk
						});
					}else{
						return $http.post(globals.webApiBaseUrl + 'estimate/rule/script/listorcreate', {
							EstRuleFk: prjEstRuleFk
						});
					}
				};

				service.load = function () {
					service.mainItem = parentService.getSelected();

					if(service.mainItem){
						service.readonly = service.mainItem.IsPrjRule ? false : 'nocursor';
						service.currentItem = service.mainItem.IsPrjRule ? _.find(currentScriptItems, {PrjEstRuleFk:parentService.getSelected().OriginalMainId}):
							_.find(currentScriptItems, {EstRuleFk:parentService.getSelected().OriginalMainId});
						if(!service.currentItem){
							return service.doHttpListOrCreate(service.mainItem,service.mainItem.OriginalMainId).then(function (response) {
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

				parentService.onUpdateData.register(service.provideUpdateData);

				parentService.registerSelectionChanged(service.load);

				return service;
			};

			return factoryService;
		}
	]);

})(angular);
