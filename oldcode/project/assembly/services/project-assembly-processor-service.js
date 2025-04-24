

(function (angular) {
	'use strict';
	var moduleName = 'project.assembly';

	angular.module(moduleName).factory('projectAssemblyProcessor', ['platformRuntimeDataService', function(platformRuntimeDataService){

		var service= {
			processItem : processItem
		};

		function processItem(item) {
			if(!item){
				return;
			}
			var flag = false;
	        var fields = [
		        {field: 'QuantityFactor1', readonly: flag},
		        {field: 'QuantityFactor2', readonly: flag},
		        {field: 'QuantityFactor3', readonly: flag},
		        {field: 'QuantityFactor4', readonly: flag},
		        {field: 'CostFactor1', readonly: flag},
		        {field: 'CostFactor2', readonly: flag}
	        ];
	        platformRuntimeDataService.readonly(item, fields);
		}

		return service;
	}]);

})(angular);
