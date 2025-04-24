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
	 * @name estimateMainEstStructureDataService
	 * @function
	 *
	 * @description
	 * This is the data service for  Estimate Structure dialog functions.
	 */
	angular.module(moduleName).factory('estimateMainEstStructureDataService', ['$http','PlatformMessenger', 'estimateMainEstStructureTypeService', 'estimateMainStructureConfigDetailDataService',
		function ($http,PlatformMessenger, estimateMainEstStructureTypeService, strDetailDataService) {

			let currentItem = {},
				completeData = {};

			let service = {
				load:load,
				setData : setData,
				clear : clear,
				updateStrDetails : updateStrDetails,
				getStructureConfig:getStructureConfig,
				getStructureDetails:getStructureDetails,
				provideUpdateData : provideUpdateData,
				setIsUpdStructure : setIsUpdStructure,
				onItemChange : new  PlatformMessenger()
			};


			// load complete estimate structure by typeId
			function load(typeId){
				estimateMainEstStructureTypeService.setSelectedItemId(typeId);
				// get est structure config and details
				return estimateMainEstStructureTypeService.getItemByIdAsync(typeId).then(function(item){
					if(item && item.Id){
						return $http.get(globals.webApiBaseUrl + 'estimate/main/structureconfig/complete?strConfigFk='+item.StructureconfigFk).then(function(response){
							response.data.EstStructureType = item;
							setData(response.data);

							return currentItem;
						});
					}
				});
			}

			// set estimate config type, config data
			function setData(data){
				completeData = {
					EstStructureType:data.EstStructureType,
					EstStructureConfig:data.EstStructureConfig,
					EstStructureDetails:data.EstStructureDetails
				};
				currentItem.estStructTypeFk = completeData.EstStructureType ? completeData.EstStructureType.Id : 0;
				estimateMainEstStructureTypeService.setSelectedItemId(currentItem.estStructTypeFk);
				currentItem.estStructConfigDesc = completeData.EstStructureConfig ? completeData.EstStructureConfig.DescriptionInfo.Translated : null;
				currentItem.getQuantityTotalToStructure = completeData.EstStructureConfig ? completeData.EstStructureConfig.GetQuantityTotalToStructure : false;
				currentItem.estStructureConfigDetails = completeData.EstStructureDetails? completeData.EstStructureDetails: [];

				let estStructureConfigFk = data.EstConfig ? data.EstConfig.EstStructureConfigFk : null;
				let estStructureTypeFk =data.EstConfig ? data.EstConfig.EstStructureTypeFk : null;

				currentItem.isEditStructType = !!(!estStructureTypeFk && !!estStructureConfigFk);
				currentItem.EstAllowanceAssignmentEntities = data.EstAllowanceAssignmentEntities;

				currentItem.EstAllowanceConfigFk =data.EstAllowanceConfigFk;
				currentItem.EstAllowanceConfigTypeFk =data.EstAllowanceConfigTypeFk;
				completeData.IsUpdStructure = !!completeData.EstStructureConfig;

				estimateMainEstStructureTypeService.loadData();

				service.onItemChange.fire(currentItem);
			}

			// provide current estimate config type, config updateData
			function provideUpdateData(data){
				angular.extend(data, completeData);
				data.IsDefaultStructure = !data.isEditStructType;
				data.EstStructureType = completeData.EstStructureType;
				if(!data.EstStructureConfig){
					data.EstStructureConfig = {'DescriptionInfo':{}};
				}
				data.EstStructureConfig.DescriptionInfo.Description = data.estStructConfigDesc;
				data.EstStructureConfig.DescriptionInfo.Translated = data.estStructConfigDesc;
				data.EstStructureConfig.DescriptionInfo.Modified = true;

				data.EstStructureConfig.GetQuantityTotalToStructure = data.getQuantityTotalToStructure;

				data.IsUpdStructure = completeData.IsUpdStructure;
				// update specific structure
				if(data.IsUpdStructure){
					data.EstStructDetailsToSave = strDetailDataService.getItemsToSave();
					data.EstStructDetailsToDelete = strDetailDataService.getItemsToDelete();
				}
				else {
					data.EstStructDetailsToSave = strDetailDataService.getItemsToSave();
				}
			}

			function getStructureConfig(){
				return completeData.EstStructureConfig;
			}

			function getStructureDetails(){
				return completeData.EstStructureDetails;
			}

			function updateStrDetails(items){
				completeData.EstStructureDetails = items;
				currentItem.estStructureConfigDetails = items;
				// service.onItemChange.fire(currentItem);
			}

			function setIsUpdStructure(isUpdStructure){
				completeData.IsUpdStructure = isUpdStructure;
			}

			function clear(){
				currentItem = {};
				completeData = {};
			}
			return service;
		}
	]);
})();
