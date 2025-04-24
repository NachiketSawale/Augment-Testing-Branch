/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc controller
	 * @name estimateMainLineItem2MdlObjectController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of model objects assigned ti line item.
	 **/


	angular.module(moduleName).controller('estimateMainLineItem2MdlObjectController',
		['$scope', '$injector', 'platformGridControllerService', 'platformMenuListUtilitiesService', 'estimateDefaultGridConfig', 'estimateMainLineItem2MdlObjectService', 'estimateMainLineItem2MdlObjectConfigService', 'estimateMainLineItem2MdlObjectValidationService', 'estimateMainClipboardService', 'estimateMainLineitem2MdlObjectDetailService', 'estimateMainService','modelViewerModelSelectionService','modelViewerCompositeModelObjectSelectionService',
			function ($scope, $injector, platformGridControllerService, platformMenuListUtilitiesService, estimateDefaultGridConfig, estimateMainLineItem2MdlObjectService, estimateMainLineItem2MdlObjectConfigService, estimateMainLineItem2MdlObjectValidationService, estimateMainClipboardService, estimateMainLineitem2MdlObjectDetailService, estimateMainService,modelViewerModelSelectionService,modelViewerCompositeModelObjectSelectionService) {

				let gridConfig = angular.extend({
					type: 'estMainLineItem2ModelObject',
					dragDropService: estimateMainClipboardService,
					rowChangeCallBack: function rowChangeCallBack() {
						estimateMainLineItem2MdlObjectService.showModelViewer();
					}
				}, estimateDefaultGridConfig);
				platformGridControllerService.initListController($scope, estimateMainLineItem2MdlObjectConfigService, estimateMainLineItem2MdlObjectService, estimateMainLineItem2MdlObjectValidationService, gridConfig);

				// drag & drop
				$scope.ddTarget.registerDragStarted(function(){
					estimateMainClipboardService.setDropMessageToViewer('dragging viewer object');
				});

				let origCanDrop = $scope.ddTarget.canDrop;
				$scope.ddTarget.canDrop = function (info) {
					if (info.draggedData && info.draggedData.draggingFromViewer) { // code that determines whether the dragged data can be handled
						if(!estimateMainLineItem2MdlObjectService.parentService().hasUpdatePermission()){
							return false;
						}
						return !!estimateMainLineItem2MdlObjectService.parentService().getSelected();
					} else {
						return origCanDrop.call($scope.ddTarget, info);
					}
				};

				let origDrop = $scope.ddTarget.drop;
				$scope.ddTarget.drop = function (info) {
					if (info.draggedData && info.draggedData.draggingFromViewer) { // code that determines whether the dragged data can be handled
						// handle dragged data
						estimateMainClipboardService.copyObjectsFromViewer(info);
					} else {
						origDrop.call($scope.ddTarget, info);
					}
				};

				function quantityChanged(lineitem, isChangedByQuantity) {
					// only reset the quantities when lineitem has split quantity
					if(lineitem.HasSplitQuantities){
						let factors = lineitem.QuantityFactor1 * lineitem.QuantityFactor2 * lineitem.QuantityFactor3 * lineitem.QuantityFactor4 * lineitem.ProductivityFactor;
						// let quantityTotal = lineitem.Quantity * factors;
						let quantityList = estimateMainLineItem2MdlObjectService.getList();
						let isCalcTotalWithWq = $injector.get('estimateMainService').getEstTypeIsTotalWq();
						angular.forEach(quantityList, function(item){
							// If lineitem quantity changed by quantity or quantity total,overwrite object quantity
							if(isChangedByQuantity)
							{
								item.Quantity = lineitem.Quantity;
								item.QuantityDetail = lineitem.Quantity;
							}

							item.QuantityTotal = isCalcTotalWithWq ? item.Quantity * item.WqQuantityTarget * factors : item.Quantity * item.QuantityTarget * factors;
							estimateMainLineItem2MdlObjectService.fireItemModified(item);
							estimateMainLineItem2MdlObjectService.markItemAsModified(item);
						});

						estimateMainLineItem2MdlObjectService.gridRefresh();
					}
				}

				let onEntityDeleted = function onEntityDeleted(e, arg) {
					// recalculate lineitem quantity
					estimateMainLineitem2MdlObjectDetailService.fieldChange(arg, 'QuantityTarget');
				};

				let onEntityCreated = function onEntityCreated(e, arg) {
					// recalculate lineitem quantity
					estimateMainLineitem2MdlObjectDetailService.fieldChange(arg, 'QuantityTarget');
				};

				let toolbarItems = [
					platformMenuListUtilitiesService.createToggleItemForObservable({
						value: estimateMainLineItem2MdlObjectService.updateModelSelection,
						toolsScope: $scope
					})
				];

				/**
				 * @ngdoc function
				 * @name updateData
				 * @function
				 * @methodOf modelMainObjectInfoDataService
				 * @description Updates the displayed data based upon the current model object selection.
				 */

				let grid = $injector.get('platformGridAPI').grids.element('id', $scope.gridId);
				function updateData() {
					$scope.$evalAsync(function () {
						if (modelViewerModelSelectionService.getSelectedModelId()) {
							if (modelViewerCompositeModelObjectSelectionService.getSelectedObjectIdCount() > 0) {

								let modelId = modelViewerModelSelectionService.getSelectedModelId();
								let mdl2objList = estimateMainLineItem2MdlObjectService.getList();

								let selectedModel = [];
								let selObjects = modelViewerCompositeModelObjectSelectionService.getSelectedObjectIds();
								Object.keys(selObjects).some(function (subModelId) {
									if (selObjects[subModelId].length > 0) {
										selectedModel.push(selObjects[subModelId]);
									}
								});

								let selectedObj2MldList = [];
								angular.forEach(mdl2objList, function (item) {
									angular.forEach(selectedModel[0],function(sel){

										if(sel === item.MdlObjectFk && modelId === item.MdlModelFk){
											// eslint-disable-next-line no-undef
											let isAnyitemExist = _.find(selectedObj2MldList, function (list) {
												return list.MdlObjectFk === item.MdlObjectFk;
											});
											if(!isAnyitemExist) {
												selectedObj2MldList.push(item);
											}
										}
									});
								});

								if(selectedObj2MldList.length > 0){
									// eslint-disable-next-line
									let ids = _.map(selectedObj2MldList, 'Id');
									let rows = grid.dataView.mapIdsToRows(ids);
									grid.instance.setSelectedRows(rows, true);
									estimateMainLineItem2MdlObjectService.setSelectedEntities(selectedObj2MldList);
								} else {
									grid.instance.setSelectedRows(0, true);
									estimateMainLineItem2MdlObjectService.setSelectedEntities([]);
								}
							} else {
								grid.instance.setSelectedRows([-1], true);
							}
						}
					});
				}

				modelViewerModelSelectionService.onSelectedModelChanged.register(updateData);
				modelViewerCompositeModelObjectSelectionService.registerSelectionChanged(updateData);

				platformGridControllerService.addTools(toolbarItems);
				estimateMainService.onQuantityChanged.register(quantityChanged);
				estimateMainLineItem2MdlObjectService.registerEntityDeleted(onEntityDeleted);
				estimateMainLineItem2MdlObjectService.registerEntityCreated(onEntityCreated);


				$scope.$on('$destroy', function () {
					modelViewerModelSelectionService.onSelectedModelChanged.unregister(updateData);
					modelViewerCompositeModelObjectSelectionService.unregisterSelectionChanged(updateData);
					estimateMainService.onQuantityChanged.unregister(quantityChanged);
					estimateMainLineItem2MdlObjectService.unregisterEntityDeleted(onEntityDeleted);
					estimateMainLineItem2MdlObjectService.unregisterEntityCreated(onEntityCreated);
				});
			}
		]);
})();
