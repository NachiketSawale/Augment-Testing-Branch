/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global _, globals */
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainOnlyCostCodeAssignmentDetailLookupDataService', [
		'_', '$q', '$http', '$injector', 'cloudCommonGridService', 'platformGridAPI', 'basicsLookupdataTreeHelper', 'estimateMainLookupService', 'estimateMainService',
		function (_, $q, $http, $injector, cloudCommonGridService, platformGridAPI, basicsLookupdataTreeHelper, estimateMainLookupService, estimateMainService){
			let data = [], flattenDatas = [], contextId = null, costCodeEditType,flattenDatasOnMarkup =[];

			let getItemByIdPromise = null;

			let service = {};

			angular.extend(service,{
				getList: getList,
				getItemById: getItemById,
				loadData: loadData,
				setContextId: setContextId,
				getContextId: getContextId,
				getSearchList: getSearchList,
				getItemByIdAsync: getItemByIdAsync,
				getItemByKey : getItemByKey,
				getEditType : getEditType,
				setEditType : setEditType,
				refresh: refresh,
				getFlattenDatas:getFlattenDatas,
				setFlattenDatas:setFlattenDatas,
				getListOnEstMarkupCostCode:getListOnEstMarkupCostCode,
				getSearchListOnEstMarkupCostCode:getSearchListOnEstMarkupCostCode
			});

			return service;

			function setContextId(id) {
				contextId = (id > 0 && costCodeEditType !== 'estimate') ? id : null;
			}

			function getContextId() {
				return contextId;
			}

			function loadData(url,postData) {
				let defer = $q.defer();

				if (getItemByIdPromise === null){
					getItemByIdPromise = postData ? $http.post(url, postData) : $http.get(url);

					return getItemByIdPromise;
				}

				return getItemByIdPromise.then(function(response){
					flattenDatas = [];
					cloudCommonGridService.flatten(response.data,flattenDatas,'CostCodes');
					data = response.data;
					defer.resolve(data);
				});

			}

			// function getSearchList(value, field, scope, searchSettings) {
			function getSearchList(searchSettings) {
				let defer = $q.defer();

				if (searchSettings.SearchString && searchSettings.SearchString.length){
					let filteredFlattenItems = _.filter(flattenDatas,function (item){
						let codeUpperCase = item.Code ? item.Code.toUpperCase(): '';
						let descriptionUpperCase = item.DescriptionInfo && item.DescriptionInfo.Description ? item.DescriptionInfo.Description.toUpperCase(): '';
						return (codeUpperCase.indexOf(searchSettings.SearchString.toUpperCase()) > -1) ||
                            (descriptionUpperCase.indexOf(searchSettings.SearchString.toUpperCase()) > -1);
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
						let nodeParents = getNodeParents(entity, flattenDatas, context);
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

					let searchResult = basicsLookupdataTreeHelper.buildTree(filteredFlattenItemsResult, context);

					defer.resolve(searchResult);
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

			function getList() {
				var postData = {
					ProjectId: estimateMainService.getProjectId() ? estimateMainService.getProjectId() : 0,
					EstHeaderId: estimateMainService.getSelectedEstHeaderId() ? estimateMainService.getSelectedEstHeaderId() : 0,
					FilterByType: false
				};
				let url = globals.webApiBaseUrl + 'estimate/main/lineitem/masterCCandProjectCCChildOnlyForConfig';
				return loadData(url,postData);
			}

			function getListAsync() {
				return getList();
			}

			function getItemById(id) {
				return _.find(flattenDatas, {'Id': id});
			}

			function getItemByIdAsync(id) {
				var postData = {
					ProjectId: estimateMainService.getProjectId() ? estimateMainService.getProjectId() : 0,
					EstHeaderId: estimateMainService.getSelectedEstHeaderId() ? estimateMainService.getSelectedEstHeaderId() : 0,
					FilterByType: false
				};
				let url = globals.webApiBaseUrl + 'estimate/main/lineitem/masterCCandProjectCCChildOnlyForConfig';

				let defer = $q.defer();

				$http.post(url,postData).then(function(response){
					flattenDatas = [];
					cloudCommonGridService.flatten(response.data,flattenDatas,'CostCodes');

					let item = _.find(flattenDatas, {'Id': id});
					defer.resolve(item);
				});
				return defer.promise;
			}

			function getItemByKey(id) {
				let defer = $q.defer();
				defer.resolve(_.find(flattenDatas, {'Id': id}));
				return defer.promise;
			}

			function getEditType() {
				return costCodeEditType;
			}

			function setEditType(editType) {
				costCodeEditType = editType;
			}

			function refresh(scope){
				getItemByIdPromise = null;

				getListAsync().then(function(response){
					flattenDatas = [];
					cloudCommonGridService.flatten(response.data,flattenDatas,'CostCodes');
					data = response.data;
					scope.refreshData(data);
				});

			}

			function getFlattenDatas() {
				return flattenDatas;
			}

			function setFlattenDatas(lookupData) {
				flattenDatas = lookupData;
			}

			function getListOnEstMarkupCostCode() {
				let projectId = estimateMainService.getProjectId() ? estimateMainService.getProjectId() : 0;
				let estHeaderId = estimateMainService.getSelectedEstHeaderId() ? estimateMainService.getSelectedEstHeaderId() : 0;
				let url = globals.webApiBaseUrl + 'estimate/main/estallmarkup2costcode/masterCCandProjectCCChildOnly?projectId=' + projectId +'&estHeaderId='+ estHeaderId;
				return $http.get(url).then(function(response){
					flattenDatas = [];
					cloudCommonGridService.flatten(response.data.allCostCodes,flattenDatas,'CostCodes');
					$injector.get('estStandardAllowancesCostCodeDetailDataService').setAllCostCodes(flattenDatas);

					let estimateCcCostCodeTypeIds = response.data.estimateCcCostCodeType;

					let deleteIds = response.data.deleteCostCodes;
					let responseData = [];

					if(deleteIds && deleteIds.length){
						responseData = _.filter(flattenDatas,function (item) {
							let isReturn = true;
							if(_.includes(deleteIds, item.Id)){
								isReturn = !item.IsCustomProjectCostCode; // process old version error
							}
							return isReturn;
						});
					}else {
						responseData = flattenDatas;
					}

					let disabledOption = {rowCss: 'disabled', grid:{mergedCells:{selectable: false}}};
					_.forEach(responseData,function (item) {
						item.CostCodes = null;
						item.IsEstimateCostCode = _.includes(estimateCcCostCodeTypeIds, item.CostCodeTypeFk);
						if(!item.IsEstimateCostCode){
							item.__rt$data = _.merge(item.__rt$data || {},disabledOption);
						}
					});

					$injector.get('platformDataServiceEntitySortExtension').sortTree(responseData, 'Code', 'CostCodes');
					if(responseData.length > 0){
						angular.forEach(responseData, function (d) {
							d.CostCodes = [];
							if(d.CostCodeParentFk !==  null){
								let parent = _.find(responseData, {Id : d.CostCodeParentFk});
								if(!parent){
									d.CostCodeParentFk = null;
								}
							}
						});
					}

					flattenDatasOnMarkup = responseData;
					return responseData;

				});
			}

			function getSearchListOnEstMarkupCostCode(searchSettings) {
				let defer = $q.defer();

				if (searchSettings.searchString && searchSettings.searchString.length){
					let filteredFlattenItems = _.filter(flattenDatasOnMarkup,function (item){
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
						let nodeParents = getNodeParents(entity, flattenDatasOnMarkup, context);
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
		}]);
})(angular);
