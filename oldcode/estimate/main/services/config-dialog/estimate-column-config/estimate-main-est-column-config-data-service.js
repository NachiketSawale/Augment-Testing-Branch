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
	 * @name estimateMainEstColumnConfigDataService
	 * @function
	 *
	 * @description
	 * estimateMainEstColumnConfigDataService is the data service for  EStimate configuration dialog functions.
	 */
	angular.module(moduleName).factory('estimateMainEstColumnConfigDataService', [
		'_', '$http', 'PlatformMessenger', 'estimateMainColumnConfigTypeService', '$injector', 'estimateMainDialogDataService',
		'estimateMainEstColumnConfigDetailDataService', 'estimateMainCostCodeAssignmentDetailLookupDataService','estimateAllowanceAssignmentConfigTypeDataService',
		function (_, $http, PlatformMessenger, estimateMainColumnConfigTypeService, $injector, estimateMainDialogDataService,
			estimateMainEstColumnConfigDetailDataService, estimateMainCostCodeAssignmentDetailLookupDataService,estimateAllowanceAssignmentConfigTypeDataService) {

			let currentItem = {},
				completeData = {};

			let columnConfigGridDetails = {
				columnConfigGridId: ''
			};

			let service = {
				load: load,
				setData: setData,
				clear: clear,
				getColumnConfigDetails: getColumnConfigDetails,
				getColumnConfigData: getColumnConfigData,
				columnConfigTypeChanged: columnConfigTypeChanged,
				isEditColConfigTypeChanged: isEditColConfigTypeChanged,
				setIsUpdColumnConfig: setIsUpdColumnConfig,
				detailGridIsEditable: detailGridIsEditable,
				provideUpdateData: provideUpdateData,
				setColumnConfigGridId: setColumnConfigGridId,
				onItemChange: new PlatformMessenger(),
				onColumnConfigStatusChange: new PlatformMessenger()
			};


			// load estimate config item by configTypeId
			function load(typeId) {
				estimateMainColumnConfigTypeService.setSelectedItemId(typeId);
				return estimateMainColumnConfigTypeService.getItemByIdAsync(typeId).then(function (item) {
					if (item && item.Id) {
						let estColumnConfigFk = item.ColumnconfigFk ? item.ColumnconfigFk : 0;
						return $http.get(globals.webApiBaseUrl + 'estimate/main/columnconfig/complete?columnConfigFk=' + estColumnConfigFk).then(function (response) {
							response.data.EstColumnConfigComplete.estColumnConfigType = item;
							setData(response.data);
							return currentItem;
						});
					}
				});
			}

			// set estimate config type, config data
			function setData(completeItemData) {
				let data = completeItemData.EstColumnConfigComplete || {};

				completeData = {
					estColumnConfig: data.estColumnConfig || null,
					estColumnConfigType: data.estColumnConfigType || null,
					estColumnConfigDetailsToSave: data.estColumnConfigDetailsToSave || null,
					estColumnConfigDetailsToDelete: data.estColumnConfigDetailsToDelete || null
				};

				currentItem.estColConfigTypeFk = completeData.estColumnConfigType ? completeData.estColumnConfigType.Id : 0;
				let contextId = 0;
				if(completeItemData.ContextFk > 0){
					contextId = completeItemData.ContextFk;
				}
				else if(completeItemData.EstConfigType) {
					contextId = completeItemData.EstConfigType.MdcContextFk;
				}

				estimateMainColumnConfigTypeService.setMdcContextId(contextId);
				estimateMainColumnConfigTypeService.setSelectedItemId(currentItem.estColConfigTypeFk);

				estimateAllowanceAssignmentConfigTypeDataService.setMdcContextId(contextId);
				let estAllowanceConfigTypeFk = completeItemData.EstConfig? completeItemData.EstConfig.EstAllowanceConfigTypeFk:null;
				estimateAllowanceAssignmentConfigTypeDataService.setSelectedItemId(estAllowanceConfigTypeFk);
				$injector.get('estimateAllowanceAssignmentGridService').setSource('customizeforall');
				$injector.get('estimateAllowanceAssignmentGridService').setMdcContextId(contextId);

				estimateMainCostCodeAssignmentDetailLookupDataService.setContextId(completeData.estColumnConfigType ? completeData.estColumnConfigType.ContextFk : contextId);
				currentItem.columnConfigDesc = data.estColumnConfig ? data.estColumnConfig.DescriptionInfo.Translated : null;
				currentItem.columnConfigId = completeData.estColumnConfig ? completeData.estColumnConfig.Id : 0;
				currentItem.estColumnConfigDetails = completeData.estColumnConfigDetailsToSave ? completeData.estColumnConfigDetailsToSave : [];

				currentItem.estConfigColumnConfigFk = completeData.estColumnConfig ? completeData.estColumnConfig.Id : 0;
				currentItem.estConfigColumnConfigTypeFk = completeData.estColumnConfigType ? completeData.estColumnConfigType.Id : 0;

				let estColumnConfigFk = completeItemData.EstConfig ? completeItemData.EstConfig.EstColumnConfigFk : null;
				let estColumnConfigTypeFk = completeItemData.EstConfig ? completeItemData.EstConfig.EstColumnConfigTypeFk : null;

				if (!estColumnConfigTypeFk && !!estColumnConfigFk) {
					currentItem.isEditColConfigType = true;
					completeData.isEditColConfigType = true;
				}
				else {
					completeData.isEditColConfigType = false;
					currentItem.isEditColConfigType = false;
				}

				completeData.IsUpdColumnConfig = !!completeData.estColumnConfig;

				// set the column id
				setDetailColumnConfigId(currentItem.columnConfigId);

				estimateMainColumnConfigTypeService.loadData();
				estimateAllowanceAssignmentConfigTypeDataService.loadData();

				service.onItemChange.fire(currentItem);
			}

			function setColumnConfigGridId(columnConfigGridId) {
				columnConfigGridDetails.columnConfigGridId = columnConfigGridId;
			}

			function setDetailColumnConfigId(id) {
				// set the column id
				estimateMainEstColumnConfigDetailDataService.setColumnConfigId(id);
			}

			// provide current estimate config type, config updateData
			function provideUpdateData(currentItem) {
				let saveData = {};
				saveData.IsDefaultColConfig = !completeData.isEditColConfigType;
				saveData.estColumnConfig = angular.copy(completeData.estColumnConfig) || null;

				if(!saveData.estColumnConfig) {
					saveData.estColumnConfig = {'DescriptionInfo': {}};
				}
				// saveData.estColumnConfig.DescriptionInfo.Description = currentItem.columnConfigDesc;
				saveData.estColumnConfig.DescriptionInfo.Translated = currentItem.columnConfigDesc;
				saveData.estColumnConfig.DescriptionInfo.Modified = true;
				saveData.estColumnConfigType = completeData.estColumnConfigType;

				saveData.IsUpdColumnConfig = completeData.IsUpdColumnConfig;

				if (!estimateMainEstColumnConfigDetailDataService.verifyColumnConfigListStatus()) {
					return false;
				}

				// Handle project cost code before saving
				let configDetailsToSave = angular.copy(estimateMainEstColumnConfigDetailDataService.getList());
				_.forEach(configDetailsToSave, function(configDetailToSave){
					if (configDetailToSave.IsCustomProjectCostCode===true){
						configDetailToSave.Project2mdcCstCdeFk = configDetailToSave.MdcCostCodeFk;
						configDetailToSave.MdcCostCodeFk = null;
					}else{
						configDetailToSave.Project2mdcCstCdeFk = null;
					}
				});
				saveData.estColumnConfigDetailsToSave = configDetailsToSave;
				saveData.estColumnConfigDetailsToDelete = estimateMainEstColumnConfigDetailDataService.getItemsToDelete();

				currentItem.EstColumnConfigComplete = angular.copy(saveData);
				saveData = null;
				return true;
			}

			function columnConfigTypeChanged(currentItem) {
				let typeItem = estimateMainColumnConfigTypeService.getItemById(currentItem.estColConfigTypeFk);
				if (typeItem) {
					currentItem.columnConfigDesc = typeItem.DescriptionInfo.Description;
					estimateMainEstColumnConfigDetailDataService.refreshOnColumnConfigIdChanged(typeItem.EstColumnConfigFk);

				}
			}

			function detailGridIsEditable() {
				return completeData.isEditColConfigType;
			}

			function getColumnConfigData() {
				return completeData;
			}

			function isEditColConfigTypeChanged(currentItem) {
				completeData.isEditColConfigType = currentItem.isEditColConfigType;
			}

			// clear tmp data after save
			function clear() {
				currentItem = {};
				completeData = {};
				estimateMainEstColumnConfigDetailDataService.clear();
				estimateMainColumnConfigTypeService.clearMdcContextId();
				estimateAllowanceAssignmentConfigTypeDataService.clearMdcContextId();
				$injector.get('estimateAllowanceAssignmentGridService').setSource(null);
			}

			function setIsUpdColumnConfig(isUpdColumnConfig) {
				completeData.IsUpdColumnConfig = isUpdColumnConfig;
			}

			function getColumnConfigDetails() {
				return completeData.estColumnConfigDetailsToSave;
			}

			return service;
		}
	]);
})();
