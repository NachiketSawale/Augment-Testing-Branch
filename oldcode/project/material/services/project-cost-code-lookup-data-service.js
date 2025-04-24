
(function (angular) {
	/* global _, globals */
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('projectCostCodeLookupDataService', [
		'$q', '$http', '$injector', 'cloudCommonGridService','basicsLookupdataTreeHelper','platformDataServiceEntitySortExtension','estimateMainCommonLookupService',
		function ($q, $http, $injector, cloudCommonGridService,basicsLookupdataTreeHelper,platformDataServiceEntitySortExtension,estimateMainCommonLookupService){


			let service = {};
			let projectId = -1;
			let jobId = -1;
			let mdcPrjCostCodesByJob =[];
			let mdcPrjCostCodesByJobDic = {};

			angular.extend(service,{
				getList: getList,
				setProjectId :setProjectId,
				getProjectId :getProjectId,
				getSearchList: getSearchList,
				setJobId:setJobId,
				refreshEstCostCodesTree:refreshEstCostCodesTree,
				getEstCCByCodeAsync :getEstCCByCodeAsync
			});

			return service;

			function getList() {
				return getListAsync();
			}

			function getEstCCByCodeAsync(res) {
				let CostCode = _.toUpper (res.CostCode);
				let mdcPrjCostCodes = mdcPrjCostCodesByJobDic[jobId];
				if (mdcPrjCostCodes && mdcPrjCostCodes.length) {

					// First flatten tree then find item
					let mdcPrjCostCodesList = [];
					$injector.get ('cloudCommonGridService').flatten (mdcPrjCostCodes, mdcPrjCostCodesList, 'CostCodes');

					let item = _.find (mdcPrjCostCodesList, {Code: CostCode});

					return $q.when (item);
				} else {
					return $http.get (globals.webApiBaseUrl + 'project/costcodes/mdcprjcostcodebycode?projectId=' + projectId + '&code=' + CostCode + '&jobId=' + jobId).then (function (response) {
						let item = response.data;
						if (item) {
							item.OriginalId = item.Id;
						}
						return item;
					});
				}
			}

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

			function filterByCurrentJob() {
				mdcPrjCostCodesByJob = mdcPrjCostCodesByJobDic[jobId];
			}

			function clearCostCodejobRateValueList(){
				mdcPrjCostCodesByJobDic = [];
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

			function getMdcPrjCostCodes() {
				if (projectId) {
					if(!jobId) {
						jobId = -1;
					}
					return $http.get(globals.webApiBaseUrl + 'project/costcodes/mdcprjcostcodesbyjob?projectId=' + projectId + '&jobId=' + jobId).then(function (response) {
						let list = assignTempLookupIds(response.data);
						$injector.get('basicsLookupdataLookupDescriptorService').updateData('prjCostCodesByJob', list);
						return list;
					});
				} else {
					return $q.when([]);
				}
			}


			function getListAsync() {
				return getMdcPrjCostCodes().then(function (data) {
					let costCodeTree = buildTree(data);
					mdcPrjCostCodesByJobDic[jobId] = costCodeTree;
					return costCodeTree;
				});
			}


			function refreshEstCostCodesTree() {
				clearCostCodejobRateValueList();
				filterByCurrentJob();

				if (mdcPrjCostCodesByJob && mdcPrjCostCodesByJob.length > 0) {
					return $q.when(mdcPrjCostCodesByJob);
				} else {
					return getListAsync().then(function (data) {
						return data;
					});
				}
			}

			function setJobId(value) {
				jobId = value;
			}


			function setProjectId(value) {
				projectId = value;
			}

			function getProjectId() {
				return  projectId;
			}

			function getSearchList(searchString,displayMember) {
				let filterParams = {
					'codeProp': 'Code',
					'descriptionProp': 'DescriptionInfo.Translated',
					'field': displayMember,
					'isSpecificSearch': false,
					'searchValue': searchString?searchString:''
				};
				return getListAsync().then(function(data){
					return estimateMainCommonLookupService.getSearchData(filterParams, angular.copy(data), 'CostCodes', 'CostCodeParentFk', true);
				});
			}

		}]);
})(angular);
