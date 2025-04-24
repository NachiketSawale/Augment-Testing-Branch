(function (angular) {
	'use strict';

	var moduleName = 'procurement.pricecomparison';
	angular.module(moduleName).controller('itemBoqProfileSaveFirstController', [
		'$scope',
		'$translate', function
		($scope,
			$translate) {

			$scope.modalOptions = {
				headerText: $translate.instant('procurement.pricecomparison.printing.saveProfile'),
				genericProfileText: $translate.instant('procurement.pricecomparison.printing.generalProfile'),
				rfqProfileText: $translate.instant('procurement.pricecomparison.printing.rfqProfile'),
				nextStep: $translate.instant('basics.common.button.nextStep'),
				isGenericProfile: true,
				isRfqProfile: false,
				next: function () {
					$scope.$close({isOk: true, isGenericProfile: $scope.modalOptions.isGenericProfile});
				},
				cancel: function() {
					$scope.$close({isOk: false});
				}
			};
		}]);
})(angular);