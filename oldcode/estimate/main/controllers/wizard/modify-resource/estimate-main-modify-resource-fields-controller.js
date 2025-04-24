/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	/* global _ */
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc controller
	 * @name estimateMainModifyResourceFieldsController
	 * @requires $scope
	 * @description Resource Fields Configuration : used for modify estimate
	 */
	angular.module(moduleName).controller('estimateMainModifyResourceFieldsController', ['$scope', '$timeout', 'platformCreateUuid', 'platformGridAPI', 'platformGridControllerService', 'estimateMainModifyResourceFieldsUIConfigService', 'estimateMainModifyResourceFieldsGridDataService', 'estimateMainReplaceResourceCommonService', 'basicsLookupdataSimpleLookupService', 'basicsCommonHeaderColumnCheckboxControllerService',
		function ($scope, $timeout, platformCreateUuid, platformGridAPI, platformGridControllerService, gridUIConfigService, gridDataService, estimateMainReplaceResourceCommonService, basicsLookupdataSimpleLookupService, basicsCommonHeaderColumnCheckboxControllerService) {

			let gridGuid = '85082e3b42434ceda6d2708a30951096';
			let dynamicOffset = estimateMainReplaceResourceCommonService.getDynamicOffset();

			let checkboxFields = ['isFilter'];
			let headerCheckBoxEvents = [
				{
					source: 'grid',
					name: 'onHeaderCheckboxChanged',
					fn:  function (e){
						// will set the correct fields value
						let isSelected =(e.target.checked);
						if(!isSelected){
							// will clear all fields value
							let grid = platformGridAPI.grids.element('id', $scope.gridId);
							if(grid) {
								let rows = grid.dataView.getItems();
								_.each(rows, function (item) {
									// set the resource fields in common service
									estimateMainReplaceResourceCommonService.deleteResourceFileds(item.Id);
								});
								// for costtype and resourceflag
								clearFieldsValues();
								let selectedItem = gridDataService.getSelected();
								if(selectedItem){
									getLookupData(selectedItem.Id, selectedItem);
								}
							}
						}
						else {
							let selectedItem = gridDataService.getSelected();
							let grid = platformGridAPI.grids.element('id', $scope.gridId);
							if(grid) {
								let rows = grid.dataView.getItems();
								_.each(rows, function (item) {
									item.IsChange =true;
								});
							}
							if(selectedItem){
								getLookupData(selectedItem.Id, selectedItem,true);
							}
						}
					}
				}
			];
			function getLookupData(itemId, e, unchecked) {
				let resourceFields = {
					Id: itemId,
					IsDynamic: false,
					FieldsValue:[]
				};
				if (itemId === 42) {
					// cost type
					getListFromLookup('estimate.lookup.costtype', itemId, unchecked);
				}
				else if (itemId === 43) {
					// resource flag
					getListFromLookup('estimate.lookup.resourceflag', itemId, unchecked);
				}
				else if(e && e.IsDynamic)
				{
					resourceFields.Id = e.Id;
					resourceFields.IsDynamic = true;

					// dynamic column from characteristic
					estimateMainReplaceResourceCommonService.getCharacteristicList(e.Id - dynamicOffset).then(function (data) {
						let resourceFields = estimateMainReplaceResourceCommonService.getResourceFields();
						let tobeUpdatedResourceFields = _.find(resourceFields, {Id: e.Id});

						let list = _.map(data, function (item) {
							// check the exist resource fields value and assign isFilter value
							let fieldValueExist = false;
							if(tobeUpdatedResourceFields) {
								let fieldValues = tobeUpdatedResourceFields.FieldsValue;
								fieldValueExist = _.includes(fieldValues, item.Id);
							}

							return {
								Id: item.Id,
								Description: item.DescriptionInfo.Translated,
								isFilter: fieldValueExist
							};
						});

						if(unchecked){
							_.each(list, function (item) {
								item.isFilter = false;
							});
							// set the resource fields in common service
							estimateMainReplaceResourceCommonService.deleteResourceFileds(e.Id);
						}

						platformGridAPI.items.data(gridGuid, list);
						basicsCommonHeaderColumnCheckboxControllerService.checkHeaderCheckBox(gridGuid, checkboxFields);
					});
				}

				estimateMainReplaceResourceCommonService.addResourceFields(resourceFields);
			}

			let myGridConfig = {
				initCalled: false,
				columns: [],
				collapsed: false,
				enableDraggableGroupBy: false,
				skipPermissionCheck: true,
				multiSelect: false,
				rowChangeCallBack: function () {
					let selectedItem = gridDataService.getSelected();
					if(selectedItem.IsChange)
					{
						getLookupData(selectedItem.Id, selectedItem,selectedItem.isFilter);
					}
					else
					{
						getLookupData(selectedItem.Id, selectedItem);
					}


				},
				cellChangeCallBack: function (e) {
					let column = e.grid.getColumns()[e.cell].field;
					if (column === 'isFilter') {
						// load fields value accordingly
						basicsCommonHeaderColumnCheckboxControllerService.checkHeaderCheckBox($scope.gridId, checkboxFields);
						if(e && e.item){
							getLookupData(e.item.Id, e.item, e.item.isFilter);
						}
					}
				}
			};

			function getListFromLookup(qualifier, itemId, unchecked) {

				basicsLookupdataSimpleLookupService.getList({
					displayMember: 'Description',
					lookupModuleQualifier: qualifier,
					valueMember: 'Id'
				}).then(function (list) {
					_.each(list, function (item) {
						if(item && unchecked){
							item.isFilter = unchecked;
							estimateMainReplaceResourceCommonService.updateResourceFieldValues(item.Id, item.isFilter);
						}
						else if(item && !unchecked && unchecked !==undefined){
							item.isFilter = unchecked;
						}
						// set the resource fields in common service
						estimateMainReplaceResourceCommonService.deleteResourceFileds(itemId);
					});
					platformGridAPI.items.data(gridGuid, list);
					basicsCommonHeaderColumnCheckboxControllerService.checkHeaderCheckBox(gridGuid, checkboxFields);

				});
			}

			$scope.gridId = '75c9031d6614491c94e9b1b878ecd429';

			$scope.setTools = function () {};

			$scope.tools = {
				update:function () {}
			};

			let isLoaded = false;

			function loaded() {
				basicsCommonHeaderColumnCheckboxControllerService.checkHeaderCheckBox($scope.gridId, checkboxFields);
			}

			function init() {
				if (platformGridAPI.grids.exist($scope.gridId)) {
					platformGridAPI.grids.unregister($scope.gridId);
				}
				platformGridControllerService.initListController($scope, gridUIConfigService, gridDataService, null, myGridConfig);

				if(!isLoaded) {
					gridDataService.load().then(function (data) {
						_.each(data, function (item) {
							if(angular.isUndefined(item.isFilter)){
								item.isFilter = false;
							}
						});
						basicsCommonHeaderColumnCheckboxControllerService.init($scope, gridDataService, checkboxFields, headerCheckBoxEvents);
					});
					isLoaded = true;
				}
				gridDataService.listLoaded.register(loaded);
			}

			function clearFieldsValues() {
				let lookups = ['estimate.lookup.costtype','estimate.lookup.resourceflag'];
				_.each(lookups, function (qualifier) {
					basicsLookupdataSimpleLookupService.refreshCachedData({
						displayMember: 'Description',
						lookupModuleQualifier: qualifier,
						valueMember: 'Id'
					});
				});
			}

			$scope.$on('$destroy', function () {
				if (platformGridAPI.grids.exist($scope.gridId)) {
					platformGridAPI.grids.unregister($scope.gridId);
				}
				clearFieldsValues();
				gridDataService.listLoaded.unregister(loaded);
			});

			init();
		}]);
})();
