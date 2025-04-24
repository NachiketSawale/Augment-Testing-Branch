/**
 * * Created by mov on 07/27/2020.
 */
(function (angular) {
	/* global _, globals */
	'use strict';

	var moduleName = 'boq.main';

	angular.module(moduleName).factory('boqMainMasterProjectCostCodeService', ['$q', '$http', '$translate', 'cloudCommonGridService', 'basicsLookupdataTreeHelper', 'boqMainService',
		function ($q, $http, $translate, cloudCommonGridService, basicsLookupdataTreeHelper, boqMainService) {
			var data = [], flattenDatas = [], costCodeEditType, isLoaded = false;

			var getItemByIdPromise = null;

			var context = {
				treeOptions: {
					parentProp: 'CostCodeParentFk',
					childProp: 'CostCodes'
				},
				IdProperty: 'Id'
			};

			var service = {};
			angular.extend(service, {
				getList: getList,
				getItemById: getItemById,
				loadData: loadData,
				getSearchList: getSearchList,
				getItemByIdAsync: getItemByIdAsync,
				getItemByKey: getItemByKey,
				getEditType: getEditType,
				setEditType: setEditType,
				refresh: refresh,
				resolveStringValueCallback:resolveStringValueCallback
			});

			return service;

			function loadData(url) {
				var defer = $q.defer();

				if (getItemByIdPromise === null) {
					getItemByIdPromise = $http.get(url);
					return getItemByIdPromise;
				}

				return getItemByIdPromise.then(function (response) {
					flattenDatas = [];
					cloudCommonGridService.flatten(response.data, flattenDatas, 'CostCodes');
					flattenDatas = processItemsProjectCCChildOnly(flattenDatas);
					data = response.data;
					defer.resolve(data);
				});
				//
				// return defer.promise;
			}

			function getUrl() {
				let projectId = boqMainService.getSelectedProjectId() ? boqMainService.getSelectedProjectId() : 0;
				return globals.webApiBaseUrl + 'estimate/main/lineitem/masterCCandProjectCCChildOnly?projectId=' + projectId + '&estHeaderId=-1&filterByType=false';
			}

			function processItemsProjectCCChildOnly(allFlattenData) {
				var allFlattenDataProcessed = allFlattenData;

				_.forEach(allFlattenDataProcessed, function (item) {
					if (item.IsCustomProjectCostCode && item.IsCustomProjectCostCode === true && item.Id > 0) {
						item.Id = item.Id * -1;
					}
				});

				return allFlattenDataProcessed;
			}

			function loadDatAndSetToCache() {
				var url = getUrl();

				var defer = $q.defer();

				if (getItemByIdPromise === null) {
					getItemByIdPromise = $http.get(url);
				}

				if (isLoaded) {
					defer.resolve(data);
				} else {
					getItemByIdPromise.then(function (response) {
						isLoaded = true;
						flattenDatas = [];
						cloudCommonGridService.flatten(response.data, flattenDatas, 'CostCodes');
						flattenDatas = processItemsProjectCCChildOnly(flattenDatas);

						data = basicsLookupdataTreeHelper.buildTree(flattenDatas, context);
						defer.resolve(data);
					});
				}

				return defer.promise;
			}

			function getSearchList(searchSettings) {
				var defer = $q.defer();

				loadDatAndSetToCache().then(function () {
					if (searchSettings.SearchString && searchSettings.SearchString.length) {
						var filteredFlattenItems = _.filter(flattenDatas, function (item) {
							var codeUpperCase = item.Code ? item.Code.toUpperCase() : '';
							var descriptionUpperCase = item.DescriptionInfo && item.DescriptionInfo.Description ? item.DescriptionInfo.Description.toUpperCase() : '';
							return (codeUpperCase.indexOf(searchSettings.SearchString.toUpperCase()) > -1) ||
								(descriptionUpperCase.indexOf(searchSettings.SearchString.toUpperCase()) > -1);
						});

						var parentEntities = [];
						_.forEach(filteredFlattenItems, function (entity) {
							var nodeParents = getNodeParents(entity, flattenDatas, context);
							_.forEach(nodeParents, function (parent) {
								if (_.findIndex(parentEntities, {Id: parent.Id}) === -1) {
									parentEntities.push(parent);
								}
							});
						});

						var filteredFlattenItemsResult = angular.copy(filteredFlattenItems.concat(parentEntities));

						// Clear CostCodeChildren for this result
						_.forEach(filteredFlattenItemsResult, function (item) {
							delete item[context.treeOptions.childProp];
						});

						var searchResult = basicsLookupdataTreeHelper.buildTree(filteredFlattenItemsResult, context);

						defer.resolve(searchResult);
					} else {
						defer.resolve(data);
					}
				});

				return defer.promise;

			}

			function getNodeParents(entity, flattenDatas, context) {
				var currentEntity = entity;
				var parents = [];
				while (currentEntity[context.treeOptions.parentProp] !== null) {
					var parent = _.find(flattenDatas, {'Id': currentEntity[context.treeOptions.parentProp]});
					if (parent) {
						currentEntity = parent;
						parents.push(parent);
						continue;
					}
					break;
				}

				return parents;
			}

			function getList() {
				var url = getUrl();

				return loadData(url);
			}

			function getListAsync() {
				return getList();
			}

			function getItemById(id) {
				var item = _.find(flattenDatas, {'Id': id});
				return item;
			}

			function getItemByIdAsync(id) {
				return getListAsync().then(function () {
					return getItemById(id);
				});
			}

			function getItemByKey(id) {
				var defer = $q.defer();
				defer.resolve(_.find(flattenDatas, {'Id': id}));
				return defer.promise;
			}

			function getEditType() {
				return costCodeEditType;
			}

			function setEditType(editType) {
				costCodeEditType = editType;
			}

			function refresh(scope) {
				getItemByIdPromise = null;
				isLoaded = false;

				getListAsync().then(function (response) {
					flattenDatas = [];
					cloudCommonGridService.flatten(response.data, flattenDatas, 'CostCodes');
					flattenDatas = processItemsProjectCCChildOnly(flattenDatas);

					data = response.data;
					scope.refreshData(data);
				});
			}

			function resolveStringValueCallback() {
				return function(searchedCostCode) {
					return service.getSearchList(searchedCostCode).then(function() { // Ensures to be initialized
						let ret = {
							apply: true,
							valid: false,
							value: searchedCostCode,
							error: $translate.instant('basics.common.entityNotFound')
						};

						if (searchedCostCode && Array.isArray(flattenDatas)) {
							searchedCostCode = searchedCostCode.toLowerCase();
							let filteredPrjCostCode = _.find(flattenDatas, costCode => costCode.Code.toLowerCase()===searchedCostCode);
							if (filteredPrjCostCode) {
								ret = {
									apply: true,
									valid: true,
									value: filteredPrjCostCode.Id,
								};
							}
						}

						return ret;
					});
				};
			}
		}]);
})(angular);
