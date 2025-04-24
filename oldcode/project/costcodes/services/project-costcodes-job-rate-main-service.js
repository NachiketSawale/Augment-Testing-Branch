/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals, _ */
	'use strict';
	let moduleName = 'project.costcodes';
	let projectCostCodesModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name projectCostCodesJobRateService
	 * @function
	 *
	 * @description
	 * projectCostCodesJobRateService is the data service for all project costcodes Job rate related functionality.
	 */
	angular.module(moduleName).factory('projectCostCodesJobRateMainService',
		['$http',
			'$q',
			'$log',
			'$injector',
			'projectCostCodesMainService',
			'platformDataServiceFactory',
			'cloudCommonGridService',
			'hourfactorReadonlyProcessor',
			'projectMainService',
			'projectCostCodesJobRateProcessor',
			'PlatformMessenger',
			'platformRuntimeDataService',
			'projectCommonJobService',
			'basicsCommonMandatoryProcessor',
			function ($http,
				$q,
				$log,
				$injector,
				projectCostCodesMainService,
				platformDataServiceFactory,
				cloudCommonGridService,
				hourfactorReadonlyProcessor,
				projectMainService,
				projectCostCodesJobRateProcessor,
				PlatformMessenger,
				platformRuntimeDataService,
				projectCommonJobService,
				basicsCommonMandatoryProcessor
			){
				let firstJobRateId = null;
				let jobIds = null;
				let showFilterBtn = false;
				let initFilterMenuFlag = true;
				let isManuallyFilter = false;
				let factorFieldsToRecalculate = {
					'FactorCosts': 'RealFactorCosts',
					'FactorQuantity': 'RealFactorQuantity'
				};
				let costCodeJobRateCache = [];
				let costCodeJobRateToSave = [];

				let prjCostCodesJobRateServiceInfo = {
					flatLeafItem: {
						module: projectCostCodesModule,
						serviceName: 'projectCostCodesJobRateService',
						httpRead: {
							route: globals.webApiBaseUrl + 'project/costcodes/job/rate/',
							endRead: 'listCostCodeByFitler',
							usePostForRead: true,
							initReadData: function (readData) {
								let selectedItem = projectCostCodesMainService.getSelected();
								if (selectedItem && selectedItem.Id > 0) {
									readData.PrjCostCodeId  = selectedItem.Id;
								}
								readData.LgmJobIds = jobIds;
								readData.InitFilterMenuFlag = initFilterMenuFlag && !isManuallyFilter;
								let selectedProjectItem =  projectMainService.getSelected();
								readData.ProjectId = selectedProjectItem ? selectedProjectItem.Id : -1;
							}
						},
						httpCreate: { route: globals.webApiBaseUrl + 'project/costcodes/job/rate/', endCreate: 'createbyfilter' },
						actions: { create: 'flat', delete: true},
						dataProcessor: [projectCostCodesJobRateProcessor],
						entityRole: {
							leaf: {
								codeField: 'Code',
								itemName: 'PrjCostCodesJobRate',
								parentService: projectCostCodesMainService,
								parentFilter: 'prjCostCodeId'
							}
						},
						entitySelection: {},
						presenter: {
							list: {
								initCreationData: initCreationData,
								handleCreateSucceeded : handleCreateSucceeded,
								incorporateDataRead: incorporateDataRead
							}
						}
					}
				};

				let container = platformDataServiceFactory.createNewComplete(prjCostCodesJobRateServiceInfo);

				container.data.usesCache = false;

				let service = container.service;

				service.onToolsUpdated = new PlatformMessenger();

				service.hightLightNGetJob = new PlatformMessenger();

				service.setIsManuallyFilter = function setIsManuallyFilter(value){
					isManuallyFilter = value;
				};

				service.setInitFilterMenuFlag = function setInitFilterMenuFlag(value){
					initFilterMenuFlag = value;
				};

				service.getInitFilterMenuFlag = function getInitFilterMenuFlag(){
					return initFilterMenuFlag;
				};

				container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
					typeName: 'ProjectCostCodesJobRateDto',
					moduleSubModule: 'Project.CostCodes',
					validationService: 'projectCostCodesJobRateValidationService',
					mustValidateFields: ['LgmJobFk']
				});

				function initCreationData(creationData) {
					let selectedCostCodeItem = projectCostCodesMainService.getSelected();
					let selectedProjectItem = projectMainService.getSelected();

					creationData.ParentPrjCostCode = selectedCostCodeItem;
					creationData.ProjectId = selectedProjectItem ? selectedProjectItem.Id : null;
					creationData.CurrencyId = selectedCostCodeItem && selectedCostCodeItem.CurrencyFk ? selectedCostCodeItem.CurrencyFk : selectedProjectItem ? selectedProjectItem.CurrencyFk : null;

					let list = service.getList();
					let filteredJobRates = list && list.length && selectedCostCodeItem ? _.filter(list, function (item) {
						return item.ProjectCostCodeFk === selectedCostCodeItem.Id;
					}) : [];

					creationData.LgmJobIds = _.map(filteredJobRates, 'LgmJobFk');
				}
				function attachMasterCostCode(items) {
					let basCostCode = {};
					let selectedParentItem = projectCostCodesMainService.getSelected();
					if (selectedParentItem) {
						angular.forEach(items, function (item) {
							basCostCode = cloudCommonGridService.addPrefixToKeys(selectedParentItem.BasCostCode, 'BasCostCode');
							angular.extend(item, basCostCode);
						});
					}
					return items;
				}
				function initFactorValues(item) {
					let selectedParentItem =  projectCostCodesMainService.getSelected();
					if(selectedParentItem) {
						item.FactorCosts = selectedParentItem.FactorCosts;
						item.RealFactorCosts = selectedParentItem.RealFactorCosts;
						item.FactorQuantity = selectedParentItem.FactorQuantity;
						item.RealFactorQuantity = selectedParentItem.RealFactorQuantity;
					}
				}
				function handleCreateSucceeded(newItem) {
					attachMasterCostCode([newItem]);
					initFactorValues(newItem);

					let prjCostCode = projectCostCodesMainService.getSelected();
					if(prjCostCode) {
						projectCostCodesMainService.markItemAsModified(prjCostCode);
					}
					
					let projectCostCodesJobRateDynamicUserDefinedColumnService = $injector.get('projectCostCodesJobRateDynamicUserDefinedColumnService');
					projectCostCodesJobRateDynamicUserDefinedColumnService.handleCreatedItem(newItem);

					return newItem;
				}
				function incorporateDataRead(response, data) {

					let readItems = response.dtos;
					attachMasterCostCode(readItems);

					let selectedProjectItem = projectMainService.getSelected();
					let result = container.data.handleReadSucceeded(readItems, data);
					let projectCostCodesJobRateDynamicUserDefinedColumnService = $injector.get('projectCostCodesJobRateDynamicUserDefinedColumnService');
					projectCostCodesJobRateDynamicUserDefinedColumnService.setProjectId(selectedProjectItem ? selectedProjectItem.Id : -1);
					projectCostCodesJobRateDynamicUserDefinedColumnService.clearValueComplete();
					projectCostCodesJobRateDynamicUserDefinedColumnService.attachDataToColumn(data.getList()).then(function(){
						service.gridRefresh();
					});

					service.loadFilterMenu(response.highlightJobIds).then(function () {
						return projectCommonJobService.prepareData().then(function () {
							service.setReadOnly(readItems);
						});
					});

					firstJobRateId = response.firstJobRateId;

					mergeCostCodeJobs(readItems);

					return result;
				}
				function calculateHierarchyFactors(selectedItem, column, parentItem, updatedItems, parentJobRateList) {
					if (!selectedItem) {
						return;
					}
					let realFactorColumn = factorFieldsToRecalculate[column];
					let item = _.find(parentJobRateList, {Id: selectedItem.Id});// container.service.getItemById(selectedItem.Id);

					if (!item) {
						return;
					}
					let prjCostCode = projectCostCodesMainService.getItemById(item.ProjectCostCodeFk);

					if (!prjCostCode) {
						return;
					}
					let currentJobId = item.LgmJobFk;

					if (!prjCostCode.CostCodeParentFk) {
						if (item[realFactorColumn] !== item[column]) {
							item[realFactorColumn] = item[column];
							updatedItems.push(item);
						}
					} else {
						if (!parentItem) {
							parentItem = projectCostCodesMainService.getItemById(prjCostCode.CostCodeParentFk);
						}

						let parentItemJobRate = parentJobRateList && parentJobRateList.length ? _.find(parentJobRateList, {
							ProjectCostCodeFk: parentItem.Id,
							LgmJobFk: currentJobId
						}) : null;

						if (parentItem && parentItemJobRate) {

							let newFactor = parentItemJobRate[realFactorColumn] * item[column];
							if (item[realFactorColumn] !== newFactor) {
								item[realFactorColumn] = newFactor;
								updatedItems.push(item);
							}
						}
					}

					if (angular.isArray(prjCostCode.ProjectCostCodes) && prjCostCode.ProjectCostCodes.length > 0) {
						_.forEach(prjCostCode.ProjectCostCodes, function (cc) {
							let jobRate = parentJobRateList && parentJobRateList.length ? _.find(parentJobRateList, {
								ProjectCostCodeFk: cc.Id,
								LgmJobFk: currentJobId
							}) : null;
							calculateHierarchyFactors(jobRate, column, prjCostCode, updatedItems, parentJobRateList);
						});
					}
				}


				service.loadFilterMenu = function (highlightJobIds) {
					return $injector.get ('projectCommonFilterButtonService').initFilterMenu (service,highlightJobIds);
				};

				service.setReadOnly = setReadOnly;

				function setReadOnly (jobRateList) {
					let versionEstHeaderJobIds = $injector.get('projectCommonFilterButtonService').getJobFksOfVersionEstHeader();
					_.forEach(jobRateList, function (item) {

						let readOnly = versionEstHeaderJobIds.includes(item.LgmJobFk) || projectCommonJobService.isJobReadOnly(item.LgmJobFk);
						item.readOnlyByJob = readOnly;

						let fields = [];
						_.forOwn(item, function (value, key) {
							let field = {field: key, readonly: readOnly};
							fields.push(field);
						});

						fields.push({field: 'ColVal1', readonly: item.readOnlyByJob});
						fields.push({field: 'ColVal2', readonly: item.readOnlyByJob});
						fields.push({field: 'ColVal3', readonly: item.readOnlyByJob});
						fields.push({field: 'ColVal4', readonly: item.readOnlyByJob});
						fields.push({field: 'ColVal5', readonly: item.readOnlyByJob});
						platformRuntimeDataService.readonly(item, fields);
					});
				}

				service.calRealFactorOrQuantity = function calRealFactorOrQuantity(arg){
					let item = arg.item;
					let column = arg.grid.getColumns()[arg.cell].field;
					if(!item){
						return $q.when(null);
					}
					if (item && factorFieldsToRecalculate[column]) {
						return $http.get(globals.webApiBaseUrl + 'project/costcodes/job/rate/getparentcostcodesjobrate?prjCostCodeId=' + item.ProjectCostCodeFk + '&lgmJobId=' + item.LgmJobFk)
							.then(function(response){
								let parentJobRateList = response.data;

								if(item.modifiedJobRate && item.modifiedJobRate.length > 0){
									_.forEach(item.modifiedJobRate, function (jobRate){
										let rate = _.find(parentJobRateList, {Id: jobRate.Id});
										rate && _.merge(rate, jobRate);
									});
								}

								calTreeFactorsAndQuantity(item, column, parentJobRateList);
								return item;
							});
					}else{
						return $q.when(null);
					}

					function calTreeFactorsAndQuantity(currentItem, column, parentJobRateList) {
						if(!currentItem){
							return;
						}
						let realFactorColumn = factorFieldsToRecalculate[column];
						let currentJobId = currentItem.LgmJobFk;

						if (!currentItem.CostCodeParentFk) {
							if (currentItem[realFactorColumn] !== currentItem[column]) {
								currentItem[realFactorColumn] = currentItem[column];
							}
						} else {
							let parentItemJobRate = parentJobRateList && parentJobRateList.length ? _.find(parentJobRateList, {ProjectCostCodeFk : currentItem.CostCodeParentFk, LgmJobFk : currentJobId}) : null;

							if (parentItemJobRate) {

								let newFactor = parentItemJobRate[realFactorColumn] * currentItem[column];
								if (currentItem[realFactorColumn] !== newFactor) {
									currentItem[realFactorColumn] = newFactor;
								}
							}
						}
						calChildrenFactorAndQuantity(parentJobRateList,currentItem, currentJobId,realFactorColumn, column);
						currentItem.modifiedJobRate = _.filter(parentJobRateList, {hasModified: true});
					}

					function calChildrenFactorAndQuantity(parentJobRateList, currentItem, currentJobId, realFactorColumn, column){
						let childrenJobRate = parentJobRateList && parentJobRateList.length ? _.filter(parentJobRateList, {ParentPrjCostCodeId : currentItem.ProjectCostCodeFk, LgmJobFk : currentJobId}) : null;
						childrenJobRate && childrenJobRate.length > 0 && _.forEach(childrenJobRate, function (jobRate){
							jobRate[realFactorColumn] = currentItem[realFactorColumn] * jobRate[column];
							jobRate.hasModified = true;
							calChildrenFactorAndQuantity(parentJobRateList, jobRate, currentJobId, realFactorColumn, column);
						});
					}
				};

				service.calcRealFactors = function calcRealFactors (arg){
					let item = arg.item;
					if(!item){
						return;
					}

					function calculateHierarchy() {
						let column = arg.grid.getColumns()[arg.cell].field;
						if (item && factorFieldsToRecalculate[column]) {
							return $http.get(globals.webApiBaseUrl + 'project/costcodes/job/rate/getparentcostcodesjobrate?prjCostCodeId=' + item.ProjectCostCodeFk + '&lgmJobId=' + item.LgmJobFk)
								.then(function (response) {
									let updatedItems = [];
									let parentJobRateList = response.data;

									calculateHierarchyFactors(item, column, null, updatedItems, parentJobRateList);

									// sysnc to project cost code
									if (updatedItems.length > 0) {
										service.sysncPrjCostCode(arg, updatedItems);
										projectMainService.update();
									}

									if (updatedItems && updatedItems.length) {
										return $http.post(globals.webApiBaseUrl + 'project/costcodes/job/rate/savejobrates', updatedItems).then(function (response) {
											let modTrackServ = $injector.get('platformDataServiceModificationTrackingExtension');
											modTrackServ.clearModificationsInLeaf(service, container.data, response.data);
											container.service.load();
											container.data.listLoaded.fire();
										});
									}
								});
						} else {
							return $q.when([]);
						}
					}

					projectMainService.updateAndExecute(calculateHierarchy);
				};


				service.isRecalculate = function isRecalculate(column) {
					return factorFieldsToRecalculate[column];
				};

				service.calcRealFactorsNew = function calcRealFactorsNew(item, value, column) {
					return getCostCodeJobRateData(item).then(function (result) {
						if (result) {
							result[column] = value;
							let updatedItems = [];
							calculateHierarchyFactors(result, column, null, updatedItems, costCodeJobRateCache);
							mergeCostCodeJobsSets(costCodeJobRateToSave, updatedItems, true);
							service.sysncPrjCostCode(column, result, updatedItems);
							mergeCostCodeJob(item, result);
							service.gridRefresh();
							projectCostCodesMainService.gridRefresh();
							return costCodeJobRateToSave;
						}
					});
				};

				service.clearCostCodeJobRateCacheData = function() {
					costCodeJobRateCache = [];
					costCodeJobRateToSave = [];
				};

				service.findJobRate = findJobRate;
				service.mergeCostCodeJob = mergeCostCodeJob;
				function findJobRate(costCodeJobRates, item) {
					if (costCodeJobRates && _.isArray(costCodeJobRates)) {
						return _.find(costCodeJobRates, {
							'ProjectCostCodeFk': item.ProjectCostCodeFk,
							'LgmJobFk': item.LgmJobFk
						});
					}
					return null;
				}
				function getCostCodeJobRateData(item) {
					let resultItem = findJobRate(costCodeJobRateCache, item);
					if (resultItem) {
						return $q.when(resultItem);
					} else {
						return getCostCodeJobRateAsync(item);
					}
				}
				function getCostCodeJobRateAsync(item) {
					return $http.get(globals.webApiBaseUrl + 'project/costcodes/job/rate/getparentcostcodesjobrate?prjCostCodeId=' + item.ProjectCostCodeFk + '&lgmJobId=' + item.LgmJobFk)
						.then(function (response) {
							let parentJobRateList = response.data;
							mergeCostCodeJobsSets(costCodeJobRateCache, parentJobRateList);
							if (!item.Version) {
								if (!findJobRate(costCodeJobRateCache, item)) {

									costCodeJobRateCache.push(item);
								}
								return $q.when(item);
							}
							return findJobRate(costCodeJobRateCache, item);
						});
				}
				function mergeCostCodeJobsSets(sourceList, targetList, isMergePro) {
					if (sourceList && targetList) {
						if (_.isArray(targetList) && targetList.length > 0) {
							_.forEach(targetList, function (tItem) {
								let sItem = findJobRate(sourceList, tItem);
								if (!sItem) {
									sourceList.push(tItem);
								} else if (isMergePro) {
									mergeCostCodeJob(sItem, tItem);
								}
							});
						}
					}
				}
				function mergeCostCodeJobs(source) {
					if (costCodeJobRateToSave.length > 0) {
						_.forEach(costCodeJobRateToSave, function (tItem) {
							let sItem = findJobRate(source, tItem);
							mergeCostCodeJob(sItem, tItem, true);
						});
					}
				}
				function mergeCostCodeJob(source, target, isMergeFactorPro) {
					if (source && target) {
						_.forEach(Object.keys(factorFieldsToRecalculate), function (key) {
							source[factorFieldsToRecalculate[key]] = target[factorFieldsToRecalculate[key]];
							if (isMergeFactorPro) {
								source[key] = target[key];
							}
						});
					}
				}

				// when only one job rate.
				service.sysncPrjCostCode = function sysncPrjCostCode(field, item, updatedItems) {
					let isFirstJobRate = !firstJobRateId || (firstJobRateId && item.Id === firstJobRateId);
					if (isFirstJobRate) {
						let list = service.getList();
						let prjCostCode = projectCostCodesMainService.getSelected();
						if (prjCostCode) {
							let firstJobRate = firstJobRateId ? _.find(list,{'Id':firstJobRateId}) : _.head(_.sortBy(list,['Id']));
							let value = firstJobRate[field];

							if (field.indexOf('ColVal') !== -1) {
								prjCostCode[field] = value;
								$injector.get('projectCostCodesDynamicUserDefinedColumnService').fieldChange(prjCostCode, field, value);
								projectCostCodesMainService.markItemAsModified(prjCostCode);
							} else {
								if (field === 'SalesPrice') {
									prjCostCode.DayWorkRate = value;
									projectCostCodesMainService.markItemAsModified(prjCostCode);
								} else if (updatedItems && factorFieldsToRecalculate[field]) {
									let prjCostCodeList = [];
									cloudCommonGridService.flatten([prjCostCode], prjCostCodeList, 'ProjectCostCodes');
									_.forEach(prjCostCodeList, function (costCodeItem) {
										let pItem = _.find(updatedItems, {'ProjectCostCodeFk': costCodeItem.Id});
										if (pItem) {
											costCodeItem[factorFieldsToRecalculate[field]] = pItem[factorFieldsToRecalculate[field]];
											projectCostCodesMainService.markItemAsModified(costCodeItem);
										}
									});
								} else {
									prjCostCode[field] = value;
									projectCostCodesMainService.markItemAsModified(prjCostCode);
								}
							}
						}
					}
				};

				service.setSelectedJobsIds = function setSelectedJobsIds(ids){
					jobIds = _.filter(ids,function(d){
						return d;
					});
				};

				service.setShowFilterBtn = function setShowFilterBtn(value){
					showFilterBtn = value;
				};

				service.getShowFilterBtn = function getShowFilterBtn() {
					return showFilterBtn;
				};

				service.clear = function clear() {
					jobIds = null;
					showFilterBtn = false;
				};

				return service;

			}]);
})(angular);
