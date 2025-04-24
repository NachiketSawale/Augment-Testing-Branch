(function () {
	'use strict';
	var moduleName = 'productionplanning.formulaconfiguration';
	/**
	 * @ngdoc service
	 * @name ppsPlannedQuantityResourceQuantityTypeProvider
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).factory('ppsPlannedQuantityQuantityPropertiesProvider',ResourceQuantityTypeProvider );

	ResourceQuantityTypeProvider.$inject = ['$http', '$q'];

	function ResourceQuantityTypeProvider($http, $q) {

		var service = {};
		var properties = [];

		service.getQuantityProperties = function (){
			$http.get(globals.webApiBaseUrl + 'productionplanning/producttemplate/productdescription/getpropertiesforlookup').then(function (result){
				properties = result.data;
			});
		};

		service.getProperties = function (){
			return $q.when(properties);
		};

		service.getPropertyById = function (key){
			var deferred = $q.defer();
			var property = _.find(properties, function (item){
				return item.Id === key;
			});
			deferred.resolve(property);
			return deferred.promise;
		};

		return service;
	}
})();