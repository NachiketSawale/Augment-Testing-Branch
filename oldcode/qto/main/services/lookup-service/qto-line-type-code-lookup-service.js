(function () {
	/* global  globals, _ */
	'use strict';

	angular.module('qto.main').factory('qtoLineTypeCodeLookupService', [
		'$q', '$injector', 'platformLookupDataServiceFactory',
		function ($q, $injector, platformLookupDataServiceFactory ) {

			var lookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'basics/lookupdata/master/getlist?lookup=qtolinetype', endPointRead: ''}
			};

			var container = platformLookupDataServiceFactory.createInstance(lookupDataServiceConfig);

			var instance = container.service;

			var service = {};

			angular.extend(service,{
				getItemById: getItemById,
				getItemByIdAsync: getItemByIdAsync,
				getItemByKey:getItemById,

				getList: instance.getList,
				setFilter: instance.setFilter,
				getLookupData: instance.getLookupData,
				clearCache: clearCache,
				getQtoLineType : getQtoLineType
			});

			return service;

			function  getQtoLineType() {
				var list = container.data.dataCache.get('qtoLineTypeCode');
				if (!list || !list.length) {
					list = container.data.dataCache.get('.qtoLineTypeCodeLookupService');
				}
				return list;
			}

			function clearCache() {
				container.data.dataCache.clear();
			}

			function getItemById(value){
				return getQtoLinetypeItem(value);
			}

			function getItemByIdAsync(value){
				var	result = getQtoLinetypeItem(value);

				return result ? $q.when(result) : $q.when({Id: value, Code: value});
			}

			function getQtoLinetypeItem(value){
				var qtolinetypeList = $injector.get('basicsLookupdataLookupDescriptorService').getData('qtoLineTypeCodeLookupService');
				_.forEach(qtolinetypeList,function(d){
					d.Code = d.CodeInfo.Description;
				});
				var result = _.find(qtolinetypeList, { Id: value });
				return result;
			}
		}]);
})();
