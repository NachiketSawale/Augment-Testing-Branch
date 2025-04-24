/**
 * Created by clv on 2/9/2018.
 */
/* global globals */
(function(angular, globals){

	'use strict';

	var moduleName = 'constructionsystem.master';

	angular.module(moduleName).factory('constructionSystemMasterObject2paramPropertyNameLookupService', [ '$http', '$q', 'basicsLookupdataLookupDescriptorService',
		function($http, $q, basicsLookupdataLookupDescriptorService){

			var service = {};

			service.getSearchList = getSearchList;
			service.getList = getList;
			service.getItemByKey = getItemByKey;

			return service;

			function getListByFilter (searchSetting){
				var deferred = $q.defer();
				$http.post(globals.webApiBaseUrl + 'constructionsystem/master/objectparameter/getobjectpropertyname', {
					modelId: searchSetting.modelId,
					modelObjectId: searchSetting.modelObjectId
				}).then(function (response){
					if(response.data !== null && response.data.length > 0){
						deferred.resolve(response.data);
					}
					else{
						$http.get(globals.webApiBaseUrl + 'model/administration/propertykey/listall').then(function (response) {
							deferred.resolve(response.data);
						});
					}
				});
				return deferred.promise;
			}

			function getSearchList(searchString, displayMember, scope, getSearchListSettings){
				return getListByFilter(getSearchListSettings);
			}
			function getList(options, scope, getSearchListSettings){
				return getListByFilter(getSearchListSettings);
			}

			function getItemByKey(){
				// eslint-disable-next-line no-unused-vars
				var defer = $q.defer();
				// eslint-disable-next-line no-unused-vars
				var propertyName = basicsLookupdataLookupDescriptorService.getData('CosMasterParameterPropertyName');
			}
		}]);
})(angular, globals);