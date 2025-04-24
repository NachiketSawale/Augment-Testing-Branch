(function () {

	'use strict';
	var moduleName = 'model.main';

	/**
	 * @ngdoc controller
	 * @name modelMainPropkeysBulkAssignmentController
	 * @function
	 *
	 * @description
	 * Controller for the content of the property keys bulk assignment wizard dialog.
	 **/
	angular.module(moduleName).controller('modelMainPropkeysBulkAssignmentController', ['$scope',
		function ($scope) {
			$scope.dataItem = $scope.options.dataItem;
		}]);
})();