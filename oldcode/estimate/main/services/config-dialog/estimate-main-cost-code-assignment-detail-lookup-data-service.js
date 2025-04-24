/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global _, globals */
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainCostCodeAssignmentDetailLookupDataService', [
		'$q', '$http', '$injector', 'cloudCommonGridService',
		function ($q, $http, $injector, cloudCommonGridService){
			let data = [], flattenDatas = [], isReload, contextId = null, costCodeEditType,isLoadOnMdcAllowance,flattenDatasOnMdcAllowance,dataOnMdcAllowance;
			let loadPromise = null;
			let service = {
				getList: getList,
				getItemById: getItemById,
				loadData: loadData,
				setContextId: setContextId,
				getSearchList: getSearchList,
				getItemByIdAsync: getItemByIdAsync,
				getItemByKey : getItemByKey,
				getEditType : getEditType,
				setEditType : setEditType,
				getSearchListOnMdcAllowance: getSearchListOnMdcAllowance,
				setIsLoadOnMdcAllowance : setIsLoadOnMdcAllowance,
				refreshMdcAllowanceCostCodesTree: refreshMdcAllowanceCostCodesTree
			};

			function setContextId(id) {
				contextId = (id > 0 && costCodeEditType !== 'estimate') ? id : null;
			}

			function loadData(url,isGetListOnMdcAllowance, postData) {
				let loadDataPromise = $http.post(url,postData);
				return (isGetListOnMdcAllowance && isLoadOnMdcAllowance) ? $q.when(collapseAllNodes(flattenDatasOnMdcAllowance)) : loadDataPromise.then(function(result){
					flattenDatas = [];
					cloudCommonGridService.flatten(result.data,flattenDatas,'CostCodes');
					$injector.get('estimateAllowanceMarkUp2CostCodeAssignmentGridService').setAllCostCodes(flattenDatas);

					isReload = true;
					if(!isGetListOnMdcAllowance){
						data = result.data;
						return result.data;
					}else {
						isLoadOnMdcAllowance = true;
						result.data =  $injector.get('estimateAllowanceMarkUp2CostCodeAssignmentGridService').filterEstimateCCCostCodes(result.data,false);
						dataOnMdcAllowance = result.data;
						flattenDatasOnMdcAllowance = [];
						cloudCommonGridService.flatten(result.data,flattenDatasOnMdcAllowance,'CostCodes');

						return result.data;
					}
				});
			}

			function getSearchList(searchString) {
				let onlyGetEstTypeCodeCode = getEditType() !== 'customizefortotals';
				let url = globals.webApiBaseUrl + 'basics/costcodes/getsearchtree?filterString=' + searchString + '&mdcContextId=' + contextId + '&onlyGetEstTypeCodeCode=' + onlyGetEstTypeCodeCode;

				return $http.get(url).then(function(result){
					return result.data;
				});
			}

			function getList(isGetListOnMdcAllowance) {
				return getListByContext(isGetListOnMdcAllowance);
			}

			function getListByContext(isGetListOnMdcAllowance){
				let url = globals.webApiBaseUrl + 'basics/costcodes/treeByFilter?mdcContextId=' + contextId;

				let postData = {
					StartId: 0,
					Depth: 999,
					MdcContextId: contextId,
					FilterByCompany: true,
					OnlyGetEstTypeCodeCode: false,
					IncludeCostCodeParent: true
				};
				return loadData(url, isGetListOnMdcAllowance, postData);
			}

			function getListAsync() {
				getList();
			}

			function getItemById(id) {
				let item = _.find(flattenDatas, {'Id': id});
				return item;
			}

			function getItemByIdAsync(id) {
				return getListAsync().then(function () {
					return getItemById(id);
				});
			}

			function getItemByKey(id) {
				let defer = $q.defer();

				if(data && data.length > 0 && isReload){
					isReload = true;
					defer.resolve(_.find(flattenDatas, {'Id': id}));
				}
				else{
					if(!loadPromise){
						let url = '',
						postData = {};
						if(getEditType() === 'customizefortotals'){
							postData = {
								StartId: 0,
								Depth: 999,
								MdcContextId: contextId,
								FilterByCompany: true,
								OnlyGetEstTypeCodeCode: false,
								IncludeCostCodeParent: true
							};
							url = globals.webApiBaseUrl + 'basics/costcodes/treebyfilter';
						}else{
							url = globals.webApiBaseUrl + 'basics/costcodes/treeByFilter?mdcContextId=' + contextId;
						}
						loadPromise = loadData(url, false, postData);
					}
					loadPromise.then(function(){
						isReload = true;
						loadPromise = null;
						defer.resolve(_.find(flattenDatas, {'Id': id}));
					});
				}
				return defer.promise;
			}

			function getEditType() {
				return costCodeEditType;
			}

			function setEditType(editType) {
				costCodeEditType = editType;
			}

			function getSearchListOnMdcAllowance(searchSettings) {
				let defer = $q.defer();

				if (searchSettings.searchString && searchSettings.searchString.length){
					let filteredFlattenItems = _.filter(flattenDatasOnMdcAllowance,function (item){
						let codeUpperCase = item.Code ? item.Code.toUpperCase(): '';
						let descriptionUpperCase = item.DescriptionInfo && item.DescriptionInfo.Description ? item.DescriptionInfo.Description.toUpperCase(): '';
						return (codeUpperCase.indexOf(searchSettings.searchString.toUpperCase()) > -1) ||
							(descriptionUpperCase.indexOf(searchSettings.searchString.toUpperCase()) > -1);
					});

					let context = {
						treeOptions:{
							parentProp : 'CostCodeParentFk',
							childProp : 'CostCodes'
						},
						IdProperty: 'Id'
					};

					let parentEntities = [];
					_.forEach(filteredFlattenItems, function(entity){
						let nodeParents = getNodeParents(entity, flattenDatasOnMdcAllowance, context);
						_.forEach(nodeParents, function(parent){
							if (_.findIndex(parentEntities, {Id: parent.Id})===-1){
								parentEntities.push(parent);
							}
						});
					});

					let filteredFlattenItemsResult = angular.copy(filteredFlattenItems.concat(parentEntities));

					// Clear CostCodeChildren for this result
					_.forEach(filteredFlattenItemsResult, function(item){
						delete item[context.treeOptions.childProp];
					});

					defer.resolve(filteredFlattenItemsResult);
				}else{
					defer.resolve(data);
				}

				return defer.promise;
			}

			function getNodeParents(entity, flattenDatas, context){
				let currentEntity = entity;
				let parents = [];
				while (currentEntity[context.treeOptions.parentProp] !== null){
					let parent = _.find(flattenDatas, {'Id': currentEntity[context.treeOptions.parentProp]});
					if (parent){
						currentEntity = parent;
						parents.push(parent);
						continue;
					}
					break;
				}

				return parents;
			}

			function setIsLoadOnMdcAllowance(flag) {
				isLoadOnMdcAllowance = flag;
			}

			function collapseAllNodes(items) {
				_.forEach(items,function (item) {
					if(item.nodeInfo){
						item.nodeInfo.collapsed = true;
					}
				});
				return items;
			}

			function refreshMdcAllowanceCostCodesTree() {
				setIsLoadOnMdcAllowance(false);
				return getListByContext(true);
			}
			return service;
		}]);
})(angular);
