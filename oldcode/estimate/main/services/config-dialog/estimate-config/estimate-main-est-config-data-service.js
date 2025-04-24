/**
 * Created by joshi on 08.04.2016.
 */

(function () {
	/* global globals */
	'use strict';

	let moduleName = 'estimate.main';
	/**
	 * @ngdoc service
	 * @name estimateMainEstConfigDataService
	 * @function
	 *
	 * @description
	 * estimateMainEstConfigDataService is the data service for  EStimate configuration dialog functions.
	 */
	angular.module(moduleName).factory('estimateMainEstConfigDataService', [
		'$http', 'PlatformMessenger', 'estimateMainEstConfigTypeService',
		function ($http, PlatformMessenger, estimateMainEstConfigTypeService) {

			let currentItem = {},
				completeData = {};

			let service = {
				load:load,
				loadComplete:loadComplete,
				loadCompleteById:loadCompleteById,
				setData : setData,
				clear : clear,
				provideUpdateData : provideUpdateData,
				setIsUpdEstConfig : setIsUpdEstConfig,
				onEstConfigChange : new  PlatformMessenger(),
				onItemChange : new  PlatformMessenger()
			};


			// load estimate config item by configTypeId
			function load(configTypeId){
				// get est config type item
				return estimateMainEstConfigTypeService.getItemByIdAsync(configTypeId).then(function(item){
					if(item && item.Id){
						return $http.get(globals.webApiBaseUrl + 'estimate/main/config/getconfigbyid?id='+item.EstConfigFk).then(function(response){
							let data = {
								EstConfig:response.data,
								EstConfigType:item
							};
							setData(data);
							return currentItem;
						});
					}
				});
			}

			// load estimate config complete data including column config, structure by configTypeId
			function loadComplete(configTypeId){
				return $http.get(globals.webApiBaseUrl + 'estimate/main/completeconfig/getbyconfigtype?typeId='+configTypeId).then(function(response){
					setData(response.data);
					return response.data;
				});
			}

			// load estimate config complete data including column config, structure by configId
			function loadCompleteById(configTypeId,configId){
				return $http.get(globals.webApiBaseUrl + 'estimate/main/completeconfig/getbyconfigid?configId='+configId+'&configTypeId='+configTypeId).then(function(response){
					setData(response.data);
					return response.data;
				});
			}

			// set estimate config type, config data
			function setData(data){
				completeData = {
					EstConfig:data.EstConfig,
					EstConfigType:data.EstConfigType
				};

				// currentItem.isEditEstType = false;
				currentItem.estConfigTypeFk = completeData.EstConfigType ? completeData.EstConfigType.Id: 0;

				let estConfig = completeData.EstConfig;
				if(estConfig && estConfig.Id){
					currentItem.estConfigDesc = estConfig.DescriptionInfo ? estConfig.DescriptionInfo.Translated : null;
					currentItem.isColumnConfig = estConfig.IsColumnConfig;
					currentItem.boqWicCatFk = estConfig.WicCatFk;
					currentItem.estStructTypeFk = estConfig.EstStructureTypeFk;
					currentItem.estUppConfigTypeFk = estConfig.EstUppConfigTypeFk;
				}

				let headerEstConfigTypeFk = data.EstHeader ? data.EstHeader.EstConfigtypeFk : null;
				let headerEstConfigFk =  data.EstHeader ? data.EstHeader.EstConfigFk : null;

				currentItem.isEditEstType = !headerEstConfigTypeFk && !!headerEstConfigFk;

				completeData.IsUpdEstConfig = !!completeData.EstConfig;

				estimateMainEstConfigTypeService.loadData(data.editType);

				service.onItemChange.fire(currentItem);
			}

			// provide current estimate config type, config updateData
			function provideUpdateData(updateData){
				angular.extend(updateData, completeData);
				if(updateData.isEditEstType){
					updateData.IsDefaultConfig = false;
					updateData.EstConfigType = null;
					// updateData.EstConfig.IsColumnConfig = updateData.isEstColumnConfig;
					setEstConfig(updateData);

				}else{
					setEstConfig(updateData);
					updateData.IsDefaultConfig = true;
				}
			}

			function setEstConfig(updateData){
				updateData.EstConfig = updateData.EstConfig || {};
				updateData.EstConfig.IsColumnConfig = updateData.isColumnConfig;
				updateData.EstConfig.DescriptionInfo = updateData.EstConfig.DescriptionInfo || {};
				updateData.EstConfig.DescriptionInfo.Translated = updateData.estConfigDesc;
				updateData.EstConfig.DescriptionInfo.Modified = true;
				updateData.EstConfig.WicCatFk = updateData.boqWicCatFk;
			}

			// set IsUpdEstConfig status
			function setIsUpdEstConfig(isUpdEstConfig){
				completeData.IsUpdEstConfig = isUpdEstConfig;
			}

			function clear(){
				currentItem = {};
				completeData = {};
			}
			return service;
		}
	]);
})();
