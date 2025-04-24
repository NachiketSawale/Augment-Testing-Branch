/**
 * Created by lvy on 9/28/2020.
 */
(function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,_ */

	var moduleName = 'procurement.package';
	angular.module(moduleName).factory('prcPackageMasterRestrictionDataService', [
		'$injector',
		'$http',
		'platformDataServiceFactory',
		'procurementPackageDataService',
		'platformRuntimeDataService',
		'basicsCommonBusinessDecorator',
		'basicsLookupdataLookupFilterService',
		'basicsCommonMandatoryProcessor',
		'procurementCommonMasterRestrictionType',
		'boqMainLookupFilterService',
		'basicsLookupdataLookupDescriptorService',
		'procurementCommonMasterRestrictionPrjBoqLookupDataService',
		'procurementCopyMode',
		'globals',
		function (
			$injector,
			$http,
			dataServiceFactory,
			parentService,
			platformRuntimeDataService,
			basicsCommonBusinessDecorator,
			basicsLookupdataLookupFilterService,
			basicsCommonMandatoryProcessor,
			masterRestrictionType,
			boqMainLookupFilterService,
			basicsLookupdataLookupDescriptorService,
			procurementCommonMasterRestrictionPrjBoqLookupDataService,
			procurementCopyMode,
			globals
		) {
			var serviceContainer;
			var service;
			var setReadonlyor;
			var mRBoqHeaderLookupDataService;
			var conBoqHeaderLookupDataService = null;
			var httpRoute = globals.webApiBaseUrl + 'procurement/package/prcpacmasterrestriction/';
			var serviceOption = {
				flatLeafItem: {
					module: angular.module(moduleName),
					serviceName: 'prcPackageMasterRestrictionDataService',
					httpCRUD: {
						route: httpRoute,
						endRead: 'listByParent',
						usePostForRead: true,
						initReadData: initReadData
					},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								creationData.PKey1 = parentService.getSelected().Id;
							},
							incorporateDataRead: function incorporateDataRead(readItems, data) {
								var Isreadonly = !setReadonlyor();
								cachePackageBoqHeaderLookupData(readItems.boqHeadsBasePackage);
								cacheContractBoqHeaderLookupData(readItems.conBoqHeaders);
								var dataRead = serviceContainer.data.handleReadSucceeded(readItems.Main, data, true);
								basicsLookupdataLookupDescriptorService.attachData(readItems);
								if (Isreadonly) {
									service.setFieldReadonly(readItems);
								}
								updateBoqFilter();
								return dataRead;
							}
						}
					},
					entityRole: {
						leaf: {
							itemName: 'PrcPacMasterRestriction',
							parentService: parentService,
							doesRequireLoadAlways: true
						}
					},
					dataProcessor: [
						{
							processItem: function (dataItem) {
								service.setReadonlyBaseCopyType(dataItem, dataItem.CopyType);
							}
						}
					]
				}
			};

			serviceContainer = dataServiceFactory.createNewComplete(serviceOption);
			service = serviceContainer.service;

			setReadonlyor = function () {
				var getModuleStatusFn = parentService.getItemStatus || parentService.getModuleState;
				if (getModuleStatusFn) {
					var status = getModuleStatusFn();
					return !(status.IsReadOnly || status.IsReadonly);
				}
				return false;
			};
			var canCreate = serviceContainer.service.canCreate;
			service.canCreate = function () {
				return canCreate() && setReadonlyor();
			};
			var canDelete = serviceContainer.service.canDelete;
			service.canDelete = function () {
				return canDelete() && setReadonlyor();
			};

			serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'PrcPacMasterRestrictionDto',
				moduleSubModule: 'Procurement.Package',
				validationService: 'prcPackageMasterRestrictionValidationService',
				mustValidateFields: ['CopyType']
			});

			var readonlyFields = [
				{field: 'MdcMaterialCatalogFk', readonly: true},
				{field: 'BoqWicCatFk', readonly: true},
				{field: 'BoqItemFk', readonly: true},
				{field: 'PrjProjectFk', readonly: true},
				{field: 'PrjBoqFk', readonly: true},
				{field: 'PrcPackageBoqFk', readonly: true},
				{field: 'PackageBoqHeaderFk', readonly: true},
				{field: 'ConHeaderFk', readonly: true},
				{field: 'ConBoqHeaderFk', readonly: true}
			];

			service.setFieldReadonly = function(items){
				if(_.isArray(items)){
					_.forEach(items, function(item){
						platformRuntimeDataService.readonly(item, readonlyFields);
					});
				}
			};

			service.setReadonlyBaseCopyType = function(entity, value) {
				if (value === masterRestrictionType.wicBoq) {
					platformRuntimeDataService.readonly(entity, [{field: 'MdcMaterialCatalogFk', readonly: true}]);
					platformRuntimeDataService.readonly(entity, [{field: 'PrjProjectFk', readonly: true}]);
					platformRuntimeDataService.readonly(entity, [{field: 'PrjBoqFk', readonly: true}]);
					platformRuntimeDataService.readonly(entity, [{field: 'PrcPackageBoqFk', readonly: true}]);
					platformRuntimeDataService.readonly(entity, [{field: 'PackageBoqHeaderFk', readonly: true}]);
					platformRuntimeDataService.readonly(entity, [{field: 'BoqWicCatFk', readonly: false}]);
					platformRuntimeDataService.readonly(entity, [{field: 'BoqItemFk', readonly: false}]);
					platformRuntimeDataService.readonly(entity, [{field: 'ConHeaderFk', readonly: true}]);
					platformRuntimeDataService.readonly(entity, [{field: 'ConBoqHeaderFk', readonly: true}]);

				}
				else if (value === masterRestrictionType.prjBoq) {
					platformRuntimeDataService.readonly(entity, [{field: 'MdcMaterialCatalogFk', readonly: true}]);
					platformRuntimeDataService.readonly(entity, [{field: 'PrjProjectFk', readonly: false}]);
					platformRuntimeDataService.readonly(entity, [{field: 'PrjBoqFk', readonly: false}]);
					platformRuntimeDataService.readonly(entity, [{field: 'PrcPackageBoqFk', readonly: true}]);
					platformRuntimeDataService.readonly(entity, [{field: 'PackageBoqHeaderFk', readonly: true}]);
					platformRuntimeDataService.readonly(entity, [{field: 'BoqWicCatFk', readonly: true}]);
					platformRuntimeDataService.readonly(entity, [{field: 'BoqItemFk', readonly: true}]);
					platformRuntimeDataService.readonly(entity, [{field: 'ConHeaderFk', readonly: true}]);
					platformRuntimeDataService.readonly(entity, [{field: 'ConBoqHeaderFk', readonly: true}]);
				}
				else if (value === masterRestrictionType.packageBoq) {
					platformRuntimeDataService.readonly(entity, [{field: 'MdcMaterialCatalogFk', readonly: true}]);
					platformRuntimeDataService.readonly(entity, [{field: 'PrjProjectFk', readonly: true}]);
					platformRuntimeDataService.readonly(entity, [{field: 'PrjBoqFk', readonly: true}]);
					platformRuntimeDataService.readonly(entity, [{field: 'PrcPackageBoqFk', readonly: false}]);
					platformRuntimeDataService.readonly(entity, [{field: 'PackageBoqHeaderFk', readonly: false}]);
					platformRuntimeDataService.readonly(entity, [{field: 'BoqWicCatFk', readonly: true}]);
					platformRuntimeDataService.readonly(entity, [{field: 'BoqItemFk', readonly: true}]);
					platformRuntimeDataService.readonly(entity, [{field: 'ConHeaderFk', readonly: true}]);
					platformRuntimeDataService.readonly(entity, [{field: 'ConBoqHeaderFk', readonly: true}]);
				}
				else if (value === masterRestrictionType.material) {
					platformRuntimeDataService.readonly(entity, [{field: 'MdcMaterialCatalogFk', readonly: false}]);
					platformRuntimeDataService.readonly(entity, [{field: 'PrjProjectFk', readonly: true}]);
					platformRuntimeDataService.readonly(entity, [{field: 'PrjBoqFk', readonly: true}]);
					platformRuntimeDataService.readonly(entity, [{field: 'PrcPackageBoqFk', readonly: true}]);
					platformRuntimeDataService.readonly(entity, [{field: 'PackageBoqHeaderFk', readonly: true}]);
					platformRuntimeDataService.readonly(entity, [{field: 'BoqWicCatFk', readonly: true}]);
					platformRuntimeDataService.readonly(entity, [{field: 'BoqItemFk', readonly: true}]);
					platformRuntimeDataService.readonly(entity, [{field: 'ConHeaderFk', readonly: true}]);
					platformRuntimeDataService.readonly(entity, [{field: 'ConBoqHeaderFk', readonly: true}]);
				}
				else if (value === masterRestrictionType.contractBoq) {
					platformRuntimeDataService.readonly(entity, [{field: 'MdcMaterialCatalogFk', readonly: true}]);
					platformRuntimeDataService.readonly(entity, [{field: 'PrjProjectFk', readonly: true}]);
					platformRuntimeDataService.readonly(entity, [{field: 'PrjBoqFk', readonly: true}]);
					platformRuntimeDataService.readonly(entity, [{field: 'PrcPackageBoqFk', readonly: true}]);
					platformRuntimeDataService.readonly(entity, [{field: 'PackageBoqHeaderFk', readonly: true}]);
					platformRuntimeDataService.readonly(entity, [{field: 'BoqWicCatFk', readonly: true}]);
					platformRuntimeDataService.readonly(entity, [{field: 'BoqItemFk', readonly: true}]);
					platformRuntimeDataService.readonly(entity, [{field: 'ConHeaderFk', readonly: false}]);
					platformRuntimeDataService.readonly(entity, [{field: 'ConBoqHeaderFk', readonly: !entity.ConHeaderFk}]);
				}
			};

			var filters = [
				{
					key: 'master-restriction-boq-item-filter',
					serverSide: false,
					fn: function (dataItem) {
						return !dataItem.IsDisabled;
					}
				},
				{
					key: 'package-master-restriction-boq-filter',
					serverSide: true,
					fn: function (dataContext) {
						if (dataContext === undefined) {
							return;
						}
						var targetProject = dataContext.PrjProjectFk;
						return 'PrjProjectFk=' + targetProject;
					}
				},
				{
					key: 'master-restriction-package-filter',
					serverSide: true,
					fn: function () {
						var filter = {};
						var parentSelected = parentService.getSelected();
						if (!parentSelected || !parentSelected.ProjectFk) {
							return;
						}
						var project = parentSelected.ProjectFk;
						if (project) {
							filter.ProjectFk = project;
						}

						return filter;
					}
				},
				{
					key: 'master-restriction-contract-filter',
					serverKey: 'master-restriction-contract-filter',
					serverSide: true,
					fn: function () {
						let filter = {
							HasBoqs: true
						};
						var parentSelected = parentService.getSelected();
						if (!parentSelected || !parentSelected.ProjectFk) {
							return;
						}
						var project = parentSelected.ProjectFk;
						if (project) {
							filter.ProjectFk = project;
						}

						return filter;
					}
				}
			];

			function initReadData(readData) {
				var sel = parentService.getSelected();
				readData.PKey1 = sel.Id;
			}

			_.each(filters, function (filter) {
				if (!basicsLookupdataLookupFilterService.hasFilter(filter.key)) {
					basicsLookupdataLookupFilterService.registerFilter(filter);
				}
			});

			parentService.registerUpdateDone(updateBoqFilter);

			service.updateBoqFilter = updateBoqFilter;
			return service;

			// ///////////////////////
			function updateBoqFilter() {
				var wicGroupIds = [];
				var projectIds = [];
				var packageIds = [];
				var materialCatalogIds = [];
				var mainItemId2BoqHeaderIds = null;
				var contractIds = [];
				var oriWicGroupIds = boqMainLookupFilterService.boqHeaderLookupFilter.wicGroupIds;
				var oriProjectIds = boqMainLookupFilterService.boqHeaderLookupFilter.projectIds;
				var oriPackageIds = boqMainLookupFilterService.boqHeaderLookupFilter.packageIds;
				var oriMaterialCatalogIds = boqMainLookupFilterService.boqHeaderLookupFilter.materialCatalogIds;
				var oriContractIds = boqMainLookupFilterService.boqHeaderLookupFilter.contractIds;
				var oriMainItemId2BoqHeaderIds = boqMainLookupFilterService.boqHeaderLookupFilter.mainItemId2BoqHeaderIds;

				var parentItem = parentService.getSelected();
				if (!(parentItem &&
					((parentItem.PrcCopyModeFk === procurementCopyMode.OnlyAllowedCatalogs) ||
						(parentItem.PrcCopyModeFk === procurementCopyMode.NoRestrictions4StandardUser && globals.portal)))) {
					boqMainLookupFilterService.setSelectedWicGroupIds(wicGroupIds);
					boqMainLookupFilterService.setSelectedProjectIds(projectIds);
					boqMainLookupFilterService.setSelectedPackageIds(packageIds);
					boqMainLookupFilterService.setSelectedMaterialCatalogIds(materialCatalogIds);
					boqMainLookupFilterService.setSelectedMainItemId2BoqHeaderIds(mainItemId2BoqHeaderIds);
					boqMainLookupFilterService.setSelectedContractIds(contractIds);
					return;
				}

				var list = service.getList();
				var boqType = boqMainLookupFilterService.boqHeaderLookupFilter.boqType;
				var selectedWicGroupId = boqMainLookupFilterService.boqHeaderLookupFilter.boqGroupId;
				var selectedProjectId = boqMainLookupFilterService.boqHeaderLookupFilter.projectId;
				var isFilterCaseChanged = false;

				if (boqType === 1) {
					wicGroupIds = [-1]; // To force empty wic group and boq list
				} else if (boqType === 2 || boqType === 4 || boqType === 7) {
					projectIds = [-1];
					if (boqType === 4) {
						packageIds = [-1];
					}
					else if (boqType === 7) {
						contractIds = [-1];
					}
				}

				if (!list || list.length === 0 || (boqType !== 1 && boqType !== 2 && boqType !== 4 && boqType !== 7)) {
					isFilterCaseChanged = getIsFilterCaseChanged({
						wicGroupIds: wicGroupIds,
						oriWicGroupIds: oriWicGroupIds,
						projectIds: projectIds,
						oriProjectIds: oriProjectIds,
						packageIds: packageIds,
						oriPackageIds: oriPackageIds,
						materialCatalogIds: materialCatalogIds,
						oriMaterialCatalogIds: oriMaterialCatalogIds,
						contractIds: contractIds,
						oriContractIds: oriContractIds,
						mainItemId2BoqHeaderIds: mainItemId2BoqHeaderIds,
						oriMainItemId2BoqHeaderIds: oriMainItemId2BoqHeaderIds
					});

					if (isFilterCaseChanged) {
						boqMainLookupFilterService.setSelectedProject(null);
						boqMainLookupFilterService.boqHeaderLookupFilter.projectId = 0;
						boqMainLookupFilterService.setSelectedBoqHeader(null);
					}

					boqMainLookupFilterService.setSelectedWicGroupIds(wicGroupIds);
					boqMainLookupFilterService.setSelectedProjectIds(projectIds);
					boqMainLookupFilterService.setSelectedPackageIds(packageIds);
					boqMainLookupFilterService.setSelectedMaterialCatalogIds(materialCatalogIds);
					boqMainLookupFilterService.setSelectedMainItemId2BoqHeaderIds(mainItemId2BoqHeaderIds);
					boqMainLookupFilterService.setSelectedContractIds(contractIds);
					return;
				}

				var visiblities = globals.portal ? [2, 3] : [1, 3];

				_.forEach(list, function (item) {
					if (!_.includes(visiblities, item.Visibility)) {
						return;
					}

					if (boqType === 1) {
						if (item.CopyType === masterRestrictionType.wicBoq) {
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

						} else if (item.CopyType === masterRestrictionType.material) {
							if (item.MdcMaterialCatalogFk && !_.includes(materialCatalogIds, item.MdcMaterialCatalogFk)) {
								materialCatalogIds.push(item.MdcMaterialCatalogFk);
							}
						}
					} else if (boqType === 2 && item.CopyType === masterRestrictionType.prjBoq) {
						if (item.PrjProjectFk) {
							if (!_.includes(projectIds, item.PrjProjectFk)) {
								projectIds.push(item.PrjProjectFk);
							}

							if (item.PrjBoqFk) {
								var prjBoqs = basicsLookupdataLookupDescriptorService.getData('PrjBoq');
								var prjBoq = null;
								var boqHeaderId = null;
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
									mainItemId2BoqHeaderIds[item.PrjProjectFk] = mainItemId2BoqHeaderIds[item.PrjProjectFk] || [];
									if (!_.includes(mainItemId2BoqHeaderIds[item.PrjProjectFk], boqHeaderId)) {
										mainItemId2BoqHeaderIds[item.PrjProjectFk].push(boqHeaderId);
									}
								}
							}
						}
					} else if (boqType === 4 && item.CopyType === masterRestrictionType.packageBoq) {
						if (item.PrcPackageBoqFk) {
							var packagelookups = basicsLookupdataLookupDescriptorService.getData('PrcPackage');
							if (packagelookups) {
								var packagelookup = packagelookups[item.PrcPackageBoqFk];
								if (packagelookup && packagelookup.ProjectFk) {
									if (!_.includes(projectIds, packagelookup.ProjectFk)) {
										projectIds.push(packagelookup.ProjectFk);
									}

									if (!_.includes(packageIds, item.PrcPackageBoqFk)) {
										packageIds.push(item.PrcPackageBoqFk);
									}

									if (item.BoqHeaderFk) {
										mainItemId2BoqHeaderIds = mainItemId2BoqHeaderIds || {};
										mainItemId2BoqHeaderIds[item.PrcPackageBoqFk] = mainItemId2BoqHeaderIds[item.PrcPackageBoqFk] || [];
										if (!_.includes(mainItemId2BoqHeaderIds[item.PrcPackageBoqFk], item.BoqHeaderFk)) {
											mainItemId2BoqHeaderIds[item.PrcPackageBoqFk].push(item.BoqHeaderFk);
										}
									}
								}
							}
						}
					} else if (boqType === 7 && item.CopyType === masterRestrictionType.contractBoq) {
						if (item.ConHeaderFk) {
							var contractLookups = basicsLookupdataLookupDescriptorService.getData('conheaderview');
							if (contractLookups) {
								var contractLookup = contractLookups[item.ConHeaderFk];
								if (contractLookup && contractLookup.ProjectFk) {
									if (!_.includes(projectIds, contractLookup.ProjectFk)) {
										projectIds.push(contractLookup.ProjectFk);
									}

									if (!_.includes(contractIds, item.ConHeaderFk)) {
										contractIds.push(item.ConHeaderFk);
									}

									if (item.ConBoqHeaderFk) {
										mainItemId2BoqHeaderIds = mainItemId2BoqHeaderIds || {};
										mainItemId2BoqHeaderIds[item.ConHeaderFk] = mainItemId2BoqHeaderIds[item.ConHeaderFk] || [];
										if (!_.includes(mainItemId2BoqHeaderIds[item.ConHeaderFk], item.ConBoqHeaderFk)) {
											mainItemId2BoqHeaderIds[item.ConHeaderFk].push(item.ConBoqHeaderFk);
										}
									}
								}
							}
						}
					}
				});

				if (boqType === 1 && wicGroupIds.length > 0 && selectedWicGroupId) { // if the selected Wic Group is not defined in the master restriction and master restriction has value with copy type wic group, no boq shows.
					var isWicGroupIdIncluded = _.includes(wicGroupIds, selectedWicGroupId);
					if (!isWicGroupIdIncluded) {
						mainItemId2BoqHeaderIds = {};
						_.forEach(wicGroupIds, function(groupId) {
							mainItemId2BoqHeaderIds[groupId] = [-1];
						});
						mainItemId2BoqHeaderIds[selectedWicGroupId] = [-1];
					}
				}
				else if (boqType === 4 && angular.isArray(projectIds) && projectIds.length > 0 && selectedProjectId) { // if the seleced Project is not defined in the master restriction and master restriction has value with copy type project or package, no boq shows.
					var isProjectIdIncluded = _.includes(projectIds, selectedProjectId);
					if (!isProjectIdIncluded) {
						packageIds = [-1];
					}
				} else if (boqType === 7 && angular.isArray(projectIds) && projectIds.length > 0 && selectedProjectId) {
					var isProjectIdIncluded2 = _.includes(projectIds, selectedProjectId);
					if (!isProjectIdIncluded2) {
						contractIds = [-1];
					}
				}

				if (boqType === 2) {
					if (selectedProjectId && !projectIds.includes(selectedProjectId)) {
						if (mainItemId2BoqHeaderIds && mainItemId2BoqHeaderIds[selectedProjectId]) {
							delete mainItemId2BoqHeaderIds[selectedProjectId];
						}
						var parentSelected = parentService.getSelected();
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
					packageIds: packageIds,
					oriPackageIds: oriPackageIds,
					materialCatalogIds: materialCatalogIds,
					oriMaterialCatalogIds: oriMaterialCatalogIds,
					contractIds: contractIds,
					oriContractIds: oriContractIds,
					mainItemId2BoqHeaderIds: mainItemId2BoqHeaderIds,
					oriMainItemId2BoqHeaderIds: oriMainItemId2BoqHeaderIds
				});

				if (isFilterCaseChanged) {
					boqMainLookupFilterService.setSelectedProject(null);
					boqMainLookupFilterService.boqHeaderLookupFilter.projectId = 0;
					boqMainLookupFilterService.setSelectedBoqHeader(null);
				}

				boqMainLookupFilterService.setSelectedWicGroupIds(wicGroupIds);
				boqMainLookupFilterService.setSelectedProjectIds(projectIds);
				boqMainLookupFilterService.setSelectedPackageIds(packageIds);
				boqMainLookupFilterService.setSelectedMaterialCatalogIds(materialCatalogIds);
				boqMainLookupFilterService.setSelectedMainItemId2BoqHeaderIds(mainItemId2BoqHeaderIds);
				boqMainLookupFilterService.setSelectedContractIds(contractIds);
			}

			function cachePackageBoqHeaderLookupData(boqHeaderLookupData) {
				boqHeaderLookupData.forEach(function(b) {
					b.BoqNumber = b.Reference;
				});
				mRBoqHeaderLookupDataService = mRBoqHeaderLookupDataService || $injector.get('procurementCommonMasterRestrictionBoqHeaderLookupDataService');
				mRBoqHeaderLookupDataService.setBoqHeaderBasePackageCache(boqHeaderLookupData);
			}

			function cacheContractBoqHeaderLookupData(headers) {
				conBoqHeaderLookupDataService = conBoqHeaderLookupDataService || $injector.get('procurementCommonMasterRestrictionContractBoqHeaderService');
				conBoqHeaderLookupDataService.setContractBoqHeaderCache(headers);
			}

			function getIsFilterCaseChanged(filter) {
				var isFilterCaseChanged = false;
				if (!filter) {
					return isFilterCaseChanged;
				}

				var wicGroupIds = filter.wicGroupIds;
				var oriWicGroupIds = filter.oriWicGroupIds;
				var projectIds = filter.projectIds;
				var oriProjectIds = filter.oriProjectIds;
				var packageIds = filter.packageIds;
				var oriPackageIds = filter.oriPackageIds;
				var materialCatalogIds = filter.materialCatalogIds;
				var oriMaterialCatalogIds = filter.oriMaterialCatalogIds;
				var contractIds = filter.contractIds;
				var oriContractIds = filter.oriContractIds;
				var mainItemId2BoqHeaderIds = filter.mainItemId2BoqHeaderIds;
				var oriMainItemId2BoqHeaderIds = filter.oriMainItemId2BoqHeaderIds;

				var difference = _.difference(wicGroupIds, oriWicGroupIds);
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
					}
					else if (mainItemId2BoqHeaderIds && oriMainItemId2BoqHeaderIds) {
						for (var prop in mainItemId2BoqHeaderIds) {
							// eslint-disable-next-line no-prototype-builtins
							if (mainItemId2BoqHeaderIds.hasOwnProperty(prop)) {
								if (!oriMainItemId2BoqHeaderIds[prop]) {
									isFilterCaseChanged = true;
									break;
								} else {
									var boqHeaderIds = mainItemId2BoqHeaderIds[prop];
									var oriBoqHeaderdIds = oriMainItemId2BoqHeaderIds[prop];
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
		}]);
})(angular);