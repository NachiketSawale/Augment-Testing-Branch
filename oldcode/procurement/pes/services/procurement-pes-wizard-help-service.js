/**
 * Created by wed on 6/20/2019.
 */

(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */

	angular.module('procurement.contract').factory('procurementPesWizardHelpService', [
		'globals',
		'_',
		'$q',
		'$sce',
		'$http',
		'$timeout',
		'$injector',
		'$translate',
		'platformGridAPI',
		'platformModalService',
		'platformContextService',
		'platformTranslateService',
		'platformModuleStateService',
		'cloudCommonGridService',
		'basicsCommonLoadingService',
		'procurementPesHeaderService',
		'procurementPesItemService',
		'basicsLookupdataLookupDataService',
		'basicsLookupdataLookupDescriptorService',
		'procurementPesBillingSchemaDataService',
		'platformLayoutByDataService',
		'procurementPesHeaderUIStandardService',
		'platformValidationByDataService',
		'procurementPesHeaderValidationService',
		'procurementPesNumberGenerationSettingsService',
		'ServiceDataProcessDatesExtension',
		'platformModuleNavigationService',
		function (globals,
			_,
			$q,
			$sce,
			$http,
			$timeout,
			$injector,
			$translate,
			platformGridAPI,
			platformModalService,
			platformContextService,
			platformTranslateService,
			platformModuleStateService,
			cloudCommonGridService,
			loadingService,
			headerService,
			itemService,
			basicsLookupdataLookupDataService,
			basicsLookupdataLookupDescriptorService,
			billingSchemaDataService,
			platformLayoutByDataService,
			procurementPesHeaderUIStandardService,
			platformValidationByDataService,
			procurementPesHeaderValidationService,
			procurementPesNumberGenerationSettingsService,
			ServiceDataProcessDatesExtension,
			navigateService) {

			function createHeader(contract) {
				let canSavePes = false;

				platformLayoutByDataService.registerLayout(procurementPesHeaderUIStandardService, headerService);
				platformValidationByDataService.registerValidationService(procurementPesHeaderValidationService(headerService), headerService);

				if (!headerService.__isBindEntityCreatedEventForWizard) {
					headerService.registerEntityCreated(function (data, newItem) {
						if (headerService.__assignedProperties) {
							angular.extend(newItem, headerService.__assignedProperties);
						}
						if (headerService.__alternativeProperties) {
							_.each(headerService.__alternativeProperties, function (value, key) {
								if (!newItem[key]) {
									newItem[key] = value;
								}
							});
						}
					});
					headerService.__isBindEntityCreatedEventForWizard = true;
				}

				headerService.__assignedProperties = {
					BusinessPartnerFk: contract.BusinessPartnerFk,
					ConHeaderFk: contract.Id,
					PackageFk: contract.PackageFk,
					ProjectFk: contract.ProjectFk,
					MdcTaxCodeFk: contract.TaxCodeFk,
					PrcStructureFk: contract.PrcStructureFk,
					CurrencyFk: contract.BasCurrencyFk,
					SubsidiaryFk: contract.SubsidiaryFk,
					SupplierFk: contract.SupplierFk,
					ControllingUnitFk: contract.ControllingUnitFk
				};

				headerService.__alternativeProperties = {
					ClerkPrcFk: contract.ClerkPrcFk,
					ClerkReqFk: contract.ClerkReqFk
				};

				let createPesParam = {
					CreateFromContract: true,
					BillingSchemaId: contract.BillingSchemaFk,
					BusinessPartnerId: contract.BusinessPartnerFk,
					BasCurrencyFk: contract.BasCurrencyFk,
					FromConfigurationId: (_.has(contract, 'PrcHeaderEntity.ConfigurationFk') && contract.PrcHeaderEntity.ConfigurationFk) ? contract.PrcHeaderEntity.ConfigurationFk : null,
					ConHeaderId:contract.Id
				};
				return headerService.createItem(createPesParam).then(function () {
					let header = headerService.getSelected();
					// Code must have a value
					if (header.Code === '' || header.Code === null) {
						if (header.RubricCategoryFk) {
							header.Code = procurementPesNumberGenerationSettingsService.provideNumberDefaultText(header.RubricCategoryFk, header.Code);
							if (header.Code === '' || header.Code === null) {
								header.Code = '-1';
							}
						}
					}
					if (!_.isNil(contract.DispatchRecordDateEffective)) {
						header.DateDelivered = contract.DispatchRecordDateEffective;
					}
					return $http.post(globals.webApiBaseUrl + 'procurement/pes/header/validate', {
						HeaderDto: header,
						Model: 'ConHeaderFk',
						Value: contract.Id
					}).then(function (data) {
						removeFields(data.data.dtos);
						var rate = header.ExchangeRate;
						angular.extend(header, data.data.dtos);
						header.ExchangeRate = rate;
						return data;
					}).then(function () {
						if (!header.BillingSchemaFk) {
							header.BillingSchemaFk = contract.BillingSchemaFk;
							return billingSchemaDataService.reloadItemsFromBill(header);
						} else {
							return $q.when([]);
						}

					}).then(function () {
						return headerService.update().then(function (canSave) {
							canSavePes = canSave;
							if (canSave) {
								return headerService.getSelected();
							} else {
								headerService.deleteItem(headerService.getSelected());
								return null;
							}
						}).then(function () {
							if (canSavePes) {
								// characteristics
								let copyCharacteristicDataParameter1 = {
									sourceHeaderId: contract.Id,
									targetHeaderId: header.Id,
									sourceSectionId: 8,
									targetSectionId: 20,
									prcStructureId: header.PrcStructureFk,
									prcConfigurationId: header.PrcConfigurationFk
								};
								$http.post(globals.webApiBaseUrl + 'procurement/pes/header/copyandsavecharacteristicdata', copyCharacteristicDataParameter1);
								// Characteristic 2, fixed task: #103141
								let copyCharacteristicDataParameter2 = {
									sourceHeaderId: contract.Id,
									targetHeaderId: header.Id,
									sourceSectionId: 46,
									targetSectionId: 49,
									prcStructureId: header.PrcStructureFk,
									prcConfigurationId: header.PrcConfigurationFk
								};
								$http.post(globals.webApiBaseUrl + 'procurement/pes/header/copyandsavecharacteristicdata', copyCharacteristicDataParameter2);
							}
						});
					}).then(function () {
						return headerService.getSelected();
					}).finally(function () {
						headerService.__assignedProperties = null;
						headerService.__alternativeProperties = null;
					});
				});
			}

			function getMergedPrcBoqsByContracts(contracts) {
				let searchRequests = [];
				_.forEach(contracts, function (contract) {
					let search = {
						AdditionalParameters: {
							'isCanceled': false,
							'contractId': contract.Id,
							'isConsolidateChange': true
						},
						PageState: {
							PageNumber: 0,
							PageSize: 10000
						},
						FilterKey: 'pes-boq-con-merge-boq-filter'
					};
					searchRequests.push(search);
				});

				return $http.post(globals.webApiBaseUrl + 'procurement/common/boq/getmergedprcboqsbyfilter', searchRequests);
			}

			function createBoqs(header, contract, includeNonContractedItemInPrePes) {

				let searchReq = {
					AdditionalParameters: {
						'isCanceled': false,
						'contractId': contract.Id,
						'pesHeaderId': header.Id,
						'isConsolidateChange': true
					},
					PageState: {
						PageNumber: 0,
						PageSize: 10000
					},
					FilterKey: 'pes-boq-con-merge-boq-filter'
				};
				return basicsLookupdataLookupDataService.getSearchList('PrcMergeBoqView', searchReq).then(function (response) {
					if (response&&response.items && response.items.length > 0) {

						let contractBoqs = response.items;
						let newBoqOptions = _.map(contractBoqs, function (boq) {
							return {
								MainItemId: header.Id,
								parent: {
									PrcBoqFk: boq.Id,
									ConHeaderFk: contract.Id,
									PackageFk: contract.PackageFk,
									BoqItemPrjBoqFk: boq.BoqItemPrjBoqFk,
									MdcTaxCodeFk: contract.TaxCodeFk,
									PrcStructureFk: contract.PrcStructureFk,
									ControllingUnitFk: boq.ControllingUnitFk || header.ControllingUnitFk || contract.ControllingUnitFk,
									IsIncludeNotContractedItem: !!includeNonContractedItemInPrePes
								}
							};
						});
						return $http.post(globals.webApiBaseUrl + 'procurement/pes/boq/createitems', newBoqOptions).then(function (response) {
							return response.data;
						});
					} else {
						return null;
					}
				});

			}



			function fillContract(source, destination) {
				if (source && destination) {
					if (!_.isNil(source.DispatchRecordQuantity)) {
						destination.DispatchRecordQuantity = source.DispatchRecordQuantity;
					}
					if(!_.isNil(source.DispatchHeaderPerformingControllingUnit)){
						destination.DispatchHeaderPerformingControllingUnit = source.DispatchHeaderPerformingControllingUnit;
					}
				}
			}



			//todo createItems and createOtherItems need to be combined into one, and the logic should be implemented in your backend code by lcn
			function createItems(header, contract, includeNonContractedItemInPrePes) {
				return getItemsForCreate(contract.Id, header.Id).then(response => {
					if (!response.data || !response.data.length) {
						if (includeNonContractedItemInPrePes) {
							const creationData = {MainItemId: header.Id, ConHeaderFk: contract.Id};
							return postNonContractedItems(creationData);
						}
						return $q.when([]);
					}
					return itemService.createOtherItems({ConHeaderFk: header.ConHeaderFk, ProjectFk: header.ProjectFk},
						true, undefined, undefined, undefined, callBackAfterCreate, undefined, true, true).then(pesItemComplete => {
						let itemsToSave = pesItemComplete.map(e => e.Item);

						if (includeNonContractedItemInPrePes) {
							const creationData = {MainItemId: header.Id, ConHeaderFk: contract.Id};
							return postNonContractedItems(creationData).then(nonContractedItems => {
								itemsToSave = nonContractedItems.concat(itemsToSave);
								return saveAllItems(itemsToSave);
							});
						}
						return saveAllItems(itemsToSave);
					});
				});

				function postNonContractedItems(creationData) {
					return $http.post(globals.webApiBaseUrl + 'procurement/pes/item/createnocontracteditems', creationData)
						.then(response => response.data.Main);
				}

				function saveAllItems(items) {
					return $http.post(globals.webApiBaseUrl + 'procurement/pes/item/saveitems', items)
				}

				function callBackAfterCreate(_items) {
					fillItems(contract, _items);
				}
				function fillItems(contract, items) {
					if (items && items.length) {
						if (!_.isNil(contract.DispatchRecordQuantity)) {
							_.forEach(items, function (item) {
								item.Quantity = contract.DispatchRecordQuantity;
							});
						}
						if (!_.isNil(contract.DispatchHeaderPerformingControllingUnit)) {
							_.forEach(items, function (item) {
								item.ControllingUnitFk = contract.DispatchHeaderPerformingControllingUnit;
							});
						}
					}
				}
			}

			function appendBoqs(baseContract, header, autoCompleteStructure) {
				return $http.post(globals.webApiBaseUrl + 'procurement/pes/header/appendboqs', {
					BaseContractId: baseContract.Id,
					PesHeaderId: header.Id,
					AutoCompleteStructure: autoCompleteStructure,
					ControllingUnitFk: header.ControllingUnitFk || baseContract.ControllingUnitFk
				});
			}

			function appendItems(header, baseContract, itemIds, isCreateNew) {
				if (itemIds && itemIds.length > 0) {
					return $q.all([getPesItems(header.Id), getMergeItems(baseContract.Id, itemIds), getItemsForCreate(baseContract.Id, header.Id, {ids: itemIds})]).then(function (response) {
						let pesItems = response[0].data.Main, createItems = response[2].data;
						if (createItems.length > 0) {
							let actualCreateItems = [];
							if (!isCreateNew) {
								itemService.setList(pesItems);
								_.each(createItems, function (item) {
									let pesItem = _.find(pesItems, {PrcItemFk: item.Id});
									if (pesItem) {
										pesItem.QuantityContracted = item.Quantity;
										itemService.markItemAsModified(pesItem);
									} else {
										actualCreateItems.push(item);
									}
								});
							} else {
								actualCreateItems = createItems;
							}
							return actualCreateItems.length > 0 ? itemService.createOtherItems({ConHeaderFk: header.ConHeaderFk, ProjectFk: header.ProjectFk}, true, false, actualCreateItems, undefined, undefined, undefined, true, true)
								.then(function (items) {
									return $q.when(items);
								}): $q.when(pesItems);
						} else {
							return $q.when([]);
						}
					});
				}
				return $q.when(true);
			}

			function saveHeader(header, baseContract) {

				_.each(itemService.getList(), function (item) {
					if (!item.ControllingUnitFk) {
						item.ControllingUnitFk = header.ControllingUnitFk || baseContract.ControllingUnitFk;
					}
					if (!item.PrcStructureFk) {
						item.PrcStructureFk = header.PrcStructureFk;
					}
				});

				let modState = platformModuleStateService.state(headerService.getModule(), headerService);
				let updateData = angular.extend(modState.modifications, {MainItemId: header.Id});

				return $http.post(globals.webApiBaseUrl + 'procurement/pes/header/updatepes', updateData).then(function (response) {
					platformModuleStateService.clearState(headerService);
					return response.data.Header;
				});
			}

			function updateContractStatus(pesId) {
				return $http.post(globals.webApiBaseUrl + 'procurement/pes/header/updatepescontractstatus?pesId=' + pesId);
			}

			function createCompletely(contracts, processIndex, context, createOptions, isBlock) {

				_.each(contracts, function (c) {
					if (!c.PrcStructureFk && c.PrcHeaderEntity) {
						c.PrcStructureFk = c.PrcHeaderEntity.StructureFk;
					}
				});

				if (isBlock) {
					loadingService.show();
				}

				let contract = contracts[processIndex];
				if (context && context.lookups && processIndex === 0) {
					basicsLookupdataLookupDescriptorService.attachData(context.lookups);
				}

				if (angular.isFunction(createOptions.onCreating)) {
					createOptions.onCreating({
						processIndex: processIndex,
						caseType: createOptions.caseType
					});
				}

				let canCreate = false;
				let includeNonContractedItemInPrePes = !!createOptions.includeNonContractedItemInPrePes;
				return createHeader(contract).then(function (header) {
					canCreate = !!header;
					if (header) {
						return createBoqs(header, contract, includeNonContractedItemInPrePes).then(function (boqs) {
							return {
								header: header,
								boqs: boqs
							};
						});
					} else {
						return null;
					}
				}).then(function (result) {
					if (canCreate) {
						return createItems(result.header, contract, includeNonContractedItemInPrePes).then(function (_items) {
							return angular.extend(result, {items: _items});
						});
					} else {
						return null;
					}
				}).then(function (result) {
					if (canCreate) {
						return saveHeader(result.header, contract).then(function () {
							contract.__createPes = result.header;
							return updateContractStatus(result.header.Id).then(function () {
								if (processIndex < contracts.length - 1) {
									return createCompletely(contracts, processIndex + 1, context, createOptions, false).then(function (header) {
										return header;
									});
								} else {
									return result.header;
								}
							});
						});
					} else {
						return null;
					}
				});
			}

			function createPartially(header, changeItems, baseContract, autoCompleteStructure, isCreateNew, failFn) {
				let failCallback = function () {
					if (_.isFunction(failFn)) {
						failFn();
					}
				};

				headerService.setSelected(header);
				return appendBoqs(baseContract, header, autoCompleteStructure).then(function () {
					return true;
				}, function () {
					failCallback();
				}).then(function () {
					let items = _.filter(changeItems, {DataType: 'item'}),
						itemIds = _.map(items, function (item) {
							return item.Identity;
						});
					return appendItems(header, baseContract, itemIds, isCreateNew).then(function (items) {
						return items;
					});
				}, function () {
					failCallback();
				}).then(function () {
					_.each(itemService.getList(), function (item) {
						if (!item.ControllingUnitFk) {
							item.ControllingUnitFk = header.ControllingUnitFk || baseContract.ControllingUnitFk;
						}
					});
					return saveHeader(header, baseContract).then(function () {
						baseContract.__createPes = header;
						return header;
					});
				}, function () {
					failCallback();
				});
			}

			function showOptionDialog(baseContract, headers, items, context, createOptions) {
				if (headers && headers.length) {
					let dateProcess = new ServiceDataProcessDatesExtension(['DocumentDate', 'DateDelivered']);
					_.each(headers, function (header) {
						dateProcess.processItem(header);
					});
				}

				let configHeaderIsConsolidateChange = true;
				let prcConfigurations = basicsLookupdataLookupDescriptorService.getData('prcConfiguration');
				let prcConfigHeaders = basicsLookupdataLookupDescriptorService.getData('PrcConfigHeader');
				if (prcConfigurations && prcConfigHeaders && baseContract.PrcHeaderEntity.ConfigurationFk) {
					let config = _.find(prcConfigurations, {Id: baseContract.PrcHeaderEntity.ConfigurationFk});
					if (config) {
						var configHeader = _.find(prcConfigHeaders, {Id: config.PrcConfigHeaderFk});
						if (configHeader) {
							configHeaderIsConsolidateChange = configHeader.IsConsolidateChange;
						}
					}
				}

				return platformModalService.showDialog({
					templateUrl: globals.appBaseUrl + 'procurement.pes/partials/procurement-pes-wizard-create-partial-pes.html',
					backdrop: false,
					controller: ['$scope', function ($scope) {

						function initialize(gridId, columns, data) {
							platformTranslateService.translateGridConfig(columns);
							let grid = {
								columns: columns,
								data: data,
								id: gridId,
								enableConfigSave: false,
								lazyInit: true,
								options: {
									indicator: true,
									editable: true,
									idProperty: 'Id'
								}
							};
							platformGridAPI.grids.config(grid);
						}

						$scope.isProcessing = false;
						$scope.createOptions = {
							selectedValue: 1,
							selectedSource: 1
						};

						$scope.items = items;
						$scope.headers = headers;
						$scope.isDisableFromConsolidatedContract = !configHeaderIsConsolidateChange;

						$scope.itemGridData = {
							state: '5b8809a502d34fb9bda8db977c3651a1',
							columns: [
								{
									id: 'code',
									field: 'Code',
									name: 'Code',
									name$tr$: 'cloud.common.entityCode',
									width: 120
								},
								{
									id: 'description',
									field: 'Description',
									formatter: 'description',
									name: 'Description',
									name$tr$: 'cloud.common.entityDescription',
									width: 260
								},
								{
									id: 'ccQuantity',
									field: 'Quantity',
									formatter: 'integer',
									name: 'Consolidate Contract QTY',
									name$tr$: 'procurement.pes.consolidateContractQuantity',
									width: 150
								},
								{
									id: 'uom',
									field: 'UomFK',
									name: 'Uom',
									name$tr$: 'cloud.common.entityUoM',
									width: 150,
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'uom',
										displayMember: 'Unit'
									}
								}
							]
						};
						$scope.pesGridData = {
							state: '2603876bbde04bdc939a91c34ebb500b',
							columns: [
								{
									id: 'status',
									field: 'PesStatusFk',
									name: 'Status',
									name$tr$: 'cloud.common.entityStatus',
									width: 80,
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'PesStatus',
										displayMember: 'Description',
										imageSelector: 'platformStatusIconService'
									}
								},
								{
									id: 'code',
									field: 'Code',
									name: 'Code',
									name$tr$: 'cloud.common.entityCode',
									width: 100
								},
								{
									id: 'description',
									field: 'Description',
									formatter: 'description',
									name: 'Description',
									name$tr$: 'cloud.common.entityDescription',
									width: 200
								},
								{
									id: 'documentDate',
									field: 'DocumentDate',
									formatter: 'dateutc',
									name: 'Document Date',
									name$tr$: 'procurement.pes.documentDate',
									width: 120
								},
								{
									id: 'dateDelivered',
									field: 'DateDelivered',
									formatter: 'dateutc',
									name: 'Date Delivered',
									name$tr$: 'procurement.pes.dateDelivered',
									width: 120
								},
								{
									id: 'total',
									field: 'PesValue',
									formatter: 'money',
									name: 'Total',
									name$tr$: 'procurement.pes.total',
									width: 80
								}
							]
						};

						$scope.modalOptions = {
							headerText: $translate.instant('procurement.pes.createPesTitle'),
							ok: function () {
								let createOpts = $scope.createOptions;
								$scope.isProcessing = true;
								if (createOpts.selectedValue === 1 && createOpts.selectedSource === 2) {
									createCompletely([baseContract], 0, context, createOptions, false).then(function () {
										$scope.$close({isOk: true});
									}).finally(function () {
										$scope.isProcessing = false;
									});
								} else {
									let createFromChangeOrder = createOpts.selectedValue === 1 && createOpts.selectedSource === 1;
									let headerReady = createFromChangeOrder ? createHeader(baseContract) : $q.when(platformGridAPI.rows.selection({gridId: $scope.pesGridData.state}));
									headerReady.then(function (header) {
										return header;
									}).then(function (header) {
										if (!header) {
											$scope.$close({isOk: false});
											return;
										}

										createPartially(header, $scope.items, baseContract, createFromChangeOrder, createFromChangeOrder).then(function () {
											$scope.$close({isOk: true});
										}).finally(function () {
											$scope.isProcessing = false;
										});

									});
								}
							},
							cancel: function () {
								$scope.$close({isOk: false});
							}
						};

						$scope.createOptionChanged = function () {
							if ($scope.createOptions.selectedValue === 2) {
								if (!platformGridAPI.rows.selection({gridId: $scope.pesGridData.state})) {
									platformGridAPI.rows.scrollIntoViewByItem($scope.pesGridData.state, $scope.headers[0]);
								}
								$scope.createOptions.selectedSource = -1;
							}
						};

						$scope.createSourceChanged = function () {
							$scope.createOptions.selectedValue = 1;
						};

						initialize($scope.itemGridData.state, $scope.itemGridData.columns, $scope.items);
						initialize($scope.pesGridData.state, $scope.pesGridData.columns, $scope.headers);

					}],
					width: '800px',
					height: '600px',
					resizeable: true
				});
			}

			function getChangeOrders(contracts) {
				return $http.get(globals.webApiBaseUrl + 'procurement/contract/header/listchangeorders', {
					params: {
						headerIds: _.map(contracts, function (c) {
							return c.Id;
						}).join(':')
					}
				}).then(function (response) {
					return response.data;
				});
			}

			function includeBaseContracts(contracts) {
				return _.some(contracts, {ConHeaderFk: null}) ? $q.when(contracts) : $http.get(globals.webApiBaseUrl + 'procurement/contract/header/get?id=' + contracts[0].ConHeaderFk).then(function (response) {
					return response.data !== null ? contracts.concat([response.data]) : contracts;
				});
			}

			function checkPes(baseContract) {
				return getPes(baseContract).then(function (headers) {
					let result = {headers: headers || [], items: []};
					if (headers.length > 0) {
						return getNewChangeItems(baseContract, headers[0]).then(function (items) {
							result.items = items || [];
							return result;
						});
					}
					return result;
				});
			}

			function showCoverConfirmDialog() {
				return platformModalService.showDialog({
					templateUrl: globals.appBaseUrl + 'procurement.pes/partials/procurement-pes-wizard-again-create-pes.html',
					backdrop: false,
					resizeable: false,
					controller: ['$scope', function ($scope) {
						$scope.modalOptions = {};
						$scope.modalOptions.headerText = $translate.instant('procurement.pes.createPesTitle');
						$scope.modalOptions.bodyText = $translate.instant('procurement.pes.createNewPesComfirm');
						$scope.modalOptions.isIncludeText = $translate.instant('procurement.pes.createPesIncludeNonContractedItem');
						$scope.modalOptions.isIncluded = true;
						$scope.modalOptions.yes = function () {
							$scope.$close({isIncluded: $scope.modalOptions.isIncluded});
						};
						$scope.modalOptions.no = function () {
							$scope.$close(false);
						};
						$scope.modalOptions.cancel = function () {
							$scope.$close(false);
						};
					}]
				});
			}

			function isExistNonContractedItems(contracts) {
				let contractIds = _.map(contracts, function (c) {
					return c.Id;
				});
				return $http.get(globals.webApiBaseUrl + 'procurement/pes/item/getExistNonContractedItems', {
					params: {
						contractIds: contractIds.join(':')
					}
				}).then(function (result) {
					if (result.data.length) {
						return platformModalService.showDialog({
							templateUrl: globals.appBaseUrl + 'procurement.pes/partials/procurement-pes-wizard-include-noncontracted-items.html',
							backdrop: false,
							resizeable: false,
							controller: ['$scope', function ($scope) {
								$scope.modalOptions = {};
								$scope.modalOptions.headerText = $translate.instant('procurement.pes.createPesTitle');
								$scope.modalOptions.bodyText = $translate.instant('procurement.pes.nonContractedItemFound');
								$scope.modalOptions.include = function () {
									$scope.$close({isIncluded: true});
								};
								$scope.modalOptions.ignore = function () {
									$scope.$close({isIncluded: false});
								};
								$scope.modalOptions.cancel = function () {
									$scope.$close({isIncluded: false});
								};
							}]
						});
					} else {
						return $q.when(true);
					}
				});
			}

			function getProcessor(contracts, children) {
				let processors = [
					{
						description: 'Base | Call Off',
						caseType: 1,
						validate: function () {
							return $q.when(true);
						},
						isCompetent: function (contracts) {
							return _.reduce(contracts, function (result, c) {
								return result && ((c.ConHeaderFk === null && !_.some(children, {ConHeaderFk: c.Id})) || c.PurchaseOrders === 2);
							}, true);
						},
						process: function (contracts, context, createOptions) {
							createOptions.caseType = this.caseType;
							createOptions.includeNonContractedItemInPrePes = false;
							return this.validate(contracts).then(function (result) {
								if (result) {
									let checkPromises = _.map(contracts, function (baseContract) {
										return checkPes(baseContract);
									});
									return $q.all(checkPromises).then(function (results) {
										let hasCoverItem = _.some(results, function (result) {
											return result.headers.length > 0 && result.items.length === 0;
										});
										let createFn = function (result) {
											if (result.isIncluded) {
												createOptions.includeNonContractedItemInPrePes = true;
											}
											return createCompletely(contracts, 0, context, createOptions, contracts.length === 1).then(function () {
												let createPesList = [];
												_.forEach(contracts, function (contract) {
													if (contract.__createPes) {
														createPesList.push(contract.__createPes);
													}
												});
												return createPesList;
											});
										};
										if (hasCoverItem) {
											return showCoverConfirmDialog().then(function (result) {
												if (result) {
													loadingService.show();
													return createFn(result);
												} else {
													return $q.when([]);
												}
											});
										} else {
											return isExistNonContractedItems(contracts).then(function (result) {
												return createFn(result);
											});
										}
									});
								}
								return result;
							});
						}
					},
					{
						description: 'Base & Change Order',
						caseType: 2,
						validate: function (contracts) {
							let isValid = _.uniq(_.map(contracts, function (c) {
								return c.ConHeaderFk || c.Id;
							})).length === 1;

							if (!isValid) {
								platformModalService.showErrorBox('procurement.pes.multipleBaseContractAbortCreatePes', 'cloud.common.errorMessage');
							}

							return $q.when(isValid);
						},
						isCompetent: function (contracts) {
							return _.filter(contracts, function (c) {
								return (c.ConHeaderFk !== null || _.some(children, {ConHeaderFk: c.Id})) && c.PurchaseOrders !== 2;
							}).length > 0;
						},
						process: function (contracts, context, createOptions) {
							createOptions.caseType = this.caseType;
							return this.validate(contracts).then(function (result) {
								if (result) {
									return includeBaseContracts(contracts).then(function (contracts) {
										let baseContract = _.find(contracts, {ConHeaderFk: null});
										let selectedContract = _.find(contracts, {Id: createOptions.selectedContract.Id});
										let willBePesConHeader = baseContract;
										if (willBePesConHeader.Id !== selectedContract.Id) {
											fillContract(selectedContract, willBePesConHeader);
										}
										let prcConfigurations = basicsLookupdataLookupDescriptorService.getData('prcConfiguration');
										let prcConfigHeaders = basicsLookupdataLookupDescriptorService.getData('PrcConfigHeader');
										if (prcConfigurations && prcConfigHeaders && selectedContract.PrcHeaderEntity.ConfigurationFk) {
											let config = _.find(prcConfigurations, {Id: selectedContract.PrcHeaderEntity.ConfigurationFk});
											if (config) {
												var configHeader = _.find(prcConfigHeaders, {Id: config.PrcConfigHeaderFk});
												if (configHeader && !configHeader.IsConsolidateChange && selectedContract) {
													willBePesConHeader = selectedContract;
												}
											}
										}

										if (!willBePesConHeader.PrcStructureFk && willBePesConHeader.PrcHeaderEntity) {
											willBePesConHeader.PrcStructureFk = willBePesConHeader.PrcHeaderEntity.StructureFk;

											if (!willBePesConHeader.PrcStructureFk) {
												let child = _.find(contracts, function (item) {
													return !!item.PrcStructureFk;
												});
												if (child) {
													willBePesConHeader.PrcStructureFk = child.PrcStructureFk;
												}
											}
										}

										return checkPes(willBePesConHeader).then(function (checkResult) {
											if (checkResult.headers.length > 0) {
												if (checkResult.items.length > 0) {
													return showOptionDialog(willBePesConHeader, checkResult.headers, checkResult.items, context, createOptions).then(function (result) {
														if (result.isOk) {
															return [willBePesConHeader.__createPes];
														} else {
															return [];
														}
													});
												} else {
													return showCoverConfirmDialog().then(function (ok) {
														if (ok) {
															if (ok.isIncluded) {
																createOptions.includeNonContractedItemInPrePes = true;
															}
															return createCompletely([willBePesConHeader], 0, context, createOptions, true).then(function () {
																return willBePesConHeader.__createPes ? [willBePesConHeader.__createPes] : [];
															});
														} else {
															return $q.when([]);
														}
													});
												}
											} else {
												return createCompletely([willBePesConHeader], 0, context, createOptions, true).then(function () {
													return willBePesConHeader.__createPes ? [willBePesConHeader.__createPes] : [];
												});
											}
										});
									});
								}
								return result;
							});
						}
					}
				];

				return _.find(processors, function (processor) {
					return processor.isCompetent(contracts);
				});
			}

			function getMergeItems(baseContractId, ids) {
				return $http.get(globals.webApiBaseUrl + 'procurement/pes/header/getmergeitems', {
					params: {
						baseContractId: baseContractId,
						prcItems: ids.join(':')
					}
				}).then(function (response) {
					return response.data;
				});
			}

			function getPesItems(pesHeaderId) {
				return $http.get(globals.webApiBaseUrl + 'procurement/pes/item/list?mainItemId=' + pesHeaderId);
			}

			function getConfiguration(contractId) {
				return $http.get(globals.webApiBaseUrl + 'procurement/pes/header/getconfiguration?contractId=' + contractId).then(function (response) {
					return response.data;
				});
			}

			function getInvalidPrcItems(contracts) {
				let headerIds = _.map(contracts, function (item) {
					return item.PrcHeaderFk;
				});

				return $http.get(globals.webApiBaseUrl + 'procurement/common/prcitem/listbyheaders', {
					params: {
						headerIds: headerIds.join(':')
					}
				}).then(function (response) {
					let invalidItems = _.filter(response.data, function (item) {
						return !item.MdcControllingunitFk;
					});
					_.each(invalidItems, function (item) {
						let contract = _.find(contracts, {PrcHeaderFk: item.PrcHeaderFk});
						item.__contractFK = contract.Id;
					});
					return invalidItems;
				});
			}

			function getBaseNChangeOrderContractsByBaseIds(ids) {
				return $http.post(globals.webApiBaseUrl + 'procurement/contract/header/getbasewithchangeordersbybaseids', ids);
			}

			function getInvalidPrcBoq(contracts) {

				let getStructurePromise = $http.get(globals.webApiBaseUrl + 'basics/procurementstructure/getdefaultstructure4pesboq');
				let getMergedBoqsPromise = getMergedPrcBoqsByContracts(contracts);
				let baseIds = _.map(contracts, function (con) {
					return con.Id;
				});
				let getBaseNCOContractsPromise = getBaseNChangeOrderContractsByBaseIds(baseIds);

				return $q.all([getStructurePromise, getMergedBoqsPromise, getBaseNCOContractsPromise]).then(function (result) {
					if (!result) {
						return {
							contractsWithoutStructure: [],
							pesBoqsWithoutControllingUnits: []
						};
					}
					let defaultStructure = result[0] ? result[0].data : null;
					let mergedPrcBoqs = result[1] ? result[1].data : null;
					let baseNCOContracts = result[2] ? result[2].data : null;

					let contractsWithoutStructure = [];
					let pesBoqsWithoutControllingUnits = [];

					if (!defaultStructure) {
						contractsWithoutStructure = _.filter(contracts, function (c) {
							return !c.PrcStructureFk;
						});
					} else {
						_.forEach(contracts, function (contract) {
							if (!contract.PrcStructureFk) {
								contract.PrcStructureFk = defaultStructure.Id;
							}
						});
					}

					if (mergedPrcBoqs && mergedPrcBoqs.length > 0) {
						_.forEach(mergedPrcBoqs, function (boq) {
							if (!boq.ControllingUnitFk) {
								let contract = _.find(baseNCOContracts, {PrcHeaderFk: boq.PrcHeaderFk});
								if (contract) {
									contract = _.find(contracts, function (con) {
										return (con.Id === contract.Id || con.Id === contract.ConHeaderFk);
									});
								}

								boq.__contractFK = contract.Id;
								pesBoqsWithoutControllingUnits.push(boq);
							}
						});
					}

					_.each(contractsWithoutStructure, function (item) {
						item.__contractFK = item.Id;
						item.__withoutStructure = true;
					});

					return {
						contractsWithoutStructure: contractsWithoutStructure,
						pesBoqsWithoutControllingUnits: pesBoqsWithoutControllingUnits
					};
				});
			}

			function getInvalidContracts(contracts) {
				return $http.post(globals.webApiBaseUrl + 'procurement/contract/header/updatedefaultclerkids4contractinfo', contracts).then(function (result) {
					if (!result) {
						return {
							contractsWithoutClerkPrc: []
						};
					}
					let updateContracts = result.data;
					let contractsWithoutClerkPrc;

					_.forEach(updateContracts, function (contract) {
						let found = _.find(contracts, {Id: contract.Id});
						if (found) {
							found.ClerkPrcFk = contract.ClerkPrcFk;
							found.ClerkReqFk = contract.ClerkReqFk;
						}
					});

					contractsWithoutClerkPrc = _.filter(contracts, function (c) {
						return !c.ClerkPrcFk;
					});

					_.each(contractsWithoutClerkPrc, function (item) {
						item.__contractFK = item.Id;
						item.__withoutClerkPrc = true;
					});

					return {
						contractsWithoutClerkPrc: contractsWithoutClerkPrc
					};
				});
			}

			function checkContractsStatus(contracts) {
				return $http.get(globals.webApiBaseUrl + 'procurement/contract/header/checkcontractsstatusvalid?contractId=' + contracts[0].Id + '&configurationFk=' + contracts[0].PrcHeaderEntity.ConfigurationFk).then(function (response) {
					return response.data;
				});
			}

			function asyncValidate(/* contracts */) {
				return $q.when({isValid: true});
			}

			function getPes(contract) {
				return $http.get(globals.webApiBaseUrl + 'procurement/pes/header/listbycontract?contractId=' + contract.Id + '&readOnly=false').then(function (response) {
					return response.data;
				});
			}

			function getNewChangeItems(baseContract, pesHeader) {
				return $http.get(globals.webApiBaseUrl + 'procurement/pes/header/listnewitem?contractId=' + baseContract.Id + '&pesId=' + pesHeader.Id).then(function (response) {
					return response.data;
				});
			}

			function getItemsForCreate(contractId, pesHeaderId, extOpts) {
				let itemFilter = _.extend({
					IsCanceled: false,
					ContractId: contractId,
					PesHeaderId: pesHeaderId,
					isConsolidateChange: true
				}, extOpts);

				return $http.post(globals.webApiBaseUrl + 'procurement/common/prcitem/getitems4create', itemFilter);
			}

			function createBatch(contracts, createOptions) {

				loadingService.show();
				let options = angular.extend({
					onCreating: function (ctx) {
						if (ctx.caseType === 1) {
							loadingService.setInfo($translate.instant('procurement.pes.processingCreatePes', {
								current: ctx.processIndex + 1,
								total: contracts.length
							}));
						}
					},
					selectedContract: contracts[0]
				}, createOptions);

				return $q.all([getInvalidPrcBoq(contracts), getInvalidPrcItems(contracts), getInvalidContracts(contracts), checkContractsStatus(contracts)]).then(function (result) {

					let invalidBoqs = result[0], invalidItems = result[1], invalidContracts = result[2], baseNCOContractsStatusValid = result[3];
					let contractsWithoutStructure = invalidBoqs ? invalidBoqs.contractsWithoutStructure : [];
					let pesBoqsWithoutControllingUnit = invalidBoqs ? invalidBoqs.pesBoqsWithoutControllingUnits : [];
					let contractsWithoutClerkPrc = invalidContracts ? invalidContracts.contractsWithoutClerkPrc : [];
					let validContracts = [], inValidContracts = [];

					if (!baseNCOContractsStatusValid) {
						loadingService.hide();
						return platformModalService.showErrorBox('procurement.contract.wizard.isActiveMessage', 'procurement.contract.wizard.isActivateCaption');
					}
					else {
						if (invalidItems.length > 0 || contractsWithoutStructure.length > 0 || contractsWithoutClerkPrc.length > 0 || pesBoqsWithoutControllingUnit) {
							_.each(contracts, function (item) {
								let isIncludeItems = (_.some(invalidItems, {__contractFK: item.Id}) && !item.ControllingUnitFk),
									isIncludeBoqs = _.some(contractsWithoutStructure, {__contractFK: item.Id}),
									isIncludeContractsWithoutClerkPrc = _.some(contractsWithoutClerkPrc, {__contractFK: item.Id}),
									isIncludePesBoqsWithoutControllingUnit = _.some(pesBoqsWithoutControllingUnit, {__contractFK: item.Id}) && !item.ControllingUnitFk;
								if (isIncludeItems || isIncludeBoqs || isIncludeContractsWithoutClerkPrc || isIncludePesBoqsWithoutControllingUnit) {
									if (isIncludeItems) {
										item.__invalidItemType = true;
									}
									if (isIncludeBoqs) {
										item.__invalidBoqType = true;
									}
									if (isIncludePesBoqsWithoutControllingUnit) {
										item.__invalidBoqType = true;
										item.__withoutControllingUnit = true;
									}
									if (isIncludeContractsWithoutClerkPrc) {
										item.__invalidContractType = true;
									}
									inValidContracts.push(item);
								} else {
									validContracts.push(item);
								}
							});
						} else {
							validContracts = contracts;
						}

						return validContracts.length > 0 ? asyncValidate(validContracts).then(function (validateResult) {
							if (validateResult.isValid) {
								return getChangeOrders(validContracts).then(function (children) {
									loadingService.hide();
									return getProcessor(validContracts, children).process(validContracts, {
										lookups: {
											ConHeaderView: validContracts
										}
									}, options).then(function (result) {
										loadingService.hide();
										return {
											success: result ? result.length > 0 : false,
											caseType: options.caseType,
											headers: result,
											skipContracts: inValidContracts
										};
									}, function () {
										loadingService.hide();
										return {success: false};
									});
								});
							} else {
								return {success: false};
							}
						}) : $q.when([]).then(function () {
							loadingService.hide();
							return {
								success: false,
								caseType: options.caseType,
								headers: [],
								skipContracts: inValidContracts
							};
						});
					}
				})
					.then(function (ctx) {
						for (var i = 0, skipMsgs = [], skipContracts = (ctx.skipContracts || []); i < skipContracts.length; i++) {
							var contract = skipContracts[i];
							if (contract.__invalidItemType || (contract.__invalidBoqType && contract.__withoutControllingUnit)) {
								skipMsgs.push($translate.instant('procurement.pes.createPesSkipContracts', {contracts: contract.Code}));
							}
							if (contract.__invalidBoqType) {
								if (contract.__withoutStructure) {
									skipMsgs.push($translate.instant('procurement.pes.createPesSkipContractsByInvalidBoq', {contracts: contract.Code}));
								}
							}
							if (contract.__invalidContractType) {
								if (contract.__withoutClerkPrc) {
									skipMsgs.push($translate.instant('procurement.pes.createPesDefaultPrcClerkRequired', {contracts: contract.Code}));
								}
							}
						}
						if (ctx.success && ctx.headers && ctx.headers.length > 0) {
							if (ctx.headers.length > 1) {
								if (ctx.skipContracts && ctx.skipContracts.length > 0) {
									showDialog($translate.instant('procurement.pes.createPesSuccessfully') + '<br/>' + skipMsgs.join('<br>'));
								} else {
									showDialog($translate.instant('procurement.pes.createPesSuccessfully'));
								}
							} else {
								if (ctx.skipContracts && ctx.skipContracts.length > 0) {
									showDialog($translate.instant('procurement.pes.createPesSuccessfully') + '<br/>' + skipMsgs.join('<br>'));
								} else {
									showDialog($translate.instant('procurement.pes.createPesSuccessfully')+ '<br/>' +$translate.instant('procurement.contract.wizard.newCode',{newCode:ctx.headers[0].Code}), [{
										buttonText: $translate.instant('procurement.pes.createPesGotoPes'),
										fn: function () {
											navigateService.navigate({
												moduleName: 'procurement.pes'
											}, ctx.headers[0], 'Id');
										}
									}]);
								}
							}
						} else {
							if (skipMsgs.length > 0) {
								showDialog(skipMsgs.join('<br>'));
							}
						}
					});
			}

			function showDialog(textContent, buttons, options) {
				return platformModalService.showDialog(angular.extend({
					templateUrl: globals.appBaseUrl + 'procurement.pes/partials/procurement-pes-wizard-create-dialog-template.html',
					backdrop: false,
					controller: ['$scope', function ($scope) {

						$scope.modalOptions = {
							headerText: $translate.instant('procurement.pes.createPesTitle'),
							cancel: function () {
								$scope.$close({isOk: false});
							}
						};

						let userButtons = angular.isArray(buttons) ? buttons : [];
						if (userButtons.length === 0) {
							userButtons.push({
								buttonText: $translate.instant('cloud.common.ok'),
								__fn: function () {
									$scope.$close({isOk: true});
								}
							});
						} else {
							_.each(userButtons, function (button) {
								button.__fn = function () {
									$scope.$close();
									if (angular.isFunction(button.fn)) {
										button.fn();
									}
								};
							});
						}

						$scope.iconStyle = 'ico-info';
						$scope.buttons = userButtons;
						$scope.textContent = textContent;
						$scope.trustAsHtml = $sce.trustAsHtml;

					}],
					width: '600px',
					height: '200px',
					resizeable: false
				}, options));
			}

			return {
				showDialog: showDialog,
				createBatch: createBatch
			};

			function removeFields(item) {
				if (item) {
					let fields = ['Code', 'DocumentDate', 'DateDeliveredFrom', 'DateDelivered', 'DateEffective'];
					for (let i = 0; i < fields.length; i++) {
						delete item[fields[i]];
					}
				}
			}
		}]);

})(angular);