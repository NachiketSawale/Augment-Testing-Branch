/**
 * Created by mov on 3/4./2020
 */

(function () {
	/* global globals */
	'use strict';

	/**
     * @ngdoc service
     * @name boqItemLookupDataService
     * @function
     *
     * @description
     * boqItemLookupDataService is the data service for Boq item related functionality.
     */
	angular.module('qto.main').factory('qtoBoqItemLookupService', ['_', '$q', '$injector', 'platformLookupDataServiceFactory', 'basicsLookupdataLookupDescriptorService', 'ServiceDataProcessArraysExtension', 'boqMainImageProcessor', 'qtoBoqType',
		function (_, $q, $injector, platformLookupDataServiceFactory, basicsLookupdataLookupDescriptorService, ServiceDataProcessArraysExtension, boqMainImageProcessor, qtoBoqType) {

			var boqItemLookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'boq/main/', endPointRead: 'tree'},
				filterParam: 'headerId',
				dataProcessor: [new ServiceDataProcessArraysExtension(['BoqItems']),boqMainImageProcessor],
				tree: {parentProp: 'BoqItemFk', childProp: 'BoqItems'},
				prepareFilter: function(/* item, b */)
				{
					var boqHeaderFk = $injector.get('qtoMainHeaderDataService').getCurrentHeader() ? $injector.get('qtoMainHeaderDataService').getCurrentHeader().BoqHeaderFk:-1;
					return '?headerId=' + boqHeaderFk;
				}
			};

			var container = platformLookupDataServiceFactory.createInstance(boqItemLookupDataServiceConfig);

			var instance = container.service;

			var service = {};

			angular.extend(service,{
				getItemById: getItemById,
				getItemByIdAsync: getItemByIdAsync,
				getItemByKey:getItemById,

				getList: instance.getList,
				setFilter: instance.setFilter,
				getLookupData: instance.getLookupData,
				formatBoqReference : formatBoqReference,
				clearCache: clearCache
			});

			return service;

			function clearCache() {
				container.data.dataCache.clear();
			}

			function formatBoqReference(refNo) {
				return $injector.get('boqMainCommonService').getFormattedReferenceNo(refNo);
			}

			function getItemById(value , options){

				var result = null;
				var qtoBoqList =[];
				var boqItemService = null;
				if (options && options.BoqType !== qtoBoqType.QtoBoq) {
					switch (options.BoqType) {
						case qtoBoqType.PrcBoq:
							boqItemService = $injector.get('prcBoqMainService').getService($injector.get('procurementContextService').getMainService());
							break;
						case qtoBoqType.PrjBoq:
							boqItemService = $injector.get('boqMainService');
							break;
						case qtoBoqType.WipBoq:
							boqItemService = $injector.get('salesWipBoqStructureService');
							break;
						case qtoBoqType.PesBoq:
							boqItemService = $injector.get('prcBoqMainService').getService($injector.get('procurementContextService').getMainService());
							break;
						case qtoBoqType.BillingBoq:
							boqItemService = $injector.get('salesBillingBoqStructureService');
							break;
					}

					if (boqItemService) {
						let boqList = boqItemService.getList();
						basicsLookupdataLookupDescriptorService.updateData('qtoBoqItemLookupService', boqList);
					}
				}

				if(_.isNumber(value)){
					qtoBoqList = basicsLookupdataLookupDescriptorService.getData('qtoBoqItemLookupService');
					if (options && (options.BoqType === qtoBoqType.WipBoq || options.BoqType === qtoBoqType.BillingBoq || options.BoqType === qtoBoqType.PesBoq)){
						result = _.find(qtoBoqList, { BoqItemPrjItemFk: value });
					} else {
						result = _.find(qtoBoqList, { Id: value });
					}
				}else {
					qtoBoqList = basicsLookupdataLookupDescriptorService.getData('qtoBoqItemLookupService');
					result = _.find(qtoBoqList, {Reference: value});
				}
				return result;
			}

			function getItemByIdAsync(value, options, scope){
				value = ((scope && scope.entity)? scope.entity.BoqItemFk:value) || value;

				var result = null;
				var qtoBoqList =[];

				if(_.isNumber(value)){
					qtoBoqList = basicsLookupdataLookupDescriptorService.getData('qtoBoqItemLookupService');
					if (options && (options.BoqType === qtoBoqType.WipBoq || options.BoqType === qtoBoqType.BillingBoq || options.BoqType === qtoBoqType.PesBoq)){
						result = _.find(qtoBoqList, { BoqItemPrjItemFk: value });
					} else {
						result = _.find(qtoBoqList, { Id: value });
					}
				}else {
					qtoBoqList = basicsLookupdataLookupDescriptorService.getData('qtoBoqItemLookupService');
					result = _.find(qtoBoqList, {Reference: value});
				}

				return result ? $q.when(result) : $q.when({Id: null, Reference: value});
			}
		}]);
})();
