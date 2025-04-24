/**
 * Created by bh on 17.12.2015.
 */

(function () {

	/* global _, globals */
	'use strict';
	/**
	 * @ngdoc service
	 * @name boqMainBaseBoqServiceFactory
	 * @description
	 * Service handling access to the base boqs. The base boqs are cached as tree and flat list and are reachalbe via their corresponding boq header id
	 * that serves as key for the underlying dictionary forming the cache.
	 */
	angular.module('boq.main').factory('boqMainBaseBoqServiceFactory',
		['$q', '$http', 'boqMainCommonService', 'BasicsLookupdataLookupDictionary',
			function ($q, $http, boqMainCommonService, Dictionary) {

				var factory = {};

				factory.createBaseBoqService = function createBaseBoqService(serviceState, versionBoqMainService) {

					if (angular.isUndefined(serviceState) || serviceState === null) {
						console.log('boqMainBaseBoqServiceFactory: could not create service -> state object missing');
						return;
					}

					serviceState.baseBoqs = new Dictionary(true);

					var service = {};

					/**
					 * @ngdoc function
					 * @name loadBaseBoqToCache
					 * @function
					 * @methodOf boqMainBaseBoqServiceFactory
					 * @description Loads the base boq of the given boq header id to the service cache, into a base boq container
					 * @param {Number} headerId: leads to the base boq to be loaded
					 * @param {Boolean} forceLoad: forces the base boq to be loaded although it might already be in the cache
					 * @returns {Object} : a promise that will be resolved
					 */
					service.loadBaseBoqToCache = function loadBaseBoqToCache(headerId, forceLoad) {
						var deferredBaseBoq = $q.defer();

						// Create initial base boq container, that holds the promise related to this load, the root object of the base boq hierarchy as tree property and all the items
						// in the base boq in a flat list. The flag ist dirty tells if the cached data is expected to be out of sync with the current database state.
						var baseBoqContainer = {
							promise: null,
							tree: null,
							flatList: null,
							isDirty: false
						};

						if (headerId > 0 && (forceLoad || !service.hasBaseBoqLoaded(headerId))) {

							$http.get(globals.webApiBaseUrl + 'boq/main/tree?headerId=' + headerId)
								.then(function (response) {
									var baseBoqTree = (angular.isDefined(response) && (response !== null)) ? response.data : null;
									var baseBoqFlatList = [];
									boqMainCommonService.flatten(baseBoqTree, baseBoqFlatList);

									// Add loaded data to container object
									baseBoqContainer.tree = baseBoqTree;
									baseBoqContainer.flatList = baseBoqFlatList;

									// Maintain base boq tree and flat list in an object in a dictionary
									if (serviceState.baseBoqs.has(headerId.toString())) {
										serviceState.baseBoqs.update(headerId.toString(), baseBoqContainer);
									} else {
										serviceState.baseBoqs.add(headerId.toString(), baseBoqContainer);
									}

									deferredBaseBoq.resolve(baseBoqContainer);
								});
						} else {
							deferredBaseBoq.resolve(null);
						}

						//
						baseBoqContainer.promise = deferredBaseBoq.promise;

						return deferredBaseBoq.promise;
					};

					/**
					 * @ngdoc function
					 * @name getBaseBoqContainer
					 * @function
					 * @methodOf boqMainBaseBoqServiceFactory
					 * @description Return the base boq container object qualified by the given header id
					 * @param {Number} headerId: leads to the base boq container to be returned
					 * @returns {Object} : requested base boq container object
					 */
					service.getBaseBoqContainer = function getBaseBoqContainer(headerId) {

						if (angular.isUndefined(headerId) || headerId === null || !_.isNumber(headerId)) {
							return null;
						}

						return serviceState.baseBoqs.get(headerId.toString());
					};

					/**
					 * @ngdoc function
					 * @name getBaseBoqList
					 * @function
					 * @methodOf boqMainBaseBoqServiceFactory
					 * @description Return the currently loaded base boq as flat list from the cache
					 * @param {Number} headerId: leads to the base boq to be returned
					 * @returns {Object} : requested base boq as flat list
					 */
					service.getBaseBoqList = function getBaseBoqList(headerId) {

						var baseBoqList = null;

						if (angular.isUndefined(headerId) || headerId === null || !_.isNumber(headerId)) {
							return null;
						}

						var baseBoqContainer = serviceState.baseBoqs.get(headerId.toString());

						if (angular.isDefined(baseBoqContainer) && baseBoqContainer !== null) {
							baseBoqList = baseBoqContainer.flatList;
						}

						return baseBoqList;
					};

					/**
					 * @ngdoc object
					 * @name getIndicator
					 * @propertyOf boqMainBaseBoqServiceFactory
					 * @description Holds an object with constant values that indicate the different access modes for the getBaseBoqItems function
					 */
					service.getIndicator = {
						SIBLING: 0, // return the base boq items that are siblings of the given version boq item
						CHILD: 1,   // return the base boq items that are children of the given version boq item
						MATCHING: 2  // return the base boq item that matches the given version boq item
					};

					/**
					 * @ngdoc function
					 * @name getBaseBoqItems
					 * @function
					 * @methodOf boqMainBaseBoqServiceFactory
					 * @description Return the corresponding base boq items that are related to the given version boq item
					 * @param {Object} versionBoqItem: version boq item whose corresponding base boq items are to be returned
					 * @param {Object} indicator: with different states telling which types of base boq items are to be returned with respect to the given version boq item.
					 * @param {Boolean} showUnusedOnly: forces the base boq items, whose referece numbers are already in use in the version boq
					 * to be removed from the result set.
					 * @returns {Object} : a promise that will be resolved, finally holding the found base boq items as array when being resolved
					 */
					/* jshint -W074 */ // cyclomatic complexity
					service.getBaseBoqItems = function getBaseBoqItems(versionBoqItem, indicator, showUnusedOnly) {

						var deferredItems = $q.defer();

						if (angular.isUndefined(versionBoqItem) || versionBoqItem === null) {
							return deferredItems.reject();
						}

						// First determine the parent of the selected item
						if (angular.isUndefined(versionBoqMainService) || versionBoqMainService === null) {
							console.error('boqMainBaseBoqServiceFactory.getSiblingBaseBoqItems -> versionBoqMainService missing');
						}

						var versionBoqItemParent = null;
						var versionBoqItemChildren = null;

						if (angular.isUndefined(indicator) || indicator === null) {
							deferredItems.resolve(null);
							return deferredItems.promise;
						}

						if (indicator === service.getIndicator.SIBLING) {
							// We're looking for the sibling base boq items related to the given version boq item.
							// For this we go up the version boq item parent and then start looking into the base boq for the corresponding base boq item parent.
							versionBoqItemParent = versionBoqMainService.getParentOf(versionBoqItem);
						} else if (indicator === service.getIndicator.CHILD) {
							// We're looking for the child base boq items related to the given version boq item.
							// For this we take the version boq item to be the parent and then start looking into the base boq for the corresponding base boq item parent.
							versionBoqItemParent = versionBoqItem;
						}

						if (angular.isDefined(versionBoqItemParent) && versionBoqItemParent !== null) {
							versionBoqItemChildren = angular.isDefined(versionBoqItemParent.BoqItems) && _.isArray(versionBoqItemParent.BoqItems) ? angular.copy(versionBoqItemParent.BoqItems) : null;
						} else {
							if (indicator !== service.getIndicator.MATCHING) {
								deferredItems.resolve(null);
								return deferredItems.promise;
							}
						}

						// Now we go up to the corresponding base boq parent item
						let additionalInfo = {};
						let useWicToSyncVersionBoq = false;
						let baseBoqHeaderFkPromise = $q.when(versionBoqItemParent.BoqItemPrjBoqFk);
						if(_.isFunction(versionBoqMainService.getFrameworkBoqHeaderFk)) {
							let frameworkBoqHeaderFkPromise = versionBoqMainService.getFrameworkBoqHeaderFk(additionalInfo); // additionalInfo returns proper value of useWicToSyncVersionBoq
							useWicToSyncVersionBoq = additionalInfo.useWicToSyncVersionBoq;
							if(useWicToSyncVersionBoq) {
								baseBoqHeaderFkPromise = frameworkBoqHeaderFkPromise;
							}
						}

						baseBoqHeaderFkPromise.then(function(baseBoqHeaderFk) {
							if (angular.isUndefined(baseBoqHeaderFk) || baseBoqHeaderFk === null || !_.isNumber(baseBoqHeaderFk)) {
								deferredItems.resolve(null);
								return;
							}

							// In SIBLING or CHILD mode we start the search with the assigned versionBoqItemParent
							var initialVersionBoqItem = versionBoqItemParent;

							// In MATCHING mode we start the search with the given versionBoqItem
							if (indicator === service.getIndicator.MATCHING) {
								initialVersionBoqItem = versionBoqItem;
							}

							var baseBoqItemFk = useWicToSyncVersionBoq ? initialVersionBoqItem.BoqItemWicItemFk : initialVersionBoqItem.BoqItemPrjItemFk;

							// Try to use direct link to corresponding base boq item by using the BoqItemPrjItemFk.
							var httpGetPromise = null;
							if (angular.isUndefined(baseBoqItemFk) || baseBoqItemFk === null || baseBoqItemFk <= 0) {
								// If the foreign key is not set try to find die corresponding base boq item via it's reference number.
								httpGetPromise = $http.get(globals.webApiBaseUrl + 'boq/main/getboqitembyheaderandreferencenumber?headerId=' + baseBoqHeaderFk + '&reference=' + initialVersionBoqItem.Reference + '&depth=1');
							} else {
								// There is a valid direct base boq link. Use it to get the corresponding base boq item
								httpGetPromise = $http.get(globals.webApiBaseUrl + 'boq/main/subtree?headerId=' + baseBoqHeaderFk + '&startId=' + baseBoqItemFk + '&depth=1');
							}

							if (angular.isUndefined(httpGetPromise) || httpGetPromise === null) {
								deferredItems.resolve(null);
								return;
							}

							// Show wait overlay to suppress use interaction until the link is done.
							versionBoqMainService.startActionEvent.fire();

							httpGetPromise.then(function (response) {

									var baseBoqItem = (angular.isDefined(response) && (response !== null)) ? response.data : null;

									if (indicator === service.getIndicator.MATCHING) {
										// In MATCHING mode we are successful when finding the matching base boq item to the given version boq item
										versionBoqMainService.endActionEvent.fire();
										deferredItems.resolve(angular.isDefined(baseBoqItem) && baseBoqItem !== null ? [baseBoqItem] : null);
										return;
									}

									// With this base boq item parent we look for the child items
									var baseBoqChildren = (angular.isDefined(baseBoqItem) && baseBoqItem !== null) ? baseBoqItem.BoqItems : null;

									if ((baseBoqChildren !== null) && showUnusedOnly) {
										baseBoqChildren = _.filter(baseBoqChildren, function (baseBoqChildItem) {
											// Find version boq item that corresponds to base boq item...
											var correspondingVersionBoqItemIndex = _.findIndex(versionBoqItemChildren, function (versionBoqItem) {
												return versionBoqItem.Reference === baseBoqChildItem.Reference;
											});

											if (correspondingVersionBoqItemIndex !== -1) {
												// ..and if one is found, remove the base boq item from the result set.

												// And remove item from copied version boq child list to reduce search effort.
												versionBoqItemChildren.splice(correspondingVersionBoqItemIndex, 1);

												return false;
											} else {
												// ..and if none is found leave base boq item in result set
												return true;
											}
										});
									}

									deferredItems.resolve(baseBoqChildren);

									versionBoqMainService.endActionEvent.fire();
								},
								function () {
									deferredItems.resolve(null);

									versionBoqMainService.endActionEvent.fire();
								});
						});

						return deferredItems.promise;
					};

					/**
					 * @ngdoc function
					 * @name hasBaseBoqLoaded
					 * @function
					 * @methodOf boqMainBaseBoqServiceFactory
					 * @description Return if the base boq given by the headerId is already loaded
					 * @param {Number} headerId: leads to the base boq to be checked
					 * @returns {Boolean} : tells if the base boq is loaded
					 */
					service.hasBaseBoqLoaded = function hasBaseBoqLoaded(headerId) {

						if (angular.isUndefined(headerId) || headerId === null || !_.isNumber(headerId)) {
							return false;
						}

						return serviceState.baseBoqs.has(headerId.toString());
					};

					/**
					 * @ngdoc function
					 * @name getBaseBoqItemByReferenceNumber
					 * @function
					 * @methodOf boqMainBaseBoqServiceFactory
					 * @description Return the base boq item given by the headerId and the reference number
					 * @param {Number} baseBoqHeaderFk: leads to the base boq to be checked
					 * @param {String} referenceNumber: leads to the base boq item to be returned
					 * @returns {Object} : a promise that will be resolved, finally holding the found base boq item
					 */
					service.getBaseBoqItemByReferenceNumber = function getBaseBoqItemByReferenceNumber(baseBoqHeaderFk, referenceNumber) {

						if (angular.isUndefined(baseBoqHeaderFk) || baseBoqHeaderFk === null || !_.isNumber(baseBoqHeaderFk)) {
							return $q.when(null);
						}

						if (angular.isUndefined(referenceNumber) || _.isEmpty(referenceNumber)) {
							return $q.when(null);
						}

						return $http.get(globals.webApiBaseUrl + 'boq/main/getboqitembyheaderandreferencenumber?headerId=' + baseBoqHeaderFk + '&reference=' + referenceNumber + '&depth=1');
					};

					return service;
				};

				return factory;
			}
		]);
})();