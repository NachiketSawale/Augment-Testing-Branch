/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	/* global globals, _ */
	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainJobCostcodesLookupService
	 * @function
	 *
	 * @description
	 * estimateMainJobCostcodesLookupService provides all lookup data for estimate module
	 */
	angular.module(moduleName).factory('estimateMainJobCostcodesLookupService', ['$http', '$q', '$injector', 'estimateMainCommonLookupService', 'basicsLookupdataTreeHelper','platformDataServiceEntitySortExtension',
		function ($http, $q, $injector, estimateMainCommonLookupService, basicsLookupdataTreeHelper,platformDataServiceEntitySortExtension) {

			// Object presenting the service
			let service = {};
			let projectId = null,
				currentJobId = null,
				mdcPrjCostCodesByJobDic = {},
				mdcPrjCostCodesByJob = [],
				defaultJobId = -1;

			let projectCostCodeOfCurrentJob;

			function buildTree(list) {
				let context = {
						treeOptions:{
							parentProp : 'CostCodeParentFk',
							childProp : 'CostCodes'
						},
						IdProperty: 'Id'
					},
					treeList = [];
				if(list && list.length){
					angular.forEach(list, function (d) {
						d.CostCodes = [];
						if(d.CostCodeParentFk !==  null){
							let parent = _.find(list, {Id : d.CostCodeParentFk});
							if(!parent){
								d.CostCodeParentFk = null;
							}
						}
					});
					treeList = basicsLookupdataTreeHelper.buildTree(list, context);
					platformDataServiceEntitySortExtension.sortTree(treeList,'Code','CostCodes');
				}
				return treeList;
			}

			// Load the estimate project cost code on project change
			service.setSelectedProjectId = function setSelectedProjectId(id, jobId) {
				projectId = id;
				currentJobId = jobId;
			};

			let isMdcPrjCostCodesLoading = false;
			let mdcPrjCostCodesLoadingPromise = null;
			service.getMdcPrjCostCodes = function getMdcPrjCostCodes(isPrjAssembly) {
				if (isMdcPrjCostCodesLoading) {
					return mdcPrjCostCodesLoadingPromise.then(() => {
						return projectCostCodeOfCurrentJob;
					});
				}
				if (projectId) {
					if (!currentJobId) {
						currentJobId = defaultJobId;
					}
					isMdcPrjCostCodesLoading = true;
					let lazyLoadSystemOption = $injector.get('estimateMainService').getLazyLoadCostCodeSystemOption();
					let endPointName = lazyLoadSystemOption ? 'mdcprjcostcodesbyjobforlookup' : 'mdcprjcostcodesbyjob';
					mdcPrjCostCodesLoadingPromise = $http.get(globals.webApiBaseUrl + 'project/costcodes/' + endPointName + '?projectId=' + projectId + '&jobId=' + currentJobId + '&isPrjAssembly=' + !!isPrjAssembly).then(function (response) {
						let list = response.data;
						if (lazyLoadSystemOption) {
							return new Promise(resolve => {
								setTimeout(() => {
									const flatList = [];
									$injector.get('cloudCommonGridService').flatten(list, flatList, 'CostCodes');
									$injector.get('basicsLookupdataLookupDescriptorService').updateData('prjCostCodesByJob', flatList);
									projectCostCodeOfCurrentJob = flatList;
									resolve(list);
								}, 0);
							});
						} else {
							list = assignTempLookupIds(list);
							$injector.get('basicsLookupdataLookupDescriptorService').updateData('prjCostCodesByJob', list);
							projectCostCodeOfCurrentJob = list;
							return list;
						}
					}).finally(function () {
						isMdcPrjCostCodesLoading = false;
					});

					return mdcPrjCostCodesLoadingPromise;
				} else {
					return $q.when([]);
				}
			};


			service.getPrjCostCodesOfCurrentJob = function getPrjCostCodesOfCurrentJob() {
				if (projectId) {
					if(projectCostCodeOfCurrentJob && projectCostCodeOfCurrentJob.length > 0){
						return $q.when(projectCostCodeOfCurrentJob);
					}else{
						return service.getMdcPrjCostCodes();
					}
				} else {
					return $q.when([]);
				}
			};

			service.getEstCCByIdAsyncByJobId = function getEstCCByIdAsyncByJobId(costcodeId, res) {
				if (!costcodeId) {
					return $q.when({});
				}
				projectId = projectId || -1;
				if (res) {
					currentJobId = res.LgmJobFk ? res.LgmJobFk : getJobId(res);
				}
				let mdcPrjCostCodes = mdcPrjCostCodesByJobDic[currentJobId];
				if (mdcPrjCostCodes && mdcPrjCostCodes.length) {
					let item = _.find(mdcPrjCostCodes, {Id: costcodeId, Code: res.Code});
					if (item) {
						return $q.when(item);
					}
				}
				let data = {
					HasMdcCostCode: !!res.MdcCostCodeFk,
					ProjectId: projectId,
					CurrentCostCodeId: costcodeId,
					JobId: currentJobId,
					Code: res.Code
				};

				return $http.post(globals.webApiBaseUrl + 'project/costcodes/mdcprjcostcodebyfilter', data)
					.then(function (response) {
						return response.data;
					});
			};

			// get data list of the enterprise costcodes async(filter by company)
			let getListAsync = function getListAsync(isPrjAssembly) {
				return service.getMdcPrjCostCodes(isPrjAssembly).then(function (data) {
					let lazyLoadSystemOption = $injector.get('estimateMainService').getLazyLoadCostCodeSystemOption();
					let costCodeTree = lazyLoadSystemOption ? _.filter(data, {CostCodeParentFk : null}) : buildTree(data);
					mdcPrjCostCodesByJobDic[currentJobId] = costCodeTree;
					return costCodeTree;
				});
			};

			function filterByCurrentJob () {
				mdcPrjCostCodesByJob = mdcPrjCostCodesByJobDic[currentJobId || defaultJobId];
			}

			function getJobId(resource){
				return $injector.get('estimateMainService').getLgmJobId(resource);
			}

			function assignParent(item, list, parentProps){
				if(item[parentProps]){
					let matchedItem = _.find(list, {OriginalId : item[parentProps]});
					if(matchedItem){
						if(!matchedItem.CostCodes){
							matchedItem.CostCodes = [];
						}
						item.CostCodeParentFk = matchedItem.Id;
					}
				}
			}

			function assignTempLookupIds(items){
				let cnt = 0;
				angular.forEach(items, function(item){
					item.OriginalId = angular.copy(item.Id);
					item.OriginalCostCodeParentFk = angular.copy(item.CostCodeParentFk);
					item.Id = ++cnt;
					item.CostCodeParentFk = null;
					item.CostCodes = [];
				});

				angular.forEach(items, function(item){
					// eslint-disable-next-line no-prototype-builtins
					if(item.hasOwnProperty('CostCodeParentFk')){
						assignParent(item, items, 'OriginalCostCodeParentFk');
					}
				});
				return items;
			}


			// get tree of the estimate cost codes
			service.getEstCostCodesTreeByJob = function (entity, isPrjAssembly) {
				if(isPrjAssembly){
					let prjAssembly = $injector.get('projectAssemblyMainService').getSelected() !== null ? $injector.get('projectAssemblyMainService').getSelected() : $injector.get('projectPlantAssemblyMainService').getSelected();
					currentJobId = prjAssembly && prjAssembly.LgmJobFk ? prjAssembly.LgmJobFk : defaultJobId;
				} else if(entity){
					currentJobId = entity && entity.LgmJobFk ? entity.LgmJobFk : getJobId(entity);
				}
				filterByCurrentJob();
				if(mdcPrjCostCodesByJob && mdcPrjCostCodesByJob.length > 0) {
					return $q.when(mdcPrjCostCodesByJob);
				} else {
					return getListAsync(isPrjAssembly).then(function (data) {
						return data;
					});
				}
			};

			service.refreshEstCostCodesTree = function refreshEstCostCodesTree(isPrjAssembly){
				mdcPrjCostCodesByJob = [];
				let prjService = $injector.get('projectAssemblyResourceService').getSelected() !== null ? $injector.get('projectAssemblyResourceService').getSelected() : $injector.get('projectPlantAssemblyResourceService').getSelected();
				let entity = isPrjAssembly ? prjService : $injector.get('estimateMainResourceService').getSelected();
				let udpResoruceService = isPrjAssembly ?  $injector.get('projectAssemblyResourceDynamicUserDefinedColumnService') : $injector.get('estimateMainResourceDynamicUserDefinedColumnService');
				if(isPrjAssembly){
					let prjAssembly = $injector.get('projectAssemblyMainService').getSelected() !== null ? $injector.get('projectAssemblyMainService').getSelected() : $injector.get('projectPlantAssemblyMainService').getSelected();
					currentJobId = prjAssembly && prjAssembly.LgmJobFk ? prjAssembly.LgmJobFk : defaultJobId;
				} else if(entity){
					currentJobId = entity && entity.LgmJobFk ? entity.LgmJobFk : getJobId(entity);
				}
				mdcPrjCostCodesByJobDic[currentJobId] = [];
				udpResoruceService.clearCostCodejobRateValueList();
				return service.getEstCostCodesTreeByJob(entity, isPrjAssembly);
			};

			// get search list of the estimate cost codes
			service.getSearchList = function getSearchList(value, field, isSpecificSearch, res, isPrjAssembly) {
				if (isPrjAssembly){
					let prjAssembly = $injector.get('projectAssemblyMainService').getSelected();
					currentJobId = prjAssembly && prjAssembly.LgmJobFk ? prjAssembly.LgmJobFk : defaultJobId;
				} else if(res){
					currentJobId = res.LgmJobFk ? res.LgmJobFk : getJobId(res);
				}
				filterByCurrentJob();

				let filterParams = {
					'codeProp': 'Code',
					'descriptionProp': 'DescriptionInfo.Translated',
					'field': field,
					'isSpecificSearch': isSpecificSearch,
					'searchValue': value
				};

				if (mdcPrjCostCodesByJob && mdcPrjCostCodesByJob.length > 0) {
					let lazyLoadSystemOption = $injector.get('estimateMainService').getLazyLoadCostCodeSystemOption();
					if(lazyLoadSystemOption && value === ""){
						return $q.when(mdcPrjCostCodesByJob);
					}
					else{
						let existItems = estimateMainCommonLookupService.getSearchData(filterParams, angular.copy(mdcPrjCostCodesByJob), 'CostCodes', 'CostCodeParentFk', true);
						projectCostCodeOfCurrentJob = existItems;
						return $q.when(existItems);
					}
				}
				else{
					return getListAsync(isPrjAssembly).then(function(data){
						return estimateMainCommonLookupService.getSearchData(filterParams, angular.copy(data), 'CostCodes', 'CostCodeParentFk', true);
					});
				}
			};

			// get estimate (project/master) cost code by code from server
			service.getEstCCByCodeAsync = function getEstCCByCodeAsync(res) {
				let code = _.toUpper(res.Code);
				projectId = projectId || -1;

				if(res){
					currentJobId = res.LgmJobFk ? res.LgmJobFk : getJobId(res);
				}
				let mdcPrjCostCodes = mdcPrjCostCodesByJobDic[currentJobId];
				if(mdcPrjCostCodes && mdcPrjCostCodes.length){

					// First flatten tree then find item
					let mdcPrjCostCodesList = [];
					$injector.get('cloudCommonGridService').flatten(mdcPrjCostCodes, mdcPrjCostCodesList, 'CostCodes');

					let item = _.find(mdcPrjCostCodesList, {Code:code});

					return $q.when(item);
				}else{
					return $http.get(globals.webApiBaseUrl + 'project/costcodes/mdcprjcostcodebycode?projectId=' + projectId + '&code=' + code+ '&jobId=' + currentJobId).then(function (response) {
						let item = response.data;
						if(item){
							item.OriginalId = item.Id;
						}
						return item;
					});
				}
			};

			service.clearCache = function clearCache(){
				mdcPrjCostCodesByJob = [];
				mdcPrjCostCodesByJobDic = {};
			};

			service.getItemById = function(id){
				if(!projectCostCodeOfCurrentJob || projectCostCodeOfCurrentJob.length <= 0){
					return null;
				}
				return _.find(projectCostCodeOfCurrentJob, function (item) {
					return item.Id === id || item.OriginalId === id;
				});
			};

			service.getCurrentJobFk = function(){
				return currentJobId;
			};

			service.sortNewCreatedItem = function(newItem){
				filterByCurrentJob();
				if(projectCostCodeOfCurrentJob && projectCostCodeOfCurrentJob.length>0){

					const ids = projectCostCodeOfCurrentJob.map(object => {
						return object.Id;
					});
					let max = Math.max(...ids);
					newItem.OriginalId = angular.copy(newItem.Id);
					newItem.OriginalCostCodeParentFk = angular.copy(newItem.CostCodeParentFk);
					newItem.Id = ++max;
					newItem.CostCodes = [];

					return newItem;
				}
			};

			service.addLookupItem = function(item, jobId){
				if(!item){
					return;
				}
				if(jobId === currentJobId){
					projectCostCodeOfCurrentJob.push(item);
					let costCodeTree = buildTree(projectCostCodeOfCurrentJob);
					mdcPrjCostCodesByJobDic[currentJobId] = costCodeTree;
					mdcPrjCostCodesByJob = costCodeTree;
					let udpResoruceService = $injector.get('estimateMainResourceDynamicUserDefinedColumnService');
					udpResoruceService.clearCostCodejobRateValueList();
					return $q.when(true);
				}else{
					return service.refreshEstCostCodesTree();
				}
			};

			service.getTree = function() {
				return mdcPrjCostCodesByJob;
			}

			return service;
		}]);
})();
