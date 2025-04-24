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
	angular.module(moduleName).factory('ppsPlannedQuantityResourceQuantityTypeProvider',ResourceQuantityTypeProvider );

	ResourceQuantityTypeProvider.$inject = ['$http', '$q'];

	function ResourceQuantityTypeProvider($http, $q) {

		var service = {};
		var resourceTypeItems = [];

		service.getResourceQuantityTypes = function (){
			$http.get(globals.webApiBaseUrl + 'productionplanning/formulaconfiguration/plannedquantity/types').then(function (result){
				resourceTypeItems = result.data.ResourceTypes;
			});
		};

		service.getResourceTypes = function (){
			var resTypes = resourceTypeItems;
			return $q.when(resTypes);
		};

		service.getResourceTypeItemById = function (key){
			var deferred = $q.defer();
			var resType = _.find(resourceTypeItems, function (item){
				return item.Id === key;
			});
			deferred.resolve(resType);
			return deferred.promise;
		};

		return service;
	}
})();