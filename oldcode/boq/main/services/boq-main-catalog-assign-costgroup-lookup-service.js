/**
 * Created by Reimer on 25.04.2017.
 */
(function () {
	/* global _, globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module('boq.main').factory('boqMainCatalogAssignCostgroupLookupService', ['$q',
		'$http',
		'$translate',
		'basicsLookupdataLookupFilterService',
		'boqMainCatalogAssignCatalogLookupService',
		function ($q,
			$http,
			$translate,
			filterService,
			boqMainCatalogAssignCatalogLookupService) {

			var selectedProjectId = -1;
			var selectedLineItemContextId = -1;
			var data = null;      // cached object list
			var service = {};
			var newCatalog = { // default: New Catalog
				Id: 0,
				Code: $translate.instant('boq.main.newcatalog'),
				DescriptionInfo: {
					Description: ''
				},
				IsNewItem: true
			};
			var _showLicCatalogsOnly = false;
			var _lineItemContextId = null;
			var currentDeferredLoadData = null;
			let loadDataPromise = null;

			service.loadData = function (projectId, lineItemContextId, showLicCatalogsOnly,isIncludeIsNotLive) {

				var deffered = $q.defer();
				_showLicCatalogsOnly = showLicCatalogsOnly;

				if (!_.isNumber(lineItemContextId)) {
					// Use the given externally set lineItemContextId
					lineItemContextId = _lineItemContextId;
				}

				if (data === null || selectedProjectId !== projectId || selectedLineItemContextId !== lineItemContextId) {

					data = [];
					var promises = [];
					currentDeferredLoadData = deffered;

					if ((_.isEmpty(data) && selectedProjectId !== projectId) || selectedLineItemContextId !== lineItemContextId) {
						promises.push(loadLicList(lineItemContextId,isIncludeIsNotLive));
					}

					if ((selectedProjectId !== projectId || selectedLineItemContextId !== lineItemContextId) && !showLicCatalogsOnly) {
						promises.push(loadPrjList(projectId));
					}

					$q.all(promises).then(function (result) {

						for (var i = 0; i < result.length; i++) {
							if (!_.isArray(data)) {
								data = [];
							}

							data = data.concat(result[i]);
						}

						currentDeferredLoadData = null;
						deffered.resolve();
					});

					selectedProjectId = projectId;
					selectedLineItemContextId = lineItemContextId;
				} else {
					if (currentDeferredLoadData === null) {
						currentDeferredLoadData = deffered;
					}
					deffered.resolve();
				}

				return currentDeferredLoadData.promise;
			};

			function loadLicList(lineItemContextId,isIncludeIsNotLive) {

				return $http.get(globals.webApiBaseUrl + 'basics/costgroupcat/licListByLineItemContext?lineItemContextId=' + lineItemContextId+'&isIncludeIsNotLive='+isIncludeIsNotLive).then(function (response) {
					return response.data;
				});
			}

			function loadPrjList(projectId) {

				return $http.get(globals.webApiBaseUrl + 'basics/costgroupcat/prjList?projectId=' + projectId).then(function (response) {
					return response.data;
				});
			}

			service.getList = function (projectId, addNewItem, lineItemContextId, showLicCatalogsOnly,isIncludeIsNotLive) {
				var lIContextId = _.isNumber(lineItemContextId) && lineItemContextId > 0 ? lineItemContextId : service.getLineItemContextId();
				return service.loadData(projectId, lIContextId, showLicCatalogsOnly,isIncludeIsNotLive).then(function () {

					var hasNewItem = data.length > 0 && data[data.length - 1].IsNewItem;
					var newItm;

					if (!_.isNumber(projectId) || projectId < 0) {
						addNewItem = false; // This should be the case for using this lookup in module customize
					}

					if (addNewItem && angular.isFunction(addNewItem)) {
						newItm = addNewItem();
					} else {
						newItm = addNewItem;
					}
					if (newItm) {
						if (!hasNewItem) {
							if (!_.isObject(_.find(data, {Id: newCatalog.Id}))) {
								data.push(newCatalog);
							}
						}
					} else {
						if (hasNewItem) {
							data.pop();
						}
					}

					return data;
				});
			};

			service.getItemById = function getItemById(projectId, value) {
				return service.getItemByKey(projectId, value);
			};

			service.getItemByKey = function (projectId, value) {

				if (data !== null && selectedProjectId === projectId) {
					var item = {};
					for (var i = 0; i < data.length; i++) {
						if (data[i].Id === value) {
							item = data[i];
							break;
						}
					}
					return item;
				}
				return null;
			};

			service.getItemByIdAsync = function (projectId, value) {
				return service.getItemByKeyAsync(projectId, value);
			};

			// for show islive = 0 costgroup
			function getCostGroup(projectId,showLicCatalogsOnly,isIncludeIsNotLive){
				let deferred = $q.defer();
				let promises = [];
				let lineItemContextId = service.getLineItemContextId();

				promises.push(loadLicList(lineItemContextId,isIncludeIsNotLive));

				promises.push(loadPrjList(projectId));

				$q.all(promises).then(function (result) {
					let list = [];
					for (let i = 0; i < result.length; i++) {
						list = list.concat(result[i]);
					}
					deferred.resolve(list);
				});

				return deferred.promise;
			}
			service.getItemByKeyAsync = function (projectId, value) {
				if (!loadDataPromise) {
					loadDataPromise = getCostGroup(projectId, false,true);
				}
				return loadDataPromise.then (function (datas) {
					let item = {};
					for (var i = 0; i < datas.length; i++) {
						if (datas[i].Id === value) {
							item = datas[i];
							break;
						}
					}
					loadDataPromise = null;
					return item;
				});
			};

			service.refresh = function (projectId, lineItemContextId, showLicCatalogsOnly) {
				data = null;
				selectedProjectId = -1;
				service.loadData(projectId, lineItemContextId, showLicCatalogsOnly,false);
			};

			service.setLineItemContextId = function setLineItemContextId(lineItemContextId) {
				_lineItemContextId = lineItemContextId;
			};

			service.getLineItemContextId = function getLineItemContextId() {
				return _lineItemContextId;
			};

			service.setSelectedProjectId = function setSelectedProjectId(projectId) {
				selectedProjectId = projectId;
			};

			service.getSelectedProjectId = function getSelectedProjectId() {
				return selectedProjectId;
			};

			service.clearData = function clearData() {
				selectedProjectId = -1;
				selectedLineItemContextId = -1;
				data = null; // clear cached object list
				_showLicCatalogsOnly = false;
				_lineItemContextId = null;
			};

			var filters = [
				{
					key: 'boqMainCatalogAssignCostgroupLookupFilter',
					serverSide: false,
					fn: function (dataItem, dataContext) {
						if (boqMainCatalogAssignCatalogLookupService.isLicCostGroup(dataContext.BoqCatalogFk) || _showLicCatalogsOnly) {
							return dataItem.LineItemContextFk !== null;
						} else if (boqMainCatalogAssignCatalogLookupService.isPrjCostGroup(dataContext.BoqCatalogFk)) {
							return dataItem.ProjectFk !== null || dataItem.IsNewItem;
						} else {
							return false;
						}
					}
				}
			];
			filterService.registerFilter(filters);

			return service;

		}]);
})();
