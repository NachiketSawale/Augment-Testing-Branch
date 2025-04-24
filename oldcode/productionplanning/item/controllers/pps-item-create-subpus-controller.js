


(function (angular) {
	'use strict';
	/*global angular*/
	var moduleName = 'productionplanning.item';

	angular.module(moduleName).controller('ppsItemCreateSubPUsController', controller);
	controller.$inject = ['$scope', '$options', 'ppsItemCreateSubPUsService', 'platformGridAPI'];

	function controller($scope, $options, ppsItemCreateSubPUsService, platformGridAPI) {
		ppsItemCreateSubPUsService.initial($scope, $options);
		ppsItemCreateSubPUsService.registerFilters();

		$scope.$on('$destroy', function () {
			ppsItemCreateSubPUsService.unregisterFilters();
		});
	}

})(angular);