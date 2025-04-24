/**
 * Created by clv on 3/12/2018.
 */
(function(){

	'use strict';
	var moduleName = 'basics.material';

	angular.module(moduleName).controller('basicsMaterial2CertificateFormController', basicsMaterial2CertificateFormController);
	basicsMaterial2CertificateFormController.$inject = ['$scope', 'platformDetailControllerService', 'basicsMaterial2CertificateUIStandardService',
		'basicsMaterial2CertificateDataService', 'basicsMaterial2CertificateValidationService', 'platformTranslateService'];
	function basicsMaterial2CertificateFormController( $scope, platformDetailControllerService, UIStandardService,
		dataService, validationService, platformTranslateService){

		platformDetailControllerService.initDetailController($scope,dataService, validationService, UIStandardService, platformTranslateService);
	}
})(angular);