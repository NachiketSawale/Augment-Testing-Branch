/**
 * Created by lvy on 10/09/2020.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */



	let moduleName = 'procurement.common';
	angular.module(moduleName).service('procurementCommonMasterRestrictionBoqHeaderLookupDataService', [
		'$q',
		'$http',
		'globals',
		'platformLookupDataServiceFactory',
		function (
			$q,
			$http,
			globals,
			platformLookupDataServiceFactory
		) {
			let service = {};
			let boqHeaderLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'boq/main/', endPointRead: 'getboqheaderlookup' }
			};

			let container = platformLookupDataServiceFactory.createInstance(boqHeaderLookupDataServiceConfig);

			service = container.service;
			let boqHeaderCache = [];
			function determineKey(options) {

				let filter = container.data.filter;
				let key = null;

				if (angular.isDefined(filter) && filter !== null) {
					if (angular.isObject(filter)) {
						key = angular.toJson(filter);
					}
					else {
						key = filter;
					}
				}
				else {
					key = options.lookupType;
				}

				return key;
			}

			function getBoqHeaderList (options) {
				let defer = $q.defer();
				let key = {};
				let boqHeaderLookupFilter = {
					boqType: 0,
					projectId: 0,
					boqGroupId : 0,
					boqFilterWicGroupIds: [],
					prcStructureId : 0,
					packageIds: [],
					selectedProject: {
						ProjectName: ''
					},
					selectedWicGroup: {
						DescriptionInfo: {Translated: ''}
					},
					selectedPrcStructure: {
						DescriptionInfo: {Translated: ''}
					},
					filterDisabled: false,
					prcBoqsReference: [],
					prcHeaderFk: 0,
					filterCrbBoqs: false
				};

				if (angular.isFunction(options.getCustomLookupFilter)) {
					boqHeaderLookupFilter = angular.extend(boqHeaderLookupFilter, options.getCustomLookupFilter());
				}

				if (boqHeaderLookupFilter.packageIds.length === 0) {
					defer.resolve([]);
					return defer.promise;
				}

				container.data.readData(boqHeaderLookupFilter).then(function (response) {
					key = determineKey(options);
					let itemList = container.data.handleSuccessfulLoad(response.data, container.data, key);
					boqHeaderCache = boqHeaderCache.concat(itemList);
					defer.resolve(itemList);
				});

				return defer.promise;
			}

			function setBoqHeaderBasePackageCache(boqHeaders) {
				if (boqHeaders && boqHeaders.length) {
					_.forEach(boqHeaders, function (header) {
						let found = _.find(boqHeaderCache, {BoqHeaderFk: header.BoqHeaderFk});
						if (found) {
							angular.extend(found, header);
						} else {
							boqHeaderCache.push(header);
						}
					});
				}
			}

			service.setBoqHeaderBasePackageCache = setBoqHeaderBasePackageCache;

			service.getList = function getList(options) {
				let defer = $q.defer();
				let filterKey = container.data.filter;
				getBoqHeaderList(options,filterKey).then(function (d) {
					defer.resolve(d);
				});

				return defer.promise;
			};

			service.getItemById = function getItemById(id) {
				return _.find(boqHeaderCache, {BoqHeaderFk: id});
			};

			service.getItemByIdAsync = function getItemById(id) {
				let defer = $q.defer();

				let cache = _.find(boqHeaderCache, {BoqHeaderFk: id});
				if (cache) {
					defer.resolve(cache);
				}
				else {
					$http.post(globals.webApiBaseUrl + 'boq/main/getpureboqheaderlookupbyids', [id])
						.then(function (response) {
							let cache = _.find(boqHeaderCache, {BoqHeaderFk: id});
							if (!response || !angular.isArray(response.data) || response.data.length === 0) {
								if (cache) {
									defer.resolve(cache);
								} else {
									defer.resolve(null);
								}
								return;
							}

							if (!cache) {
								cache = response.data[0];
								boqHeaderCache.push(cache);
							}
							defer.resolve(cache);
						});
				}

				return defer.promise;
			};

			return service;
		}
	]);
})(angular);
