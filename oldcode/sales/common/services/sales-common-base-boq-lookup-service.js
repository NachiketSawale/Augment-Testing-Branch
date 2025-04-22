/**
 * $Id$
 * Copyright (c) RIB Software SE
 */
(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name salesCommonBaseBoqLookupService
	 * @function
	 *
	 * @description
	 * salesCommonBaseBoqLookupService is the data service for gathering sales base boqs.
	 */
	var moduleName = 'sales.common';
	angular.module(moduleName).factory('salesCommonBaseBoqLookupService', ['_', 'globals', '$rootScope', '$q','$http', 'basicsLookupdataLookupFilterService',

		function (_, globals, $rootScope, $q, $http, basicsLookupdataLookupFilterService ) {
			var service = {};
			var salesBaseBoqList = [];
			var currentProjectId = null;
			var currentlyLoadedItemCallbackFn = null;
			// used in boq lookup
			var estHeaderFk = -1;
			var isStyleEnable = false;

			var filterSalesBaseBoqs = function (item) {

				// Let only pass items whose reference number is not already in use
				var currentlyLoadedItemList = (currentlyLoadedItemCallbackFn !== null) ? currentlyLoadedItemCallbackFn() : null;

				if((currentlyLoadedItemList !== null) && _.isArray(currentlyLoadedItemList) && currentlyLoadedItemList.length > 0) {
					// Check if the reference number of item already exists in the currently loaded item list
					var loadedItem = _.find(currentlyLoadedItemList, function(currentlyLoadedItem) {
						return currentlyLoadedItem.BoqRootItem.Reference === item.BoqRootItem.Reference;
					});

					if(angular.isDefined(loadedItem) && loadedItem !== null) {
						return false; // Don't show item whose reference is already in use.
					}
				}

				// If there is no currentProjectId set we return all items that passed the 'reference' test.
				if(angular.isUndefined(currentProjectId) || currentProjectId === null) {
					return true;
				}

				// GC BOQs should not be contained in sales.billing
				if ($rootScope.currentModule==='sales.billing' && item.BoqHeader.IsGCBoq) {
					return false;
				}

				return item.Boq.PrjProjectFk === currentProjectId;
			};

			service.clearBaseBoqList = function clearBaseBoqList() {
				if(_.isArray(salesBaseBoqList)) {
					salesBaseBoqList.length = 0;
				}
			};

			service.setCurrentProject = function setCurrentProject(projectId) {
				if(currentProjectId !== projectId) {
					currentProjectId = projectId;

					// Changing the currentProjectId makes the salesBaseBoqList invalid so we clear it to force
					// a reload of the cached base boq items when the next getSalesBoqList call is requested.
					service.clearBaseBoqList();
				}
			};

			service.setCurrentlyLoadedItemsCallback = function setCurrentlyLoadedItemsCallback(callbackFn)
			{
				currentlyLoadedItemCallbackFn = callbackFn;
			};

			function generateStyle(item) {
				var cssClass = '';
				if (item.IsBold) {
					cssClass += ' cm-strong ';
				}
				if(item.IsMarked){
					cssClass += ' cm-negative ';
				}
				// apply the css class to cell BoqRootItem.Reference and BoqRootItem.BriefInfo
				var fieldsWithStyle = ['BoqRootItem.Reference', 'BoqRootItem.BriefInfo'];

				item.__rt$data = item.__rt$data || {};
				item.__rt$data.cellCss = item.__rt$data.cellCss || {};

				_.each(fieldsWithStyle, function (field) {
					item.__rt$data.cellCss[field] = item.__rt$data.cellCss[field] || '';
					item.__rt$data.cellCss[field] += cssClass;
				});
			}

			service.setStyleEnableAndEstHeader = function setStyleEnableAndEstHeader(headerFk) {
				isStyleEnable = true;
				estHeaderFk = headerFk;
			};

			service.getSalesBaseBoqList = function getSalesBaseBoqList(enforceReload) {
				var deferred = $q.defer();
				if(_.isArray(salesBaseBoqList) && salesBaseBoqList.length>0 && !enforceReload){
					deferred.resolve(salesBaseBoqList);
				} else {
					if (!isStyleEnable && estHeaderFk <= -1) {
						$http.get(globals.webApiBaseUrl + 'boq/project/list?projectId=' + currentProjectId
						).then(function (response) {
							salesBaseBoqList = response.data;
							deferred.resolve(salesBaseBoqList);
						}
						);
					} else {
						// add style for the lookup data
						$http.get(globals.webApiBaseUrl + 'boq/project/list?projectId=' + currentProjectId + '&isStyleEnable=' + isStyleEnable + '&estHeaderFk=' + estHeaderFk).then(function (response) {
							salesBaseBoqList = response.data;
							_.each(salesBaseBoqList, function (item) {
								generateStyle(item);
							});
							deferred.resolve(salesBaseBoqList);
						}
						);
					}
				}
				return deferred.promise;
			};

			service.refresh = function refresh() {
				service.clearBaseBoqList();
				return service.getSalesBaseBoqList().then(function (data) {
					return _.filter(data, filterSalesBaseBoqs);
				});
			};

			var salseCommonBaseBoqFilter = [{
				key: 'sales-common-base-boq-filter',
				fn: filterSalesBaseBoqs
			}];

			basicsLookupdataLookupFilterService.registerFilter(salseCommonBaseBoqFilter);

			return service;
		}
	]);
})();
