/**
 * Created by lnt on 02.08.2022.
 */
(function () {

	'use strict';
	let moduleName = 'qto.main';
	let angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name qtoMainStructureController
	 * @function
	 *
	 * @description
	 * Controller for the sheet
	 **/
	angModule.controller('qtoMainStructureController',
		['_', '$scope', '$translate', '$injector', 'cloudCommonGridService', 'qtoMainStructureDataService', 'qtoMainStructureUIStandardService', 'platformGridAPI', 'platformGridControllerService',
			'qtoMainStrucutrueFilterService', 'qtoMainStructureValidationService','qtoMainClipboardService', 'qtoMainDetailService',
			function (_, $scope, $translate, $injector, cloudCommonGridService, qtoMainStructureDataService, qtoMainStructureColumns, platformGridAPI, gridControllerService,
				qtoMainStrucutrueFilterService, qtoMainStructureValidationService, qtoMainClipboardService, qtoMainDetailService) {
				let myGridConfig = {
					initCalled: false,
					columns: [],
					cellChangeCallBack: function (arg) {
						let currentItem = arg.item;
						let colId = arg.grid.getColumns()[arg.cell].id;
						if (colId === 'isreadonly') {
							// set the qto sheet children readonly or not
							let qtoSheetList = [];
							cloudCommonGridService.flatten([currentItem], qtoSheetList, 'QtoSheets');
							let qtoSheetsToSave = _.filter(qtoSheetList, {'IsReadonly': !currentItem.IsReadonly});
							_.forEach(qtoSheetsToSave, function (qtoSheet) {
								qtoSheet.IsReadonly = currentItem.IsReadonly;
							});

							// set the sheet parent
							let itemsToSave = [];
							if (!currentItem.IsReadonly) {
								itemsToSave = qtoMainStructureDataService.setQtoSheetParentsReadonlyFlag(currentItem);
							} else {
								let parentItems = [];
								qtoMainStructureDataService.getQtoSheetParentList(currentItem, parentItems);
								if (parentItems.length > 0){
									let sheetList = [];
									cloudCommonGridService.flatten(parentItems, sheetList, 'QtoSheets');
									_.forEach(parentItems, function (parentItem){
										if (!parentItem.IsReadonly) {
											let noCheckItem = _.find(sheetList, {'QtoSheetFk': parentItem.Id, 'IsReadonly': false});
											if (!noCheckItem) {
												parentItem.IsReadonly = true;
												itemsToSave.push(parentItem);
											}
										}
									});
								}
							}
							qtoMainStructureDataService.markEntitiesAsModified(itemsToSave);

							qtoMainStructureDataService.markEntitiesAsModified(qtoSheetsToSave);

							// set the qto line as readonly
							let qtoDetails = qtoMainDetailService.getList();
							let filterDetails = _.filter(qtoDetails, function (qtoDetail) {
								return _.find(qtoSheetList, {'Id': qtoDetail.QtoSheetFk});
							});
							if (currentItem.IsReadonly) {
								let qtoDetailsToSave = _.filter(filterDetails, {'IsReadonly': !currentItem.IsReadonly});
								_.forEach(qtoDetailsToSave, function (detail) {
									detail.IsReadonly = true;
									detail.IsSheetReadonly = true;
								});
								qtoMainDetailService.markEntitiesAsModified(qtoDetailsToSave);
							}
							else {
								_.forEach(filterDetails, function (detail) {
									detail.IsSheetReadonly = false;
									$injector.get('platformRuntimeDataService').readonly(detail, {field: 'PageNumber', readonly: !detail.IsReadonly && detail.IsSheetReadonly });
								});
							}
						} else if (colId === 'description') {
							currentItem.PageNumber =  _.parseInt(currentItem['Description']);
						}
					},
					rowChangeCallBack: function () {
						selectionChangedCallBack();
					},
					parentProp: 'QtoSheetFk',
					childProp: 'QtoSheets',
					type: 'qtoMainStructure',
					dragDropService: qtoMainClipboardService
				};

				myGridConfig = angular.extend(qtoMainStructureDataService.getGridConfig(), myGridConfig);

				gridControllerService.initListController($scope, qtoMainStructureColumns, qtoMainStructureDataService, qtoMainStructureValidationService, myGridConfig);

				qtoMainStrucutrueFilterService.onFilterMarksChanged.register(onFilterQtoSheetChanged);
				function onFilterQtoSheetChanged(isFilter){
					if(isFilter) {
						let qtoSheetItem = qtoMainStructureDataService.getSelected();
						if (qtoSheetItem) {
							let pageNumber = qtoSheetItem.IsReadonly ? null : qtoSheetItem.PageNumber;
							let qtpSheetItemArray = [qtoSheetItem];
							if (qtoSheetItem.QtoSheets && qtoSheetItem.QtoSheets.length > 0) {
								let qtoSheetList = [];
								cloudCommonGridService.flatten(qtpSheetItemArray, qtoSheetList, 'QtoSheets');
								if (qtoSheetList && qtoSheetList.length > 0) {
									let itemList = _.filter(qtoSheetList, function (qtoSheet) {
										return qtoSheet.PageNumber !== null || qtoSheet.PageNumber !== 0;
									});
									if (itemList && itemList.length > 0) {
										let minItemDec = _.max(_.map(itemList, 'PageNumber'));
										let item = _.filter(qtoSheetList, function (qtoSheet) {
											return qtoSheet.PageNumber === minItemDec;
										});
										pageNumber = item && item.length > 0 ? (item[0].IsReadonly ? null : item[0].PageNumber) : null;
									}
								}
							}
							else {
								pageNumber = pageNumber ? pageNumber : (qtoSheetItem.From === 0 ? 1 : qtoSheetItem.From);
							}
							qtoMainDetailService.setSelectedPageNumber(pageNumber);
						}
					}
					else {
						qtoMainDetailService.setSelectedPageNumber(null);
					}
				}

				function selectionChangedCallBack() {
					let selectItem = qtoMainStructureDataService.getSelected();
					let qtoHeader = $injector.get('qtoMainHeaderDataService').getSelected();
					let qtoStatusItem = $injector.get('qtoHeaderReadOnlyProcessor').getItemStatus(qtoHeader);
					let btnStatus = false;
					if (qtoStatusItem) {
						btnStatus = qtoStatusItem.IsReadOnly;
					}

					if (btnStatus) {
						updateTools(true);
						$scope.tools.update();
					} else {
						if (selectItem) {
							updateTools(false);
							$scope.tools.update();
						}
					}
				}

				function updateTools(btnStatus){
					angular.forEach($scope.tools.items, function (item) {
						if (item.id === 't14') {
							item.disabled = btnStatus;
						}
					});
				}

				qtoMainStructureDataService.registerEntityDeleted(onEntityDeleted);
				function onEntityDeleted(e, deletedItems) {
					qtoMainStrucutrueFilterService.removeFilter('QtoSheets');
					if(deletedItems){
						let qtoDetails = qtoMainDetailService.getList();
						let qtoDetailsToDelete = _.filter(qtoDetails, function(item){
							var index = _.findIndex(deletedItems, {'Id': item.QtoSheetFk});
							if(index !== -1){
								return item;
							}
						});
						qtoMainDetailService.deleteEntities(qtoDetailsToDelete);
					}
				}

				qtoMainStructureDataService.registerListLoaded(loadSheets);
				function  loadSheets(){
					let itemList = qtoMainStructureDataService.getList();
					_.forEach(itemList, function (item) {
						if (!item.PageNumber) {
							qtoMainStructureDataService.updateReadOnly(item, ['Description'], true);
						}
					});
				}

				$scope.$on('$destroy', function () {
					qtoMainStrucutrueFilterService.onFilterMarksChanged.unregister(onFilterQtoSheetChanged);
					qtoMainStructureDataService.unregisterEntityDeleted(onEntityDeleted);
					qtoMainStructureDataService.unregisterListLoaded(loadSheets);
				});
			}
		]);
})();