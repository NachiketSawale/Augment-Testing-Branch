(function (angular) {
	// eslint-disable-next-line no-redeclare
	/* globals angular,globals */
	'use strict';

	var moduleName = 'constructionsystem.main';

	angular.module(moduleName).factory('constructionsystemMainColumnConfigDataService',[
		'$http', 'PlatformMessenger', 'estimateMainColumnConfigTypeService', '$injector', 'estimateMainDialogDataService',
		'constructionsystemMainColumnConfigDetailDataService', 'estimateMainCostCodeAssignmentDetailLookupDataService',
		function ($http, PlatformMessenger, estimateMainColumnConfigTypeService, $injector, estimateMainDialogDataService,
			constructionsystemMainColumnConfigDetailDataService, estimateMainCostCodeAssignmentDetailLookupDataService) {
			var currentItem = {},
				completeData = {};

			var columnConfigGridDetails = {
				columnConfigGridId: ''
			};

			var service = {
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
						var estColumnConfigFk = item.ColumnconfigFk ? item.ColumnconfigFk : 0;
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
				var data = completeItemData.EstColumnConfigComplete || {};

				completeData = {
					estColumnConfig: data.estColumnConfig || null,
					estColumnConfigType: data.estColumnConfigType || null,
					estColumnConfigDetailsToSave: data.estColumnConfigDetailsToSave || null,
					estColumnConfigDetailsToDelete: data.estColumnConfigDetailsToDelete || null
				};

				currentItem.estColConfigTypeFk = completeData.estColumnConfigType ? completeData.estColumnConfigType.Id : 0;
				var contextId = 0;
				if(completeItemData.ContextFk > 0){
					contextId = completeItemData.ContextFk;
				}
				else if(completeItemData.EstConfigType) {
					contextId = completeItemData.EstConfigType.MdcContextFk;
				}

				estimateMainColumnConfigTypeService.setMdcContextId(contextId);
				estimateMainColumnConfigTypeService.setSelectedItemId(currentItem.estColConfigTypeFk);
				estimateMainCostCodeAssignmentDetailLookupDataService.setContextId(completeData.estColumnConfigType ? completeData.estColumnConfigType.ContextFk : contextId);
				currentItem.columnConfigDesc = data.estColumnConfig ? data.estColumnConfig.DescriptionInfo.Translated : null;
				currentItem.columnConfigId = completeData.estColumnConfig ? completeData.estColumnConfig.Id : 0;
				currentItem.estColumnConfigDetails = completeData.estColumnConfigDetailsToSave ? completeData.estColumnConfigDetailsToSave : [];

				currentItem.estConfigColumnConfigFk = completeData.estColumnConfig ? completeData.estColumnConfig.Id : 0;
				currentItem.estConfigColumnConfigTypeFk = completeData.estColumnConfigType ? completeData.estColumnConfigType.Id : 0;

				var estColumnConfigFk = completeItemData.EstConfig ? completeItemData.EstConfig.EstColumnConfigFk : null;
				var estColumnConfigTypeFk = completeItemData.EstConfig ? completeItemData.EstConfig.EstColumnConfigTypeFk : null;

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

				service.onItemChange.fire(currentItem);
			}

			function setColumnConfigGridId(columnConfigGridId) {
				columnConfigGridDetails.columnConfigGridId = columnConfigGridId;
			}

			function setDetailColumnConfigId(id) {
				// set the column id
				constructionsystemMainColumnConfigDetailDataService.setColumnConfigId(id);
			}

			// provide current estimate config type, config updateData
			function provideUpdateData(currentItem) {
				var saveData = {};
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

				if (!constructionsystemMainColumnConfigDetailDataService.verifyColumnConfigListStatus()) {
					return false;
				}
				saveData.estColumnConfigDetailsToSave = constructionsystemMainColumnConfigDetailDataService.getList();
				saveData.estColumnConfigDetailsToDelete = constructionsystemMainColumnConfigDetailDataService.getItemsToDelete();

				currentItem.EstColumnConfigComplete = angular.copy(saveData);
				saveData = null;
				return true;
			}

			function columnConfigTypeChanged(currentItem) {
				var typeItem = estimateMainColumnConfigTypeService.getItemById(currentItem.estColConfigTypeFk);
				if (typeItem) {
					currentItem.columnConfigDesc = typeItem.DescriptionInfo.Description;
					constructionsystemMainColumnConfigDetailDataService.refreshOnColumnConfigIdChanged(typeItem.EstColumnConfigFk);

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
				constructionsystemMainColumnConfigDetailDataService.clear();
				estimateMainColumnConfigTypeService.clearMdcContextId();
			}

			function setIsUpdColumnConfig(isUpdColumnConfig) {
				completeData.IsUpdColumnConfig = isUpdColumnConfig;
			}

			function getColumnConfigDetails() {
				return completeData.estColumnConfigDetailsToSave;
			}

			return service;
		}]);
})(angular);
