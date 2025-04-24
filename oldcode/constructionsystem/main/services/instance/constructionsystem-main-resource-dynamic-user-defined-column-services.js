/**
 * Created by myh on 01/12/2022.
 */

(function(angular){
	'use strict';

	let moduleName = 'constructionsystem.main';

	angular.module(moduleName).factory('constructionsystemMainResourceDynamicUserDefinedColumnService', ['$http', 'globals', '_', '$q', '$injector', 'platformRuntimeDataService',
		'userDefinedColumnTableIds', 'basicsCommonUserDefinedColumnServiceFactory', 'constructionsystemMainResourceDynamicConfigurationService', 'estimateMainDynamicUserDefinedColumnCalculationService',
		function(
			$http, globals, _, $q, $injector, platformRuntimeDataService, userDefinedColumnTableIds, basicsCommonUserDefinedColumnServiceFactory,
			constructionsystemMainResourceDynamicConfigurationService, estimateMainDynamicUserDefinedColumnCalculationService){

			let userDefinedColumnFields = [
				'ColVal1',
				'ColVal2',
				'ColVal3',
				'ColVal4',
				'ColVal5'
			];
			let prjCostCodes = [];
			let _projectId = -1;
			let reAttachDataToColumn = false;
			let projectCostCodejobRateValueList = [];
			let selectEstHeader = null;
			let columnOptions = {
				columns : {
					idPreFix : 'EstimateResource'
				},
				addTotalColumn : true,
				totalColumns : {
					idPreFix : 'EstimateResource',
					overloads : {
						readonly : true,
						editor : null
					}
				},
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
				}
			};
			let moduleName = 'ConstructionsystemMainResource';

			let service = basicsCommonUserDefinedColumnServiceFactory.getService(constructionsystemMainResourceDynamicConfigurationService, userDefinedColumnTableIds.EstimateResource, 'constructionsystemMainResourceDataService', columnOptions, serviceOptions, moduleName);

			function isSubItemOrCompositeAssembly(resource) {
				return resource.EstResourceTypeFk === 5 || resource.EstResourceTypeFk === 4;
			}

			let liFieldChange = $injector.get('constructionsystemMainDynamicUserDefinedColumnService').fieldChange;

			service.setColumnsReadOnly = function(item, readonly){
				let columns = _.filter(service.getDynamicColumns(), function(column){return !column.field.endsWith('Total');});

				columns.forEach(function(column){
					platformRuntimeDataService.readonly(item, [{
						field: column.field,
						readonly: readonly
					}]);
				});
			};

			service.updateColumnsReadOnlyStats = function (resources){
				if(!resources || resources.length < 0) {
					return;
				}

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

			function isMaterial(resource){
				return resource.EstResourceTypeFk === 2;
			}

			function isCostCode(resource){
				return resource.EstResourceTypeFk === 1 || (resource.EstResourceTypeShortKey && resource.EstResourceTypeShortKey.toUpperCase() === 'C');
			}

			let baseFieldChange = service.fieldChange;
			service.baseFieldChange = baseFieldChange;
			service.fieldChange = function(item, field, newValue, lineItem, resList){
				if(field === 'EstResourceTypeShortKey'){
					service.updateColumnsReadOnlyStats([item]);
				}

				if (field === 'Code' || field === 'LgmJobFk') {
					service.updateColumnsReadOnlyStats([item]);

					if(isCostCode(item)){
						attachDataFromExtend([item], lineItem).then(function () {
							service.calculate(lineItem, item, resList);
						});
					}else{
						service.attachEmptyDataToColumn(item);
					}
				}

				if (userDefinedColumnFields.indexOf(field) !== -1) {
					service.calculate(lineItem, item, resList);
				}
			};

			service.calculate = function(lineitem, resource, resourceList){
				estimateMainDynamicUserDefinedColumnCalculationService.setUserDefinedColumns(service.getUserDefinedColumnFields());
				if(reAttachDataToColumn){
					reAttachDataToColumn = false;
					service.attachDataToColumn(resourceList, lineitem).then(function(){
						estimateMainDynamicUserDefinedColumnCalculationService.calculateLineItemAndResoruce(lineitem, resourceList, baseFieldChange, liFieldChange);
					});
				}else{
					estimateMainDynamicUserDefinedColumnCalculationService.calculateLineItemAndResoruce(lineitem, resourceList, baseFieldChange, liFieldChange);
				}
			};

			service.setReAttachDataToColumn = function(value){
				reAttachDataToColumn = value;
			};

			service.calculateResources = function(lineitem, resourceList){
				estimateMainDynamicUserDefinedColumnCalculationService.setUserDefinedColumns(service.getUserDefinedColumnFields());
				estimateMainDynamicUserDefinedColumnCalculationService.doResourcesCalculate(lineitem, resourceList, baseFieldChange, liFieldChange);
			};

			function flattenTree(resource, result){
				if(isSubItemOrCompositeAssembly(resource) || (resource.EstResources && resource.EstResources.length > 0)){
					let children = resource.EstResources;

					if(children && children.length){
						angular.forEach(children, function(child){
							flattenTree(child, result);
						});
					}
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

				service.updateColumnsReadOnlyStats(toAttachItems);

				service.attachData(toAttachItems, lineitem).then(function(){
					let resList = $injector.get('estimateMainResourceService').getList();

					resourceTrees.forEach(function(tree){
						let rootResource = _.find(resList, function(res){
							return res.Id === tree.Id;
						});

						service.calculate(lineitem, rootResource, resList);
					});
				});
			};

			let baseattachDataToColumn = service.attachDataToColumn;

			function getProjectCostCodes(projectId){
				let defer = $q.defer();

				if(prjCostCodes.length && projectId > 0 && _projectId === projectId){
					defer.resolve(prjCostCodes);
				}else{
					$http.get(globals.webApiBaseUrl + 'project/costcodes/list?projectId=' + projectId).then(function(response){
						prjCostCodes = response.data;

						defer.resolve(prjCostCodes);
					});
				}

				return defer.promise;
			}

			function getProjectCostCodejobRateValues(projectId){
				let defer = $q.defer();

				if(projectCostCodejobRateValueList.length <= 0 || _projectId !== projectId){
					let promises = [];

					// cost code job rate
					let jobRateRequestData = {
						TableId : userDefinedColumnTableIds.ProjectCostCodeJobRate,
						Pk1 : projectId
					};
					promises.push(service.getListAsync(jobRateRequestData));

					// master cost code
					let mdcCostCodeRequestData = {
						TableId : userDefinedColumnTableIds.BasicsCostCode
					};
					promises.push(service.getListAsync(mdcCostCodeRequestData));

					$q.all(promises).then(function (response) {
						projectCostCodejobRateValueList = response[1];

						defer.resolve(projectCostCodejobRateValueList);
					});
				}else{
					defer.resolve(projectCostCodejobRateValueList);
				}

				return defer.promise;
			}

			service.setSelectedEstHeader = function(estHeader){
				selectEstHeader = estHeader;
			};

			service.resolveRefResource = function(resources, values){
				let resList = [];

				resources.forEach(function(tree){
					flattenTree(tree, resList);
				});

				service.attachDataToColumnFromColVal(resList, values, true);
			};

			service.attachDataToColumn = function(items, lineitem, gridId){
				let resList = [];

				items.forEach(function(tree){
					flattenTree(tree, resList);
				});

				return baseattachDataToColumn(resList, gridId).then(function(){
					lineitem.isResourceUDPAttached = true;
				});

			};

			function getLgmJobId(resource){
				if(!resource) {
					return null;
				}

				if(resource.LgmJobFk) {
					return resource.LgmJobFk;
				}

				let resources = $injector.get('estimateMainResourceService').getList();

				let parentIds = [];
				function getParent(item){
					return _.find(resources, {Id : item.EstResourceFk, EstLineItemFk : item.EstLineItemFk, EstHeaderFk : item.EstHeaderFk});
				}
				let parent = getParent(resource);
				while(parent){
					if (parentIds.indexOf(parent.Id) !== -1){
						return null;
					}else{
						parentIds.push(parent.Id);
					}
					if(parent.LgmJobFk) {
						return parent.LgmJobFk;
					}

					parent = getParent(parent);
				}
				let lineItems = $injector.get('estimateMainService').getList();

				let item = _.find(lineItems, {Id: resource.EstLineItemFk, EstHeaderFk : resource.EstHeaderFk});
				if(item && item.LgmJobFk){
					return item.LgmJobFk;
				}else{
					return selectEstHeader && selectEstHeader.Id === resource.EstHeaderFk ? selectEstHeader.LgmJobFk : null;
				}
			}

			service.attachData = function(toAttachItems, lineitem){
				return service.getValueList().then(function(existedValues){
					let unAttachedItems = [];

					toAttachItems.forEach(function(item){
						let existedUserDefinedVal = _.find(existedValues, function(e){
							return e.TableId === userDefinedColumnTableIds.EstimateResource && e.Pk1 === item.EstHeaderFk && e.Pk2 === item.EstLineItemFk && e.Pk3 === item.Id;
						});

						// get user defined value from project cost code job rate
						if(!existedUserDefinedVal) {
							unAttachedItems.push(item);
						}
					});

					if(unAttachedItems.length > 0){
						return attachDataFromExtend(unAttachedItems, lineitem).then(function(){
							service.calculateResources(lineitem, toAttachItems);
						});
					}
				});
			};

			// get user defined column value from project costcode job rate or mdc cost code.
			function attachDataFromExtend(toAttachItems, lineitem, options){
				let promises = [];
				let projectFk = null;
				let isForCostCodeLookup = options ? options.isForCostCodeLookup : false;

				if (lineitem){
					projectFk = lineitem.ProjectFk;
				}else{
					let projectSelected = $injector.get('projectMainService').getSelected();
					let estProjectSelectedId = $injector.get('estimateMainService').getSelectedProjectId();
					projectFk = projectSelected ? projectSelected.Id : estProjectSelectedId;
				}

				if (projectFk === null){
					return $q.when([]);
				}

				promises.push(getProjectCostCodejobRateValues(projectFk));
				promises.push(getProjectCostCodes(projectFk));

				if(_projectId !== projectFk){
					_projectId = projectFk;
				}

				return $q.all(promises).then(function(response){
					let projectCostCodeValueList = response[0];
					let projectCostCodes = response[1];

					toAttachItems.forEach(function(item){
						// get user defined value from project cost code job rate
						let projectCostCodeFk = isForCostCodeLookup && item.IsOnlyProjectCostCode ? item.OriginalId : item.ProjectCostCodeFk;
						let jobFk = options && isForCostCodeLookup ? options.currentJobFk : getLgmJobId(item);

						if(!projectCostCodeFk){
							let projectCostCode = _.find(projectCostCodes, function(costcode){
								// return costcode.BasCostCode && costcode.BasCostCode.Id === item.MdcCostCodeFk;
								return costcode.BasCostCode && costcode.BasCostCode.Id === (isForCostCodeLookup ? item.OriginalId : item.MdcCostCodeFk);
							});
							projectCostCodeFk = projectCostCode ? projectCostCode.Id : null;
						}
						// return e.TableId === tableId && e.Pk1 === _projectId && e.Pk2 === dto.ProjectCostCodeFk && e.Pk3 === dto.LgmJobFk;
						let existedUserDefinedVal = _.find(projectCostCodeValueList, function(e){
							// return e.TableId === userDefinedColumnTableIds.ProjectCostCodeJobRate && e.Pk1 === projectFk && e.Pk2 === projectCostCodeFk && e.Pk3 === jobFk;
							return e.TableId === userDefinedColumnTableIds.ProjectCostCodeJobRate && e.Pk1 === projectFk && e.Pk2 === projectCostCodeFk && ( jobFk === null || e.Pk3 === jobFk);
						});

						// get user defined value from mdc cost code
						if(!existedUserDefinedVal) {
							existedUserDefinedVal = _.find(projectCostCodeValueList, function(e){
								// return e.TableId === userDefinedColumnTableIds.BasicsCostCode && e.Pk1 === item.MdcCostCodeFk;
								return e.TableId === userDefinedColumnTableIds.BasicsCostCode && e.Pk1 === (isForCostCodeLookup ? item.OriginalId  : item.MdcCostCodeFk);
							});
						}

						if(existedUserDefinedVal && (isForCostCodeLookup || isCostCode(item))){
							let columns = _.filter(service.getAllDynamicColumns(), function(column){ return !column.isExtend; });
							_.forEach(columns, function(column){
								item[column.field] = existedUserDefinedVal && existedUserDefinedVal[column.field] ? existedUserDefinedVal[column.field] : 0;
							});
						}else{
							service.attachEmptyDataToColumn(item);
						}
					});
				});
			}

			service.attachDataFromExtend = attachDataFromExtend;

			let baseHandleEntitiesDeleted = service.handleEntitiesDeleted;

			service.handleEntitiesDeleted = function(deleteEntities, lineitem, resourceTrees){
				if(_.isArray(deleteEntities) && deleteEntities.length > 0){
					if(lineitem && resourceTrees && resourceTrees.length > 0){
						let resList = [];

						resourceTrees.forEach(function(tree){
							flattenTree(tree, resList);
						});

						estimateMainDynamicUserDefinedColumnCalculationService.setUserDefinedColumns(service.getUserDefinedColumnFields());
						resourceTrees.forEach(function(tree){
							estimateMainDynamicUserDefinedColumnCalculationService.doResourceCalculate(lineitem, tree, resList, baseFieldChange, liFieldChange);
						});
					}

					let toDeleteResources = [];
					deleteEntities.forEach(function(tree){
						flattenTree(tree, toDeleteResources);
					});

					baseHandleEntitiesDeleted(toDeleteResources, true);
				}
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

				var resourceList = $injector.get('estimateMainResourceService').getList();
				var toUpdateResource = _.filter(resourceList, function(resource){
					return toUpdateResourceIds.includes(resource.Id);
				});
				service.attachUpdatedValueToColumn(toUpdateResource, valEntities, false);

				service.updateColumnsReadOnlyStats(resourceList);
				service.calculateResources(lineitem, resourceList);
			};

			service.clear = function(){
				prjCostCodes = [];
				_projectId = -1;
				selectEstHeader = null;
				projectCostCodejobRateValueList = [];
			};

			return service;
		}]);
})(angular);