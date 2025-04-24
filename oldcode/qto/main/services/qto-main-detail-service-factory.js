/**
 * Created by lnt on 21.05.2020.
 */

(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'qto.main';

	angular.module(moduleName).factory('qtoMainDetailServiceFactory', ['_', '$injector', '$q', '$http', '$translate', '$timeout', 'platformDataServiceFactory', 'platformRuntimeDataService', 'platformModalService', 'ServiceDataProcessDatesExtension',
		'basicsLookupdataLookupFilterService', 'basicsLookupdataLookupDescriptorService', 'platformDataServiceDataProcessorExtension', 'PlatformMessenger', 'platformContextService', 'qtoMainLineType',
		'qtoMainFormulaType', 'qtoHeaderReadOnlyProcessor', 'qtoMainFormulaUpdateDialogService', 'qtoMainCreationService', 'userFormOpenMethod', 'qtoBoqType', 'moment', 'QtoType', 'qtoMainDetailCopyConfigService', 'qtoCopyOptionsPriority',
		function (_, $injector, $q, $http, $translate, $timeout, dataServiceFactory, platformRuntimeDataService, platformModalService, DatesProcessor,
			basicsLookupdataLookupFilterService, basicsLookupdataLookupDescriptorService, platformDataServiceDataProcessorExtension, PlatformMessenger, platformContextService, qtoMainLineType,
			qtoMainFormulaType, qtoHeaderReadOnlyProcessor, qtoMainFormulaUpdateDialogService, qtoMainCreationService, userFormOpenMethod, qtoBoqType, moment, qtoType, qtoMainDetailCopyConfigService, copyPriority) {

			let factoryService = {};

			factoryService.createNewQtoMainDetailService = function (parentService, qtoDetailReadOnlyProcessor, moduleName, serviceName, boqType) {

				let service = {};
				let _scope = {};
				let data = {};
				let qtoHeader = null;
				let serviceContainer = null;
				let sheetAreaList = [];
				let changedBoqIds = [];
				let selectBoq, filterStructures, boqLineTypeFk, defaultQtoFormula, gridId, pageNumberCell, qtoTypeFk,
					pageNumberCreated, qtoHeaderPromise, isFormulaChanged = false, isFilterActive = false,
					isCreatedSucceeded = false,
					createItemDefer = null, isFilterByNoWipOrBilActive = false, showQtoUserFormDialog = true;

				let httpRoute = globals.webApiBaseUrl + 'qto/main/detail/';
				let currentCell = 0;

				service.isInsert = false;
				service.createQtoItemByBoqItemChangeFlag = false;
				service.selectedPageNumber = null;
				service.filterBoq = null;
				service.filterPageNumbers = null;
				service.filterLocations = null;
				service.filterBillTos =null;
				service.filterBoqs = null;
				service.lineItems = null;
				service.basrubriccategoryfk = -1;
				service.isCanCreate = undefined;
				service.boqHeaderId = -1;
				service.copyConfigItem = null;
				let boqService = {};

				if (boqType === qtoBoqType.QtoBoq) {
					parentService.registerSelectionChanged(qtoMainHeaderGridSelectionChanged);
				}

				var increaseChar = function increaseChar(value) {
					var ascii = value.charCodeAt();
					if (ascii === 90) {
						return null;
					} else if (ascii < 65 || ascii > 90 || isNaN(ascii)) {
						ascii = 65;
					} else {
						ascii += 1;
					}
					return String.fromCharCode(ascii);
				};

				function getQtoDetailWithMaxmumLineReference(items) {
					var returnObj = null;
					if (!!items && !!items.length && items.length > 0) {
						returnObj = items[0];
						for (var i = 0; i < items.length; i++) {
							if ((items[i].PageNumber > returnObj.PageNumber) || ((items[i].PageNumber === returnObj.PageNumber) && (items[i].LineReference > returnObj.LineReference))) {
								returnObj = items[i];
							}
						}
					}
					return returnObj;
				}

				function getResetLineAddress(lastItem, perReference, roundIndex) {
					var lineAddress = {};
					var pageNumber = lastItem.PageNumber;
					var lineIndex = lastItem.LineIndex;
					var lineReference = lastItem.LineReference;

					if (roundIndex) {
						var count = lineIndex + roundIndex;
						let lastIndex = qtoTypeFk === 1 ? 99 : 9;
						lineAddress.LineIndex = count < lastIndex ? count : count % lastIndex - 1;
						lineAddress.PageNumber = pageNumber;
						lineAddress.LineReference = lineReference;
						var maxLineRef = increaseChar(lineReference || ' ');
						if (count > lastIndex && maxLineRef !== null) {
							lineAddress.LineReference = maxLineRef;
						} else if (count > lastIndex && maxLineRef === null) {
							lineAddress.PageNumber = pageNumber + 1;
							lineAddress.LineReference = 'A';
						}
					}

					if (perReference) {
						for (var i = 0; i < perReference; i++) {
							lineAddress.PageNumber = pageNumber;
							lineAddress.LineIndex = lineIndex;

							lineAddress.LineReference = increaseChar(lineReference || ' ');
							if (lineAddress.LineReference === null) {
								lineAddress.PageNumber = pageNumber + 1;
								lineAddress.LineReference = 'A';
							}
							pageNumber = lineAddress.PageNumber;
							lineIndex = lineAddress.LineIndex;
							lineReference = lineAddress.LineReference;
						}
					}

					return lineAddress;
				}

				function getNewLineAddress(lastItem) {
					var lineAddress = {};
					if (!lastItem) {
						lineAddress.PageNumber = 1;
						lineAddress.LineIndex = 0;
						lineAddress.LineReference = 'A';
					} else {

						var pageNumber = lastItem.PageNumber;
						var lineIndex = lastItem.LineIndex;
						var lineReference = lastItem.LineReference;

						lineAddress.PageNumber = pageNumber;
						lineAddress.LineIndex = lineIndex;
						lineAddress.LineReference = increaseChar(lineReference || ' ');
						if (lineAddress.LineReference === null) {
							lineAddress.PageNumber = pageNumber + 1;
							lineAddress.LineReference = 'A';
						}
					}

					return lineAddress;
				}

				var filters = [
					{
						key: 'qto-detail-reference-filter',
						fn: function (dataItem, dataContext) {
							return dataItem.Id !== dataContext.Id;
						}
					},
					{
						key: 'boq-item-reference-filter',
						fn: function (dataItem, dataContext) {
							if (service.isFirstStep === false) {
								return dataItem.Id !== dataContext.BoqItemFk;
							} else {
								// boq item merge cell first this field can choose  the value same with boq item)
								if (dataContext.PrjLocationReferenceFk === dataContext.PrjLocationFk) {
									return dataItem.Id !== dataContext.BoqItemFk;
								} else {
									return true;
								}
							}
						}
					},
					{
						key: 'location-reference-filter',
						fn: function (dataItem, dataContext) {
							if (service.isFirstStep === false) {
								return dataItem.Id !== dataContext.PrjLocationFk;
							} else {
								// location  merge cell first this field can choose  the value same with location item)
								if (dataContext.BoqItemReferenceFk === dataContext.BoqItemFk) {
									return dataItem.Id !== dataContext.PrjLocationFk;
								} else {
									return true;
								}
							}
						}
					},
					{
						key: 'est-lineitem-qtoline-filter',
						serverSide: true,
						serverKey: 'est-lineitem-qtoline-filter',
						fn: function (entity) {
							return {
								BoqHeaderFk: entity.BoqHeaderFk,
								BoqItemFk: entity.BoqItemFk,
								ProjectFk: service.getSelectedProjectId()
							};
						}
					}
				];

				basicsLookupdataLookupFilterService.registerFilter(filters);

				var serviceOption = {
					flatLeafItem: {
						module: moduleName,
						serviceName: serviceName,
						httpCreate: {route: httpRoute},
						httpRead: {
							route: httpRoute,
							useLocalResource: false,
							usePostForRead: true,
							initReadData: function initReadData(readData) {
								// if you modify the initReadData,you shuold modify the qtoMainSubTotalService's initReadData
								var selected = serviceName === 'qtoMainLineLookupService' ? $injector.get('qtoMainDetailLookupFilterService').selectedQtoHeader : parentService.getSelected();
								readData.MainItemId = selected.Id;
								readData.Locations = service.filterLocations || [];
								readData.BillTos = service.filterBillTos || [];
								readData.PrjProjectFk = selected.ProjectFk;
								readData.Boqs = service.filterBoqs || [];
								readData.PageNumberIds = service.filterPageNumbers || [];
								readData.Structures = filterStructures || [];
								readData.LineItemIds = service.filterLineItems || [];
								readData.EstHeaderIds = service.filterEstHeaderIds || [];
								readData.BasRubricCategoryFk = (boqType === qtoBoqType.QtoBoq) ? selected.BasRubricCategoryFk :
									(service.basrubriccategoryfk || (service.getQtoHeader() ? service.getQtoHeader().BasRubricCategoryFk : 0));
								readData.QtoTypeFk = (boqType === qtoBoqType.QtoBoq) ? selected.QtoTypeFk : (service.getQtoHeader() ? service.getQtoHeader().QtoTypeFk : 0);
								readData.BoqHeaderFk = selected.BoqHeaderFk;
								readData.IsPrjBoq = (boqType === qtoBoqType.PrjBoq);
								readData.IsPrcBoq = (boqType === qtoBoqType.PrcBoq);

								readData.IsQtoBoq = (boqType === qtoBoqType.QtoBoq);
								readData.IsPesBoq = (boqType === qtoBoqType.PesBoq);
								readData.IsWipBoq = (boqType === qtoBoqType.WipBoq);
								readData.IsBillingBoq = (boqType === qtoBoqType.BillingBoq);

								if (boqType === qtoBoqType.WipBoq || boqType === qtoBoqType.BillingBoq || boqType === qtoBoqType.PesBoq || boqType === qtoBoqType.PrjBoq || boqType === qtoBoqType.PrcBoq) {
									readData.IsCrbBoq = parentService && _.isFunction(parentService.isCrbBoq) ? parentService.isCrbBoq() : false;
									readData.SubQuantityBoqItemFks = readData.IsCrbBoq && selected && selected.BoqItems ? _.map(selected.BoqItems, 'Id') : null;
								}

								if (boqType === qtoBoqType.WipBoq || boqType === qtoBoqType.BillingBoq || boqType === qtoBoqType.PesBoq) {
									readData.BoqHeaderFk = parentService.getSelected().BoqItemPrjBoqFk;
									readData.MainItemId = parentService.getSelected().BoqItemPrjItemFk;
								}

								if (boqType === qtoBoqType.PesBoq) {
									readData.PesHeaderFk = $injector.get('procurementPesHeaderService').getSelected() ? $injector.get('procurementPesHeaderService').getSelected().Id : null;
									readData.BoqHeaderFk = parentService.getSelected().BoqItemPrjBoqFk;
									readData.MainItemId = parentService.getSelected().BoqItemPrjItemFk;

								} else if (boqType === qtoBoqType.WipBoq) {

									readData.WipHeaderFk = $injector.get('salesWipService').getSelected() ? $injector.get('salesWipService').getSelected().Id : null;
									readData.BoqHeaderFk = parentService.getSelected().BoqItemPrjBoqFk;
									readData.MainItemId = parentService.getSelected().BoqItemPrjItemFk;

								} else if (boqType === qtoBoqType.BillingBoq) {
									readData.BilHeaderFk = $injector.get('salesBillingService').getSelected() ? $injector.get('salesBillingService').getSelected().Id : null;
									readData.BoqHeaderFk = parentService.getSelected().BoqItemPrjBoqFk;
									readData.MainItemId = parentService.getSelected().BoqItemPrjItemFk;
								}

								// filter by boq split quantity
								if (isFilterActive) {
									var boqSplitQuantityService = service.getBoqSplitQuantityService(boqType);
									var boqSplitItem = boqSplitQuantityService.getSelected();
									if (boqSplitItem) {
										readData.BoqSplitQuantityFk = boqSplitItem.Id;
									}
								}

								// filter by wip or bill reference
								readData.IsFilterByNoWipOrBilActive = isFilterByNoWipOrBilActive;

								let filterService = $injector.get('qtoDetailDataFilterService');
								readData.CostGroupFks = filterService ? filterService.getAllFilterIds() : null;
								readData.BoqType = boqType;
							}
						},
						actions: {
							delete: true,
							create: 'flat',
							canCreateCallBackFunc: canCreateCallBackFunc,
							canDeleteCallBackFunc: canCreateOrDeleteCallBackFunc

						},
						dataProcessor: [
							qtoDetailReadOnlyProcessor, new DatesProcessor(['PerformedDate'])
						],
						setCellFocus: true,
						presenter: {
							list: {
								incorporateDataRead: function (readData, data) {

									handleBeforeQtoLineResponse(readData);

									service.setLookupData(readData);
									service.setQtoHeaderInfo(readData);
									$injector.get('qtoMainQtoDetailDataService').setQtoDetailService(service);
									$injector.get('qtoBoqItemLookupDataService').setQtoDetailService(service);

									// load the dynamic cost groups
									if (boqType === qtoBoqType.QtoBoq && readData.CostGroupCats) {
										readData.CostGroupCats.PreviousProjectId = parentService.getPreviousProjectId();
									}

									$injector.invoke(['basicsCostGroupAssignmentService', function (basicsCostGroupAssignmentService) {
										basicsCostGroupAssignmentService.process(readData, service, {
											mainDataName: 'Main',
											attachDataName: 'QtoDetail2CostGroups',
											dataLookupType: 'QtoDetail2CostGroups',
											identityGetter: function identityGetter(entity) {
												return {
													Id: entity.MainItemId
												};
											}
										});
									}]);

									var items = readData.Main || [];
									// get default qto formula
									if (readData.DefaultQtoFormula && readData.DefaultQtoFormula.length > 0) {
										service.setDefaultQtoFormula(readData.DefaultQtoFormula[0]);
									}

									service.setIsAutomaticallyCreateQTO(readData.isAutomaticallyCreateQTO);

									var grid = $injector.get('platformGridAPI').grids.element('id', service.getGridId());
									if (grid && grid.instance) {
										grid.instance.sortColumn = null;
									}

									var selectedQtoHeader = parentService.getSelected();
									var qtoStatusItem = qtoHeaderReadOnlyProcessor.getItemStatus(selectedQtoHeader);

									// if the isReadyOnly of qto status is true then the  qto detail should be cannot create and should be readonly
									if (qtoStatusItem && qtoStatusItem.IsReadOnly) {
										// if the isReadyOnly of qto status is true ,the column LineText(value1) should be readonly
										angular.forEach(items, function (item) {
											qtoDetailReadOnlyProcessor.updateReadOnly(item, ['LineText'], true);
										});
									}

									if (selectedQtoHeader && selectedQtoHeader.PrjChangeStutasReadonly) {
										updateStatusBarPrjChangeStutasIcon(true);
									} else {
										updateStatusBarPrjChangeStutasIcon(false);
									}

									// TODO: when bulk edit,show the code
									angular.forEach(items, function (item) {
										item.Code = item.QtoDetailReference;

										// to convert to date utc
										convertDateToUtcDate(item);

										// attach qtostatusItem to item
										item.QtoStatusItem = qtoStatusItem;

										item.IsCopySource = serviceName === 'qtoMainLineLookupService';
									});

									data.itemList.length = 0;

									// delete the temporary Qto Lines
									var modState = $injector.get('platformModuleStateService').state(service.getModule());
									var qtoDetailToSave = modState.modifications[data.itemName + 'ToSave'];

									_.remove(qtoDetailToSave, function (qto) {
										return qto.QtoDetail.createQtoItemByBoqItemChangeFlag && qto.QtoDetail.Version <= 0;
									});

									// add boq structure detail configuration to boqMianCommonService to format boq reference user type in.
									var boqMainCommonSerivce = $injector.get('boqMainCommonService');
									if (selectedQtoHeader && selectedQtoHeader.BoqHeaderFk) {
										$injector.get('estimateMainGeneratePrjboqStructureService').getBoqStructure(selectedQtoHeader.BoqHeaderFk).then(function (data) {
											boqMainCommonSerivce.setBoqStructureEntity(data.BoqStructureEntity);
										});
									} else {
										boqMainCommonSerivce.setBoqStructureEntity(null);
									}

									$injector.get('qtoBoqItemLookupService').clearCache();
									$injector.get('qtoCommentComboboxDataService').clearDataCache();

									// set qtotypefk
									qtoTypeFk = readData.qtoHeader ? readData.qtoHeader.QtoTypeFk : (selectedQtoHeader && selectedQtoHeader.qtoHeader ? selectedQtoHeader.qtoHeader.QtoTypeFk : qtoTypeFk);

									service.updateQtoLineReferenceReadOnly(items);

									service.setSheetAreaList(readData.qtoAddressRange);

									let dataRead = serviceContainer.data.handleReadSucceeded(items, data);

									service.cellStyleChangedForQtoLines.fire();

									if ($injector.get('platformGridAPI').grids.exist($injector.get('qtoDetailDocumentService').getGridId())) {
										$injector.get('qtoDetailDocumentService').load();
									}

									// set version qto as readonly
									if (boqType === qtoBoqType.QtoBoq || boqType === qtoBoqType.PrjBoq || boqType === qtoBoqType.PrcBoq) {
										let qtoHeader = service.getQtoHeader();
										if (qtoHeader) {
											$injector.get('qtoMainCommonService').setContainerReadOnly(qtoHeader.IsBackup, service.getGridId());
										}
									}

									return dataRead;
								},
								initCreationData: function initCreationData(creationData, data, creationOptions) {
									creationData.SelectItem = creationOptions.SelectItem ? creationOptions.SelectItem : service.getSelected();
									creationData.QtoHeaderFk = (boqType === qtoBoqType.QtoBoq) ? parentService.getSelected().Id : -1;
									creationData.BasRubricCategoryFk = parentService.getSelected().BasRubricCategoryFk;
									creationData.SelectedPageNumber = service.selectedPageNumber;
									creationData.LastLineAddress = service.lineAddress;
									creationData.BoqItemFk = -1;
									creationData.IsPrjBoq = (boqType === qtoBoqType.PrjBoq);
									creationData.IsPrcBoq = (boqType === qtoBoqType.PrcBoq);
									creationData.BillToFk = creationData.SelectItem? creationData.SelectItem.BillToFk:null;
									creationData.OrdHeaderFk = creationData.SelectItem ? creationData.SelectItem.OrdHeaderFk : null;

									creationData.IsBillingBoq = (boqType === qtoBoqType.BillingBoq);
									creationData.IsWipBoq = (boqType === qtoBoqType.WipBoq);
									creationData.IsPesBoq = (boqType === qtoBoqType.PesBoq);
									creationData.IsQtoBoq = (boqType === qtoBoqType.QtoBoq);

									creationData.IsInsert = creationOptions ? creationOptions.IsInsert : false;
									creationData.FromBoqChanged = creationOptions ? creationOptions.FromBoqChanged : false;

									if (boqType === qtoBoqType.WipBoq || boqType === qtoBoqType.BillingBoq || boqType === qtoBoqType.PesBoq) {
										creationData.BoqHeaderFk = parentService.getSelected().BoqItemPrjBoqFk;
										creationData.BoqItemFk = parentService.getSelected().BoqItemPrjItemFk;
										creationData.BasUomFk = parentService.getSelected().BasUomFk;
										creationData.SelectedBoqHeaderFk = parentService.getSelected().BoqHeaderFk;
										creationData.SelectedBoqItemFk = parentService.getSelected().Id;

										switch (boqType) {
											case qtoBoqType.WipBoq:
												var wipHeader = $injector.get('salesWipService').getSelected();
												if(wipHeader){
													creationData.OrdHeaderFk = wipHeader.OrdHeaderFk;
													creationData.WipHeaderFk = wipHeader.Id;
												}
												break;
											case qtoBoqType.BillingBoq:
												var bilHeader = $injector.get('salesBillingService').getSelected();
												if(bilHeader){
													creationData.OrdHeaderFk = bilHeader.OrdHeaderFk;
													creationData.BilHeaderFk = bilHeader.Id;
												}
												break;
											case qtoBoqType.PesBoq:
												creationData.PesHeaderFk = $injector.get('procurementPesHeaderService').getSelected() ? $injector.get('procurementPesHeaderService').getSelected().Id : null;
												break;
										}
									} else {
										if (boqType === qtoBoqType.QtoBoq) {
											parentService.getSelected().hasQtoDetal = true;
											parentService.updateReadOnly(parentService.getSelected(), 'BasGoniometerTypeFk', parentService.getSelected().BasGoniometerTypeFk);
											var qtoBoqItem = $injector.get('qtoBoqStructureService').getSelected();
											creationData.BoqHeaderFk = qtoBoqItem ? qtoBoqItem.BoqHeaderFk : -1;
											creationData.BoqItemFk = qtoBoqItem ? qtoBoqItem.Id : -1;
											//billto works  when qto purpose is 'wip/bill'
											creationData.BillToFk = qtoHeader && qtoHeader.QtoTargetType === 2 &&  $injector.get('qtoMainBillToDataService').getSelected() ?  $injector.get('qtoMainBillToDataService').getSelected().Id:creationData.BillToFk;
										} else {
											creationData.BoqHeaderFk = parentService.getSelected().BoqHeaderFk;
											creationData.BoqItemFk = parentService.getSelected().Id;
										}

										// if selected boq split item
										var splitQuantityService = service.getBoqSplitQuantityService(boqType);
										var splitItem = splitQuantityService.getSelected();
										creationData.BoqSplitQuantityFk = splitItem ? splitItem.Id :
											(creationData.SelectItem && creationData.SelectItem.BoqItemFk === creationData.BoqItemFk ? creationData.SelectItem.BoqSplitQuantityFk : null);
									}
								}
							}
						},
						entityRole: {
							node: {
								itemName: 'QtoDetail',
								parentService: parentService
							}
						},
						sidebarInquiry: {
							options: {
								active: true,
								moduleName: moduleName,
								getSelectedItemsFn: getSelectedItems,
								getResultsSetFn: getResultsSet
							}
						}
					}
				};

				// source qto is a root container
				if (serviceName === 'qtoMainLineLookupService'){
					// Shift to flatRootItem
					serviceOption.flatRootItem = serviceOption.flatLeafItem;
					delete serviceOption.flatLeafItem; // Delete old property

					serviceOption.flatRootItem.entityRole.root = serviceOption.flatRootItem.entityRole.node;
					delete serviceOption.flatRootItem.entityRole.node;  // Delete old property
				}

				serviceContainer = dataServiceFactory.createNewComplete(serviceOption);
				service = serviceContainer.service;
				serviceContainer.data.usesCache = false;
				serviceContainer.data.forceNodeItemCreation = true;

				// source qto is a root container
				if (serviceName === 'qtoMainLineLookupService'){
					serviceContainer.data.doUpdate = null;
				}

				service.onCostGroupCatalogsLoaded = new PlatformMessenger();
				service.updateQtoBtnTools = new PlatformMessenger();
				service.updateQtoLineToolsOnHeaderSelectedChange = new PlatformMessenger();

				service.lastQtoDetail = null;
				service.isAutomaticallyCreateQTO = false;
				service.isShowQtoDetailCopyConfig = false;

				serviceContainer.data.supportUpdateOnSelectionChanging = false;

				serviceContainer.data.handleOnDeleteSucceeded = function () {
					if (boqType === qtoBoqType.QtoBoq) {
						let sheetList = $injector.get('qtoMainStructureDataService').getList();
						parentService.getSelected().hasQtoDetal = !!service.getList().length || !!sheetList.length;
						parentService.updateReadOnly(parentService.getSelected(), 'BasGoniometerTypeFk', parentService.getSelected().BasGoniometerTypeFk);
					}
				};

				// if filter by all,  doNotLoadOnSelectionChange
				service.hasToLoadOnFilterActiveChange = function hasToLoadOnFilterActiveChange(isFilterActive) {
					serviceContainer.data.doNotLoadOnSelectionChange = isFilterActive;
				};

				service.setIsAutomaticallyCreateQTO = function setIsAutomaticallyCreateQTO(value) {
					service.isAutomaticallyCreateQTO = value;
				};

				service.getIsAutomaticallyCreateQTO = function getIsAutomaticallyCreateQTO() {
					return service.isAutomaticallyCreateQTO;
				};
				service.setIsShowQtoDetailCopyConfig = function setIsShowQtoDetailCopyConfig(value) {
					service.isShowQtoDetailCopyConfig = value;
				};

				service.getIsShowQtoDetailCopyConfig = function getIsShowQtoDetailCopyConfig() {
					return service.isShowQtoDetailCopyConfig;
				};

				service.getBoqType = function getBoqType() {
					return boqType;
				};

				service.getParentService = function () {
					return parentService;
				};

				service.onQtoHeaderRubricCatagoryChanged = function onQtoHeaderRubricCatagoryChanged(selectedQtoHeader) {
					if (selectedQtoHeader.BasRubricCategoryFk === 6) {  // BasRubricCategoryFk is "Live Take Off"
						var itemList = service.getList();
						_.forEach(itemList, function (item) {
							item.V = null;
							data.markItemAsModified(item, data);
						});
					}
					service.calculateQtoLines();
				};

				service.setSelectedPageNumber = function (pageNum) {
					service.selectedPageNumber = pageNum;
				};

				service.setQtoHeaderInfo = function setQtoHeaderInfo(readData) {
					if (readData) {
						qtoHeader = readData.qtoHeader ? readData.qtoHeader : parentService.getSelected();
						$injector.get('qtoMainHeaderDataService').setCurrentHeader(qtoHeader);
						basicsLookupdataLookupDescriptorService.updateData('QtoStatus', readData.qtoStatusItems);
						if(qtoHeader){
							$injector.get('qtoMainCommonService').setLookupWithProjectId(qtoHeader.ProjectFk);
						}
					}
				};

				service.getQtoHeader = function getQtoHeader() {
					return qtoHeader;
				};

				function handleBeforeQtoLineResponse(data) {

					let costGroupColumns = $injector.get('basicsCostGroupAssignmentService').createCostGroupColumns(data.CostGroupCats, false);
					let validationService = $injector.get('qtoMainDetailGridValidationService');

					switch (boqType) {
						case qtoBoqType.PrcBoq:
							validationService = $injector.get('procurementPackageQtoDetailValidationService');
							break;
						case qtoBoqType.PrjBoq:
							validationService = $injector.get('boqMainQtoDetailValidationService');
							break;
						case qtoBoqType.WipBoq:
							validationService = $injector.get('salesWipQtoDetailValidationService');
							break;
						case qtoBoqType.PesBoq:
							validationService = $injector.get('procurementPesQtoDetailValidationService');
							break;
						case qtoBoqType.BillingBoq:
							validationService = $injector.get('salesBillingQtoDetailValidationService');
							break;
					}

					_.forEach(_.filter(costGroupColumns, {bulkSupport: true}), function (costGroup) {
						validationService['validate' + costGroup.field] = validationService['validate' + costGroup.field + 'ForBulkConfig'] = function (entity, value, field, isBulkEditor) {
							if (isBulkEditor) {
								entity[field] = value;
								service.costGroupService.createCostGroupForQtoLines(entity, costGroup, isBulkEditor);
							}
							return true;
						};
					});
				}

				function canCreateCallBackFunc() {
					let selectedItem = service.getSelected();

					// if is DivisionOrRoot, should not create qtoline
					let selectedBoqItem = service.getSelectedBoqItem();
					let list = service.getList();
					let boqMainCommonSerivce = $injector.get('boqMainCommonService');
					if ((!selectedItem || list.length === 0) && selectedBoqItem && boqMainCommonSerivce.isDivisionOrRoot(selectedBoqItem)) {
						return false;
					}

					let isMultiLineAndReadOnly = false;

					if (selectedItem && selectedItem.IsReadonly && selectedItem.QtoFormula !== null && selectedItem.QtoFormula.IsMultiline) {
						let referencedLines = service.getTheSameGroupQto(selectedItem);

						// if selected qto detail is readonly and qto detail formula is multiline, cannot add a new qto detail into a readonly group.
						isMultiLineAndReadOnly = _.isArray(referencedLines) && referencedLines.length > 0 ? referencedLines[referencedLines.length - 1].Id !== selectedItem.Id : true;
					}

					return canCreateOrDeleteCallBackFunc() && !isMultiLineAndReadOnly;
				}

				function canCreateOrDeleteCallBackFunc(isCopy) {
					var selectedItem = parentService.getSelected();
					var qtoStatusItem = {};
					if (!selectedItem) {
						return false;
					}

					if (selectedItem.PrjChangeStutasReadonly) {
						return false;
					}

					var boqHeaderFk = null;
					if (boqType === qtoBoqType.QtoBoq) {
						qtoStatusItem = qtoHeaderReadOnlyProcessor.getItemStatus(selectedItem);
						return qtoStatusItem ? !qtoStatusItem.IsReadOnly : true;
					} else {
						var qtoDetailService = null;
						switch (boqType) {
							case qtoBoqType.PrcBoq:
								qtoDetailService = $injector.get('procurementPackageQtoDetailService');
								qtoDetailReadOnlyProcessor = $injector.get('procurementPackageQtoDetailReadOnlyProcessor');
								break;
							case qtoBoqType.PrjBoq:
								qtoDetailService = $injector.get('boqMainQtoDetailService');
								qtoDetailReadOnlyProcessor = $injector.get('boqMainQtoDetailReadOnlyProcessor');
								break;
							case qtoBoqType.WipBoq:
								qtoDetailService = $injector.get('salesWipQtoDetailService');
								qtoDetailReadOnlyProcessor = $injector.get('salesWipQtoDetailReadOnlyProcessor');
								break;
							case qtoBoqType.PesBoq:
								qtoDetailService = $injector.get('procurementPesQtoDetailService');
								qtoDetailReadOnlyProcessor = $injector.get('procurementPesQtoDetailReadOnlyProcessor');
								break;
							case qtoBoqType.BillingBoq:
								qtoDetailService = $injector.get('salesBillingQtoDetailService');
								qtoDetailReadOnlyProcessor = $injector.get('salesBillingQtoDetailReadOnlyProcessor');
								break;
						}
						if (qtoDetailService && qtoDetailReadOnlyProcessor) {
							qtoHeader = service.getQtoHeader();

							if (qtoHeader && qtoHeader.PrjChangeStutasReadonly) {
								return false;
							}

							qtoStatusItem = qtoHeader ? qtoDetailReadOnlyProcessor.getItemStatus(qtoHeader) : qtoStatusItem;
							if (qtoStatusItem && qtoStatusItem.IsReadOnly) {
								return !qtoStatusItem.IsReadOnly;
							}
						}

						if (boqType === qtoBoqType.BillingBoq || boqType === qtoBoqType.WipBoq || boqType === qtoBoqType.PesBoq) {
							boqHeaderFk = selectedItem.BoqItemPrjBoqFk;
						} else { // project boq,package boq
							boqHeaderFk = selectedItem.BoqHeaderFk;
						}

						if ((selectedItem.BoqLineTypeFk === 0 || selectedItem.BoqLineTypeFk === 11) && service.boqHeaderId === boqHeaderFk) {
							let containsCRBSubQuantity =  parentService && _.isFunction(parentService.isCrbBoq) && parentService.isCrbBoq() && selectedItem.BoqLineTypeFk === 0 && _.isArray(selectedItem.BoqItems) && selectedItem.BoqItems.length > 0;
							if (isCopy){
								return !containsCRBSubQuantity;
							} else {
								return service.isCanCreate && !containsCRBSubQuantity;
							}
						}

						if ((service.isCanCreate === undefined || service.boqHeaderId !== boqHeaderFk) && boqHeaderFk) {
							service.boqHeaderId = boqHeaderFk;
							if (!qtoHeaderPromise) {
								qtoHeaderPromise = getQtoHeaderByBoqId(boqHeaderFk);
							}

							qtoHeaderPromise.then(function (data) {
								qtoHeaderPromise = null;
								service.isCanCreate = !!data;
							});
						}
						return false;
					}

				}

				function getStatusBarPrjChangeStutasIcon(showIcon) {
					return [{
						id: 'qtoLineStatus',
						type: 'text',
						align: 'right',
						disabled: false,
						cssClass: 'status-icons ico-status33',
						toolTip: $translate.instant('qto.main.prjChangeStatusReadOnlyInfo'),
						visible: true,
						ellipsis: true,
						value: showIcon ? '..' : ''
					}];
				}

				function updateStatusBarPrjChangeStutasIcon(showIcon) {
					if (_.isFunction(_scope.getUiAddOns)) {
						var sb = _scope.getUiAddOns().getStatusBar();
						sb.updateFields(getStatusBarPrjChangeStutasIcon(showIcon));
					}
				}

				service.updateStatusBarPrjChangeStutasIcon = function (qtoLine) {
					if (!qtoLine) {
						updateStatusBarPrjChangeStutasIcon(false);
						return;
					}

					var selectedQtoHeader = parentService.getSelected();

					if (selectedQtoHeader.PrjChangeStutasReadonly) {
						return;
					}

					updateStatusBarPrjChangeStutasIcon(qtoLine.PrjChangeStutasReadonly);
				};

				// update the same group qto which qto's readonly is not true
				service.getTheSameGroupQto = function (currentQto) {
					let result = [];
					let itemList = service.getList();

					if (!currentQto || !itemList || itemList.length < 1) {
						return result;
					}

					return _.filter(itemList, {'QtoDetailGroupId': currentQto.QtoDetailGroupId});
				};

				service.setScope = function (scope) {
					_scope = scope;
				};

				service.getCurrentResultSet = function getCurrentResultSet() {
					let gridData = [];
					let grid = $injector.get('platformGridAPI').grids.element('id', service.getGridId());
					if (grid.instance) {
						gridData = grid.instance.getData().getRows();
					}
					return gridData;
				};

				function getQtoHeaderByBoqId(value) {
					var deferred = $q.defer();
					var data = {
						BoqHeaderId: value,
						QtoTargetTypeId: null,
						qtoBoqType: boqType
					};

					$http.post(globals.webApiBaseUrl + 'qto/main/header/getqtoheaderbyboqheaderid', data).then(function (response) {
						deferred.resolve(response.data);
					});

					return deferred.promise;
				}

				function qtoMainHeaderGridSelectionChanged() {
					// filterBoqs = [];
					selectBoq = null;
					// filterPageNumbers = [];
					service.selectedPageNumber = null;
					$injector.get('qtoBoqStructureService').setHighlight(undefined);
				}

				/**
				 * this function will be called from Sidebar Inquiry container when user presses the "AddSelectedItems" Button
				 * returns: array {itemInfo}  {iteminfo} { id: int(unique identifier), name: string, description: string}
				 */
				function getSelectedItems() {
					var resultSet = service.getSelectedEntities();
					return createInquiryResultSet(_.isArray(resultSet) ? resultSet : [resultSet]);
				}

				/**
				 * this function will be called from Sidebar Inquiry container when user presses the "AddAllItems" Button
				 * returns: array {itemInfo}  {iteminfo} { id: int(unique identifier), name: string, description: string}
				 */
				function getResultsSet() {
					var resultSet = service.getList();
					return createInquiryResultSet(_.isArray(resultSet) ? resultSet : [resultSet]);
				}

				/**
				 * This function creates a Inquiry Resultset from input resultset (busniness partner specific)
				 *
				 * {InquiryItem} containing:
				 *     {  id:   {integer} unique id of type integer
				 *        name: {string}  name of item, will be displayed in inquiry sidebar as name
				 *        description: {string}  description  of item, will be displayed in inquiry sidebar as description
				 *     });
				 *
				 * @param resultSet
				 * @returns {Array} see above
				 */
				function createInquiryResultSet(resultSet) {
					var resultArr = [];
					_.forEach(resultSet, function (item) {
						if (item && item.Id) { // check for valid object
							resultArr.push({
								id: item.Id,
								name: item.QtoDetailReference,
								description: item.QtoDetailReference,
								qtoHeaderId: item.QtoHeaderFk
							});
						}
					});

					return resultArr;
				}

				function showCreateMultiItemsInProgress(value) {
					_scope.$emit('createMultiItemsInProgress', value);
				}

				service.updateCalculation = function (selectChange) {
					if (updateIsInvoking) {
						return $q.when(true);
					}

					var validateResult = false;
					var itemList = service.getList();

					if (itemList.length === 1) {
						if (!selectChange) {
							validateResult = true;
						} else if (selectChange && itemList[0].Version !== 0) {
							validateResult = true;
						}
					}

					if (itemList.length > 1 || itemList.length === 0) {
						validateResult = true;
					}

					// has error or not
					if (itemList.length > 0) {
						validateResult = hasError(itemList) ? false : validateResult;
					}

					if (validateResult) {
						var allPromises;
						if (boqType === qtoBoqType.PrcBoq) { // note how about pes boq
							var prcBoqService = parentService.parentService();

							var prcPackageService = prcBoqService.parentService();
							allPromises = prcPackageService.update();
						} else if (boqType === qtoBoqType.WipBoq || boqType === qtoBoqType.BillingBoq) {
							let modTrackServ = $injector.get('platformDataServiceModificationTrackingExtension');
							let updateDataImmediately = modTrackServ.getModifications(parentService);
							let isChangeQtoLine = false;
							if (updateDataImmediately.BoqItemToSave) {
								_.each(updateDataImmediately.BoqItemToSave, function (item) {
									if (item.QtoDetailToSave) {
										isChangeQtoLine = true;
										let boqItem = parentService.getSelected();
										parentService.markItemAsModified(boqItem);
									}
								});
							}

							// no change qto line, no need to update
							if (!isChangeQtoLine) {
								return $q.when(true);
							}

							var mainDataService = parentService.parentService();
							allPromises = mainDataService.update();
						} else if (boqType === qtoBoqType.PesBoq) {

							var procurementPesBoqService = parentService.parentService();
							var procurementPesHeaderService = procurementPesBoqService.parentService();
							allPromises = procurementPesHeaderService.update();
						} else { // qto /project boq
							allPromises = parentService.update();
						}
						updateIsInvoking = true;
						return allPromises.then(function (data) {
							updateIsInvoking = false;
							if (data && data.IsCalculate && data.AffectedQtoDetails && data.AffectedQtoDetails.length) {
								_.forEach(data.AffectedQtoDetails, function (updateItem) {
									var oldItem = _.find(itemList, {'Id': updateItem.Id});
									if (oldItem) {
										convertDateToUtcDate(updateItem);
										var QtoDetailReference = oldItem.QtoDetailReference;
										angular.extend(oldItem, updateItem);
										oldItem.QtoDetailReference = QtoDetailReference;

										$injector.get('platformGridAPI').rows.refreshRow({
											gridId: service.getGridId(),
											item: oldItem
										});
									}
								});
								// afterUpdateCalculation();
								// update qto detail grouping info.
								service.updateQtoDetailGroupInfo();
								//service.gridRefresh();
							}
						}, function () {
							updateIsInvoking = false;
							// afterUpdateCalculation();
						});
					}

					return $q.when(true);
				};

				function convertDateToUtcDate(item) {
					if (item) {
						// to convert to date utc
						item.PerformedFromWip = _.isString(item.PerformedFromWip) ? moment.utc(item.PerformedFromWip) : item.PerformedFromWip;
						item.PerformedToWip = _.isString(item.PerformedToWip) ? moment.utc(item.PerformedToWip) : item.PerformedToWip;
						item.PerformedFromBil = _.isString(item.PerformedFromBil) ? moment.utc(item.PerformedFromBil) : item.PerformedFromBil;
						item.PerformedToBil = _.isString(item.PerformedToBil) ? moment.utc(item.PerformedToBil) : item.PerformedToBil;
						item.PerformedDate = _.isString(item.PerformedDate) ? moment.utc(item.PerformedDate) : item.PerformedDate;
					}
				}

				function hasError(itemList) {
					let item = _.find(itemList, {'HasError': true});
					return !!item;
				}

				var updateIsInvoking = false;

				service.calculateQtoLines = function () {

					service.deleteTemporaryQtos();
					var allPromises = [];
					if ((boqType === qtoBoqType.PrcBoq)) { // note how about pes boq
						var prcBoqService = parentService.parentService();
						var prcPackageService = prcBoqService.parentService();
						allPromises.push(prcPackageService.update());
					} else if (boqType === qtoBoqType.WipBoq || boqType === qtoBoqType.BillingBoq) {

						var mainDataService = parentService.parentService();
						allPromises.push(mainDataService.update());
					} else if (boqType === qtoBoqType.PesBoq) {

						var procurementPesBoqService = parentService.parentService();
						var procurementPesHeaderService = procurementPesBoqService.parentService();
						allPromises.push(procurementPesHeaderService.update());
					} else {
						allPromises.push(parentService.update());
					}

					$q.all(allPromises).then(function (response) {
						if (response && response[0]) {
							// service.load().then(function () {
							var qtoHeader = parentService.getSelected();
							var itemsPredefine = getItemsPredefineList();
							if (itemsPredefine.length > 0) {
								qtoMainFormulaUpdateDialogService.showDialog(itemsPredefine).then(function (result) {
									if (result.ok) {
										var itemList = qtoMainFormulaUpdateDialogService.dataService.getList();
										var qtoDetailCompletes = [];
										_.each(itemList, function (item) {
											var qtoDetailComplete = {
												MainItemId: item.Id,
												Id: item.Id,
												QtoDetail: item
											};

											qtoDetailCompletes.push(qtoDetailComplete);
										});
										reCalculateQtoLine(qtoHeader, qtoDetailCompletes);
									}
								});
							} else {
								reCalculateQtoLine(qtoHeader);
							}
							// });
						}
					});
				};

				// recalculate the qto line
				function reCalculateQtoLine(qtoHeader, qtoDetailCompletes) {
					if (qtoHeader) {
						var postParam = {
							QtoHeaderId: qtoHeader.Id,
							Goniometer: qtoHeader.BasGoniometerTypeFk,
							NoDecimals: qtoHeader.NoDecimals,
							QtoDetailToSave: qtoDetailCompletes
						};
						$http.post(globals.webApiBaseUrl + 'qto/main/detail/calculate', postParam).then(function () {
							service.load().then(function () {
								var boqItemList = $injector.get('basicsLookupdataLookupDescriptorService').getData('boqItemLookupDataService');
								var boqItemFks = (_.uniq((_.map(boqItemList, 'BoqItemFk'))));
								var qtoDetailList = service.getList();
								parentService.updateBoqItemQuantity(boqItemFks, qtoDetailList);
							});
						});
					}
				}

				// to get the conflict items
				function getItemsPredefineList() {
					var items = service.getList();
					var itemsCopy = angular.copy(items);
					return _.filter(itemsCopy, function (item) {
						var isValidate = false;
						if (item.QtoFormula && item.QtoFormula.QtoFormulaTypeFk === qtoMainFormulaType.Predefine) {
							if (!_.isEmpty(item.Operator1) && (item.QtoFormula.Operator1 && item.QtoFormula.Operator1.indexOf(item.Operator1) === -1)) {
								item.Operator1 = '';
								$injector.get('qtoMainDetailGridValidationService').asyncValidateOperator1(item, '', 'Operator1');
								isValidate = true;
							}

							if (!_.isEmpty(item.Operator2) && (item.QtoFormula.Operator2 && item.QtoFormula.Operator2.indexOf(item.Operator2) === -1)) {
								item.Operator2 = '';
								$injector.get('qtoMainDetailGridValidationService').asyncValidateOperator1(item, '', 'Operator2');
								isValidate = true;
							}

							if (!_.isEmpty(item.Operator3) && (item.QtoFormula.Operator3 && item.QtoFormula.Operator3.indexOf(item.Operator3) === -1)) {
								item.Operator3 = '';
								$injector.get('qtoMainDetailGridValidationService').asyncValidateOperator1(item, '', 'Operator3');
								isValidate = true;
							}

							if (!_.isEmpty(item.Operator4) && (item.QtoFormula.Operator4 && item.QtoFormula.Operator4.indexOf(item.Operator4) === -1)) {
								item.Operator4 = '';
								$injector.get('qtoMainDetailGridValidationService').asyncValidateOperator1(item, '', 'Operator4');
								isValidate = true;
							}

							if (!_.isEmpty(item.Operator5) && (item.QtoFormula.Operator5 && item.QtoFormula.Operator5.indexOf(item.Operator5) === -1)) {
								item.Operator5 = '';
								$injector.get('qtoMainDetailGridValidationService').asyncValidateOperator1(item, '', 'Operator5');
								isValidate = true;
							}

							return isValidate;
						}
					});
				}

				data = serviceContainer.data;

				service.setDataSelectedItem = function setDataSelectedItem(newItem) {
					data.selectedItem = newItem;
				};

				service.deleteTemporaryQtos = function deleteTemporaryQtos() {
					var isDelete = false;
					// remove the temporary qto that created by change boqItem
					var temporaryQtos = _.filter(service.getList(), {
						'createQtoItemByBoqItemChangeFlag': true,
						'Version': 0
					});
					if (temporaryQtos.length) {
						service.deleteEntities(temporaryQtos);
						isDelete = true;
					}
					return isDelete;
				};

				function finishCreatingItem() {
					if (createItemDefer) {
						createItemDefer.resolve();
						createItemDefer = null;
					}
				}

				service.createQtoItemByBoqItemChange = function createQtoItemByBoqItemChange() {
					let selectItem = service.getSelected();
					let itemList = service.getList();
					selectItem = itemList && itemList.length > 0 ? itemList[itemList.length - 1] : selectItem;
					service.createQtoLine(selectItem, false, true);
				};
				var baseCreateItem = service.createItem;
				service.createItem = function createItem() {
					createItemDefer = $q.defer();

					let qtoHeader = service.getQtoHeader();
					if (qtoHeader && qtoHeader.IsBackup){
						return;
					}

					service.deleteTemporaryQtos();

					var isInsert = service.isInsert;
					var selectItem = service.getSelected();
					var itemList = service.getOrderedList();

					var strTitle = $translate.instant('qto.main.detail.createQtoLineTilte');
					var strContent;
					var lastItem = itemList && itemList.length > 0 ? itemList[itemList.length - 1] : null;
					if (!_.isEmpty(selectItem) && !_.isEmpty(selectItem.QtoFormula) && selectItem.QtoFormula.IsMultiline) {
						let referencedLines = service.getReferencedDetails(selectItem);
						let lastReferencedLine = referencedLines.length > 0 ? referencedLines[referencedLines.length - 1] : null;

						if (selectItem.QtoFormula.MaxLinenumber && (_.isEmpty(lastReferencedLine) || selectItem.Id !== lastReferencedLine.Id || !checkOperator(selectItem))) {
							if (referencedLines.length >= selectItem.QtoFormula.MaxLinenumber) {
								strContent = $translate.instant('qto.main.detail.outOfMaxLineNumber', {
									value0: selectItem.QtoFormula.Code,
									value1: selectItem.QtoFormula.MaxLinenumber
								});
								platformModalService.showMsgBox(strContent, strTitle, 'info');
								service.isInsert = false;
								return;
							}
						}

						let selectedBoqItemFk = getSelectedBoqItemId();
						let selectedLocationFk = getselectedPrjLocationId();

						if (selectedBoqItemFk > 0 || selectedLocationFk > 0) {
							let selectedItemIdx = _.indexOf(itemList, selectItem);
							let releatedItem = selectedItemIdx < 0 ? null : isInsert ? itemList[selectedItemIdx - 1] : itemList[selectedItemIdx + 1];

							if (releatedItem && releatedItem.QtoDetailGroupId === selectItem.QtoDetailGroupId &&
								((selectedBoqItemFk > 0 && selectItem.BoqItemFk !== selectedBoqItemFk) || (selectedLocationFk > 0 && selectItem.PrjLocationFk !== selectedLocationFk))) {

								strContent = $translate.instant('qto.main.createQtoDetainWithDiffAssignment');
								platformModalService.showMsgBox(strContent, strTitle, 'info');
								service.isInsert = false;
								return;
							}

						}

					}

					var lastNumber = qtoTypeFk === 1 ? 99999 : 9999;
					if ((!isInsert && selectItem && selectItem.PageNumber === lastNumber && selectItem.LineReference === 'Z') || (!isInsert && !selectItem && lastItem && lastItem.PageNumber === lastNumber && lastItem.LineReference === 'Z')) {
						strContent = $translate.instant('qto.main.detail.addressOverflow');
						platformModalService.showMsgBox(strContent, strTitle, 'info');
					} else {
						let allPromises = [];

						if (hasError(itemList)) {
							let defer = $q.defer();
							defer.resolve(true);
							allPromises.push(defer.promise);
						} else {
							if (boqType === qtoBoqType.PrcBoq) {// isPrcBoq
								var prcBoqService = parentService.parentService();
								var prcPackageService = prcBoqService.parentService();
								allPromises.push(prcPackageService.update());
							} else if (boqType === qtoBoqType.WipBoq || boqType === qtoBoqType.BillingBoq) {

								var mainDataService = parentService.parentService();
								allPromises.push(mainDataService.update());
							} else if (boqType === qtoBoqType.PesBoq) {

								var procurementPesBoqService = parentService.parentService();
								var procurementPesHeaderService = procurementPesBoqService.parentService();
								allPromises.push(procurementPesHeaderService.update());
							} else {
								allPromises.push(parentService.update());
							}
						}

						$q.all(allPromises).then(function (response) {
							if (response && response[0]) {
								selectItem = itemList && itemList.length > 0 && selectItem === null ? itemList[itemList.length - 1] : selectItem;
								service.createQtoLine(selectItem, isInsert, false);
							}
						});
					}
				};
				service.getProfileFormCopyConfig = function getProfileFormCopyConfig() {
					let groupKey = 'qto.main.qtoDetailCopy';
					let appId = '1840b2391ae9454cad1a053b773f84d5';
					if(!service.copyConfigItem){
						$http.get(globals.webApiBaseUrl + 'procurement/common/option/getprofile?groupKey=' + groupKey + '&appId=' + appId).then(function (response){
							if(response.data && response.data.length > 0){
								let config = _.find(response.data, {'ProfileAccessLevel': 'User'});
								if(config){
									service.copyConfigItem = JSON.parse(config.PropertyConfig);
								}
							}
						});
					}

				}
				service.getProfileFormCopyConfig();

				var deleteEntities = serviceContainer.service.deleteEntities;
				serviceContainer.service.deleteEntities = deleteEntitiesFunc;

				function deleteEntitiesFunc(entities, skipShowErrorMessage) {
					var canDelete = true;
					var isExistAssignment = false;

					var errorMsg = 'qto.main.cannotDeleteQtoLines';

					if (boqType === qtoBoqType.WipBoq || boqType === qtoBoqType.BillingBoq || boqType === qtoBoqType.PesBoq) {

						var existReadOnly = _.filter(entities, {IsReadonly: true});
						var existAssignment = _.filter(entities, function (item) {
							return item.WipHeaderFk || item.PesHeaderFk || item.BilHeaderFk;
						});

						if (existReadOnly && existReadOnly.length) {
							errorMsg = 'qto.main.cannotDeleteQtoLinesAsReadOnly';
							canDelete = false;
						} else if (existAssignment && existAssignment.length) {
							var moduleName = 'WIP';
							switch (boqType) {
								case  qtoBoqType.BillingBoq:
									moduleName = 'Bill';
									break;
								case  qtoBoqType.PesBoq:
									moduleName = 'Pes';
									break;
							}
							errorMsg = $translate.instant('qto.main.deleteQtoLinesWarningMsg', {moduleName: moduleName});
							isExistAssignment = true;
						}
					} else {
						angular.forEach(entities, function (entity) {
							if ((entity.WipHeaderFk || entity.PesHeaderFk || entity.BilHeaderFk || entity.IsReadonly) && entity.Version > 0) {
								canDelete = false;
							}
						});
					}

					let afterDeleteEntitiesCallBack = function () {

						let qtoDetails = service.getList();

						let deleteEneititesGroupIds = _.map(entities, 'QtoDetailGroupId');
						let deleteEneititesGroupItems = _.filter(qtoDetails, function (item) {
							return _.includes(deleteEneititesGroupIds, item.QtoDetailGroupId);
						});

						if (deleteEneititesGroupItems && deleteEneititesGroupItems.length > 0) {
							service.updateQtoLineReferenceReadOnly(deleteEneititesGroupItems);

							// delete one of group, will recalculate remain group lines
							service.markEntitiesAsModified(deleteEneititesGroupItems);
						}

						if (parentService.setRubricCatagoryReadOnly) {
							let sheetList = $injector.get('qtoMainStructureDataService').getList();
							parentService.getSelected().hasQtoDetal = !!qtoDetails.length || !!sheetList.length;
							parentService.setRubricCatagoryReadOnly.fire();
						}
					};

					if (!canDelete) {
						if (!skipShowErrorMessage) {
							platformModalService.showErrorBox(errorMsg, 'cloud.common.errorMessage');
						}
					} else if (isExistAssignment) {
						if (!skipShowErrorMessage) {
							platformModalService.showYesNoDialog(errorMsg, 'cloud.common.errorMessage').then(function (response) {
								if (response.yes) {
									return deleteEntities(entities).then(afterDeleteEntitiesCallBack);
								}
							});
						}
					} else {
						errorMsg = 'qto.main.cannotDeleteQtoLinesAsReferenceObj';
						let qtoDetailIds = _.map(entities, 'Id');
						let postParam = {
							QtoDetailIds: qtoDetailIds
						};

						return $http.post(globals.webApiBaseUrl + 'qto/main/detail/checkDataBeforeDelete', postParam).then(function (response) {
							if (response && !response.data) {
								platformModalService.showErrorBox(errorMsg, 'cloud.common.errorMessage');
								return $q.when(true);
							}
							return deleteEntities(entities).then(afterDeleteEntitiesCallBack);
						});
					}

					return $q.when(true);
				}

				// create qto detail: get the next line address
				service.createQtoLine = function createQtoLine(selectItem, isInsert, fromBoqChanged) {
					let strTitle = $translate.instant('qto.main.detail.createQtoLineTilte');

					let headerItem = parentService.getSelected();
					let multiLines = [];
					if (headerItem) {
						if(headerItem.QTOStatusFk === qtoBoqType.QtoBoq || headerItem.PrjChangeStutasReadonly){
							return;
						}
						if (selectItem && selectItem.QtoFormula && selectItem.QtoFormula.IsMultiline) {
							multiLines = service.getReferencedDetails(selectItem);
						}

						let postParam = {
							QtoHeaderFk: (boqType === qtoBoqType.QtoBoq) ? headerItem.Id : null,
							SelectedPageNumber: service.selectedPageNumber,
							SelectItem: selectItem,
							IsInsert: isInsert,
							BoqHeaderFk: headerItem.BoqHeaderFk,
							IsPrjBoq: (boqType === qtoBoqType.PrjBoq),
							IsPrcBoq: (boqType === qtoBoqType.PrcBoq),
							IsBillingBoq: (boqType === qtoBoqType.BillingBoq),
							IsWipBoq: (boqType === qtoBoqType.WipBoq),
							IsPesBoq: (boqType === qtoBoqType.PesBoq),
							IsQtoBoq: (boqType === qtoBoqType.QtoBoq),
							MultiLines: multiLines
						};

						if (boqType === qtoBoqType.WipBoq || boqType === qtoBoqType.BillingBoq || boqType === qtoBoqType.PesBoq) {
							postParam.BoqHeaderFk = parentService.getSelected().BoqItemPrjBoqFk;
						}

						// Append: create new item behind select item; Insert: create new item ahead of select item
						$http.post(globals.webApiBaseUrl + 'qto/main/detail/getnextlineaddress', postParam).then(
							function (response) {
								let data = response.data;

								let creationOptions = {};
								creationOptions.SelectItem = postParam.SelectItem;
								creationOptions.IsInsert = isInsert;
								creationOptions.FromBoqChanged = fromBoqChanged;

								var lastSheet = headerItem.QtoTypeFk === 1 ? '100000' : '10000';
								let targetQtoDetailReference = data.TargetAddress.QtoDetailReference;
								let targetSheet =  headerItem.QtoTypeFk === qtoType.FreeQTO && targetQtoDetailReference ? targetQtoDetailReference.slice(0, 5) :
									targetQtoDetailReference.slice(0, 4);
								if (data.ExistAddress.LineReference) {
									if (!isInsert) {
										if (data.TargetAddress.IsOverflow || targetSheet === lastSheet) {
											var strContent = $translate.instant('qto.main.detail.addressOverflow');
											platformModalService.showMsgBox(strContent, strTitle, 'info');
											finishCreatingItem();
										} else {
											var strContent1 = $translate.instant('qto.main.detail.createQtoLineWarning', {
												value0: data.CurrenctAddress.QtoDetailReference,
												value1: data.ExistAddress.QtoDetailReference,
												value2: data.TargetAddress.QtoDetailReference
											});
											platformModalService.showYesNoDialog(strContent1, strTitle, 'yes').then(function (result) {
												if (result.yes) {
													service.lineAddress = data.TargetAddress;
													baseCreateItem(creationOptions);
												} else {
													finishCreatingItem();
												}
											});
										}
									} else {
										var strContent2 = $translate.instant('qto.main.detail.insertQtoLineWarning', {
											value0: data.CurrenctAddress.QtoDetailReference,
											value1: data.ExistAddress.QtoDetailReference
										});
										platformModalService.showMsgBox(strContent2, strTitle, 'info');
										finishCreatingItem();
									}
								} else {
									if (data.TargetAddress && (data.TargetAddress.IsOverflow || targetSheet === lastSheet)) {
										var strContentOver = $translate.instant('qto.main.detail.addressOverflow');
										platformModalService.showMsgBox(strContentOver, strTitle, 'info');
										finishCreatingItem();
									} else {
										service.lineAddress = data.TargetAddress;
										baseCreateItem(creationOptions);
									}
								}

								service.isInsert = false;
							}
						);
					}
				};

				service.insertItem = function insertItem() {
					var selectItem = service.getSelected();
					service.deleteTemporaryQtos();
					// select item to insert and can not insert at 0001A0
					if (selectItem && !(selectItem.PageNumber === 1 && selectItem.LineReference === 'A' && selectItem.LineIndex === 0)) {
						service.isInsert = true;
						service.createItem();
						// service.cellStyleChanged.fire();
						// service.resizeGrid.fire();
					}
				};

				service.allQtoDetailEntities = []; // not the compelete qto line entities, it only was used for genereate qto detail reference
				service.getAllQtoDetailEntities = function () {
					let defer = $q.defer();
					let selectedQtoHeaderEntity = parentService.getSelected();
					if (selectedQtoHeaderEntity) {
						$http.get(globals.webApiBaseUrl + 'qto/main/detail/getListByQtoHeaderId?qtoHeaderId=' + selectedQtoHeaderEntity.Id).then(function (response) {
							let allSavedQtoDetailEntities = response.data.QtoDetailEntityList;
							let allShownQtoDetailEntities = service.getList();
							service.allQtoDetailEntities = [];
							if (allSavedQtoDetailEntities) {
								if (allShownQtoDetailEntities) {
									while (allSavedQtoDetailEntities.length > 0) {
										var qtoDetailDto = allSavedQtoDetailEntities.pop();
										var findResult = _.find(allShownQtoDetailEntities, {Id: qtoDetailDto.Id});
										if (!findResult) {
											service.allQtoDetailEntities.push(qtoDetailDto);
										}
									}
									service.allQtoDetailEntities = service.allQtoDetailEntities.concat(allShownQtoDetailEntities);
								} else {
									service.allQtoDetailEntities = allSavedQtoDetailEntities;
								}
							} else {
								if (allShownQtoDetailEntities) {
									service.allQtoDetailEntities = allShownQtoDetailEntities;
								}
							}
							defer.resolve();
						});
					} else {
						defer.resolve();
					}
					return defer.promise;
				};

				if (boqType === qtoBoqType.QtoBoq) {
					service.getAllQtoDetailEntities();
				}

				service.setSplitResult = function (splitResult) {
					service.splitResult = splitResult;
					service.IsSplitLine = true;
				};

				service.setSplitCell = function (splitCell) {
					service.splitCell = splitCell;
				};

				service.copyPaste = function copyPaste(isDrag, dragItems, toTarget, toTargetItemId, selectedItem, PageNumber, QtoSheetFk, isSearchCopy,ordHeaderFk) {

					var currentQtoHeader = parentService.getSelected();
					var allPromises = [];
					if (boqType === qtoBoqType.PrcBoq) { // note how about pes boq
						let prcBoqService = parentService.parentService();
						let prcPackageService = prcBoqService.parentService();
						allPromises.push(prcPackageService.update());
					} else if (boqType === qtoBoqType.WipBoq || boqType === qtoBoqType.BillingBoq) {
						let mainDataService = parentService.parentService();
						allPromises.push(mainDataService.update());
					} else if (boqType === qtoBoqType.PesBoq) {

						let procurementPesBoqService = parentService.parentService();
						let procurementPesHeaderService = procurementPesBoqService.parentService();
						allPromises.push(procurementPesHeaderService.update());
					} else {
						allPromises.push(parentService.update());
					}

					$q.all(allPromises).then(function (respone) {
						if (!respone || (respone && !respone[0])) {
							return;
						}
						service.getAllQtoDetailEntities().then(
							function () {
								let selectItems = [];
								if (isDrag) {
									selectItems = dragItems;
								}
								else if (service.IsSplitLine){
									selectedItem.LineText = service.splitResult[0];
									selectedItem.IsSplitLine = true;
									data.markItemAsModified(selectedItem, data);
									for (let i = 1; i < service.splitResult.length; i++) {
										let splitItem = angular.copy(selectedItem);
										splitItem.Id = i;
										selectItems.push(splitItem);
									}
								}
								else {
									selectItems = service.getSelectedEntities();
								}
								let copyItems = angular.copy(selectItems);
								if (selectItems.length > 0) {
									let isNotCpoyCostGrp = selectItems[0].IsNotCpoyCostGrp;
									let qtoHeaderId = selectItems[0].QtoHeaderFk;
									let qtoTypeFk = selectItems[0].QtoTypeFk;
									let copyCostGroupFromStructure = getCopyCostGroupFromStructure();
									let selectedQtoHeader = parentService.getSelected();
									if (selectedQtoHeader) {
										let postParam = {
											QtoHeaderFk: qtoHeaderId,
											SelectedPageNumber: PageNumber,
											SelectItem: selectedItem,
											items: copyItems,
											QtoSheetFk: QtoSheetFk ? QtoSheetFk : null,
											basRubricCategoryFk: currentQtoHeader.BasRubricCategoryFk,
											QtoTypeFk: qtoTypeFk,
											IsNotCpoyCostGrp: isNotCpoyCostGrp || copyCostGroupFromStructure,
											IsDrag: isDrag,
											IsSearchCopy: isSearchCopy,
											IsSplitLine: service.IsSplitLine
										};

										var qtoSheets = $injector.get('qtoMainStructureDataService').getList();

										$http.post(globals.webApiBaseUrl + 'qto/main/detail/createitems', postParam).then(function (response) {
											let isOverflow = response.data.IsOverflow;
											if (isOverflow) {
												let strTitle = $translate.instant('qto.main.detail.createQtoLineTilte');
												let strContent = $translate.instant('qto.main.detail.addressOverflow');
												platformModalService.showMsgBox(strContent, strTitle, 'info');
												return;
											}

											let targetItems = [];
											let pageNumberList = [];

											let newItems = [];
											let isGeneratedNo = response.data.IsGeneratedNo;
											let qtoLines = response.data.QtoLines;
											// for multi lines type, return CopyItems >= copyItems
											if (response.data.CopyItems) {
												let qtoFormuals = basicsLookupdataLookupDescriptorService.getData('QtoFormula');
												if (qtoFormuals && qtoFormuals.length > 0) {
													for (let i = 0; i < response.data.CopyItems.length; i++) {
														response.data.CopyItems[i].QtoFormula = _.find(qtoFormuals, {'Id': response.data.CopyItems[i].QtoFormulaFk});
													}
												}
												copyItems = response.data.CopyItems;
											}

											// Darg: filter new lines for missing split no
											if (isDrag) {
												var missingSplitNo = '';
												_.each(qtoLines, function (qtoLine) {
													if (qtoLine.SplitNo > 0) {
														missingSplitNo += _.isEmpty(missingSplitNo) ? qtoLine.SplitNo : ',' + qtoLine.SplitNo;
													} else {
														newItems.push(qtoLine);
													}
												});

												if (!_.isEmpty(missingSplitNo)) {
													var msg = $translate.instant('qto.main.missSplitNoWarning', {
														warning: missingSplitNo
													});
													platformModalService.showMsgBox(msg, 'qto.main.missSplitNoTitle', 'warning');
												}
											} else {
												newItems = qtoLines;
											}
											var csotGroups = response.data.CostGroups;
											basicsLookupdataLookupDescriptorService.updateData('QtoDetail2CostGroups', csotGroups);
											for (var i = 0; i < newItems.length; i++) {
												var targetItem = newItems[i];
												var sourceItem = _.find(copyItems, {'Id': targetItem.SourceQtoDetailId});
												targetItem.IsCopy = true;
												targetItem.IsCalculate = true;
												// copy the dynamic qto2costgroups
												if (csotGroups && csotGroups.length > 0) {
													targetItem.CostGroupsToCopy = _.filter(csotGroups, {'MainItemId': targetItem.Id});
													// targetItem.IsCopy = true;
												}
												service.doCopyQtoDetail(targetItem, sourceItem, toTarget, toTargetItemId, selectedItem, PageNumber, QtoSheetFk, isGeneratedNo,ordHeaderFk);
												targetItem.ignoreScriptValidation = true;

												updateQtoDetailWithCopyoption(targetItem, sourceItem);
												service.allQtoDetailEntities.push(targetItem);

												if (service.IsSplitLine) {
													targetItem.LineText = service.splitResult[i + 1];
													targetItem.IsSplitLine = true;
												}

												if (!isGeneratedNo) {
													getNewPageNumber(targetItem, qtoSheets);
												}
												let index1 = _.findIndex(qtoSheets, {'PageNumber': targetItem.PageNumber});
												let index2 = pageNumberList.indexOf(targetItem.PageNumber);
												if (index1 === -1 && index2 === -1) {
													pageNumberList.push(targetItem.PageNumber);
												}

												if (index1 !== -1) {
													var qtoSheet = _.filter(qtoSheets, {'PageNumber': targetItem.PageNumber});
													if (qtoSheet && qtoSheet.length > 0) {
														targetItem.QtoSheetFk = qtoSheet[0].Id;
													}
												}
												targetItems.push(targetItem);
											}

											if (pageNumberList.length > 0) {
												// create the qto sheets
												service.doCreateQtoSheets(qtoHeaderId, targetItems, pageNumberList, qtoTypeFk);
											} else {
												_.forEach(targetItems, function (item) {
													// fireSomeEvents(item, data, true);
													data.itemList.push(item);
													data.addEntityToCache(item, data);
													data.markItemAsModified(item, data);

													afterCopyDrag(item, data);
												});

												data.listLoaded.fire(null, data.itemList);
												service.updateCalculation(true);
												service.setSelectedRowsAfterDrag(newItems);
											}

											if (service.IsSplitLine){
												let options = {
													item: targetItems[targetItems.length - 1],
													cell: service.splitCell,
													forceEdit: true
												};
												service.setCellFocus(options);

												service.splitResult = [];
												service.IsSplitLine = false;
											}
										});
									}
								}
							});
					});
				};

				function getNewPageNumber(targetItem, qtoSheets) {

					if (qtoSheets && qtoSheets.length > 0) {
						let qtoSheetsNotLock = _.filter(qtoSheets, {'IsReadonly': false});
						if (qtoSheetsNotLock && qtoSheetsNotLock.length > 0) {
							let qtoSheetPageNumbers = _.orderBy(_.filter(qtoSheetsNotLock, function (e) {
								return e.PageNumber;
							}), 'PageNumber');

							if (qtoSheetPageNumbers && qtoSheetPageNumbers.length > 0) {
								let qtoSheetPageNumber = _.first(_.filter(qtoSheetPageNumbers, {'PageNumber': targetItem.PageNumber}));
								let newPageNumberTemp = qtoSheetPageNumber ? targetItem.PageNumber : _.first(qtoSheetPageNumbers).PageNumber;
								if (newPageNumberTemp >= targetItem.PageNumber) {
									targetItem.PageNumber = newPageNumberTemp;
									return;
								}
							} else {
								let qtoSheetPages = _.filter(qtoSheetsNotLock, function (e) {
									return !e.PageNumber && (!e.QtoSheets || e.QtoSheets.length === 0) && e.Description !== '0000-9999';
								});

								if (qtoSheetPages && qtoSheetPages.length > 0) {
									let newPageNumberTemp = _.first(qtoSheetPages).From;
									newPageNumberTemp = newPageNumberTemp === 0 ? 1 : newPageNumberTemp;
									if (newPageNumberTemp >= targetItem.PageNumber) {
										targetItem.PageNumber = newPageNumberTemp;
										return;
									}
								}
							}

							service.getNotLockNewPageNumber(targetItem, qtoSheets);
						} else {
							let qtoSheetsHasNoChild = _.orderBy(_.filter(qtoSheets, function (e) {
								return !e.QtoSheets || e.QtoSheets.length === 0;
							}), 'Description');

							if (qtoSheetsHasNoChild && qtoSheetsHasNoChild.length > 0) {
								let lastQtoSheet = _.last(qtoSheetsHasNoChild);
								if (lastQtoSheet.PageNumber) {
									targetItem.PageNumber = lastQtoSheet.PageNumber + 1;
								} else {
									let newPageNumberTemp = lastQtoSheet.From;
									newPageNumberTemp = newPageNumberTemp === 0 ? 1 : newPageNumberTemp;
									targetItem.PageNumber = newPageNumberTemp;
								}
							}
						}
					}
				}

				service.getNotLockNewPageNumber = function getNotLockNewPageNumber(targetItem, qtoSheets) {
					let qtoSheet = _.find(qtoSheets, {'PageNumber': targetItem.PageNumber});
					if (qtoSheet && qtoSheet.IsReadonly) {
						targetItem.PageNumber = targetItem.PageNumber + 1;
						service.getNotLockNewPageNumber(targetItem, qtoSheets);
					}
				};

				service.doCreateQtoSheets = function (qtoHeaderId, targetItems, pageNumberList, qtoTypeFk) {
					var creationData = {
						MainItemId: qtoHeaderId,
						Numbers: pageNumberList,
						QtoType: qtoTypeFk
					};

					$http.post(globals.webApiBaseUrl + 'qto/main/structure/createbyqtolines', creationData).then(function (response) {
						var qtoSheetItems = response.data;
						$injector.get('qtoMainStructureDataService').loadQtoSheetData(qtoSheetItems);
						var qtoSheetList = [];
						$injector.get('cloudCommonGridService').flatten(qtoSheetItems, qtoSheetList, 'QtoSheets');

						_.forEach(targetItems, function (item) {
							// var createItem;
							var index = _.findIndex(qtoSheetList, {'PageNumber': item.PageNumber});
							if (index !== -1) {
								item.QtoSheetFk = qtoSheetList[index].Id;
							}

							// fireSomeEvents(item, data, true);

							data.itemList.push(item);
							data.addEntityToCache(item, data);
							data.markItemAsModified(item, data);
							afterCopyDrag(item, data);
						});

						data.listLoaded.fire(null, data.itemList);
						service.updateCalculation(true);
						service.setSelectedRowsAfterDrag(targetItems);
					});
				};

				service.doCopyQtoDetail = function doCopyQtoDetail(targetItem, sourceItem, toTarget, toTargetItemId, selectedItem, PageNumber, QtoSheetFk, isGeneratedNo,ordHeaderFk) {
					var id = targetItem.Id;
					var InsertedAt = sourceItem.InsertedAt; // copy date of creation
					var InsertedBy = targetItem.InsertedBy;
					var UpdatedAt = targetItem.UpdatedAt;
					var UpdatedBy = targetItem.UpdatedBy;
					var Version = targetItem.Version;

					if (!isGeneratedNo && !selectedItem && !QtoSheetFk) {
						var maxLineReference = getQtoDetailWithMaxmumLineReference(service.allQtoDetailEntities);
						if (maxLineReference) {
							// maxLineReference !== null always is ture;
							var item = maxLineReference;
							var nexLineAddress = getNewLineAddress(item);
							maxLineReference = null;
							targetItem.PageNumber = PageNumber ? PageNumber : nexLineAddress.PageNumber;
							targetItem.LineReference = nexLineAddress.LineReference;
							targetItem.LineIndex = nexLineAddress.LineIndex;
						} else {
							targetItem.PageNumber = 1;
							targetItem.LineReference = 'A';
							targetItem.LineIndex = 0;
						}
					}

					targetItem.Id = id;
					targetItem.QtoDetailReferenceFk = sourceItem.QtoDetailReferenceFk;

					targetItem.Factor = sourceItem.Factor;
					targetItem.Remark1Text = sourceItem.Remark1Text;
					targetItem.RemarkText = sourceItem.RemarkText;
					targetItem.QtoFormula = sourceItem.QtoFormula;
					targetItem.QtoFormulaFk = sourceItem.QtoFormulaFk;
					targetItem.Operator1 = sourceItem.Operator1;
					targetItem.Operator2 = sourceItem.Operator2;
					targetItem.Operator3 = sourceItem.Operator3;
					targetItem.Operator4 = sourceItem.Operator4;
					targetItem.Operator5 = sourceItem.Operator5;
					targetItem.Result = sourceItem.Result;
					targetItem.V = sourceItem.V;

					targetItem.Value1 = sourceItem.Value1;
					targetItem.Value2 = sourceItem.Value2;
					targetItem.Value3 = sourceItem.Value3;
					targetItem.Value4 = sourceItem.Value4;
					targetItem.Value5 = sourceItem.Value5;
					targetItem.Value1Detail = sourceItem.Value1Detail;
					targetItem.Value2Detail = sourceItem.Value2Detail;
					targetItem.Value3Detail = sourceItem.Value3Detail;
					targetItem.Value4Detail = sourceItem.Value4Detail;
					targetItem.Value5Detail = sourceItem.Value5Detail;
					targetItem.FormulaResult = sourceItem.FormulaResult;
					targetItem.FormulaResultUI = sourceItem.FormulaResultUI;
					targetItem.PrjLocationReferenceFk = sourceItem.PrjLocationReferenceFk;
					targetItem.QtoDetailReferenceFk = sourceItem.QtoDetailReferenceFk;
					targetItem.BoqItemReferenceFk = sourceItem.BoqItemReferenceFk;
					targetItem.LineText = sourceItem.LineText;
					targetItem.QtoDetailGroupId = sourceItem.QtoDetailGroupId;

					targetItem.QtoLineTypeFk = sourceItem.QtoLineTypeFk;

					targetItem.QtoHeaderFk = sourceItem.QtoHeaderFk;
					targetItem.PrjLocationFk = sourceItem.PrjLocationFk;
					targetItem.BillToFk = sourceItem.BillToFk;

					let qtoHeader = service.getQtoHeader();
					targetItem.OrdHeaderFk = qtoHeader && qtoHeader.OrdHeaderFk ? qtoHeader.OrdHeaderFk : sourceItem.OrdHeaderFk;

					targetItem.PrjCostgroup1Fk = sourceItem.PrjCostgroup1Fk;
					targetItem.QtoDetailContinuationFk = sourceItem.QtoDetailContinuationFk;
					targetItem.QtoCommentFk = sourceItem.QtoCommentFk;

					targetItem.AssetMasterFk = sourceItem.AssetMasterFk;
					targetItem.BasBlobsFk = sourceItem.BasBlobsFk;
					targetItem.BasUomFk = sourceItem.BasUomFk;
					targetItem.BidHeaderFk = sourceItem.BidHeaderFk;
					targetItem.Blob = sourceItem.Blob;
					targetItem.BoqHeaderFk = sourceItem.BoqHeaderFk;
					targetItem.BoqItemFk = sourceItem.BoqItemFk;
					targetItem.BoqItemCode = sourceItem.BoqItemCode;
					targetItem.QtoSheetFk = sourceItem.QtoSheetFk;
					targetItem.BoqSubItemFk = sourceItem.BoqSubItemFk;
					targetItem.BoqSubitemReferenceFk = sourceItem.BoqSubitemReferenceFk;
					targetItem.BudgetCodeFk = sourceItem.BudgetCodeFk;
					targetItem.ClassificationFk = sourceItem.ClassificationFk;
					targetItem.IsEstimate = sourceItem.IsEstimate;
					targetItem.IsBlocked = sourceItem.IsBlocked;
					targetItem.WorkCategoryFk = sourceItem.WorkCategoryFk;
					targetItem.SpecialUse = sourceItem.SpecialUse;
					targetItem.MdcControllingUnitFk = sourceItem.MdcControllingUnitFk;
					targetItem.PrcStructureFk = sourceItem.PrcStructureFk;
					targetItem.IsGQ = sourceItem.IsGQ;

					targetItem.EstHeaderFk = sourceItem.EstHeaderFk;
					targetItem.EstLineItemFk = sourceItem.EstLineItemFk;

					targetItem.PerformedDate = _.isString(targetItem.PerformedDate) ? moment.utc(targetItem.PerformedDate) : targetItem.PerformedDate;

					// copy wip, bill and pes
					if (boqType === qtoBoqType.WipBoq || qtoBoqType.BillingBoq || qtoBoqType.PesBoq) {
						targetItem.WipHeaderFk = boqType === qtoBoqType.WipBoq ? sourceItem.WipHeaderFk : null;
						targetItem.BilHeaderFk = boqType === qtoBoqType.BillingBoq ? sourceItem.BilHeaderFk : null;
						targetItem.PesHeaderFk = boqType === qtoBoqType.PesBoq ? sourceItem.PesHeaderFk : null;
					} else {
						targetItem.WipHeaderFk = null;
						targetItem.BilHeaderFk = null;
						targetItem.PesHeaderFk = null;
					}

					if (toTarget === 'boqitem') {
						if(targetItem.BoqItemFk !== toTargetItemId){
							// if boq Item is not same, set lineitem as null or last item
							let lastItem = _.findLast(service.getList(), {BoqItemFk: toTargetItemId});
							targetItem.EstHeaderFk = lastItem ? lastItem.EstHeaderFk : null;
							targetItem.EstLineItemFk = lastItem ? lastItem.EstLineItemFk : null;
						}
						targetItem.BoqItemFk = toTargetItemId;
					} else if (toTarget === 'Locations') {
						targetItem.PrjLocationFk = toTargetItemId;
					} else if (toTarget === 'qtoMainStructure') {
						targetItem.QtoSheetFk = toTargetItemId;
					}else if(toTarget ==='BillTos'){
						targetItem.BillToFk = toTargetItemId;
						targetItem.OrdHeaderFk = ordHeaderFk;
					} else if(toTarget ==='LineItems'){
						targetItem.BoqHeaderFk = toTargetItemId.BoqHeaderFk;
						targetItem.BoqItemFk = toTargetItemId.BoqItemFk;

						let lastItem = _.findLast(service.getList(), {BoqItemFk: toTargetItemId.BoqItemFk});
						targetItem.EstHeaderFk = !lastItem || !!lastItem.EstHeaderFk ? toTargetItemId.EstHeaderFk : null;
						targetItem.EstLineItemFk = !lastItem || !!lastItem.EstLineItemFk ? toTargetItemId.Id : null;

					}

					// if boq item is same, set the split as last qto item.
					if (!targetItem.BoqSplitQuantityFk && targetItem.HasSplitQuantiy && sourceItem && targetItem.BoqItemFk === sourceItem.BoqItemFk) {
						targetItem.BoqSplitQuantityFk = sourceItem.BoqSplitQuantityFk;
					}

					if (targetItem.BoqSplitQuantityFk){
						clearEstLineItemAssignment(targetItem);
					}

					targetItem.IsReadonly = false;
					targetItem.InsertedAt = InsertedAt;
					targetItem.InsertedBy = InsertedBy;
					targetItem.UpdatedAt = UpdatedAt;
					targetItem.UpdatedBy = UpdatedBy;
					targetItem.Version = Version;
				};

				service.CopyQtoDetailByDrag = function checkCopyPaste(isDrag, dragItems, toTarget, toTargetItemId, selectedItem, PageNumber, QtoSheetFk) {
					if (selectedItem || QtoSheetFk) {

						// drag to sheet, when has range, should do validation.
						if (PageNumber && sheetAreaList && sheetAreaList.length > 0) {
							let index = _.indexOf(sheetAreaList, PageNumber);
							if (index === -1) {
								let strTitle = $translate.instant('qto.main.detail.createQtoLineTilte');
								let strContent = $translate.instant('qto.main.detail.addressOverflow');
								platformModalService.showMsgBox(strContent, strTitle, 'info');
								return;
							}
						}

						let selectedQtoHeader = parentService.getSelected();
						let postParam = {
							QtoHeaderFk: selectedQtoHeader.Id,
							SelectedPageNumber: service.selectedPageNumber,
							SelectItem: selectedItem,
							QtoSheetFk: QtoSheetFk ? QtoSheetFk : null,
							IsInsert: isDrag
						};

						$http.post(globals.webApiBaseUrl + 'qto/main/detail/getnextlineaddress', postParam).then(
							function (response) {
								var data = response.data;
								if (data.ExistAddress.LineReference) {
									let strTitle = $translate.instant('qto.main.detail.createQtoLineTilte');
									if (!isDrag) {
										var lastSheet = qtoTypeFk === 1 ? '100000' : '10000';
										let targetQtoDetailReference = data.TargetAddress.QtoDetailReference;
										let targetSheet =  qtoTypeFk === qtoType.FreeQTO && targetQtoDetailReference ? targetQtoDetailReference.slice(0, 5) :
											targetQtoDetailReference.slice(0, 4);
										if (targetSheet === lastSheet || data.TargetAddress.IsOverflow) {
											var strContent = $translate.instant('qto.main.detail.addressOverflow');
											platformModalService.showMsgBox(strContent, strTitle, 'info');
										} else {
											var strContent1 = $translate.instant('qto.main.detail.createQtoLineWarning', {
												value0: data.CurrenctAddress.QtoDetailReference,
												value1: data.ExistAddress.QtoDetailReference,
												value2: data.TargetAddress.QtoDetailReference
											});
											platformModalService.showYesNoDialog(strContent1, strTitle, 'yes').then(function (result) {
												if (result.yes) {
													service.copyPaste(isDrag, dragItems, toTarget, toTargetItemId, selectedItem, PageNumber, QtoSheetFk);
												}
											});
										}
									}
								} else {
									service.copyPaste(isDrag, dragItems, toTarget, toTargetItemId, selectedItem, PageNumber, QtoSheetFk);
								}
							}
						);
					}
				};

				function initSomeProperties(newItem, data) {
					if (boqLineTypeFk === 0 && angular.isArray(service.filterBoqs) && service.filterBoqs.length > 0) {
						newItem.BoqItemFk = service.filterBoqs[0];
					}
					if (service.filterLocations && service.filterLocations.length > 0) {
						newItem.PrjLocationFk = service.filterLocations[0];
					}

					if (service.filterBillTos && service.filterBillTos.length > 0) {
						newItem.BillToFk = service.filterBillTos[0];
					}

					let length = data.itemList.length;
					let selectItem = service.getSelected();
					let lastQtoDetail = selectItem ? selectItem : data.itemList[length - 1];

					if (lastQtoDetail !== null && lastQtoDetail !== undefined && Object.prototype.hasOwnProperty.call(lastQtoDetail, 'Id')) {
						// Assign BoqItemCode and BoqItemFk
						newItem.BoqItemCode = lastQtoDetail.BoqItemCode;
						newItem.BoqItemFk = lastQtoDetail.BoqItemFk;

						if (lastQtoDetail.QtoLineTypeFk !== qtoMainLineType.CommentLine &&
							lastQtoDetail.QtoLineTypeFk !== qtoMainLineType.RRefrence &&
							lastQtoDetail.QtoLineTypeFk !== qtoMainLineType.LRefrence &&
							lastQtoDetail.QtoLineTypeFk !== qtoMainLineType.IRefrence) {
							newItem.QtoFormula = lastQtoDetail.QtoFormula;
							newItem.QtoFormulaFk = lastQtoDetail.QtoFormulaFk;
						}

						newItem.BasUomFk = lastQtoDetail.BasUomFk;
						newItem.ClassificationFk = lastQtoDetail.ClassificationFk;
						newItem.BudgetCodeFk = lastQtoDetail.BudgetCodeFk;
						newItem.AssetMasterFk = lastQtoDetail.AssetMasterFk;
					}

					let isValidateBoqSplitQuantity, isValidateEstLineItem;
					// if select boq
					// if boqtype is prjBoq or prcBoq ,use parentserveri.then keep the newitem value
					if (boqType !== qtoBoqType.QtoBoq && (boqType !== qtoBoqType.WipBoq && boqType !== qtoBoqType.BillingBoq && boqType !== qtoBoqType.PesBoq)) {
						let boqItem = parentService.getSelected();
						newItem.BoqItemFk = boqItem.Id;
						newItem.BoqItemCode = boqItem.Reference;
						newItem.BasUomFk = boqItem.BasUomFk;
					} else if (selectBoq && (selectBoq.BoqLineTypeFk === 0 || selectBoq.BoqLineTypeFk === 11)) { // 0: position; 11: CrbSubQuantity
						newItem.BoqItemFk = selectBoq.Id;
						newItem.BoqItemCode = selectBoq.Reference;
						newItem.BasUomFk = selectBoq.BasUomFk;
						isValidateBoqSplitQuantity = true;
						isValidateEstLineItem = true;
					}

					// if boq item is same, set the split as last qto item.
					if (!newItem.BoqSplitQuantityFk && newItem.HasSplitQuantiy && lastQtoDetail && newItem.BoqItemFk === lastQtoDetail.BoqItemFk) {
						newItem.BoqSplitQuantityFk = lastQtoDetail.BoqSplitQuantityFk;
					}

					// select line item to create qto item
					let selectedLineItem = getSelectedLineItem();
					if (selectedLineItem) {
						assignPropertiesByLineItem(newItem, selectedLineItem);
						newItem.selectLineItem2Create = true;
						isValidateEstLineItem = true;

						// if the boq item already has est line item, set the est line item as last qto item, else set as null
						let lastItem = _.findLast(service.getList(), {BoqItemFk: newItem.BoqItemFk});
						if (lastItem && !lastItem.EstLineItemFk) {
							newItem.EstHeaderFk = null;
							newItem.EstLineItemFk = null;
						}
					} else {
						// if boq item is same, set the lineItem as last qto item.
						if (!newItem.EstLineItemFk && newItem.HasEstLineItem) {
							let lastItem = _.findLast(service.getList(), {BoqItemFk: newItem.BoqItemFk});
							if (lastItem) {
								newItem.EstHeaderFk = lastItem.EstHeaderFk;
								newItem.EstLineItemFk = lastItem.EstLineItemFk;
							}
						}
					}

					let qtoDetailValidationService = $injector.get('qtoMainDetailGridValidationService');
					// do validate for boq split quantity
					if (isValidateBoqSplitQuantity) {
						qtoDetailValidationService.validateBoqSplitQuantityFk(newItem, newItem.BoqSplitQuantityFk, 'BoqSplitQuantityFk');
					}

					// do validate for est line item
					if (isValidateEstLineItem) {
						qtoDetailValidationService.validateEstLineItemFk(newItem, newItem.EstLineItemFk, 'EstLineItemFk');
					}

					let selectedLocation = $injector.get('qtoMainLocationDataService').getSelected();
					if (selectedLocation) {
						newItem.PrjLocationFk = selectedLocation.Id;
					}

					let selectedBillTo = $injector.get('qtoMainBillToDataService').getSelected();
					if (selectedBillTo && qtoHeader &&  qtoHeader.QtoTargetType === 2) {
						newItem.BillToFk = selectedBillTo.Id;
					}

					if (newItem.QtoTypeFk) {
						let qtoHeader = parentService.getSelected();
						newItem.QtoTypeFk = qtoHeader.QtoTypeFk;
					}

					if (newItem.BoqSplitQuantityFk){
						clearEstLineItemAssignment(newItem);
					}

					// to convert to date utc
					convertDateToUtcDate(newItem);
				}

				function fireSomeEvents(newItem, data, isPush) {
					newItem.IsCalculate = true; // TODO: when new item(create, insert and copy), calculate the qto line
					data.itemList.push(newItem);
					if (!isPush) {
						service.allQtoDetailEntities.push(newItem);
					}
					platformDataServiceDataProcessorExtension.doProcessItem(newItem, data);


					let grid = $injector.get('platformGridAPI').grids.element('id', service.getGridId());
					if (grid && grid.instance) {
						grid.instance.sortColumn = null;
					}

					let sortProperty = ['PageNumber', 'LineReference', 'LineIndex'];
					service.getList().sort(service.sortDetail(sortProperty));
					service.allQtoDetailEntities.sort(service.sortDetail(sortProperty));

					data.listLoaded.fire(null, newItem);

					if (!service.createQtoItemByBoqItemChangeFlag) {
						data.entityCreated.fire(null, newItem);
					} else {
						newItem.createQtoItemByBoqItemChangeFlag = true;

						// highlight
						grid = $injector.get('platformGridAPI').grids.element('id', service.getGridId());
						let ids = _.map([newItem], 'Id');
						let rows = grid.dataView.mapIdsToRows(ids);
						grid.instance.setSelectedRows(rows, true);

						data.selectedItem = newItem;
						service.setSelected(newItem);
						if (service.updateQtoBtnTools) {
							service.updateQtoBtnTools.fire();
						}

						let qtoDocumentService = $injector.get('qtoDetailDocumentService');
						if ($injector.get('platformGridAPI').grids.exist(qtoDocumentService.getGridId())) {
							qtoDocumentService.setCurrentParentItem(newItem);
							qtoDocumentService.load();
						}
					}

					service.cellStyleChanged.fire(newItem);
					service.resizeGrid.fire(newItem);

					service.createQtoItemByBoqItemChangeFlag = false;
					data.markItemAsModified(newItem, data);

					if (newItem.QtoFormula && newItem.QtoFormula.QtoFormulaTypeFk === 2) {
						var readOnlyColumns = ['Value1', 'Value2', 'Value3', 'Value4', 'Value5',
							'Operator1', 'Operator2', 'Operator3', 'Operator4', 'Operator5', 'Value1Detail', 'Value2Detail', 'Value3Detail', 'Value4Detail', 'Value5Detail'];
						qtoDetailReadOnlyProcessor.updateReadOnly(newItem, readOnlyColumns, true);
						qtoDetailReadOnlyProcessor.updateReadOnly(newItem, ['LineText'], false);
					}
				}

				function afterCopyDrag(newItem, data) {
					platformDataServiceDataProcessorExtension.doProcessItem(newItem, data);

					var sortProperty = ['PageNumber', 'LineReference', 'LineIndex'];
					service.getList().sort(service.sortDetail(sortProperty));
					service.allQtoDetailEntities.sort(service.sortDetail(sortProperty));

					if (newItem.QtoFormula && newItem.QtoFormula.QtoFormulaTypeFk === 2) {
						var readOnlyColumns = ['Value1', 'Value2', 'Value3', 'Value4', 'Value5',
							'Operator1', 'Operator2', 'Operator3', 'Operator4', 'Operator5', 'Value1Detail', 'Value2Detail', 'Value3Detail', 'Value4Detail', 'Value5Detail'];
						qtoDetailReadOnlyProcessor.updateReadOnly(newItem, readOnlyColumns, true);
						qtoDetailReadOnlyProcessor.updateReadOnly(newItem, ['LineText'], false);
					}

				}

				service.setSelectedRowsAfterDrag = function setSelectedRowsAfterDrag(newItems) {
					let sortProperty = ['PageNumber', 'LineReference', 'LineIndex'];
					service.getList().sort(service.sortDetail(sortProperty));
					service.allQtoDetailEntities.sort(service.sortDetail(sortProperty));
					service.gridRefresh();
					service.setSelectedEntities(newItems, data);
					if (newItems.length === 1) {
						service.setSelected(newItems[0]);
					}
					let grid = $injector.get('platformGridAPI').grids.element('id', service.getGridId());
					let ids = _.map(newItems, 'Id');
					let rows = grid.dataView.mapIdsToRows(ids);
					grid.instance.setSelectedRows(rows, true);

					_.each(newItems, function (item) {
						service.cellStyleChanged.fire(item);
					});
				};

				function getSelectedBoqItemId() {
					let selectedBoqItemFk = -1;
					let selectedBoqItem = service.getSelectedBoqItem();
					if (selectedBoqItem) {
						if (boqType === qtoBoqType.WipBoq || boqType === qtoBoqType.BillingBoq || boqType === qtoBoqType.PesBoq) {
							selectedBoqItemFk = selectedBoqItem.BoqItemPrjItemFk;
						} else {
							selectedBoqItemFk = selectedBoqItem.Id;
						}
					}

					return selectedBoqItemFk;
				}

				service.getSelectedBoqItem = function() {
					let selectedBoqItem;
					if (boqType === qtoBoqType.WipBoq || boqType === qtoBoqType.BillingBoq || boqType === qtoBoqType.PesBoq) {
						selectedBoqItem = parentService.getSelected();
					} else {
						if (boqType === qtoBoqType.QtoBoq) {
							selectedBoqItem = $injector.get('qtoBoqStructureService').getSelected();

						} else {
							selectedBoqItem = parentService.getSelected();
						}
					}

					return selectedBoqItem;
				};

				function getSelectedLineItem() {
					let selectedLineItem = null;
					if (boqType === qtoBoqType.WipBoq) {
						selectedLineItem = $injector.get('salesWipEstimateLineItemDataService').getSelected();
					}
					else if (boqType === qtoBoqType.BillingBoq) {
						selectedLineItem = $injector.get('salesBillingEstimateLineItemDataService').getSelected();
					}
					else if (boqType === qtoBoqType.QtoBoq) {
						selectedLineItem = $injector.get('qtoMainLineItemDataService').getSelected();
					}

					return selectedLineItem;
				}

				function assignPropertiesByLineItem(newItem, selectedLineItem){
					newItem.EstLineItemFk = selectedLineItem.Id;
					newItem.EstHeaderFk = selectedLineItem.EstHeaderFk;
					newItem.BoqHeaderFk = selectedLineItem.BoqHeaderFk;
					newItem.BoqItemFk = selectedLineItem.BoqItemFk;
					newItem.MdcControllingUnitFk = selectedLineItem.MdcControllingUnitFk;
					newItem.PrcStructureFk = selectedLineItem.PrcStructureFk;
					newItem.PrjLocationFk = selectedLineItem.PrjLocationFk;
					newItem.AssetMasterFk = selectedLineItem.MdcAssetMasterFk;

					newItem.SortCode01Fk = selectedLineItem.SortCode01Fk;
					newItem.SortCode02Fk = selectedLineItem.SortCode02Fk;
					newItem.SortCode03Fk = selectedLineItem.SortCode03Fk;
					newItem.SortCode04Fk = selectedLineItem.SortCode04Fk;
					newItem.SortCode05Fk = selectedLineItem.SortCode05Fk;
					newItem.SortCode06Fk = selectedLineItem.SortCode06Fk;
					newItem.SortCode07Fk = selectedLineItem.SortCode07Fk;
					newItem.SortCode08Fk = selectedLineItem.SortCode08Fk;
					newItem.SortCode09Fk = selectedLineItem.SortCode09Fk;
					newItem.SortCode10Fk = selectedLineItem.SortCode10Fk;
				}

				function getselectedPrjLocationId() {
					let selectedLocation = $injector.get('qtoMainLocationDataService').getSelected();
					return selectedLocation ? selectedLocation.Id : -1;
				}

				function getCopyCostGroupFromStructure(){
					const copyOption = qtoMainDetailCopyConfigService.getCopyOptions();

					return copyOption && copyOption.IsActivate && copyOption.CopyPriority === copyPriority.FromLeadingStructure;
				}

				function copyCostGroup(targetItem, sourceItem){
					$timeout(function () {
						// sync cost group
						_.forOwn(sourceItem, function (value, key) {
							if (key.indexOf('costgroup_') !== -1 && sourceItem[key]) {
								let costGroupCol = {
									'field': key,
									'costGroupCatId': parseInt(key.substring(10))
								};

								targetItem[key] = sourceItem[key];
								service.costGroupService.createCostGroup2Save(targetItem, costGroupCol);
							}
						});

						service.markItemAsModified(targetItem);
					}, 100);
				}

				function applyCopyOptionCore(newItem, sourceItem, copyOption, copyOptionMappings, applyFn){
					_.forEach(copyOptionMappings, (copyOptionMapping) => {
						if(copyOption[copyOptionMapping.option]){
							if(_.isArray(copyOptionMapping.props)){
								_.forEach(copyOptionMapping.props, (prop) => {
									applyFn(copyOptionMapping, prop);
								});
							}
							else if(_.isFunction(copyOptionMapping.processor)){
								copyOptionMapping.processor(copyOption, copyOptionMapping);
							}
						}
						else if(!copyOptionMapping.keepOrignalValue){
							_.forEach(copyOptionMapping.props, (prop) => {
								newItem[prop] = null;
							});
						}

						if(_.isFunction(copyOptionMapping.validation)){
							copyOptionMapping.validation(newItem);
						}
					});
				}

				function updateQtoDetailLeadingStructure(newItem, sourceItem, copyOption){

					const copyOptionMappings = [
						{
							option: 'IsLocation',
							props: ['PrjLocationFk'],
							copyFromStructure: true
						},
						{
							option: 'IsControllingUnit',
							props: ['MdcControllingUnitFk'],
							copyFromStructure: true
						},
						{
							option: 'IsLineItem',
							props: ['EstLineItemFk'],
							validation: function(newItem){
								const validationSvc =  $injector.get('qtoMainDetailGridValidationService');
								const result = validationSvc.validateEstLineItemFk(newItem, newItem.EstLineItemFk, 'EstLineItemFk');
								platformRuntimeDataService.applyValidationResult(result, newItem, 'EstLineItemFk');
							},
							copyFromStructure: true
						},
						{
							option: 'IsCostGroup',
							processor: function (){
								if(copyOption.CopyPriority === copyPriority.FromDetails){
									copyCostGroup(newItem, sourceItem);
								}
							},
							copyFromStructure: true
						},
						{
							option: 'IsProcurementStructure',
							props: ['PrcStructureFk'],
							copyFromStructure: true
						},
						{
							option: 'IsAssetMaster',
							props: ['AssetMasterFk'],
							copyFromStructure: false
						},
						{
							option: 'IsSortCode',
							props: ['SortCode01Fk','SortCode02Fk','SortCode03Fk','SortCode04Fk','SortCode05Fk','SortCode06Fk','SortCode07Fk','SortCode08Fk','SortCode09Fk','SortCode10Fk'],
							copyFromStructure: false
						},
						{
							option: 'IsBillTo',
							props: ['BillToFk'],
							copyFromStructure: false
						},
						{
							option: 'IsContract',
							props: ['OrdHeaderFk'],
							copyFromStructure: false
						}
					];

					const applyFn = function(copyOptionMapping, prop){
						if (copyOption.CopyPriority === copyPriority.FromDetails) {
							newItem[prop] = sourceItem ? sourceItem[prop] : null;
						}
						else if(copyOption.CopyPriority === copyPriority.FromLeadingStructure && !copyOptionMapping.copyFromStructure){
							newItem[prop] = null;
						}
					}

					applyCopyOptionCore(newItem, sourceItem, copyOption, copyOptionMappings, applyFn);
				}

				function updateQtoDetailLeadingProperties(newItem, sourceItem, copyOption){

					const copyOptionMappings = [
						{
							option: 'IsType',
							props: ['QtoLineTypeFk'],
							keepOrignalValue: true,
							copyFromDetail: true
						},
						{
							option: 'IsIQ',
							props: ['IsIQ'],
							copyFromDetail: true,
							keepInitValue: true
						},
						{
							option: 'IsBQ',
							props: ['IsBQ'],
							copyFromDetail: true,
							keepInitValue: true
						},
						{
							option: 'IsGQ',
							props: ['IsGQ'],
							copyFromDetail: true,
							validation: function(newItem){
								const validationSvc =  $injector.get('qtoMainDetailGridValidationService');
								validationSvc.validateIsGQ(newItem, newItem.IsGQ, 'IsGQ');
							}
						},
						{
							option: 'IsAQ',
							props: ['IsAQ'],
							copyFromDetail: true,
							keepInitValue: true
						},
						{
							option: 'IsWQ',
							props: ['IsWQ'],
							copyFromDetail: true,
							keepInitValue: true
						},
						{
							option: 'IsUserDefined',
							props: ['UserDefined1','UserDefined2','UserDefined3','UserDefined4','UserDefined5'],
							copyFromDetail: true
						},
						{
							option: 'IsPerformedDate',
							props: ['PerformedDate'],
							keepOrignalValue: true,
							copyFromDetail: true
						},
						{
							option: 'IsV',
							props: ['V'],
							copyFromDetail: true
						},
						{
							option: 'IsRemark',
							props: ['RemarkText'],
							copyFromDetail: true
						},
						{
							option: 'IsRemark2',
							props: ['Remark1Text'],
							copyFromDetail: true
						}
					];

					const applyFn = function(copyOptionMapping, prop){
						newItem[prop] = sourceItem ? sourceItem[prop] : (copyOptionMapping.keepOrignalValue || copyOptionMapping.keepInitValue ? newItem[prop] : null);
					}

					applyCopyOptionCore(newItem, sourceItem, copyOption, copyOptionMappings, applyFn);
				}

				function updateQtoDetailWithCopyoption(newItem, sourceItem){
					const copyOption = qtoMainDetailCopyConfigService.getCopyOptions();
					if(!copyOption || !copyOption.IsActivate) { return ; }

					newItem.ApplyCopyOption = copyOption.CopyPriority === copyPriority.FromLeadingStructure;

					updateQtoDetailLeadingStructure(newItem, sourceItem, copyOption);
					updateQtoDetailLeadingProperties(newItem, sourceItem, copyOption);
				}

				data.onCreateSucceeded = function onCreateSucceededInList(newItem, data, creationData) {
					// set the created status
					service.setIsCreatedSucceeded(true);

					// create the qto structure
					$injector.get('qtoMainStructureDataService').createQtoStructure(newItem.PageNumber, newItem.QtoHeaderFk, boqType, newItem.QtoTypeFk).then(function (sheetItem) {
						let baseItem = creationData && creationData.SelectItem ? creationData.SelectItem : service.getSelected();

						let isNewItemInOldGroup = function () {
							if (!baseItem.QtoFormula.IsMultiline || creationData.FromBoqChanged || (!creationData.IsInsert && checkOperator(baseItem))) {
								return false;
							}

							let orderedList = service.getOrderedList();
							let baseItemIdx = _.indexOf(orderedList, baseItem);
							let releatedItem = baseItemIdx < 0 ? null : creationData.IsInsert ? orderedList[baseItemIdx - 1] : orderedList[baseItemIdx + 1];
							let selectedBoqItem = service.getSelectedBoqItem();
							let isDivisionOrRoot = $injector.get('boqMainCommonService').isDivisionOrRoot(selectedBoqItem)
							let selectedBoqItemFk = isDivisionOrRoot ? -1 : getSelectedBoqItemId();
							let selectedLocationFk = getselectedPrjLocationId();

							let sameBoqItemFk = selectedBoqItemFk === -1 || selectedBoqItemFk === baseItem.BoqItemFk;
							let samePrjLocationFk = selectedLocationFk === -1 || selectedLocationFk === baseItem.PrjLocationFk;

							if (releatedItem) {
								return releatedItem.QtoDetailGroupId === baseItem.QtoDetailGroupId ||
									(!creationData.IsInsert && !checkOperator(baseItem) && sameBoqItemFk && samePrjLocationFk);
							} else {
								return creationData.IsInsert ? false : !checkOperator(baseItem) && sameBoqItemFk && samePrjLocationFk;
							}
						};

						newItem.QtoSheetFk = sheetItem ? sheetItem.Id : null;
						initSomeProperties(newItem, data);

						if (baseItem && !_.isEmpty(baseItem.QtoFormula)) {
							if (isNewItemInOldGroup()) {
								syncQtoDetailGroupProperty(newItem, baseItem, true);
							} else {
								newItem.QtoDetailGroupId = newItem.Id;
							}
						} else {
							newItem.QtoDetailGroupId = newItem.Id;
						}

						updateQtoDetailWithCopyoption(newItem, baseItem);

						fireSomeEvents(newItem, data);

						var qtoDetails = service.getList();
						if (parentService.setRubricCatagoryReadOnly) {
							parentService.getSelected().hasQtoDetal = (qtoDetails && qtoDetails.length);
							parentService.setRubricCatagoryReadOnly.fire();
						}

						var groupItem = _.filter(qtoDetails, function (detail) {
							return detail.QtoDetailGroupId === newItem.QtoDetailGroupId;
						});
						service.updateQtoLineReferenceReadOnly(groupItem);
						finishCreatingItem();
					});
				};

				function syncQtoDetailGroupProperty(targetItem, sourceItem, isCopyCostGroup) {
					let groupingPorps = ['QtoDetailGroupId', 'BoqItemCode', 'PerformedFromWip', 'PerformedToWip', 'PerformedFromBil', 'ProgressInvoiceNo',
						'PerformedToBil', 'QtoLineTypeFk', 'QtoFormulaFk', 'BoqItemFk', 'PesHeaderFk', 'IsWQ', 'IsAQ', 'IsBQ', 'IsIQ', 'IsGQ', 'IsReadonly', 'IsBlocked', 'SpecialUse', 'V',
						'WipHeaderFk', 'BilHeaderFk', 'SortCode01Fk', 'SortCode02Fk', 'SortCode03Fk', 'UserDefined1', 'UserDefined2', 'UserDefined3', 'UserDefined4', 'UserDefined5',
						'SortCode04Fk', 'SortCode05Fk', 'SortCode06Fk', 'SortCode07Fk', 'SortCode08Fk', 'SortCode09Fk', 'SortCode10Fk', 'OrdHeaderFk', 'MdcControllingUnitFk',
						'PrcStructureFk', 'AssetMasterFk', 'PrjLocationFk', 'BillToFk','QtoLineTypeCode','QtoFormula', 'EstHeaderFk', 'EstLineItemFk'];

					for (let i = 0; i < groupingPorps.length; i++) {
						targetItem[groupingPorps[i]] = sourceItem[groupingPorps[i]];
					}
					targetItem.IsSynced = true;

					if (isCopyCostGroup) {
						$timeout(function () {
							// sync cost group
							_.forOwn(sourceItem, function (value, key) {
								if (key.indexOf('costgroup_') !== -1 && sourceItem[key]) {
									let costGroupCol = {
										'field': key,
										'costGroupCatId': parseInt(key.substring(10))
									};

									targetItem[key] = sourceItem[key];
									service.costGroupService.createCostGroup2Save(targetItem, costGroupCol);
								}
							});

							service.markItemAsModified(targetItem);
						}, 100);
					}
				}

				service.syncQtoDetailGroupProperty = syncQtoDetailGroupProperty;

				function checkOperator(item) {
					// return item is end by operator = '='
					return (item.Operator1 && item.Operator1 === '=') ||
						(item.Operator2 && item.Operator2 === '=') ||
						(item.Operator3 && item.Operator3 === '=') ||
						(item.Operator4 && item.Operator4 === '=') ||
						(item.Operator5 && item.Operator5 === '=') ||
						(angular.isString(item.LineText) && item.LineText.endsWith('='));
				}

				service.dataRefreshed = new PlatformMessenger();
				service.cellStyleChanged = new PlatformMessenger();
				service.cellStyleChangedForQtoLines = new PlatformMessenger();
				service.resizeGrid = new PlatformMessenger();

				/**
				 * setting filter locations keys.
				 * @param locations
				 */
				service.setFilterLocations = function setFilterLocations(locations) {
					service.filterLocations = locations;
				};

				service.setFilterBillTos = function setFilterBillTos(billTos) {
					service.filterBillTos = billTos;
				};

				/**
				 * setting filter boqs.
				 * @param boqs
				 */
				service.setFilterBoqs = function setFilterBoqs(boqs, itemList) {
					service.filterBoqs = boqs;
					service.filterBoq = itemList && itemList.length > 0 ? itemList[0] : null;
				};

				service.setSelectBoq = function setSelectBoq(boq) {
					selectBoq = boq;
				};

				service.setFilterPageNumbers = function setFilterPageNumbers(pageNumbers) {
					service.filterPageNumbers = pageNumbers;
				};

				service.setBoqLineType = function setBoqLineType(lineTypeFk) {
					boqLineTypeFk = lineTypeFk;
				};

				service.setFilterLineItems = function setFilterLineItems(lineItems, estHeaderIds) {
					service.filterEstHeaderIds = _.uniq(estHeaderIds);
					service.filterLineItems = lineItems;
				};

				/**
				 * Change qto line type from Auxiliary value(8) to Standard(1)
				 */
				service.changeQtoLineTypeFromAuxToStd = function changeQtoLineTypeFromAuxToStd(qtoDetail) {
					if(_.isUndefined(qtoDetail.bakResult)) {
						let tempPlaces = 6;

						let qtoHeader = service.getQtoHeader;
						if (qtoHeader) {
							tempPlaces = qtoHeader.NoDecimals;
						}
						qtoDetail.Result = _.isString(qtoDetail.Result) ? parseFloat(qtoDetail.Result.replace(/[()]/g, '')) : qtoDetail.Result;
						qtoDetail.Result = qtoDetail.Result.toFixed(tempPlaces);
					}else{
						qtoDetail.Result = qtoDetail.bakResult;
					}
				}

				/**
				 * setting filter structures.
				 * @param structures
				 */
				service.setFilterStructures = function setFilterStructures(structures) {
					filterStructures = structures;
				};

				// sort order by Page Number,Line Reference,Line Index
				service.sortDetail = function (propertyArray) {
					var levelCount = propertyArray.length,
						checkLetter = /^[A-Z]{1}$/;

					return function (item1, item2) {
						var level = 0;
						var sorting = function () {
							var propertyName = propertyArray[level];
							level++;

							var itemCell1 = item1[propertyName],
								itemCell2 = item2[propertyName];

							// to check type
							if (!checkLetter.test(itemCell1)) {
								itemCell1 = parseInt(itemCell1, 10);
								itemCell2 = parseInt(itemCell2, 10);
							}

							if (itemCell1 < itemCell2) {
								return -1;
							} else if (itemCell1 > itemCell2) {
								return 1;
							} else if (itemCell1 === itemCell2) {
								if (level === levelCount) {
									return 0;
								} else {
									return sorting();
								}
							}

						};
						return sorting();
					};
				};

				service.getCode = function (item) {
					return service.getFormattedLineText(item);
				};

				service.getQtoDetailCodeMap = function (items) {
					var result = [];
					var reg = new RegExp('(\\d{0,4}[a-zA-Z]\\d)', 'g');
					var fieldArray = ['Value1Detail', 'Value2Detail', 'Value3Detail', 'Value4Detail', 'Value5Detail', 'LineText'];
					_.forEach(items, function (item) {
						var code = service.getCode(item);
						var referenceCodes = [];
						_.forEach(fieldArray, function (field) {
							if (item[field] && item[field].length >= 6) {
								var refCodes = item[field].match(reg);
								referenceCodes = referenceCodes.concat(refCodes);
							}
						});
						result.push({
							code: code,
							referenceCodes: referenceCodes,
							result: item.Result
						});
					});
					return result;
				};

				service.getFormattedLineText = function getFormattedLineText(item) {
					var placeHolder = '0000';
					var pageNumber = placeHolder.substr(0, 4 - item.PageNumber.toString().length) + item.PageNumber;
					return pageNumber + item.LineReference + item.LineIndex;
				};

				service.getSelectedProjectId = function () {
					if (parentService.getSelectedProjectId) {
						var projectId = parentService.getSelectedProjectId();
						return projectId;
					}

					var curr = parentService.getSelected();
					return parentService.isSelection(curr) && !angular.isUndefined(curr.ProjectFk) ? curr.ProjectFk : -1;
				};

				service.isFirstStep = false; // use for boqItemReferenceFk and locationReferenceFk

				/* jshint -W074 */ // this is not complex
				service.getDetailReadyOnlyList = function (fieldArray, dataSource) {
					return qtoDetailReadOnlyProcessor.getDetailReadyOnlyList(fieldArray, dataSource);
				};

				var detailArray = ['Value1Detail', 'Value2Detail', 'Value3Detail', 'Value4Detail', 'Value5Detail'];
				var modelArray = ['Value1', 'Value2', 'Value3', 'Value4', 'Value5',
					'Operator1', 'Operator2', 'Operator3', 'Operator4', 'Operator5'
				];
				var operatorArray = ['Operator1', 'Operator2', 'Operator3', 'Operator4', 'Operator5'];

				service.updateReadOnly = function (item, modelArray, value) {
					if (item.IsCopySource){
						value = true;
					}
					let qtostatusItem = item.QtoStatusItem ? item.QtoStatusItem : qtoDetailReadOnlyProcessor.getItemStatus(item);
					value = value || (qtostatusItem && qtostatusItem.IsReadOnly);

					qtoDetailReadOnlyProcessor.updateReadOnly(item, modelArray, value);
				};

				service.getResetLineAddress = getResetLineAddress;

				service.getNewLineAddress = getNewLineAddress;

				service.getQtoFormula = function getQtoFormula() {
					var item = service.getSelected();
					return item ? item.QtoFormula : null;
				};

				service.getDefaultQtoFormula = function () {
					return defaultQtoFormula;
				};

				service.setDefaultQtoFormula = function (item) {
					defaultQtoFormula = item;
				};

				service.setGridId = function (item) {
					gridId = item;
				};

				service.getGridId = function () {
					return gridId;
				};

				// if operator2 set to =, then set value3-5 and operator3-5 to readonly
				service.setValueOrOperFieldsToDisableByOperator = function (entity, operatorFiled, operatorValue) {
					if (operatorValue === null) {
						return;
					}
					var maxActiveIdx = service.maxActiveValueFieldIndex(entity),
						currrentOperIndex = parseInt(operatorFiled.replace('Operator', ''));

					for (var i = currrentOperIndex + 1; i <= maxActiveIdx; i++) {
						qtoDetailReadOnlyProcessor.updateReadOnly(entity, [operatorArray[i - 1]], operatorValue === '=');
						qtoDetailReadOnlyProcessor.updateReadOnly(entity, [detailArray[i - 1]], operatorValue === '=');

						if (operatorValue === '=') {
							$injector.get('platformRuntimeDataService').applyValidationResult({valid: true}, entity, [operatorArray[i - 1]]);
						}
					}

					if (operatorValue !== '=') {
						service.clearReadOnlyCfgForValueAndOptFile(entity);
					}
				};

				// remove readonly config properties if it is set to readonly = false
				service.clearReadOnlyCfgForValueAndOptFile = function (entity) {
					var properties = (detailArray.concat(modelArray));
					if (entity && entity.__rt$data && entity.__rt$data.readonly) {
						_.forEach(properties, function (field) {
							var idx = _.findIndex(entity.__rt$data.readonly, {'field': field, 'readonly': false});
							if (idx >= 0) {
								entity.__rt$data.readonly.splice(idx, 1);
							}
						});
					}
				};

				service.maxActiveValueFieldIndex = function (entity) {
					if (!entity || !entity.QtoFormula) {
						return 0;
					}

					var maxActiveIdx = 0;
					for (var j = 1; j <= detailArray.length; j++) {
						if (entity.QtoFormula['Value' + j + 'IsActive']) {
							maxActiveIdx = j;
						}
					}
					return maxActiveIdx;
				};

				// TODO-VICTOR: is this required?
				// parentService.refreshQtoDetail.register(service.gridRefresh);

				service.checkAddressIsUnique = function checkAddressIsUnique(postParam) {
					var defer = $q.defer();
					$http.post(globals.webApiBaseUrl + 'qto/main/detail/ismapqtoaddress', postParam).then(
						function (response) {
							defer.resolve(response.data);
						}
					);
					return defer.promise;
				};

				service.setPageNumberCell = function (cell) {
					pageNumberCell = cell;
				};

				service.getPageNumberCell = function () {
					return pageNumberCell;
				};

				service.setCurrentCell = function (cell) {
					currentCell = cell;
				};

				service.getCurrentCell = function (cell) {
					return currentCell;
				};

				service.setPageNumberCreated = function (pageNumber) {
					pageNumberCreated = pageNumber;
				};

				service.getPageNumberCreated = function () {
					return pageNumberCreated;
				};

				service.filterByFormulaUom = function (entity, formulaFk) {
					if (entity && entity.BasUomFk && entity.BasUomFk > 0) {
						var targetUomData = basicsLookupdataLookupDescriptorService.getData('QtoFormulaAllUom');
						var formulaUom = _.find(targetUomData, function (x) {
							return x.UomFk === entity.BasUomFk && x.QtoFormulaFk === (formulaFk || entity.QtoFormulaFk);
						});

						if (formulaUom) {
							entity.QtoFormula.Operator1 = formulaUom.Operator1;
							entity.QtoFormula.Operator2 = formulaUom.Operator2;
							entity.QtoFormula.Operator3 = formulaUom.Operator3;
							entity.QtoFormula.Operator4 = formulaUom.Operator4;
							entity.QtoFormula.Operator5 = formulaUom.Operator5;
							entity.QtoFormula.Value1IsActive = formulaUom.Value1IsActive;
							entity.QtoFormula.Value2IsActive = formulaUom.Value2IsActive;
							entity.QtoFormula.Value3IsActive = formulaUom.Value3IsActive;
							entity.QtoFormula.Value4IsActive = formulaUom.Value4IsActive;
							entity.QtoFormula.Value5IsActive = formulaUom.Value5IsActive;
						} else {
							filterByOriginalFormlar(entity, formulaFk || entity.QtoFormulaFk);
						}
					} else if (entity && entity.QtoFormulaFk && entity.QtoFormulaFk > 0) {
						filterByOriginalFormlar(entity, formulaFk || entity.QtoFormulaFk);
					}
				};

				function filterByOriginalFormlar(entity, formulaFk) {
					var targetData = _.find(basicsLookupdataLookupDescriptorService.getData('QtoFormula'), {Id: formulaFk});
					entity.QtoFormula = angular.copy(targetData);
				}

				service.calculateBoqQuantityByQtoLine = function (entity, newBoqItemFk) {
					var qtoBoqStructureService = $injector.get('qtoBoqStructureService');
					var boqItemList = $injector.get('basicsLookupdataLookupDescriptorService').getData('boqItemLookupDataService');
					var qtoDetailList = service.getList();
					qtoBoqStructureService.calculateQtoDetaiByBoqitem(qtoDetailList, boqItemList, entity.BoqItemFk);
					qtoBoqStructureService.calculateQtoDetaiByBoqitem(qtoDetailList, boqItemList, newBoqItemFk);
					parentService.updateBoqItemQuantity([entity.BoqItemFk], [entity]);
				};

				service.updateReadOnlyDetail = function updateReadOnlyDetail(entity, QtoFormulaUoms) {
					qtoDetailReadOnlyProcessor.updateReadOnlyDetail(entity, QtoFormulaUoms);
				};

				service.setLookupData = function setLookupData(readData) {
					basicsLookupdataLookupDescriptorService.attachData(readData || {});
					basicsLookupdataLookupDescriptorService.updateData('qtoBoqItemLookupService', readData.boqItemLookupDataService);
					basicsLookupdataLookupDescriptorService.updateData('qtoLineTypeCodeLookupService', readData.qtoLineTypeCodeLookupService);
				};

				service.showForm = function () {
					var selectedQtoDetailItem = service.getSelected();
					if (_.isEmpty(selectedQtoDetailItem) || _.isEmpty(selectedQtoDetailItem.QtoFormula) || !selectedQtoDetailItem.QtoFormula.BasFormFk) {
						return;
					}

					var basicsUserFormPassthroughDataService = $injector.get('basicsUserFormPassthroughDataService');

					getFormulaImageBlob(selectedQtoDetailItem).then(function (selectedQtoDetailItem) {
						let dataList = _.sortBy(service.getReferencedDetails(selectedQtoDetailItem), ['PageNumber', 'LineReference', 'LineIndex']);
						if (_.isArray(dataList) && dataList.length > 0) {
							_.forEach(dataList, function (qtoDetail) {
								qtoDetail.FactorDetail = calculateFactorByCulture(_.toString(qtoDetail.Factor)).factorDetail;
							});
						}

						$injector.get('cloudCommonLanguageService').getLanguageItems().then(function (allLanguage) {
							var initialData = {
								q: $q,
								http: $http,
								qtoHeader: boqType === qtoBoqType.QtoBoq ? parentService.getSelected() : $injector.get('qtoMainHeaderDataService').getCurrentHeader(),
								qtoDetail: selectedQtoDetailItem,
								imageBlob: selectedQtoDetailItem.Blob,
								qtoFormula: selectedQtoDetailItem.QtoFormula,
								webApiBaseUrl: globals.webApiBaseUrl,
								dataService: service,
								handleSave: service.syncDataFromUserForm,
								validateService: $injector.get('qtoMainDetailGridValidationService'),
								dataList: dataList,
								allLanguage: allLanguage,
								validationText: {
									maxRowSize: $translate.instant('qto.main.detail.validationText.maxRowSize'),
									minRowSize: $translate.instant('qto.main.detail.validationText.minRowSize'),
									factor: $translate.instant('qto.main.detail.validationText.factor'),
									result: $translate.instant('qto.main.detail.validationText.result'),
									displayControlGraphic: $translate.instant('qto.main.detail.validationText.displayControlGraphic'),
									controlGraphic: $translate.instant('qto.main.detail.validationText.controlGraphic'),
									formula: $translate.instant('qto.main.detail.validationText.formula')
								}
							};
							basicsUserFormPassthroughDataService.setInitialData(initialData);

							var postData = [{
								FormId: selectedQtoDetailItem.QtoFormula.BasFormFk,
								ContextId: selectedQtoDetailItem.QtoFormula.Id,
								ContextId1: 0
							}];

							$http.post(globals.webApiBaseUrl + 'basics/userform/getlistbyids?rubricFk=' + 87, postData).then(function (response) {
								if (response && response.data) {
									var item = response.data[0];
									if (item) {
										var userFormCommonService = $injector.get('basicsUserformCommonService');
										var userFormOption = {
											formId: item.Id,
											formDataId: item.CurrentFormDataId,
											contextId: selectedQtoDetailItem.QtoFormula.Id,
											context1Id: 0,
											editable: true,
											modal: true,
											rubricFk: 87,
											openMethod: userFormOpenMethod.PopupWindow
										};

										userFormCommonService.showData(userFormOption);
									} else {
										var message = $translate.instant('qto.main.detail.userFormError.haveNoQtoFormulaFormData');
										platformModalService.showMsgBox(message, $translate.instant('qto.main.detail.userForm'), 'info');
									}
								}
							});
						});
					});
				};

				service.showQtoUserFormDialog = function () {
					return showQtoUserFormDialog;
				};

				service.setQtoUserFormDialog = function (value) {
					showQtoUserFormDialog = value;
				};

				function getFormulaImageBlob(entity) {
					var defer = $q.defer();

					if (entity.QtoFormula === null || entity.QtoFormula === undefined) {
						entity.Blob = null;
						entity.BasBlobsFk = null;
						defer.resolve(entity);
					} else {
						var basBlobsFk = entity.QtoFormula.BasBlobsFk;
						var validateService = $injector.get('qtoMainDetailGridValidationService');

						entity.BasBlobsFk = basBlobsFk;
						if (basBlobsFk !== null) {
							var imageCache = _.find(validateService.qtoFormulaImageCache, {Id: basBlobsFk});
							if (imageCache === null || imageCache === undefined) {
								validateService.getBlobById(basBlobsFk).then(function (data) {
									entity.Blob = data.Content;
									defer.resolve(entity);
								});
							} else {
								entity.Blob = imageCache.Content;
								defer.resolve(entity);
							}
						} else {
							entity.Blob = null;
							defer.resolve(entity);
						}
					}

					return defer.promise;
				}

				function validateQtoLineIsInGroup(item1, item2) {
					let groupingPorps = ['QtoLineTypeFk', 'QtoFormulaFk', 'BoqItemFk',
						'PesHeaderFk', 'IsWQ', 'IsAQ', 'IsBQ', 'IsIQ', 'IsGQ',
						'IsReadonly', 'IsBlocked', 'SpecialUse', 'V', 'WipHeaderFk',
						'BilHeaderFk', 'SortCode01Fk', 'SortCode02Fk', 'SortCode03Fk', 'UserDefined1',
						'UserDefined2', 'UserDefined3', 'UserDefined4', 'UserDefined5', 'SortCode04Fk',
						'SortCode05Fk', 'SortCode06Fk', 'SortCode07Fk', 'SortCode08Fk', 'SortCode09Fk',
						'SortCode10Fk', 'OrdHeaderFk', 'MdcControllingUnitFk', 'PrcStructureFk', 'AssetMasterFk',
						'PrjLocationFk', 'BillToFk', 'BoqSplitQuantityFk', 'EstHeaderFk', 'EstLineItemFk'];
					let result = true;

					// add cost group columns
					_.forOwn(item1, function (value, key) {
						if (key.indexOf('costgroup_') !== -1) {
							groupingPorps.push(key);
						}
					});

					for (var prop in groupingPorps) {
						let itemProp1 = item1[groupingPorps[prop]] ? item1[groupingPorps[prop]] : null;
						let itemProp2 = item2[groupingPorps[prop]] ? item2[groupingPorps[prop]] : null;
						if (itemProp1 !== itemProp2) {
							result = false;
							break;
						}
					}

					return result;
				}

				service.getReferencedDetails = function (entity, itemList) {
					let result = [], dataList;

					if (!entity) {
						return result;
					}

					dataList = itemList && itemList.length ? itemList : service.getList();

					if (dataList.Count <= 0 || entity.QtoFormulaFk === null) {
						return result;
					}

					result = _.filter(dataList, function (detail) {
						return detail.QtoDetailGroupId === entity.QtoDetailGroupId;
					});

					return _.sortBy(result, ['PageNumber', 'LineReference', 'LineIndex']);
				};

				service.getReferencedDetailsWithList = function (entities, itemList) {
					let result = [], dataList;

					if (entities.length <= 0) {
						return result;
					}

					dataList = itemList && itemList.length ? itemList : service.getList();

					if (dataList.Count <= 0) {
						return result;
					}

					let groupIds = _.uniq(_.map(entities, 'QtoDetailGroupId'));

					result = _.filter(dataList, function (detail) {
						return _.indexOf(groupIds, detail.QtoDetailGroupId) !== -1;
					});

					return _.sortBy(result, ['PageNumber', 'LineReference', 'LineIndex']);
				};

				service.syncDataFromUserForm = function (entities, formData) {
					if (!entities || !formData) {
						return;
					}

					var toDeleteEntities;
					var toCreateEntities = [];

					if (formData.length < entities.length) {
						toDeleteEntities = entities.slice(formData.length, entities.length);

						if (toDeleteEntities && toDeleteEntities.length > 0) {
							var toDeleteIds = _.map(toDeleteEntities, 'Id');
							_.remove(entities, function (entity) {
								return _.includes(toDeleteIds, entity.Id);
							});

							service.deleteEntities(toDeleteEntities, true);
						}

						copyFromFormData(entities, formData);
					} else if (formData.length > entities.length) {
						var tempQtoDetail = entities[entities.length - 1];

						for (var j = 0; j < formData.length - entities.length; j++) {
							toCreateEntities.push(angular.copy(tempQtoDetail));
						}

						createMultiItems(toCreateEntities, entities, tempQtoDetail).then(function (createdEntities) {
							showCreateMultiItemsInProgress(false);
							entities = _.sortBy(entities.concat(createdEntities), ['PageNumber', 'LineReference', 'LineIndex']);
							copyFromFormData(entities, formData);
						}, function () {
							showCreateMultiItemsInProgress(false);
						});
					} else {
						copyFromFormData(entities, formData);
					}

					let referencedDetails = service.getReferencedDetails(entities[0]);
					service.updateQtoDetailGroupInfo(referencedDetails);
				};

				service.setIsFormulaChanged = function (isChanged) {
					isFormulaChanged = isChanged;
				};

				service.getIsFormulaChanged = function () {
					return isFormulaChanged;
				};

				service.getBoqSplitQuantityService = function getBoqSplitService(boqType) {
					var splitQuantityControllerService = $injector.get('boqMainSplitQuantityServiceFactory');
					var splitQuantityService;
					var moduleContext = {};
					if (boqType === qtoBoqType.QtoBoq) {
						boqService = $injector.get('qtoBoqStructureService');
						splitQuantityService = splitQuantityControllerService.getService(boqService, 'qto.main');
					} else if (boqType === qtoBoqType.PrjBoq) {
						boqService = $injector.get('boqMainService');
						splitQuantityService = splitQuantityControllerService.getService(boqService, 'boq.main');
					} else if (boqType === qtoBoqType.PrcBoq) {
						moduleContext = $injector.get('procurementContextService');
						boqService = $injector.get('prcBoqMainService').getService(moduleContext.getMainService());
						splitQuantityService = splitQuantityControllerService.getService(boqService, 'procurement.package');
					} else if (boqType === qtoBoqType.BillingBoq) {
						boqService = $injector.get('salesBillingBoqStructureService');
						splitQuantityService = splitQuantityControllerService.getService(boqService, 'sales.billing');
					} else if (boqType === qtoBoqType.PesBoq) {
						moduleContext = $injector.get('procurementContextService');
						boqService = $injector.get('prcBoqMainService').getService(moduleContext.getMainService());
						splitQuantityService = splitQuantityControllerService.getService(boqService, 'procurement.pes');
					} else if (boqType === qtoBoqType.WipBoq) {
						boqService = $injector.get('salesWipBoqStructureService');
						splitQuantityService = splitQuantityControllerService.getService(boqService, 'sales.wip');
					}

					return splitQuantityService;
				};

				service.getBoqService = function () {
					return boqService;
				};

				service.getFilterStatus = function () {
					return isFilterActive;
				};

				service.setFilterStatus = function setFilterStatus(value) {
					isFilterActive = value;
				};

				service.getFilterByNoWipOrBilStatus = function getFilterByNoWipOrBilStatus() {
					return isFilterByNoWipOrBilActive;
				};

				service.setFilterByNoWipOrBilStatus = function setFilterByNoWipOrBilStatus(value) {
					isFilterByNoWipOrBilActive = value;
				};

				service.setQtoLineSplitNoReadonly = function (selectItem, itemList) {
					if (selectItem) {
						let mapSplitItemList = _.filter(itemList, function (item) {
							return item.Version > 0 && item.BoqItemFk === selectItem.BoqItemFk && item.BoqSplitQuantityFk;
						});

						let mapItemList = _.filter(itemList, function (item) {
							return item.Version > 0 && item.BoqItemFk === selectItem.BoqItemFk;
						});

						let isReadonly = !(mapSplitItemList.length > 0 || (mapItemList.length === 0 && selectItem.Version === 0) || mapItemList.length === 1);

						let qtostatusItem = selectItem.QtoStatusItem ? selectItem.QtoStatusItem : qtoDetailReadOnlyProcessor.getItemStatus(selectItem);
						isReadonly = isReadonly || (qtostatusItem && qtostatusItem.IsReadOnly);
						platformRuntimeDataService.readonly(selectItem, [{
							field: 'BoqSplitQuantityFk',
							readonly: isReadonly
						}]);
					}
				};

				service.setQtoLineLineItemReadonly = function (selectItem, itemList) {
					if (selectItem) {

						let qtoStatusItem = selectItem.QtoStatusItem ? selectItem.QtoStatusItem : qtoDetailReadOnlyProcessor.getItemStatus(selectItem);
						let isReadonly = qtoStatusItem && qtoStatusItem.IsReadOnly;

						if (!isReadonly) {
							isReadonly = service.getLineItemReadonly(selectItem, itemList);
						}

						let itemsWithBoqItem = _.filter(itemList, function (item) {
							return item.BoqItemFk === selectItem.BoqItemFk;
						});
						_.each(itemsWithBoqItem, function (item) {
							platformRuntimeDataService.readonly(item, [{
								field: 'EstLineItemFk',
								readonly: isReadonly
							}]);
						});
					}
				};

				service.getLineItemReadonly = function (selectItem, itemList) {
					let isReadonly = false;
					if (selectItem) {
						itemList = !itemList ?  service.getList() : itemList;

						let mapEstLineItemList = _.filter(itemList, function (item) {
							return item.Version > 0 && item.BoqItemFk === selectItem.BoqItemFk && item.EstLineItemFk;
						});

						let mapItemList = _.filter(itemList, function (item) {
							return item.Version > 0 && item.BoqItemFk === selectItem.BoqItemFk;
						});

						let referencedLines = service.getTheSameGroupQto(selectItem);

						isReadonly = !(mapEstLineItemList.length > 0 || (mapItemList.length === 0 && selectItem.Version === 0) || (mapItemList.length === 1 || mapItemList.length === referencedLines.length)) || selectItem.BoqSplitQuantityFk;
					}

					return isReadonly;
				};

				function createMultiItems(toCreateEntities, toSaveEntities, selectedItem) {

					var createItemsPromise = function (toCreateEntities, toSaveEntities, selectedItem) {
						var deferred = $q.defer();

						// TODO: here will be refactor, should not get the all qto lines, will be caused performance issue.
						// showCreateMultiItemsInProgress(true);
						service.getAllQtoDetailEntities().then(function () {
							var parentHeader = parentService.getSelected();
							var selectedQtoHeader = service.getQtoHeader();

							var postParam = {
								QtoHeaderFk: selectedQtoHeader ? selectedQtoHeader.Id : -1,
								SelectedPageNumber: undefined,
								SelectItem: selectedItem,
								IsInsert: true,
								BoqHeaderFk: parentHeader.BoqHeaderFk,
								items: toCreateEntities,
								QtoSheetFk: null,
								basRubricCategoryFk: selectedQtoHeader ? selectedQtoHeader.BasRubricCategoryFk : -1,
								QtoTypeFk: selectedQtoHeader ? selectedQtoHeader.QtoTypeFk : null,
								IsNotCpoyCostGrp: undefined,
								IsFromUserForm: true,
								IsPrjBoq: (boqType === qtoBoqType.PrjBoq),
								IsPrcBoq: (boqType === qtoBoqType.PrcBoq),
								IsBillingBoq: (boqType === qtoBoqType.BillingBoq),
								IsWipBoq: (boqType === qtoBoqType.WipBoq),
								IsPesBoq: (boqType === qtoBoqType.PesBoq),
								IsQtoBoq: (boqType === qtoBoqType.QtoBoq)
							};

							if (boqType === qtoBoqType.WipBoq || boqType === qtoBoqType.BillingBoq || boqType === qtoBoqType.PesBoq) {
								postParam.BoqHeaderFk = parentService.getSelected().BoqItemPrjBoqFk;
							}

							var boqSplitQuantityService = service.getBoqSplitQuantityService(boqType);
							var splitItem = boqSplitQuantityService.getSelected();
							postParam.BoqSplitQuantityFk = splitItem ? splitItem.Id : null;

							var qtoSheets = $injector.get('qtoMainStructureDataService').getList();

							$http.post(globals.webApiBaseUrl + 'qto/main/detail/createitems', postParam).then(function (response) {
								let isOverflow = response.data.IsOverflow;
								if (isOverflow) {
									let strTitle = $translate.instant('qto.main.detail.createQtoLineTilte');
									let strContent = $translate.instant('qto.main.detail.addressOverflow');
									platformModalService.showMsgBox(strContent, strTitle, 'info');
									return;
								}

								var targetItems = [];
								var pageNumberList = [];

								let isGeneratedNo = response.data.IsGeneratedNo;
								var newItems = response.data.QtoLines;
								var csotGroups = response.data.CostGroups;
								basicsLookupdataLookupDescriptorService.updateData('QtoDetail2CostGroups', csotGroups);
								for (var i = 0; i < newItems.length; i++) {
									var sourceItem = toCreateEntities[i];
									var targetItem = newItems[i];
									// copy the dynamic qto2costgroups
									if (csotGroups && csotGroups.length > 0) {
										targetItem.CostGroupsToCopy = _.filter(csotGroups, {'MainItemId': targetItem.Id});
										targetItem.IsCopy = true;
									}
									service.doCopyQtoDetail(targetItem, sourceItem, undefined, undefined, undefined, undefined, undefined, isGeneratedNo);
									targetItem.Remark1Text = null;
									targetItem.RemarkText = null;

									var syncCostGroup = sourceItem.Version > 0 && !sourceItem.IsBoqSplitChange && !sourceItem.IsBoqItemChange;

									syncQtoDetailGroupProperty(targetItem, sourceItem, syncCostGroup);
									targetItem.IsBoqSplitChange = sourceItem.IsBoqSplitChange;
									targetItem.IsBoqItemChange = sourceItem.IsBoqItemChange;
									if (sourceItem.Version === 0) {
										targetItem.IsSynced = false;
									}
									targetItem.ignoreScriptValidation = true;
									service.allQtoDetailEntities.push(targetItem);

									if (!isGeneratedNo) {
										getNewPageNumber(targetItem, qtoSheets);
									}

									var index1 = _.findIndex(qtoSheets, {'PageNumber': targetItem.PageNumber});
									var index2 = pageNumberList.indexOf(targetItem.PageNumber);
									if (index1 === -1 && index2 === -1) {
										pageNumberList.push(targetItem.PageNumber);
									}

									if (index1 !== -1) {
										var qtoSheet = _.filter(qtoSheets, {'PageNumber': targetItem.PageNumber});
										if (qtoSheet && qtoSheet.length > 0) {
											targetItem.QtoSheetFk = qtoSheet[0].Id;
										}
									}
									targetItems.push(targetItem);
								}

								if (postParam.QtoTypeFk !== qtoType.OnormQTO) {
									generateInsertedEntitiesRef(targetItems, toSaveEntities);
								}

								if (pageNumberList.length > 0) {
									// create the qto sheets
									service.doCreateQtoSheets(selectedQtoHeader.Id, targetItems, pageNumberList, selectedQtoHeader.QtoTypeFk);
								} else {
									_.forEach(targetItems, function (item) {
										// fireSomeEvents(item, data, true);
										data.itemList.push(item);
										data.addEntityToCache(item, data);
										data.markItemAsModified(item, data);

										afterCopyDrag(item, data);
									});

									data.listLoaded.fire(null, data.itemList);
									service.updateCalculation(true);
									for (let i = 0; i < newItems.length; i++) {
										let sourceItem = toCreateEntities[i];
										if (sourceItem.Version === 0) {
											let targetItem = newItems[i];
											// sync cost group
											_.forOwn(sourceItem, function (value, key) {
												if (key.indexOf('costgroup_') !== -1 && sourceItem[key]) {
													let costGroupCol = {
														'field': key,
														'costGroupCatId': parseInt(key.substring(10))
													};

													targetItem[key] = sourceItem[key];
													service.costGroupService.createCostGroup2Save(targetItem, costGroupCol);
												}
											});

											service.markItemAsModified(targetItem);
										}
									}
									if (newItems.length >= 1) {
										service.setSelected(newItems[newItems.length - 1]);
									}
									service.setSelectedRowsAfterDrag(newItems);
								}

								deferred.resolve(targetItems);
							});
						});

						return deferred.promise;
					};

					return createItemsPromise(toCreateEntities, toSaveEntities, selectedItem);
				}

				function copyFromFormData(entities, formData) {
					if (!entities || !formData) {
						return;
					}

					for (var i = 0; i < formData.length; i++) {
						var dataitem = formData[i];
						var entity = entities[i];

						mapValueToEntity(entity, dataitem);
						entity.IsCalculate = true;
						entity.ignoreScriptValidation = false;
						var validateService = $injector.get('qtoMainDetailGridValidationService');
						validateService.validateResult(entity);
						data.markItemAsModified(entity, data);
					}

					let lastItem = _.last(entities);
					let options = {
						item: lastItem,
						cell: service.getCurrentCell(),
						forceEdit: true
					};
					service.setCellFocus(options);
				}

				function mapValueToEntity(entity, data) {
					if (!data || !entity) {
						return;
					}

					var valueColumn = ['Value1', 'Value2', 'Value3', 'Value4', 'Value5'];
					var dataColumn = ['Operator1', 'Operator2', 'Operator3', 'Operator4', 'Operator5'];

					_.forEach(valueColumn, function (columnName) {
						entity[columnName] = _.isUndefined(data[columnName]) ? null : data[columnName];
						entity[columnName + 'Detail'] = _.isString(data[columnName + 'Detail']) ? data[columnName + 'Detail'] : _.toString(entity[columnName]);
					});

					_.forEach(dataColumn, function (columnName) {
						entity[columnName] = _.isUndefined(data[columnName]) ? null : data[columnName];
					});

					entity.Factor = _.isUndefined(data.Factor) ? null : _.toNumber(calculateFactorByCulture(data.Factor).factor);
					entity.Result = _.isUndefined(data.Result) ? 0 : data.Result;

					qtoDetailReadOnlyProcessor.processItem(entity);
				}

				function calculateFactorByCulture(factor) {
					let result = {
						factor: factor,
						factorDetail: factor
					};

					let culture = $injector.get('platformContextService').culture();
					let cultureInfo = $injector.get('platformLanguageService').getLanguageInfo(culture);
					if (cultureInfo && cultureInfo.numeric) {
						let numberDecimal = cultureInfo.numeric.decimal;

						if (typeof factor === 'string') {
							if (factor.indexOf(numberDecimal) !== -1) {
								result.factor = factor.replace(numberDecimal, '.');
							}

							let inverseNumberDecimal = numberDecimal === ',' ? '.' : ',';
							if (factor.indexOf(numberDecimal) === -1 && factor.indexOf(inverseNumberDecimal) !== -1) {
								result.factorDetail = factor.replace('.', ',');
							}
						}
					}

					return result;
				}

				function generateInsertedEntitiesRef(toInsertEntities, toSaveEntities) {
					var lastSelectedEntity = toSaveEntities[toSaveEntities.length - 1];
					var firstSelectedDetail = toSaveEntities[0];
					var allEntities = _.sortBy(service.allQtoDetailEntities, ['PageNumber', 'LineReference', 'LineIndex']);

					if (_.isNull(toInsertEntities) || _.isUndefined(lastSelectedEntity) || toInsertEntities.length < 1) {
						return toInsertEntities;
					}

					var index = _.indexOf(allEntities, lastSelectedEntity);

					if (index === allEntities.length - toInsertEntities.length - 1) {
						return toInsertEntities;
					} else if (index > -1 && index < allEntities.length - toInsertEntities.length - 1) {
						var nextEntity = allEntities[index + 1],
							nextEntityLineIndex = parseInt(nextEntity.LineIndex),
							nextEntityLineReference = nextEntity.LineReference,
							nextEntityPageNumber = parseInt(nextEntity.PageNumber);

						var lastEntity = allEntities[allEntities.length - toInsertEntities.length - 1],
							lastEntityLineIndex = parseInt(lastEntity.LineIndex),
							lastEntityLineReference = lastEntity.LineReference,
							lastEntityPageNumber = parseInt(lastEntity.PageNumber);

						var firstSelectedDetailLineIndex = parseInt(firstSelectedDetail.LineIndex),
							firstSelectedDetailLineReference = firstSelectedDetail.LineReference,
							firstSelectedDetailPageNumber = parseInt(firstSelectedDetail.PageNumber);

						var lastSelectedEntityLineIndex = parseInt(lastSelectedEntity.LineIndex),
							lastSelectedEntityLineReference = lastSelectedEntity.LineReference,
							lastSelectedEntityPageNumber = parseInt(lastSelectedEntity.PageNumber);

						var distinctByLR = (nextEntityPageNumber - lastSelectedEntityPageNumber) * 26 + (nextEntityLineReference.charCodeAt() - lastSelectedEntityLineReference.charCodeAt()) - 1;
						var distinctByLI = (nextEntityPageNumber - lastSelectedEntityPageNumber) * 260 + (nextEntityLineReference.charCodeAt() - lastSelectedEntityLineReference.charCodeAt()) * 10 + (nextEntityLineIndex - lastSelectedEntityLineIndex) - 1;
						var distinctByFirstLR = (nextEntityPageNumber - firstSelectedDetailPageNumber) * 260 + (nextEntityLineReference.charCodeAt() - firstSelectedDetailLineReference.charCodeAt()) * 10 + (nextEntityLineIndex - firstSelectedDetailLineIndex) - 1;

						var renumberService = $injector.get('qtoMainRenumberDetailDataService');

						var lineIndex = null;
						var lineReference = null;
						var pageNumber = null;
						var increment = null;
						var toGenerateRefItems;

						// todo: in this case, lineIndex need to follow lastSelectedDetail?
						if (toInsertEntities.length <= distinctByLR) {
							lineIndex = lastSelectedEntityLineIndex;
							lineReference = increaseChar(lastSelectedEntityLineReference || ' ');
							pageNumber = lastSelectedEntityPageNumber;
							increment = 10;

							toGenerateRefItems = toInsertEntities;
						} else if (toInsertEntities.length <= distinctByLI) {
							let lastIndex = qtoTypeFk === 1 ? 99 : 9;
							lineIndex = lastSelectedEntityLineIndex === lastIndex ? 0 : lastSelectedEntityLineIndex + 1;
							lineReference = lastSelectedEntityLineIndex === lastIndex ? increaseChar(lastSelectedEntityLineReference || ' ') : lastSelectedEntityLineReference;
							pageNumber = lastSelectedEntityPageNumber;
							increment = 1;

							toGenerateRefItems = toInsertEntities;
						} else if (toInsertEntities.length <= distinctByFirstLR) {
							lineIndex = 0;
							lineReference = firstSelectedDetailLineReference;
							pageNumber = firstSelectedDetailPageNumber;
							increment = 1;

							toGenerateRefItems = toSaveEntities.concat(toInsertEntities);
						} else {
							lineIndex = lastEntityLineIndex;
							lineReference = increaseChar(lastEntityLineReference);
							pageNumber = lastEntityPageNumber;
							increment = 10;

							toGenerateRefItems = toSaveEntities.concat(toInsertEntities);

							var warningModalOptions = {
								headerTextKey: 'qto.main.detail.userForm',
								bodyTextKey: 'qto.main.detail.userFormError.addressAreaTooSmall',
								showOkButton: true,
								iconClass: 'ico-warning'
							};

							platformModalService.showDialog(warningModalOptions);
						}

						renumberService.renumberSelectQtoDetails(allEntities, toGenerateRefItems, pageNumber, lineReference, lineIndex, increment);
					}
				}

				service.setIsCreatedSucceeded = function (value) {
					isCreatedSucceeded = value;
				};

				service.getIsCreatedSucceeded = function () {
					return isCreatedSucceeded;
				};

				service.getCreatingPromise = function () {
					return createItemDefer ? createItemDefer.promise : null;
				};

				service.splitIsBqIqQtoLine = function () {

					let modalOptions = {
						headerTextKey: $translate.instant('qto.main.detail.gridTitle'),
						bodyTextKey: $translate.instant('qto.main.detail.splitQTOLineInfo'),
						showYesButton: true,
						showCancelButton: true,
						iconClass: 'ico-info'
					};

					platformModalService.showDialog(modalOptions).then(function (result) {
						if (result && result.yes) {
							service.getAllQtoDetailEntities().then(function () {
								let selectItems = service.getSelectedEntities();
								let toCopyItems = [];
								let checkedQtoLinesWithMutlilineFormula = [];
								toCopyItems = toCopyItems.concat(_.filter(selectItems, function (item) {
									return !item.QtoFormula || !item.QtoFormula.IsMultiline;
								}));

								let qtoLinesWithMutlilineFormula = _.filter(selectItems, function (item) {
									return item.QtoFormula && item.QtoFormula.IsMultiline;
								});

								function checkQtoLines(entities) {
									for (let i = 0; i < entities.length; i++) {
										let entity = entities[i];
										if (!entity.IsBQ || !entity.IsIQ || entity.IsReadonly) {
											return false;
										}
									}

									return true;
								}

								_.forEach(qtoLinesWithMutlilineFormula, function (qtoLine) {
									if (_.find(checkedQtoLinesWithMutlilineFormula, {Id: qtoLine.Id})) {
										return;
									}

									let referencedQtoLines = service.getReferencedDetails(qtoLine);
									checkedQtoLinesWithMutlilineFormula = checkedQtoLinesWithMutlilineFormula.concat(referencedQtoLines);

									if (checkQtoLines(referencedQtoLines)) {
										toCopyItems = toCopyItems.concat(referencedQtoLines);
									}
								});

								let copyItems = angular.copy(toCopyItems);

								if (copyItems.length > 0) {
									let copyItem = _.first(copyItems);
									let isNotCpoyCostGrp = copyItem.IsNotCpoyCostGrp;
									let selectedQtoHeaderId = copyItem.QtoHeaderFk;
									let qtoTypeFk = copyItem.QtoTypeFk;
									let copyCostGroupFromStructure = getCopyCostGroupFromStructure();

									let postParam = {
										QtoHeaderFk: selectedQtoHeaderId,
										items: copyItems,
										QtoSheetFk: null,
										basRubricCategoryFk: -1,
										IsNotCpoyCostGrp: isNotCpoyCostGrp || copyCostGroupFromStructure,
										QtoTypeFk: qtoTypeFk
									};

									let qtoSheets = $injector.get('qtoMainStructureDataService').getList();

									$http.post(globals.webApiBaseUrl + 'qto/main/detail/createitems', postParam).then(function (response) {
										let isOverflow = response.data.IsOverflow;
										if (isOverflow) {
											let strTitle = $translate.instant('qto.main.detail.createQtoLineTilte');
											let strContent = $translate.instant('qto.main.detail.addressOverflow');
											platformModalService.showMsgBox(strContent, strTitle, 'info');
											return;
										}

										let targetItems = [];
										let pageNumberList = [];
										let newItems = response.data.QtoLines;
										let csotGroups = response.data.CostGroups;
										let isGeneratedNo = response.data.IsGeneratedNo;

										basicsLookupdataLookupDescriptorService.updateData('QtoDetail2CostGroups', csotGroups);
										for (let i = 0; i < newItems.length; i++) {
											let targetItem = newItems[i];
											let sourceItem = _.find(toCopyItems, {'Id': targetItem.SourceQtoDetailId});
											targetItem.IsCopy = true;
											targetItem.IsCalculate = true;
											// copy the dynamic qto2costgroups
											if (csotGroups && csotGroups.length > 0) {
												targetItem.CostGroupsToCopy = _.filter(csotGroups, {'MainItemId': targetItem.Id});
												// targetItem.IsCopy = true;
											}
											service.doCopyQtoDetail(targetItem, sourceItem, undefined, undefined, undefined, undefined, undefined, isGeneratedNo);
											targetItem.ignoreScriptValidation = true;
											service.allQtoDetailEntities.push(targetItem);

											var updateItemReadOnlyStatus = function (item, IQReadonly, BQReadonly) {
												item.SplitItemIQReadOnly = IQReadonly;
												item.SplitItemBQReadOnly = BQReadonly;
											};

											// clear and reassign bill and wip
											if (boqType === qtoBoqType.WipBoq || (boqType !== qtoBoqType.WipBoq && sourceItem.WipHeaderFk !== null && sourceItem.BilHeaderFk === null)) {
												targetItem.IsBQ = false;
												targetItem.BilHeaderFk = null;
												targetItem.WipHeaderFk = sourceItem.WipHeaderFk;
												updateItemReadOnlyStatus(targetItem, false, true);

												sourceItem.IsIQ = false;
												sourceItem.WipHeaderFk = null;
												updateItemReadOnlyStatus(sourceItem, true, false);
											} else {
												targetItem.IsIQ = false;
												targetItem.WipHeaderFk = null;
												targetItem.IsBQ = sourceItem.IsBQ;
												targetItem.BilHeaderFk = sourceItem.BilHeaderFk;
												updateItemReadOnlyStatus(targetItem, true, false);

												sourceItem.IsBQ = false;
												sourceItem.BilHeaderFk = null;
												updateItemReadOnlyStatus(sourceItem, false, true);
											}

											targetItem.QtoDetailSplitFromReference = sourceItem.QtoDetailReference;
											targetItem.QtoDetailSplitFromFk = sourceItem.Id;
											sourceItem.IsSplitted = true;

											// copy fks from sourceItem to targetItem
											targetItem.OrdHeaderFk = sourceItem.OrdHeaderFk;
											targetItem.BillToFk = sourceItem.BillToFk;
											targetItem.IsReadonly = sourceItem.IsReadonly;

											data.markItemAsModified(sourceItem, data);

											if (!isGeneratedNo) {
												getNewPageNumber(targetItem, qtoSheets);
											}

											let index1 = _.findIndex(qtoSheets, {'PageNumber': targetItem.PageNumber});
											let index2 = pageNumberList.indexOf(targetItem.PageNumber);
											if (index1 === -1 && index2 === -1) {
												pageNumberList.push(targetItem.PageNumber);
											}

											if (index1 !== -1) {
												let qtoSheet = _.filter(qtoSheets, {'PageNumber': targetItem.PageNumber});
												if (qtoSheet && qtoSheet.length > 0) {
													targetItem.QtoSheetFk = qtoSheet[0].Id;
												}
											}
											targetItems.push(targetItem);
										}

										function handleSplitDone(splittedItems) {
											_.forEach(splittedItems, function (item) {
												data.itemList.push(item);
												data.addEntityToCache(item, data);
												data.markItemAsModified(item, data);
												afterCopyDrag(item, data);

												if (boqType === qtoBoqType.WipBoq) {
													qtoDetailReadOnlyProcessor.updateReadOnly(item, ['IsBQ', 'BilHeaderFk'], item.SplitItemBQReadOnly);
												} else {
													qtoDetailReadOnlyProcessor.updateReadOnly(item, ['IsIQ', 'WipHeaderFk'], item.SplitItemIQReadOnly);

													if (boqType !== qtoBoqType.BillingBoq) {
														let sourceItem = _.find(toCopyItems, {'Id': item.SourceQtoDetailId});
														qtoDetailReadOnlyProcessor.updateReadOnly(sourceItem, ['IsBQ', 'BilHeaderFk'], item.SplitItemBQReadOnly);
													}
												}
											});
											service.updateCalculation(true);

											if (boqType === qtoBoqType.BillingBoq || boqType === qtoBoqType.WipBoq) {
												let toCopyItemIds = _.uniqBy(_.map(toCopyItems, 'Id'));
												_.remove(data.itemList, function (item) {
													return _.includes(toCopyItemIds, item.Id);
												});
											}

											data.listLoaded.fire(null, data.itemList);
											service.setSelectedRowsAfterDrag(toCopyItems);
										}

										if (pageNumberList.length > 0) {
											var creationData = {
												MainItemId: selectedQtoHeaderId,
												Numbers: pageNumberList,
												QtoType: qtoTypeFk
											};

											$http.post(globals.webApiBaseUrl + 'qto/main/structure/createbyqtolines', creationData).then(function (response) {
												var qtoSheetItems = response.data;
												$injector.get('qtoMainStructureDataService').loadQtoSheetData(qtoSheetItems);
												var qtoSheetList = [];
												$injector.get('cloudCommonGridService').flatten(qtoSheetItems, qtoSheetList, 'QtoSheets');

												_.forEach(targetItems, function (item) {
													var index = _.findIndex(qtoSheetList, {'PageNumber': item.PageNumber});
													if (index !== -1) {
														item.QtoSheetFk = qtoSheetList[index].Id;
													}
												});

												handleSplitDone(targetItems);
											});
										} else {
											handleSplitDone(targetItems);
										}
									});

								}
							});
						}
					});

				};

				service.getOrderedList = function (itemList) {
					let dataList = itemList && itemList.length ? itemList : service.getList();

					return _.sortBy(dataList, ['PageNumber', 'LineReference', 'LineIndex']);
				};

				service.getQtoLineGroups = function (itemList) {
					let dataList = itemList && itemList.length ? itemList : service.getList();

					return _.groupBy(dataList, 'QtoDetailGroupId');
				};

				function getLineAddressNum(item) {
					var pageNumber = item.PageNumber;
					var lineIndex = item.LineIndex;
					var lineReference = item.LineReference;

					let qtoHeader = service.getQtoHeader();
					if (qtoHeader.QtoTypeFk === qtoType.OnormQTO){
						return parseInt(item.QtoDetailReference);
					} else {
						lineReference = lineReference.toUpperCase();
						var ascii = lineReference.charCodeAt();

						if (ascii < 65 || ascii > 90 || isNaN(ascii)) {
							ascii = 65;
						}

						return pageNumber * 1000 + ascii * 10 + lineIndex;
					}
				}

				service.getUsedAddressScope = function (itemList) {
					let addressScrope = [];
					let groups = service.getQtoLineGroups(itemList);

					_.forEach(groups, function (group) {
						if (group && group.length > 0) {
							addressScrope.push({
								minId: group[0].Id,
								maxId: group[group.length - 1].Id,
								min: getLineAddressNum(group[0]),
								max: getLineAddressNum(group[group.length - 1])
							});
						}
					});

					return addressScrope;
				};

				service.isUsedInOtherGroup = function (newQtoLines) {
					let isValid, inValidLine = '', currentListAddressScope = service.getUsedAddressScope();

					if (_.isArray(newQtoLines) && newQtoLines.length > 0) {
						_.forEach(newQtoLines, function (qtoLine) {
							var lineAddressNum = getLineAddressNum(qtoLine);

							var group = _.find(currentListAddressScope, function (scope) {
								return scope.min <= lineAddressNum && lineAddressNum <= scope.max && qtoLine.Id !== scope.minId && qtoLine.Id !== scope.maxId;
							});

							if (group) {
								isValid = false;
								inValidLine += ('[' + qtoLine.QtoDetailReference + ']');
							}
						});
					}

					return {
						isValid: isValid,
						inValidLine: inValidLine && inValidLine !== '' ? inValidLine : null
					};
				};

				service.updateQtoLineReferenceReadOnly = function (itemList) {
					let groups = service.getQtoLineGroups(itemList);

					_.forEach(groups, function (group) {
						if (!group || !_.isArray(group) || group.length <= 0) {
							return;
						}

						// Sheet/Line/Index should be set readonly when quantity of qtodetail is more than 1
						let readOnly = group.length > 1;

						_.forEach(group, function (item) {
							qtoDetailReadOnlyProcessor.updateLineReferenceReadOnly(item, readOnly);
							item.IsLineReferenceReadOnly = readOnly;
						});

					});
				};

				service.getSelectedGroupEntities = function () {
					let selectedGroupEntities = [];

					let selectedItems = service.getSelectedEntities();
					let groupIds = _.map(selectedItems, 'QtoDetailGroupId');
					let itemList = service.getList();

					if (!itemList || itemList.length < 1 || !groupIds || groupIds.length < 1) {
						return selectedGroupEntities;
					}

					selectedGroupEntities = _.filter(itemList, function (item) {
						return _.includes(groupIds, item.QtoDetailGroupId);
					});

					return selectedGroupEntities;
				};

				service.updateQtoDetailGroupInfo = function (qtoLines) {
					let orderedQtoLines = service.getOrderedList(qtoLines);

					let currentQtoDetail = null;

					_.forEach(orderedQtoLines, function (qtoLine) {
						if (qtoLine.QtoFormula && qtoLine.QtoFormula.IsMultiline) {
							if (currentQtoDetail === null) {
								currentQtoDetail = qtoLine;
							}

							if (validateQtoLineIsInGroup(qtoLine, currentQtoDetail)) {
								qtoLine.QtoDetailGroupId = currentQtoDetail.Id;
								if (checkOperator(qtoLine)) {
									currentQtoDetail = null;
								}
							} else {
								qtoLine.QtoDetailGroupId = qtoLine.Id;
								currentQtoDetail = qtoLine;
							}
						} else {
							currentQtoDetail = null;
							qtoLine.QtoDetailGroupId = qtoLine.Id;
						}
					});

					return orderedQtoLines;
				};

				service.isEndWithEqualSymbol = function (qtoLine) {
					return checkOperator(qtoLine);
				};

				service.showFormulaResultDetails = function showFormulaResultDetails(qtoDetail) {
					var formulaResult = qtoDetail && qtoDetail.FormulaResultUI ? qtoDetail.FormulaResultUI : '';

					var modalOptions = {
						headerTextKey: 'qto.main.detail.qtoFormula',
						templateUrl: globals.appBaseUrl + moduleName + '/templates/qto-detail-formula-result-details.html',
						iconClass: 'ico-info',
						width: '1000px',
						formulaResult: formulaResult,
						resizeable: true
					};

					platformModalService.showDialog(modalOptions);
				};

				service.getQtoTypeFk = function () {
					return qtoTypeFk;
				};

				service.setQtoTypeFk = function (value) {
					qtoTypeFk = value;
				};

				service.getSheetAreaList = function () {
					return sheetAreaList;
				};

				service.setSheetAreaList = function (qtoAddressRange) {
					sheetAreaList = [];
					if (qtoAddressRange && qtoAddressRange.SheetArea) {
						let areaArray = qtoAddressRange.SheetArea.split(',');
						_.forEach(areaArray, function (item) {
							if (item.indexOf('-') >= 0) {
								let _sheetAreaArray = item.trim().split('-');
								if (_sheetAreaArray && _sheetAreaArray.length === 2) {
									let fromValue = parseInt(_sheetAreaArray[0]);
									let toValue = parseInt(_sheetAreaArray[1]);
									let numberList = _.range(fromValue, toValue + 1);

									if (fromValue >= toValue) {
										numberList = _.range(fromValue, toValue - 1);
									}
									sheetAreaList = sheetAreaList.concat(numberList);
								}
							} else {
								sheetAreaList.push(parseInt(item));
							}
						});
					}
					sheetAreaList = _.orderBy(sheetAreaList);
					return sheetAreaList;
				};

				service.setChangedBoqIds = function (boqId) {
					changedBoqIds.push(boqId);
				};

				service.getChangedBoqIds = function () {
					return _.uniq(changedBoqIds);
				};

				service.cleanChangedBoqIds = function () {
					changedBoqIds = [];
				};

				service.doCopySourceQtoLines = function (qtoLines) {
					let qtoHeader = service.getQtoHeader();

					// can't create qto Line
					if (!qtoHeader || (qtoHeader && qtoHeader.Id <= 0)) {
						platformModalService.showMsgBox($translate.instant('qto.main.notCreateQtoLines'), 'qto.main.sourceQto', 'info');
						return;
					}

					if (qtoHeader.PrjChangeStutasReadonly) {
						platformModalService.showMsgBox($translate.instant('qto.main.prjChangeStatusReadOnlyInfo'), 'qto.main.sourceQto', 'info');
						return;
					}

					if (!canCreateOrDeleteCallBackFunc(true)) {
						platformModalService.showMsgBox($translate.instant('qto.main.notCreateQtoLines'), 'qto.main.sourceQto', 'info');
						return;
					}

					let loadBoqPromise = boqType === qtoBoqType.QtoBoq ? parentService.update() : $q.when(true);

					loadBoqPromise.then(function () {
						let currentQtoHeader = boqType === qtoBoqType.QtoBoq ? parentService.getSelected() : qtoHeader;
						let sourceQtoHeader = $injector.get('qtoMainDetailLookupFilterService').selectedQtoHeader;
						if (currentQtoHeader.BasRubricCategoryFk !== sourceQtoHeader.BasRubricCategoryFk) {
							platformModalService.showMsgBox($translate.instant('qto.main.differentRubric'), 'qto.main.sourceQto', 'info');
							return;
						}

						let isOneProject = currentQtoHeader.ProjectFk === sourceQtoHeader.ProjectFk;

						let qtoBoqItem = null;
						if (boqType === qtoBoqType.QtoBoq) {
							qtoBoqItem = $injector.get('qtoBoqStructureService').getSelected();
						} else {
							qtoBoqItem = parentService.getSelected();

							// if wip boq, bill boq and pes boq should be validated.
							if (boqType === qtoBoqType.WipBoq || boqType === qtoBoqType.BillingBoq || boqType === qtoBoqType.PesBoq) {
								if (!qtoBoqItem.BoqItemPrjBoqFk || !qtoBoqItem.BoqItemPrjItemFk) {
									platformModalService.showMsgBox($translate.instant('qto.main.noLinkBaseBoqItem'), 'qto.main.sourceQto', 'info');
									return;
								}
							}
						}

						let groupKey = 'qto.main.sourceLinesCopy';
						let appId = '1840b2391ae9454cad1a053b773f84d5';
						$http.get(globals.webApiBaseUrl + 'procurement/common/option/getprofile?groupKey=' + groupKey + '&appId=' + appId).then(function (response) {
							let profile = null;
							if (response.data && response.data.length > 0) {
								let config = _.find(response.data, {'ProfileAccessLevel': 'User'});
								if (config) {
									profile = JSON.parse(config.PropertyConfig);
								}
							}

							var boqSplitQtyServiceFactory = $injector.get('boqMainSplitQuantityServiceFactory');
							var boqSplitQtyService = null;
							var boqItemService = null;

							let getModuleName = function () {
								let moduleName = '';
								switch (boqType) {
									case qtoBoqType.QtoBoq:
										moduleName = 'qto.main';
										break;
									case qtoBoqType.PrcBoq:
										moduleName = 'procurement.package';
										boqItemService = $injector.get('prcBoqMainService').getService($injector.get('procurementContextService').getMainService());
										boqSplitQtyService = boqSplitQtyServiceFactory.getService(boqItemService, moduleName);
										break;
									case qtoBoqType.PrjBoq:
										moduleName = 'boq.main';
										boqItemService = $injector.get('boqMainService');
										boqSplitQtyService = boqSplitQtyServiceFactory.getService(boqItemService, moduleName);
										break;
									case qtoBoqType.WipBoq:
										moduleName = 'sales.wip';
										boqItemService = $injector.get('salesWipBoqStructureService');
										boqSplitQtyService = boqSplitQtyServiceFactory.getService(boqItemService, moduleName);
										break;
									case qtoBoqType.PesBoq:
										moduleName = 'procurement.pes';
										boqItemService = $injector.get('prcBoqMainService').getService($injector.get('procurementContextService').getMainService());
										boqSplitQtyService = boqSplitQtyServiceFactory.getService(boqItemService, moduleName);
										break;
									case qtoBoqType.BillingBoq:
										moduleName = 'sales.billing';
										boqItemService = $injector.get('salesBillingBoqStructureService');
										boqSplitQtyService = boqSplitQtyServiceFactory.getService(boqItemService, moduleName);
										break;
								}

								return moduleName;
							};

							var moduleName = getModuleName();

							var wipHeaderFk, bilHeaderFk, pesHeaderFk = null;
							var itemService = null;

							switch (boqType) {
								case qtoBoqType.PrcBoq:
									itemService = $injector.get('procurementPackageDataService');
									break;
								case qtoBoqType.PrjBoq:
									itemService = $injector.get('boqMainService');
									break;
								case qtoBoqType.WipBoq:
									itemService = $injector.get('salesWipService');
									wipHeaderFk = itemService.getSelected() ? itemService.getSelected().Id : null;
									break;
								case qtoBoqType.BillingBoq:
									itemService = $injector.get('salesBillingService');
									bilHeaderFk = itemService.getSelected() ? itemService.getSelected().Id : null;
									break;
								case qtoBoqType.PesBoq:
									itemService = $injector.get('procurementPesHeaderService');
									pesHeaderFk = itemService.getSelected() ? itemService.getSelected().Id : null;
									break;
							}

							// collect muitilines
							let itemList = $injector.get('qtoMainLineLookupService').getList();
							let items = service.getReferencedDetailsWithList(qtoLines, itemList);

							let copyParam = {
								ModuleName: moduleName,
								WipHeaderFk: wipHeaderFk,
								BilHeaderFk: bilHeaderFk,
								PesHeaderFk: pesHeaderFk,
								IsLocation: !profile || (profile && profile.IsLocation),
								IsAssetMaster: !profile || (profile && profile.IsAssetMaster),
								IsControllingUnit: !profile || (profile && profile.IsControllingUnit),
								IsSortCode: !profile || (profile && profile.IsSortCode),
								IsCostGroup: !profile || (profile && profile.IsCostGroup),
								IsPrc: !profile || (profile && profile.IsPrc),
								IsBillTo: !profile || (profile && profile.IsBillTo),
								IsContract: !profile || (profile && profile.IsContract),
								IsOneProject: isOneProject,
								SourceQtoHeaderFk: sourceQtoHeader.Id,
								TagetQtoHeaderFk: currentQtoHeader.Id,
								BoqItem: qtoBoqItem,
								QtoLineIds: _.map(items, 'Id'),
								CopyOption: qtoMainDetailCopyConfigService.getCopyOptions()
							};

							$http.post(globals.webApiBaseUrl + 'qto/main/detail/docopysourceqtolines', copyParam).then(function (response) {
								let isOverflow = response.data.IsOverflow;
								if (isOverflow) {
									let strTitle = $translate.instant('qto.main.detail.createQtoLineTilte');
									let strContent = $translate.instant('qto.main.detail.addressOverflow');
									platformModalService.showMsgBox(strContent, strTitle, 'info');
									return;
								}

								let items = response.data.QtoLines;
								let qtoDetialsOfAffectedBoq = response.data.QtoDetialsOfAffectedBoq;
								let costGroups = response.data.CostGroups;
								let boqItem = response.data.BoqItem;
								let boqSplitQtyItems = response.data.BoqSplitQtyItems;
								let isNewSheet = response.data.IsNewSheet;
								_.forEach(items, function (item) {
									let findItem = _.find(data.itemList, {'Id': item.Id});
									if (!findItem) {
										data.itemList.push(item);
										platformDataServiceDataProcessorExtension.doProcessItem(item, data);
									}
								});

								// reload the cost group of qto line
								if (costGroups && costGroups.length > 0) {
									service.setSelectedEntities(items);
									assignCostGroups(items, costGroups);
									basicsLookupdataLookupDescriptorService.updateData('QtoDetail2CostGroups', costGroups);
									$injector.get('qtoDetailCostGroupService').load();
								}

								data.listLoaded.fire(null, data.itemList);

								if (boqType === qtoBoqType.QtoBoq) {
									// new sheet: reload sheet data
									if (isNewSheet){
										$injector.get('qtoMainStructureDataService').load();
									}

									// recalculate boq quantity
									let arg = {};
									arg.boqItemFks = null;
									arg.QtoDetailDatas = items;
									arg.qtoDetialsOfAffectedBoq = qtoDetialsOfAffectedBoq;

									parentService.fireRecalculateBoqQuantities(arg);
									let modTrackServ = $injector.get('platformDataServiceModificationTrackingExtension');
									modTrackServ.clearModificationsInRoot(parentService);
								} else {
									if (boqItem) {
										let updateBoqItem = boqItemService.getSelected();
										_.merge(updateBoqItem, boqItem);
										parentService.markItemAsModified(updateBoqItem);
									}

									if (boqSplitQtyItems && boqSplitQtyItems.length > 0) {
										boqSplitQtyService.markEntitiesAsModified(boqSplitQtyItems);
									}

									itemService.update();
								}
							});
						});
					});
				};

				function assignCostGroups(items, costGroups) {
					_.each(items, function (item) {
						let mapCostGroups = _.filter(costGroups, {'MainItemId': item.Id});
						if (mapCostGroups && mapCostGroups.length > 0) {
							_.each(mapCostGroups, function (mapCostGroup) {
								item['costgroup_' + mapCostGroup.CostGroupCatFk.toString()] = mapCostGroup.CostGroupFk;
							});
						}
					});
				}

				// TODO: first step the lineitem will be only assigned to qto line with boq.
				// TODO: will be removed, next step, can be assigned to boq split
				function clearEstLineItemAssignment(item) {
					item.EstLineItemFk = null;
					item.EstHeaderFk = null;
				}

				return serviceContainer;
			};

			return factoryService;
		}]);
})(angular);