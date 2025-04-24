(function (angular) {
	'use strict';

	const moduleName = 'procurement.pricecomparison';

	angular.module(moduleName).factory('procurementPriceComparisonBoqColumnFactory', [
		'_',
		'globals',
		'platformDataServiceFactory',
		'procurementPriceComparisonMainService',
		'basicsLookupdataLookupDescriptorService',
		'platformModalService',
		'platformDataServiceSelectionExtension',
		'$translate',
		'platformGridAPI',
		'platformRuntimeDataService',
		'procurementPriceComparisonCommonService',
		'procurementPriceComparisonBoqHelperService',
		'procurementPriceComparisonCheckBidderService',
		'procurementPriceComparisonBoqService',
		function (_,
			globals,
			platformDataServiceFactory,
			mainDataService,
			basicsLookupdataLookupDescriptorService,
			platformModalService,
			platformDataServiceSelectionExtension,
			$translate,
			platformGridAPI,
			platformRuntimeDataService,
			commonService,
			boqHelperService,
			checkBidderService,
			boqService) {

			function createServiceContainer(options) {

				let opts = angular.extend({
					route: '',
					endRead: ''
				}, options);

				let rfqQuotes = [];
				let serviceOption = {
					module: angular.module(moduleName),
					serviceName: 'procurementPriceComparisonBoqColumnFactory',
					httpRead: {
						route: globals.webApiBaseUrl + opts.route,
						endRead: opts.endRead,
						usePostForRead: true,
						initReadData: function initReadData(readData) {
							readData.rfqHeaderFk = commonService.getBaseRfqInfo().baseRfqId;
							readData.compareType = 2; // (1:Item; 2: Boq)
						}
					},
					httpCreate: {
						useLocalResource: true,
						resourceFunction: createItemOrChildItem
					},
					dataProcessor: [],
					presenter: {
						tree: {
							parentProp: 'CompareColumnFk',
							childProp: 'Children',
							incorporateDataRead: function (readData, data) {
								basicsLookupdataLookupDescriptorService.attachData(readData || {});
								rfqQuotes = readData.Quote; // all quotes under one rfq
								let baseColumns = boqService.getCustomSettingsCompareColumns();
								let baseQuotes = boqHelperService.restructureQuoteCompareColumns(readData.Main, readData.Quote, false, baseColumns || []);
								return data.handleReadSucceeded(baseQuotes, data, true);
							}
						}
					},
					entitySelection: {},
					modification: {multi: {}},
					translation: {
						uid: 'procurementPriceComparisonBoqColumnService',
						title: 'Compare Column Translation',
						columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}]
					},
					actions: {
						delete: {},
						create: 'hierarchical'
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

				// see method onDeleteDoneInHierarchy in data-service-data-present-extension.js
				service.deleteItem = function deleteItemInHierarchy(selectedItem) {
					// can't delete rows 'BaseBoq/Target'.
					if (selectedItem.Id === checkBidderService.constant.baseBoqValue) {
						return commonService.showInfoDialog('procurement.pricecomparison.deleteBaseBoqInfo');
					} else if (selectedItem.Id === checkBidderService.constant.targetValue) {
						return commonService.showInfoDialog('procurement.pricecomparison.deleteReqInfo');
					}
					// delete
					let deleteParams = {entity: selectedItem};
					doDeepRemove(deleteParams, true);
					data.listLoaded.fire();
					platformDataServiceSelectionExtension.doSelectCloseTo(deleteParams.index, data);
				};

				service.createChildItem = createItemOrChildItem;
				service.canCreateChild = function () {
					let item = service.getSelected();
					return item && !item.CompareColumnFk && item.QtnHeaderFk > 0; // exclude Base Boq/ Target
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

				service.createNewItem = createNewItem;
				service.getIdealQuote = getIdealQuote;

				function doDeepRemove(deleteParams, removeItem) {
					let entity = deleteParams.entity;

					// only the items existed in database can be deleted in server side.
					if (entity && entity.Version > 0) {
						service.deletedColumns.push(entity);
					}

					// prepare delete
					deleteParams.index = data.itemList.indexOf(deleteParams.entity);
					if (deleteParams.entity[data.treePresOpt.parentProp]) {
						deleteParams.parentItem = _.find(data.itemList, {Id: deleteParams.entity[data.treePresOpt.parentProp]});
					} else {
						deleteParams.itemList = data.itemTree;
					}

					// remove form data.itemList
					data.itemList = _.filter(data.itemList, function (item) {
						return item.Id !== entity.Id;
					});

					if (removeItem) {
						if (deleteParams.parentItem && deleteParams.parentItem.Id) {
							// if the is a child item, remove it in it's parent (itemTree)
							let parent = deleteParams.parentItem;
							parent[data.treePresOpt.childProp] = _.filter(parent[data.treePresOpt.childProp], function (child) {
								return child.Id !== entity.Id;
							});
						} else {
							// if the item is a root item, remove it from itemTree.
							data.itemTree = _.filter(data.itemTree, function (root) {
								return root.Id !== entity.Id;
							});
						}
					}

					if (entity[data.treePresOpt.childProp] && entity[data.treePresOpt.childProp].length > 0) {
						angular.forEach(entity[data.treePresOpt.childProp], function (child) {
							let params = {entity: child, parentItem: entity};

							doDeepRemove(params, false);
						});
					}
				}

				function createItemOrChildItem() {
					service.isLoadBase = service.columnParentType;

					// only base quote can add change quote.
					if (!service.isLoadBase && !service.canCreateChild()) {
						return;
					}

					if (mainDataService.hasSelection()) {
						platformModalService.showDialog({
							templateUrl: globals.appBaseUrl + 'procurement.pricecomparison/partials/printing/print-price-comparison-column-dialog.html',
							backdrop: false,
							width: 'max',
							maxWidth: '1024px',
							customSetting: service,
							compareType: 2
						}).then(function (result) {
							if (result.isOK) {
								if (!result.hasSelection) {
									return;
								}

								createNewItem(result.selectedItem);
							}
						});
					}
				}

				function createNewItem(source) {
					if (!source) {
						return;
					}

					// when add changed QTN in base QTN whose changed RFQ code has existed, show the waring dialog
					if (!service.isLoadBase) {
						let selectedItem = service.getSelected();
						if (selectedItem) {
							let existedItem = _.find(selectedItem.Children, function (child) {
								if (child.RfqHeaderId === source.RfqHeaderFk) {
									return child;
								}
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
					}

					let newItem = {};
					let items = service.getList();
					newItem.Id = !_.isEmpty(items) ? (_.maxBy(items, 'Id').Id + 2) : 1;
					newItem.Children = [];
					newItem.Version = 0; // identity a new item.
					newItem.QtnHeaderFk = source.Id;
					newItem.RfqHeaderId = source.RfqHeaderFk;
					newItem.Visible = true;
					newItem.BusinessPartnerFk = source.BusinessPartnerFk;

					let biznessPartner = basicsLookupdataLookupDescriptorService.getLookupItem('businesspartner', source.BusinessPartnerFk);
					newItem.DescriptionInfo = {};
					newItem.DescriptionInfo.Translated = biznessPartner ? biznessPartner.BusinessPartnerName1 : '';
					newItem.DescriptionInfo.DescriptionTr = null;  // to initialize translation items (see language-service.js line 327)
					newItem.DescriptionInfo.Modified = true;

					newItem.IsIdealBidder = source.IsIdealBidder;
					newItem.IsCountInTarget = !source.IsIdealBidder;

					if (service.isLoadBase) {
						data.itemTree.push(newItem); // add root item to itemTree.
					} else {
						// add child item
						let parent = service.getSelected();
						if (parent) {
							newItem[data.treePresOpt.parentProp] = parent.Id;
							parent.Children.push(newItem);
						}
					}

					// add new item to itemList.
					let newItems = [];
					data.flatten([newItem], newItems, data.treePresOpt.childProp);
					_.forEach(newItems, function (item) {
						data.itemList.push(item);
					});

					data.entityCreated.fire(null, newItem);

					if (newItem.IsIdealBidder) {
						platformRuntimeDataService.readonly(newItem, [{field: 'IsCountInTarget', readonly: true}]);
						service.gridRefresh();
					}
				}

				function getIdealQuote() {
					return _.find(data.itemList, {IsIdealBidder: true}); // todo chi: right?
				}

				return container;
			}

			return {
				getServiceContainer: createServiceContainer
			};
		}
	]);
})(angular);
