/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'sales.wip';
	var salesWipModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name salesWipService
	 * @function
	 *
	 * @description
	 * salesWipService is the data service for wip (main entity) functionality.
	 */
	salesWipModule.factory('salesWipService', ['globals', '_', '$q', '$injector', '$translate', 'platformDataServiceFactory', 'ServiceDataProcessDatesExtension', 'SalesCommonReadonlyProcessor', 'salesCommonReadonlyStatusProcessor', 'basicsCommonMandatoryProcessor',
		'$http', 'platformModalService', 'salesCommonBusinesspartnerSubsidiaryCustomerService', 'sidebarDefaultOptions', 'PlatformMessenger', 'platformPermissionService', 'permissions', 'platformRuntimeDataService', 'basicsLookupdataLookupFilterService', 'salesCommonExchangerateService', 'salesWipCreationInitialDialogService', 'platformDataServiceConfiguredCreateExtension', 'platformDataServiceActionExtension', 'cloudDesktopSidebarService',
		function (globals, _, $q, $injector, $translate, platformDataServiceFactory, ServiceDataProcessDatesExtension, SalesCommonReadonlyProcessor, salesCommonReadonlyStatusProcessor, basicsCommonMandatoryProcessor, $http, platformModalService, salesCommonBusinesspartnerSubsidiaryCustomerService, sidebarDefaultOptions, PlatformMessenger, platformPermissionService, permissions, platformRuntimeDataService, basicsLookupdataLookupFilterService, salesCommonExchangerateService, salesWipCreationInitialDialogService, platformDataServiceConfiguredCreateExtension, platformDataServiceActionExtension, cloudDesktopSidebarService) {

			var isLoadByNavigation = false,
				naviWipHeaderId = null,
				characteristicColumn = '',
				navInfo = {field: null, value: null},
				wipCreationData = null;

			var containerGuid = '689e0886de554af89aadd7e7c3b46f25';
			var containerInformationService = $injector.get('salesWipContainerInformationService');

			var companyCategoryList = null;
			var dataFromMainContract = null;
			// The instance of the main service - to be filled with functionality below
			var salesWipHeaderServiceOptions = {
				flatRootItem: {
					module: salesWipModule,
					serviceName: 'salesWipService',
					entityNameTranslationID: 'sales.wip.containerTitleWips',
					entityInformation: {module: 'Sales.Wip', entity: 'WipHeader', specialTreatmentService: salesWipCreationInitialDialogService},
					httpCreate: {route: globals.webApiBaseUrl + 'sales/wip/'},
					httpRead: {
						route: globals.webApiBaseUrl + 'sales/wip/', endRead: 'listfiltered',
						usePostForRead: true,
						extendSearchFilter: function extendSearchFilter(filterRequest) {
							if (isLoadByNavigation) {
								if (navInfo.field) {
									if (navInfo.field === 'OrdHeaderFk') {
										filterRequest.furtherFilters = [{Token: 'WIP_HEADER_ORDHEADERFK', Value: navInfo.value}];
									}
								} else {
									filterRequest.furtherFilters = [{Token: 'WIP_HEADER_ID', Value: naviWipHeaderId}];
								}
								isLoadByNavigation = false;
								navInfo = {field: null, value: null};
							}
						}
					},
					httpUpdate: {route: globals.webApiBaseUrl + 'sales/wip/'},
					httpDelete: {route: globals.webApiBaseUrl + 'sales/wip/'},
					entityRole: {
						root: {
							codeField: 'Code',
							descField: 'Description',
							itemName: 'WipHeader',
							moduleName: 'cloud.desktop.moduleDisplayNameWip',
							showProjectHeader: {
								getProject: function (entity) {
									if (entity && entity.ProjectFk) {
										return $injector.get('basicsLookupdataLookupDescriptorService').getLookupItem('Project', entity.ProjectFk);
									}
								}
							},
							handleUpdateDone: function (updateData, response, data) {
								data.handleOnUpdateSucceeded(updateData, response, data, true);
								$injector.get('salesWipHeaderFormattedTextDataService').load();
								$injector.get('salesWipHeaderTextDataService').load();
								service.onUpdateSucceeded.fire({updateData: updateData, response: response});

								// set the cost group
								if (response.BoqItemToSave && response.BoqItemToSave.length > 0) {
									var qtoDetailsToSave = _.map(response.BoqItemToSave, 'QtoDetailToSave');
									var isQtoDetailChange = false;
									_.each(qtoDetailsToSave, function (qtoDetailToSave) {
										_.each(qtoDetailToSave, function (item) {
											if (item.QtoDetail) {
												isQtoDetailChange = true;
												if (item.CostGroupToSave && item.CostGroupToSave.length > 0) {
													$injector.get('basicsCostGroupAssignmentService').attachCostGroupValueToEntity(
														[item.QtoDetail], item.CostGroupToSave, function identityGetter(entity) {
															return {
																Id: entity.MainItemId
															};
														},
														'QtoDetail2CostGroups'
													);
												}
											}
										});
									});

									let boqService = $injector.get('salesWipBoqStructureService');

									// set the boq split quantity
									if (isQtoDetailChange) {
										_.each(response.BoqItemToSave, function (boqItemToSave) {
											if (boqItemToSave.BoqSplitQuantityToSave && boqItemToSave.BoqSplitQuantityToSave.length > 0) {
												var items = _.map(boqItemToSave.BoqSplitQuantityToSave, 'BoqSplitQuantity');
												$injector.get('boqMainSplitQuantityServiceFactory').getService(boqService, 'sales.wip').synBoqSplitQuantity(items);
											}
										});
									}

									// set the estimate line item
									if (updateData.BoqItemToSave && updateData.BoqItemToSave.length > 0) {
										_.each(updateData.BoqItemToSave, function (boqItemToSave) {
											if (boqItemToSave.EstLineItemToSave && boqItemToSave.EstLineItemToSave.length > 0) {
												var items = boqItemToSave.EstLineItemToSave;
												var lineItemService = $injector.get('salesWipEstimateLineItemDataService');
												lineItemService.synLineItems(items);
											}
										});
									}

									// recalculate boqItem
									_.each(response.BoqItemToSave, function (boqItemToSave) {
										if (boqItemToSave.BoqItem) {
											boqService.initInstalledValues(boqItemToSave.BoqItem);
										}
									});

									let salesWipBoqStructureService = $injector.get('salesWipBoqStructureService');
									let _dynamicUserDefinedColumnService = salesWipBoqStructureService.getDynamicUserDefinedColumnsService();
									if (_dynamicUserDefinedColumnService && _.isFunction(_dynamicUserDefinedColumnService.update)) {
										_dynamicUserDefinedColumnService.update();
									}
								}
							}
						}
					},
					actions: {
						delete: {}, create: 'flat',
						canDeleteCallBackFunc: function (item) {
							var lookupService = $injector.get('salesWipStatusLookupDataService');
							var readonlyStatusItems = _.filter(lookupService.getListSync('salesWipStatusLookupDataService'), {IsReadOnly: true});
							// delete action disabled when item is in a read only status
							return !_.some(readonlyStatusItems, {Id: item.WipStatusFk});
						}
					},
					translation: {
						uid: 'salesWipService',
						title: 'sales.wip.containerTitleWips',
						columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
						dtoScheme: {
							typeName: 'WipHeaderDto',
							moduleSubModule: 'Sales.Wip'
						}
					},
					entitySelection: {},
					dataProcessor: [new ServiceDataProcessDatesExtension(['DocumentDate', 'PerformedFrom', 'PerformedTo', 'DateEffective']),
						new salesCommonReadonlyStatusProcessor({
							typeName: 'WipHeaderDto',
							moduleSubModule: 'Sales.Wip',
							statusDataServiceName: 'salesWipStatusLookupDataService',
							uiStandardService: 'salesWipConfigurationService',
							statusField: 'WipStatusFk'
						}),
						new SalesCommonReadonlyProcessor()],
					presenter: {
						list: {
							handleCreateSucceeded: function (item) {
								if (service.isConfigurableDialog()) {
									item.CurrencyFk = wipCreationData.CurrencyFk;
									item.ControllingUnitFk = wipCreationData.ControllingUnitFk;
									item.LanguageFk = wipCreationData.LanguageFk;
									item.ObjUnitFk = wipCreationData.ObjUnitFk;
									item.PaymentTermAdFk = wipCreationData.PaymentTermAdFk;
									item.PaymentTermFiFk = wipCreationData.PaymentTermFiFk;
									item.PaymentTermPaFk = wipCreationData.PaymentTermPaFk;
									item.PrcStructureFk = wipCreationData.PrcStructureFk;
									item.Remark = wipCreationData.Remark;
									item.CommentText = wipCreationData.CommentText;
									item.BusinesspartnerFk = wipCreationData.BusinesspartnerFk;
									item.CustomerFk = wipCreationData.CustomerFk;
									item.SubsidiaryFk = wipCreationData.SubsidiaryFk;
									item.ContactFk = wipCreationData.ContactFk;
									item.TaxCodeFk = wipCreationData.TaxCodeFk;
									item.UserDefined1 = wipCreationData.UserDefined1;
									item.UserDefined2 = wipCreationData.UserDefined2;
									item.UserDefined3 = wipCreationData.UserDefined3;
									item.UserDefined4 = wipCreationData.UserDefined4;
									item.UserDefined5 = wipCreationData.UserDefined5;
									item.UserDefinedDate01 = wipCreationData.UserDefinedDate01;
									item.UserDefinedDate02 = wipCreationData.UserDefinedDate02;
									item.UserDefinedDate03 = wipCreationData.UserDefinedDate03;
									item.UserDefinedDate04 = wipCreationData.UserDefinedDate04;
									item.UserDefinedDate05 = wipCreationData.UserDefinedDate05;
								}
								item.VatGroupFk= wipCreationData.VatGroupFk;
								$injector.get('salesWipBillingSchemaService').copyBillingSchemas(item);
								// defect:126111 start
								if (item.OrdHeaderFk !== '' && item.OrdHeaderFk !== null) {
									platformRuntimeDataService.readonly(item, [{
										field: 'BasSalesTaxMethodFk',
										readonly: true
									}]);
								}
								// defect:126111 end

								var characterColumnService = $injector.get('basicsCharacteristicColumnServiceFactory').getService(service, 67, containerGuid.toUpperCase(), containerInformationService);
								characterColumnService.appendCharacteristicCols(item);
							}, incorporateDataRead: function (readData, data) {
								var dtos = readData.dtos;
								_.forEach(dtos, function (dto) {
									checkOrdheaderFK(dto);
									checkContractRelationAndDiverseDebitorsAllowed(dto);
								});
								var result = serviceContainer.data.handleReadSucceeded(readData, data);

								var characterColumnService = $injector.get('basicsCharacteristicColumnServiceFactory').getService(service, 67, containerGuid.toUpperCase(), containerInformationService);
								characterColumnService.appendCharacteristicCols(readData.dtos);

								// check wip status for iscanceled flag
								_.forEach(dtos, function (dto) {
									service.checkWipStatus(dto);
								});

								return result;
							}
						}
					},
					sidebarSearch: {
						options: angular.extend(angular.copy(sidebarDefaultOptions), {
							moduleName: moduleName,
							enhancedSearchVersion: '2.0',
							pinningOptions: {
								isActive: true,
								showPinningContext: [{token: 'project.main', show: true}],
								setContextCallback: setCurrentPinningContext
							}
						})
					},
					sidebarWatchList: {active: true},
					filterByViewer: true
				}
			};

			// defect:126111 start
			function checkOrdheaderFK(dto) {
				if (dto.OrdHeaderFk !== '' && dto.OrdHeaderFk !== null) {
					platformRuntimeDataService.readonly(dto, [{
						field: 'BasSalesTaxMethodFk',
						readonly: true
					}]);
				}
			}

			// defect:126111 end

			function checkContractRelationAndDiverseDebitorsAllowed(dto) {
				var fields = [{field: 'BusinesspartnerFk', readonly: true}, {field: 'SubsidiaryFk', readonly: true}];
				if (dto.IsContractRelated && !dto.IsDiverseDebitorsAllowed) {
					platformRuntimeDataService.readonly(dto, fields);
					if (dto.CustomerFk && dto.CustomerFk > 0) {
						platformRuntimeDataService.readonly(dto, [{field: 'CustomerFk', readonly: true}]);
					}
				}
			}

			var serviceContainer = platformDataServiceFactory.createNewComplete(salesWipHeaderServiceOptions),
				service = serviceContainer.service;

			// return company categories based on rubric category from company module (if available)
			service.getCompanyCategoryList = function getCompanyCategoryList() {
				var wipRubricId = service.getRubricId();
				companyCategoryList = $injector.get('salesCommonContextService').getCompanyCategoryListByRubric(wipRubricId);
				return companyCategoryList || [];
			};

			service.getRubricId = function getRubricId() {
				return $injector.get('salesCommonRubric').Wip;
			};

			// functionality for dynamic characteristic configuration
			serviceContainer.service.setCharacteristicColumn = function setCharacteristicColumn(colName) {
				characteristicColumn = colName;
			};
			serviceContainer.service.getCharacteristicColumn = function getCharacteristicColumn() {
				return characteristicColumn;
			};

			serviceContainer.data.clearContentBase = serviceContainer.data.clearContent;
			serviceContainer.data.clearContent = function () {
				serviceContainer.data.clearContentBase(serviceContainer.data);
				var lineItemService = $injector.get('salesWipEstimateLineItemGcDataService');
				lineItemService.clearContentLI(true);
			};

			// validation processor for new entities
			serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'WipHeaderDto',
				moduleSubModule: 'Sales.Wip',
				validationService: 'salesWipValidationService',
				mustValidateFields: ['TaxCodeFk', 'BusinesspartnerFk', 'CustomerFk']
			});

			service.doPrepareUpdateCall = function doPrepareUpdateCall(updateData) {
				if (!_.isNil(updateData.WipHeader) && !_.isNil(dataFromMainContract.BusinesspartnerFk)) {
					updateData.WipHeader.BusinesspartnerFk = dataFromMainContract.BusinesspartnerFk;
				}
				// the cost group to save
				if (updateData.BoqItemToSave && updateData.BoqItemToSave.length > 0) {
					var qtoDetailsToSave = _.map(updateData.BoqItemToSave, 'QtoDetailToSave');
					_.each(qtoDetailsToSave, function (qtoDetailToSave) {
						_.each(qtoDetailToSave, function (item) {
							if (item.QtoDetail) {
								if (item.QtoDetail.CostGroupsToCopy && item.QtoDetail.IsCopy) {
									item.CostGroupToSave = item.QtoDetail.CostGroupsToCopy;
								}
							}
						});
					});
				}

				// Wip2BillToDelete
				if (updateData.Wip2BillToDelete && updateData.Wip2BillToDelete.length > 0) {
					var Wip2Bill = _.map(updateData.Wip2BillToDelete, function (item) {
						return {
							BilHeaderFk: item.Id,
							WipHeaderFk: service.getSelected().Id
						};
					});
					updateData.Wip2BillToDelete = Wip2Bill;
				}

				// handling date issue of boq root item (see 135014, 135620) // TODO: check why UpdatedAt is not correct / to remove next lines
				_.each(_.get(updateData, 'WipBoqCompositeToSave'), (compositeItem) => {
					if (_.has(compositeItem, 'BoqRootItem.UpdatedAt')) {
						delete compositeItem.BoqRootItem.UpdatedAt;
					}
				});
			};

			// override create item (show "create a wip" dialog instead)
			/* TODO: remove if new function is working fine.
			service.createItem = function createWip() {
				var dialogService = $injector.get('salesWipCreateWipDialogService');
				dialogService.resetToDefault();
				dialogService.showDialog(function (creationData) {
					serviceContainer.data.doCallHTTPCreate(creationData, serviceContainer.data, serviceContainer.data.onCreateSucceeded);
				}, false, [], ['performedFrom', 'performedTo']);
			};
			*/

			// TODO: rename
			service.callHttpCreate = function callHttpCreate(creationData, optBoqPostData) {
				wipCreationData = creationData;
				serviceContainer.data.doCallHTTPCreate(creationData, serviceContainer.data, serviceContainer.data.onCreateSucceeded).then(function (contractEntity) {

					// boq take over data available?
					if (_.isObject(optBoqPostData) && !_.isEmpty(optBoqPostData)) {
						service.updateAndExecute(function () {
							$injector.get('salesCommonCopyBoqService').takeOverBoQs(optBoqPostData, contractEntity.Id);
						});

					} else {
						// TODO: auto create boq option
					}
				});
			};

			// check if configurable dialog is activated
			service.isConfigurableDialog = function () {
				return platformDataServiceConfiguredCreateExtension.hasToUseConfiguredCreate(serviceContainer.data);
			};

			// TODO: 113962
			service.createItem = function createWip() {
				var dialogService = $injector.get('salesCommonCreateDialogService');
				if (service.isConfigurableDialog()) {
					var conf = platformDataServiceConfiguredCreateExtension.getServiceConfiguredCreateSettings(serviceContainer.data);
					platformDataServiceConfiguredCreateExtension.createDialogConfigFromConf(serviceContainer.data, conf).then(function (configuredCreateLayout) {
						service.configuredCreateLayout = configuredCreateLayout;
						dialogService.showDialog();
					});
				} else {
					dialogService.showDialog();
				}
			};
			// end 113962

			// configured create function
			service.configuredCreate = function (creationData, optBoqPostData) {
				platformDataServiceActionExtension.createConfiguredItem(creationData, serviceContainer.data).then(function(wipEntity) {
					// boq take over data available?
					if (_.isObject(optBoqPostData) && !_.isEmpty(optBoqPostData)) {
						service.updateAndExecute(function () {
							$injector.get('salesCommonCopyBoqService').takeOverBoQs(optBoqPostData, wipEntity.Id);
						});

					}
				});
			};

			service.createDeepCopy = function createDeepCopy() {
				var selectedWip = service.getSelected();
				var message = $injector.get('$translate').instant('sales.wip.noWipHeaderSelected');
				if (!$injector.get('platformSidebarWizardCommonTasksService').assertSelection(selectedWip, 'sales.wip.wipSelectionMissing', message)) {
					return;
				}
				var salesWipCopyWipDialogService = $injector.get('salesWipCopyWipDialogService');
				salesWipCopyWipDialogService.showDeepCopyDialog(selectedWip).then(function (result) {
					if (result.success && _.isFunction(_.get(result, 'data.getCopyIdentifiers'))) {
						var copyOptions = {
							entityId: selectedWip.Id,
							creationData: _.get(result, 'data'),
							copyIdentifiers: result.data.getCopyIdentifiers()
						};
						$http.post(globals.webApiBaseUrl + 'sales/wip/deepcopy', copyOptions).then(
							function (response) {
								serviceContainer.data.handleOnCreateSucceeded(response.data.WipHeader, serviceContainer.data);
							},
							function (/* error */) {
							});
					}
				});
			};

			salesCommonBusinesspartnerSubsidiaryCustomerService.registerFilters();

			// TODO: check if the same behaviour like reloadBillingSchemas
			service.recalculateBillingSchema = function recalculateBillingSchema() {
				$injector.get('salesWipBillingSchemaService').recalculateBillingSchema();
			};

			service.reloadBillingSchemas = function reloadBillingSchemas() {
				service.BillingSchemaFkChanged.fire();
			};

			service.BillingSchemaFkChanged = new PlatformMessenger();
			service.onUpdateSucceeded = new PlatformMessenger();
			service.onRecalculationItemsAndBoQ = new PlatformMessenger();

			service.isReadOnlyStatus = function (wipItem) {
				if (wipItem) {
					var statusItems = $injector.get('salesWipStatusLookupDataService').getListSync({lookupType: 'salesWipStatusLookupDataService'});
					var wipStatus = _.find(statusItems, {Id: wipItem.WipStatusFk});
					return _.get(wipStatus, 'IsReadOnly');
				}
			};

			service.isProtectedStatus = function (wipItem) {
				if (wipItem) {
					var statusItems = $injector.get('salesWipStatusLookupDataService').getListSync({lookupType: 'salesWipStatusLookupDataService'});
					var wipProtectedStatus = _.find(statusItems, {Id: wipItem.WipStatusFk});
					return _.get(wipProtectedStatus, 'IsProtected');
				}
			};

			service.cellChange = function (entity, field) {
				if (field === 'VatGroupFk' || field === 'TaxCodeFk') {
					var myDialogOptions = {
						headerTextKey: 'sales.common.Warning',
						bodyTextKey: 'sales.common.changeBpdVatGroupFk',
						showYesButton: true,
						showNoButton: true,
						iconClass: 'ico-question'
					};

					var platformModalService = $injector.get('platformModalService');
					platformModalService.showDialog(myDialogOptions).then(function (result) {
						if (result.yes) {
							service.markItemAsModified(entity);
							service.update().then(function () {
								var selected = service.getSelected();
								$http.get(globals.webApiBaseUrl + 'sales/wip/RecalculationBoQ?billingHeaderId=' + entity.Id + '&vatGroupFk=' + entity.VatGroupFk + '&defaultTaxCodeFk=' + entity.TaxCodeFk).then(function (res) {
									if (res.data) {
										var list = service.getList();
										var currentItemIndex = _.findIndex(list, {Id: res.data.Id});
										if ((currentItemIndex || currentItemIndex === 0) && currentItemIndex > -1) {
											list.splice(currentItemIndex, 1, res.data);
											serviceContainer.data.itemList = list;
											serviceContainer.data.selectedItem = null;
											service.gridRefresh();
											service.setSelected(res.data);
											service.onUpdateSucceeded.fire({
												updateData: {
													EntitiesCount: 1,
													MainItemId: res.data.Id,
													BidHeader: selected
												},
												response: res.data
											});
										}
									}
									service.onRecalculationItemsAndBoQ.fire();
								});
							});
						}
					});

				}

			};

			function setWipHeader(item, triggerField) {
				isLoadByNavigation = true;
				if (triggerField === 'ContractId') {
					navInfo.value = _.get(item, 'Id');
					navInfo.field = 'OrdHeaderFk';
				} else if (triggerField === 'OrdHeaderFk' && _.has(item, triggerField)) {
					navInfo.value = _.get(item, triggerField);
					if (navInfo.value === null) {
						navInfo.value = -1;
					}
					navInfo.field = 'OrdHeaderFk';
				}
				else if (triggerField === 'Ids' && typeof item.Ids === 'string') {
					const ids = item.Ids.split(',').map(e => parseInt(e));
					cloudDesktopSidebarService.filterSearchFromPKeys(ids);
				}
				// TODO: check where (last) else block is used and merge with this one
				else if (triggerField === 'WipHeaderFk' && _.has(item, triggerField)) {
					var wipHeaderFk = _.get(item, triggerField);
					naviWipHeaderId = _.isInteger(wipHeaderFk) ? wipHeaderFk : null;
				} else {
					naviWipHeaderId = item.Id ? item.Id : null;
				}
				service.load().then(function (d) {
					item = _.find(d, {Id: item.Id});
					if (item) {
						service.setSelected(item);
					}
				});
			}

			service.setWipHeader = setWipHeader;

			// pinning context (project, wip)
			function setWipToPinningContext(wipItem) {
				return $injector.get('salesCommonUtilsService').setRelatedProjectToPinningContext(wipItem);
			}

			function setCurrentPinningContext(dataService) {
				var currentWipItem = dataService.getSelected();
				if (currentWipItem && angular.isNumber(currentWipItem.ProjectFk)) {
					setWipToPinningContext(currentWipItem);
				}
			}

			salesCommonExchangerateService.extendByExchangeRateLogic(service);

			// TODO: assignContract can be removed, lookup contract is readonly field now.
			service.assignContract = function assignContract(arg) {
				if (arg && arg.cell && arg.grid) {
					var col = arg.grid.getColumns()[arg.cell].field;
					if (col === 'OrdHeaderFk') { // contract
						var curWipItem = arg.item,
							selContractId = curWipItem.OrdHeaderFk;

						// get full contract item from lookup data service
						var contract = $injector.get('salesCommonContractLookupDataService').getItemById(selContractId);

						if (contract) {
							// take over some values from contract to current wip
							curWipItem.BusinesspartnerFk = contract.BusinesspartnerFk;
							curWipItem.ClerkFk = contract.ClerkFk;
							// curWipItem.Code = contract.Code; // TODO: generate new wip code here
							curWipItem.CommentText = contract.CommentText;
							curWipItem.CompanyFk = contract.CompanyFk;
							curWipItem.CompanyResponsibleFk = contract.CompanyResponsibleFk;
							curWipItem.CustomerFk = contract.CustomerFk;
							angular.extend(curWipItem.DescriptionInfo, {
								Translated: _.get(contract, 'DescriptionInfo.Description') || '',
								Modified: true
							});
							curWipItem.ExchangeRate = contract.ExchangeRate;
							curWipItem.LanguageFk = contract.LanguageFk;
							curWipItem.Remark = contract.Remark;
							// curWipItem.RubricCategoryFk = contract.RubricCategoryFk;
							curWipItem.SubsidiaryFk = contract.SubsidiaryFk;
							curWipItem.UserDefined1 = contract.UserDefined1;
							curWipItem.UserDefined2 = contract.UserDefined2;
							curWipItem.UserDefined3 = contract.UserDefined3;
							curWipItem.UserDefined4 = contract.UserDefined4;
							curWipItem.UserDefined5 = contract.UserDefined5;

							service.fireItemModified(curWipItem);
						}
						// else {
						// TODO: show error message or do error handling
						// }
					}
				}
			};

			var originalDeleteItem = service.deleteItem;

			// override delete item
			service.deleteItem = function deleteWip(wipEntity) {
				var postData = {
					mainItemId: wipEntity.Id,
					moduleIdentifer: 'sales.wip',
					projectId: wipEntity.ProjectFk,
					headerId: 0
				};
				return $http.get(globals.webApiBaseUrl + 'basics/common/dependent/gettotalcount?mainItemId=' + wipEntity.Id + '&moduleIdentifer=sales.wip' + '&projectId=' + wipEntity.ProjectFk + '&headerId=' + 0, wipEntity).then(function (response) {
					var countCannotDelete = response.data;

					if (countCannotDelete > 0) {
						var modalOptions = {headerTextKey: 'procurement.common.confirmDeleteTitle', bodyTextKey: 'procurement.common.confirmDeleteHeader', iconClass: 'ico-warning', width: '800px'};
						modalOptions.mainItemId = postData.mainItemId;
						modalOptions.headerId = postData.headerId;
						modalOptions.moduleIdentifer = postData.moduleIdentifer;
						modalOptions.prjectId = postData.projectId;
						return $injector.get('basicsCommonDependentService').showDependentDialog(modalOptions).then(result => {
							if (result && result.yes) {
								return originalDeleteItem(wipEntity);
							}
						});
					} else {
						return originalDeleteItem(wipEntity);
					}
				});

				// old dialog
				/* var platformDeleteSelectionDialogService = $injector.get('platformDeleteSelectionDialogService');
				platformDeleteSelectionDialogService.showDialog().then(result => {
					if (result.yes) {
						return deleteEntities(wipEntity, serviceContainer.data);
					}
				}); */
			};

			/* function deleteEntities(item, data) {
				if (item) {
					item = _.clone(item);
					var responseData = [];
					return $http.post(globals.webApiBaseUrl + 'sales/wip/candelete?wipId=' + item.Id).then(function (response) {
						responseData = response.data;
						if (responseData === 4) {
							return platformModalService.showYesNoDialog($translate.instant('sales.wip.dialog.mixedRecordsAssigned'), $translate.instant('sales.wip.WarningOfDeleteWip'), 'no');
						} else if (responseData === 3) {
							return platformModalService.showErrorBox('sales.wip.dialog.allWIPAssignedMessage', 'cloud.common.errorMessage');
						} else if (responseData === 2) {
							return platformModalService.showYesNoDialog($translate.instant('sales.wip.dialog.allWIPAssignedMessage2'), $translate.instant('sales.wip.WarningOfDeleteWip'), 'no');
						} else if (responseData === 1) {
							return platformModalService.showYesNoDialog($translate.instant('sales.wip.dialog.quantitiesAssignedMessage'), $translate.instant('sales.wip.WarningOfDeleteWip'), 'no');
						} else {
							// TODO: can be removed? return platformModalService.showYesNoDialog($translate.instant('sales.wip.WarningOfDeleteWip'), $translate.instant('sales.wip.WarningOfDeleteWip'), 'no');
							return $injector.get('platformDeleteSelectionDialogService').showDialog();
						}

					}).then(function (result) {
						if (result && result.yes) {
							serviceContainer.data.deleteItem(item, data);
						}
					});
				}
			} */

			// TODO: see #100317
			service.getVatPercent = function getVatPercent(wip) {
				var contractId = _.get(wip, 'OrdHeaderFk');
				if (contractId > 0) {
					return $http.get(globals.webApiBaseUrl + 'sales/contract/byid?id=' + contractId).then(function (response) {
						var contract = response.data;
						var taxCodeId = _.get(contract, 'TaxCodeFk');
						var taxCodes = $injector.get('basicsLookupdataLookupDescriptorService').getData('TaxCode');
						var taxCode = _.find(taxCodes, {Id: taxCodeId}) || null;
						return taxCode ? taxCode.VatPercent || taxCode.Vatpercent : 0;
					});
				}
				return $q.when(0);
			};

			service.checkItemIsReadOnly = function (item) {
				return $injector.get('salesCommonStatusHelperService').checkIsReadOnly('salesWipStatusLookupDataService', 'WipStatusFk', item);
			};
		
			service.registerSelectionChanged(function (e, item) {
				if (item) {
					$injector.get('salesCommonFunctionalRoleService').handleFunctionalRole(item.OrdHeaderFk);

					var containerGUIDs = [ // TODO: make more generic!
						'173343c2fdf04186b32bb4b9526aff4f', // PlainTextContainer
						'6f184332b0b2496f8d6ab3201e8e1bde', // FormattedTextContainer
						'79db0ff7fcda4e0c944fcde734878044', // Characteristic
						'c8faaacfa60c4790845e06aafd370ec5', // Billing Schema
						'da8b5f2c30ae4e6dafffdb3db1e17699'  // UserForm
						// 'e741d2316c0245e1973a305b3f1c938b'// Document (see #107271)
					];
					// TODO: reset to previous value!
					var permission = platformRuntimeDataService.isReadonly(item) ? permissions.read : false;
					// #see 106021 and 116385
					platformPermissionService.restrict(containerGUIDs, permission);
				}
			});

			service.getDefaultListForCreatedPerSection = function getDefaultListForCreatedPerSection(newWip, sectionId) {
				return $injector.get('salesCommonUtilsService').getCharacteristicsDefaultListForCreatedPerSection(newWip, sectionId);
			};

			var filters = [
				{
					key: 'sales-wip-contact-by-bizpartner-server-filter',
					serverSide: true,
					serverKey: 'business-partner-contact-filter-by-simple-business-partner',
					fn: function (entity) {
						return {
							BusinessPartnerFk: entity.BusinesspartnerFk
						};
					}
				}
			];
			basicsLookupdataLookupFilterService.registerFilter(filters);

			service.updateAmounts = function (amountNet, amountNetOc, amountGross, amountGrossOc) {
				var selectedWip = service.getSelected();
				selectedWip.AmountNet = amountNet;
				selectedWip.AmountNetOc = amountNetOc;
				selectedWip.AmountGross = amountGross;
				selectedWip.AmountGrossOc = amountGrossOc;
				selectedWip.WipVat = amountGross - amountNet;
				selectedWip.WipVatOc = amountGrossOc - amountNetOc;

				// prevent from mark as modified if boq data is not modified
				// so we check the module state
				var state = $injector.get('platformModuleStateService').state(service.getModule());
				if (!_.isEmpty(_.get(state, 'modifications.BoqItemToSave')) ||
					!_.isEmpty(_.get(state, 'modifications.BoqItemToDelete')) ||
					!_.isEmpty(_.get(state, 'modifications.WipBoqCompositeToDelete'))) {
					service.markItemAsModified(selectedWip);
				}
			};

			service.updateHeader = function updateHeader(wipHeader) {
				var data = serviceContainer.data;
				var dataEntity = data.getItemById(wipHeader.Id, data);
				data.mergeItemAfterSuccessfullUpdate(dataEntity, wipHeader, true, data);
			};

			serviceContainer.data.handleOnCreateSucceeded = function handleOnCreateSucceeded(newItem, data) {
				return $injector.get('salesCommonUtilsService').handleOnCreateSucceededInListSetToTop(newItem, data, service);
			};

			service.getSelectedProjectId = function getSelectedProjectId() {
				var currentWip = service.getSelected();
				return currentWip.ProjectFk;
			};

			service.checkWipStatus = function checkWipStatus(dto) {
				if (dto && dto.WipStatusFk) {
					var contractStatus = $injector.get('salesWipStatusLookupDataService').getListSync({lookupType: 'salesWipStatusLookupDataService'}).find(x => x.Id === dto.WipStatusFk);
					if (contractStatus.IsCanceled === true) {
						platformRuntimeDataService.readonly(dto, [{
							field: 'IsCanceled',
							readonly: true
						}]);
					}
				}
			};

			service.updateDirectCostPerUnit = function updateDirectCostPerUnit(wipHeaderId) {
				service.updateAndExecute(function () {
					wipHeaderId = wipHeaderId || _.get(service.getSelected(), 'Id');
					if (wipHeaderId > 0) {
						$http.post(globals.webApiBaseUrl + 'sales/wip/updatedirectcostsperunit', wipHeaderId)
							.then(function (response) {
								if (!_.has(response.data, 'errorCode')) {
									var updatedWipHeader = _.get(response, 'data.wipHeader');
									service.updateHeader(updatedWipHeader);
									$injector.get('salesWipBoqStructureService').refreshBoqData();
									$injector.get('platformDialogService').showInfoBox('sales.billing.updateDirectCostPerUnitSuccessMessage'); // TODO: reuse? move to common? separate?
								} else {
									if (_.get(response, 'data.errorCode') === 'noBoqs') {
										$injector.get('platformDialogService').showInfoBox('Selected WIP does not contain any boq.');   // TODO: translation
									}
								}
							});
					}
				});
			};
			service.createWipViaCommonDialog = function createWipViaCommonDialog(creationData) { // TODO: need to check wheater we can use this function name or not
				if (!service.isConfigurableDialog()){
					creationData._contracts = $injector.get('salesWipCreateWipDialogService').getCopyOfInitDataItem().gridContracts;
				}
				var contracts = creationData._contracts;
				dataFromMainContract = _.isArray(contracts) ? _.find(contracts, { OrdHeaderFk: null }) || null : null;
				var markedContracts = _.filter(contracts, { 'IsMarked': true });
				// get main contract
				var mainContract = _.isArray(contracts) ? _.find(contracts, { OrdHeaderFk: null }) || null : null;
				if (mainContract) {
					var isMainContractMarked = !_.isUndefined(_.find(markedContracts, { Id: mainContract.Id }));
					// exclude main contract from side order array
					_.remove(markedContracts, { 'Id': mainContract.Id });

					var postData = {
						rubricCategoryId: creationData.RubricCategoryFk,
						PrevWipHeaderId: creationData.PrevWipHeaderFk,
						ConfigurationId: creationData.ConfigurationId,
						description: creationData.Description,
						isCollectiveWip: false, // TODO:
						contractId: mainContract.Id,
						sideContractIds: _.map(markedContracts, 'Id'),
						includeMainContract: isMainContractMarked,
						contractIds: null
					};

					$http.post(globals.webApiBaseUrl + 'sales/wip/createwipfromcontracts', postData)
						.then(function (response) {
							var newWip = response.data;
							newWip.BusinesspartnerFk = creationData.BusinesspartnerFk;
							newWip.ControllingUnitFk = creationData.ControllingUnitFk;
							newWip.SubsidiaryFk = creationData.SubsidiaryFk;
							newWip.CustomerFk = creationData.CustomerFk;
							newWip.ClerkFk = creationData.ClerkFk;
							newWip.CommentText = creationData.CommentText;
							newWip.ConfigurationId = creationData.ConfigurationId;
							newWip.ContactFk = creationData.ContactFk;
							newWip.ContractTypeFk = creationData.ContractTypeFk;
							newWip.CurrencyFk = creationData.CurrencyFk;
							newWip.LanguageFk = creationData.LanguageFk;
							newWip.ObjUnitFk = creationData.ObjUnitFk;
							newWip.OrdHeaderFk = creationData.OrdHeaderFk;
							newWip.PaymentTermAdFk = creationData.PaymentTermAdFk;
							newWip.PaymentTermFiFk = creationData.PaymentTermFiFk;
							newWip.PaymentTermPaFk = creationData.PaymentTermPaFk;
							newWip.PerformedFrom = creationData.PerformedFrom;
							newWip.PerformedTo = creationData.PerformedTo;
							newWip.PrcStructureFk = creationData.PrcStructureFk;
							newWip.PrevWipHeaderFk = creationData.PrevWipHeaderFk;
							newWip.ProjectFk = creationData.ProjectFk;
							newWip.Remark = creationData.Remark;
							newWip.TaxCodeFk = creationData.TaxCodeFk;
							newWip.UpdateWith = creationData.UpdateWith;
							newWip.UserDefined1 = creationData.UserDefined1;
							newWip.UserDefined2 = creationData.UserDefined2;
							newWip.UserDefined3 = creationData.UserDefined3;
							newWip.UserDefined4 = creationData.UserDefined4;
							newWip.UserDefined5 = creationData.UserDefined5;
							newWip.UserDefinedDate01 = creationData.UserDefinedDate01;
							newWip.UserDefinedDate02 = creationData.UserDefinedDate02;
							newWip.UserDefinedDate03 = creationData.UserDefinedDate03;
							newWip.UserDefinedDate04 = creationData.UserDefinedDate04;
							newWip.UserDefinedDate05 = creationData.UserDefinedDate05;
							serviceContainer.data.handleOnCreateSucceeded(newWip, serviceContainer.data);
							service.markItemAsModified(newWip);
							// TODO: disable loading indicator
						},
						function (/* error */) {
							// TODO: disable loading indicator
						});
				} else {
					// TODO:
				}
			};

			service.changeSalesConfigOrType = function changeSalesConfigOrType(TypeFk,RubricCategoryFk,ConfigurationFk,OrdHeaderFk,PrjChangeFk,item) {
				if (RubricCategoryFk > 0 && ConfigurationFk > 0 && _.isObject(item)) {
					item.RubricCategoryFk = RubricCategoryFk;
					item.ConfigurationFk = ConfigurationFk;
					_.each(service.getDataProcessor(), function (proc) {
						proc.processItem(item);
					});
					service.markItemAsModified(item);
				}
			};
			return service;
		}]);
})();
