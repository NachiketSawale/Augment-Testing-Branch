/**
 * Created by clv on 3/12/2018.
 */
(function(angular){

	'use strict';
	var moduleName = 'basics.material';
	angular.module(moduleName).controller('basicsMaterial2CertificateGridController', basicsMaterial2CertificateGridController);
	basicsMaterial2CertificateGridController.$inject = ['$scope', 'platformGridControllerService', 'basicsMaterial2CertificateUIStandardService',
		'basicsMaterial2CertificateDataService', 'basicsMaterial2CertificateValidationService'];
	function basicsMaterial2CertificateGridController($scope, platformGridControllerService, UIStandardService, dataService, validationService){

		platformGridControllerService.initListController($scope, UIStandardService, dataService, validationService, {});
	}
})(angular);
