/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

/* global globals */

(function () {
	'use strict';
	var moduleName = 'sales.contract';
	var salesContractModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name salesContractService
	 * @function
	 *
	 * @description
	 * salesContractService is the data service for contract (main entity) functionality.
	 */
	salesContractModule.factory('salesContractService', ['_', '$injector', '$http', '$q', 'platformContextService', 'platformDataServiceFactory', 'ServiceDataProcessDatesExtension', 'SalesCommonReadonlyProcessor', 'salesCommonReadonlyStatusProcessor', 'salesCommonBlobsHelperService', 'PlatformMessenger', 'SalesContractDocumentTypeProcessor', 'basicsLookupdataLookupFilterService', 'basicsCommonMandatoryProcessor', 'salesCommonBusinesspartnerSubsidiaryCustomerService', 'salesCommonProjectChangeStatusProcessor', 'sidebarDefaultOptions', 'platformPermissionService', 'permissions', 'platformRuntimeDataService', 'salesCommonExchangerateService', 'basicsLookupdataLookupDescriptorService', 'platformDataServiceConfiguredCreateExtension', 'platformDataServiceActionExtension', 'salesContractCreationInitialDialogService','salesCommonTypeDetectionService', 'cloudDesktopSidebarService',
		function (_, $injector, $http, $q, moduleContext, platformDataServiceFactory, ServiceDataProcessDatesExtension, SalesCommonReadonlyProcessor, salesCommonReadonlyStatusProcessor, salesCommonBlobsHelperService, PlatformMessenger, SalesContractDocumentTypeProcessor, basicsLookupdataLookupFilterService, basicsCommonMandatoryProcessor, salesCommonBusinesspartnerSubsidiaryCustomerService, salesCommonProjectChangeStatusProcessor, sidebarDefaultOptions, platformPermissionService, permissions, platformRuntimeDataService, salesCommonExchangerateService, basicsLookupdataLookupDescriptorService, platformDataServiceConfiguredCreateExtension, platformDataServiceActionExtension, salesContractCreationInitialDialogService,salesCommonTypeDetectionService, cloudDesktopSidebarService) {
			var isLoadByNavigation = false,
				naviOrdHeaderId = null,
				characteristicColumn = '',
				navInfo = {field: null, value: null},
				createParam,
				showRecalculationBoQ = false,
				ordCreationData = null;

			var containerGuid = '34d0a7ece4f34f2091f7ba6c622ff04d';
			var containerInformationService = $injector.get('salesContractContainerInformationService');

			var companyCategoryList = null;

			// The instance of the main service - to be filled with functionality below
			var salesOrdHeaderServiceOptions = {
				flatRootItem: {
					module: salesContractModule,
					serviceName: 'salesContractService',
					entityInformation: {module: 'Sales.Contract', entity: 'OrdHeader', specialTreatmentService: salesContractCreationInitialDialogService},
					entityNameTranslationID: 'sales.contract.containerTitleContracts',
					httpCreate: {route: globals.webApiBaseUrl + 'sales/contract/'},
					httpRead: {
						route: globals.webApiBaseUrl + 'sales/contract/', endRead: 'listfiltered',
						usePostForRead: true,
						extendSearchFilter: function extendSearchFilter(filterRequest) {
							if (isLoadByNavigation) {
								if (navInfo.field) {
									if (navInfo.field === 'BidHeaderFk') {
										filterRequest.furtherFilters = [{Token: 'ORD_HEADER_BIDHEADERFK', Value: navInfo.value}];
									}
								} else {
									filterRequest.furtherFilters = [{Token: 'ORD_HEADER_ID', Value: naviOrdHeaderId}];
								}
								isLoadByNavigation = false;
								navInfo = {field: null, value: null};
							}
						}
					},
					httpUpdate: {route: globals.webApiBaseUrl + 'sales/contract/'},
					httpDelete: {route: globals.webApiBaseUrl + 'sales/contract/'},
					entityRole: {
						root: {
							codeField: 'Code',
							descField: 'Description',
							itemName: 'OrdHeader',
							moduleName: 'cloud.desktop.moduleDisplayNameSalesContract',
							showProjectHeader: {
								getProject: function (entity) {
									if (entity && entity.ProjectFk) {
										return $injector.get('basicsLookupdataLookupDescriptorService').getLookupItem('Project', entity.ProjectFk);
									}
								}
							},
							handleUpdateDone: function (updateData, response, data) {
								showRecalculationBoQ = false;
								salesCommonBlobsHelperService.handleBlobsUpdateDone('OrdClobsToSave', updateData, response, data);
								$injector.get('salesContractHeaderFormattedTextDataService').load();
								$injector.get('salesContractHeaderTextDataService').load();

								let salesContractBoqStructureService = $injector.get('salesContractBoqStructureService');
								let _dynamicUserDefinedColumnService = salesContractBoqStructureService.getDynamicUserDefinedColumnsService();
								if (_dynamicUserDefinedColumnService && _.isFunction(_dynamicUserDefinedColumnService.update)) {
									_dynamicUserDefinedColumnService.update();
								}
								// framework contract call off restricted
								if (response && response.OrdHeader && response.OrdHeader.RestrictFrameworkContractCallOff) {
									var title = 'sales.contract.frameworkCallOffRestrictedHeader';
									var message = 'sales.contract.frameworkCallOffRestrictedMsg';
									$injector.get('platformModalService').showMsgBox(message, title, 'info');
								}
								service.onUpdateSucceeded.fire({updateData: updateData, response: response});
							}
						}
					},
					actions: {
						delete: {}, create: 'flat',
						canDeleteCallBackFunc: function (item) {
							var lookupService = $injector.get('salesContractStatusLookupDataService');
							var readonlyStatusItems = _.filter(lookupService.getListSync('salesContractStatusLookupDataService'), {IsReadOnly: true});
							// delete action disabled when item is in a read only status
							return !_.some(readonlyStatusItems, {Id: item.OrdStatusFk});
						}
					},
					translation: {
						uid: 'salesContractService',
						title: 'sales.contract.containerTitleContracts',
						columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
						dtoScheme: {
							typeName: 'OrdHeaderDto',
							moduleSubModule: 'Sales.Contract'
						}
					},
					entitySelection: {},
					dataProcessor: [
						salesCommonProjectChangeStatusProcessor,
						new ServiceDataProcessDatesExtension([
							'OrderDate', 'PlannedStart', 'PlannedEnd', 'DateEffective', 'WipFirst', 'WipFrom', 'WipUntil',
							'UserDefinedDate01', 'UserDefinedDate02', 'UserDefinedDate03', 'UserDefinedDate04', 'UserDefinedDate05'
						]),
						SalesContractDocumentTypeProcessor,
						new salesCommonReadonlyStatusProcessor({
							typeName: 'OrdHeaderDto',
							moduleSubModule: 'Sales.Contract',
							statusDataServiceName: 'salesContractStatusLookupDataService',
							uiStandardService: 'salesContractConfigurationService',
							statusField: 'OrdStatusFk'
						}),
						{  // No different BP / Debtor on change contract with reference to main contract
							processItem: function (item) {
								if (!platformRuntimeDataService.isReadonly(item)) {
									var isChangeOrder = (item.OrdHeaderFk !== null && item.PrjChangeFk !== null);
									platformRuntimeDataService.readonly(item, [
										{field: 'BusinesspartnerFk', readonly: isChangeOrder},
										{field: 'SubsidiaryFk', readonly: isChangeOrder},
										{field: 'CustomerFk', readonly: isChangeOrder}
									]);
								}
							}
						},
						{   // based on type => Main Contract and Project Change may not be changed after creation
							// both are already set in the create dialog
							processItem: function (item) {
								if (!platformRuntimeDataService.isReadonly(item)) {
									platformRuntimeDataService.readonly(item, [{ field: 'PrjChangeFk', readonly: true }]);
									platformRuntimeDataService.readonly(item, [{ field: 'OrdHeaderFk', readonly: true }]);
								}
							}
						},
						{  // populate 'Framework Contract' if related main contract is framework contract
							processItem: function (item) {
								// if frameworkContractCallOff then these fields will not editable
								var contractTypesService = salesCommonTypeDetectionService.contract;
								if (contractTypesService.isFrameworkContractCallOff(item)) {
									$injector.get('platformRuntimeDataService').readonly(item, [{ field: 'BusinesspartnerFk', readonly: true }, { field: 'CustomerFk', readonly: true }, { field: 'SubsidiaryFk', readonly: true }, { field: 'BoqWicCatFk', readonly: true }, { field: 'IsFreeItemsAllowed', readonly: true }]);
								}
								// if framework contract then these fields will not editable
								if (item.IsFramework === true) {
									item.FrameworkContractFk = null;
									$injector.get('platformRuntimeDataService').readonly(item, [{field: 'BusinesspartnerFk', readonly: true}, {field: 'CustomerFk', readonly: true}, {field: 'SubsidiaryFk', readonly: true}, {
										field: 'BoqWicCatBoqFk',
										readonly: true
									}, {field: 'BoqWicCatFk', readonly: true},{ field: 'IsFreeItemsAllowed', readonly: false }]);
								}
							}
						},
						new SalesCommonReadonlyProcessor()],
					presenter: {
						list: {
							handleCreateSucceeded: function (item) {
								$injector.get('salesContractBillingSchemaService').copyBillingSchemas(item, undefined, true);
								if (service.isConfigurableDialog()) {
									item.BoqWicCatBoqFk = ordCreationData.BoqWicCatBoqFk;
									item.OrderNoCustomer = ordCreationData.OrderNoCustomer;
									item.ProjectnoCustomer = ordCreationData.ProjectnoCustomer;
									item.ObjUnitFk = ordCreationData.ObjUnitFk;
									item.ControllingUnitFk = ordCreationData.ControllingUnitFk;
									item.PrcStructureFk = ordCreationData.PrcStructureFk;
									item.ContactFk = ordCreationData.ContactFk;
									item.BusinesspartnerBilltoFk = ordCreationData.BusinesspartnerBilltoFk;
									item.ContactBilltoFk = ordCreationData.ContactBilltoFk;
									item.SubsidiaryBilltoFk = ordCreationData.SubsidiaryBilltoFk;
									item.CustomerBilltoFk = ordCreationData.CustomerBilltoFk;
									item.PlannedStart = ordCreationData.PlannedStart;
									item.PlannedEnd = ordCreationData.PlannedEnd;
									item.Remark = ordCreationData.Remark;
									item.CommentText = ordCreationData.CommentText;
									item.PrcIncotermFk = ordCreationData.PrcIncotermFk;
									item.PaymentTermAdFk = ordCreationData.PaymentTermAdFk;
									item.BankFk = ordCreationData.BankFk;
									item.UserDefined1 = ordCreationData.UserDefined1;
									item.UserDefined2 = ordCreationData.UserDefined2;
									item.UserDefined3 = ordCreationData.UserDefined3;
									item.UserDefined4 = ordCreationData.UserDefined4;
									item.UserDefined5 = ordCreationData.UserDefined5;
									item.UserDefinedDate01 = ordCreationData.UserDefinedDate01;
									item.UserDefinedDate02 = ordCreationData.UserDefinedDate02;
									item.UserDefinedDate03 = ordCreationData.UserDefinedDate03;
									item.UserDefinedDate04 = ordCreationData.UserDefinedDate04;
									item.UserDefinedDate05 = ordCreationData.UserDefinedDate05;
								}
								var characterColumnService = $injector.get('basicsCharacteristicColumnServiceFactory').getService(service, 66, containerGuid.toUpperCase(), containerInformationService);
								characterColumnService.appendCharacteristicCols(item);
							},
							initCreationData: function initCreationData(creationData) {
								creationData.ProjectFk = moduleContext.loginProject;
								creationData.ConfigurationFk = createParam.ConfigurationFk;
								creationData.Code = createParam.Code;
								createParam = {};
							},
							incorporateDataRead: incorporateDataRead
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

			var serviceContainer = platformDataServiceFactory.createNewComplete(salesOrdHeaderServiceOptions),
				service = serviceContainer.service;

			// return company categories based on rubric category from company module (if available)
			service.getCompanyCategoryList = function getCompanyCategoryList() {

				var bidRubricId = service.getRubricId();
				companyCategoryList = $injector.get('salesCommonContextService').getCompanyCategoryListByRubric(bidRubricId);
				return companyCategoryList || [];
			};

			service.getRubricId = function getRubricId() {
				return $injector.get('salesCommonRubric').Contract;
			};

			// functionality for dynamic characteristic configuration
			serviceContainer.service.setCharacteristicColumn = function setCharacteristicColumn(colName) {
				characteristicColumn = colName;
			};
			serviceContainer.service.getCharacteristicColumn = function getCharacteristicColumn() {
				return characteristicColumn;
			};

			service.allHeaderData = [];

			function incorporateDataRead(readData, data) {
				basicsLookupdataLookupDescriptorService.attachData(readData || {});
				var itemList = data.handleReadSucceeded(readData, data);
				if (itemList.length > 0) {
					$injector.get('platformRuntimeDataService').readonly(service.getSelected(), [{field: 'BoqWicCatBoqFk', readonly: true}]);
				}
				var characterColumnService = $injector.get('basicsCharacteristicColumnServiceFactory').getService(service, 66, containerGuid.toUpperCase(), containerInformationService);
				characterColumnService.appendCharacteristicCols(readData.dtos);
				service.allHeaderData = readData.dtos;
				var dtos = readData.dtos;
				_.forEach(dtos, function (dto) {
					service.checkContractStatus(dto);
				});
				return itemList;
			}

			// validation processor for new entities
			serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'OrdHeaderDto',
				moduleSubModule: 'Sales.Contract',
				validationService: 'salesContractValidationService',
				mustValidateFields: ['TaxCodeFk', 'BusinesspartnerFk', 'SubsidiaryFk', 'CustomerFk']
			});

			// TODO: rename
			service.callHttpCreate = function callHttpCreate(creationData, optBoqPostData) {
				ordCreationData = creationData;
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

			// override create item (show "create a contract" dialog instead)
			service.createItem = function createContract() {
				var dialogService = $injector.get('salesCommonCreateDialogService');
				if (platformDataServiceConfiguredCreateExtension.hasToUseConfiguredCreate(serviceContainer.data)) {
					var conf = platformDataServiceConfiguredCreateExtension.getServiceConfiguredCreateSettings(serviceContainer.data);
					platformDataServiceConfiguredCreateExtension.createDialogConfigFromConf(serviceContainer.data, conf).then(function (configuredCreateLayout) {
						service.configuredCreateLayout = configuredCreateLayout;
						dialogService.showDialog();
					});
				} else {
					var oldDialogService = $injector.get('salesContractCreateContractDialogService');
					oldDialogService.initQuotedStatusList().then(function () {
						dialogService.showDialog();
					});
				}
				// TODO: not removed yet, old dialog
				// var dialogService = $injector.get('salesContractCreateContractDialogService');
				// dialogService.resetToDefault();
				// dialogService.showDialog(function (creationData) {
				// service.callHttpCreate(creationData);
				// });
			};

			// configured create function
			service.configuredCreate = function (creationData, optBoqPostData) {
				platformDataServiceActionExtension.createConfiguredItem(creationData, serviceContainer.data).then(function(contractEntity) {
					// boq take over data available?
					if (_.isObject(optBoqPostData) && !_.isEmpty(optBoqPostData)) {
						service.updateAndExecute(function () {
							$injector.get('salesCommonCopyBoqService').takeOverBoQs(optBoqPostData, contractEntity.Id);
						});

					}
				});
			};

			// check if configurable dialog is activated
			service.isConfigurableDialog = function () {
				return platformDataServiceConfiguredCreateExtension.hasToUseConfiguredCreate(serviceContainer.data);
			};

			var originalDeleteItem = service.deleteItem;

			// override delete item
			service.deleteItem = function deleteContract(contractEntity) {
				var postData = {
					mainItemId: contractEntity.Id,
					moduleIdentifer: 'sales.contract',
					projectId: contractEntity.ProjectFk,
					headerId: 0
				};
				return $http.get(globals.webApiBaseUrl + 'basics/common/dependent/gettotalcount?mainItemId=' + contractEntity.Id + '&moduleIdentifer=sales.contract' + '&projectId=' + contractEntity.ProjectFk + '&headerId=' + 0, contractEntity).then(function (response) {
					var countCannotDelete = response.data;

					if (countCannotDelete > 0) {
						var modalOptions = {headerTextKey: 'procurement.common.confirmDeleteTitle', bodyTextKey: 'procurement.common.confirmDeleteHeader', iconClass: 'ico-warning', width: '800px'};
						modalOptions.mainItemId = postData.mainItemId;
						modalOptions.headerId = postData.headerId;
						modalOptions.moduleIdentifer = postData.moduleIdentifer;
						modalOptions.prjectId = postData.projectId;
						return $injector.get('basicsCommonDependentService').showDependentDialog(modalOptions).then(result => {
							if (result && result.yes) {
								return originalDeleteItem(contractEntity);
							}
						});
					} else {
						return originalDeleteItem(contractEntity);
					}

					// old dialog
					/* var platformDeleteSelectionDialogService = $injector.get('platformDeleteSelectionDialogService');
					platformDeleteSelectionDialogService.showDialog().then(result => {
						if (result.yes) {
							return serviceContainer.data.deleteItem(contractEntity, serviceContainer.data);
						}
					}); */
				});
			};

			service.checkContractStatus = function (dto) {
				if (dto && dto.OrdStatusFk) {
					var contractStatus = $injector.get('salesContractStatusLookupDataService').getListSync({lookupType: 'salesContractStatusLookupDataService'}).find(x => x.Id === dto.OrdStatusFk);
					if (contractStatus.IsCanceled === true) {
						platformRuntimeDataService.readonly(dto, [{
							field: 'IsCanceled',
							readonly: true
						}]);
					}
				}
			};

			service.createDeepCopy = function createDeepCopy() {
				var selectedContract = service.getSelected();
				var message = $injector.get('$translate').instant('sales.contract.noContractHeaderSelected');
				if (!$injector.get('platformSidebarWizardCommonTasksService').assertSelection(selectedContract, 'sales.contract.contractSelectionMissing', message)) {
					return;
				}

				var salesContractCopyContractDialogService = $injector.get('salesContractCopyContractDialogService');
				salesContractCopyContractDialogService.showDeepCopyDialog(selectedContract).then(function (result) {
					if (result.success && _.isFunction(_.get(result, 'data.getCopyIdentifiers'))) {
						var copyOptions = {
							entityId: selectedContract.Id,
							creationData: _.get(result, 'data'),
							copyIdentifiers: result.data.getCopyIdentifiers()
						};

						$http.post(globals.webApiBaseUrl + 'sales/contract/deepcopy', copyOptions).then(
							function (response) {
								serviceContainer.data.handleOnCreateSucceeded(response.data.OrdHeader, serviceContainer.data);
							},
							function (/* error */) {
							});
					}
				});
			};

			salesCommonBusinesspartnerSubsidiaryCustomerService.registerFilters();

			function setOrdHeader(item, triggerField) {
				isLoadByNavigation = true;
				if (triggerField === 'OrdHeaderFk' && _.has(item, triggerField)) {
					item = {Id: _.get(item, triggerField)};
					naviOrdHeaderId = item.Id ? item.Id : null;
				} else if (triggerField === 'BidId') {
					navInfo.value = _.get(item, 'Id');
					navInfo.field = 'BidHeaderFk';
				} else if (triggerField === 'Ids' && typeof item.Ids === 'string') {
					const ids = item.Ids.split(',').map(e => parseInt(e));
					cloudDesktopSidebarService.filterSearchFromPKeys(ids);
				} else {
					naviOrdHeaderId = item.Id ? item.Id : null;
				}
				service.load().then(function (d) {
					item = _.find(d, {Id: item.Id});
					if (item) {
						service.setSelected(item);
					}
				});
			}

			service.setOrdHeader = setOrdHeader;

			// TODO: check if the same behaviour like reloadBillingSchemas
			service.recalculateBillingSchema = function recalculateBillingSchema() {
				$injector.get('salesContractBillingSchemaService').recalculateBillingSchema();
			};

			service.reloadBillingSchemas = function reloadBillingSchemas() {
				service.BillingSchemaFkChanged.fire();
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
								$http.get(globals.webApiBaseUrl + 'sales/contract/RecalculationBoQ?billingHeaderId=' + entity.Id + '&vatGroupFk=' + entity.VatGroupFk + '&defaultTaxCodeFk=' + entity.TaxCodeFk).then(function (res) {
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

			service.BillingSchemaFkChanged = new PlatformMessenger();
			service.onUpdateSucceeded = new PlatformMessenger();
			service.onUpdateAmounts = new PlatformMessenger();
			service.onRecalculationItemsAndBoQ = new PlatformMessenger();

			// pinning context (project, contract)
			function setContractToPinningContext(contractItem, dataService) {
				return $injector.get('salesCommonUtilsService').setRelatedProjectToPinningContext(contractItem, dataService);
			}

			function setCurrentPinningContext(dataService) {
				var currentContractItem = dataService.getSelected();
				if (currentContractItem && angular.isNumber(currentContractItem.ProjectFk)) {
					setContractToPinningContext(currentContractItem, dataService);
				}
			}

			salesCommonExchangerateService.extendByExchangeRateLogic(service);

			service.doPrepareUpdateCall = function doPrepareUpdateCall(updateData) {
				// if clobs/blobs are to delete, we need to prepare header entity
				// TODO: set all blobs/clobs properties to null

				// handling date issue of boq root item (see 135014, 135620) // TODO: check why UpdatedAt is not correct / to remove next lines
				_.each(_.get(updateData, 'OrdBoqCompositeToSave'), (compositeItem) => {
					if (_.has(compositeItem, 'BoqRootItem.UpdatedAt')) {
						delete compositeItem.BoqRootItem.UpdatedAt;
					}
				});

				if (updateData.OrdPaymentScheduleToSave && updateData.OrdPaymentScheduleToSave.length) {
					_.forEach(updateData.OrdPaymentScheduleToSave, function (ps) {
						if (ps.IsStructure && !ps.PaymentScheduleFk) {
							ps.PercentOfContract = ps.TotalPercent;
						}
					});
				}

			};

			function checkContractReference(contract, entity) {
				var contractItem = service.getItemById(contract.Id);
				// by default we use main service to get updated information
				// as fallback we take the lookup
				if (contractItem === null) {
					var lookup = $injector.get('salesCommonContractLookupDataService');
					contractItem = lookup.getItemById(contract.Id, {lookupType: 'salesCommonContractLookupDataService'});
				}
				// Assignment:
				// - only contracts allowed which do not reference other contracts
				// - also do not allow self reference
				return contract.Id === entity.Id ? false : contractItem.OrdHeaderFk === null;
			}

			var filters = [
				{
					key: 'sales-contract-contract-self-reference-exclude-filter',
					fn: function (contract, entity) {
						return checkContractReference(contract, entity);
					}
				},
				{
					key: 'sales-contract-contact-by-bizpartner-server-filter',
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
				var selectedContract = service.getSelected();
				selectedContract.AmountNet = amountNet;
				selectedContract.AmountNetOc = amountNetOc;
				selectedContract.AmountGross = amountGross;
				selectedContract.AmountGrossOc = amountGrossOc;

				// prevent from mark as modified if boq data is not modified
				// so we check the module state
				var state = $injector.get('platformModuleStateService').state(service.getModule());
				if (!_.isEmpty(_.get(state, 'modifications.BoqItemToSave')) ||
					!_.isEmpty(_.get(state, 'modifications.BoqItemToDelete')) ||
					!_.isEmpty(_.get(state, 'modifications.OrdBoqCompositeToDelete'))) {
					service.markItemAsModified(selectedContract);
				}
				service.onUpdateAmounts.fire();
			};

			service.checkItemIsReadOnly = function (item) {
				return $injector.get('salesCommonStatusHelperService').checkIsReadOnly('salesContractStatusLookupDataService', 'OrdStatusFk', item);
			};

			service.isReadStatusOnly = function (item) {
				if (!item) {
					item = service.getSelected();
				}
				if (!item) {
					return true;
				}
				// return _.get(service.getSelected(), 'IsReadonlyStatus');
				return service.checkItemIsReadOnly(item);
			};

			service.getModuleState = function (item) {
				var state, parentItem = item || service.getSelected();
				if (parentItem && parentItem.Id) {
					state = {IsReadonly: parentItem.IsReadonlyStatus};
				} else {
					state = {IsReadonly: true};
				}
				return state;
			};

			service.clearModifications = function () {
				var items = serviceContainer.data.itemList;
				angular.forEach(items, function (item) {
					serviceContainer.data.doClearModifications(item, serviceContainer.data);
				});
			};
			// TODO: Restricted "Source BoQ Container" in case of "framework call off contract" based on "New Items Allowed" flag
			service.maintainBoqMainLookupFilter = function maintainBoqMainLookupFilter(item) {
				let boqType = 1;
				let boqMainLookupFilterService = $injector.get('boqMainLookupFilterService');
				let boqHeaderId = null;
				let frameworkCallOffContract = null;
				if (!_.isNull(item)) {
					frameworkCallOffContract = !item.IsFramework && !_.isNil(item.BoqWicCatFk) && !_.isNil(item.BoqWicCatBoqFk);
				}
				if (frameworkCallOffContract && item.IsFreeItemsAllowed === false) {
					$http.get(globals.webApiBaseUrl + 'boq/wic/boq/list?wicGroupId=' + item.BoqWicCatFk).then(function (resultData) {
						let wicBoqHeaderId = resultData.data.filter(res => res.Id === item.BoqWicCatBoqFk)[0].BoqHeader.Id;
						let selectedWicGroupId2BoqHeaderIds = {};
						// restricted the BoQ Type in Case of New Items are not allowed in Framework Call Off Contract
						boqMainLookupFilterService.boqTypeReadonly.fire(true);
						if (boqMainLookupFilterService.boqHeaderLookupFilter.boqType !== boqType) {
							boqMainLookupFilterService.boqTypeChanged.fire(boqType);
						}
						// Filter the reference WIC_Group and BoQ From Framework Contract
						boqMainLookupFilterService.setSelectedWicGroupIds([item.BoqWicCatFk]);
						boqMainLookupFilterService.boqHeaderLookupFilter.boqGroupId = item.BoqWicCatFk;
						boqMainLookupFilterService.setSelectedWicGroup({Id: item.BoqWicCatFk});
						selectedWicGroupId2BoqHeaderIds[item.BoqWicCatFk] = [wicBoqHeaderId];
						boqMainLookupFilterService.setSelectedMainItemId2BoqHeaderIds(selectedWicGroupId2BoqHeaderIds);
					});
				}
				else {
					boqMainLookupFilterService.boqTypeReadonly.fire(false);
				}
			};
			service.registerSelectionChanged(function (e, item) {
				if (item) {
					$injector.get('salesCommonFunctionalRoleService').applyFunctionalRole(item);
					var containerGUIDs = [ // TODO: make more generic!
						'5bdd2357a22c45a18b9171f8b8782252', // PlainTextContainer
						'189729fbbfde4c2ab385324814d4a46e', // FormattedTextContainer
						'1f5fb2343b174db184b980d13161ab98', // CommentContainer
						'b66b7f483a5f443ea622b272d438a77c', // ContainerCharacteristic
						'b85fea01f0a4414594542caf845b3b95', // Generals
						'e303c8ae08b246348e6686882e17dfae', // Billing Schema
						'99ce1ede67e44133a760b20adcd4a9aa', // Production Planning
						'9fe62b05c136465a9b29bdb00ae4c6b8', // Production Planning Event
						'1428e0585b854403acabefe8acf7c2ee', // UserForm
						// 'ef3fc9fd941340a6bd61cda5683c2398', // Document (see #107271)
						'67f5acfb98264b0083ae6bc0459aef7c', // PriceCondition
						'382b89267ebe4aec801a257618a2d012'  // Translations
					];
					// TODO: reset to previous value!
					var permission = platformRuntimeDataService.isReadonly(item) ? permissions.read : false;
					// #see 106021 and 116385
					platformPermissionService.restrict(containerGUIDs, permission);
					service.maintainBoqMainLookupFilter(item);
					if (item.TypeFk) {
						var ordType = $injector.get('salesContractTypeLookupDataService').getItemById(item.TypeFk);
						if (ordType.IsChange) {
							// if contract is change contract than we enable PrjChange and Main contract lookup to be editable
							platformRuntimeDataService.readonly(item, [{ field: 'PrjChangeFk', readonly: false }]);
							platformRuntimeDataService.readonly(item, [{ field: 'OrdHeaderFk', readonly: false }]);
						}
						else if (ordType.IsSide) {
							// if contract is side contract than we disable PrjChange and Main contract lookup to be editable
							platformRuntimeDataService.readonly(item, [{ field: 'PrjChangeFk', readonly: true }]);
							platformRuntimeDataService.readonly(item, [{ field: 'OrdHeaderFk', readonly: false }]);
						}
						else {
							platformRuntimeDataService.readonly(item, [{ field: 'PrjChangeFk', readonly: true }]);
							platformRuntimeDataService.readonly(item, [{ field: 'OrdHeaderFk', readonly: true }]);
						}
					}
					else {
						if (item.OrdHeaderFk !== null && item.PrjChangeFk !== null) {
							// if contract is change contract than we enable PrjChange and Main contract lookup to be editable
							platformRuntimeDataService.readonly(item, [{ field: 'PrjChangeFk', readonly: false }]);
							platformRuntimeDataService.readonly(item, [{ field: 'OrdHeaderFk', readonly: false }]);
						} else if (item.OrdHeaderFk !== null && item.PrjChangeFk === null) {
							// if contract is side contract than we enable PrjChange and Main contract lookup to be editable
							platformRuntimeDataService.readonly(item, [{ field: 'PrjChangeFk', readonly: true }]);
							platformRuntimeDataService.readonly(item, [{ field: 'OrdHeaderFk', readonly: false }]);
						} else {
							platformRuntimeDataService.readonly(item, [{ field: 'PrjChangeFk', readonly: true }]);
							platformRuntimeDataService.readonly(item, [{ field: 'OrdHeaderFk', readonly: true }]);
						}
					}
				}
			});

			service.getDefaultListForCreatedPerSection = function getDefaultListForCreatedPerSection(newContract, sectionId) {
				return $injector.get('salesCommonUtilsService').getCharacteristicsDefaultListForCreatedPerSection(newContract, sectionId);
			};

			service.updateHeader = function updateHeader(contractHeader) {
				var data = serviceContainer.data;
				var dataEntity = data.getItemById(contractHeader.Id, data);
				data.mergeItemAfterSuccessfullUpdate(dataEntity, contractHeader, true, data);
			};

			service.name = moduleName;

			function isRecalculationBoQ(entity) {
				if (showRecalculationBoQ === true) {
					return;
				}
				showRecalculationBoQ = true;
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
							$http.get(globals.webApiBaseUrl + 'sales/contract/RecalculationBoQ?billingHeaderId=' + entity.Id + '&vatGroupFk=' + entity.VatGroupFk + '&defaultTaxCodeFk=' + entity.TaxCodeFk).then(function (res) {
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
					showRecalculationBoQ = false;
				});
			}

			service.isRecalculationBoQ = isRecalculationBoQ;

			serviceContainer.data.handleOnCreateSucceeded = function handleOnCreateSucceeded(newItem, data) {
				if (newItem === '') {
					var title = 'sales.contract.frameworkCallOffRestrictedHeader';
					var message = 'sales.contract.frameworkCallOffRestrictedMsg';
					$injector.get('platformModalService').showMsgBox(message, title, 'info');
				}
				return $injector.get('salesCommonUtilsService').handleOnCreateSucceededInListSetToTop(newItem, data, service);
			};

			service.changeSalesConfigOrType = function changeSalesConfigOrType(TypeFk,RubricCategoryFk,ConfigurationFk,OrdHeaderFk,PrjChangeFk,item) {
				if (TypeFk === 1) {
					if (RubricCategoryFk > 0 && ConfigurationFk > 0 && OrdHeaderFk === null && PrjChangeFk === null && _.isObject(item)) {
						item.TypeFk = TypeFk;
						item.RubricCategoryFk = RubricCategoryFk;
						item.ConfigurationFk = ConfigurationFk;
						item.OrdHeaderFk = OrdHeaderFk;
						item.PrjChangeFk = PrjChangeFk;
						_.each(service.getDataProcessor(), function (proc) {
							proc.processItem(item);
						});
						service.markItemAsModified(item);
					}
				}
				else if (TypeFk === 2) {
					if (RubricCategoryFk > 0 && ConfigurationFk > 0 && OrdHeaderFk > 0 && PrjChangeFk > 0 && _.isObject(item)) {
						item.TypeFk = TypeFk;
						item.RubricCategoryFk = RubricCategoryFk;
						item.ConfigurationFk = ConfigurationFk;
						item.OrdHeaderFk = OrdHeaderFk;
						item.PrjChangeFk = PrjChangeFk;
						_.each(service.getDataProcessor(), function (proc) {
							proc.processItem(item);
						});
						service.markItemAsModified(item);
					}
				}
				else if (TypeFk === 3) {
					if (RubricCategoryFk > 0 && ConfigurationFk > 0 && OrdHeaderFk > 0 && PrjChangeFk === null && _.isObject(item)) {
						item.TypeFk = TypeFk;
						item.RubricCategoryFk = RubricCategoryFk;
						item.ConfigurationFk = ConfigurationFk;
						item.OrdHeaderFk = OrdHeaderFk;
						item.PrjChangeFk = PrjChangeFk;
						_.each(service.getDataProcessor(), function (proc) {
							proc.processItem(item);
						});
						service.markItemAsModified(item);
					}
				}
			};
			return service;
		}]);
})();
