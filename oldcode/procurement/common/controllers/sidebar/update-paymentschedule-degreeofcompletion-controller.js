(function (angular) {
	'use strict';

	var moduleName = 'procurement.common';
	angular.module(moduleName).controller('updatePaymentScheduleDegreeOfCompletionController', [
		'$scope',
		'$translate',
		function (
			$scope,
			$translate
		) {
			$scope.options = $scope.$parent.modalOptions;

			angular.extend($scope.options,{
				body: {
					bodyTitle:$translate.instant('procurement.common.wizard.updatePaymetScheduleDOC.bodyOptions'),
					selectCurrentItem: $translate.instant('procurement.common.wizard.updatePaymetScheduleDOC.selectCurrentItem'),
					selectAllItems:$translate.instant('procurement.common.wizard.updatePaymetScheduleDOC.selectAllItems'),
					radioSelect: $scope.options.paymentScheduleId === -1 ? 'AllItems' : 'CurrentItem'
				},
				onOK: function(){
					if($scope.options.body.radioSelect === 'CurrentItem'){
						$scope.$close({
							PaymentScheduleId: $scope.options.paymentScheduleId
						});
					}else{
						$scope.$close({});
					}
				},
				disabledUpdateCurrentItem: function() {
					return $scope.options.paymentScheduleId === -1;
				}
			});
		}]);
})(angular);
