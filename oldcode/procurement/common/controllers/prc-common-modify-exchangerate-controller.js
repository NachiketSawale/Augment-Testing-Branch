(function (angular) {
	'use strict';
	var moduleName = 'procurement.common';

	angular.module(moduleName).controller('prcCommonModifyExchangeRateController', [
		'$scope',
		'$translate',
		function (
			$scope,
			$translate
		) {
			$scope.options = $scope.$parent.modalOptions;

			var defaultIsForeignCurrency = true;
			angular.extend($scope.options,{
				body: {
					bodyTextKey: $translate.instant('procurement.common.changeCurrencyMessage'),
					specifyText: $translate.instant('procurement.common.modifyExchangeRate.specifyUnchangedCurrency'),
					homeCurrency: $translate.instant('procurement.common.modifyExchangeRate.homeCurrency'),
					foreignCurrency: $translate.instant('procurement.common.modifyExchangeRate.foreignCurrency'),
					radioSelect: defaultIsForeignCurrency ? 'ForeignCurrency' : 'HomeCurrency'
				},
				yesText: $translate.instant('basics.common.yes'),
				noText: $translate.instant('basics.common.no'),
				onYes: function(){
					$scope.$close({yes: true, remainNet: $scope.options.body.radioSelect === 'HomeCurrency'});
				},
				onNo: function(){
					$scope.$close({no: true});
				}
			});
		}]);
})(angular);