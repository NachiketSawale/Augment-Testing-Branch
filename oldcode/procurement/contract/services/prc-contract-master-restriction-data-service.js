/**
 * Created by lvy on 3/5/2019.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	let moduleName = 'procurement.contract';
	angular.module(moduleName).factory('procurementContractMasterRestrictionDataService',
		['$q', '$injector', '$http', 'platformDataServiceFactory', 'procurementContractHeaderDataService', 'platformRuntimeDataService',
			'contractHeaderPurchaseOrdersDataService',
			'basicsCommonBusinessDecorator', 'basicsLookupdataLookupFilterService', '_',
			'basicsLookupdataLookupDescriptorService',
			'boqMainLookupFilterService', 'globals', 'procurementCopyMode',
			'procurementCommonMasterRestrictionType',
			'procurementCommonMasterRestrictionPrjBoqLookupDataService',
			function ($q, $injector, $http, dataServiceFactory, parentService, platformRuntimeDataService, contractHeaderPurchaseOrdersDataService, basicsCommonBusinessDecorator, basicsLookupdataLookupFilterService, _, basicsLookupdataLookupDescriptorService, boqMainLookupFilterService, globals, procurementCopyMode,
				procurementCommonMasterRestrictionType,
				procurementCommonMasterRestrictionPrjBoqLookupDataService) {
				let serviceContainer;
				let service;
				let setReadonlyor;
				let isCreatingFromHeader = false;
				let frameworkMdcCatalogFk = null;
				let conBoqHeaderLookupDataService = null;
				let mRBoqHeaderLookupDataService = null;
				let httpRoute = globals.webApiBaseUrl + 'procurement/contract/masterrestriction/';
				let serviceOption = {
					flatLeafItem: {
						module: angular.module(moduleName),
						serviceName: 'procurementContractMasterRestrictionDataService',
						httpCreate: {route: httpRoute,
							endCreate: 'createnew',
							usePostForRead: true,
						},
						httpRead: {route: httpRoute},
						presenter: {
							list: {
								initCreationData: function initCreationData(creationData) {
									creationData.MainItemId = parentService.getSelected().Id;
								},
								incorporateDataRead: function incorporateDataRead(readItems, data) {
									let Isreadonly = !setReadonlyor();
									let dataList = [];

									if (angular.isArray(readItems)) {
										dataList = readItems;
									} else if (angular.isObject(readItems)) {
										dataList = readItems.Main;
										cacheContractBoqHeaderLookupData(readItems.conBoqHeaders);
										cachePackageBoqHeaderLookupData(readItems.boqHeadsBasePackage);
										basicsLookupdataLookupDescriptorService.attachData(readItems || {});
									}

									let dataRead = serviceContainer.data.handleReadSucceeded(dataList, data, true);
									if (Isreadonly) {
										service.setFieldReadonly(dataList);
									}
									updateBoqFilter();
									return dataRead;
								},
								handleCreateSucceeded: function (item) {
									if (isCreatingFromHeader && frameworkMdcCatalogFk) {
										item.MdcMaterialCatalogFk = frameworkMdcCatalogFk;
										item.CopyType = procurementCommonMasterRestrictionType.material;
										item.isFromHeaderMdcCatalog = true;
										isCreatingFromHeader = false;
										frameworkMdcCatalogFk = null;
									}
								}
							}
						},
						entityRole: {
							leaf: {
								itemName: 'ConMasterRestriction',
								parentService: parentService
							}
						},
						dataProcessor: [
							{
								processItem: function (dataItem) {
									let contract = parentService.getSelected();
									platformRuntimeDataService.readonly(dataItem, !!contract && contractHeaderPurchaseOrdersDataService.isCallOff(contract));
									setReadonlyBaseCopyType(dataItem, dataItem.CopyType);

								}
							}
						]
					}
				};

				serviceContainer = dataServiceFactory.createNewComplete(serviceOption);
				service = serviceContainer.service;

				setReadonlyor = function () {
					let getModuleStatusFn = parentService.getItemStatus || parentService.getModuleState;
					if (getModuleStatusFn) {
						let status = getModuleStatusFn();
						return !(status.IsReadOnly || status.IsReadonly);
					}
					return false;
				};
				let canCreate = serviceContainer.service.canCreate;
				service.canCreate = function () {
					return canCreate() && setReadonlyor();
				};
				let canDelete = serviceContainer.service.canDelete;
				service.canDelete = function () {
					return canDelete() && setReadonlyor();
				};

				let readonlyFields = [{field: 'MdcMaterialCatalogFk', readonly: true},
					{field: 'BoqWicCatFk', readonly: true},
					{field: 'BoqItemFk', readonly: true},
					{field: 'ProjectFk', readonly: true},
					{field: 'PrjBoqFk', readonly: true},
					{field: 'PackageFk', readonly: true},
					{field: 'PackageBoqHeaderFk', readonly: true},
					{field: 'ConHeaderBoqFk', readonly: true},
					{field: 'ConBoqHeaderFk', readonly: true}
				];

				service.setFieldReadonly = function (items) {
					if (_.isArray(items)) {
						_.forEach(items, function (item) {
							platformRuntimeDataService.readonly(item, readonlyFields);
						});
					}
				};

				let filters = [
					{
						key: 'master-restriction-boq-item-filter',
						serverSide: false,
						fn: function (dataItem) {
							return !dataItem.IsDisabled;
						}
					},
					{
						key: 'con-master-restriction-contract-filter',
						serverKey: 'con-master-restriction-contract-filter',
						serverSide: true,
						fn: function () {
							let filter = {};
							let parentSelected = parentService.getSelected();
							if (!parentSelected || !parentSelected.ProjectFk) {
								return;
							}
							let project = parentSelected.ProjectFk;
							if (project) {
								filter.ProjectFk = project;
							}

							return filter;
						}
					},
					{
						key: 'master-restriction-package-filter',
						serverSide: true,
						fn: function () {
							let filter = {};
							let parentSelected = parentService.getSelected();
							if (!parentSelected || !parentSelected.ProjectFk) {
								return;
							}
							let project = parentSelected.ProjectFk;
							if (project) {
								filter.ProjectFk = project;
							}

							return filter;
						}
					}
				];

				_.each(filters, function (filter) {
					if (!basicsLookupdataLookupFilterService.hasFilter(filter.key)) {
						basicsLookupdataLookupFilterService.registerFilter(filter);
					}
				});

				basicsCommonBusinessDecorator.decorateContainer(serviceContainer, {
					readonlyCallback: function () {
						let contract = parentService.getSelected();
						return !!contract && contractHeaderPurchaseOrdersDataService.isCallOff(contract);
					}
				});

				// #99136 - Call Off Type Contract Update
				contractHeaderPurchaseOrdersDataService.purchaseUpdatedMessage.register(function (e, args) {
					if (contractHeaderPurchaseOrdersDataService.isCallOff(args.contract)) {
						service.deleteAllEntities();

						let data = {
							FromConHeaderId: args.contract.ContractHeaderFk,
							ToConHeaderId: args.contract.Id
						};

						$http.post(globals.webApiBaseUrl + 'procurement/contract/masterrestriction/copy', data).then(function (res) {
							service.addEntities(res.data);
						});
					}

					service.updateToolsMessage.fire();
				});

				parentService.boqFilterSettingChanged.register(updateBoqFilter);
				service.updateBoqFilter = updateBoqFilter;
				service.setReadonlyBaseCopyType = setReadonlyBaseCopyType;

				function headerMdcCatalogChanged(e, arg) {
					let list = service.getList();
					if (arg.newValue) {
						isCreatingFromHeader = false;
						frameworkMdcCatalogFk = null;
						let existSameCatalog;
						if (list) {
							let oldCreatedCatalogs = _.filter(list, {ConHeaderFk: arg.headerId, MdcMaterialCatalogFk: arg.oldValue, Version: 0, isFromHeaderMdcCatalog: true});
							if (oldCreatedCatalogs && oldCreatedCatalogs.length) {
								service.deleteEntities(oldCreatedCatalogs);
							}
						}
						existSameCatalog = _.find(list, {ConHeaderFk: arg.headerId, MdcMaterialCatalogFk: arg.newValue});
						if (!existSameCatalog) {
							isCreatingFromHeader = true;
							frameworkMdcCatalogFk = arg.newValue;
							service.createItem().finally(function() {
								isCreatingFromHeader = false;
								frameworkMdcCatalogFk = null;
							});
						}
					}
					else {
						if (list) {
							let sameCatalogs = _.filter(list, {MdcMaterialCatalogFk: arg.oldValue, Version: 0, isFromHeaderMdcCatalog: true});
							if (sameCatalogs && sameCatalogs.length) {
								service.deleteEntities(sameCatalogs);
							}
						}
					}
				}
				parentService.frameworkMdcCatalogChanged.register(headerMdcCatalogChanged);

				return service;

				// ///////////////////////////
				function cacheContractBoqHeaderLookupData(headers) {
					conBoqHeaderLookupDataService = conBoqHeaderLookupDataService || $injector.get('procurementCommonMasterRestrictionContractBoqHeaderService');
					conBoqHeaderLookupDataService.setContractBoqHeaderCache(headers);
				}

				function cachePackageBoqHeaderLookupData(boqHeaderLookupData) {
					boqHeaderLookupData.forEach(function (b) {
						b.BoqNumber = b.Reference;
					});
					mRBoqHeaderLookupDataService = mRBoqHeaderLookupDataService || $injector.get('procurementCommonMasterRestrictionBoqHeaderLookupDataService');
					mRBoqHeaderLookupDataService.setBoqHeaderBasePackageCache(boqHeaderLookupData);
				}

				function setReadonlyBaseCopyType(entity, value) {
					if (value === procurementCommonMasterRestrictionType.wicBoq) {
						platformRuntimeDataService.readonly(entity, [{field: 'MdcMaterialCatalogFk', readonly: true}]);
						platformRuntimeDataService.readonly(entity, [{field: 'ProjectFk', readonly: true}]);
						platformRuntimeDataService.readonly(entity, [{field: 'PrjBoqFk', readonly: true}]);
						platformRuntimeDataService.readonly(entity, [{field: 'PackageFk', readonly: true}]);
						platformRuntimeDataService.readonly(entity, [{field: 'PackageBoqHeaderFk', readonly: true}]);
						platformRuntimeDataService.readonly(entity, [{field: 'BoqWicCatFk', readonly: false}]);
						platformRuntimeDataService.readonly(entity, [{field: 'BoqItemFk', readonly: false}]);
						platformRuntimeDataService.readonly(entity, [{field: 'ConHeaderBoqFk', readonly: true}]);
						platformRuntimeDataService.readonly(entity, [{field: 'ConBoqHeaderFk', readonly: true}]);

					} else if (value === procurementCommonMasterRestrictionType.prjBoq) {
						platformRuntimeDataService.readonly(entity, [{field: 'MdcMaterialCatalogFk', readonly: true}]);
						platformRuntimeDataService.readonly(entity, [{field: 'ProjectFk', readonly: false}]);
						platformRuntimeDataService.readonly(entity, [{field: 'PrjBoqFk', readonly: false}]);
						platformRuntimeDataService.readonly(entity, [{field: 'PackageFk', readonly: true}]);
						platformRuntimeDataService.readonly(entity, [{field: 'PackageBoqHeaderFk', readonly: true}]);
						platformRuntimeDataService.readonly(entity, [{field: 'BoqWicCatFk', readonly: true}]);
						platformRuntimeDataService.readonly(entity, [{field: 'BoqItemFk', readonly: true}]);
						platformRuntimeDataService.readonly(entity, [{field: 'ConHeaderBoqFk', readonly: true}]);
						platformRuntimeDataService.readonly(entity, [{field: 'ConBoqHeaderFk', readonly: true}]);
					} else if (value === procurementCommonMasterRestrictionType.packageBoq) {
						platformRuntimeDataService.readonly(entity, [{field: 'MdcMaterialCatalogFk', readonly: true}]);
						platformRuntimeDataService.readonly(entity, [{field: 'ProjectFk', readonly: true}]);
						platformRuntimeDataService.readonly(entity, [{field: 'PrjBoqFk', readonly: true}]);
						platformRuntimeDataService.readonly(entity, [{field: 'PackageFk', readonly: false}]);
						platformRuntimeDataService.readonly(entity, [{field: 'PackageBoqHeaderFk', readonly: false}]);
						platformRuntimeDataService.readonly(entity, [{field: 'BoqWicCatFk', readonly: true}]);
						platformRuntimeDataService.readonly(entity, [{field: 'BoqItemFk', readonly: true}]);
						platformRuntimeDataService.readonly(entity, [{field: 'ConHeaderBoqFk', readonly: true}]);
						platformRuntimeDataService.readonly(entity, [{field: 'ConBoqHeaderFk', readonly: true}]);
					} else if (value === procurementCommonMasterRestrictionType.material) {
						platformRuntimeDataService.readonly(entity, [{field: 'MdcMaterialCatalogFk', readonly: false}]);
						platformRuntimeDataService.readonly(entity, [{field: 'ProjectFk', readonly: true}]);
						platformRuntimeDataService.readonly(entity, [{field: 'PrjBoqFk', readonly: true}]);
						platformRuntimeDataService.readonly(entity, [{field: 'PackageFk', readonly: true}]);
						platformRuntimeDataService.readonly(entity, [{field: 'PackageBoqHeaderFk', readonly: true}]);
						platformRuntimeDataService.readonly(entity, [{field: 'BoqWicCatFk', readonly: true}]);
						platformRuntimeDataService.readonly(entity, [{field: 'BoqItemFk', readonly: true}]);
						platformRuntimeDataService.readonly(entity, [{field: 'ConHeaderBoqFk', readonly: true}]);
						platformRuntimeDataService.readonly(entity, [{field: 'ConBoqHeaderFk', readonly: true}]);
					} else if (value === procurementCommonMasterRestrictionType.contractBoq) {
						platformRuntimeDataService.readonly(entity, [{field: 'MdcMaterialCatalogFk', readonly: true}]);
						platformRuntimeDataService.readonly(entity, [{field: 'ProjectFk', readonly: true}]);
						platformRuntimeDataService.readonly(entity, [{field: 'PrjBoqFk', readonly: true}]);
						platformRuntimeDataService.readonly(entity, [{field: 'PackageFk', readonly: true}]);
						platformRuntimeDataService.readonly(entity, [{field: 'PackageBoqHeaderFk', readonly: true}]);
						platformRuntimeDataService.readonly(entity, [{field: 'BoqWicCatFk', readonly: true}]);
						platformRuntimeDataService.readonly(entity, [{field: 'BoqItemFk', readonly: true}]);
						platformRuntimeDataService.readonly(entity, [{field: 'ConHeaderBoqFk', readonly: false}]);
						platformRuntimeDataService.readonly(entity, [{field: 'ConBoqHeaderFk', readonly: false}]);
					}
				}

				function updateBoqFilter(boqType) {
					let wicGroupIds = [];
					let projectIds = [];
					let mainItemId2BoqHeaderIds = null;
					let contractIds = [];
					let packageIds = [];
					let materialCatalogIds = [];
					let oriWicGroupIds = boqMainLookupFilterService.boqHeaderLookupFilter.wicGroupIds;
					let oriProjectIds = boqMainLookupFilterService.boqHeaderLookupFilter.projectIds;
					let oriContractIds = boqMainLookupFilterService.boqHeaderLookupFilter.contractIds;
					let oriMainItemId2BoqHeaderIds = boqMainLookupFilterService.boqHeaderLookupFilter.mainItemId2BoqHeaderIds;
					let oriPackageIds = boqMainLookupFilterService.boqHeaderLookupFilter.packageIds;
					let oriMaterialCatalogIds = boqMainLookupFilterService.boqHeaderLookupFilter.materialCatalogIds;
					let isFilterCaseChanged = false;

					let parentItem = parentService.getSelected();

					if (parentItem && parentItem.PrcCopyModeFk === procurementCopyMode.CurrentPackageOnly) {
						return;
					}

					if (!(parentItem &&
						((parentItem.PrcCopyModeFk === procurementCopyMode.OnlyAllowedCatalogs) ||
							(parentItem.PrcCopyModeFk === procurementCopyMode.NoRestrictions4StandardUser && globals.portal)))) {
						wicGroupIds = addHeadermBoqWicGroup2GroupIds(parentItem, wicGroupIds);
						asyncAddHeadermBoqWicBoq2BoqHeaderIds(parentItem, mainItemId2BoqHeaderIds).then(function(newMainItem2BoqHeaderIds) {
							boqMainLookupFilterService.setSelectedMainItemId2BoqHeaderIds(newMainItem2BoqHeaderIds);
						});

						isFilterCaseChanged = getIsFilterCaseChanged({
							wicGroupIds: wicGroupIds,
							oriWicGroupIds: oriWicGroupIds,
							projectIds: projectIds,
							oriProjectIds: oriProjectIds,
							contractIds: contractIds,
							oriContractIds: oriContractIds,
							mainItemId2BoqHeaderIds: mainItemId2BoqHeaderIds,
							oriMainItemId2BoqHeaderIds: oriMainItemId2BoqHeaderIds,
							packageIds: packageIds,
							oriPackageIds: oriPackageIds,
							materialCatalogIds: materialCatalogIds,
							oriMaterialCatalogIds: oriMaterialCatalogIds
						});

						if (isFilterCaseChanged) {
							boqMainLookupFilterService.setSelectedProject(null);
							boqMainLookupFilterService.boqHeaderLookupFilter.projectId = 0;
							boqMainLookupFilterService.setSelectedBoqHeader(null);
						}

						boqMainLookupFilterService.setSelectedWicGroupIds(wicGroupIds);
						boqMainLookupFilterService.setSelectedProjectIds(projectIds);
						boqMainLookupFilterService.setSelectedContractIds(contractIds);
						boqMainLookupFilterService.setSelectedPackageIds(packageIds);
						boqMainLookupFilterService.setSelectedMaterialCatalogIds(materialCatalogIds);
						return;
					}

					let list = service.getList();

					boqType = boqType || boqMainLookupFilterService.boqHeaderLookupFilter.boqType;
					let selectedWicGroupId = boqMainLookupFilterService.boqHeaderLookupFilter.boqGroupId;
					let selectedProjectId = boqMainLookupFilterService.boqHeaderLookupFilter.projectId;

					if (boqType === 1) {
						wicGroupIds = [-1]; // To force empty wic group and boq list
					} else if (boqType === 2 || boqType === 4 || boqType === 7) {
						projectIds = [-1];
						if (boqType === 4) {
							packageIds = [-1];
						} else if (boqType === 7) {
							contractIds = [-1];
						}
					}

					if (!list || list.length === 0 || (boqType !== 1 && boqType !== 2 && boqType !== 4 && boqType !== 7)) {
						isFilterCaseChanged = getIsFilterCaseChanged({
							wicGroupIds: wicGroupIds,
							oriWicGroupIds: oriWicGroupIds,
							projectIds: projectIds,
							oriProjectIds: oriProjectIds,
							contractIds: contractIds,
							oriContractIds: oriContractIds,
							mainItemId2BoqHeaderIds: mainItemId2BoqHeaderIds,
							oriMainItemId2BoqHeaderIds: oriMainItemId2BoqHeaderIds,
							packageIds: packageIds,
							oriPackageIds: oriPackageIds,
							materialCatalogIds: materialCatalogIds,
							oriMaterialCatalogIds: oriMaterialCatalogIds
						});

						if (isFilterCaseChanged) {
							boqMainLookupFilterService.setSelectedProject(null);
							boqMainLookupFilterService.boqHeaderLookupFilter.projectId = 0;
							boqMainLookupFilterService.setSelectedBoqHeader(null);
						}
						wicGroupIds = addHeadermBoqWicGroup2GroupIds(parentItem, wicGroupIds);
						asyncAddHeadermBoqWicBoq2BoqHeaderIds(parentItem, mainItemId2BoqHeaderIds).then(function(newMainItem2BoqHeaderIds) {
							boqMainLookupFilterService.setSelectedMainItemId2BoqHeaderIds(newMainItem2BoqHeaderIds);
						});
						boqMainLookupFilterService.setSelectedWicGroupIds(wicGroupIds);
						boqMainLookupFilterService.setSelectedProjectIds(projectIds);
						boqMainLookupFilterService.setSelectedContractIds(contractIds);
						boqMainLookupFilterService.setSelectedPackageIds(packageIds);
						boqMainLookupFilterService.setSelectedMaterialCatalogIds(materialCatalogIds);
						return;
					}

					let visiblities = globals.portal ? [2, 3] : [1, 3];
					_.forEach(list, function (item) {
						if (!_.includes(visiblities, item.Visibility)) {
							return;
						}

						if (boqType === 1) {
							if (item.CopyType === procurementCommonMasterRestrictionType.wicBoq) {
								if (item.BoqWicCatFk) {
									if (!_.includes(wicGroupIds, item.BoqWicCatFk)) {
										wicGroupIds.push(item.BoqWicCatFk);
									}

									if (item.BoqHeaderFk && (selectedWicGroupId === 0 || item.BoqWicCatFk === selectedWicGroupId)) {
										mainItemId2BoqHeaderIds = mainItemId2BoqHeaderIds || {};
										mainItemId2BoqHeaderIds[item.BoqWicCatFk] = mainItemId2BoqHeaderIds[item.BoqWicCatFk] || [];
										if (!_.includes(mainItemId2BoqHeaderIds[item.BoqWicCatFk], item.BoqHeaderFk)) {
											mainItemId2BoqHeaderIds[item.BoqWicCatFk].push(item.BoqHeaderFk);
										}
									}
								}

							} else if (item.CopyType === procurementCommonMasterRestrictionType.material) {
								if (item.MdcMaterialCatalogFk && !_.includes(materialCatalogIds, item.MdcMaterialCatalogFk)) {
									materialCatalogIds.push(item.MdcMaterialCatalogFk);
								}
							}
						} else if (boqType === 2 && item.CopyType === procurementCommonMasterRestrictionType.prjBoq) {
							if (item.ProjectFk) {
								if (!_.includes(projectIds, item.ProjectFk)) {
									projectIds.push(item.ProjectFk);
								}

								if (item.PrjBoqFk) {
									let prjBoqs = basicsLookupdataLookupDescriptorService.getData('PrjBoq');
									let prjBoq = null;
									let boqHeaderId = null;
									if (prjBoqs) {
										prjBoq = prjBoqs[item.PrjBoqFk];
									}
									if (!prjBoq) {
										prjBoq = procurementCommonMasterRestrictionPrjBoqLookupDataService.getItemById(item.PrjBoqFk, {lookupType: 'procurementCommonMasterRestrictionPrjBoqLookupDataService'});
										boqHeaderId = (prjBoq && prjBoq.BoqHeader && prjBoq.BoqHeader.Id) || null;
									} else {
										boqHeaderId = prjBoq.BoqHeaderFk || null;
									}
									if (boqHeaderId) {
										mainItemId2BoqHeaderIds = mainItemId2BoqHeaderIds || {};
										mainItemId2BoqHeaderIds[item.ProjectFk] = mainItemId2BoqHeaderIds[item.ProjectFk] || [];
										if (!_.includes(mainItemId2BoqHeaderIds[item.ProjectFk], boqHeaderId)) {
											mainItemId2BoqHeaderIds[item.ProjectFk].push(boqHeaderId);
										}
									}
								}
							}
						} else if (boqType === 4 && item.CopyType === procurementCommonMasterRestrictionType.packageBoq) {
							if (item.PackageFk) {
								let packagelookups = basicsLookupdataLookupDescriptorService.getData('PrcPackage');
								if (packagelookups) {
									let packagelookup = packagelookups[item.PackageFk];
									if (packagelookup && packagelookup.ProjectFk) {
										if (!_.includes(projectIds, packagelookup.ProjectFk)) {
											projectIds.push(packagelookup.ProjectFk);
										}

										if (!_.includes(packageIds, item.PackageFk)) {
											packageIds.push(item.PackageFk);
										}

										if (item.BoqHeaderFk) {
											mainItemId2BoqHeaderIds = mainItemId2BoqHeaderIds || {};
											mainItemId2BoqHeaderIds[item.PackageFk] = mainItemId2BoqHeaderIds[item.PackageFk] || [];
											if (!_.includes(mainItemId2BoqHeaderIds[item.PackageFk], item.BoqHeaderFk)) {
												mainItemId2BoqHeaderIds[item.PackageFk].push(item.BoqHeaderFk);
											}
										}
									}
								}
							}
						} else if (boqType === 7 && item.CopyType === procurementCommonMasterRestrictionType.contractBoq) {
							if (item.ConHeaderBoqFk) {
								let contractLookups = basicsLookupdataLookupDescriptorService.getData('conheaderview');
								if (contractLookups) {
									let contractLookup = contractLookups[item.ConHeaderBoqFk];
									if (contractLookup && contractLookup.ProjectFk) {
										if (!_.includes(projectIds, contractLookup.ProjectFk)) {
											projectIds.push(contractLookup.ProjectFk);
										}

										if (!_.includes(contractIds, item.ConHeaderBoqFk)) {
											contractIds.push(item.ConHeaderBoqFk);
										}

										if (item.ConBoqHeaderFk) {
											mainItemId2BoqHeaderIds = mainItemId2BoqHeaderIds || {};
											mainItemId2BoqHeaderIds[item.ConHeaderBoqFk] = mainItemId2BoqHeaderIds[item.ConHeaderBoqFk] || [];
											if (!_.includes(mainItemId2BoqHeaderIds[item.ConHeaderBoqFk], item.ConBoqHeaderFk)) {
												mainItemId2BoqHeaderIds[item.ConHeaderBoqFk].push(item.ConBoqHeaderFk);
											}
										}
									}
								}
							}
						}
					});

					if (boqType === 1 && wicGroupIds.length > 0 && selectedWicGroupId) { // if the selected Wic Group is not defined in the master restriction and master restriction has value with copy type wic group, no boq shows.
						let isWicGroupIdIncluded = _.includes(wicGroupIds, selectedWicGroupId);
						if (!isWicGroupIdIncluded) {
							mainItemId2BoqHeaderIds = {};
							_.forEach(wicGroupIds, function (groupId) {
								mainItemId2BoqHeaderIds[groupId] = [-1];
							});
							mainItemId2BoqHeaderIds[selectedWicGroupId] = [-1];
						}
					} else if (boqType === 4 && angular.isArray(projectIds) && projectIds.length > 0 && selectedProjectId) { // if the seleced Project is not defined in the master restriction and master restriction has value with copy type project or package, no boq shows.
						let isProjectIdIncluded = _.includes(projectIds, selectedProjectId);
						if (!isProjectIdIncluded) {
							packageIds = [-1];
						}
					} else if (boqType === 7 && angular.isArray(projectIds) && projectIds.length > 0 && selectedProjectId) {
						let isProjectIdIncluded2 = _.includes(projectIds, selectedProjectId);
						if (!isProjectIdIncluded2) {
							contractIds = [-1];
						}
					}

					if (boqType === 2) {
						if (selectedProjectId && !projectIds.includes(selectedProjectId)) {
							if (mainItemId2BoqHeaderIds && mainItemId2BoqHeaderIds[selectedProjectId]) {
								delete mainItemId2BoqHeaderIds[selectedProjectId];
							}
							let parentSelected = parentService.getSelected();
							if ((projectIds.length > 0 && !projectIds.includes(selectedProjectId)) || (projectIds.length === 0 && parentSelected.ProjectFk !== selectedProjectId)) {
								boqMainLookupFilterService.filterCleared.fire();
								selectedProjectId = 0;
								boqMainLookupFilterService.setSelectedProject(null);
								boqMainLookupFilterService.boqHeaderLookupFilter.projectId = 0;
							}
						}
					}

					isFilterCaseChanged = getIsFilterCaseChanged({
						wicGroupIds: wicGroupIds,
						oriWicGroupIds: oriWicGroupIds,
						projectIds: projectIds,
						oriProjectIds: oriProjectIds,
						contractIds: contractIds,
						oriContractIds: oriContractIds,
						mainItemId2BoqHeaderIds: mainItemId2BoqHeaderIds,
						oriMainItemId2BoqHeaderIds: oriMainItemId2BoqHeaderIds,
						packageIds: packageIds,
						oriPackageIds: oriPackageIds,
						materialCatalogIds: materialCatalogIds,
						oriMaterialCatalogIds: oriMaterialCatalogIds
					});

					if (isFilterCaseChanged) {
						boqMainLookupFilterService.setSelectedProject(null);
						boqMainLookupFilterService.boqHeaderLookupFilter.projectId = 0;
						boqMainLookupFilterService.setSelectedBoqHeader(null);
					}
					wicGroupIds = addHeadermBoqWicGroup2GroupIds(parentItem, wicGroupIds);
					asyncAddHeadermBoqWicBoq2BoqHeaderIds(parentItem, mainItemId2BoqHeaderIds).then(function(newMainItem2BoqHeaderIds) {
						boqMainLookupFilterService.setSelectedMainItemId2BoqHeaderIds(newMainItem2BoqHeaderIds);
					});
					boqMainLookupFilterService.setSelectedWicGroupIds(wicGroupIds);
					boqMainLookupFilterService.setSelectedProjectIds(projectIds);
					boqMainLookupFilterService.setSelectedContractIds(contractIds);
					boqMainLookupFilterService.setSelectedPackageIds(packageIds);
					boqMainLookupFilterService.setSelectedMaterialCatalogIds(materialCatalogIds);
				}

				function getIsFilterCaseChanged(filter) {
					let isFilterCaseChanged = false;
					if (!filter) {
						return isFilterCaseChanged;
					}

					let wicGroupIds = filter.wicGroupIds;
					let oriWicGroupIds = filter.oriWicGroupIds;
					let projectIds = filter.projectIds;
					let oriProjectIds = filter.oriProjectIds;
					let packageIds = filter.packageIds;
					let oriPackageIds = filter.oriPackageIds;
					let materialCatalogIds = filter.materialCatalogIds;
					let oriMaterialCatalogIds = filter.oriMaterialCatalogIds;
					let contractIds = filter.contractIds;
					let oriContractIds = filter.oriContractIds;
					let mainItemId2BoqHeaderIds = filter.mainItemId2BoqHeaderIds;
					let oriMainItemId2BoqHeaderIds = filter.oriMainItemId2BoqHeaderIds;

					let difference = _.difference(wicGroupIds, oriWicGroupIds);
					if (difference.length === 0) {
						difference = _.difference(oriWicGroupIds, wicGroupIds);
					}

					isFilterCaseChanged = difference.length > 0;

					if (!isFilterCaseChanged) {
						difference = _.difference(projectIds, oriProjectIds);
						if (difference.length === 0) {
							difference = _.difference(oriProjectIds, projectIds);
						}

						isFilterCaseChanged = difference.length > 0;
					}

					if (!isFilterCaseChanged) {
						difference = _.difference(packageIds, oriPackageIds);
						if (difference.length === 0) {
							difference = _.difference(oriPackageIds, packageIds);
						}

						isFilterCaseChanged = difference.length > 0;
					}

					if (!isFilterCaseChanged) {
						difference = _.difference(materialCatalogIds, oriMaterialCatalogIds);
						if (difference.length === 0) {
							difference = _.difference(oriMaterialCatalogIds, materialCatalogIds);
						}

						isFilterCaseChanged = difference.length > 0;
					}

					if (!isFilterCaseChanged) {
						difference = _.difference(contractIds, oriContractIds);
						if (difference.length === 0) {
							difference = _.difference(oriContractIds, contractIds);
						}

						isFilterCaseChanged = difference.length > 0;
					}

					if (!isFilterCaseChanged) {
						if ((mainItemId2BoqHeaderIds && !oriMainItemId2BoqHeaderIds) || (!mainItemId2BoqHeaderIds && oriMainItemId2BoqHeaderIds)) {
							isFilterCaseChanged = true;
						} else if (mainItemId2BoqHeaderIds && oriMainItemId2BoqHeaderIds) {
							for (let prop in mainItemId2BoqHeaderIds) {
								if (Object.prototype.hasOwnProperty.call(mainItemId2BoqHeaderIds,prop)) {
									if (!oriMainItemId2BoqHeaderIds[prop]) {
										isFilterCaseChanged = true;
										break;
									} else {
										let boqHeaderIds = mainItemId2BoqHeaderIds[prop];
										let oriBoqHeaderdIds = oriMainItemId2BoqHeaderIds[prop];
										difference = _.difference(boqHeaderIds, oriBoqHeaderdIds);
										if (difference.length === 0) {
											difference = _.difference(oriBoqHeaderdIds, boqHeaderIds);
										}

										isFilterCaseChanged = difference.length > 0;

										if (isFilterCaseChanged) {
											break;
										}
									}
								}
							}
						}
					}

					return isFilterCaseChanged;
				}

				function addHeadermBoqWicGroup2GroupIds(parentItem, wicGroupIds) {
					if (parentItem && parentItem.BoqWicCatFk && (parentItem.IsFramework || (!parentItem.IsFreeItemsAllowed && !parentItem.IsFramework))) {
						if (!wicGroupIds || !wicGroupIds.length) {
							wicGroupIds = [];
						}
						wicGroupIds.push(parentItem.BoqWicCatFk);
					}
					return wicGroupIds;
				}

				function asyncAddHeadermBoqWicBoq2BoqHeaderIds(parentItem, boqHeaderIds) {
					var defer = $q.defer();
					if (parentItem && parentItem.BoqWicCatBoqFk && parentItem.BoqWicCatFk && (parentItem.IsFramework || (!parentItem.IsFreeItemsAllowed && !parentItem.IsFramework))) {
						var wicCatBoqs = basicsLookupdataLookupDescriptorService.getData('PrcWicCatBoqs');
						if (wicCatBoqs) {
							var wicCatBoq = _.find(wicCatBoqs, {Id: parentItem.BoqWicCatBoqFk});
							if (wicCatBoq) {
								if (!boqHeaderIds) {
									boqHeaderIds = {};
								}
								if (!boqHeaderIds[parentItem.BoqWicCatFk] || !boqHeaderIds[parentItem.BoqWicCatFk].length) {
									boqHeaderIds[parentItem.BoqWicCatFk] = [];
								}
								boqHeaderIds[parentItem.BoqWicCatFk].push(wicCatBoq.BoqHeader.Id);
							}
							defer.resolve(boqHeaderIds);
							return defer.promise;
						}
						else {
							return basicsLookupdataLookupDescriptorService.getItemByKey('PrcWicCatBoqs', {Id: parentItem.BoqWicCatBoqFk, PKey1: parentItem.BoqWicCatFk})
								.then(function (data) {
									if (data) {
										if (!boqHeaderIds) {
											boqHeaderIds = {};
										}
										if (!boqHeaderIds[parentItem.BoqWicCatFk] || !boqHeaderIds[parentItem.BoqWicCatFk].length) {
											boqHeaderIds[parentItem.BoqWicCatFk] = [];
										}
										boqHeaderIds[parentItem.BoqWicCatFk].push(data.BoqHeader.Id);
									}
									return boqHeaderIds;
								});
						}
					}
					defer.resolve(boqHeaderIds);
					return defer.promise;
				}
			}]);
})(angular);