/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'estimate.main';

	angular.module(moduleName).controller('estimateMainLineItemObjectSelectionStatementController', [
		'$scope', 'estimateMainLineItemObjectSelStatementControllerService', '$injector',
		function ($scope, estimateMainLineItemObjectSelStatementControllerService, $injector) {

			$scope.parentService = $injector.get('estimateMainLineItemSelStatementListService');

			$scope.options = $scope.options || {};
			// cm Id
			$scope.options.scriptId = 'estObjectSelStatement';

			estimateMainLineItemObjectSelStatementControllerService.initController($scope);



			$scope.$on('$destroy', function () {

			});

		}
	]);
})(angular);
