/**
 * Created by zwz on 8/15/2022.
 */

(function (angular) {
	'use strict';
	/* globals angular,_,globals,Slick */
	const moduleName = 'productionplanning.item';
	angular.module(moduleName).factory('ppsPlannedQuantityAssignmentDialogService', DialogService);

	DialogService.$inject = [
		'$http', '$q', '$interval',
		'$injector',
		'basicsLookupdataLookupDescriptorService',
		'platformTranslateService',
		'platformGridAPI',
		'platformModalService',
		'platformRuntimeDataService',
		'ppsPlannedQuantityReadonlyUIService',
		'ppsPlannedQuantityCommonUIService',
		'ppsPlannedQuantityGridHandler',
		'ppsPlannedQuantityPreviewedComponentsHandler',
		//'ppsPlannedQuantitiyAssginmentDialogLayoutHandler',
		'ppsCommonGridToolbarBtnService',
		'cloudCommonGridService',
		'$translate'];

	function DialogService(
		$http, $q, $interval,
		$injector,
		basicsLookupdataLookupDescriptorService,
		platformTranslateService,
		platformGridAPI,
		platformModalService,
		platformRuntimeDataService,
		ppsPlannedQuantityReadonlyUIService,
		ppsPlannedQuantityCommonUIService,
		gridHandler,
		previewedComponentsHandler,
		//layoutHandler,
		gridToolbarBtnService,
		cloudCommonGridService,
		$translate) {

		let service = {};

		const plannedQtyGridId = '192155d838ed413ab72960af7188b597';
		const plannedQtyChildGridId = '23d0092349d7422abe3558a92847b61a';
		const drwComponentGridId = '320a0fab4fef4dc08e6857e4a8d53731';

		function getMainService(dataService) {
			if (dataService.isRoot === true) {
				return dataService;
			}
			return getMainService(dataService.parentService());
		}

		function getPreviewComponentColumns(uiStandardService, selectedPU) {
			let layout = uiStandardService.getStandardConfigForListView();
			let columns = angular.copy(layout.columns);
			_.forEach(columns, function (column) {
				if (!isQuantityField(column)) {
					column.editor = null;
				}
			});
			updateQuantityColumnAndAddQuantityPerPUColumn();
			updateBillingQuantityColumnAndAddBillingQuantityPerPUColumn();
			return columns;

			function updateQuantityColumnAndAddQuantityPerPUColumn() {
				const originalQtyCol = _.find(columns, { field: 'Quantity' });
				originalQtyCol.name = 'Quantity per Product';
				originalQtyCol.toolTip = 'Quantity per Product';
				originalQtyCol.name$tr$ = 'productionplanning.drawing.quantityAssignment.quantityPreview.quantityPerProduct';
				originalQtyCol.toolTip$tr$ = 'productionplanning.drawing.quantityAssignment.quantityPreview.quantityPerProduct';
				originalQtyCol.validator = (item, value) => {
					const factor = selectedPU.Quantity > 0 ? selectedPU.Quantity : 1;
					item.QuantityPerUnit = value * factor;
					// // recalculate AssigningBillingQuantity and AssigningBillingQuantityPerProduct
					// if (item.IsProportionalBill === true) {
					// 	item.BillingQuantity = value * item.FactorBetweenQtyAndBillQty;
					// 	item.BillingQuantityPerPU = item.BillingQuantity * factor;
					// }
					return true;
				};

				let qtyCol = angular.copy(originalQtyCol);
				columns.push(_.extend(qtyCol, {
					field: 'QuantityPerUnit',
					id: 'quantityperunit',
					name: 'Quantity per PU',
					name$tr$: 'productionplanning.drawing.quantityAssignment.quantityPreview.quantityPerUnit',
					toolTip: 'Quantity per PU',
					toolTip$tr$: 'productionplanning.drawing.quantityAssignment.quantityPreview.quantityPerUnit',
					editor: null,
				}));
			}

			function updateBillingQuantityColumnAndAddBillingQuantityPerPUColumn() {
				const originalQtyCol = _.find(columns, { field: 'BillingQuantity' });
				originalQtyCol.name = 'Bill Quantity per Product';
				originalQtyCol.toolTip = 'Bill Quantity per Product';
				originalQtyCol.name$tr$ = 'productionplanning.drawing.quantityAssignment.quantityPreview.billingQuantityPerProduct';
				originalQtyCol.toolTip$tr$ = 'productionplanning.drawing.quantityAssignment.quantityPreview.billingQuantityPerProduct';
				originalQtyCol.validator = (item, value) => {
					const factor = selectedPU.Quantity > 0 ? selectedPU.Quantity : 1;
					item.BillingQuantityPerPU = value * factor;
					return true;
				};

				let qtyCol = angular.copy(originalQtyCol);
				columns.push(_.extend(qtyCol, {
					field: 'BillingQuantityPerPU',
					id: 'billingQuantityperPU',
					name: 'Bill Quantity per PU',
					name$tr$: 'productionplanning.drawing.quantityAssignment.quantityPreview.billingQuantityPerPU',
					toolTip: 'Bill Quantity Per PU',
					toolTip$tr$: 'productionplanning.drawing.quantityAssignment.quantityPreview.billingQuantityPerPU',
					editor: null,
				}));
				// columns.push(
				// {
				// 	id: 'isProportionalBill',
				// 	field: 'IsProportionalBill',
				// 	editor: 'boolean',
				// 	formatter: 'boolean',
				// 	validator: (item, value, field) => {
				// 		const isReadonly = item.IsReadonly || (!!value);
				// 		platformRuntimeDataService.readonly(item, [{ field: 'BillingQuantity', readonly: isReadonly }, { field: 'BillingQuantityPU', readonly: isReadonly }]);
				// 		return true;
				// 	},
				// 	name: '*Proportional Bill',
				// 	name$tr$: 'productionplanning.drawing.quantityAssignment.quantitySelection.proportionalBill',
				// });
			}
		}

		function isQuantityField(col) {
			const quantityFields = ['quantity', 'quantity2', 'quantity3', 'billingquantity'];
			return quantityFields.includes(col.id);
		}

		function getPlannedQtyReadOnlyColumns() {
			return ppsPlannedQuantityReadonlyUIService.getPlannedQtyReadOnlyColumns();
		}

		function isValidationPassed(scope) {
			if (scope?.plannedquantityList?.length > 0) {
				for (let item of scope.plannedquantityList) {
					if (item.__rt$data && item.__rt$data.errors && !_.isNil(item.__rt$data.errors.AssigningQuantity)) {
						return false;
					}
				}
			}
			return true;
		}

		function loadDrwCompData(scope) {
			if (!isValidationPassed(scope)) {
				return;
			}
			scope.isLoadingDrwCompData = true;
			let quantityMappingInfos = previewedComponentsHandler.createQuantityMappingInfos(scope.plannedquantityList, scope.selectedPU);
			return previewedComponentsHandler.getPreviewedComponents(quantityMappingInfos, scope.selectedPU.Quantity).then(result => {
				gridHandler.setGridList(drwComponentGridId, result);
				scope.isLoadingDrwCompData = false;
				return result;
			});
		}

		function loadData($scope) {
			$scope.isLoadingPlannedQtyData = true;
			$scope.isLoadingDrwCompData = true;
			let url = globals.webApiBaseUrl + 'productionplanning/formulaconfiguration/assignedplannedquantity/list?headerid=' + $scope.selectedPU.PPSHeaderFk + '&productdescid=' + $scope.selectedPU.ProductDescriptionFk;
			$http.get(url).then(function (response) {
				$scope.isLoadingPlannedQtyData = false;
				$scope.plannedquantityList = response.data;
				processPlannedQuantityList($scope.plannedquantityList, $scope.selectedPU);
				gridHandler.setGridList(plannedQtyGridId, $scope.plannedquantityList);
				loadDrwCompData($scope).then(comp => {
					mergeWithExistingComponents(comp, $scope)
				});
			});
		}

		function processPlannedQuantityList(plannedquantityList, selectedPU) {
			_.each(plannedquantityList, (item) => {
				item.AssigningQuantityOneUnit = selectedPU.Quantity > 0 ? item.AssigningQuantity / selectedPU.Quantity : 0.000;
				item.AssignableQuantityOneUnit = selectedPU.Quantity > 0 ? item.AssignableQuantity / selectedPU.Quantity : 0.0;

				item.AssigningBillingQuantityPerProduct = selectedPU.Quantity > 0 ? item.AssigningBillingQuantity / selectedPU.Quantity : 0.000;
				item.AssignableBillingQuantityPerProduct = selectedPU.Quantity > 0 ? item.AssignableBillingQuantity / selectedPU.Quantity : 0.000;

				platformRuntimeDataService.readonly(item, [{ field: 'AssigningBillingQuantity', readonly: item.IsProportionalBill }, { field: 'AssigningBillingQuantityPerProduct', readonly: item.IsProportionalBill }]);
			});
			processPlannedQuantities(plannedquantityList);
			readonlyItemsWithoutQuantity(plannedquantityList);
		}

		function processPlannedQuantities(items) {
			items.forEach(item => {
				$injector.get('ppsPlannedQuantityProcessor').processItem(item);
				if (Array.isArray(item.ChildItems)) {
					processPlannedQuantities(item.ChildItems);
				}
			});
		}

		function mergeWithExistingComponents(components, $scope) {
			const existingComponents = $scope.drwCompDataService.getList();
			previewedComponentsHandler.mergeWithExistingComponents(components, existingComponents, $scope.selectedPU.Quantity);
			gridHandler.refreshList(drwComponentGridId);
		}

		function selectLastRootPlanQty() {
			let qtyRootGrid = platformGridAPI.grids.element('id', plannedQtyGridId);
			let rows = qtyRootGrid.dataView.getRows();
			if (rows && rows.length > 0) {
				qtyRootGrid.instance.setSelectedRows([rows.length - 1]);
			}
		}

		function extendBtnsForPlannedQtyGrid(grid, scope) {
			let plannedQtyDeletionBtn = {
				id: 'deletePlannedQuantities',
				sort: 0,
				caption: $translate.instant('cloud.common.taskBarDeleteRecord'),
				type: 'item',
				iconClass: 'tlb-icons ico-rec-delete',
				fn: function () {
					let deletingItem = gridHandler.getSelectedItem(plannedQtyGridId);
					if (deletingItem) {
						// delete data on plannedQtyGrid
						gridHandler.deleteItems(plannedQtyGridId, [deletingItem]);

						// refresh data on plannedQtyChildGrid
						let currentSelected = gridHandler.getSelectedItem(plannedQtyGridId);
						let childList = _.isNil(currentSelected) ? [] : currentSelected.ChildItems;
						gridHandler.setGridList(plannedQtyChildGridId, childList);
						selectLastRootPlanQty();

						// update modificationInfo
						// for "deleting" plannedQuantity, we will just set the relative QuantityMapping's Quantity to -1.
						let tmpQtyMapping = _.find(scope.modificationInfo.qtyMappingInfos, (item) => {
							return item.PpsPlannedQtyId === deletingItem.Id;
						});
						if (tmpQtyMapping) {
							tmpQtyMapping.Quantity = -1;
						} else {
							scope.modificationInfo.qtyMappingInfos.push({
								PpsPlannedQtyId: deletingItem.Id,
								PpsProductTemplateId: scope.selectedPU.ProductDescriptionFk,
								Quantity: -1
							});
						}

						loadDrwCompData(scope).then(comp => {
							mergeWithExistingComponents(comp, scope);
						});
					}

				},
				disabled: () => {
					return _.isNil(gridHandler.getSelectedItem(plannedQtyGridId));
				}
			};

			let isShowingAddingQtyDialog = false;
			let plannedQtyAdditionBtn = {
				id: 'addPlannedQuantities',
				sort: 0,
				caption: $translate.instant('cloud.common.taskBarNewRecord'),
				type: 'item',
				iconClass: 'tlb-icons ico-rec-new',
				fn: function () {
					isShowingAddingQtyDialog = true;
					let url = globals.webApiBaseUrl + 'productionplanning/formulaconfiguration/assignableplannedquantity/list?headerid=' + scope.selectedPU.PPSHeaderFk + '&productdescid=' + scope.selectedPU.ProductDescriptionFk;
					$http.get(url).then(function (response) {
						function showDialog(ppsAssignablePlannedQuantityDtos) {
							let modalCreateConfig = {
								width: '60%',
								height: '60%',
								resizeable: true,
								templateUrl: globals.appBaseUrl + 'productionplanning.item/templates/pps-planned-quantity-selection-dialog.html',
								controller: 'ppsPlannedQuantitiySelectionDialogController',
								resolve: {
									'$options': function () {
										return {
											assignablePlannedQuantityList: ppsAssignablePlannedQuantityDtos,
											selectedPU: scope.selectedPU
										};
									}
								}
							};
							platformModalService.showDialog(modalCreateConfig).then(function (result) {
								if (result && _.isArray(result)) {
									// add data to scope.plannedquantityList
									let existedIds = _.map(scope.plannedquantityList, 'Id');

									let addingItems = _.filter(result, function (item) {
										return !_.includes(existedIds, item.Id);
									});
									if (addingItems.length > 0) {
										scope.modificationInfo.qtyMappingInfos = _.filter(scope.modificationInfo.qtyMappingInfos, function (mp) {
											return !_.some(addingItems, {Id: mp.PpsPlannedQtyId});
										});
										_.forEach(addingItems, function (addingItem) {
											addingItem.Checked = undefined;
											addingItem.AssigningQuantityOneUnit = scope.selectedPU.Quantity > 0 ? addingItem.AssigningQuantity / scope.selectedPU.Quantity : 0.000;
											addingItem.AssigningBillingQuantityPerProduct = scope.selectedPU.Quantity > 0 ? addingItem.AssigningBillingQuantity / scope.selectedPU.Quantity : 0.000;

											platformRuntimeDataService.readonly(addingItem, [{ field: 'AssigningBillingQuantity', readonly: addingItem.IsProportionalBill }, { field: 'AssigningBillingQuantityPerProduct', readonly: addingItem.IsProportionalBill }]);
											scope.plannedquantityList.push(addingItem);
											scope.modificationInfo.qtyMappingInfos.push(
												{
													PpsProductTemplateId: scope.selectedPU.ProductDescriptionFk,
													PpsPlannedQtyId: addingItem.Id,
													Quantity: addingItem.AssigningQuantityOneUnit,
													BillingQuantity: addingItem.AssigningBillingQuantityPerProduct
												});
										});
										gridHandler.setGridList(plannedQtyGridId, scope.plannedquantityList);
										selectLastRootPlanQty();

										loadDrwCompData(scope).then(res => {
											mergeWithExistingComponents(res, scope);
										});
									}
								}
								isShowingAddingQtyDialog = false;
							});
						}

						if (response.data) {
							let existedIds = _.map(scope.plannedquantityList, 'Id');
							let data = _.filter(response.data, function (item) {
								return !_.includes(existedIds, item.Id);
							});
							_.each(data, (item) => {
								item.IsProportionalBill = true; // for all records in Selection Dialog, the default value of flag IsProportionalBill is true
							});
							processPlannedQuantityList(data, scope.selectedPU);
							showDialog(data);
						}
					});

				},
				disabled: () => {
					return isShowingAddingQtyDialog;
				}
			};

			grid.tools.items = [plannedQtyAdditionBtn, plannedQtyDeletionBtn].concat(grid.tools.items);
		}

		function readonlyItemsWithoutQuantity(items) {
			items.filter(i => i.Quantity === 0)
				.forEach(i => platformRuntimeDataService.readonly(i, true));
		}

		function initGridOptions(scope) {
			let array = [{
				gridName: 'plannedQtyGrid',
				gridId: plannedQtyGridId,
				columns: ppsPlannedQuantityCommonUIService.getPlannedQtyCommonColumns(scope.selectedPU, plannedQtyGridId),
				data: []
			}, {
				gridName: 'plannedQtyChildGrid',
				gridId: plannedQtyChildGridId,
				columns: getPlannedQtyReadOnlyColumns(),
				data: []
			}, {
				gridName: 'drwComponentGrid',
				gridId: drwComponentGridId,
				columns: getPreviewComponentColumns(scope.drwCompUIStdService, scope.selectedPU),
				data: []
			}];
			scope.gridOptions = {};
			_.each(array, (item) => {
				scope.gridOptions[item.gridName] = {
					id: item.gridId,
					state: item.gridId,
					gridId: item.gridId, // it uses for toolbar of grid
					columns: item.columns,
					options: {
						indicator: true,
						enableConfigSave: true, // it's required for functionality of layoutBtns
						enableModuleConfig: true,
						selectionModel: new Slick.RowSelectionModel()
					},
					data: item.data
				};
				if (item.gridName === 'plannedQtyChildGrid') {
					_.extend(scope.gridOptions[item.gridName].options, {
						tree: true,
						//parentProp: 'PlannedQuantityFk',
						childProp: 'ChildItems',
					});
				}

				let tmpLookupController = gridToolbarBtnService.addToolsIncludesLayoutBtns(scope.gridOptions[item.gridName]);
				scope.tempLookupControllersForLayoutBtns.push(tmpLookupController);
				// remark: platformGridAPI.grids.config() will be called indirectly when calling addToolsIncludesLayoutBtns() in advanced.
				if (!platformGridAPI.grids.exist(item.gridId)) {
					platformGridAPI.grids.config(scope.gridOptions[item.gridName]);
				}
			});
			extendBtnsForPlannedQtyGrid(scope.gridOptions.plannedQtyGrid, scope);
		}

		service.initial = function initial($scope, $options) {
			$scope.modificationInfo = {
				qtyMappingInfos: []
			};

			service.markModification = function (args, col) {
				let qtyMappingInfo = _.find($scope.modificationInfo.qtyMappingInfos, (item) => {
					return item.PpsPlannedQtyId === args.item.Id;
				});

				if (qtyMappingInfo) {
					qtyMappingInfo.Quantity = args.item.AssigningQuantityOneUnit;
					qtyMappingInfo.BillingQuantity = args.item.AssigningBillingQuantityPerProduct;
					qtyMappingInfo.IsProportionalBill = args.item.IsProportionalBill;
				} else {
					$scope.modificationInfo.qtyMappingInfos.push({
						PpsPlannedQtyId: args.item.Id,
						PpsProductTemplateId: $scope.selectedPU.ProductDescriptionFk,
						Quantity: args.item.AssigningQuantityOneUnit,
						BillingQuantity: args.item.AssigningBillingQuantityPerProduct,
						IsProportionalBill: args.item.IsProportionalBill,
					});
				}
				gridHandler.refreshList(plannedQtyGridId);
				loadDrwCompData($scope); // refresh data of DrawingPreview Grid
			};

			$scope.tempLookupControllersForLayoutBtns = [];

			_.extend($scope, $options);
			// init Grid
			initGridOptions($scope);

			// set refreshSpecification method
			service.refreshSpecification = selectedItem => {
				$scope.specification = null; // clear specification
				if (!selectedItem) {
					return;
				}

				if (selectedItem && !selectedItem.BoqItemFk && !selectedItem.BasBlobsSpecificationFk) {
					return;
				}

				$scope.isLoadingSpecification = true;
				$http.get(`${globals.webApiBaseUrl}productionplanning/formulaconfiguration/plannedquantity/getblobstring?boqItemFk=${selectedItem.BoqItemFk}&&basBlobsSpecificationFk=${selectedItem.BasBlobsSpecificationFk}`)
					.then(response =>
						$scope.specification = response.data // set specification
					).finally(() => $scope.isLoadingSpecification = false);
			};

			service.loadChildPlannedQuantities = function (selected) {
				gridHandler.setGridList(plannedQtyChildGridId, selected.ChildItems);
			};

			$scope.isOKDisabled = function () {
				return !isValidationPassed($scope);
			};

			$scope.handleOK = function () {
				platformGridAPI.grids.commitAllEdits();

				// update qty assignment info
				let qtyMappingToSave = _.filter($scope.modificationInfo.qtyMappingInfos, (item) => {
					return item.Quantity >= 0;
				});
				let qtyMappingToDelete = _.filter($scope.modificationInfo.qtyMappingInfos, (item) => {
					return item.Quantity === -1;
				});
				_.each(qtyMappingToDelete, (item) => {
					item.Quantity = 0;
				});
				// let quantityMappingInfos = previewedComponentsHandler.createQuantityMappingInfos($scope.plannedquantityList, $scope.selectedPU)
				// .concat(qtyMappingToDelete) // It seems that when we first realized quantity assignment, we thought about it like this: for usercase about deleting existed PQs in the quantity assignment dialog, we will finally do not delete related components, but just set quantity of related "deleting" components to 0, then save "deleting" components.
				// ;

				// do update
				getMainService($scope.drwCompDataService).update().then(
					() => {
						// previewedComponentsHandler.getPreviewedComponents(quantityMappingInfos, $scope.selectedPU.Quantity).then(drwComponents => {
						let updateDto = {
							QuantityMappingToDelete: qtyMappingToDelete,
							QuantityMappingToSave: qtyMappingToSave,
							DrawingComponentsToSave: gridHandler.getGridData(drwComponentGridId)
						};
						$http.post(globals.webApiBaseUrl + 'productionplanning/drawing/component/savecomponent', updateDto)
							.then(response => {
								if (response) {
									$scope.drwCompDataService.load(); // refresh component data in the UI
								}
							}).finally(function () {
							close(true);
						});
						// });
					});
			};

			$scope.modalOptions = {
				headerText: $translate.instant('productionplanning.drawing.quantityAssignment.dialogTitle'),
				cancel: close
			};

			function close(result = false) {
				if (angular.isFunction($scope.saveLayoutConfig)) {
					$scope.saveLayoutConfig();
				}

				_.each($scope.tempLookupControllersForLayoutBtns, ctr => {
					ctr.destroy();
				});

				return $scope.$close(result);
			}

			loadData($scope);
		};

		return service;
	}
})(angular);