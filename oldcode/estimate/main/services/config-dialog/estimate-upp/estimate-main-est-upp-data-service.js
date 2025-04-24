/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals _ */
	'use strict';

	let moduleName = 'estimate.main';
	/**
	 * @ngdoc service
	 * @name estimateMainEstStructureDataService
	 * @function
	 *
	 * @description
	 * This is the data service for  Estimate Upp dialog functions.
	 */
	angular.module(moduleName).factory('estimateMainEstUppDataService', ['$q', '$http','$injector', 'PlatformMessenger', 'estimateMainEstUppConfigTypeService', 'estimateMainUpp2CostcodeDetailDataService','dialogUserSettingService',
		function ($q, $http, $injector, PlatformMessenger, estimateMainEstUppConfigTypeService, uppDetailDataService,dialogUserSettingService) {

			let currentItem = {},
				completeData = {},
				uppConfigs = [],
				dialogId = '35d0a55074b54c72b7d148b5f8d0ad4f';

			let service = {
				load: load,
				loadByContextId: loadByContextId,
				loadByConfigId: loadByConfigId,
				setData: setData,
				clear : clear,
				updateUPPDetails: updateUPPDetails,
				getUppConfig: getUppConfig,
				getUpp2CostcodeDetails: getUpp2CostcodeDetails,
				provideUpdateData: provideUpdateData,
				loadByEstNBoq: loadByEstNBoq,
				loadByDefault: loadByDefault,
				onItemChange: new PlatformMessenger(),
				setCurrentScope: setCurrentScope,
				getCurrentScope: getCurrentScope
			};

			let scope = null;

			function setCurrentScope($scope){
				scope = $scope;
			}

			function getCurrentScope(){
				return scope;
			}

			service.getDialogId = function getDialogId(){
				return dialogId;
			}

			// load complete estimate structure by typeId
			function load(typeId) {
				estimateMainEstUppConfigTypeService.setSelectedItemId(typeId);
				// get est upp config and details
				return estimateMainEstUppConfigTypeService.getItemByIdAsync(typeId).then(function (item) {
					if (item && item.Id) {
						let uppConfigFk = item.UppConfigFk ? item.UppConfigFk : 0;
						uppDetailDataService.mdcContextIdContainer.setMdcContextId(item.ContextFk);

						let cache = _.find(uppConfigs, {Id: uppConfigFk});
						let q = cache ? $q.when(cache) : $http.get(globals.webApiBaseUrl + 'estimate/main/uppconfig/complete?uppConfigFk=' + uppConfigFk);
						return q.then(function (response) {
							response.data.EstUppConfigType = item;
							setData(response.data);

							if(!cache){uppConfigs.push({Id: uppConfigFk, data: response.data});}

							return currentItem;
						});
					}
				});
			}

			function loadByContextId(typeId, ignoreEvent){
				estimateMainEstUppConfigTypeService.setSelectedItemId(typeId);
				// get est upp config and details
				return estimateMainEstUppConfigTypeService.getItemByContextIdAsync(typeId).then(function (item) {
					if (item && item.Id) {
						let uppConfigFk = item.EstUppConfigFk ? item.EstUppConfigFk : 0;
						uppDetailDataService.mdcContextIdContainer.setMdcContextId(item.ContextFk);

						let cache = _.find(uppConfigs, {Id: uppConfigFk});
						let q = cache ? $q.when(cache) : $http.get(globals.webApiBaseUrl + 'estimate/main/uppconfig/complete?uppConfigFk=' + uppConfigFk);
						return q.then(function (response) {
							response.data.EstUppConfigType = item;
							setData(response.data, ignoreEvent);

							if(!cache){uppConfigs.push({Id: uppConfigFk, data: response.data});}

							return currentItem;
						});
					}
				});
			}

			function loadByConfigId(configId, EstUppConfigTypeId) {
				let cache = _.find(uppConfigs, {Id: configId});
				let q = cache ? $q.when(cache) : $http.get(globals.webApiBaseUrl + 'estimate/main/uppconfig/complete?uppConfigFk=' + configId);

				return q.then(function (response) {
					if(!response.data.EstUppConfigType && EstUppConfigTypeId){
						return estimateMainEstUppConfigTypeService.getItemByContextIdAsync(EstUppConfigTypeId).then(function (item) {
							response.data.EstUppConfigType = item;
							setData(response.data);

							if(!cache){uppConfigs.push({Id: configId, data: response.data});}

							return currentItem;
						});
					}else{
						setData(response.data);
					}

					return currentItem;
				});
			}

			function loadByEstNBoq(typeId, boqHeaderId){
				if(scope) {scope.isLoading = true;}
				let estHeaderId = $injector.get('estimateMainService').getSelectedEstHeaderId();
				return $http.get(globals.webApiBaseUrl + 'estimate/main/estboq2uppconfig/getestboq2uppconfig?estHeaderId='+estHeaderId+'&boqHeaderId=' + boqHeaderId).then(function (response){
					if(response && response.data !== null && response.data !== ''){
						uppDetailDataService.setIsCurrentBoqUppConfiged(!response.data.EstUppConfigtypeFk);
						if(typeId){
							return loadByContextId(typeId);
						}else{
							return loadByConfigId(response.data.EstUppConfigFk, response.data.EstUppConfigtypeFk).then(function (){
								// currentItem.estUppConfigTypeFk = null;
								return currentItem;
							});
						}
					}else{
						uppDetailDataService.setIsCurrentBoqUppConfiged(false);
						if(typeId){
							return loadByContextId(typeId);
						}else{
							return estimateMainEstUppConfigTypeService.getListAsync().then(function (data){
								if(data && data.length > 0){
									let defaultItems = _.filter(data, {IsDefault:true, IsLive:true});
									return defaultItems && defaultItems.length > 0 ? loadByContextId(defaultItems[0].Id) : loadByContextId(data[0].Id);
								}else{
									return loadByConfigId(0,0);
								}
							});
						}
					}
				});
			}

			function loadByDefault(){
				uppDetailDataService.clear();
				if(scope) {scope.isLoading = true;}
				$injector.get('salesCommonBaseBoqLookupService').getSalesBaseBoqList().then(function (data){
					if(data && data.length > 0){
						let item = data[0];
						currentItem.BoqId = item.Id;
						currentItem.BoqHeaderId = item.BoqHeader.Id;
						loadByEstNBoq(null, item.BoqHeader.Id);
					}else{
						// no project boq
						scope.isLoading = false;
						service.onItemChange.fire(currentItem);
					}
				});
			}

			// set estimate config type, config data
			function setData(data, ignoreEvent) {
				completeData = {
					EstUppConfigType: data.EstUppConfigType,
					EstUppConfig: data.EstUppConfig,
					EstUpp2CostCodeDetails: data.EstUpp2CostCodeDetails
				};

				let dialogConfig = $injector.get('estimateMainDialogProcessService').getDialogConfig();
				// let currentEntity = $injector.get('estimateMainDialogDataService').getCurrentItem();
				currentItem.isEditUppType = (dialogConfig.editType && dialogConfig.editType === 'customizeforupp')
					// || (currentEntity && currentEntity.isEditUppType)
					|| uppDetailDataService.getIsCurrentBoqUppConfiged()
					||currentItem.isEditUppType;

				// currentItem.estUppConfigTypeFk = completeData.EstUppConfigType ? completeData.EstUppConfigType.Id : (currentItem.estUppConfigTypeFk ? currentItem.estUppConfigTypeFk : 0);
				currentItem.estUppConfigTypeFk = completeData.EstUppConfigType ? completeData.EstUppConfigType.Id : 0;
				if(currentItem.estUppConfigTypeFk && currentItem.estUppConfigTypeFk > 0) {
					estimateMainEstUppConfigTypeService.setSelectedItemId(currentItem.estUppConfigTypeFk);
				}

				if(dialogConfig.editType === 'estBoqUppConfig'){
					currentItem.estUppConfigDesc = completeData.EstUppConfig ? completeData.EstUppConfig.DescriptionInfo.Translated : null;
					currentItem.estUppConfig = completeData.EstUppConfig ? completeData.EstUppConfig : null;
				}else {
					currentItem.estUppConfigDesc = completeData.EstUppConfig ? completeData.EstUppConfig.DescriptionInfo.Translated : (currentItem.estUppConfigDesc ? currentItem.estUppConfigDesc : null);
					currentItem.estUppConfig = completeData.EstUppConfig ? completeData.EstUppConfig : (currentItem.estUppConfig ? currentItem.estUppConfig : null);
				}

				currentItem.estUpp2CostCodeDetails = completeData.EstUpp2CostCodeDetails ? completeData.EstUpp2CostCodeDetails : [];

				completeData.IsUpdUpp = !!completeData.EstUppConfig;

				if(!ignoreEvent) {
					service.onItemChange.fire(currentItem);
				}
			}

			// provide current estimate config type, config updateData
			function provideUpdateData(data) {
				angular.extend(data, completeData);
				if (data.isEditUppType) {
					data.IsDefaultUpp = false;
					data.EstUppConfigType = completeData.EstUppConfigType;
					if (!data.EstUppConfig || (data.BoqHeaderId && !uppDetailDataService.getIsCurrentBoqUppConfiged())) {
						data.EstUppConfig = {'DescriptionInfo': {}};
						data.IsUpdUpp = false;
					}
					data.EstUppConfig.DescriptionInfo.Description = data.estUppConfigDesc;
					data.EstUppConfig.DescriptionInfo.Translated = data.estUppConfigDesc;
					data.EstUppConfig.DescriptionInfo.Modified = true;
					// All to update/save/delete will be handled by EstUpp2CostCodeDetails
					// update specific structure
					// if (data.IsUpdUpp) {
					// data.EstUpp2CostCodeDetailsToSave = uppDetailDataService.getItemsToSave();
					// data.EstUpp2CostCodeDetailsToDelete = uppDetailDataService.getItemsToDelete();
					// data.EstUpp2CostCodeDetailsToUpdate = uppDetailDataService.getItemsToUpdate();
					// }
					// else {
					// data.EstUpp2CostCodeDetailsToSave = uppDetailDataService.getItemsToSave();
					// }
					data.EstUpp2CostCodeDetails = uppDetailDataService.getFlatList();
					data.estUpp2CostCodeDetails = [];
				} else {
					data.IsDefaultUpp = true;
				}

				saveDialogSettings();

				function saveDialogSettings() {
					dialogUserSettingService.setCustomConfig(dialogId, 'IsDisabled', data.IsDisabled);
					dialogUserSettingService.setCustomConfig(dialogId, 'IsFixedPrice', data.IsFixedPrice);
					dialogUserSettingService.setCustomConfig(dialogId, 'IsAQOptionalItems', data.IsAQOptionalItems);
					dialogUserSettingService.setCustomConfig(dialogId, 'IsDayWork', data.IsDayWork);
				}
			}

			function getUppConfig() {
				return completeData.EstUppConfig;
			}

			function getUpp2CostcodeDetails() {
				return completeData.EstUpp2CostCodeDetails;
			}

			function updateUPPDetails(items) {
				completeData.EstUpp2CostCodeDetails = items;
				currentItem.estUpp2CostCodeDetails = items;
				// service.onItemChange.fire(currentItem);
			}

			function clear(){
				currentItem = {};
				completeData = {};
				uppConfigs = [];
			}
			return service;
		}
	]);
})();
