(function (angular) {
	'use strict';
	let moduleName = 'procurement.pricecomparison';

	angular.module(moduleName).controller('procurementRequisitionItemBoqSaveDialogController',
		['_', '$translate', '$scope', function (_, $translate, $scope) {
			let options = {
				text: {
					onlyRequisition: $translate.instant('procurement.pricecomparison.updateRequisitionItemBoq.onlyRequisition'),
					requisitionAndAllQuotes: $translate.instant('procurement.pricecomparison.updateRequisitionItemBoq.requisitionAndAllQuotes'),
					headerText: $translate.instant('procurement.pricecomparison.updateRequisitionItemBoq.headerText'),
					bodyText: $translate.instant('procurement.pricecomparison.updateRequisitionItemBoq.bodyText')
				}
			};
			if (!$scope.modalOptions.defaultValue) {
				$scope.modalOptions.defaultValue = {
					onlyRequisition: 'true',
					requisitionAndAllQuotes: 'false'
				};
			}
			if (!$scope.modalOptions.model) {
				$scope.modalOptions.model = _.clone($scope.modalOptions.defaultValue);
			}
			_.extend($scope.modalOptions, options);
			_.extend($scope.modalOptions.model, $scope.modalOptions.defaultValue);  // Reset to default

			$scope.isOnlyRequisition = function () {
				$scope.modalOptions.saveOption.onlyRequisition = true;
				$scope.modalOptions.saveOption.requisitionAndAllQuotes = false;
				$scope.modalOptions.model.onlyRequisition = 'true';
				$scope.modalOptions.model.requisitionAndAllQuotes = 'false';
			};

			$scope.isRequisitionAndAllQuotes = function () {
				$scope.modalOptions.saveOption.onlyRequisition = false;
				$scope.modalOptions.saveOption.requisitionAndAllQuotes = true;
				$scope.modalOptions.model.onlyRequisition = 'false';
				$scope.modalOptions.model.requisitionAndAllQuotes = 'true';
			};
		}]);
})(angular);