(function (angular) {
	// eslint-disable-next-line no-redeclare
	/* globals angular,_ */
	'use strict';

	var moduleName = 'constructionsystem.main';

	angular.module(moduleName).factory('constructionsystemMainColumnConfigDetailDataService', [
		'platformDataServiceFactory','mainViewService','PlatformMessenger',
		function (platformDataServiceFactory,mainViewService,PlatformMessenger) {

			var service = {};

			var data = [];

			var itemsToSave = [];

			var itemsToDelete = [];

			var columnConfigId = 0;

			var editType = null;

			angular.extend(service, {
				getList: getList,
				clear: clear,
				setDataList: setDataList,

				refreshGrid: refreshGrid,

				setItemToSave: setItemToSave,
				getItemsToSave: getItemsToSave,
				getItemsToDelete: getItemsToDelete,
				registerListLoaded: registerListLoaded,
				unregisterListLoaded: unregisterListLoaded,
				registerSelectionChanged: registerSelectionChanged,
				unregisterSelectionChanged: unregisterSelectionChanged,
				listLoaded: new PlatformMessenger(),
				selectionChanged: new PlatformMessenger(),
				onUpdateList: new PlatformMessenger(),
				// hasSelection: hasSelection,

				verifyColumnConfigListStatus: verifyColumnConfigListStatus,
				refreshOnColumnConfigIdChanged: refreshOnColumnConfigIdChanged,
				setColumnConfigId: setColumnConfigId,
				getColumnConfigId: getColumnConfigId,

				getContainerData: getContainerData,

				handleOnUpdateSucceeded: handleOnUpdateSucceeded,
				onColumnConfigStatusChange: new PlatformMessenger(),

				// deselect: deselect,

				setEditType: setEditType,
				getEditType: getEditType,
				getModule: getModule,

				setColumnConfigDetailsToViewConfig: setColumnConfigDetailsToViewConfig
			});

			var serviceOption = {
				module: angular.module(moduleName),
				entitySelection: {},
				modification: {multi: {}},
				translation: {
					uid: 'constructionsystemMainColumnConfigDetailDataService',
					title: 'Title',
					columns: [
						{
							header: 'cloud.common.entityDescription',
							field: 'DescriptionInfo'
						}]
				}
			};

			var container = platformDataServiceFactory.createNewComplete(serviceOption);

			container.data.itemList = [];

			angular.extend(service, container.service);

			return service;

			function getList() {
				return data;
			}

			function setDataList(items) {
				if (Array.isArray(items)) {
					angular.forEach(items, function (item) {
						item.MdcCostCodeFkDescription = item.MdcCostCodeFk;
					});
					data = items;
				} else {
					data = [];
				}
			}

			// eslint-disable-next-line no-unused-vars
			function addItem(item) {
				data = data ? data : [];
				data.push(item);
				setItemToSave(item);
				service.refreshGrid();
			}

			function refreshGrid() {
				service.listLoaded.fire();
			}

			// eslint-disable-next-line no-unused-vars
			function updateSelection() {
				service.selectionChanged.fire();
			}

			function registerListLoaded(callBackFn) {
				service.listLoaded.register(callBackFn);
			}

			function unregisterListLoaded(callBackFn) {
				service.listLoaded.unregister(callBackFn);
			}

			function registerSelectionChanged(callBackFn) {
				service.selectionChanged.register(callBackFn);
			}

			function unregisterSelectionChanged(callBackFn) {
				service.selectionChanged.unregister(callBackFn);
			}

			function setItemToSave(item) {
				var modified = _.find(itemsToSave, {Id: item.Id});
				if (!modified) {
					itemsToSave.push(item);
				}
			}

			function getItemsToSave() {
				return itemsToSave.length ? itemsToSave : null;
			}

			function getItemsToDelete() {
				return itemsToDelete.length ? itemsToDelete : null;
			}

			function clear() {
				itemsToSave = [];
				itemsToDelete = [];
			}

			function verifyColumnConfigListStatus(isConflict) {
				var itemsList = service.getList();
				var isValid = true;
				if(!isConflict) {
					angular.forEach(itemsList, function (item) {
						if (!isValid) {
							return;
						}
						var status = false;
						if (item.ColumnId && item.LineType && item.DescriptionInfo && item.DescriptionInfo.Description) {
							if (item.LineType === 1) {
								if (item.MdcCostCodeFk !== null) {
									status = true;
								}
							} else if (item.LineType === 2) {
								if (item.MaterialLineId > 0) {
									status = true;
								}
							}
						}
						isValid = status;
					});
				}else {
					isValid = false;
				}
				service.onColumnConfigStatusChange.fire(isValid);
				return isValid;
			}

			function getColumnConfigId() {
				return columnConfigId;
			}

			function setColumnConfigId(id) {
				columnConfigId = id;
				return columnConfigId;
			}

			function refreshOnColumnConfigIdChanged(columnConfigId){
				setColumnConfigId(columnConfigId);
				// refresh the grid
				service.load();
			}

			function getContainerData(){
				return container.data;
			}

			function handleOnUpdateSucceeded(){

			}

			function setEditType(itemEditType){
				editType =  itemEditType;
			}

			function getEditType(){
				return editType;
			}

			function getModule(){
				return 'constructionsystem.main';
			}

			function setColumnConfigDetailsToViewConfig(uid, estColumnConfigDetailsToSave){
				if(estColumnConfigDetailsToSave === null ||
					estColumnConfigDetailsToSave === undefined ||
					!angular.isArray(estColumnConfigDetailsToSave) ||
					estColumnConfigDetailsToSave.length === 0){
					return;
				}

				var viewConfig = mainViewService.getViewConfig(uid);
				var Propertyconfig = angular.isString(viewConfig.Propertyconfig) ? JSON.parse(viewConfig.Propertyconfig) : angular.isArray(viewConfig.Propertyconfig) ? viewConfig.Propertyconfig : [];
				if(!angular.isArray(Propertyconfig) || Propertyconfig.length === 0){
					return;
				}

				estColumnConfigDetailsToSave.forEach(function (estColumnConfigDetail) {
					var PropertyconfigId = 'ConfDetail' + estColumnConfigDetail.Id.toString();
					for(var i = 0; i < Propertyconfig.length; ++i){
						if(PropertyconfigId === Propertyconfig[i].id){
							Propertyconfig[i].name = estColumnConfigDetail.DescriptionInfo.Description;
							break;
						}
					}
				});

				mainViewService.setViewConfig(uid, Propertyconfig , null, true);
			}
		}]);
})(angular);
