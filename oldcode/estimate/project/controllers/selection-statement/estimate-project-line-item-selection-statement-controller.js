/**
 * Created by mov on 06/12/2018.
 */

(function (angular) {
	'use strict';
	let moduleName = 'estimate.project';

	angular.module(moduleName).controller('projectMainLineItemSelectionStatementController', [
		'$scope', 'estimateProjectLineItemSelStatementControllerService', 'constructionSystemMasterHeaderService', '$injector',
		function ($scope, estimateProjectLineItemSelStatementControllerService, constructionSystemMasterHeaderService, $injector) {

			$scope.parentService = $injector.get('estimateProjectEstimateLineItemSelStatementListService');

			estimateProjectLineItemSelStatementControllerService.initController($scope);

			$scope.$on('$destroy', function () {

			});

		}
	]);
})(angular);
