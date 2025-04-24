/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals */
	'use strict';

	let moduleName = 'estimate.main';
	/**
	 * @ngdoc service
	 * @name estimateMainCostBudgetDataService
	 * @function
	 *
	 * @description
	 * This is the data service for  Estimate Cost budget dialog functions.
	 */
	angular.module(moduleName).factory('estimateMainCostBudgetDataService', ['$http', '$injector', 'PlatformMessenger', 'estimateMainCostBudgetConfigTypeService', 'estimateMainCostBudgetAssignDetailDataService',
		function ($http, $injector, PlatformMessenger, estimateMainCostBudgetConfigTypeService, costBudgetDetailDataService) {

			let currentItem = {},
				completeData = {};

			let service = {
				load:load,
				setData : setData,
				clear : clear,
				updateCostBudgetAssignDetails : updateCostBudgetAssignDetails,
				getCostBudgetConfig:getCostBudgetConfig,
				getCostBudgetAssignDetails:getCostBudgetAssignDetails,
				provideUpdateData : provideUpdateData,
				setIsUpdCostBudget : setIsUpdCostBudget,
				onItemChange : new  PlatformMessenger()
			};


			// load complete estimate cost budget by typeId
			function load(typeId){
				estimateMainCostBudgetConfigTypeService.setSelectedItemId(typeId);
				// get est cost budget config and details
				return estimateMainCostBudgetConfigTypeService.getItemByIdAsync(typeId).then(function(item){
					if(item && item.Id){
						$injector.get('estimateMainEstColumnConfigCostCodesLookupService').updateListByMdcContextId(item.ContextFk);
						return $http.get(globals.webApiBaseUrl + 'estimate/main/costbudgetconfig/complete?configFk='+item.EstCostBudgetConfigFk).then(function(response){
							response.data.EstCostBudgetType = item;
							setData(response.data);

							return currentItem;
						});
					}
				});
			}

			// set estimate config type, config data
			function setData(data){
				completeData = {
					EstCostBudgetType:data.EstCostBudgetType,
					EstCostBudgetConfig:data.EstCostBudgetConfig,
					EstCostBudgetAssignDetails:data.EstCostBudgetAssignDetails
				};
				currentItem.costBudgetConfigTypeFk = completeData.EstCostBudgetType ? completeData.EstCostBudgetType.Id : 0;
				estimateMainCostBudgetConfigTypeService.setSelectedItemId(currentItem.costBudgetConfigTypeFk);
				currentItem.costBudgetConfigDesc = completeData.EstCostBudgetConfig ? completeData.EstCostBudgetConfig.DescriptionInfo.Translated : null;
				currentItem.costBudgetConfigFactor = completeData.EstCostBudgetConfig ? completeData.EstCostBudgetConfig.Factor : 1;
				currentItem.costBudgetAssignDetails = completeData.EstCostBudgetAssignDetails? completeData.EstCostBudgetAssignDetails: [];

				let estCostBudgetConfigFk = data.EstConfig ? data.EstConfig.EstCostBudgetConfigFk : null;
				let estCostBudgetTypeFk = data.EstConfig ? data.EstConfig.EstCostBudgetTypeFk : null;

				currentItem.isEditCostBudgetConfigType = !!(!estCostBudgetTypeFk && !!estCostBudgetConfigFk);

				completeData.IsUpdCostBudget = !!completeData.EstCostBudgetConfig;
				let contextId = currentItem.costBudgetConfigTypeFk > 0 ? data.EstCostBudgetType.ContextFk : 0;
				if(contextId <= 0 && data.contextId > 0){
					contextId = data.contextId;
				}
				else if(data.EstConfigType) {
					contextId = data.EstConfigType.MdcContextFk;
				}
				estimateMainCostBudgetConfigTypeService.setMdcContextId(contextId);
				estimateMainCostBudgetConfigTypeService.loadData();

				service.onItemChange.fire(currentItem);
			}

			// provide current estimate config type, config updateData
			function provideUpdateData(data){
				angular.extend(data, completeData);
				data.IsDefaultCostBudget = !data.isEditCostBudgetConfigType;
				data.EstCostBudgetType = completeData.EstCostBudgetType;
				if(!data.EstCostBudgetConfig){
					data.EstCostBudgetConfig = {'DescriptionInfo':{}};
				}
				data.EstCostBudgetConfig.DescriptionInfo.Description = data.costBudgetConfigDesc;
				data.EstCostBudgetConfig.DescriptionInfo.Translated = data.costBudgetConfigDesc;
				data.EstCostBudgetConfig.DescriptionInfo.Modified = true;
				data.EstCostBudgetConfig.Factor = data.costBudgetConfigFactor;

				data.IsUpdCostBudget = completeData.IsUpdCostBudget;
				// update specific cost budget
				if(data.IsUpdCostBudget){
					data.EstCostBudgetAssignDetailsToSave = costBudgetDetailDataService.getItemsToSave();
					data.EstCostBudgetAssignDetailsToDelete = costBudgetDetailDataService.getItemsToDelete();
				}
				else {
					data.EstCostBudgetAssignDetailsToSave = costBudgetDetailDataService.getItemsToSave();
				}
			}

			function getCostBudgetConfig(){
				return completeData.EstCostBudgetConfig;
			}

			function getCostBudgetAssignDetails(){
				return completeData.EstCostBudgetAssignDetails;
			}

			function updateCostBudgetAssignDetails(items){
				completeData.EstCostBudgetAssignDetails = items;
				currentItem.costBudgetAssignDetails = items;
				// service.onItemChange.fire(currentItem);
			}

			function setIsUpdCostBudget(isUpdCostBudget){
				completeData.IsUpdCostBudget = isUpdCostBudget;
			}

			function clear(){
				currentItem = {};
				completeData = {};
			}
			return service;
		}
	]);
})();
