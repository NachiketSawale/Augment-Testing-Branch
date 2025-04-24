(function (angular) {
	'use strict';
	var moduleName = 'procurement.common';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	function ControllerFn($scope, genericWizardTransmissionController, $injector) { //???

		var genericWizardService = $injector.get('genericWizardService');
		var businessPartnerServiceName = genericWizardService.config.serviceInfos.businessPartnerServiceName;
		var businessPartnerService = genericWizardService.getDataServiceByName(businessPartnerServiceName);
		var transmissionService = genericWizardService.getDataServiceByName('genericWizardBusinessPartnerTransmissionService');
		$scope.includedBusinessPartnerList = [];
		$scope.errorList = [];

		businessPartnerService.registerListLoaded(function () {
			updateScope();
		});

		function updateScope() {
			$scope.businessPartnerList = businessPartnerService.getList();
			$scope.includedBusinessPartnerList = _.filter($scope.businessPartnerList, {IsIncluded: true});
			$scope.errorList = transmissionService.getErrorList();
		}

		$scope.$watch('businessPartnerList', function () {
			updateScope();
		}, true);
	}

	ControllerFn.$inject = ['$scope', 'genericWizardBusinessPartnerTransmissionService', '$injector']; //???
	angular.module(moduleName).controller('genericWizardTransmissionController', ControllerFn);

})(angular);
