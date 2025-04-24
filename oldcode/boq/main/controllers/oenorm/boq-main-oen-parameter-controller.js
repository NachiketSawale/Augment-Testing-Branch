(function () {
	'use strict';
	/**
	* @ngdoc controller
	* @name boqMainOenParameterTreeController
	* @function
	* @description
   */

	let moduleName = 'boq.main';
	let angModule = angular.module(moduleName);

	angModule.controller('boqMainOenParameterTreeController', ['$scope','boqMainOenParameterTreeControllerService','boqMainService',
		function ($scope,boqMainOenParameterTreeControllerService,boqMainService) {
			$scope.gridId = '451dc6bedd8240f5991c865a9da068b8';
			boqMainOenParameterTreeControllerService.getInstance($scope, boqMainService);
		}
	]);

	/**
	 * @ngdoc controller
	 * @name boqMainOenParameterDetailController
	 * @function
	 * @description
	 */
	angModule.controller('boqMainOenParameterDetailController', ['$scope','boqMainOenParameterDetailControllerService','boqMainService',
		function ($scope,boqMainOenParameterDetailControllerService,boqMainService) {
			boqMainOenParameterDetailControllerService.getInstance($scope, boqMainService);
			$scope.group = $scope.formOptions.configure.groups;
		}
	]);
})();