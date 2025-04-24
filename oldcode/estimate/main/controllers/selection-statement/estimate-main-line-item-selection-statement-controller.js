/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'estimate.main';

	angular.module(moduleName).controller('estimateMainLineItemSelectionStatementController', [
		'$scope', 'estimateMainLineItemSelStatementControllerService', '$injector',
		function ($scope, estimateMainLineItemSelStatementControllerService, $injector) {

			$scope.parentService = $injector.get('estimateMainLineItemSelStatementListService');

			$scope.options = $scope.options || {};
			// cm Id
			$scope.options.scriptId = 'estSelStatement';

			estimateMainLineItemSelStatementControllerService.initController($scope);



			$scope.$on('$destroy', function () {

			});

		}
	]);
})(angular);
