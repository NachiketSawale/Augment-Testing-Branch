/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'sales.bid';
	var salesBidModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name salesBidService
	 * @function
	 *
	 * @description
	 * salesBidService is the data service for bid (main entity) functionality.
	 */
	salesBidModule.factory('salesBidService', ['globals', '_', '$q', '$http', '$injector', 'platformDataServiceFactory', 'ServiceDataProcessDatesExtension', 'SalesCommonReadonlyProcessor', 'salesCommonReadonlyStatusProcessor', 'salesCommonBlobsHelperService', 'salesCommonBusinesspartnerSubsidiaryCustomerService', 'PlatformMessenger', 'basicsCommonMandatoryProcessor', 'salesCommonProjectChangeStatusProcessor', 'sidebarDefaultOptions', 'platformPermissionService', 'permissions', 'platformRuntimeDataService', 'basicsLookupdataLookupFilterService', 'salesCommonExchangerateService', 'SalesBidDocumentTypeProcessor', 'platformDataServiceConfiguredCreateExtension', 'platformDataServiceActionExtension', 'salesBidCreationInitialDialogService',
		'cloudDesktopSidebarService',
		function (globals, _, $q, $http, $injector, platformDataServiceFactory, ServiceDataProcessDatesExtension, SalesCommonReadonlyProcessor, salesCommonReadonlyStatusProcessor, salesCommonBlobsHelperService, salesCommonBusinesspartnerSubsidiaryCustomerService, PlatformMessenger, basicsCommonMandatoryProcessor, salesCommonProjectChangeStatusProcessor, sidebarDefaultOptions, platformPermissionService, permissions, platformRuntimeDataService, basicsLookupdataLookupFilterService, salesCommonExchangerateService, SalesBidDocumentTypeProcessor, platformDataServiceConfiguredCreateExtension, platformDataServiceActionExtension, salesBidCreationInitialDialogService,
			cloudDesktopSidebarService) {
			var isLoadByNavigation = false,
				naviBidHeaderId = null, characteristicColumn = '',
				bidCreationData = null;

			var containerGuid = '7001204d7fb04cf48d8771c8971cc1e5';
			var containerInformationService = $injector.get('salesBidContainerInformationService');

			var companyCategoryList = null;

			function updateContractProbability(entity) {
				var userId = entity.OrdPrbltyWhoupd;
				var lastValDate = entity.OrdPrbltyLastvalDate;
				if (lastValDate) {
					var moment = $injector.get('moment');
					var platformUserInfoService = $injector.get('platformUserInfoService');
					platformUserInfoService.loadUsers([userId])
						.then(function () {
							entity.OrdPrbltyLastvalDateAndWhoupd = moment(lastValDate._i).format('L | LTS ') + ' (' + platformUserInfoService.logonName(userId) + ')'; // TODO: check _i
						});
				}
			}

			// The instance of the main service - to be filled with functionality below
			var salesBidHeaderServiceOptions = {
				flatRootItem: {
					module: salesBidModule,
					serviceName: 'salesBidService',
					entityInformation: {module: 'Sales.Bid', entity: 'BidHeader', specialTreatmentService: salesBidCreationInitialDialogService},
					entityNameTranslationID: 'sales.bid.containerTitleBids',
					httpCreate: {route: globals.webApiBaseUrl + 'sales/bid/'},
					httpRead: {
						route: globals.webApiBaseUrl + 'sales/bid/', endRead: 'listfiltered',
						usePostForRead: true,
						extendSearchFilter: function extendSearchFilter(filterRequest) {
							if (isLoadByNavigation) {
								filterRequest.furtherFilters = [{Token: 'BID_HEADER_ID', Value: naviBidHeaderId}];
								isLoadByNavigation = false;
							}

						}
					},
					httpUpdate: {route: globals.webApiBaseUrl + 'sales/bid/'},
					httpDelete: {route: globals.webApiBaseUrl + 'sales/bid/'},
					entityRole: {
						root: {
							codeField: 'Code',
							descField: 'Description',
							itemName: 'BidHeader',
							moduleName: 'cloud.desktop.moduleDisplayNameBid',
							showProjectHeader: {
								getProject: function (entity) {
									if (entity && entity.ProjectFk) {
										return $injector.get('basicsLookupdataLookupDescriptorService').getLookupItem('Project', entity.ProjectFk);
									}
								}
							},
							handleUpdateDone: function (updateData, response, data) {
								salesCommonBlobsHelperService.handleBlobsUpdateDone('BidClobsToSave', updateData, response, data);
								$injector.get('salesBidHeaderFormattedTextDataService').load();
								$injector.get('salesBidHeaderTextDataService').load();

								var salesBidBoqStructureService = $injector.get('salesBidBoqStructureService');
								let _dynamicUserDefinedColumnService = salesBidBoqStructureService.getDynamicUserDefinedColumnsService();
								if (_dynamicUserDefinedColumnService && _.isFunction(_dynamicUserDefinedColumnService.update)) {
									_dynamicUserDefinedColumnService.update();
								}

								service.onUpdateSucceeded.fire({updateData: updateData, response: response});
							}
						}
					},
					actions: {
						delete: {}, create: 'flat',
						canDeleteCallBackFunc: function (item) {
							var lookupService = $injector.get('salesBidStatusLookupDataService');
							var readonlyStatusItems = _.filter(lookupService.getListSync('salesBidStatusLookupDataService'), {IsReadOnly: true});
							// delete action disabled when item is in a read only status
							return !_.some(readonlyStatusItems, {Id: item.BidStatusFk});
						}
					},
					translation: {
						uid: 'salesBidService',
						title: 'sales.bid.containerTitleBids',
						columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
						dtoScheme: {
							typeName: 'BidHeaderDto',
							moduleSubModule: 'Sales.Bid'
						}
					},
					entitySelection: {},
					dataProcessor: [
						salesCommonProjectChangeStatusProcessor,
						new ServiceDataProcessDatesExtension([
							'QuoteDate', 'PlannedStart', 'PlannedEnd', 'PriceFixingDate', 'DateEffective',
							'UserDefinedDate01', 'UserDefinedDate02', 'UserDefinedDate03', 'UserDefinedDate04', 'UserDefinedDate05',
							'OrdPrbltyLastvalDate'
						]),
						SalesBidDocumentTypeProcessor,
						new salesCommonReadonlyStatusProcessor({
							typeName: 'BidHeaderDto',
							moduleSubModule: 'Sales.Bid',
							statusDataServiceName: 'salesBidStatusLookupDataService',
							uiStandardService: 'salesBidConfigurationService',
							statusField: 'BidStatusFk'
						}),
						new SalesCommonReadonlyProcessor(),
						{processItem: updateContractProbability},
						{  // No different BP / Debtor on change quotes with reference to main quote
							processItem: function (item) {
								if (!platformRuntimeDataService.isReadonly(item)) {
									var isChangeQuote = (item.BidHeaderFk !== null && item.PrjChangeFk !== null);
									platformRuntimeDataService.readonly(item, [
										{field: 'BusinesspartnerFk', readonly: isChangeQuote},
										{field: 'SubsidiaryFk', readonly: isChangeQuote},
										{field: 'CustomerFk', readonly: isChangeQuote}
									]);
								}
							}
						},
						{   // based on bid type => Main Bid and Project Change may not be changed after creation
							// both are already set in the create dialog
							processItem: function (item) {
								if (!platformRuntimeDataService.isReadonly(item)) {
									platformRuntimeDataService.readonly(item, [{ field: 'PrjChangeFk', readonly: true }]);
									platformRuntimeDataService.readonly(item, [{ field: 'BidHeaderFk', readonly: true }]);
								}
							}
						}
					],
					presenter: {
						list: {
							incorporateDataRead: function (readData, data) {
								let result = serviceContainer.data.handleReadSucceeded(readData, data);

								var characterColumnService = $injector.get('basicsCharacteristicColumnServiceFactory').getService(service, 65, containerGuid.toUpperCase(), containerInformationService);
								characterColumnService.appendCharacteristicCols(readData.dtos);

								return result;
							},
							handleCreateSucceeded: function (item) {
								$injector.get('salesBidBillingSchemaService').copyBillingSchemas(item, undefined, true);
								service.setExchangeRateByCurrency(item, item.CurrencyFk);
								if (service.isConfigurableDialog()) {
									item.BpdContactFk = bidCreationData.BpdContactFk;
									item.BusinesspartnerBilltoFk = bidCreationData.BusinesspartnerBilltoFk;
									item.CustomerBilltoFk = bidCreationData.CustomerBilltoFk;
									item.ContactBilltoFk = bidCreationData.ContactBilltoFk;
									item.SubsidiaryBilltoFk = bidCreationData.SubsidiaryBilltoFk;
									item.PrjChangeFk = bidCreationData.PrjChangeFk;
									item.PlannedEnd = bidCreationData.PlannedEnd;
									item.PlannedStart = bidCreationData.PlannedStart;
									item.PrcIncotermFk= bidCreationData.PrcIncotermFk;
									item.PriceFixingDate = bidCreationData.PriceFixingDate;
									item.OrdPrbltyPercent = bidCreationData.OrdPrbltyPercent;
									item.ObjUnitFk = bidCreationData.ObjUnitFk;
									item.ControllingUnitFk = bidCreationData.ControllingUnitFk;
									item.CommentText = bidCreationData.CommentText;
									item.Remark = bidCreationData.Remark;
									item.UserDefined1 = bidCreationData.UserDefined1;
									item.UserDefined2 = bidCreationData.UserDefined2;
									item.UserDefined3 = bidCreationData.UserDefined3;
									item.UserDefined4 = bidCreationData.UserDefined4;
									item.UserDefined5 = bidCreationData.UserDefined5;
									item.UserDefinedDate01 = bidCreationData.UserDefinedDate01;
									item.UserDefinedDate02 = bidCreationData.UserDefinedDate02;
									item.UserDefinedDate03 = bidCreationData.UserDefinedDate03;
									item.UserDefinedDate04 = bidCreationData.UserDefinedDate04;
									item.UserDefinedDate05 = bidCreationData.UserDefinedDate05;
								}
								var characterColumnService = $injector.get('basicsCharacteristicColumnServiceFactory').getService(service, 65, containerGuid.toUpperCase(), containerInformationService);
								characterColumnService.appendCharacteristicCols(item);
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
					sidebarWatchList: {active: true},  // @11.12.2015 enable watchlist support for this module
					filterByViewer: true
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(salesBidHeaderServiceOptions),
				service = serviceContainer.service;

			// return company categories based on rubric category from company module (if available)
			service.getCompanyCategoryList = function getCompanyCategoryList() {

				var bidRubricId = service.getRubricId();
				companyCategoryList = $injector.get('salesCommonContextService').getCompanyCategoryListByRubric(bidRubricId);
				return companyCategoryList || [];
			};

			service.getRubricId = function getRubricId() {
				return $injector.get('salesCommonRubric').Bid;
			};

			// validation processor for new entities
			serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'BidHeaderDto',
				moduleSubModule: 'Sales.Bid',
				validationService: 'salesBidValidationService',
				mustValidateFields: ['TaxCodeFk']
			});

			// functionality for dynamic characteristic configuration
			serviceContainer.service.setCharacteristicColumn = function setCharacteristicColumn(colName) {
				characteristicColumn = colName;
			};
			serviceContainer.service.getCharacteristicColumn = function getCharacteristicColumn() {
				return characteristicColumn;
			};

			// TODO: rename
			service.callHttpCreate = function callHttpCreate(creationData, optBoqPostData) {
				bidCreationData = creationData;
				serviceContainer.data.doCallHTTPCreate(creationData, serviceContainer.data, serviceContainer.data.onCreateSucceeded).then(function (bidEntity) {

					// boq take over data available?
					if (_.isObject(optBoqPostData) && !_.isEmpty(optBoqPostData)) {
						service.updateAndExecute(function () {
							$injector.get('salesCommonCopyBoqService').takeOverBoQs(optBoqPostData, bidEntity.Id);
						});

					} else {
						// auto create boq option
						var lookupDescriptorService = $injector.get('basicsLookupdataLookupDescriptorService');
						var config = _.find(lookupDescriptorService.getData('prcConfiguration'), {Id: bidEntity.ConfigurationFk});
						if (config) {
							lookupDescriptorService.loadData('prcconfigheader').then(function (configHeaderList) {
								var configHeader = _.find(configHeaderList, {Id: config.PrcConfigHeaderFk});
								if (_.get(configHeader, 'AutoCreateBoq')) {
									var salesBidBoqService = $injector.get('salesBidBoqService');
									var salesCommonBoqCreationService = $injector.get('salesCommonBoqCreationService');
									salesCommonBoqCreationService.initBaseBoqLookupService(bidEntity.ProjectFk, salesBidBoqService.getList);
									salesCommonBoqCreationService.createNextFreeBoqNumber($injector.get('salesCommonBaseBoqLookupService')).then(function (reference) {

										function getOutlineSpecification(PrcStructureId) {
											// take prc structure description if available
											if (PrcStructureId) {
												return $injector.get('basicsLookupdataLookupDataService').getItemByKey('PrcStructure', PrcStructureId).then(function (prcStructureEntity) {
													return _.get(prcStructureEntity, 'DescriptionInfo.Translated');
												});
											} else {
												return $q.when($injector.get('$translate').instant('sales.common.createSalesBoqDefaultOutlineSpecification'));
											}
										}

										getOutlineSpecification(bidEntity.PrcStructureFk).then(function (outlineSpecification) {
											// create without dialog
											salesBidBoqService.createItem({ // includes updateAndExecute
												runQuiet: true,
												mainItemId: bidEntity.Id,
												reference: reference,
												outlineSpec: outlineSpecification
											});
										});
									});
								}
							});
						}
					}
				});
			};

			// override create item (show "create a bid" dialog instead)
			service.createItem = function createBid() {
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

				// TODO: not removed yet, old dialog
				// var dialogService = $injector.get('salesBidCreateBidDialogService');
				// dialogService.resetToDefault();
				// dialogService.showDialog(function (creationData) {
				// service.callHttpCreate(creationData);
				// });
			};

			// configured create function
			service.configuredCreate = function (creationData, optBoqPostData) {
				platformDataServiceActionExtension.createConfiguredItem(creationData, serviceContainer.data).then(function(bidEntity) {
					// boq take over data available?
					if (_.isObject(optBoqPostData) && !_.isEmpty(optBoqPostData)) {
						service.updateAndExecute(function () {
							$injector.get('salesCommonCopyBoqService').takeOverBoQs(optBoqPostData, bidEntity.Id);
						});

					}
				});
			};

			// check if configurable dialog is activated
			service.isConfigurableDialog = function() {
				return platformDataServiceConfiguredCreateExtension.hasToUseConfiguredCreate(serviceContainer.data);
			};

			var originalDeleteItem = service.deleteItem;

			// override delete item
			service.deleteItem = function deleteBid(bidEntity) {
				var postData = {
					mainItemId: bidEntity.Id,
					moduleIdentifer: 'sales.bid',
					projectId: bidEntity.ProjectFk,
					headerId: 0
				};
				return $http.get(globals.webApiBaseUrl + 'basics/common/dependent/gettotalcount?mainItemId=' + bidEntity.Id + '&moduleIdentifer=sales.bid' + '&projectId=' + bidEntity.ProjectFk + '&headerId=' + 0, bidEntity).then(function(response) {
					var countCannotDelete = response.data;

					if (countCannotDelete > 0) {
						var modalOptions = {headerTextKey: 'procurement.common.confirmDeleteTitle', bodyTextKey: 'procurement.common.confirmDeleteHeader', iconClass: 'ico-warning', width: '800px'};
						modalOptions.mainItemId      = postData.mainItemId;
						modalOptions.headerId        = postData.headerId;
						modalOptions.moduleIdentifer = postData.moduleIdentifer;
						modalOptions.prjectId        = postData.projectId;
						return $injector.get('basicsCommonDependentService').showDependentDialog(modalOptions).then(result => {
							if (result && result.yes) {
								return originalDeleteItem(bidEntity, serviceContainer.data).then(function (){
									deleteBidProfile(bidEntity);
								});
							}
						});
					} else {
						return originalDeleteItem(bidEntity).then(function (){
							deleteBidProfile(bidEntity);
						});
					}
				});

				// old delete dialog
			/* var platformDeleteSelectionDialogService = $injector.get('platformDeleteSelectionDialogService');
				platformDeleteSelectionDialogService.showDialog().then(result => {
					if (result.yes) {
						return serviceContainer.data.deleteItem(bidEntity, serviceContainer.data);
					}
				}); */
			};

			function deleteBidProfile(bid){
				$injector.get('estimateMainBidCreationService').getBidCreatingProfile(bid.Id).then(function (datas){
					if(datas && datas.length > 0){
						let profileService = $injector.get('updateEstimeCommonOptionProfileService');
						_.forEach(datas, function (item){
							try{
								profileService.deleteProfile(item);
							}
							catch (e){
								// console.log(e);
							}
						});
					}
				});
			}

			service.createDeepCopy = function createDeepCopy() {
				var selectedBid = service.getSelected();
				var message = $injector.get('$translate').instant('sales.bid.noBidHeaderSelected');
				if (!$injector.get('platformSidebarWizardCommonTasksService').assertSelection(selectedBid, 'sales.bid.bidSelectionMissing', message)) {
					return;
				}

				var salesBidCopyBidDialogService = $injector.get('salesBidCopyBidDialogService');
				salesBidCopyBidDialogService.showDeepCopyDialog(selectedBid).then(function (result) {
					if (result.success && _.isFunction(_.get(result, 'data.getCopyIdentifiers'))) {
						var copyOptions = {
							entityId: selectedBid.Id,
							creationData: _.get(result, 'data'),
							copyIdentifiers: result.data.getCopyIdentifiers()
						};
						$http.post(globals.webApiBaseUrl + 'sales/bid/deepcopy', copyOptions).then(
							function (response) {
								serviceContainer.data.handleOnCreateSucceeded(response.data.BidHeader, serviceContainer.data);
							},
							function (/* error */) {
							});
					}
				});
			};

			// remark: register in controllers made problems, because we need to register both in grid and detail
			// controller. if one controller is destroyed, the other one would also loose filter registrations.
			// Therefor we register in main service. (DefectID 73166)
			salesCommonBusinesspartnerSubsidiaryCustomerService.registerFilters();

			// TODO: check if the same behaviour like reloadBillingSchemas
			service.recalculateBillingSchema = function recalculateBillingSchema() {
				$injector.get('salesBidBillingSchemaService').recalculateBillingSchema();
			};

			service.reloadBillingSchemas = function reloadBillingSchemas() {
				service.BillingSchemaFkChanged.fire();
			};

			service.BillingSchemaFkChanged = new PlatformMessenger();
			service.onUpdateSucceeded = new PlatformMessenger();
			service.onRecalculationItemsAndBoQ = new PlatformMessenger();

			function setBidHeader(item, triggerField, dataService) {
				isLoadByNavigation = true;
				if (triggerField === 'BidHeaderFk') {
					item = {Id: item.BidHeaderFk};
					naviBidHeaderId = item.Id;
				} else if (triggerField === 'Ids' && typeof item.Ids === 'string') {
					const ids = item.Ids.split(',').map(e => parseInt(e));
					cloudDesktopSidebarService.filterSearchFromPKeys(ids);
				} else {
					naviBidHeaderId = item.Id ? item.Id : null;
				}

				setBidToPinningContext(item, dataService);

				service.load().then(function (d) {
					item = _.find(d, {Id: item.Id});
					if (item) {
						service.setSelected(item);
					}
				});
			}

			service.setBidHeader = setBidHeader;

			// pinning context (project, bid)
			function setBidToPinningContext(bidItem, dataService) {
				return $injector.get('salesCommonUtilsService').setRelatedProjectToPinningContext(bidItem, dataService);
			}

			function setCurrentPinningContext(dataService) {
				var currentBidItem = dataService.getSelected();
				if (currentBidItem && angular.isNumber(currentBidItem.ProjectFk)) {
					setBidToPinningContext(currentBidItem, dataService);
				}
			}

			salesCommonExchangerateService.extendByExchangeRateLogic(service);

			service.doPrepareUpdateCall = function doPrepareUpdateCall(updateData) {
				// if clobs/blobs are to delete, we need to prepare header entity
				// TODO: set all blobs/clobs properties to null

				// handling date issue of boq root item (see 135014, 135620) // TODO: check why UpdatedAt is not correct / to remove next lines
				_.each(_.get(updateData, 'BidBoqCompositeToSave'), (compositeItem) => {
					if (_.has(compositeItem, 'BoqRootItem.UpdatedAt')) {
						delete compositeItem.BoqRootItem.UpdatedAt;
					}
				});
			};

			service.checkItemIsReadOnly = function (item) {
				return $injector.get('salesCommonStatusHelperService').checkIsReadOnly('salesBidStatusLookupDataService', 'BidStatusFk', item);
			};

			service.registerSelectionChanged(function (e, item) {
				if (item) {
					var containerGUIDs = [ // TODO: make more generic!
						'173343c2fdf04186b32bb4b9526aff4f', // PlainTextContainer
						'6f184332b0b2496f8d6ab3201e8e1bde', // FormattedTextContainer
						'fdd90b3f00ce4390bcd4a798d0dbf847', // CommentContainer
						'cff858f883ac47919f261c269eb84261', // ContainerCharacteristic
						'd440373784664e58bbb3f57e66ef9566', // Generals
						'3de6ddaa808c45d39f71803909cbb06a', // Billing Schema
						'13599a7eabfa444aa9b34da16893dea4', // UserForm
						// '03deb09668e740c389bc3681210eaef1', // Document (see #107271)
						'2ce420a7aa8a4bd584cbaf35ccb45fd4', // PriceCondition
						'96ec1c43569a44c490010d4af9365715'  // Translations
					];
					// TODO: reset to previous value!
					var permission = platformRuntimeDataService.isReadonly(item) ? permissions.read : false;
					// #see 106021 and 116385
					platformPermissionService.restrict(containerGUIDs, permission);

					if (item.TypeFk) {
						var bidType = $injector.get('salesBidTypeLookupDataService').getItemById(item.TypeFk);
						if (bidType.IsChange) {
							// if bid is change bid than we enable PrjChange and Main bid lookup to be editable
							platformRuntimeDataService.readonly(item, [{ field: 'PrjChangeFk', readonly: false }]);
							platformRuntimeDataService.readonly(item, [{ field: 'BidHeaderFk', readonly: false }]);
						}
						else if (bidType.IsSide) {
							// if bid is side bid than we enable PrjChange and Main bid lookup to be editable
							platformRuntimeDataService.readonly(item, [{ field: 'PrjChangeFk', readonly: true }]);
							platformRuntimeDataService.readonly(item, [{ field: 'BidHeaderFk', readonly: false }]);
						}
						else {
							platformRuntimeDataService.readonly(item, [{ field: 'PrjChangeFk', readonly: true }]);
							platformRuntimeDataService.readonly(item, [{ field: 'BidHeaderFk', readonly: true }]);
						}
					}
					else {
						if (item.BidHeaderFk !== null && item.PrjChangeFk !== null) {
							// if bid is change bid than we enable PrjChange and Main bid lookup to be editable
							platformRuntimeDataService.readonly(item, [{ field: 'PrjChangeFk', readonly: false }]);
							platformRuntimeDataService.readonly(item, [{ field: 'BidHeaderFk', readonly: false }]);
						} else if (item.BidHeaderFk !== null && item.PrjChangeFk === null) {
							// if bid is side bid than we enable PrjChange and Main bid lookup to be editable
							platformRuntimeDataService.readonly(item, [{ field: 'PrjChangeFk', readonly: true }]);
							platformRuntimeDataService.readonly(item, [{ field: 'BidHeaderFk', readonly: false }]);
						} else {
							platformRuntimeDataService.readonly(item, [{ field: 'PrjChangeFk', readonly: true }]);
							platformRuntimeDataService.readonly(item, [{ field: 'BidHeaderFk', readonly: true }]);
						}
					}
				}
			});

			service.getDefaultListForCreatedPerSection = function getDefaultListForCreatedPerSection(newBid, sectionId) {
				return $injector.get('salesCommonUtilsService').getCharacteristicsDefaultListForCreatedPerSection(newBid, sectionId);
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
								$http.get(globals.webApiBaseUrl + 'sales/bid/RecalculationBoQ?bidHeaderId=' + entity.Id + '&vatGroupFk=' + entity.VatGroupFk + '&defaultTaxCodeFk=' + entity.TaxCodeFk).then(function (res) {
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

			var entityRelatedFilters = [
				{
					key: 'sales-bid-contact-by-bizpartner-server-filter',
					serverSide: true,
					serverKey: 'business-partner-contact-filter-by-simple-business-partner',
					fn: function (entity) {
						return {
							BusinessPartnerFk: entity.BusinesspartnerFk
						};
					}
				}
			];

			basicsLookupdataLookupFilterService.registerFilter(entityRelatedFilters);

			service.updateAmounts = function (amountNet, amountNetOc, amountGross, amountGrossOc) {
				var selectedBid = service.getSelected();
				selectedBid.AmountNet = amountNet;
				selectedBid.AmountNetOc = amountNetOc;
				selectedBid.AmountGross = amountGross;
				selectedBid.AmountGrossOc = amountGrossOc;

				// prevent from mark as modified if boq data is not modified
				// so we check the module state
				var state = $injector.get('platformModuleStateService').state(service.getModule());
				if (!_.isEmpty(_.get(state, 'modifications.BoqItemToSave')) ||
					!_.isEmpty(_.get(state, 'modifications.BoqItemToDelete')) ||
					!_.isEmpty(_.get(state, 'modifications.BidBoqCompositeToDelete'))) {
					service.markItemAsModified(selectedBid);
				}
			};

			service.updateContractProbability = updateContractProbability;

			service.updateHeader = function updateHeader(bidHeader) {
				var data = serviceContainer.data;
				var dataEntity = data.getItemById(bidHeader.Id, data);
				data.mergeItemAfterSuccessfullUpdate(dataEntity, bidHeader, true, data);
			};

			serviceContainer.data.handleOnCreateSucceeded = function handleOnCreateSucceeded(newItem, data) {
				return $injector.get('salesCommonUtilsService').handleOnCreateSucceededInListSetToTop(newItem, data, service);
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

			service.changeSalesConfigOrType = function changeSalesConfigOrType(TypeFk,RubricCategoryFk,ConfigurationFk,BidHeaderFk,PrjChangeFk,item) {
				if (TypeFk === 1) {
					if (RubricCategoryFk > 0 && ConfigurationFk > 0 && BidHeaderFk === null && PrjChangeFk === null && _.isObject(item)) {
						item.TypeFk = TypeFk;
						item.RubricCategoryFk = RubricCategoryFk;
						item.ConfigurationFk = ConfigurationFk;
						item.BidHeaderFk = BidHeaderFk;
						item.PrjChangeFk = PrjChangeFk;
						_.each(service.getDataProcessor(), function (proc) {
							proc.processItem(item);
						});
						service.markItemAsModified(item);
					}
				}
				else if (TypeFk === 2) {
					if (RubricCategoryFk > 0 && ConfigurationFk > 0 && BidHeaderFk > 0 && PrjChangeFk > 0 && _.isObject(item)) {
						item.TypeFk = TypeFk;
						item.RubricCategoryFk = RubricCategoryFk;
						item.ConfigurationFk = ConfigurationFk;
						item.BidHeaderFk = BidHeaderFk;
						item.PrjChangeFk = PrjChangeFk;
						_.each(service.getDataProcessor(), function (proc) {
							proc.processItem(item);
						});
						service.markItemAsModified(item);
					}
				}
				else if (TypeFk === 3) {
					if (RubricCategoryFk > 0 && ConfigurationFk > 0 && BidHeaderFk > 0 && PrjChangeFk === null && _.isObject(item)) {
						item.TypeFk = TypeFk;
						item.RubricCategoryFk = RubricCategoryFk;
						item.ConfigurationFk = ConfigurationFk;
						item.BidHeaderFk = BidHeaderFk;
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
