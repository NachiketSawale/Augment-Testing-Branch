(function (angular) {
	'use strict';
	/* global globals,_, math */
	var moduleName = 'procurement.common';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('procurementCommonPrcItemDataService', [
		'$http',
		'$q',
		'$injector',
		'procurementCommonDataServiceFactory',
		'basicsLookupdataLookupDescriptorService',
		'basicsCommonCurrencyHttpService',
		'platformObjectHelper',
		'procurementContextService',
		'PlatformMessenger',
		'platformModuleStateService',
		'procurementCommonDataImageProcessor',
		'ServiceDataProcessArraysExtension',
		'procurementCommonOverviewDataService',
		'procurementCommonDataEnhanceProcessor',
		'procurementCommonPrcItemReadonlyProcessor',
		'ServiceDataProcessDatesExtension',
		'platformRuntimeDataService',
		'procurementCommonPriceConditionService',
		'basicsLookupdataLookupDescriptorService',
		'prcCommonCalculationHelper',
		'platformDataServiceDataPresentExtension',
		'procurementCommonPrcItemValidationService',
		'platformDataServiceActionExtension',
		'platformDataServiceSelectionExtension',
		'prcCommonGetVatPercent',
		'prcCommonItemCalculationHelperService',
		'procurementCommonTotalDataService',
		'platformContextService',
		'procurementModuleName',
		'prcGetIsCalculateOverGrossService',
		'basicCustomizeSystemoptionLookupDataService',
		function (
			$http,
			$q,
			$injector,
			procurementCommonDataServiceFactory,
			basicsLookupdataLookupDescriptorService,
			currencyHttpService,
			platformObjectHelper,
			moduleContext,
			PlatformMessenger,
			platformModuleStateService,
			procurementCommonDataImageProcessor,
			ServiceDataProcessArraysExtension,
			procurementCommonOverviewDataService,
			procurementCommonDataEnhanceProcessor,
			readonlyProcessor,
			ServiceDataProcessDatesExtension,
			platformRuntimeDataService,
			priceConditionDataService,
			lookupDescriptorService,
			prcCommonCalculationHelper,
			platformDataServiceDataPresentExtension,
			procurementCommonPrcItemValidationService,
			platformDataServiceActionExtension,
			platformDataServiceSelectionExtension,
			prcCommonGetVatPercent,
			itemCalculationHelper,
			procurementCommonTotalDataService,
			platformContextService,
			prcModuleName,
			prcGetIsCalculateOverGrossService,
			basicCustomizeSystemoptionLookupDataService
		) {

			// create a new data service object
			function constructor(parentService, isTree) {// jshint ignore: line
				var isEnhanceProcessor = isTree; // workaround for defect 96058, tree item container maintained independent readonly processor
				isTree = false;// defect 96058, change the item container as flat list container
				var quoteRequistion = 'procurement.quote.requisition';
				var priceComparisonQuoteRequisition = 'procurement.pricecomparison.quote.requisition';
				var quote = prcModuleName.quoteModule;
				var priceComparisonQuote = 'procurement.pricecomparison.quote';
				var contractModule = prcModuleName.contractModule;
				var packageModule = prcModuleName.packageModule;
				var reqModule = prcModuleName.requisitionModule;
				let roundingType = itemCalculationHelper.roundingType;
				var data;
				var parentServiceName;
				var service = null;
				// service configuration
				var serviceContainer = null,
					readonlyLevel2 = ['prcitemstatusfk', 'prcpackagefk', 'priceextra', 'priceextraoc', 'totalprice', 'totalpriceoc',
						'targetprice', 'targettotal', 'total', 'totaloc', 'totalgross', 'totalgrossoc', 'totalnodiscount', 'totalcurrencynodiscount', 'daterequired', 'hasdeliveryschedule', 'hastext',
						'quantityaskedfor', 'quantitydelivered', 'basuomfk', 'basuompriceunitFk', 'safetyleadtime'],
					editableLevel1 = ['discount', 'discountabsolute', 'discountcomment', 'price', 'priceoc', 'prcpriceconditionfk', 'priceunit', 'factorpriceunit', 'basuompriceunitfk', 'prcitemevaluationfk',
						'userdefined1', 'userdefined2', 'userdefined3', 'userdefined4', 'userdefined5', 'commentcontractor', 'commentclient'],
					extendOptions = {
						date: ['Onhire', 'DateRequired', 'Offhire'],
						readonly: ['DateRequired', 'PrcStructureFk'],
						overview: {
							key: moduleContext.overview.keys.item
						}
					},
					serviceOptions = {},
					defaultOptions = {
						module: angular.module(moduleName),
						entityRole: {
							node: {
								itemName: 'PrcItem',
								parentService: parentService,
								doesRequireLoadAlways: true
							}
						},
						actions: {
							delete: true,
							canCreateCallBackFunc: function (/* item */) {
								var parentItem = parentService.getSelected();
								return !moduleContext.isReadOnly && !!parentItem && !!parentItem.Id;
							},
							canDeleteCallBackFunc: function (/* item */) {
								if (parentServiceName && parentServiceName === contractModule) {
									var parentItem = parentService.getSelected();
									if (parentItem && parentItem.ConStatus) {
										return !parentItem.ConStatus.IsReadonly;
									}
								} else if (parentServiceName && parentServiceName === quote) {
									return !moduleContext.isReadOnly;
								}

								return true;
							}
						},
						httpCRUD: {
							route: globals.webApiBaseUrl + 'procurement/common/prcitem/'
						},
						dataProcessor: [new ServiceDataProcessDatesExtension(['DeliverDateConfirm']),
							{processItem: addAdditionalProperties}],
						presenter: {isInitialSorted: true},
						serviceName: _.isFunction(parentService.getItemServiceName) ? parentService.getItemServiceName() : 'procurementCommonPrcItemDataService',
						filterByViewer: true
					};
				var qtnService;
				var qtnStatus;
				var StockCache = {};
				var prcTotalService = procurementCommonTotalDataService.getService(parentService);
				var currentModuleName = parentService.getModule().name;
				var reqPrcItems = [];

				const materialUomCache ={};

				var incorporateDataRead = function incorporateDataRead(readData, data) {
					StockCache._Prcstock = readData._Prcstock;
					StockCache._Prcstructure = readData._Prcstructure;

					cacheMaterialUomsFromData(readData);
					var mainService = moduleContext.getMainService();
					var moduleName = mainService.name;
					const isConsolidateChange = _.isFunction(parentService.isConsolidateChange) ? parentService.isConsolidateChange() : false;

					if (moduleName === quoteRequistion || moduleName === quote || moduleName === priceComparisonQuoteRequisition || moduleName === priceComparisonQuote) {
						qtnService = moduleContext.getLeadingService();
						qtnStatus = (qtnService.getSelected() || {}).QuoteStatus;
						if (!qtnStatus) {
							qtnStatus = getParentSelectedQuoteStatus(qtnService);
						}
						if (!qtnStatus || qtnStatus.IsReadonly === true || moduleContext.isReadOnly) {
							disableCreate(true);
							disableCreateChild(true);
							disableDelete(true);
						} else {
							disableCreate(false);
							disableCreateChild(false);
							disableDelete(false);
						}

						if (angular.isFunction(parentService.calculateTLeadTime)) {
							_.forEach(readData.Main, function (item) {
								item.TotalLeadTime = parentService.calculateTLeadTime(item, item.LeadTime);
							});
						}
					}
					basicsLookupdataLookupDescriptorService.attachData(readData || {});
					var items = data.usesCache && angular.isArray(readData) ? readData : readData.Main;
					var dataRead = data.handleReadSucceeded(items, data, true);
					// get leading item
					var headerItem = parentService.getSelected();
					if (!headerItem || !headerItem.Id) {
						return;
					}

					service.updateCurrencyInfo(headerItem.CurrencyFk ? headerItem.CurrencyFk : headerItem.BasCurrencyFk);
					// update readonly and calculate total.
					angular.forEach(items, function (item) {
						// TODO: ALM #63501 don't contain html tag
						if (_.isString(item.Specification)) {
							item.Specification = item.Specification.replace(/<[^>]+>/g, '').replace(/(&nbsp;)/g, '');
						}
						if (item.MdcMaterialFk) {
							platformRuntimeDataService.readonly(item, [{ field: 'BasUomFk', readonly: true }]);
						}

						if (item.MdcMaterialFk && !item.Material2Uoms) {
							platformRuntimeDataService.readonly(item, [{ field: 'AlternativeUomFk', readonly: true }]);
						}

						if (headerItem.MaterialCatalogFk) {
							service.setColumnsReadOnly(item, true);
						}
						if (item.BasItemTypeFk === 7) {
							let columns = Object.keys(item);
							_.forEach(columns, (culumn) => {
								if (culumn === 'Itemno' || culumn === 'Description1' || culumn === 'Description2' || culumn === 'Specification' || culumn === 'Userdefined1'
									|| culumn === 'Userdefined2' || culumn === 'Userdefined3' || culumn === 'Userdefined4' || culumn === 'Userdefined5') {
									platformRuntimeDataService.readonly(item, [{ field: culumn, readonly: false }]);
								} else {
									platformRuntimeDataService.readonly(item, [{ field: culumn, readonly: true }]);
								}
							});
						}

						if (moduleName === quoteRequistion) {
							platformRuntimeDataService.readonly(item, [{ field: 'PrjChangeFk', readonly: true }]);
						}

						const quantityContracted = (isConsolidateChange && moduleName === contractModule) ? item.ContractGrandQuantity : item.Quantity;
						item.QuantityRemaining = calculateQuantityRemaining(quantityContracted, item.QuantityDelivered);
					});

					initPrjStockReadOnly(data.itemList);
					// for ALM(#92196),if user overwrites line no to a line no alredy used in the basis contract or a previous change order
					// then MDC_MATERIAL_FK, PRC_STRUCTURE_FK, DESCRIPTION1, DESCRIPTION2, BAS_UOM_FK must be taken from the previous line and set to read only10
					if (moduleName === contractModule) {
						readOnlyContractItem(parentService, items);
					}

					$injector.invoke(['basicsCostGroupAssignmentService', function (basicsCostGroupAssignmentService) {
						basicsCostGroupAssignmentService.process(readData, service, {
							mainDataName: 'Main',
							attachDataName: 'PrcItem2CostGroups', // name of MainItem2CostGroup
							dataLookupType: 'PrcItem2CostGroups',// name of MainItem2CostGroup
							identityGetter: function identityGetter(entity) {
								return {
									Id: entity.MainItemId64
								};
							},
							isReadonly: moduleContext.isReadOnly
						});
						service.dynamicColumns = basicsCostGroupAssignmentService.getCostGroupColumnsForDetail(readData.CostGroupCats, service);
					}]);

					if (moduleName === quoteRequistion) {
						setRequisitionItems(readData.RequisitionPrcItemsItems);
					}

					return dataRead;
				};

				var initCreationData = function initCreationData(creationData, data, isMainItem, dontChangeToolBarItem) {
					creationData.IsContract = false;
					var createToolItem = _.find(service.toolItems, {id: 'create'});
					if (!!creationData && !!createToolItem && !dontChangeToolBarItem) {
						createToolItem.disabled = true;
						if (service.updateToolsEvent) {
							service.updateToolsEvent.fire();
						}
					}
					var parentServiceName = parentService.name;
					if (parentServiceName && parentServiceName === packageModule) {
						creationData.PrcPackageFk = parentService.getSelected().PackageFk;
						creationData.IsPackage = true;
						creationData.FrmStyle = 3;// from  Package
						creationData.FrmHeaderFk = creationData.PrcPackageFk;// from  Package
					} else {
						creationData.PrcPackageFk = null;
						creationData.IsPackage = false;
					}
					creationData.parentId = isTree && !isMainItem ? serviceContainer.service.getIfSelectedIdElse(null) : null;
					if (creationData.parentId === null && (parentServiceName === quoteRequistion || parentServiceName === priceComparisonQuoteRequisition)) {
						creationData.InstanceId = parentService.getSelected().PrcHeaderFk;
					} else {
						creationData.InstancId = null;
					}
					if (parentServiceName === quoteRequistion) {
						creationData.FrmStyle = 4;
					}
					creationData.PrcHeaderFk = parentService.getSelected().PrcHeaderFk;
					creationData.ProjectFk = parentService.getSelected().ProjectFk;
					// TODO this creationData.ProjectFk no use in background, the parent.projectFk maybe set null
					if (!creationData.ProjectFk) {
						creationData.ProjectFk = 0;
					}
					creationData.ConfigurationFk = parentService.getSelected().PrcHeaderEntity.ConfigurationFk;
					if (parentServiceName && parentServiceName === reqModule) {
						creationData.BasPaymentTermFiFk = parentService.getSelected().BasPaymentTermFiFk;
						creationData.BasPaymentTermPaFk = parentService.getSelected().BasPaymentTermPaFk;
						creationData.FrmStyle = 1;// from  requisition
						creationData.FrmHeaderFk = creationData.PrcHeaderFk;// from  requisition
					} else if (parentServiceName && parentServiceName === contractModule) {
						creationData.BasPaymentTermFiFk = parentService.getSelected().PaymentTermFiFk;
						creationData.BasPaymentTermPaFk = parentService.getSelected().PaymentTermPaFk;
						creationData.FrmStyle = 2;// from  contract
						creationData.FrmHeaderFk = parentService.getSelected().Id;// from  contract
						creationData.IsContract = true;
						creationData.ContractHeaderFk = parentService.getSelected().ContractHeaderFk;

					}

					creationData.TaxCodeFk = service.getSelectedPrcHeader().TaxCodeFk;
					creationData.Itemnos = _.map(data.itemList, function (item) {
						return item.Itemno;
					});

					if (parentServiceName === priceComparisonQuoteRequisition) {
						creationData.FrmStyle = 5; // from price comparison quote requisition
					}
				};

				var handleCreateSucceeded = function handleCreateSucceeded(newItem) {

					var createToolItem = _.find(service.toolItems, {id: 'create'});
					if (!!newItem && !!createToolItem) {
						createToolItem.disabled = false;
						if (service.updateToolsEvent) {
							service.updateToolsEvent.fire();
						}
					}
					var parentServiceName = parentService.name;

					if (parentServiceName && parentServiceName === contractModule) {
						// if has items, then the CON_HEADER_FK and PRJ_CHANGE_FK will be readonly
						var parentItem = parentService.getSelected();
						platformRuntimeDataService.readonly(parentItem, [{
							field: 'ContractHeaderFk',
							readonly: true
						}]);
						platformRuntimeDataService.readonly(parentItem, [{
							field: 'ProjectChangeFk',
							readonly: true
						}]);
					}

					if (parentServiceName !== 'procurement.pricecomparison.quote.requisition') {
						let maxItemNo = getMaxItemNo();
						let systemOptionStep = newItem.PrcItemIncreaseStep;
						increaseItemNumberByStepFromSystemOptionForNewItem(newItem, maxItemNo, systemOptionStep);
					}

					if (parentServiceName && parentServiceName === quoteRequistion) {
						var prcItemValidation = procurementCommonPrcItemValidationService(service);
						var result = prcItemValidation.validateQuoteItemno(newItem, newItem.Itemno, 'Itemno');
						if (result.valid) {
							var reqPrcItem = findrelevantReqItemByNo(newItem.Itemno);
							if (reqPrcItem) {
								// CopyReqPrcItemValue(newItem,reqPrcItem);
								setCopyPrcItemValue(reqPrcItem);
							}
						}
					}
				};

				function readOnlyContractItem(parentService, items) {
					var validation = procurementCommonPrcItemValidationService(service);
					validation.checkContractItemReadOnly(parentService, items);
				}

				function getMaxItemNo() {
					var itemNumbers = _.map(data.itemList, function (item) {
						return item.Itemno;
					});
					var maxItemNo = _.max(itemNumbers);
					maxItemNo = isNullOrUndefined(maxItemNo) ? 0 : Number(maxItemNo);
					return maxItemNo;
				}

				function isNullOrUndefined(value) {
					return _.isNull(value) || _.isUndefined(value);
				}

				function increaseItemNumberByStepFromSystemOptionForNewItem(newItem, maxNo, step) {
					var itemMaxNo = maxNo + step;
					if (newItem.Itemno < itemMaxNo) {
						newItem.Itemno = itemMaxNo;
					}
				}

				var isReadonly = function (currentItem, model) {
					return !serviceContainer.service.getCellEditable(currentItem, model);
				};
				var dataProcessService = function () {
					return {dataService: serviceContainer.service, validationService: null};
				};

				// create service options by isTree option
				if (isTree) {
					defaultOptions.dataProcessor.push(procurementCommonDataImageProcessor('PrcReplacementItemFk'));
					defaultOptions.dataProcessor.push(new ServiceDataProcessArraysExtension(['ReplacementItems']));
					defaultOptions.dataProcessor.push(procurementCommonDataEnhanceProcessor(dataProcessService, 'procurementCommonItemUIStandardService', isReadonly));
					defaultOptions.actions.create = 'hierarchical';
					defaultOptions.presenter.tree = {
						parentProp: 'PrcReplacementItemFk',
						childProp: 'ReplacementItems',
						initCreationData: initCreationData,
						incorporateDataRead: incorporateDataRead,
						handleCreateSucceeded: function (newItem) {
							if (7 === newItem.BasItemType2Fk || 5 === newItem.BasItemType2Fk) {
								var validation = procurementCommonPrcItemValidationService(service);
								validation.validateBasItemType2Fk(newItem, newItem.BasItemType2Fk, 'BasItemType2Fk');
							}
						}
					};

					serviceOptions.hierarchicalNodeItem = defaultOptions;
				} else {
					if (isEnhanceProcessor) {
						defaultOptions.dataProcessor.push(procurementCommonDataEnhanceProcessor(dataProcessService, 'procurementCommonItemUIStandardService', isReadonly));
					} else {
						defaultOptions.dataProcessor.push(readonlyProcessor);
					}
					defaultOptions.actions.create = 'flat';
					defaultOptions.presenter.list = {
						initCreationData: initCreationData,
						incorporateDataRead: incorporateDataRead,
						handleCreateSucceeded: handleCreateSucceeded
					};
					serviceOptions.flatNodeItem = defaultOptions;
					_.forEach(editableLevel1, function (item) {
						extendOptions.readonly.push(item);
					});
					_.forEach(readonlyLevel2, function (item) {
						extendOptions.readonly.push(item);
					});
				}

				function onUpdateDoneResetReadonly() {
					procurementCommonOverviewDataService.getService(parentService).load();
					var headerItem = parentService.getSelected();
					if (headerItem) {
						var items = service.getList();
						if (Object.prototype.hasOwnProperty.call(headerItem, 'MaterialCatalogFk') && headerItem.MaterialCatalogFk) {
							angular.forEach(items, function (item) {
								service.setColumnsReadOnly(item, true);
								intiCreateOtherItems(item, false);
							});
						} else {
							angular.forEach(items, function (item) {
								if (item.MdcMaterialFk) {
									platformRuntimeDataService.readonly(item, [{
										field: 'BasUomFk',
										readonly: true
									}]);
								}
								if (item.MdcMaterialFk && !item.Material2Uoms) {
									platformRuntimeDataService.readonly(item, [{
										field: 'AlternativeUomFk',
										readonly: true
									}]);
								}
								intiCreateOtherItems(item, false, true);
								if(item.BasItemTypeFk === 7){
									let columns = Object.keys(item);
									_.forEach(columns, (culumn) => {
										if (culumn === 'Itemno' || culumn === 'Description1' || culumn === 'Description2' || culumn === 'Specification' || culumn === 'Userdefined1'
											|| culumn === 'Userdefined2'|| culumn === 'Userdefined3'|| culumn === 'Userdefined4'|| culumn === 'Userdefined5') {
											platformRuntimeDataService.readonly(item, [{field: culumn, readonly: false}]);
										} else {
											platformRuntimeDataService.readonly(item, [{field: culumn, readonly: true}]);
										}
									});
								}
							});
							serviceContainer.service.gridRefresh();
						}
					}
				}

				extendOptions.onUpdateDone = onUpdateDoneResetReadonly;

				basicsLookupdataLookupDescriptorService.loadData(['prcitemstatus']);

				// bootstrap service
				serviceContainer = procurementCommonDataServiceFactory.createNewComplete(serviceOptions, extendOptions);

				angular.extend(serviceContainer.service,
					{
						name: 'procurement.prc.item',
						updatePrjStockReadOnly: updatePrjStockReadOnly,
						selectPrjStockReadOnly: selectPrjStockReadOnly,
						initPrjStockReadOnly: initPrjStockReadOnly
					}
				);
				service = serviceContainer.service;

				// add the onCostGroupCatalogsLoaded messenger
				service.onCostGroupCatalogsLoaded = new PlatformMessenger();
				service.getProjectId = function () {
					var header = parentService.getSelected();
					return header.ProjectFk;
				};

				service.toolItems = null;
				service.setToolItems = function (toolItems) {
					service.toolItems = toolItems;
				};
				service.updateToolsEvent = new PlatformMessenger();
				moduleContext.setItemDataService(serviceContainer.service);
				moduleContext.setItemDataContainer(serviceContainer);

				// read service from serviceContainer

				service.updateCopyMainCallOffItemsTool = function (isDisabled) {
					var copyMainCallOffItem = _.find(service.toolItems, {id: 'copyMainCallOffItems'});
					if (copyMainCallOffItem) {
						copyMainCallOffItem.disabled = isDisabled;
						if (service.updateToolsEvent) {
							service.updateToolsEvent.fire();
						}
					}
				};
				data = serviceContainer.data;
				data.usesCache = false;
				service.name = 'procurement.item';
				service.decimalRoundTo = 2;
				service.parentDataService = parentService;
				parentServiceName = parentService.name;
				service.dynamicColumns=[];
				service.aiGetCreateItem = aiGetCreateItem;
				service.DiscountAbsoluteFields = ['DiscountAbsolute','DiscountAbsoluteOc','DiscountAbsoluteGross','DiscountAbsoluteGrossOc'];
				service.getRubricId = function () {
					return angular.isFunction(parentService.getRubricId) ? parentService.getRubricId() : null;
				};
				function aiGetCreateItem() {
					return data.doPrepareCreate(data, true);
				}

				if (parentServiceName === quoteRequistion || parentServiceName === priceComparisonQuoteRequisition) {
					service.createItem = function (customParams) {
						let creationData = _.extend(data.doPrepareCreate(data, true), customParams);
						if (data.doUpdate) {
							return data.doUpdate(data).then(function (canCreate) {
								if (canCreate) {
									return data.doCallHTTPCreate(creationData, data, data.onCreateSucceeded);
								} else {
									return $q.reject('Cancelled by User');
								}
							});
						} else {
							return data.doCallHTTPCreate(creationData, data, data.onCreateSucceeded);
						}
					};

					data.doPrepareCreate = function doPrepareCreateInTree(data, isMainItem) {
						var creationData = {};
						creationData.parent = {};
						creationData.parentId = null;

						if (angular.isObject(data.parentService)) {
							creationData.MainItemId = data.parentService.getSelected().Id;
						}

						if (isTree) {
							if (data.selectedItem && data.selectedItem.Id && data.selectedItem[data.treePresOpt.parentProp]) {
								creationData.parentId = data.selectedItem[data.treePresOpt.parentProp];
								creationData.parent = _.find(data.itemList, {Id: creationData.parentId});
							}

							if (data.treePresOpt.initCreationData) {
								data.treePresOpt.initCreationData(creationData, data, isMainItem);
							} else {
								creationData[data.treePresOpt.parentProp] = creationData.parentId;
							}
						} else if (data.listPresOpt !== null && data.listPresOpt !== undefined) {
							if (data.listPresOpt) {
								data.listPresOpt.initCreationData(creationData, data, isMainItem);
							}
						}
						return creationData;
					};
				}

				if (isTree) {
					service.treePresOpt = serviceContainer.data.treePresOpt;

					service.canCreateChild = function () {
						return !!(parentService.hasSelection() && service.hasSelection() && service.getSelected().Version !== 0 &&
							(isTree && !platformObjectHelper.getValue(service.getSelected(), serviceContainer.data.treePresOpt.parentProp)));
					};

				}

				service.getModuleState = function () {
					return parentService.getModuleState();
				};

				var checkReadOnlyStatus = function () {
					if (parentService && parentService.hasSelection() && parentService.getSelected().PrcHeaderEntity) {
						const configFk = parentService.getSelected().PrcHeaderEntity.ConfigurationFk;
						const config = _.find(basicsLookupdataLookupDescriptorService.getData('prcconfiguration'), {Id: configFk});
						if (config && config.IsMaterial === false) {
							return false;
						}
					}
					const getModuleStatus = parentService.getItemStatus || parentService.getModuleState;
					if (getModuleStatus) {
						const status = getModuleStatus();
						if (status) {
							return !(status.IsReadOnly || status.IsReadonly);
						}
					}
					return undefined;
				};

				service.getReadOnly = () => !checkReadOnlyStatus();

				service.canCreate = function () {
					const isReadOnly = checkReadOnlyStatus();
					return isReadOnly === undefined ? (parentService.hasSelection() &&
							(!isTree || parentServiceName === quoteRequistion || parentServiceName === priceComparisonQuoteRequisition))
						: isReadOnly;
				};

				service.canDelete = function () {
					const selectedItem = service.getSelected();
					if (selectedItem === null || selectedItem === undefined) {
						return false;
					}
					const isReadOnly = checkReadOnlyStatus();
					if (isReadOnly !== undefined) {
						return isReadOnly;
					}
					if (selectedItem && (parentServiceName === quoteRequistion || parentServiceName === priceComparisonQuoteRequisition)) {
						if (parentService.hasSelection() && (selectedItem.InstanceId === selectedItem.PrcHeaderFk)) {
							return true;
						}
						return selectedItem.PrcReplacementItemFk !== null;

					}
					return parentService.hasSelection() &&
						(!isTree || platformObjectHelper.getValue(selectedItem, serviceContainer.data.treePresOpt.parentProp));
				};

				function disableCreate(flag) {
					serviceContainer.service.canCreate = function () {
						return !flag;
					};
				}

				function disableCreateChild(flag) {
					serviceContainer.service.canCreateChild = function () {
						return !flag;
					};
				}

				function disableDelete(flag) {
					serviceContainer.service.canDelete = function () {
						return !flag && canDeleteCallBackFunc(serviceContainer.service.getSelected());
					};
				}

				function canDeleteCallBackFunc(selected) {
					return !!selected;
				}

				/**
				 * @ngdoc function
				 * @name getCellEditable
				 * @function
				 * @methodOf procurement.common.procurementCommonPrcItemDataService
				 * @description get editable of model
				 * @returns boolean
				 */
				service.getCellEditable = function (item, model) { // jshint ignore : line
					var editable = false;
					var mainService = moduleContext.getMainService();
					var moduleName = mainService.name;
					var isModuleNameQuoteRequisition = (moduleName === quoteRequistion || moduleName === priceComparisonQuoteRequisition);
					var isModuleNameQuote = moduleName === quote || moduleName === priceComparisonQuote;

					if ((moduleName === contractModule || moduleName === quote || moduleName === quoteRequistion || moduleName === reqModule) &&
						(model === 'TargetPrice' || model === 'TargetTotal')) {
						return false;
					}
					if (isModuleNameQuote || isModuleNameQuoteRequisition) {
						if (isModuleNameQuoteRequisition && moduleContext.isReadOnly) {
							return false;
						}
						if (!qtnStatus) {
							qtnService = moduleContext.getLeadingService();
							qtnStatus = (qtnService.getSelected() || {}).QuoteStatus;
							if (!qtnStatus) {
								qtnStatus = getParentSelectedQuoteStatus(qtnService);
							}
						}
						if (model === 'TotalGross' || model === 'TotalGrossOc') {
							return false;
						}
						if (!qtnStatus || qtnStatus.IsReadonly === true) {
							return false;
						} else {
							editable = true;
							if (qtnStatus.IsProtected === true) {
								if (item.Version > 0) {
									editable = false;
									// Saved Item
									if (!item.BasItemType85Fk || item.BasItemType85Fk === 3) {
										var checkFields = ['Price', 'PriceOc', 'Discount', 'Quantity'];
										checkFields = checkFields.concat(service.DiscountAbsoluteFields);
										if (_.includes(checkFields, model)) { // jshint ignore : line
											editable = true;
										}
									} else {
										editable = true;
									}
									if (model === 'IsFreeQuantity') {
										editable = false;
									}
									if (model === 'BasItemType85Fk') {
										editable = true;
									}
									if (model === 'Quantity') {
										if (item.IsFreeQuantity) {// jshint ignore : line
											editable = !item.ReplacementItems || item.ReplacementItems.length <= 0;
										} else { // jshint ignore : line
											editable = !!item.PrcReplacementItemFk;
										}
									}
									return editable;
								} else {
									// New Item
									item.BasItemType85Fk = 2; // New Item Offered
								}
							} else {
								if (model === 'Quantity') {
									if (item.Version > 0) {
										editable = !item.ReplacementItems || item.ReplacementItems.length <= 0;
									}
								} else if (model === 'MdcTaxCodeFk' || model === 'BasPaymentTermFiFk' || model === 'BasPaymentTermPaFk' || model === 'PrcIncotermFk' || model === 'Supplierreference') {
									if (item.PrcHeaderFk !== item.InstanceId) {
										if (!item.PrcReplacementItemFk) {// jshint ignore : line
											// these columns editable if the QTN item from REQ and is not replacementItem
											editable = !(item.ReplacementItems && item.ReplacementItems.length);
										}
									}
								} else if (model === 'BufferLeadTime' || model === 'DateRequired' || model === 'Offhire' || model === 'Onhire' || model === 'Address' || model === 'SafetyLeadTime') {
									if (item.Version === 0) {
										editable = !!(item.ReplacementItems && item.ReplacementItems.length);
									}
								} else if (model === 'SellUnit' || model === 'LeadTime' || model === 'MinQuantity' || model === 'LeadTimeExtra') {
									if (!item.PrcReplacementItemFk) {
										editable = !(item.ReplacementItems && item.ReplacementItems.length);
									}
								} else if (model === 'BudgetFixedUnit' || model === 'BudgetFixedTotal' || model === 'BudgetPerUnit' || model === 'BudgetTotal') {
									editable = moduleName === prcModuleName.packageModule;
								}
							}

							if (model === 'SafetyLeadTime' || model === 'BufferLeadTime') {
								editable = false;
							}
						}
					}

					if (moduleName === contractModule) {
						if (model === 'MdcTaxCodeFk') {
							editable = !service.MaterialCatalogFk;
						}
					}

					if (model === 'PrcStructureFk') {
						editable = !item.MdcMaterialFk;
					} else if (model === 'DateRequired') {
						editable = !item.Hasdeliveryschedule;
					} else if (_.includes(service.DiscountAbsoluteFields, model)) {
						editable = (item.Price) !== 0;
					}

					if (isTree) {
						if (item.Version === 0) {
							editable = true;
						} else {
							if (!item.PrcReplacementItemFk) {
								var child = item.ReplacementItems;
								if (child && child.length) {
									editable = false;
								} else {
									editable = editableLevel1.indexOf(model.toLocaleLowerCase()) !== -1;
								}
							} else {
								editable = readonlyLevel2.indexOf(model.toLocaleLowerCase()) === -1;
							}
						}
					}

					return editable;

				};

				// add by jack

				var ontaxMaterialCatalogFkChanged = function ontaxMaterialCatalogFkChanged(e, args) {
					service.MaterialCatalogFk = args.value;
					service.HeaderEntity = args.item;
					var fields = ['LeadTimeExtra', 'MdcTaxCodeFk'];

					angular.forEach(service.getList(), function (item) {
						var readonlyArr = [];
						angular.forEach(fields, function (field) {
							var readOnly = !service.getCellEditable(item, field);
							readonlyArr.push({field: field, readonly: readOnly});
						});
						platformRuntimeDataService.readonly(item, readonlyArr);
					});
					service.gridRefresh();
				};

				var leadingService = moduleContext.getMainService();
				if (leadingService.taxMaterialCatalogFkChanged) {
					leadingService.taxMaterialCatalogFkChanged.register(ontaxMaterialCatalogFkChanged);
				}

				service.priceConditionSelectionChanged = new PlatformMessenger();
				service.onQuantityChanged = new PlatformMessenger();
				service.onSpecificationChanged = new PlatformMessenger();
				service.onItemStructureChanged = new PlatformMessenger();

				var onUpdateDone = function (response) {
					var list = service.getList();
					readOnlyContractItem(parentService, list);
					if (currentModuleName === contractModule) {
						_.forEach(list, function(i) {
							if (Object.prototype.hasOwnProperty.call(i, 'ModifiedStructureNull')) {
								delete  i.ModifiedStructureNull;
							}
						});
					}
					if (!response) {
						return;
					}
					var data = serviceContainer.data;
					data.disableWatchSelected(data);
					data.trackSelections(service.getSelected(), data);// TODO: for adding current item to data.selection, this work should be done by dataServiceFactory
					data.enableWatchSelected(data.selectedItem, data);
				};
				parentService.registerUpdateDone(onUpdateDone);// Frank, 2015-06-12: This will not work any longer. How to fix will be discussed next Monday

				service.registerLookupFilters({
					'procurement-common-prcitem-filter': {
						serverSide: true,
						serverKey: 'procurement-common-item-filter',
						fn: function () {
							var currentItem = parentService.getSelected();
							if (currentItem) {
								return 'PrcHeaderFk=' + currentItem.PrcHeaderFk;
							}
						}
					},
					'procurement-common-item-mdcmaterial-filter': {
						serverSide: true,
						fn: function (dataItem, searchOptions) {
							var filter = {};
							var currentItem = parentService.getSelected();

							if (currentItem) {
								var selectItem = currentItem.ReqHeaderEntity || parentService.getSelected();

								// set Filter for material-lookup-controller
								searchOptions.DisplayedPriceType = 1; // using cost price
								searchOptions.Filter = filter;
								searchOptions.ContractName = "ProcurementMaterialFilter";

								searchOptions.MaterialTypeFilter = {
									IsForProcurement: true
								};

								if (selectItem && selectItem.MaterialCatalogFk) {
									filter.MaterialCatalogId = selectItem.MaterialCatalogFk;
								}
								const cusEntity = _.find(basicCustomizeSystemoptionLookupDataService.getList(), {'Id':10107});
								const isFilterByHeaderStructure = Object.prototype.hasOwnProperty.call(searchOptions, 'isFilterByHeaderStructure') ?
									searchOptions.isFilterByHeaderStructure :
									(cusEntity.ParameterValue==='1' || cusEntity.ParameterValue ==='true');
								if (isFilterByHeaderStructure) {
									filter.PrcStructureId = currentItem.PrcHeaderEntity.StructureFk;
								}else {
									if (dataItem && dataItem.PrcStructureFk) {
										filter.PrcStructureId = dataItem.PrcStructureFk;
										// #144045 - Adjustment of the pre-allocation in the material lookup
									}
								}
								filter.PrcStructureOptional = true;


								filter.IsFromContract = parentService.getServiceName() === 'procurementContractHeaderDataService';
								if (angular.isFunction(parentService.getConMasterRestrictionInfo)) {
									var conRestrictionInfo = parentService.getConMasterRestrictionInfo();
									if (angular.isObject(conRestrictionInfo)) {
										filter.ConHeaderId = conRestrictionInfo.conHeaderId;
										filter.PrcConfigurationId = conRestrictionInfo.prcConfigurationId;
										filter.IncludeCatalogIds = conRestrictionInfo.includeCatalogIds;
										filter.ExcludeCatalogIds = conRestrictionInfo.excludeCatalogIds;
										filter.PrcCopyMode = conRestrictionInfo.prcCopyMode;
										filter.PackageId = conRestrictionInfo.packageFk;
									}
								}
								if (currentModuleName === packageModule) {
									filter.IsFromPackage = true;
									var pacakgeHeaderService = parentService.parentService();
									if (angular.isFunction(pacakgeHeaderService.getPrcPacMasterRestrictionInfo)) {
										var restrictionInfo = pacakgeHeaderService.getPrcPacMasterRestrictionInfo();
										if (angular.isObject(restrictionInfo)) {
											filter.PrcConfigurationId = restrictionInfo.prcConfigurationId;
											filter.IncludeCatalogIds = restrictionInfo.includeCatalogIds;
											filter.ExcludeCatalogIds = restrictionInfo.excludeCatalogIds;
											filter.PrcCopyMode = restrictionInfo.prcCopyMode;
											filter.PackageId = restrictionInfo.packageId;
										}
									}
								}
								if (angular.isFunction(parentService.getBasisContractInfo)) {
									var basisInfo = parentService.getBasisContractInfo();
									if (angular.isObject(basisInfo)) {
										filter.BasisContractId = basisInfo.basisContractId;
									}
								}
							}

							return filter;
						}
					},
					'procurement-common-item-controlling-unit-filter': {
						serverSide: true,
						serverKey: 'prc.con.controllingunit.by.prj.filterkey',
						fn: function () {
							var currentItem = parentService.getSelected();
							if (currentItem) {
								var selectItem = currentItem.ReqHeaderEntity || currentItem;
								return {
									PrjProjectFk: selectItem.ProjectFk,
									ExtraFilter: true,
									ByStructure: true,
									CompanyFk: null
								};
							}
						}
					},
					'procurement-common-item-agreement-filter': {
						serverSide: true,
						serverKey: 'procurement-common-item-agreement-filter',
						fn: function () { // jshint ignore: line
							// var dataParameter = {};
							var moduleName = currentModuleName;
							var currentItem = parentService.getSelected() || {};
							switch (moduleName) {
								case reqModule:
									return {
										filterDate: currentItem.DateReceived
									};
								// dataParameter.bpFk = angular.isDefined(currentItem.BusinessPartnerFk) ? currentItem.BusinessPartnerFk : null;
								case packageModule:
									return {
										filterDate: 'all'
									};
								case quote:
									var quoteHeader = parentService.parentService().getSelected();
									if (quoteHeader) {
										return {
											filterDate: angular.isDefined(quoteHeader.DateQuoted) ? quoteHeader.DateQuoted : null
										};
										// dataParameter.bpFk = angular.isDefined(quoteHeader.BusinessPartnerFk)?quoteHeader.BusinessPartnerFk:null;
									}
									break;
								case contractModule:
									return {
										filterDate: currentItem.DateOrdered
									};
								// dataParameter.bpFk = angular.isDefined(currentItem.BusinessPartnerFk) ? currentItem.BusinessPartnerFk : null;
							}
							return {filterDate: null};
							// return JSON.stringify(dataParameter).replace(/\"/g,'');
							/* if(dataParameter.filterDate){
								/!*var dateOrderedISO = 'DateTime(' + window.moment(date).utc().format('YYYY,MM,DD') + ')';*!/
								var dateOrderedISO =  window.moment(dataParameter.filterDate).utc().format('YYYY,MM,DD');
								var res = '%date% and '+dataParameter.bpFk;
								return res.replace(/%date%/g,dateOrderedISO);
								return dataParameter.filterDate;
							}
							return ''; */
							// return dataParameter.filterDate;
						}
					},
					'procurement-common-item-evaluation-filter': {
						serverSide: true,
						fn: function () {
							return 'Id != 3';
						}
					},
					'procurement-common-item-mdcsalestaxgroup-filter': {
						key: 'saleTaxCodeByLedgerContext-filter',
						serverSide: false,
						fn: function (item) {
							var loginCompanyFk = platformContextService.clientId;
							var LedgerContextFk;
							if (loginCompanyFk) {
								var companies = lookupDescriptorService.getData('Company');
								company = _.find(companies, {Id: loginCompanyFk});
								if (company) {
									LedgerContextFk = company.LedgerContextFk;
								}
							}
							return (item.LedgerContextFk === LedgerContextFk) && item.IsLive;
						}
					},
					'procurement-common-item-stock-type-filter': {
						serverSide: false,
						fn: function (item) {
							return item.IsProcurement;
						}
					}
				});
				// this method will call when scheduled quantity changed
				// if quantityScheduled is not zero, Hasdeliveryschedule in current item will set true.
				service.onDeliveryScheduleRecordChanged = function (quantityScheduled) {
					var currentItem = service.getSelected();
					if (!currentItem) {
						return;
					}

					var hasDeliveryScheduled = quantityScheduled.length > 0;
					currentItem.Hasdeliveryschedule = !!currentItem.Hasdeliveryschedule; // force it as a bool value
					if (currentItem.Hasdeliveryschedule !== hasDeliveryScheduled) {
						currentItem.Hasdeliveryschedule = hasDeliveryScheduled;

						service.markCurrentItemAsModified();
						currentItem.DateRequired = currentItem.Hasdeliveryschedule ? null : currentItem.DateRequired;
						service.updateReadOnly(currentItem, 'DateRequired');
						service.fireItemModified(currentItem);
					}
				};

				$injector.get('procurementCommonMaterialSpecificationFactory').getItemSpecification(service);

				service.updateItemTextStatus = function (data) {
					if (!service.getSelected()) {
						return;
					}
					// This flag indicates if itemtext have been recorded for the item
					service.getSelected().Hastext = (data && data.length > 0);
					service.markCurrentItemAsModified();
					service.fireItemModified(service.getSelected());
				};

				service.updateCurrencyInfo = function (id) {
					if (!id) {
						return;
					}

					currencyHttpService.getCurrencyById(id).then(function (response) {
						var currency = response.data;
						if (angular.isObject(currency)) {
							/** @namespace currency.DecimalsRoundto */
							service.decimalRoundTo = currency.DecimalsRoundto;
						}
					});
				};

				// Set some columns readonly when parent item have material Catalog
				service.setColumnsReadOnly = function (item, readOnly) {
					if (item.MdcMaterialFk) {
						platformRuntimeDataService.readonly(item, [{field: 'Description1', readonly: readOnly}]);
						platformRuntimeDataService.readonly(item, [{field: 'Description2', readonly: readOnly}]);
						platformRuntimeDataService.readonly(item, [{field: 'Specification', readonly: readOnly}]);
						platformRuntimeDataService.readonly(item, [{field: 'BasUomFk', readonly: true}]);
						platformRuntimeDataService.readonly(item, [{field: 'AlternativeUomFk', readonly: true}]);
						platformRuntimeDataService.readonly(item, [{field: 'Price', readonly: readOnly}]);
						platformRuntimeDataService.readonly(item, [{field: 'PriceOc', readonly: readOnly}]);
						platformRuntimeDataService.readonly(item, [{
							field: 'PrcPriceConditionFk',
							readonly: readOnly
						}]);
						platformRuntimeDataService.readonly(item, [{field: 'PriceUnit', readonly: readOnly}]);
						platformRuntimeDataService.readonly(item, [{
							field: 'BasUomPriceUnitFk',
							readonly: readOnly
						}]);
						platformRuntimeDataService.readonly(item, [{field: 'FactorPriceUnit', readonly: readOnly}]);
						platformRuntimeDataService.readonly(item, [{
							field: 'BasPaymentTermFiFk',
							readonly: readOnly
						}]);
						platformRuntimeDataService.readonly(item, [{
							field: 'BasPaymentTermPaFk',
							readonly: readOnly
						}]);
						platformRuntimeDataService.readonly(item, [{field: 'PrcIncotermFk', readonly: readOnly}]);
						platformRuntimeDataService.readonly(item, [{field: 'BpdAgreementFk', readonly: readOnly}]);
						platformRuntimeDataService.readonly(item, [{field: 'PriceGross', readonly: readOnly}]);
						platformRuntimeDataService.readonly(item, [{field: 'PriceGrossOc', readonly: readOnly}]);

						let isGrossMode = prcGetIsCalculateOverGrossService.getIsCalculateOverGross();
						if (currentModuleName === contractModule && isGrossMode) {
							platformRuntimeDataService.readonly(item, [{field: 'TotalGross', readonly: readOnly}]);
							platformRuntimeDataService.readonly(item, [{field: 'TotalGrossOc', readonly: readOnly}]);
						}
					}
				};

				// add : CALCULATE WHEN LOAD DATA
				service.calculateTotal = function (currentItem, isResetGross, isResetPriceExtra, dontReCalcuPricGrossOc) {
					if (!currentItem) {
						currentItem = service.getSelected();
					}
					var isCalculateOverGross = prcGetIsCalculateOverGrossService.getIsCalculateOverGross();
					if (isCalculateOverGross) {
						calculateTotalAtGrossMode(currentItem, isResetGross, isResetPriceExtra, dontReCalcuPricGrossOc);
					} else {
						calculateTotalAtNetMode(currentItem, isResetGross, isResetPriceExtra, dontReCalcuPricGrossOc);
					}
					if (currentItem.BasItemTypeFk === 2 || currentItem.BasItemType2Fk === 3 || currentItem.BasItemType2Fk === 5) {
						currentItem.TotalNoDiscount = 0;
						currentItem.TotalCurrencyNoDiscount = 0;
						currentItem.Total = 0;
						currentItem.TotalOc = 0;
						currentItem.TotalGross = 0;
						currentItem.TotalGrossOc = 0;
					}
					if (!(currentModuleName === quote && currentItem.isOtherQtnReqPrcItem) &&
						!(currentModuleName === packageModule && currentItem.isOtherSubPackagePrcItem)) {
						service.markItemAsModified(currentItem);
					}
					parentService.isTotalDirty = true;

				};

				service.getSelectedPrcHeader = function getSelectedPrcHeader() {
					return (service.parentDataService.getSelectedPrcHeader || service.parentDataService.getSelected)();
				};

				service.registerFilters();

				service.getMaterialLookupSelectedItems = function (selectedItems) {
					// TODO DEV-39063 - select multiple material enhance
					var maxNo = getMaxItemNo();
					var creationData = {};
					initCreationData(creationData, {}, null, true);
					var materialIds = [];
					var addItems = _.slice(selectedItems, 1);
					if (!addItems.length) {
						return;
					}

					_.forEach(addItems, function (item) {
						materialIds.push(item.Id);
					}
					);
					var createPrcItemParameter = {
						prcItemCreateParameter: creationData,
						materialIds: materialIds,
						maxNo: maxNo
					};
					$http.post(globals.webApiBaseUrl + 'procurement/common/prcitem/getmaterialstoprcitem', createPrcItemParameter).then(function (response) {
						var itemList = response.data;
						var validation = procurementCommonPrcItemValidationService(service);
						const validatePromise = [];
						serviceContainer.data.supportUpdateOnSelectionChanging = false;
						_.forEach(itemList, function (item) {
							serviceContainer.data.itemList.push(item);
							platformDataServiceActionExtension.fireEntityCreated(serviceContainer.data, item);
							service.markItemAsModified(item);
							validation.validateMdcMaterialFk(item, item.MdcMaterialFk);
							validatePromise.push(validation.asyncValidateMdcMaterialFk(item, item.MdcMaterialFk));
						});
						Promise.all(validatePromise).finally(function() {
							serviceContainer.data.supportUpdateOnSelectionChanging = true;
						});

					}, function (err) {
						window.console.error(err);
					});
				};

				service.loadSubItemsList = function () {
					// serviceContainer.data.doesRequireLoadAlways = true;//Baf. Otherwise the service.loadSubItemList will not work correctly.
					// serviceContainer.data.usesCache = false;
					serviceContainer.data.doClearModifications(null, serviceContainer.data);
					return serviceContainer.data.loadSubItemList.apply(this, arguments);
					// serviceContainer.data.usesCache = true;
					// serviceContainer.data.doesRequireLoadAlways = false;

				};

				serviceContainer.data.onDeleteDone = function (deleteParams, data, response) {
					var toDelete = serviceContainer.service.getSelectedEntities();
					var getDeleteList = angular.copy(toDelete);

					platformDataServiceDataPresentExtension.handleOnDeleteSucceededInList({entities: toDelete}, serviceContainer.data, serviceContainer.service);
					if (serviceContainer.service.getList().length === 0) {
						var parentServiceName = parentService.name;
						if (parentServiceName && parentServiceName === contractModule) {
							// if has no items, then the CON_HEADER_FK and PRJ_CHANGE_FK can be editable
							var parentItem = parentService.getSelected();
							if (parentItem) {
								parentItem.HasItems = false;
								parentService.updateFieldsReadOnly(parentItem, ['ContractHeaderFk', 'ProjectChangeFk']);
							}
						}

					}

					var list = serviceContainer.service.getList();
					if (list.length > 0) {
						_.forEach(getDeleteList, function (deleteItem) {
							if (7 === deleteItem.BasItemType2Fk) {
								var findBase = _.find(list, function (item) {
									return item.BasItemType2Fk === 3 && item.AGN === deleteItem.AGN;
								});
								var findAlternatvie = _.find(list, function (item) {
									return item.BasItemType2Fk === 7 && item.PrcItemAltFk === deleteItem.PrcItemAltFk;
								});
								if (findBase&&!findAlternatvie){
									var findBaseGroup=_.filter(list, function (item) {
										return item.BasItemType2Fk === 3 && item.AGN === findBase.AGN&&item.AAN===findBase.AAN;
									});
									_.forEach(findBaseGroup,function(item){
										item.BasItemType2Fk = 2;
										serviceContainer.service.fireItemModified(item);
									});
								}
							}
						});
						serviceContainer.service.gridRefresh();
					}

					if (data.doDeepRemove !== null && !angular.isUndefined(data.doDeepRemove)) {
						data.doDeepRemove(deleteParams, true, data);
					}
					if (response && data.rootOptions && data.rootOptions.mergeAffectedItems) {
						data.rootOptions.mergeAffectedItems(response, data);
					}

					if (deleteParams.entity) {
						platformDataServiceActionExtension.fireEntityDeleted(data, deleteParams.entity);
					} else {
						platformDataServiceActionExtension.fireEntityDeleted(data, deleteParams.entities);
					}

					data.listLoaded.fire();
					platformDataServiceSelectionExtension.doSelectCloseTo(deleteParams.index, data);
				};

				function setPaymentTermOfItems(e, args) {
					var allItems = service.getList();
					for (var i = 0; i < allItems.length; i++) {
						allItems[i].BasPaymentTermFiFk = args.paymentTermFI;
						allItems[i].BasPaymentTermPaFk = args.paymentTermPA;
					}
					service.gridRefresh();
				}

				if (parentService.basisChanged) {
					parentService.basisChanged.register(setPaymentTermOfItems);
				}

				// create price condition service
				var priceConditionService = priceConditionDataService.getService();

				function resetExtraCalculateTotal(entity, dontReCalcuPricGrossOc) {
					service.checkEntityPropertyNull(entity);
					entity.calculateTotalLater = true;
					var originalExtra = entity.PriceExtra;
					var originalExtraOc = entity.PriceExtraOc;
					return priceConditionService.recalculate(entity, entity.PrcPriceConditionFk).then(function () {
						var isResetPriceExtra = (entity.PriceExtra !== originalExtra || entity.PriceExtraOc !== originalExtraOc);
						var isResetGross = true;
						service.calculateTotal(entity, isResetGross, isResetPriceExtra, dontReCalcuPricGrossOc);
						entity.calculateTotalLater = false;
					}).finally(function () {
						priceConditionService.releaseParentSelection();
					});
				}
				service.resetExtraCalculateTotal = resetExtraCalculateTotal;

				// TODO yew 2020.12.01 int or decimal property maybe set null in js validation
				service.checkEntityPropertyNull = function checkEntityIsNull(entity) {
					var checkProperty = ['Price', 'PriceOc', 'PriceExtra', 'PriceExtraOc', 'PriceUnit', 'FactorPriceUnit',
						'TargetPrice', 'TargetTotal', 'QuantityAskedfor', 'QuantityDelivered', 'SafetyLeadTime', 'BufferLeadTime',
						'LeadTimeExtra', 'QuantityConfirm', 'Discount', 'SellUnit', 'LeadTime', 'MinQuantity'];
					_.forEach(checkProperty, function (item) {
						if (entity[item] === null) {
							entity[item] = 0;
						}
					});
				};

				var exchangeUpdated = function exchangeUpdated(e, args) {
					var materials = lookupDescriptorService.getData('MaterialCommodity'),
						headerItem = service.getSelectedPrcHeader();
					var exchangeRate = args.ExchangeRate;
					var headerSelectedItem;
					var netTotalNoDiscountSplitItem;

					if (!headerItem) {
						return false;
					}

					headerSelectedItem = getHeaderSelectedItem();

					if (headerSelectedItem && (headerSelectedItem.OverallDiscount || headerSelectedItem.OverallDiscount === 0)) {
						var items = service.getList();
						if (items && items.length) {
							if (currentModuleName === quote) {
								var quoteTotalDataService = $injector.get('procurementQuoteTotalDataService');
								netTotalNoDiscountSplitItem = quoteTotalDataService.getNetTotalNoDiscountSplitItem();
							} else {
								netTotalNoDiscountSplitItem = prcTotalService.getNetTotalNoDiscountSplitItem();
							}
						}
					}

					var dontReCalcuPricGrossOc = false;
					if (args && args.IsCurrencyChanged) {// need re get price from material
						var docCurrencyFk = headerItem.CurrencyFk || headerItem.BasCurrencyFk;
						_.forEach(service.getList(), function (item) {
							// if modify header currency not need consider item material
							/* var materialItem = _.find(materials, {Id: item.MdcMaterialFk});

							 if(materialItem && materialItem.Id ){
							 //if home currency(A) equal as material currency(C)
							 if(moduleContext.companyCurrencyId === materialItem.BasCurrencyFk ){
							 item.Price = materialItem.Cost - materialItem.PriceExtra;
							 item.PriceOc = item.Price * exchangeRate;
							 }else{
							 // get (cost - extra) from material to re cal
							 getForeignToDocExchangeRate(docCurrencyFk, materialItem.BasCurrencyFk, headerItem.ProjectFk).then(function(res){
							 var rate = res.data;
							 item.PriceOc = rate  === 0 ? 0 : (materialItem.Cost - materialItem.PriceExtra) / rate;
							 item.Price = exchangeRate === 0 ? 0 : item.PriceOc / exchangeRate;

							 dataService.fireItemModified(item);
							 calculateTotal(item);
							 });
							 }
							 }else{// if material not exist in prc_item
							 item.Price = exchangeRate === 0 ? 0 : item.PriceOc / exchangeRate;
							 } */
							if (docCurrencyFk === moduleContext.companyCurrencyId) {
								item.Price = item.PriceOc;
								item.PriceGross = item.PriceGrossOc;
								item.DiscountSplit = item.DiscountSplitOc;
							} else {
								item.PriceGross = itemCalculationHelper.getPriceGrossByPriceGrossOc(item, exchangeRate);
								item.Price = itemCalculationHelper.getPriceByPriceOc(item, exchangeRate);

								if (netTotalNoDiscountSplitItem) {
									item.DiscountSplit = itemCalculationHelper.round(roundingType.DiscountSplit, math.bignumber(item.Total).add(item.DiscountSplit).div(netTotalNoDiscountSplitItem.ValueNet).mul( headerSelectedItem.OverallDiscount));
								}
							}
							service.markItemAsModified(item);
							service.fireItemModified(item);
							dontReCalcuPricGrossOc = true;
							resetExtraCalculateTotal(item, dontReCalcuPricGrossOc);
						});
					} else {
						_.forEach(service.getList(), function (item) {
							var materialItem = _.find(materials, {Id: item.MdcMaterialFk});
							if (materialItem && materialItem.Id && moduleContext.companyCurrencyId === materialItem.BasCurrencyFk) {
								item.Price = itemCalculationHelper.getPriceByPriceOc(item, exchangeRate);
								item.PriceGross = itemCalculationHelper.getPriceGrossByPriceGrossOc(item, exchangeRate);
								item.DiscountSplit = itemCalculationHelper.getUnitRateNonOcByOc(item.DiscountSplitOc, exchangeRate);
							} else {
								item.Price = itemCalculationHelper.getPriceByPriceOc(item, exchangeRate);
								item.PriceGross = itemCalculationHelper.getPriceGrossByPriceGrossOc(item, exchangeRate);

								if (netTotalNoDiscountSplitItem) {
									item.DiscountSplit = itemCalculationHelper.round(roundingType.DiscountSplit, math.bignumber(item.Total).add(item.DiscountSplit).div(netTotalNoDiscountSplitItem.ValueNet).mul(headerSelectedItem.OverallDiscount));
								}
							}
							service.markItemAsModified(item);
							service.fireItemModified(item);
							dontReCalcuPricGrossOc = true;
							resetExtraCalculateTotal(item, dontReCalcuPricGrossOc);
						});
					}
				};
				if (moduleContext.getMainService().exchangeRateChanged) {
					moduleContext.getMainService().exchangeRateChanged.register(exchangeUpdated);
				}

				function calculateTotalAtGrossMode(currentItem, isResetGross, isResetPriceExtra, dontReCalcuPricGrossOc) {
					var vatPercent = service.getVatPercentWithTaxCodeMatrix(currentItem.MdcTaxCodeFk);
					if (isResetGross === true) {
						setGross(true, [currentItem], isResetPriceExtra, dontReCalcuPricGrossOc);
					}
					currentItem.TotalPrice = itemCalculationHelper.getTotalPrice(currentItem, vatPercent);
					currentItem.TotalPriceOc = itemCalculationHelper.getTotalPriceOc(currentItem, vatPercent);
					currentItem.Total = itemCalculationHelper.getTotal(currentItem, vatPercent);
					currentItem.TotalOc = itemCalculationHelper.getTotalOc(currentItem, vatPercent);
					currentItem.TotalNoDiscount = itemCalculationHelper.getTotalNoDiscount(currentItem, vatPercent);
					currentItem.TotalCurrencyNoDiscount = itemCalculationHelper.getTotalOcNoDiscount(currentItem, vatPercent);
				}

				function calculateTotalAtNetMode(currentItem, isResetGross, isResetPriceExtra, dontReCalcuPricGrossOc) {
					var vatPercent = service.getVatPercentWithTaxCodeMatrix(currentItem.MdcTaxCodeFk);
					currentItem.TotalPrice = itemCalculationHelper.getTotalPrice(currentItem, vatPercent);
					currentItem.TotalPriceOc = itemCalculationHelper.getTotalPriceOc(currentItem, vatPercent);
					currentItem.Total = itemCalculationHelper.getTotal(currentItem, vatPercent);
					currentItem.TotalOc = itemCalculationHelper.getTotalOc(currentItem, vatPercent);
					currentItem.TotalNoDiscount = itemCalculationHelper.getTotalNoDiscount(currentItem, vatPercent);
					currentItem.TotalCurrencyNoDiscount = itemCalculationHelper.getTotalOcNoDiscount(currentItem, vatPercent);
					if (isResetGross === true) {
						setGross(false, [currentItem], isResetPriceExtra, dontReCalcuPricGrossOc);
					}
				}

				function setGross(isOverGross, items, isResetPriceExtra, dontReCalcuPricGrossOc, calcDiscountAbsoluteGross) {
					angular.forEach(items, function (item) {
						setGrossforOne(isOverGross, item, isResetPriceExtra, dontReCalcuPricGrossOc, calcDiscountAbsoluteGross);
						if (item.ReplacementItems && item.ReplacementItems.length) {
							setGross(isOverGross, item.ReplacementItems);
						}
					});
				}

				function setGrossforOne(isOverGross, item, isResetPriceExtra, dontReCalcuPricGrossOc, calcDiscountAbsoluteGross) {
					var vatPercent = service.getVatPercentWithTaxCodeMatrix(item.MdcTaxCodeFk);
					var headerSelectecd = getHeaderSelectedItem();
					var exchangeRate = (headerSelectecd && headerSelectecd.ExchangeRate !== 0) ? headerSelectecd.ExchangeRate : 1;
					if (!isResetPriceExtra && !dontReCalcuPricGrossOc) {
						item.PriceGross = itemCalculationHelper.getPriceGross(item, vatPercent);
						item.PriceGrossOc = itemCalculationHelper.getPriceGrossOc(item, vatPercent);
					}
					item.TotalPriceGrossOc = itemCalculationHelper.getTotalPriceOCGross(item, vatPercent);
					item.TotalPriceGross = itemCalculationHelper.getTotalPriceGross(item, vatPercent, exchangeRate);
					if (!(item.BasItemTypeFk === 2 || item.BasItemType2Fk === 3 || item.BasItemType2Fk === 5)) {
						item.TotalGrossOc = itemCalculationHelper.getTotalGrossOc(item, vatPercent);
						item.TotalGross = itemCalculationHelper.getTotalGross(item, vatPercent, exchangeRate);
					} else {
						item.TotalGross = 0;
						item.TotalGrossOc = 0;
					}
					if (calcDiscountAbsoluteGross) {
						item.DiscountAbsoluteGross = itemCalculationHelper.getDiscountAbsoluteGrossByDA(item, vatPercent);
						item.DiscountAbsoluteGrossOc = itemCalculationHelper.getDiscountAbsoluteGrossOcByOc(item, vatPercent);
					}
				}

				function setNetValuesAfterChangeVatPrecent(items) {
					angular.forEach(items, function (item) {
						setNetValueAfterChangeVatPrecent(item);
					});
				}

				function setNetValueAfterChangeVatPrecent(item) {
					var vatPercent = service.getVatPercentWithTaxCodeMatrix(item.MdcTaxCodeFk);
					item.Price = itemCalculationHelper.getPrice(item, vatPercent);
					item.PriceOc = itemCalculationHelper.getPriceOc(item, vatPercent);
					item.TotalPrice = itemCalculationHelper.getTotalPrice(item, vatPercent);
					item.TotalPriceOc = itemCalculationHelper.getTotalPriceOc(item, vatPercent);
					item.Total = itemCalculationHelper.getTotal(item, vatPercent);
					item.TotalOc = itemCalculationHelper.getTotalOc(item, vatPercent);
					item.TotalNoDiscount = itemCalculationHelper.getTotalNoDiscount(item, vatPercent);
					item.TotalCurrencyNoDiscount = itemCalculationHelper.getTotalOcNoDiscount(item, vatPercent);
					item.DiscountAbsolute = itemCalculationHelper.getDiscountAbsoluteByGross(item, vatPercent);
					item.DiscountAbsoluteOc = itemCalculationHelper.getDiscountAbsoluteOcByGrossOc(item, vatPercent);

					if (item.BasItemTypeFk === 2 || item.BasItemType2Fk === 3 || item.BasItemType2Fk === 5) {
						item.TotalNoDiscount = 0;
						item.TotalCurrencyNoDiscount = 0;
						item.Total = 0;
						item.TotalOc = 0;
					}
				}

				service.setGross = setGross;
				service.setNetValuesAfterChangeVatPrecent = setNetValuesAfterChangeVatPrecent;

				function getIsStock(entity) {
					var _Prcstock = StockCache._Prcstock;
					var _Prcstructure = StockCache._Prcstructure;
					var MdcMaterialFk = entity.MdcMaterialFk;
					var PrcStructureFk = entity.PrcStructureFk;
					var ControllingUnitFk = entity.MdcControllingunitFk;
					var result = {
						PrjStockFk: null
					};

					// 1.PRC_ITEM.MDC_MATERIAL_FK is not NULL
					if (MdcMaterialFk === null) {
						return result;
					}

					// 2.PRC_ITEM.PRC_STRUCTURE_FK.ISSTOCKEXCLUDED = FALSE
					var PrcstructureItem = _.filter(_Prcstructure, function (item) {
						/** @namespace item.PrcstructureId */
						return item.PrcstructureId === PrcStructureFk;
					});
					/** @namespace PrcstructureItem.IsStockexcluded */
					if (PrcstructureItem.length === 0 || PrcstructureItem[0].IsStockexcluded) {
						return result;
					}

					// 3-1.PRC_ITEM.MDC_CONTROLLINGUNIT.ISSTOCKMANAGEMENT = TRUE
					var PrcstockItem = _.filter(_Prcstock, function (item) {
						/** @namespace item.ControllingunitId */
						return item.ControllingunitId === ControllingUnitFk;
					});

					if (PrcstockItem.length > 0) {
						var _prcstockItem = _.filter(PrcstockItem, function (item) {
							/** @namespace item.PrcstockId */
							return item.PrcstockId !== null;
						});
						if (_prcstockItem.length > 0) {
							var PrjStockFk = _prcstockItem[0].PrcstockId;
							return {
								PrjStockFk: PrjStockFk
							};
						}
					}
					return result;
				}

				function updatePrjStockReadOnly(entity) {
					var item = getIsStock(entity);
					var isstock = true;
					if (item.PrjStockFk !== null) {
						if (item.PrjStockFk === 0) {
							entity.PrjStockFk = null;
						} else {
							entity.PrjStockFk = item.PrjStockFk;
						}
						isstock = false;
					} else {
						entity.PrjStockFk = null;
						entity.PrjStockLocationFk = null;
					}
					// setPrjStockReadOnly(entity, isstock);
					platformRuntimeDataService.readonly(entity, [{
						field: 'PrjStockFk',
						readonly: isstock
					}, {
						field: 'PrjStockLocationFk',
						readonly: isstock
					}]);
					// serviceContainer.service.gridRefresh();
				}

				function setPrjStockReadOnly(entity, isstock) {
					platformRuntimeDataService.readonly(entity, [{
						field: 'PrjStockFk',
						readonly: isstock
					}, {
						field: 'PrjStockLocationFk',
						readonly: isstock
					}]);
				}

				function initPrjStockReadOnly(_items) {
					var items = [];
					if (!_items.length) {
						items.push(_items);
					} else {
						items = _items;
					}
					_.each(_.filter(items,
						function (item) {
							return item.PrjStockFk;
						}), function (_item) {
						setPrjStockReadOnly(_item, false);
					});
					var getitems = _.filter(items, function (item) {
						return !item.PrjStockFk;
					});
					if (getitems.length > 0) {
						_.each(getitems, function (getitem) {
							var item = getIsStock(getitem);
							if (item.PrjStockFk === null) {
								setPrjStockReadOnly(getitem, true);
							} else {
								setPrjStockReadOnly(getitem, false);
							}
						});
					}
					serviceContainer.service.gridRefresh();
				}

				function intiCreateOtherItems(item, isSetValue, notRefreshGrid) {
					if (item.PrjStockFk) {
						setPrjStockReadOnly(item, false);
					} else {
						var val = getIsStock(item);
						if (val.PrjStockFk) {
							if (val.PrjStockFk !== 0 && isSetValue) {
								item.PrjStockFk = val.PrjStockFk;
							}
							setPrjStockReadOnly(item, false);
						} else {
							setPrjStockReadOnly(item, true);
						}
					}
					if (!notRefreshGrid) {
						serviceContainer.service.gridRefresh();
					}
				}

				function selectPrjStockReadOnly(entity) {
					var defer = $q.defer();
					var _setData = {data: getIsStock(entity)};
					defer.resolve(_setData);
					return defer.promise;
				}

				var onCreateSucceeded = serviceContainer.data.onCreateSucceeded;
				serviceContainer.data.onCreateSucceeded = function (created, data, creationData) {
					return onCreateSucceeded.call(serviceContainer.data, created, data, creationData).then(function () {
						intiCreateOtherItems(created, true, true);
					});
				};

				service.doProcessItem = function (item) {
					var processor = service.getDataProcessor();
					_.each(processor, function (proc) {
						proc.processItem(item);
					});
				};

				service.getVatPercentWithTaxCodeMatrix = function getVatPercentWithTaxCodeMatrix(taxCodeFk, vatGroupFk) {
					var parentItem;
					if (currentModuleName === packageModule ||
						currentModuleName === quote) {
						parentItem = parentService.parentService().getSelected();
					} else {
						parentItem = parentService.getSelected();
					}
					vatGroupFk = (vatGroupFk === undefined && parentItem) ? parentItem.BpdVatGroupFk : vatGroupFk;
					return prcCommonGetVatPercent.getVatPercent(taxCodeFk, vatGroupFk);
				};

				service.getNetTotalNoDiscountSplit = function getNetTotalNoDiscountSplit(list) {
					var result = {
						netTotal: 0,
						netTotalOc: 0,
						gross: 0,
						grossOc: 0
					};
					var prcItems = list || service.getList();
					if (prcItems && prcItems.length) {
						var isCalculateOverGross = prcGetIsCalculateOverGrossService.getIsCalculateOverGross();
						_.forEach(prcItems, function (i) {
							if (isCalculateOverGross) {
								result.gross += i.TotalGross + i.DiscountSplit;
								result.grossOc += i.TotalGrossOc + i.DiscountSplitOc;
							} else {
								result.netTotal += i.Total + i.DiscountSplit;
								result.netTotalOc += i.TotalOc + i.DiscountSplitOc;
							}
						});
					}
					return result;
				};

				function onVatGroupFkChanged() {
					var entities = service.getList();
					_.forEach(entities, function (entity) {
						if (entity.MdcTaxCodeFk) {
							var isCalculateOverGross = prcGetIsCalculateOverGrossService.getIsCalculateOverGross();
							if (isCalculateOverGross) {
								setNetValueAfterChangeVatPrecent(entity);
							} else {
								setGrossforOne(isCalculateOverGross, entity, false, false, true);
							}
							service.markItemAsModified(entity);
							service.fireItemModified(entity);
						}
					});
				}

				if (currentModuleName === packageModule ||
					currentModuleName === quote) {
					if (parentService.parentService().vatGroupChanged) {
						parentService.parentService().vatGroupChanged.register(onVatGroupFkChanged);
					}
				} else {
					if (parentService.vatGroupChanged) {
						parentService.vatGroupChanged.register(onVatGroupFkChanged);
					}
				}

				var entitiesForUpdateUc = [];

				function onControllingUnitChanged() {
					entitiesForUpdateUc = service.getList();
					if (entitiesForUpdateUc && entitiesForUpdateUc.length) {
						if(currentModuleName === reqModule || currentModuleName === contractModule){
							parentService.hasItemsOrBoqs({items: true});
						}else {
							parentService.parentService().hasItemsOrBoqs({items: true});
						}
					}
				}

				function updateCuFromParent() {
					if (entitiesForUpdateUc && entitiesForUpdateUc.length) {
						var parenteSelected;
						if(currentModuleName === reqModule || currentModuleName === contractModule){
							parenteSelected = parentService.getSelected();

						}else {
							parenteSelected = parentService.parentService().getSelected();
						}
						if (parenteSelected) {
							entitiesForUpdateUc.forEach(function (e) {
								e.MdcControllingunitFk = parenteSelected.MdcControllingUnitFk ? parenteSelected.MdcControllingUnitFk : parenteSelected.ControllingUnitFk;
							});
							service.markEntitiesAsModified(entitiesForUpdateUc);
						}

					}
					entitiesForUpdateUc = [];
				}

				function updateTXFromParent() {
					entitiesForUpdateUc = service.getList();
					var parenteSelected;
					if(currentModuleName === contractModule){
						parenteSelected = parentService.getSelected();
					}
					if (parenteSelected) {
						const updatedItems = entitiesForUpdateUc.filter(function(entity) {
							if (entity.MdcTaxCodeFk !== parenteSelected.TaxCodeFk) {
								entity.MdcTaxCodeFk = parenteSelected.TaxCodeFk;
								return true;
							}
						});
						if (updatedItems?.length > 0) {
							const isCalculateOverGross = prcGetIsCalculateOverGrossService.getIsCalculateOverGross();
							if (isCalculateOverGross) {
								service.setNetValuesAfterChangeVatPrecent(updatedItems);
							} else {
								service.setGross(isCalculateOverGross, updatedItems, false, false, true);
							}
							service.markEntitiesAsModified(updatedItems);
						}
					}
					entitiesForUpdateUc = [];
				}

				if (currentModuleName === packageModule &&
					parentService.parentService().controllingUnitChanged &&
					parentService.parentService().controllingUnitToItemBoq
				) {
					if (parentService.parentService().controllingUnitChanged) {
						parentService.parentService().controllingUnitChanged.register(onControllingUnitChanged);
					}
					if (parentService.parentService().controllingUnitToItemBoq) {
						parentService.parentService().controllingUnitToItemBoq.register(updateCuFromParent);
					}
				}
				if ((currentModuleName === reqModule || currentModuleName === contractModule) && parentService.controllingUnitChanged && parentService.controllingUnitToItemBoq ) {
					if (parentService.controllingUnitChanged) {
						parentService.controllingUnitChanged.register(onControllingUnitChanged);
					}
					if (parentService.controllingUnitToItemBoq) {
						parentService.controllingUnitToItemBoq.register(updateCuFromParent);
					}
				}

				if (currentModuleName === contractModule && parentService.changeStructureSetTaxCodeToItemBoq ) {
					parentService.changeStructureSetTaxCodeToItemBoq.register(updateTXFromParent);
				}

				function loadList() {
					var list = service.getList();
					if (list && list.length) {
						service.load();
					}
				}

				if ((parentService.getModule().name === packageModule || parentService.getModule().name === quote) &&
					parentService.parentService().onRecalculationItemsAndBoQ
				) {
					parentService.parentService().onRecalculationItemsAndBoQ.register(loadList);
				} else {
					if (parentService.onRecalculationItemsAndBoQ) {
						parentService.onRecalculationItemsAndBoQ.register(loadList);
					}
				}

				service.reloadPriceCondition = function (entity, value) {
					if (service.validateService) {
						entity.IsInputTotal = false;
						return service.validateService.reloadPriceCondition(entity, value);
					}
				};

				var company = null;

				service.isGrossModeInContract = function () {
					var isGrossMode = prcGetIsCalculateOverGrossService.getIsCalculateOverGross();
					return isGrossMode && currentModuleName === contractModule;

				};

				service.validateQuoteItemNoFromReq = function (itemNo) {
					var result = true;
					var isProtected = getIsProtectedQtn();
					var isFreeItemsAllowed = getIsFreeItemsAllowed();
					if (!isProtected) {
						return result;
					}
					if (!isFreeItemsAllowed) {
						var reqItemNos = getRequisitionItemNos();
						if (_.indexOf(reqItemNos, itemNo) === -1) {
							result = false;
						}
					}
					return result;
				};
				service.findrelevantReqItemByNo = findrelevantReqItemByNo;
				service.setCopyPrcItemValue = setCopyPrcItemValue;

				service.getPrcConfigurationId = parentService.getPrcConfigurationId;
				service.calculateQuantityRemaining = calculateQuantityRemaining;
				service.getMaterialUomCache = getMaterialUomCache;
				return service;

				// /////////////////////////////
				function getParentSelectedQuoteStatus(parentService) {
					var selectedItem = parentService.getSelected();
					if (selectedItem && selectedItem.StatusFk) {
						var items = basicsLookupdataLookupDescriptorService.getData('QuoteStatus');
						if (items && items[selectedItem.StatusFk]) {
							return items[selectedItem.StatusFk];
						}
					}

					return null;
				}

				function addAdditionalProperties(item) {
					if(_.isNil(item.Co2SourceTotal) || item.Co2SourceTotal<=0) {
						item.Co2SourceTotal = math.bignumber(item.Co2Source).mul(item.Quantity).toNumber();
					}
					if(_.isNil(item.Co2ProjectTotal) || item.Co2ProjectTotal<=0) {
						item.Co2ProjectTotal = math.bignumber(item.Co2Project).mul(item.Quantity).toNumber();
					}
				}

				function calculateQuantityRemaining(quantityContracted, quantityDelivered) {
					if (quantityContracted !== null && quantityDelivered !== null) {
						return math.bignumber(quantityContracted).sub(quantityDelivered).toNumber();
					}
					return 0.0;
				}

				function getHeaderSelectedItem() {
					if (parentService.getModule().name === packageModule || currentModuleName === quote) {
						return parentService.parentService().getSelected();
					} else {
						return parentService.getSelected();
					}
				}

				function setRequisitionItems(prcItems) {
					reqPrcItems = prcItems;
				}

				function getRequisitionItemNos() {
					return _.map(reqPrcItems, function (prcItem) {
						return prcItem.Itemno;
					});
				}

				function getIsFreeItemsAllowed() {
					var isFreeItemAllowed = true;
					if (parentService.getModule().name === quote) {
						var leadingService = moduleContext.getLeadingService();
						isFreeItemAllowed = leadingService.getIsFreeItemsAllowed();
					}
					return isFreeItemAllowed;
				}

				function findrelevantReqItemByNo(itemNo) {
					var reqPrcItem;
					reqPrcItem = _.find(reqPrcItems, {Itemno: itemNo});
					return reqPrcItem;
				}

				/* function CopyReqPrcItemValue(targetPrcItem, originPrcItem) {
					var copyPrcItemValueParameter = {
						moduleName: parentService.getModule().name,
						targetPrcItem: targetPrcItem,
						originPrcItem: originPrcItem
					};
					// copy the prcItem in backend
					$http.post(globals.webApiBaseUrl + 'procurement/common/prcitem/copyprcitemvalue', copyPrcItemValueParameter).then(function (response) {
						var newitem = response.data;
						if (newitem) {
							setCopyPrcItemValue(newitem);
						}
					}, function (err) {
						window.console.error(err);
					});
				} */

				function setCopyPrcItemValue(reqItem, options) {
					if (!options) {
						options = {
							isRefresh: false,
							isValidateUom: false
						};
					}
					var itemNo = reqItem.Itemno;
					var nonCopyFilds = ['Id', 'InstanceId', 'PrcHeaderFk', 'PrcItemFk', 'Itemno', 'InsertedAt', 'InsertedBy', 'UpdatedAt', 'UpdatedBy', 'Version'];
					$q.when(reqItem).then(function (result) {
						var prcItem = _.find(service.getList(), function (item) {
							return item.Itemno === itemNo || item.Itemno === itemNo.toString();
						});
						if (prcItem) {
							for (var key in prcItem) {
								if (_.indexOf(nonCopyFilds, key) < 0) {
									prcItem[key] = result[key];
								}
							}
						}
						if (options.isRefresh) {
							service.gridRefresh();
						}
						if (options.isValidateUom) {
							var validation = procurementCommonPrcItemValidationService(service);
							validation.validateBasUomFk(prcItem, prcItem.BasUomFk, 'BasUomFk');
						}
					});
				}

				function getIsProtectedQtn() {
					var isProtect = false;
					if (parentService.getModule().name === quote) {
						var leadingService = moduleContext.getLeadingService();
						isProtect = leadingService.getIsProtected();
					}
					return isProtect;
				}

				function cacheMaterialUomsFromData(readData) {
					const items = readData.Main || [];
					items.forEach(item => {
						if (item.Id && item.Material2Uoms) {
							materialUomCache[item.Id] = item.Material2Uoms;
						}
					});
				}

				function getMaterialUomCache() {
					return materialUomCache;
				}
			}

			return procurementCommonDataServiceFactory.createService(constructor, 'procurementCommonPrcItemDataService');
		}
	]);
})(angular);
