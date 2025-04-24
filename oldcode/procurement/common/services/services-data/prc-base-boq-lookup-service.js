/**
 * Created by bh on 22.09.2015.
 */
(function () {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */

	/**
	 * @ngdoc service
	 * @name prcBaseBoqLookupService
	 * @function
	 *
	 * @description
	 * prcBaseBoqLookupService is the data service for gathering procurement base boqs.
	 */
	angular.module('procurement.common').factory('prcBaseBoqLookupService', ['$q','$http', 'basicsLookupdataLookupFilterService',

		function ( $q, $http, basicsLookupdataLookupFilterService ) {
			var service = {};
			var prcBaseBoqList = [];
			var currentPackageId = null;
			var currentPrcHeaderId = null;
			var currentlyLoadedItemCallbackFn = null;

			service.clearBaseBoqList = function clearBaseBoqList() {
				if(_.isArray(prcBaseBoqList)) {
					prcBaseBoqList.length = 0;
				}
			};

			service.setCurrentPrcPackage = function setCurrentPrcPackage(prcPackageId) {
				if(currentPackageId !== prcPackageId) {
					currentPackageId = prcPackageId;

					// Changing the currentPackageId makes the prcBaseBoqList invalid so we clear it to force
					// a reload of the cached base boq items when the next getPrcBoqList call is requested.
					service.clearBaseBoqList();
				}
			};

			service.setCurrentPrcHeader = function setCurrentPrcHeader(prcHeaderId) {
				if(currentPrcHeaderId !== prcHeaderId) {
					currentPrcHeaderId = prcHeaderId;

					// Changing the currentPackageId makes the prcBaseBoqList invalid so we clear it to force
					// a reload of the cached base boq items when the next getPrcBoqList call is requested.
					service.clearBaseBoqList();
				}
			};

			service.setCurrentPrcHeaderToNull = function setCurrentPrcHeaderToNull() {
				currentPrcHeaderId = null;
			};

			service.setCurrentlyLoadedItemsCallback = function setCurrentlyLoadedItemsCallback(callbackFn)
			{
				currentlyLoadedItemCallbackFn = callbackFn;
			};

			service.getPrcBaseBoqList = function getPrcBaseBoqList() {
				var deferred = $q.defer();
				if(_.isArray(prcBaseBoqList) && prcBaseBoqList.length > 0){
					deferred.resolve(prcBaseBoqList);
				} else {
					$http.get(globals.webApiBaseUrl + 'procurement/common/boq/getprcbaseboqs?packageId=' + currentPackageId
					).then(function (response) {
						prcBaseBoqList = response.data;
						deferred.resolve(prcBaseBoqList);
					}
					);
				}
				return deferred.promise;
			};

			var prcBaseBoqFilter = [{
				key: 'prc-base-boq-filter',
				fn: function (item) {

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

					// If there is no currentPrcHeader set we return all items that passed the 'reference' test.
					if(angular.isUndefined(currentPrcHeaderId) || currentPrcHeaderId === null) {
						return true;
					}

					return item.PrcBoq.PrcHeaderFk === currentPrcHeaderId;
				}
			}];

			basicsLookupdataLookupFilterService.registerFilter(prcBaseBoqFilter);

			return service;
		}
	]);
})();