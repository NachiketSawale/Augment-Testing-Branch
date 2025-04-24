(angular => {
	'use strict';
	const moduleName = 'productionplanning.formulaconfiguration';

	angular.module(moduleName).controller('ppsPlannedQuantityEstResourceLookupDialogController', ['$scope', '$modalInstance', 'lookupFilterDialogControllerService',
		function ($scope, $modalInstance, lookupFilterDialogControllerService) {
			lookupFilterDialogControllerService.initFilterDialogController($scope, $modalInstance);

			// trigger validation of Est Header row to make Est LineItem row readonly if EstHeaderFk is empty.
			const estHeaderRow = $scope.formOptions.configure.rows.filter(row => row.rid === 'estimateHeaderFk')[0];
			if (estHeaderRow && typeof estHeaderRow.validator === 'function') {
				estHeaderRow.validator($scope.request, $scope.request.EstHeaderFk);
			}
		}]);
})(angular);