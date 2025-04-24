/**
 * Created by jes on 3/24/2017.
 */
(function (angular, globals) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	angular.module(moduleName).factory('procurementPriceComparisonBusinessPartnerDataService', businessPartnerDataService);

	businessPartnerDataService.$inject = [
		'_',
		'$q',
		'platformDataServiceFactory',
		'platformDataServiceDataProcessorExtension',
		'procurementPriceComparisonMainService'
	];

	function businessPartnerDataService(
		_,
		$q,
		platformDataServiceFactory,
		platformDataServiceDataProcessorExtension,
		procurementPriceComparisonMainService
	) {
		var serviceOption = {
			flatLeafItem: {
				module: angular.module(moduleName),
				serviceName: 'procurementPriceComparisonBusinessPartnerDataService',
				httpRead: {
					route: globals.webApiBaseUrl + 'businesspartner/main/businesspartner/',
					endRead: 'getbpbyrfqheaderfk'
				},
				entityRole: {
					leaf: { itemName: 'BusinessPartner', parentService: procurementPriceComparisonMainService  }
				},
				presenter: {
					list: {
						incorporateDataRead: function (readData, data) {
							data.itemList = readData.Main;
							platformDataServiceDataProcessorExtension.doProcessData(data.itemList, data);

							if (data.isCurrentBaseRfqIdChanged) {
								data.itemListCache.length = 0;
								_.forEach(data.itemList, function (item) {
									data.itemListCache.push(item);
								});
							}

							data.listLoaded.fire({setTreeGridLevel: false});
							return readData.Main;
						}
					}
				},
				actions: { delete: false, create: false },
				entitySelection: {simple:{}}
			}
		};

		var container = platformDataServiceFactory.createNewComplete(serviceOption);
		var service = container.service;
		var data = container.data;

		data.itemListCache = [];

		data.currentBaseRfqId = null;
		data.isCurrentBaseRfqIdChanged = true;

		data.setFilter = function(filter) {
			var parentItem = data.parentService.getSelected();
			if (parentItem && _.isNumber(parentItem.RfqHeaderFk)) {
				data.filter = 'mainItemId=' + parentItem.RfqHeaderFk;
				if (_.isNil(data.currentBaseRfqId) || data.currentBaseRfqId !== parentItem.RfqHeaderFk) {
					data.currentBaseRfqId = parentItem.RfqHeaderFk;
					data.isCurrentBaseRfqIdChanged = true;
				} else {
					data.isCurrentBaseRfqIdChanged = false;
				}
			} else {
				data.filter = filter;
				if (_.isNil(data.currentBaseRfqId) || data.currentBaseRfqId !== parentItem.Id) {
					data.currentBaseRfqId = parentItem.Id;
					data.isCurrentBaseRfqIdChanged = true;
				} else {
					data.isCurrentBaseRfqIdChanged = false;
				}
			}
		};

		var oldCallHTTPRead = data.doCallHTTPRead;
		data.doCallHTTPRead = function (readData, data, onReadSucceeded) {
			var deferred = $q.defer();
			if (data.isCurrentBaseRfqIdChanged) {
				return oldCallHTTPRead(readData, data, onReadSucceeded);
			} else {
				deferred.resolve(onReadSucceeded({ Main: _.clone(data.itemListCache) }, data));
				return deferred.promise;
			}
		};

		return service;
	}

})(angular, globals);