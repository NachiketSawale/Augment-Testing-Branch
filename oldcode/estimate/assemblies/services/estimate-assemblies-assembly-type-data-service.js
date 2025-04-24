
(function (angular) {
	/* global globals, _ */
	'use strict';

	/**
	 * @ngdoc service
	 * @name estimateAssembliesAssemblyTypeLookupDataService
	 * @function
	 *
	 * @description
	 *
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('estimate.assemblies').factory('estimateAssembliesAssemblyTypeDataService', [ '$q', '$http',
		function ($q, $http) {

			let service = {}, assemblyTypes = [];

			service.getAssemblyTypeByKey = function getAssemblyTypeByKey(value){
				return _.find(assemblyTypes, {'Id': value});
			};

			service.getAssemblyTypes = function getAssemblyTypes(reload){
				if(assemblyTypes && assemblyTypes.length && !reload){
					return $q.when(assemblyTypes);
				}else{
					return $http.get(globals.webApiBaseUrl + 'estimate/assemblies/assemblytype/list').then(function(response) {

						assemblyTypes = response.data;

						return assemblyTypes;
					});
				}
			};

			service.isPaAssembly = function isPaAssembly(value){
				let assemblyType = service.getAssemblyTypeByKey(value);
				return assemblyType && assemblyType.EstAssemblyTypeLogicFk === 8;
			};

			service.clear = function clear(){
				assemblyTypes = [];
			};

			return service;
		}]);
})(angular);
