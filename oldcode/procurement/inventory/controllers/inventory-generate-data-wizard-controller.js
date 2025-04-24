/**
 * Created by pel on 12/23/2020.
 */
(function (angular) {
	'use strict';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.inventory').controller('procurementInventoryGenerateDataWizardController',
		['$scope', '$translate',
			function ($scope, $translate) {

				$scope.options = $scope.$parent.modalOptions;

				angular.extend($scope.options,{
					body: {
						clearActualQuantityTitle: $translate.instant('procurement.inventory.wizard.generate.clearActualQuantityTitle'),
						clearActualQuantity: false
					},
					onOK: function(){
						if($scope.options.body.clearActualQuantity){
							$scope.$close({clearActualQuantity: true});
						}else{
							$scope.$close({clearActualQuantity: false});
						}
					}
				});
			}]);
})(angular);