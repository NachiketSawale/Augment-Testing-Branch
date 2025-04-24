/**
 * $Id: boq-main-rounding-config-data-service.js 46191 2022-07-14 17:40:38Z joshi $
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals */
	'use strict';

	let moduleName = 'boq.main';
	/**
	 * @ngdoc service
	 * @name boqMainRoundingConfigDataService
	 * @function
	 *
	 * @description
	 * This is the data service for Boq Rounding Configuration dialog functions.
	 */
	angular.module(moduleName).factory('boqMainRoundingConfigDataService', ['$http', '$injector', '_', 'PlatformMessenger', 'boqMainRoundingConfigTypeLookupService', 'boqMainRoundingConfigDetailDataService', 'platformDataServiceFactory',
		function ($http, $injector, _,PlatformMessenger, roundingConfigTypeLookupService, roundingConfigDetailDataService, platformDataServiceFactory) {

			let currentItem = {},
				completeData = {},
				isCustomize = false,
				dialogMode = '',
				isRoundingConfigInUse = false,
				mdcLineItemContext = null,
				modified = false;

			let service = {
				load:load,
				setData : setData,
				clear : clear,
				updateRoundingConfigDetails : updateRoundingConfigDetail,
				getRoundingConfig:getRoundingConfig,
				getRoundingConfigDetail:getRoundingConfigDetail,
				provideUpdateData : provideUpdateData,
				setIsUpdRoundingConfig : setIsUpdRoundingConfig,
				isCustomize: getIsCustomize,
				getDialogMode: getDialogMode,
				isReadOnly: isReadOnly,
				maintainReadOnlyState: maintainReadOnlyState,
				getCurrentItem: getCurrentItem,
				isModified: isModified,
				setModified: setModified,
				onItemChange : new  PlatformMessenger()
			};

			let serviceOption = {
				module: angular.module(moduleName),
				entitySelection: {},
				modification: {multi: {}},
				translation: {
					uid: 'boqMainRoundingConfigDetailDataService',
					title: 'Title',
					columns: [{ header: 'cloud.common.entityDescription', field: 'DescriptionInfo' }],
					dtoScheme: { moduleSubModule: 'Boq.Main', typeName: 'BoqRoundingConfigDto' }
				}
			};

			let container = platformDataServiceFactory.createNewComplete(serviceOption);
			container.data.itemList = [];
			angular.extend(service, container.service);
			return service;


			// load complete boq Rounding Config by typeId
			function load(typeId){
				roundingConfigTypeLookupService.setSelectedItemId(typeId);
				// get boq Rounding Config and detail
				return roundingConfigTypeLookupService.getItemByIdAsync(typeId).then(function(item){
					if(item && item.Id){
						return $http.get(globals.webApiBaseUrl + 'boq/main/type/getboqroundingconfigbyid?id='+item.BoqRoundingConfigFk).then(function(response){
							response.data.BoqRoundingConfigType = item;
							setData(response.data, isCustomize, dialogMode, isRoundingConfigInUse);

							return currentItem;
						});
					}
				});
			}

			function resetCurrentItem(item) {
				if(_.isObject(item)) {
					Object.keys(item).forEach(key => delete item[key]);
					item.boqRoundingConfigTypeFk = null;
					item.boqRoundingConfigDesc = null;
					item.boqRoundingConfigDetail = [];
					item.isEditRoundingConfigType = false;
				}
			}

			// set boq config type, config data
			function setData(data, iscustomize, dlgMode, isRCInUse, lineItemContextFk){

				if(!_.isObject(data) || _.isEmpty(data)) {
					completeData = {};

					// !! Attention !!
					// For the current item is potentially already delivered as "dataItem" to the corresponding rounding dialog config
					// we cannot set a new empty currentItem object here for this would break the connection to the dialog form.
					// So we simply reset the properties to an initial state.
					resetCurrentItem(currentItem);

					if(_.isBoolean(iscustomize)) {
						isCustomize = iscustomize;
					}
					if(_.isBoolean(isRCInUse)) {
						isRoundingConfigInUse = isRCInUse;
					}

					if(_.isNumber(lineItemContextFk) && lineItemContextFk > 0){
						mdcLineItemContext = lineItemContextFk;

						roundingConfigTypeLookupService.setMdcContextId(mdcLineItemContext);
						roundingConfigTypeLookupService.setSelectedItemId(currentItem.boqRoundingConfigTypeFk);

						roundingConfigTypeLookupService.loadData();
					}

					// Maintain readonly state of different properties
					maintainReadOnlyState();

					service.onItemChange.fire(currentItem);

					return currentItem;
				}

				isCustomize = iscustomize;
				dialogMode = dlgMode;
				isRoundingConfigInUse = isRCInUse;

				completeData = {
					BoqRoundingConfigType:data.BoqRoundingConfigType,
					BoqRoundingConfig:data,
					BoqRoundingConfigDetail:data.BoqRoundingconfigdetailEntities
				};
				currentItem.boqRoundingConfigTypeFk = _.isObject(completeData.BoqRoundingConfigType) ? completeData.BoqRoundingConfigType.Id : null;
				roundingConfigTypeLookupService.setSelectedItemId(currentItem.boqRoundingConfigTypeFk);
				// currentItem.isEditRoundingConfigType = false;
				currentItem.boqRoundingConfigDesc = !_.isEmpty(completeData.BoqRoundingConfig) ? completeData.BoqRoundingConfig.DescriptionInfo.Translated : null;
				currentItem.boqRoundingConfigDetail = completeData.BoqRoundingConfigDetail ? completeData.BoqRoundingConfigDetail: [];

				let boqRoundingConfigFk = data.Id;

				currentItem.isEditRoundingConfigType = (_.isNumber(boqRoundingConfigFk) && boqRoundingConfigFk > 0) && !_.isNumber(currentItem.boqRoundingConfigTypeFk);

				completeData.IsUpdRoundingConfig = !!completeData.BoqRoundingConfig;

				if(lineItemContextFk > 0){
					mdcLineItemContext = lineItemContextFk;
				}
				else if(data.BoqRoundingConfigType) {
					mdcLineItemContext = data.BoqRoundingConfigType.LineItemContextFk;
				}

				roundingConfigTypeLookupService.setMdcContextId(mdcLineItemContext);
				roundingConfigTypeLookupService.setSelectedItemId(currentItem.boqRoundingConfigTypeFk);

				roundingConfigTypeLookupService.loadData();

				service.onItemChange.fire(currentItem);

				// Maintain readonly state of different properties
				maintainReadOnlyState();

				return currentItem;
			}

			function maintainReadOnlyState() {
				let platformRuntimeDataService = $injector.get('platformRuntimeDataService');
				let boqMainDocPropertiesService = $injector.get('boqMainDocPropertiesService');
				let boqPropertiesMode = (dialogMode === 'boqProperties') && !isCustomize;
				let customizePropertiesMode = (dialogMode === 'boqProperties') && isCustomize;
				let roundingConfigTypeMode = (dialogMode === 'boqRoundingConfigType') && isCustomize;
				let allFields = ['boqRoundingConfigTypeFk', 'isEditRoundingConfigType', 'boqRoundingConfigDesc'];
				let fields = _.map(allFields, function (field) {
					var isReadonly = false;
					if (field === 'boqRoundingConfigTypeFk') {
						isReadonly = roundingConfigTypeMode || boqMainDocPropertiesService.arePropertiesReadOnly(true); /* || currentItem.isEditRoundingConfigType */
					}
					else if(field === 'isEditRoundingConfigType') {
						isReadonly = (!roundingConfigTypeMode && boqMainDocPropertiesService.arePropertiesReadOnly(true)) || !_.isNumber(currentItem.boqRoundingConfigTypeFk);
					}
					else if(field === 'boqRoundingConfigDesc') {
						isReadonly = (roundingConfigTypeMode && isRoundingConfigInUse) || ((boqPropertiesMode || customizePropertiesMode) && !currentItem.isEditRoundingConfigType);
					}

					return {field: field, readonly: isReadonly};
				});

				platformRuntimeDataService.readonly(currentItem); // clear previous readonly state
				platformRuntimeDataService.readonly(currentItem, fields);
			}

			// provide current boq config type, config updateData
			function provideUpdateData(data){
				angular.extend(data, completeData);
				data.IsEditRoundingConfigType = currentItem.isEditRoundingConfigType;
				data.BoqRoundingConfigType = completeData.BoqRoundingConfigType;
				if(!data.BoqRoundingConfig){
					data.BoqRoundingConfig = {'DescriptionInfo':{}};
				}
				data.BoqRoundingConfig.DescriptionInfo.Description = currentItem.boqRoundingConfigDesc;
				data.BoqRoundingConfig.DescriptionInfo.Translated = currentItem.boqRoundingConfigDesc;
				data.BoqRoundingConfig.DescriptionInfo.Modified = true;

				data.BoqRoundingConfigDetailsToSave = roundingConfigDetailDataService.getItemsToSave();
			}

			function getRoundingConfig(){
				return completeData.BoqRoundingConfig;
			}

			function getRoundingConfigDetail(){
				return completeData.BoqRoundingConfigDetail;
			}

			function getIsCustomize(){
				return isCustomize;
			}

			function getDialogMode(){
				return dialogMode;
			}

			function isReadOnly() {
				if(isCustomize && dialogMode === 'boqRoundingConfigType') {
					return isRoundingConfigInUse;
				}

				if(dialogMode === 'boqProperties') {
					if(isCustomize) {
						return true;
					}

					let boqMainDocPropertiesService = $injector.get('boqMainDocPropertiesService');
					return boqMainDocPropertiesService.arePropertiesReadOnly(currentItem.isEditRoundingConfigType) || !currentItem.isEditRoundingConfigType;
				}

				return true;
			}

			function updateRoundingConfigDetail(items){
				completeData.BoqRoundingConfigDetail = items;
				currentItem.BoqRoundingConfigDetail = items; // boqStructureConfigDetails
				// service.onItemChange.fire(currentItem);
			}

			function setIsUpdRoundingConfig(isUpdRoundingConfig){
				completeData.IsUpdRoundingConfig = isUpdRoundingConfig;
			}

			function getCurrentItem() {
				return currentItem;
			}

			function setModified(ismodified) {
				modified = ismodified;
			}

			function isModified() {
				return modified;
			}

			function clear(){
				// The following approach is taken for the sake of keeping the according object reference alive, but deleting its properties
				Object.keys(currentItem).forEach(key => delete currentItem[key]);
				Object.keys(completeData).forEach(key => delete completeData[key]);
			}
		}
	]);
})();
