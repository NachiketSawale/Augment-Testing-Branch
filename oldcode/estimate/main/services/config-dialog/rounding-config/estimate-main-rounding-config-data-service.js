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
	 * @name estimateMainRoundingConfigDataService
	 * @function
	 *
	 * @description
	 * This is the data service for  Estimate Rounding Configuration dialog functions.
	 */
	angular.module(moduleName).factory('estimateMainRoundingConfigDataService', ['$http', 'PlatformMessenger', 'estimateMainRoundingConfigTypeLookupService', 'estimateMainRoundingConfigDetailDataService', 'platformDataServiceFactory',
		function ($http, PlatformMessenger, roundingConfigTypeLookupService, roundingConfigDetailDataService, platformDataServiceFactory) {

			let currentItem = {},
				completeData = {};

			let service = {
				load:load,
				setData : setData,
				clear : clear,
				updateRoundingConfigDetails : updateRoundingConfigDetail,
				getRoundingConfig:getRoundingConfig,
				getRoundingConfigDetail:getRoundingConfigDetail,
				provideUpdateData : provideUpdateData,
				setIsUpdRoundingConfig : setIsUpdRoundingConfig,
				onItemChange : new  PlatformMessenger()
			};

			let serviceOption = {
				module: angular.module(moduleName),
				entitySelection: {},
				modification: {multi: {}},
				translation: {
					uid: 'estimateMainRoundingConfigDetailDataService',
					title: 'Title',
					columns: [
						{
							header: 'cloud.common.entityDescription',
							field: 'DescriptionInfo'
						}]
				}
			};

			let container = platformDataServiceFactory.createNewComplete(serviceOption);
			container.data.itemList = [];
			angular.extend(service, container.service);
			return service;


			// load complete estimate Rounding Config by typeId
			function load(typeId){
				if(typeId === null){
					return $http.get(globals.webApiBaseUrl + 'estimate/main/roundingconfigcomplete/complete?roundingConfigFk='+0).then(function(response){
						setData(response.data);
						return currentItem;
					});
				}
				roundingConfigTypeLookupService.setSelectedItemId(typeId);
				// get est Rounding Config and detail
				return roundingConfigTypeLookupService.getItemByIdAsync(typeId).then(function(item){
					if(item && item.Id){
						return $http.get(globals.webApiBaseUrl + 'estimate/main/roundingconfigcomplete/complete?roundingConfigFk='+item.EstimateRoundingConfigFk).then(function(response){
							response.data.EstRoundingConfigType = item;
							setData(response.data);

							return currentItem;
						});
					}
				});
			}

			// set estimate config type, config data
			function setData(data){
				completeData = {
					EstRoundingConfigType:data.EstRoundingConfigType,
					EstRoundingConfig:data.EstRoundingConfig,
					EstRoundingConfigDetails:data.EstRoundingConfigDetails
				};
				currentItem.estRoundingConfigTypeFk = completeData.EstRoundingConfigType ? completeData.EstRoundingConfigType.Id : 0;
				roundingConfigTypeLookupService.setSelectedItemId(currentItem.estRoundingConfigTypeFk);
				currentItem.estRoundingConfigDesc = completeData.EstRoundingConfig ? completeData.EstRoundingConfig.DescriptionInfo.Translated : null;
				currentItem.estRoundingConfigDetail = completeData.EstRoundingConfigDetails? completeData.EstRoundingConfigDetails: [];

				let estRoundingConfigFk = data.EstConfig ? data.EstConfig.EstRoundingConfigFk : null;
				let estRoundingConfigTypeFk =data.EstConfig ? data.EstConfig.EstRoundingConfigTypeFk : null;

				currentItem.isEditRoundingConfigType = !!(!estRoundingConfigTypeFk && !!estRoundingConfigFk);
				// completeData.isEditRoundingConfigType = currentItem.isEditRoundingConfigType;
				// completeData.IsDefaultRoundingConfig = !currentItem.isEditRoundingConfigType;
				completeData.IsUpdRoundingConfig = !!completeData.EstRoundingConfig;

				let contextId = 0;
				if(data.ContextFk > 0){
					contextId = data.ContextFk;
				}
				else if(data.EstConfigType) {
					contextId = data.EstConfigType.MdcContextFk;
				}

				roundingConfigDetailDataService.setDataList(currentItem.estRoundingConfigDetail);

				roundingConfigTypeLookupService.setMdcContextId(contextId);
				roundingConfigTypeLookupService.setSelectedItemId(currentItem.estRoundingConfigTypeFk);

				roundingConfigTypeLookupService.loadData();

				service.onItemChange.fire(currentItem);
			}

			// provide current estimate config type, config updateData
			function provideUpdateData(data){
				angular.extend(data, completeData);
				data.IsDefaultRoundingConfig = !data.isEditRoundingConfigType;
				data.EstRoundingConfigType = completeData.EstRoundingConfigType;
				if(!data.EstRoundingConfig){
					data.EstRoundingConfig = {'DescriptionInfo':{}};
				}
				data.EstRoundingConfig.DescriptionInfo.Description = data.estRoundingConfigDesc;
				data.EstRoundingConfig.DescriptionInfo.Translated = data.estRoundingConfigDesc;
				data.EstRoundingConfig.DescriptionInfo.Modified = true;

				data.IsUpdRoundingConfig = completeData.IsUpdRoundingConfig;
				// update specific RoundingConfig
				data.EstRoundingConfigDetailToSave = roundingConfigDetailDataService.getItemsToSave();
			}

			function getRoundingConfig(){
				return completeData.EstRoundingConfig;
			}

			function getRoundingConfigDetail(){
				return completeData.EstRoundingConfigDetails;
			}

			function updateRoundingConfigDetail(items){
				completeData.EstRoundingConfigDetails = items;
				currentItem.estRoundingConfigDetail = items;
				service.onItemChange.fire(currentItem);
			}

			function setIsUpdRoundingConfig(isUpdRoundingConfig){
				completeData.IsUpdRoundingConfig = isUpdRoundingConfig;
			}

			function clear(){
				currentItem = {};
				completeData = {};
				roundingConfigTypeLookupService.clearMdcContextId();
			}
		}
	]);
})();
