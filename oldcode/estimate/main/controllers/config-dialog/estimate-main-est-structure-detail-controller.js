/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global _ */
	'use strict';

	let moduleName = 'estimate.main';

	/**
	 @ngdoc controller
	 * @name estimateMainEstStructureDetailController
	 * @function
	 *
	 * @description
	 * Controller for the Estimate Structure Config Details view.
	 */
	/* jshint -W072 */ // function has too many parameters
	angular.module(moduleName).controller('estimateMainEstStructureDetailController',
		['$scope', '$timeout', '$injector', 'platformGridAPI', 'platformCreateUuid', 'platformRuntimeDataService', 'estimateMainStructureDetailUIConfigService', 'estimateMainStructureConfigDetailDataService', 'platformGridControllerService', 'estimateMainEstStructureDataService', 'estimateMainDialogProcessService','estimateMainStructureValidationService',
			function ($scope,  $timeout, $injector, platformGridAPI, platformCreateUuid, platformRuntimeDataService, structureDetailUIConfigService, strDetailDataService, platformGridControllerService, estimateMainEstStructureDataService, estimateMainDialogProcessService, validationService) {

				let myGridConfig = {
					initCalled: false,
					columns: [],
					enableDraggableGroupBy: false,
					skipPermissionCheck : true,
					rowChangeCallBack:function(){
						updateTools();
					},
					cellChangeCallBack :function(arg){
						strDetailDataService.setItemToSave(arg.item);
						refreshStructureDetails(arg);
					}
				};

				function refreshStructureDetails(arg) {
					angular.forEach(strDetailDataService.getList(), function(structureItem){
						strDetailDataService.fireItemModified(structureItem);
						if (arg.item && arg.item.EstStructureFk === 0){
							strDetailDataService.hasEstStructureErr.fire(false);
						}
					});
				}

				$scope.gridId = platformCreateUuid();

				$scope.onContentResized = function () {
					resize();
				};

				$scope.setTools = function(tools){
					tools.update = function () {
						tools.version += 1;
					};
				};

				// Define standard toolbar Icons and their function on the scope
				$scope.tools = {
					showImages: true,
					showTitles: true,
					cssClass: 'tools',
					items: [
						{
							id: 'create',
							sort: 0,
							caption: 'cloud.common.taskBarNewRecord',
							type: 'item',
							iconClass: 'tlb-icons ico-rec-new',
							fn: function(){
								let strConfig = estimateMainEstStructureDataService.getStructureConfig();
								strDetailDataService.createItem(strConfig && strConfig.Id ? strConfig.Id : 0);
								checkHasErr();
							},
							disabled: false
						},
						{
							id: 'delete',
							sort: 10,
							caption: 'cloud.common.taskBarDeleteRecord',
							type: 'item',
							iconClass: 'tlb-icons ico-rec-delete',
							fn: function(){
								let items =  strDetailDataService.getSelectedEntities();
								angular.forEach(items,function (item) {
									strDetailDataService.deleteItem(item);
								});

								checkHasErr();
							},
							disabled: true
						}
					],
					update : function () {return;}
				};

				function resize() {
					$timeout(function () {
						updateTools();
						platformGridAPI.grids.resize($scope.gridId);
					});
				}

				function init() {
					if (platformGridAPI.grids.exist($scope.gridId)) {
						platformGridAPI.grids.unregister($scope.gridId);
					}
					platformGridControllerService.initListController($scope, structureDetailUIConfigService, strDetailDataService, validationService, myGridConfig);

					$injector.get('estimateMainDialogDataService').currentItemChangeFire();
				}

				function setDataSource(data) {
					$scope.data = data;
					strDetailDataService.setDataList(data);
					strDetailDataService.refreshGrid();
					// $scope.onContentResized();
				}

				function updateData(currentItem) {
					setDataSource(currentItem.estStructureConfigDetails);
				}

				// set/reset toolbar items readonly
				function updateTools() {
					let readOnly = estimateMainDialogProcessService.isStrDetailReadOnly();
					angular.forEach($scope.tools.items, function (item) {
						item.disabled = readOnly;
						if(!readOnly && item.id === 'delete'){
							item.disabled = !strDetailDataService.getSelected();
						}
					});
				}

				function checkHasErr(){
					let items = strDetailDataService.getList();
					let FormStructureItems = items.filter(function (item) {
						if(item.EstQuantityRelFk === 1){
							return true;
						}
					});

					// if From StructureItems have same sorting,return ture
					let hashSorting = {};
					let res = FormStructureItems.some(function (item) {
						if(!hashSorting[item.Sorting]){
							hashSorting[item.Sorting] = true;
						}
						else{
							return true;
						}
					});

					let configDetailList = strDetailDataService.getList();
					_.filter(configDetailList, function (item) {
						if (item.EstStructureFk === 0){
							res = true;
						}
					});

					strDetailDataService.hasEstStructureErr.fire(!res);
					refreshStructureDetails(strDetailDataService);

				}

				estimateMainEstStructureDataService.onItemChange.register(updateData);
				estimateMainDialogProcessService.onRefreshStrDetail.register(updateTools);
				// strDetailDataService.selectionChanged.register(updateTools);


				function onSelectedRowsChanged(){
					updateTools();
				}

				platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
				strDetailDataService.registerLookupFilter();

				$scope.$on('$destroy', function () {
					if (platformGridAPI.grids.exist($scope.gridId)) {
						platformGridAPI.grids.unregister($scope.gridId);
					}
					estimateMainEstStructureDataService.onItemChange.unregister(updateData);
					estimateMainDialogProcessService.onRefreshStrDetail.unregister(updateTools);
					platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);

					// strDetailDataService.selectionChanged.unregister(updateTools);
					strDetailDataService.unregisterLookupFilter();
				});

				init();
			}
		]);
})();
