/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'estimate.assemblies';
	/**
     * @ngdoc service
     * @name estimateAssembliesResourceDynamicUserDefinedColumnServiceFactory
     * @function
     *
     * @description
     * estimateAssembliesResourceDynamicUserDefinedColumnServiceFactory is the factory service for assembly resource dynamic user defined column
     */
	angular.module(moduleName).factory('estimateAssembliesResourceDynamicUserDefinedColumnServiceFactory', ['_', '$q', '$http', 'globals', '$injector', 'userDefinedColumnTableIds', 'basicsCommonUserDefinedColumnServiceFactory', 'estimateAssembliesDynamicUserDefinedColumnCalculationService', 'platformRuntimeDataService', 'estimateMainResourceType',
		function (_, $q, $http, globals, $injector, userDefinedColumnTableIds, basicsCommonUserDefinedColumnServiceFactory, estimateAssembliesDynamicUserDefinedColumnCalculationService, platformRuntimeDataService, estimateMainResourceType) {
			let factoryService = {};

			factoryService.initService = function(isPrjAssembly, options){

				let _projectId = -1,
					prjCostCodes = [],
					mdcCostCodeValueList = [],
					prjCostCodeValueList = [],
					projectCostCodejobRateValueList = [],
					prjCostCodejobRateValueList = [],
					columnOptions = {
						columns : {
							idPreFix : 'AssemblyResource'
						},
						addTotalColumn : true,
						totalColumns : {
							idPreFix : 'AssemblyResource',
							overloads : {
								readonly : true,
								editor : null
							}
						}
					};

				let serviceOptions = {
					getRequestData : function(item){
						return {
							Pk1 : item.EstHeaderFk,
							Pk2 : item.EstLineItemFk
						};
					},
					getFilterFn : function(tableId){
						return function(e, dto){
							return e.TableId === tableId && e.Pk1 === dto.EstHeaderFk && e.Pk2 === dto.EstLineItemFk && e.Pk3 === dto.Id;
						};
					},
					getModifiedItem : function(tableId, item){
						return {
							TableId : tableId,
							Pk1 : item.EstHeaderFk,
							Pk2 : item.EstLineItemFk,
							Pk3 : item.Id
						};
					},
					isReadOnlyItem : function(item){
						return !isCostCodeResource(item);
					}
				};

				let isPlantAssembly = options && options.isPlantAssembly,
					isPrjPlantAssembly = options && options.isPrjPlantAssembly,
					resourceDynamicConfigurationService = options ? options.resourceDynamicConfigurationService : null,
					resourceDataService = options ? options.dataService : null,
					assemblyDynamicUserDefinedColumnService = options ? options.assemblyDynamicUserDefinedColumnService : null,
					moduleName = options && options.moduleName ? options.moduleName : null;

				let configService = isPrjAssembly ? $injector.get('projectAssemblyResourceDynamicConfigurationService') : (isPlantAssembly || isPrjPlantAssembly) && !_.isEmpty(resourceDynamicConfigurationService) ? $injector.get(resourceDynamicConfigurationService) : $injector.get('estimateAssembliesResourceDynamicConfigurationService');
				let dataService = isPrjAssembly ? 'projectAssemblyResourceService' : (isPlantAssembly || isPrjPlantAssembly)  && !_.isEmpty(resourceDataService) ? resourceDataService :  'estimateAssembliesResourceService';


				let service = basicsCommonUserDefinedColumnServiceFactory.getService(configService, userDefinedColumnTableIds.EstimateResource, dataService, columnOptions, serviceOptions, moduleName);

				function isSubItemOrCompositeAssembly(resource) {
					return resource.EstResourceTypeFk === estimateMainResourceType.SubItem || resource.EstResourceTypeFk === estimateMainResourceType.Assembly;
				}

				function isEquipmentAssembly(resource) {
					return resource.EstResourceTypeFk === estimateMainResourceType.SubItem || resource.EstResourceTypeFk === estimateMainResourceType.Assembly;
				}

				function isCostCodeResource(resource){
					return resource.EstResourceTypeFk === estimateMainResourceType.CostCode;
				}

				service.baseFieldChange = service.fieldChange;
				let assemblyUserDefinedColumnService = isPrjAssembly ? $injector.get('projectAssemblyDynamicUserDefinedColumnService') : (isPlantAssembly || isPrjPlantAssembly) && !_.isEmpty(assemblyDynamicUserDefinedColumnService)? $injector.get(assemblyDynamicUserDefinedColumnService) :  $injector.get('estimateAssembliesDynamicUserDefinedColumnService');
				let liFieldChange = assemblyUserDefinedColumnService.fieldChange;
				let baseFieldChange = service.fieldChange;

				service.setColumnsReadOnly = function(item, readonly){
					let columns = _.filter(service.getDynamicColumns(), function(column){return !column.field.endsWith('Total');});

					columns.forEach(function(column){
						platformRuntimeDataService.readonly(item, [{
							field: column.field,
							readonly: readonly
						}]);
					});
				};

				function isMaterial(resource){
					return resource.EstResourceTypeFk === estimateMainResourceType.Material;
				}

				service.updateColumnsReadOnlyStats = function updateColumnsReadOnlyStats(resources){
					if(!resources || resources.length < 0) { return; }

					let columns = _.filter(service.getDynamicColumns(), function(column){return !column.field.endsWith('Total');});

					resources.forEach(function(resource){
						let readonly;
						let readonlyStats;

						if(isMaterial(resource)){
							readonly = true;
						}else{
							if (resource.__rt$data && resource.__rt$data.readonly && resource.__rt$data.readonly.length > 0) {
								readonlyStats = _.find(resource.__rt$data.readonly, function (item) {
									return item.field === 'CostUnit';
								});
							}

							readonly = readonlyStats && _.isBoolean(readonlyStats.readonly) ? readonlyStats.readonly : false;
						}

						columns.forEach(function(column){
							platformRuntimeDataService.readonly(resource, [{
								field: column.field,
								readonly: readonly
							}]);
						});
					});
				};

				function getProjectCostCodes(projectId){
					let defer = $q.defer();

					if(prjCostCodes.length && projectId > 0 && _projectId === projectId){
						defer.resolve(prjCostCodes);
					}else{
						$http.get(globals.webApiBaseUrl + 'project/costcodes/list?projectId=' + projectId).then(function(response){
							prjCostCodes = response.data;
							_projectId = projectId;
							defer.resolve(prjCostCodes);
						});
					}

					return defer.promise;
				}

				function getProjectCostCodeFk(projectId, resource){
					let defer = $q.defer();
					let projectCostCodeFk = resource.ProjectCostCodeFk && resource.ProjectCostCodeFk > 0 ? resource.ProjectCostCodeFk : null;

					if(!projectCostCodeFk){
						getProjectCostCodes(projectId).then(function(projectCostCodes){
							let projectCostCode = _.find(projectCostCodes, function(costcode){
								return costcode.BasCostCode && costcode.BasCostCode.Id === resource.MdcCostCodeFk;
							});
							projectCostCodeFk = projectCostCode ? projectCostCode.Id : null;
							defer.resolve(projectCostCodeFk);
						});
					}else{
						defer.resolve(projectCostCodeFk);
					}

					return defer.promise;
				}

				service.fieldChange = function(item, field, lineItem, resList){
					if(field === 'EstResourceTypeShortKey' || field === 'EstResourceTypeFkExtend'){
						service.updateColumnsReadOnlyStats([item]);
					}

					let defer = $q.defer();

					if (field === 'Code') {
						service.updateColumnsReadOnlyStats([item]);

						switch (item.EstResourceTypeFk){
							case estimateMainResourceType.CostCode : // cost code

								if(isPrjAssembly || isPrjPlantAssembly){
									let projectId = $injector.get('projectMainService').getSelected().Id;

									defer.promise = getProjectCostCodeFk(projectId, item).then(function(projectCostCodeFk){
										let requestData;
										if(projectCostCodeFk){
											requestData = {
												TableId : userDefinedColumnTableIds.ProjectCostCode,
												Pk1 : projectId,
												Pk2 : projectCostCodeFk
											};
											if(lineItem.LgmJobFk){
												requestData = {
													TableId : userDefinedColumnTableIds.ProjectCostCodeJobRate,
													Pk1 : projectId,
													Pk2 : projectCostCodeFk,
													Pk3 : lineItem.LgmJobFk
												};
											}
										}else{
											requestData = {
												TableId : userDefinedColumnTableIds.BasicsCostCode,
												Pk1 : item.MdcCostCodeFk
											};
										}

										resetValueAfterCodeChanged(requestData, item, lineItem, resList);
									});
								}else{
									let mdcCostCodeRequestData = {
										TableId : userDefinedColumnTableIds.BasicsCostCode,
										Pk1 : item.MdcCostCodeFk
									};

									defer.promise = resetValueAfterCodeChanged(mdcCostCodeRequestData, item, lineItem, resList);
								}
								break;
							case estimateMainResourceType.Assembly : // assembly
								var assemblyRequestData = {
									TableId : userDefinedColumnTableIds.EstimateLineItem,
									Pk1 : item.EstHeaderAssemblyFk,
									Pk2 : item.EstAssemblyFk
								};
								defer.promise = resetValueAfterCodeChanged(assemblyRequestData, item, lineItem, resList);
								break;
							default :
								defer.resolve(true);
						}
					}

					return defer.promise;
				};

				service.calculate = function(lineitem, resource, resourceList){
					estimateAssembliesDynamicUserDefinedColumnCalculationService.setUserDefinedColumns(service.getUserDefinedColumnFields());
					estimateAssembliesDynamicUserDefinedColumnCalculationService.doResourceCalculate(lineitem, resource, resourceList, service.baseFieldChange, liFieldChange);
				};

				function resetValueAfterCodeChanged(requestData, resource, lineItem, resList){
					if(!resource || !requestData) {
						return $q.when(true);
					}

					return service.getItemAsync(requestData).then(function (existedValue) {
						let columns = _.filter(service.getAllDynamicColumns(), function(column){ return !column.isExtend; });
						_.forEach(columns, function(column){
							resource[column.field] = existedValue && existedValue[column.field] ? existedValue[column.field] : 0;
						});

						service.calculate(lineItem, resource, resList);
					});
				}

				function flattenTree(resource, result){
					if(isSubItemOrCompositeAssembly(resource) || isEquipmentAssembly(resource)){
						let children = resource.EstResources;

						if(children && children.length){
							angular.forEach(children, function(child){
								flattenTree(child, result);
							});
						}
					}

					if(!isCostCodeResource(resource)){
						service.setColumnsReadOnly(resource, true);
					}

					result.push(resource);
				}

				service.processNewResourceTrees = function(resourceTrees, lineitem){
					if(!resourceTrees || !_.isArray(resourceTrees)) {
						return;
					}

					let toAttachItems = [];

					resourceTrees.forEach(function(tree){
						flattenTree(tree, toAttachItems);
					});

					service.attachData(toAttachItems, lineitem).then(function(){
						resourceTrees.forEach(function(tree){
							let resList = $injector.get('estimateAssembliesResourceService').getList();

							service.calculate(lineitem, tree, resList);
						});
					});
				};

				let baseattachDataToColumn = service.attachDataToColumn;

				service.attachDataToColumn = function(items, gridId){
					return baseattachDataToColumn(items, gridId);
				};

				service.attachData = function(toAttachItems){
					return service.getValueList().then(function(existedValues){
						let unAttachedItems = [];

						toAttachItems.forEach(function(item){
							let existedUserDefinedVal = _.find(existedValues, function(e){
								return e.TableId === userDefinedColumnTableIds.EstimateResource && e.Pk1 === item.EstHeaderFk && e.Pk2 === item.EstLineItemFk && e.Pk3 === item.Id;
							});

							if(!existedUserDefinedVal) {
								unAttachedItems.push(item);
							}
						});

						if(unAttachedItems.length > 0){
							attachDataFromExtend(unAttachedItems);
						}
					});
				};

				function getMdcCostCodeValue(reLoad){
					let defer = $q.defer();

					if(mdcCostCodeValueList.length <= 0 || reLoad){
						// master cost code
						let mdcCostCodeRequestData = {
							TableId : userDefinedColumnTableIds.BasicsCostCode
						};

						service.getListAsync(mdcCostCodeRequestData).then(function (response) {
							mdcCostCodeValueList = _.filter(response, function(item){
								return item && item.TableId === userDefinedColumnTableIds.BasicsCostCode;
							});

							defer.resolve(mdcCostCodeValueList);
						});
					}else{
						defer.resolve(mdcCostCodeValueList);
					}

					return defer.promise;
				}

				function getPrjCostCodeValue(projectId, reLoad){
					let defer = $q.defer();

					if(prjCostCodeValueList.length <= 0 || reLoad){
						// master cost code
						let prjCostCodeRequestData = {
							TableId : userDefinedColumnTableIds.ProjectCostCode,
							Pk1 : [projectId],
						};

						service.getListAsync(prjCostCodeRequestData).then(function (response) {
							prjCostCodeValueList = _.filter(response, function(item){
								return item && item.TableId === userDefinedColumnTableIds.ProjectCostCode;
							});

							defer.resolve(prjCostCodeValueList);
						});
					}else{
						defer.resolve(prjCostCodeValueList);
					}

					return defer.promise;
				}

				function getOnlyProjectCostCodejobRateValues(projectId, onlyProjectCostCodes, reLoad){
					let defer = $q.defer();

					if(projectCostCodejobRateValueList.length <= 0 || _projectId !== projectId || reLoad){
						// project cost code job rate
						let jobRateRequestData = {
							TableId : userDefinedColumnTableIds.ProjectCostCodeJobRate,
							Pk1 : [projectId],
							Pk2 : _.map(onlyProjectCostCodes, 'OriginalId')
						};

						service.getListAsync(jobRateRequestData).then(function (response) {
							projectCostCodejobRateValueList = _.filter(response, function(item){
								return item && item.TableId === userDefinedColumnTableIds.ProjectCostCodeJobRate;
							});

							defer.resolve(projectCostCodejobRateValueList);
						});
					}else{
						defer.resolve(projectCostCodejobRateValueList);
					}

					return defer.promise;
				}

				function getPrjCostCodejobRateValues(projectId, reLoad){
					let defer = $q.defer();

					if(prjCostCodejobRateValueList.length <= 0 || _projectId !== projectId || reLoad){

						// cost code job rate
						let jobRateRequestData = {
							TableId : userDefinedColumnTableIds.ProjectCostCodeJobRate,
							Pk1 : projectId
						};
						service.getListAsync(jobRateRequestData).then(function (response) {
							prjCostCodejobRateValueList = response;

							defer.resolve(prjCostCodejobRateValueList);
						});
					}else{
						defer.resolve(prjCostCodejobRateValueList);
					}

					return defer.promise;
				}

				function attachDataFromExtend(toAttachItems){
					let columns = _.filter(service.getAllDynamicColumns(), function(column){ return !column.isExtend; });

					return getMdcCostCodeValue().then(function(mdcCostCodeValues){
						toAttachItems.forEach(function(item){

							// get user defined value from mdc cost code
							let existedUserDefinedVal = _.find(mdcCostCodeValues, function(e){
								return e.TableId === userDefinedColumnTableIds.BasicsCostCode && e.Pk1 === item.MdcCostCodeFk;
							});

							if(existedUserDefinedVal){
								_.forEach(columns, function(column){
									item[column.field] = existedUserDefinedVal && existedUserDefinedVal[column.field] ? existedUserDefinedVal[column.field] : 0;
								});
							}else{
								service.attachEmptyDataToColumn(item);
							}
						});
					});
				}

				function getProjectCostCodeFkFromCacheForLookup(resource){
					let projectCostCodeFk = resource.ProjectCostCodeFk && resource.ProjectCostCodeFk > 0 ? resource.ProjectCostCodeFk : null;

					if(!projectCostCodeFk){
						let projectCostCode = _.find(prjCostCodes, function(costcode){
							return costcode.BasCostCode && costcode.BasCostCode.Id === resource.OriginalId;
						});
						projectCostCodeFk = projectCostCode ? projectCostCode.Id : null;
					}

					return projectCostCodeFk;
				}

				service.attachDataForLookup = function(toAttachItems, lineitem, options){
					let columns = _.filter(service.getDynamicColumns(), function(column){ return !column.isExtend; });
					let promises = [];
					let projectFk = null;
					let isPrjAssembly = options ? options.isPrjAssembly : false;
					let reLoad = options ? options.reLoad : false;
					let jobFk = options ? options.currentJobFk || -1 : -1;

					if(isPrjAssembly){
						// cost code which is created in project cost code.
						let onlyProjectCostCode = _.filter(toAttachItems, function(item){
							return item.IsOnlyProjectCostCode;
						});

						if (lineitem){
							projectFk = lineitem.ProjectFk;
						}else{
							let projectSelected = $injector.get('projectMainService').getSelected();
							let estProjectSelectedId = $injector.get('estimateMainService').getSelectedProjectId();
							projectFk = projectSelected ? projectSelected.Id : estProjectSelectedId;
						}

						if (projectFk === null || projectFk === undefined){
							return $q.when([]);
						}

						promises.push(getPrjCostCodeValue(projectFk, reLoad));
						promises.push(getOnlyProjectCostCodejobRateValues(projectFk, onlyProjectCostCode, reLoad));
						promises.push(getPrjCostCodejobRateValues(projectFk, reLoad));
						promises.push(getProjectCostCodes(projectFk));

						if(_projectId !== projectFk){
							_projectId = projectFk;
						}
					}else{
						promises.push(getMdcCostCodeValue(reLoad));
					}

					return $q.all(promises).then(function(){
						toAttachItems.forEach(function(item){
							// get user defined value from mdc cost code
							let existedUserDefinedVal;

							if(isPrjAssembly) {
								if (item.IsOnlyProjectCostCode) {
									if (jobFk !== -1) {
										existedUserDefinedVal = _.find(prjCostCodejobRateValueList, function (e) {
											return e.TableId === userDefinedColumnTableIds.ProjectCostCodeJobRate && e.Pk1 === projectFk && e.Pk2 === item.OriginalId && e.Pk3 === jobFk;
										});
									}
									if (!existedUserDefinedVal) {
										existedUserDefinedVal = _.find(prjCostCodeValueList, function (e) {
											return e.TableId === userDefinedColumnTableIds.ProjectCostCode && e.Pk1 === projectFk && e.Pk2 === item.OriginalId;
										});
									}
								} else {
									if (jobFk !== -1) {
										existedUserDefinedVal = _.find(prjCostCodejobRateValueList, function (e) {
											return e.TableId === userDefinedColumnTableIds.ProjectCostCodeJobRate && e.Pk1 === projectFk && e.Pk2 === item.OriginalPrjCostCodeId && e.Pk3 === jobFk;
										});
									}
									if (!existedUserDefinedVal) {
										existedUserDefinedVal = _.find(prjCostCodeValueList, function (e) {
											return e.TableId === userDefinedColumnTableIds.ProjectCostCode && e.Pk1 === projectFk && e.Pk2 === getProjectCostCodeFkFromCacheForLookup(item);
										});
									}
								}
							}else {
								existedUserDefinedVal = _.find(mdcCostCodeValueList, function (e) {
									return e.TableId === userDefinedColumnTableIds.BasicsCostCode && e.Pk1 === item.Id;
								});
							}

							_.forEach(columns, function(column){
								item[column.field] = existedUserDefinedVal && existedUserDefinedVal[column.field] ? existedUserDefinedVal[column.field] : 0;
							});
						});
					});
				};

				let baseHandleEntitiesDeleted = service.handleEntitiesDeleted;

				service.handleEntitiesDeleted = function(deleteEntities, lineitem, resourceTrees){
					if(lineitem && resourceTrees && resourceTrees.length > 0){
						let resList = [];
						estimateAssembliesDynamicUserDefinedColumnCalculationService.setUserDefinedColumns(service.getUserDefinedColumnFields());
						resourceTrees.forEach(function(tree){
							flattenTree(tree, resList);
						});

						resourceTrees.forEach(function(tree){
							estimateAssembliesDynamicUserDefinedColumnCalculationService.doResourceCalculate(lineitem, tree, resList, service.baseFieldChange, liFieldChange);
						});
					}

					baseHandleEntitiesDeleted(deleteEntities);
				};

				service.calculateResources = function(lineitem, resourceList){
					estimateAssembliesDynamicUserDefinedColumnCalculationService.setUserDefinedColumns(service.getUserDefinedColumnFields());
					estimateAssembliesDynamicUserDefinedColumnCalculationService.doResourcesCalculate(lineitem, resourceList, baseFieldChange, liFieldChange);
				};

				service.resolveResourcesFromAssembly = function(lineitem, resources, valEntities){
					if(!resources || resources.length <= 0 || !valEntities) {
						return;
					}

					let resList = [];
					resources.forEach(function(tree){
						flattenTree(tree, resList);
					});
					let toUpdateResourceIds = _.map(resList, 'Id');

					var resourceList = $injector.get(dataService).getList();
					var toUpdateResource = _.filter(resourceList, function(resource){
						return toUpdateResourceIds.includes(resource.Id);
					});
					service.attachUpdatedValueToColumn(toUpdateResource, valEntities, false);

					service.updateColumnsReadOnlyStats(resourceList);
					// will calculate later
					// service.calculateResources(lineitem, resourceList);
				};

				service.clear = function(){
					prjCostCodes = [];
					_projectId = -1;
					mdcCostCodeValueList = [];
					prjCostCodeValueList = [];
					projectCostCodejobRateValueList = [];
				};

				service.clearCostCodejobRateValueList = function(){
					if(isPrjAssembly){
						prjCostCodeValueList = [];
						projectCostCodejobRateValueList = [];
						prjCostCodes = [];
					}else{
						mdcCostCodeValueList = [];
					}
				};

				return service;
			};

			return factoryService;
		}
	]);
})(angular);
