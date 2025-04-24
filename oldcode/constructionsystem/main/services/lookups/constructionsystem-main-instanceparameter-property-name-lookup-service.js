/**
 * Created by chi on 6/14/2016.
 */
/* global globals */
(function (angular) {
	'use strict';

	var moduleName = 'constructionsystem.main';
	angular.module(moduleName).factory('constructionSystemMainInstanceParameterPropertyNameLookupService', constructionSystemMainInstanceParameterPropertyNameLookupService);
	constructionSystemMainInstanceParameterPropertyNameLookupService.$inject = [
		'$http',
		'$q',
		'basicsLookupdataLookupDescriptorService',
		'$injector'
	];
	function constructionSystemMainInstanceParameterPropertyNameLookupService($http, $q, basicsLookupdataLookupDescriptorService, $injector) {
		var service = {};

		service.getSearchList = getSearchList;
		service.getItemByKey = getItemByKey;

		return service;

		function getPageListByFilter(searchRequest){
			var deferred = $q.defer();
			var searchResult = {};

			extendSearchRequest(searchRequest);

			$http.post(globals.webApiBaseUrl + 'model/administration/propertykey/lookupwithvaluetype', searchRequest).then(function (response) {
				searchResult = {
					itemsFound: response.data.RecordsFound,
					itemsRetrieved: response.data.RecordsRetrieved,
					items: response.data.SearchList
				};
				deferred.resolve(searchResult);
			});

			return deferred.promise;
		}

		// eslint-disable-next-line no-unused-vars
		function addTempPropertyCache(data) {
			data = data || [];
			// var tempCache = basicsLookupdataLookupDescriptorService.getData('CosMainInstanceParameterPropertyNameTempCache');
			// if (tempCache) {
			//     for (var k in  tempCache) {
			//         if (tempCache.hasOwnProperty(k)) {
			//             var findObj=_.find(data, {PropertyName: tempCache[k].PropertyName});
			//         if (findObj) {
			//             data.slice(findObj);
			//          }
			//           data.push(tempCache[k]);
			//       }
			//    }
			// }
			return data;
		}

		// noinspection JSUnusedLocalSymbols
		function getSearchList(searchRequest) {
			return getPageListByFilter(searchRequest);
		}

		function getItemByKey(id) {
			var defer = $q.defer();
			var propertyNames = basicsLookupdataLookupDescriptorService.getData('CosMainInstanceParameterPropertyName');
			if (propertyNames && propertyNames[id]) {
				defer.resolve(propertyNames[id]);
			} else {
				defer.resolve(null);
			}

			return defer.promise;
		}

		function extendSearchRequest(searchRequest){
			var objectDataService = $injector.get('constructionSystemMainObjectService');
			var selectedObject = objectDataService.getSelected();
			if(selectedObject){
				searchRequest.AdditionalParameters.modelId = selectedObject.ModelFk;
				// eslint-disable-next-line no-unused-vars
				var type = typeof(selectedObject.Id);
				searchRequest.AdditionalParameters.modelObjectIds = [selectedObject.Id];
			}
			else{
				var cosInsDataService = $injector.get('constructionSystemMainInstanceService');
				var modelId = cosInsDataService.getCurrentSelectedModelId();
				if(modelId){
					searchRequest.AdditionalParameters.modelId = modelId;
				}
			}
		}
	}
})(angular);