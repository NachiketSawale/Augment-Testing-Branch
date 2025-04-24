(function (angular) {
	'use strict';
	var moduleName = 'basics.lookupdata';

	/**
	 * @ngdoc service
	 * @name estimateMainHeaderLookupDataService
	 * @function
	 * @description
	 * #
	 * lookup data service for estimate main header.
	 */
	angular.module(moduleName).factory('estimateMainHeaderLookupDataService', [
		'$q', '$injector', 'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',
		function ($q, $injector, platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('estimateMainHeaderLookupDataService', {
				valMember: 'Id',
				dispMember: 'Code',
				columns: [
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						name$tr$: 'cloud.common.entityCode',
						width: 100
					},
					{
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						name$tr$: 'cloud.common.entityDescription',
						width: 150
					}
				],
				uuid:'e38d7da7d36a48169c1b852679ddb85a'
			});

			var lookupServiceOption = {
				httpRead: {route: globals.webApiBaseUrl + 'estimate/main/header/', endPointRead: 'lookup'},
				filterParam: 'projectId'
			};

			var container = platformLookupDataServiceFactory.createInstance(lookupServiceOption);
			var service = container.service;

			/**
			 * override method: get item description data form server side if the data not existed in client.
			 * e.g. new created items (not saved to database) should show in a lookup.
			 */
			container.data.getByFilterAsync = function getByFilterAsync(filterFn, options) {
				var defer = $q.defer();
				service.getLookupDataByFilter(options,filterFn).then(function (itemList) {
					var item = _.find(itemList, function (item) {
						return filterFn(item);
					});

					defer.resolve(item);
				}
				);
				return defer.promise;
			};

			/**
			 *  override method: get data from estimate container in module project at first.
			 */
			service.getLookupDataByFilter = function getLookupDataByFilter(options,filterFn) {
				let result = null;
				var prjEstimateService = $injector.get('estimateProjectService');
				if(prjEstimateService && !_.isEmpty(prjEstimateService.getList())){
					var items = _.map(prjEstimateService.getList(), function (item) {
						return item.EstHeader;
					});

					items = _.filter(items,function (d) {
						return !d.EstHeaderVersionFk && d.IsActive && !d.IsGCOrder;
					});

					items = _.sortBy(items, 'Code');

					if(filterFn) {
						result = _.find (items, function (item) {
							return filterFn (item);
						});
					}

					if(result){
						container.data.dataCache.update(determineKey(options), items);
						return $q.when(items);
					}else{
						container.data.dataCache.update(determineKey(options), []);
						return service.getList(options);
					}
				}else {
					container.data.dataCache.update(determineKey(options), []);
					return service.getList(options);
				}
			};

			service.getLookupData = function getLookupData(options) {
				var prjEstimateService = $injector.get('estimateProjectService');
				if (prjEstimateService && !_.isEmpty(prjEstimateService.getList())) {
					var items = _.map(prjEstimateService.getList(), function (item) {
						return item.EstHeader;
					});

					items = _.filter(items,function (d) {
						return !d.EstHeaderVersionFk && d.IsActive && !d.IsGCOrder;
					});

					items = _.sortBy(items, 'Code');
					container.data.dataCache.update(determineKey(options), items); // update cache for new created item lookup formatter
					return $q.when(items);
				} else {
					return service.getList(options);
				}
			};

			function determineKey(options) {
				var filter = container.data.filter;
				var key = null;

				if (angular.isDefined(filter) && filter !== null && filter !== '') {
					if (angular.isObject(filter)) {
						// In case we have a object containing various filter conditions we generate a unique key
						// by transforming it into a json string and generate a hash key based on this string.
						// This procedure should return a key that describes to internal state of the filter object
						// in a way that leads to a unique reprocducible key.
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

			return service;
		}
	]);
})(angular);