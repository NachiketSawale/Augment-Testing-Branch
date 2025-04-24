/**
 * Created by lnt on 8/3/2016.
 */
(function () {
	'use strict';
	/* global _, globals */
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainEstTotalsConfigDetailDataService
	 * @function
	 *
	 * @description
	 * This service provides Estimate totals Configuration Detail for dialog
	 */
	angular.module(moduleName).factory('estimateMainEstTotalsConfigDetailDataService', [
		'$q', '$http', '$timeout', 'PlatformMessenger', 'platformDataServiceFactory', 'platformGridAPI','platformGridConfigService','estimateMainCommonService',
		function ($q, $http, $timeout, PlatformMessenger, platformDataServiceFactory, platformGridAPI,platformGridConfigService,estimateMainCommonService) {

			let service = {},
				data = [],
				assignData = [],
				itemsToSave = [],
				itemsToDelete = [],
				editType=null,
				execHeaderCount = 0;

			let isMoveUporDwon = false;

			angular.extend(service, {
				getList: getList,
				clear: clear,
				addItems:addItems,
				setDataList: setDataList,
				setDataAssign: setDataAssign,
				addDataAssign: addDataAssign,
				getDataAssign: getDataAssign,
				removeDataAssign: removeDataAssign,
				// getSelected: getSelected,
				// setSelected: setSelected,
				// setSelectedEntities: setSelectedEntities,
				selectChange: selectChange,
				refreshGrid: refreshGrid,
				// gridRefresh: gridRefresh,
				createItem: createItem,
				deleteItem: deleteItem,
				// markItemAsModified: markItemAsModified,
				setItemToSave: setItemToSave,
				getItemsToSave: getItemsToSave,
				getTotal2CostTypeDetailsToSave: getTotal2CostTypeDetailsToSave,
				getTotal2ResourceFlagDetailsToSave: getTotal2ResourceFlagDetailsToSave,
				getItemsToDelete: getItemsToDelete,
				registerListLoaded: registerListLoaded,
				unregisterListLoaded: unregisterListLoaded,
				registerSelectionChanged: registerSelectionChanged,
				unregisterSelectionChanged: unregisterSelectionChanged,
				listLoaded: new PlatformMessenger(),
				selectionChanged: new PlatformMessenger(),
				onUpdateList: new PlatformMessenger(),
				selectToLoad: new PlatformMessenger(),
				onTotalsConfigStatusChange: new PlatformMessenger(),
				onLineTypeChange: new PlatformMessenger(),
				// hasSelection: hasSelection,
				createDeepCopy: createDeepCopy,
				getContainerData: getContainerData,
				moveUp: moveUp,
				moveDown: moveDown,
				// deselect: deselect,
				setEditType: setEditType,
				getEditType: getEditType,
				getIsMove: getIsMove,
				setIsNoMove: setIsNoMove,
				setIsLaborHeaderChkBoxReadonly: setIsLaborHeaderChkBoxReadonly
			});

			// Move implementation of setSelected and remove this serviceOption configuration
			let serviceOption = {
				module: angular.module(moduleName),
				entitySelection: {},
				modification: {multi: {}},
				translation: {
					uid: 'estimateMainEstTotalsConfigDetailDataService',
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

			function getList() {
				return data;
			}

			function setDataList(items) {
				if (Array.isArray(items)) {
					data = items;
				} else {
					data = [];
				}

				service.selectToLoad.fire();
			}

			function setDataAssign(data) {
				assignData = data || [];
			}

			function addDataAssign(item){
				assignData.push(item);
			}

			function  getDataAssign( ){
				return assignData;
			}

			function removeDataAssign(removeItem){
				if(removeItem) {
					_.remove(assignData, {Id: removeItem.Id});
				}
			}

			function addItems(items) {
				data = data ? data : [];
				angular.forEach(items, function(item){
					data.push(item);
					setItemToSave(item);
				});
				// service.refreshGrid();
			}

			function addItem(item) {
				item.__rt$data = item.__rt$data || {};
				data = data ? data : [];
				data.push(item);
				setItemToSave(item);
				service.refreshGrid();
			}

			/* function getSelected() {

				return selectedItem;
			} */

			function selectChange(){
				let selectedItem = service.getSelected();
				if(selectedItem){
					service.selectToLoad.fire(assignData);
				}
			}

			/* function setSelected(item) {
				container.service.setSelected(item);

				let qDefer = $q.defer();
				selectedItem = item;

				//checkTranslationForChanges(data);

				qDefer.resolve(selectedItem);
				return qDefer.promise;
			} */

			/* function setSelectedEntities(data) {
				return container.service.setSelectedEntities(data);
			} */

			/* function hasSelection() {
				return selectedItem ? true : false;
			} */

			function refreshGrid() {
				service.listLoaded.fire();
			}

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
				let modified = _.find(itemsToSave, {Id: item.Id});
				if (!modified) {
					itemsToSave.push(item);
				}
			}

			/* function gridRefresh() {
				refreshGrid();
			} */

			function createItem(totalsConfigFk, sorting) {
				// server create
				let httpRoute = globals.webApiBaseUrl + 'estimate/main/totalsconfigdetail/createitem',
					postData = {
						EstTotalsConfigFk: totalsConfigFk,
						Sorting: sorting
					};

				return $http.post(httpRoute, postData).then(function (response) {
					let item = response.data;
					if (item && item.Id) {
						addItem(item);
						service.setSelected(item);
						updateSelection();
						service.onUpdateList.fire(data);
					}
					return item;
				});
			}

			function deleteItem(selectedItem) {
				// if (selectedItem && selectedItem.Version > 0) {
				// itemsToDelete.push(selectedItem);
				// }

				data = _.filter(data, function (d) {
					return d.Id !== selectedItem.Id;
				});

				itemsToSave = _.filter(itemsToSave, function (d) {
					return d.Id !== selectedItem.Id;
				});

				itemsToDelete.push(selectedItem);

				refreshGrid();
				service.onUpdateList.fire(data);
			}

			function createDeepCopy(totalsConfigFk, currentItem, sorting) {
				let httpRoute = globals.webApiBaseUrl + 'estimate/main/totalsconfigdetail/createitem',
					postData = {
						EstTotalsConfigFk: totalsConfigFk
					};


				let dataTemps = _.filter(assignData, function (d) {
					return d.EstTotalsconfigdetailFk === currentItem.Id;
				});

				return $http.post(httpRoute, postData).then(function (response) {
					let item = response.data;
					if (item && item.Id) {
						item.BasUomFk = currentItem.BasUomFk;
						item.DescriptionInfo.Description = currentItem.DescriptionInfo.Description + '(1)';
						item.DescriptionInfo.Translated = currentItem.DescriptionInfo.Translated + '(1)';
						item.EstTotalsconfigFk = currentItem.EstTotalsconfigFk;
						item.IsLabour = currentItem.IsLabour;
						item.IsBold = currentItem.IsBold;
						item.IsItalic = currentItem.IsItalic;
						item.IsUnderline = currentItem.IsUnderline;
						item.LineType = currentItem.LineType;
						item.Sorting = sorting;

						item.EstTotalDetail2CostTypes = currentItem.EstTotalDetail2CostTypes;
						item.EstTotalDetail2ResourceFlags = currentItem.EstTotalDetail2ResourceFlags;
						item.Modified = true;

						addItem(item);
						service.setSelected(item);
						updateSelection();
						service.onUpdateList.fire(data);
					}

					let httpRouteAssign = globals.webApiBaseUrl + 'estimate/main/costcodeassigndetail/createcopy',
						postDataAssign = {
							EstTotalsConfigDetailFk: item.Id,
							DataAssigns: dataTemps
						};

					// copy cost code assignment
					$http.post(httpRouteAssign, postDataAssign).then(function (response) {
						let itemAssigns = response.data;
						angular.forEach(itemAssigns, function (itemAssign) {
							assignData.push(itemAssign);
						});
						service.selectToLoad.fire(assignData);
					});

					return item;
				});
			}

			function getItemsToSave() {
				return itemsToSave.length ? itemsToSave : null;
			}

			function getItemsToDelete() {
				return itemsToDelete.length ? itemsToDelete : null;
			}

			function getTotal2DetailsToSaveByType(fieldType, fieldKey, configDetails){
				let result = [];
				_.forEach(configDetails, function(detail){
					if (_.findIndex(getItemsToDelete(), {Id: detail.Id}) > -1){
						detail[fieldType] = [];
						detail.Modified = true;
					}
					if (detail.Modified){
						if (_.isEmpty(detail[fieldType])){
							result.push({ Id: -1, EstTotalsConfigDetailFk: detail.Id});
						}
						_.forEach(detail[fieldType], function(item){
							let obj = {};
							obj[fieldKey] = item.Id === 0 ? null : item.Id;
							obj.EstTotalsConfigDetailFk = detail.Id;
							result.push(obj);
						});
					}
				});
				return result;
			}

			function getTotal2CostTypeDetailsToSave(configDetails){
				return getTotal2DetailsToSaveByType('EstTotalDetail2CostTypes', 'EstCostTypeFk', configDetails);
			}

			function getTotal2ResourceFlagDetailsToSave(configDetails){
				return getTotal2DetailsToSaveByType('EstTotalDetail2ResourceFlags', 'EstResourceFlagFk', configDetails);
			}

			function clear() {
				itemsToSave = [];
				itemsToDelete = [];
				assignData = [];
				data = [];
			}

			function getContainerData(){
				return container.data;
			}

			function moveUp(type,grid) {
				estimateMainCommonService.moveSelectedItemTo(type,grid);
			}

			function moveDown(type,grid) {
				estimateMainCommonService.moveSelectedItemTo(type,grid);
			}

			/* function deselect(){

			} */

			function getIsMove(){
				return isMoveUporDwon;
			}

			function setIsNoMove(){
				isMoveUporDwon = false;
			}

			function setEditType(itemEditType){
				editType =  itemEditType;
			}

			function getEditType(){
				return editType;
			}

			function setIsLaborHeaderChkBoxReadonly(readOnly) {
				let gridElement = platformGridAPI.grids.element('id', service.gridId);
				if (gridElement && gridElement.instance){
					let grid = gridElement.instance;
					execHeaderCount = 0;
					let columnId = 'isLabour', readOnlyKey =  '_readonly', headers = grid.getColumnHeaders();
					let ele = readOnly ? headers.find('#chkbox_' + grid.getUID() + '_'+ columnId) : headers.find('#chkbox_' + grid.getUID() + readOnlyKey + '_' + columnId);
					if(ele.length) {
						if (readOnly){
							let columnDef = _.find(grid.getColumns(), { id: columnId });
							let data = service.getList();
							let hasTrueValue = false;
							let hasFalseValue = false;

							if(data.length) {
								hasTrueValue = _.findIndex(data, _.set({}, columnDef.field, true)) !== -1 || _.findIndex(data, _.set({}, columnDef.field, 1)) !== -1;
								hasFalseValue = _.findIndex(data, _.set({}, columnDef.field, false)) !== -1 || _.findIndex(data, _.set({}, columnDef.field, 0)) !== -1;
							}

							ele.prop('disabled', true);
							ele.prop('indeterminate', hasTrueValue && hasFalseValue);
							ele.prop('checked', hasTrueValue && !hasFalseValue);
							ele.prop('id', 'chkbox_' + grid.getUID() + readOnlyKey + '_'+ columnId);
						}else{
							ele.prop('disabled', false);
							ele.prop('id', 'chkbox_' + grid.getUID() + '_' + columnId);
							platformGridAPI.grids.refresh(service.gridId, true);
						}
					}
				}
				else {
					execHeaderCount++;
					if(execHeaderCount <= 3) {
						$timeout(function () {
							setIsLaborHeaderChkBoxReadonly(readOnly);
						}, 1000);
					}
				}
			}
		}]);
})(angular);

