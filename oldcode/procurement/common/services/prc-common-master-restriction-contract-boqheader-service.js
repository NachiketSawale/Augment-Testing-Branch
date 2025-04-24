/**
 * Created by chi on 20/07/2021.
 */
(function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	var moduleName = 'procurement.common';
	angular.module(moduleName).service('procurementCommonMasterRestrictionContractBoqHeaderService', procurementCommonMasterRestrictionContractBoqHeaderService);
	procurementCommonMasterRestrictionContractBoqHeaderService.$inject = [
		'$q',
		'$http',
		'globals',
		'platformLookupDataServiceFactory'];

	function procurementCommonMasterRestrictionContractBoqHeaderService(
		$q,
		$http,
		globals,
		platformLookupDataServiceFactory
	) {
		var service = {};
		var boqHeaderLookupDataServiceConfig = {
			httpRead: {route: globals.webApiBaseUrl + 'boq/main/', endPointRead: 'getboqheaderlookup'}
		};

		var container = platformLookupDataServiceFactory.createInstance(boqHeaderLookupDataServiceConfig);

		service = container.service;
		var boqHeaderCache = [];

		function determineKey(options) {

			var filter = container.data.filter;
			var key = null;

			if (angular.isDefined(filter) && filter !== null) {
				if (angular.isObject(filter)) {
					key = angular.toJson(filter);
				} else {
					key = filter;
				}
			} else {
				key = options.lookupType;
			}

			return key;
		}

		// eslint-disable-next-line no-unused-vars
		function getBoqHeaderList(options, filterKey) {
			var defer = $q.defer();
			var key = {};
			var boqHeaderLookupFilter = {
				boqType: 0,
				projectId: 0,
				boqGroupId: 0,
				boqFilterWicGroupIds: [],
				prcStructureId: 0,
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
				filterCrbBoqs: false,
				contractIds: []
			};

			if (angular.isFunction(options.getCustomLookupFilter)) {
				boqHeaderLookupFilter = angular.extend(boqHeaderLookupFilter, options.getCustomLookupFilter());
			}

			if (boqHeaderLookupFilter.contractIds.length === 0) {
				defer.resolve([]);
				return defer.promise;
			}

			container.data.readData(boqHeaderLookupFilter).then(function (response) {
				key = determineKey(options);
				var itemList = container.data.handleSuccessfulLoad(response.data, container.data, key);
				boqHeaderCache = boqHeaderCache.concat(itemList);
				defer.resolve(itemList);
			});
			return defer.promise;
		}

		function setContractBoqHeaderCache(boqHeaders) {
			if (boqHeaders && boqHeaders.length) {
				_.forEach(boqHeaders, function (header) {
					var found = _.find(boqHeaderCache, {BoqHeaderFk: header.BoqHeaderFk});
					if (found) {
						angular.extend(found, header);
					} else {
						boqHeaderCache.push(header);
					}
				});
			}
		}

		service.setContractBoqHeaderCache = setContractBoqHeaderCache;

		service.getList = function getList(options) {
			var defer = $q.defer();
			var filterKey = container.data.filter;
			getBoqHeaderList(options, filterKey).then(function (d) {
				defer.resolve(d);
			});

			return defer.promise;
		};

		// eslint-disable-next-line no-unused-vars
		service.getItemById = function getItemById(id, options) {
			return _.find(boqHeaderCache, {BoqHeaderFk: id});
		};

		// eslint-disable-next-line no-unused-vars
		service.getItemByIdAsync = function getItemById(id, options) {

			var defer = $q.defer();

			var cache = _.find(boqHeaderCache, {BoqHeaderFk: id});
			if (cache) {
				defer.resolve(cache);
			} else {
				$http.post(globals.webApiBaseUrl + 'boq/main/getpureboqheaderlookupbyids', [id])
					.then(function (response) {
						var cache = _.find(boqHeaderCache, {BoqHeaderFk: id});
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
})(angular);
