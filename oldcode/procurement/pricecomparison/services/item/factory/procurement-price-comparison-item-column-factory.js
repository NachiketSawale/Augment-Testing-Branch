(function (angular) {
	'use strict';

	const moduleName = 'procurement.pricecomparison';

	angular.module(moduleName).factory('procurementPriceComparisonItemColumnFactory', [
		'_',
		'globals',
		'platformDataServiceFactory',
		'procurementPriceComparisonMainService',
		'platformModalService',
		'$translate',
		'platformDataServiceSelectionExtension',
		'procurementPriceComparisonCommonService',
		'platformRuntimeDataService',
		'platformGridAPI',
		'basicsLookupdataLookupDescriptorService',
		'procurementPriceComparisonItemHelperService',
		'procurementPriceComparisonCheckBidderService',
		'procurementPriceComparisonItemService',
		function (_,
			globals,
			platformDataServiceFactory,
			procurementPriceComparisonMainService,
			platformModalService,
			$translate,
			platformDataServiceSelectionExtension,
			commonService,
			platformRuntimeDataService,
			platformGridAPI,
			basicsLookupdataLookupDescriptorService,
			itemHelperService,
			checkBidderService,
			itemService) {

			function createServiceContainer(options) {

				let opts = angular.extend({
					route: '',
					endRead: ''
				}, options);

				let rfqQuotes = [];
				let serviceOption = {
					module: angular.module(moduleName),
					serviceName: 'procurementPriceComparisonItemColumnFactory',
					httpRead: {
						route: globals.webApiBaseUrl + opts.route,
						endRead: opts.endRead,
						usePostForRead: true,
						initReadData: function initReadData(readData) {
							let baseInfo = commonService.getBaseRfqInfo();
							readData.rfqHeaderFk = baseInfo.baseRfqId;
							readData.compareType = 1; // (1:Item; 2: Boq)
						}
					},
					httpCreate: {
						useLocalResource: true,
						resourceFunction: createItem
					},
					dataProcessor: [],
					presenter: {
						tree: {
							parentProp: '',
							childProp: 'Children',
							incorporateDataRead: function (readData, data) {
								basicsLookupdataLookupDescriptorService.attachData(readData || {});
								rfqQuotes = readData.Quote; // all quotes under one rfq
								let baseColumns = itemService.getCustomSettingsCompareColumns();
								let tree = itemHelperService.restructureQuoteCompareColumns(readData.Main, rfqQuotes, false, baseColumns || []);
								return data.handleReadSucceeded(tree, data);

							}
						}
					},
					entitySelection: {},
					modification: {multi: {}},
					translation: {
						uid: 'procurementPriceComparisonItemColumnService',
						title: 'Compare Column Translation',
						columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}]
					},
					actions: {
						delete: {},
						create: 'flat'
					}
				};

				let container = platformDataServiceFactory.createNewComplete(serviceOption);
				let service = container.service;
				let data = container.data;

				data.onCreateSucceeded = function () {
				};

				// avoid console error: service.parentService() is not a function (see: platformDataServiceModificationTrackingExtension line 300)
				data.markItemAsModified = function () {
				};
				service.markItemAsModified = function () {
				};
				service.deletedColumns = [];

				service.deleteItem = function deleteItem(entity) {
					// can't delete row 'Target'.
					if (entity.Id === checkBidderService.constant.baseBoqValue) {
						return commonService.showInfoDialog('procurement.pricecomparison.deleteBaseBoqInfo');
					} else if (entity.Id === checkBidderService.constant.targetValue) {
						return commonService.showInfoDialog('procurement.pricecomparison.deleteReqInfo');
					} else if (entity.Id === checkBidderService.constant.TargetPriceValue) {
						return commonService.showInfoDialog('procurement.pricecomparison.deleteTargetInfo');
					} else if (entity.Id === checkBidderService.constant.MaterialValue) {
						return commonService.showInfoDialog('procurement.pricecomparison.deleteMaterialInfo');
					}

					// itemTree
					// only deleted the items already in database.
					if (entity && entity.Version > 0 && entity.Children && entity.Children.length > 0) {  // if have children, delete 'version > 0'
						_.forEach(entity.Children, function (child) {
							if (child && child.Version > 0) {
								service.deletedColumns.push(child);
							}
						});
					}
					if (entity && entity.Version > 0) {             // delete 'version > 0'
						service.deletedColumns.push(entity);
					}

					let deleteParams = [entity];
					let nextEntity = {};
					let index = data.itemTree.indexOf(entity);     // find entity in the tree
					if (index === -1) {                                // not find, then find it in children
						_.forEach(data.itemTree, function (item) {
							if (item.Children && item.Children.length > 0) {
								index = item.Children.indexOf(entity);
								if (index !== -1) {
									item.Children = _.filter(item.Children, function (child) {
										return child.Id !== entity.Id;
									});
									if (item.Children.length === 0) {  // something about selected item
										nextEntity = item;
									} else if (index < item.Children.length) {
										nextEntity = item.Children[index];
									} else if (item.Children.length > 0) {
										nextEntity = item.Children[item.Children.length - 1];
									}
								}
							}
						});
					} else {
						data.itemTree = _.filter(data.itemTree, function (item) {   // it is in the tree
							return item.Id !== entity.Id;
						});
						_.forEach(entity.Children, function (child) {
							deleteParams.push(child);
						});
						if (index < data.itemTree.length) {          // something about selected item
							nextEntity = data.itemTree[index];
						} else if (data.itemTree.length > 0) {
							nextEntity = data.itemTree[data.itemTree.length - 1];
						}
					}
					data.itemList = _.difference(data.itemList, deleteParams);
					data.listLoaded.fire();
					platformDataServiceSelectionExtension.doSelect(nextEntity, data);
					if (angular.isFunction(service.clickChange)) {
						service.clickChange();
					}
				};

				// see grid-config-controller/service.js
				service.moveUp = function () {
					if (service.hasSelection()) {
						let currentItem = service.getSelected();
						if (currentItem.CompareColumnFk) {
							return;
						} // change order (child) can't alow move down /up.

						let items = service.getTree();
						let index = _.findIndex(items, {Id: currentItem.Id});
						if (index > 0 && index <= items.length - 1) {
							items.move(index, --index);
							service.setList(items);
							service.setSelected(currentItem);

							// platformGridAPI.items.data(service.gridId, items);
							if (platformGridAPI.rows.selection({gridId: service.gridId}) !== currentItem) {
								platformGridAPI.rows.selection({
									gridId: service.gridId,
									rows: [currentItem]
								});
							}
							return true;
						}
					}
					return false;
				};
				service.moveDown = function () {
					if (service.hasSelection()) {
						let currentItem = service.getSelected();
						if (currentItem.CompareColumnFk) {
							return;
						} // change order (child) can't alow move down /up.

						let items = service.getTree();
						let index = _.findIndex(items, {Id: currentItem.Id});
						if (index >= 0 && index < items.length - 1) {
							items.move(index, ++index);
							service.setList(items);
							service.setSelected(currentItem);

							// platformGridAPI.items.data(service.gridId, items);
							if (platformGridAPI.rows.selection({gridId: service.gridId}) !== currentItem) {
								platformGridAPI.rows.selection({
									gridId: service.gridId,
									rows: [currentItem]
								});
							}
							return true;
						}
					}
					return false;
				};

				service.getRfqQuotes = function () {
					return rfqQuotes;
				};

				service.canCreateChild = function () {
					let item = service.getSelected();
					return item && !item.CompareColumnFk && item.QtnHeaderFk > 0; // exclude Base Boq/ Target
				};

				service.createNewItem = createNewItem;
				service.getIdealQuote = getIdealQuote;

				function createItem() {
					// only base quote can add change quote.
					if (!service.columnParentType && !service.canCreateChild()) {
						return;
					}
					// show quote column dialog only one rfqHeader selected.
					let mainItem = procurementPriceComparisonMainService.getSelected();
					if (mainItem && Object.hasOwn(mainItem, 'Id')) {

						platformModalService.showDialog({
							templateUrl: globals.appBaseUrl + 'procurement.pricecomparison/partials/printing/print-price-comparison-column-dialog.html',
							backdrop: false,
							width: 'max',
							maxWidth: '1024px',
							customSetting: service,
							compareType: 1
						}).then(function (result) {
							if (result.isOK) {
								if (!(result.data && Object.getOwnPropertyNames(result.data).length)) {
									return;
								}

								var selectedItem = result.data.selectedItem;

								createNewItem(selectedItem);
							}
						});
					}
				}

				return container;

				function createNewItem(source) {
					if (!source) {
						return;
					}

					let items = service.getList();

					// when add changed QTN in base QTN whose changed RFQ code has existed, show the waring dialog
					if (!service.columnParentType) {
						let existedItem = _.find(service.getSelected().Children, function (child) {
							return child.RfqHeaderId === source.RfqHeaderFk && child.BusinessPartnerFk === source.BusinessPartnerFk;
						});
						if (existedItem) {
							let rfqHeader = basicsLookupdataLookupDescriptorService.getLookupItem('RfqHeader', existedItem.RfqHeaderId);
							let qtnHeader = basicsLookupdataLookupDescriptorService.getLookupItem('Quote', existedItem.QtnHeaderFk);
							let message = $translate.instant('procurement.pricecomparison.qtnHasExisted', {
								qtn: qtnHeader.Code,
								code: rfqHeader.Code
							});
							return commonService.showInfoDialog(message);
						}
					}

					let newItem = {};
					newItem.Version = 0;
					newItem.QtnHeaderFk = source.Id;
					// newItem.BackgroundColor = null;
					// newItem.CompareColumnFk = null;
					// newItem.CompareViewFk = 0;
					// newItem.IsSimulation = false;
					newItem.Visible = true;
					newItem.BusinessPartnerFk = source.BusinessPartnerFk;
					newItem.RfqHeaderId = source.RfqHeaderFk;
					newItem.Children = [];
					newItem.IsIdealBidder = source.IsIdealBidder;
					newItem.IsCountInTarget = !source.IsIdealBidder; // !newItem.IsIdealBidder;
					if (!_.isEmpty(items)) {
						newItem.Id = _.maxBy(items, 'Id').Id + 2;
					} else {
						newItem.Id = 1;
					}
					// newItem.Sorting = items.length;

					let biznessPartner = basicsLookupdataLookupDescriptorService.getLookupItem('businesspartner', source.BusinessPartnerFk);
					newItem.DescriptionInfo = {};
					newItem.DescriptionInfo.Translated = biznessPartner ? biznessPartner.BusinessPartnerName1 : '';
					newItem.DescriptionInfo.DescriptionTr = null;  // to initialize translation items (see language-service.js line 327)
					newItem.DescriptionInfo.Modified = true;

					if (service.columnParentType === true) {
						data.itemTree.push(newItem);
						data.itemList.push(newItem);
					}

					if (service.columnParentType === false) {
						let qtnSelectedItem = service.getSelected();
						newItem.CompareColumnFk = qtnSelectedItem.Id;
						_.find(data.itemTree, function (item) {
							if (item === qtnSelectedItem) {
								if (item.Children === null) {
									item.Children = [];
								}
								item.Children.push(newItem);
							}
						});
						data.itemList.push(newItem);
					}

					data.listLoaded.fire(null, newItem);
					service.setSelected(newItem);

					if (angular.isFunction(service.clickChange)) {
						service.clickChange();
					}

					if (newItem.IsIdealBidder) {
						platformRuntimeDataService.readonly(newItem, [{field: 'IsCountInTarget', readonly: true}]);
						service.gridRefresh();
					}
				}

				function getIdealQuote() {
					return _.find(data.itemList, {IsIdealBidder: true}); // todo chi: right?
				}
			}

			return {
				getServiceContainer: createServiceContainer
			};
		}
	]);
})(angular);
