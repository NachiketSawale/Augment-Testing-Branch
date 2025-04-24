/**
 * Created by clv on 10/30/2017.
 */
(function(angular){

	'use strict';
	var moduleName = 'procurement.common';
	angular.module(moduleName).controller('procurementCommonCreateBusinessPartnerController',procurementCommonCreateBusinessPartnerController);

	procurementCommonCreateBusinessPartnerController.$inject = ['$scope', 'procurementCommonCreateBusinessPartnerService'];
	function procurementCommonCreateBusinessPartnerController($scope, procurementCommonCreateBusinessPartnerService){
		$scope.modalOptions.title = 'Go To BusinessPartner';
		$scope.goTo = function(){
			procurementCommonCreateBusinessPartnerService.goTo();
			$scope.$close(false);
		};
		$scope.modalOptions.ok = function(){
			procurementCommonCreateBusinessPartnerService.ok();
			$scope.$close(false);
		};
	}

})(angular);