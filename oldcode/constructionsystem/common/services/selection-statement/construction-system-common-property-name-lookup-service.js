/**
 * Created by chi on 8/10/2016.
 */
/* global globals,_ */
(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.common';

	angular.module(moduleName).factory('constructionSystemCommonPropertyNameLookupService', ['$q', '$http',
		function ($q, $http) {
			var service = {
				getItemByKey: getItemByKey,
				getSearchList: getSearchList,
				setCurrentModelId: setCurrentModelId
			};

			var lookupData = {
				propertyKeys: []
			};

			var currentModelId = null;

			function getItemByKey(id) {
				var defer = $q.defer();
				var findItem = _.find(lookupData.propertyKeys, {PropertyName: id});
				if(!findItem){
					var searchRequest = {
						RequestIds: [id]
					};
					getSearchList(searchRequest).then(function (response) {
						defer.resolve(response.items[0]);
					});
				}else{
					defer.resolve(findItem);
				}
				return defer.promise;
			}

			function getSearchList(searchRequest){
				extendSearchRequest(searchRequest);
				return $http.post(globals.webApiBaseUrl + 'model/administration/propertykey/lookupwithvaluetype', searchRequest).then(function (response) {
					var searchResult = {
						itemsFound: response.data.RecordsFound,
						itemsRetrieved: response.data.RecordsRetrieved,
						items: response.data.SearchList
					};
					return searchResult;
				});
			}

			function extendSearchRequest(searchRequest){
				if(!searchRequest.AdditionalParameters){
					searchRequest.AdditionalParameters = {};
				}
				if(currentModelId){
					searchRequest.AdditionalParameters.modelId = currentModelId;
				}
			}

			function setCurrentModelId(modelId){
				currentModelId = modelId;
			}

			return service;
		}
	]);
})(angular);