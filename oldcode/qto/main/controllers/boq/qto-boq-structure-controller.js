/**
 * Created by lnt on 3/22/2019.
 */

(function () {

	'use strict';
	/* global globals, _ */

	let moduleName = 'qto.main';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('qtoBoqStructureController',
		['boqMainNodeControllerService', '$scope','$timeout','$injector', '$http', 'qtoBoqStructureService', 'platformNavBarService', 'platformGridControllerService', 'cloudDesktopHotKeyService',
			'boqMainValidationServiceProvider', '$filter', 'qtoMainClipboardService', 'boqMainCommonService',
			'qtoBoqStructureConfigurationService', 'boqMainTranslationService', 'platformModalService', '$translate', 'platformGridAPI',
			'qtoMainHeaderDataService', 'qtoMainDetailService',
			function qtoBoqMainNodeControllerFunction(boqMainNodeControllerService, $scope, $timeout, $injector, $http, qtoBoqStructureService, platformNavBarService, platformGridControllerService,
				cloudDesktopHotKeyService, boqMainValidationServiceProvider, $filter, qtoMainClipboardService, boqMainCommonService,
				qtoBoqStructureConfigurationService, boqMainTranslationService, platformModalService, $translate, platformGridAPI,
				qtoMainHeaderDataService, qtoMainDetailService) {

				qtoBoqStructureConfigurationService.setCurrentBoqMainService(qtoBoqStructureService);

				boqMainNodeControllerService.initBoqNodeController($scope, qtoBoqStructureService, platformNavBarService, platformGridControllerService, cloudDesktopHotKeyService, boqMainValidationServiceProvider, $filter, qtoMainClipboardService, boqMainCommonService, qtoBoqStructureConfigurationService, boqMainTranslationService, platformModalService, $translate, platformGridAPI);

				// load the boq
				let initQtoBoqStructureService = function initQtoBoqStructureService(qtoHeader) {
					if (qtoHeader) {
						qtoBoqStructureService.clear();
						let isReadonly = (qtoHeader.QtoTargetType === 1 || qtoHeader.QtoTargetType === 3) && !!qtoHeader.ConHeaderFk;
						let toolItems = qtoBoqStructureService.getOriginalToolItems();
						if(!toolItems){
							qtoBoqStructureService.setOriginalToolItems(angular.copy($scope.$parent.tools.items));
						}
						if(!isReadonly) {
							let activeToolItems = ['collapsenode','expandnode','collapseall','expandall','t11', 't12', 't109', 't13', /* 't14', */ 'gridSearchAll', 'gridSearchColumn', 't200'];
							$scope.$parent.tools.items = _.filter($scope.$parent.tools.items, function (item) {
								return activeToolItems.indexOf(item.id) !== -1;
							});
						}
						else {
							$scope.$parent.tools.items = qtoBoqStructureService.getOriginalToolItems();
						}

						if(qtoHeader.QtoTargetType === 1 || qtoHeader.QtoTargetType === 3) {
							let activeToolItems = ['boqNewByContext','boqInsert','boqNewDivision','boqNewSubdivision','delete','boqCut','boqCopy','boqPaste'];
							angular.forEach($scope.tools.items, function (item) {
								if(activeToolItems.indexOf(item.id)>-1) {
									item.disabled = !qtoHeader.IsFreeItemsAllowedOfContract;
								}
							});
						}

						let BoqHeaderFk = qtoHeader.BoqHeaderFk > 0 ? qtoHeader.BoqHeaderFk : 0;
						let callingContext = {};
						callingContext.QtoHeader = qtoHeader;
						qtoBoqStructureService.setSelectedHeaderFk(BoqHeaderFk, true, false, false, false, callingContext);
						qtoBoqStructureService.setSelectedProjectId(qtoHeader.ProjectFk);
					} else {
						// no composite sales boq selected
						qtoBoqStructureService.setSelectedHeaderFk(-1);
						qtoBoqStructureService.setSelectedProjectId(null);
					}
				};

				qtoBoqStructureService.setGrid($scope.gridId);

				let qtoHeader = qtoMainHeaderDataService.getSelected();
				initQtoBoqStructureService(qtoHeader);

				const boqItemsMap = new Map();

				// qtoheader selection changed, load the boq
				qtoMainHeaderDataService.registerSelectionChanged(onSelectedQtoChanged);
				function onSelectedQtoChanged(e, qtoHeader) {
					if(qtoHeader) {
						initQtoBoqStructureService(qtoHeader);
						qtoMainHeaderDataService.setSelectedHeader(qtoHeader.Id);

						if (qtoHeader.QtoTargetType === 4) {
							$http.get(globals.webApiBaseUrl + 'qto/main/header/getqtoboqexquantities?boqHeaderFk=' + qtoHeader.BoqHeaderFk).then(function (respone) {
								if (respone.data) {
									_.each(respone.data, function (item) {
										boqItemsMap.set(item.Id, {
											'ExQtoQuantity': item.QUANTITY,
											'ExQtoQuantityAdj': item.QUANTITY_ADJ
										});
									});
								}
							});
						}
					}
				}

				// recalculate boq after qto update done.
				qtoMainHeaderDataService.registerQtoDetailUpdate(recalculateQuantities);
				function recalculateQuantities(e, arg) {
					let boqItemList = qtoBoqStructureService.getList();
					let selectItem = qtoBoqStructureService.getSelected();
					if (selectItem) {
						qtoBoqStructureService.setHighlight(selectItem);
					}

					let highlightItem = qtoBoqStructureService.getHighlight();
					let highlightItems = [];
					if (selectItem) {
						highlightItems.push(selectItem);
					}
					else if (highlightItem) {
						highlightItems.push(highlightItem);
					}

					if (boqItemList.length > 0) {
						let rootItem = boqItemList[0];
						let qtoDetailList = [];
						qtoDetailList = qtoDetailList.concat(qtoMainDetailService.getList());
						if(arg.qtoDetialsOfAffectedBoq) {
							let existedDetailIds = _.map(qtoDetailList, 'Id');
							_.forEach(arg.qtoDetialsOfAffectedBoq, function(detail){
								if(_.indexOf(existedDetailIds,detail.Id) === -1){
									qtoDetailList.push(detail);
								}
							});
						}

						let changedBoqIds = qtoMainDetailService.getChangedBoqIds();
						let boqIds = _.uniq(_.map(arg.QtoDetailDatas, 'BoqItemFk').concat(changedBoqIds));
						_.forEach(boqIds, function (boqId) {
							qtoBoqStructureService.calculateQtoDetaiByBoqitem(qtoDetailList, boqItemList, boqId, rootItem);
						});
						qtoMainDetailService.cleanChangedBoqIds();

						// once change qto of boq ,need update the quantity of the boq
						if (arg.boqItemFks && arg.boqItemFks.length) {
							let changedBoqItemList = [];
							_.forEach(arg.boqItemFks, function (boq) {
								let boqItems = _.filter(boqItemList, function (item) {
									return item.Id === boq;
								});
								changedBoqItemList = changedBoqItemList.concat(boqItems);
							});

							_.forEach(changedBoqItemList, function (boq) {
								let qtoOfBoqList = _.filter(qtoDetailList, function (qto) {
									return qto.BoqItemFk === boq.Id;
								});
								qtoBoqStructureService.calculateQtoDetaiByBoqitem(qtoOfBoqList, boqItemList, boq.Id, rootItem);
							});
						}

						let grid = platformGridAPI.grids.element('id', $scope.gridId);
						let ids = _.map(highlightItems, 'Id');

						if(grid && grid.dataView) {
							let rows = grid.dataView.mapIdsToRows(ids);
							grid.instance.setSelectedRows(rows, true);
						}
						qtoBoqStructureService.setSelectedEntities(highlightItems);
						if (highlightItems && highlightItems.length > 0) {
							qtoMainDetailService.setSelectBoq(highlightItems[0]);
						}
					}
				}

				qtoBoqStructureService.registerSelectionChanged(qtoBoqStructureService.setSelectedBoq2QtoLine);

				function onSelectedBoqItemChanged() {
					let selectedBoqItem = qtoBoqStructureService.getSelected();
					if (selectedBoqItem) {
						qtoBoqStructureService.setLastSelectedItem(selectedBoqItem);
					}
					let qtoHeader = $injector.get('qtoMainHeaderDataService').getSelected();
					let qtoStatusItem = $injector.get('qtoHeaderReadOnlyProcessor').getItemStatus(qtoHeader);

					if (qtoHeader && (qtoHeader.QtoTargetType === 1 || qtoHeader.QtoTargetType === 3)) {
						let activeToolItems = ['boqNewByContext', 'boqInsert', 'boqNewDivision', 'boqNewSubdivision', 'delete', 'boqCut', 'boqCopy', 'boqPaste'];
						angular.forEach($scope.tools.items, function (item) {
							if (activeToolItems.indexOf(item.id) > -1) {
								item.disabled = !qtoHeader.IsFreeItemsAllowedOfContract;
							}
						});
					}

					if (qtoStatusItem && qtoStatusItem.IsReadOnly) {
						return;
					}

					let createQtoLineByBoqItem = function () {
						qtoMainDetailService.createQtoItemByBoqItemChangeFlag = true;
						$timeout(function () {
							let qtoMainBoqFilterService = $injector.get('qtoMainBoqFilterService');
							let qtoHeader = qtoMainHeaderDataService.getSelected();
							if (!qtoMainBoqFilterService.getFilterFlag() && !qtoHeader.IsBackup) {
								qtoMainDetailService.createQtoItemByBoqItemChange();
							}
						});
					};

					let isAutomaticallyCreateQTO = qtoMainDetailService.getIsAutomaticallyCreateQTO();
					let containsCRBSubQuantities = qtoBoqStructureService.isCrbBoq() && selectedBoqItem && _.isArray(selectedBoqItem.BoqItems) && selectedBoqItem.BoqItems.length > 0;
					if (isAutomaticallyCreateQTO && selectedBoqItem && (selectedBoqItem.BoqLineTypeFk === 0 || selectedBoqItem.BoqLineTypeFk === 11) && !containsCRBSubQuantities) {
						let qtosNotSave = _.filter(qtoMainDetailService.getList(), {
							'Version': 0,
							'createQtoItemByBoqItemChangeFlag': true
						});
						if (qtosNotSave.length) {
							qtoMainDetailService.deleteEntities(qtosNotSave).then(createQtoLineByBoqItem);
						} else {
							createQtoLineByBoqItem();
						}
					}
				}

				qtoBoqStructureService.registerSelectionChanged(onSelectedBoqItemChanged);

				qtoBoqStructureService.registerListLoaded(onListLoaded);

				function onListLoaded(){
					let qtoHeader = qtoMainHeaderDataService.getSelected();
					if(qtoHeader){
						if (qtoMainHeaderDataService.getCurrentdHeader() !== qtoHeader.Id) {
							qtoMainHeaderDataService.setCurrentdHeader(qtoHeader.Id);
							$injector.get('qtoMainDetailService').filterBoqs = [];
							qtoBoqStructureService.setLastSelectedItem(undefined);
							if (qtoBoqStructureService.markersChanged && angular.isFunction(qtoBoqStructureService.markersChanged)) {
								qtoBoqStructureService.markersChanged([], true);
							}
						}

						// Add new Columns in QTO BoQ Container: Quantity(Project),AQ-Quantity(Project)
						if (qtoHeader.QtoTargetType === 4) {
							let boqMainCommonService = $injector.get('boqMainCommonService');
							let platformRuntimeDataService = $injector.get('platformRuntimeDataService');
							let boqItems = qtoBoqStructureService.getList();
							_.each(boqItems, function (boqItem){
								if (boqMainCommonService.isDivisionOrRoot(boqItem) ){
									platformRuntimeDataService.hideContent(boqItem, ['ExQtoQuantity', 'ExQtoQuantityAdj'], true);
								} else if (boqItemsMap.has(boqItem.Id)) {
									let quantityData = boqItemsMap.get(boqItem.Id);
									boqItem.ExQtoQuantity = quantityData.ExQtoQuantity > 0 ? quantityData.ExQtoQuantity : null;
									boqItem.ExQtoQuantityAdj = quantityData.ExQtoQuantityAdj > 0 ?  quantityData.ExQtoQuantityAdj : null;
								}
							});
							boqItemsMap.clear();
						}

						// Recalculate GQ Quantity in boq after reload the qto list
						if(qtoMainHeaderDataService.getGqIsAvailable(qtoHeader)){
							qtoMainHeaderDataService.getGQQuantities(qtoHeader).then(function(gqQuantities){
								if(_.isArray(gqQuantities) && gqQuantities.length > 0){
									let boqList = qtoBoqStructureService.getList();
									_.each(boqList, function (boqItem){
										let boqGQQuantities = _.filter(gqQuantities, (quantity) => { return quantity.BoqHeaderFk === boqItem.BoqHeaderFk && quantity.BoqItemFk === boqItem.Id; });
										boqItem.GuessedQuantity = _.sum(_.map(boqGQQuantities, 'GQQuantity'));
									});

									qtoBoqStructureService.gridRefresh();
								}
							})
						}
					}
				}

				$scope.$on('$destroy', function () {
					qtoBoqStructureService.unregisterSelectionChanged(onSelectedBoqItemChanged);
					qtoMainHeaderDataService.unregisterSelectionChanged(onSelectedQtoChanged);
					qtoMainHeaderDataService.unregisterQtoDetailUpdate(recalculateQuantities);
					qtoBoqStructureService.unregisterSelectionChanged(qtoBoqStructureService.setSelectedBoq2QtoLine);
					qtoBoqStructureService.unregisterListLoaded(onListLoaded);
				});
			}
		]);
})();
