/**
 * Created by jie on 20/03/2023.
 */
(function (angular) {
	'use strict';
	var moduleName = 'basics.company';

	angular.module(moduleName).controller('basicsCompanyICPartnerAccDetailController', BasicsCompanyICPartnerAccDetailController);

	BasicsCompanyICPartnerAccDetailController.$inject = ['$scope', 'platformDetailControllerService', 'basicsCompanyICPartnerAccDataService', 'basicsCompanyICPartnerAccUIStandardService'
		, 'basicsCompanyTranslationService','basicsCompanyICPartnerCardValidationServiceProcessor'];
	function BasicsCompanyICPartnerAccDetailController($scope, platformDetailControllerService, basicsCompanyICPartnerAccDataService, basicsCompanyICPartnerAccUIStandardService,
		basicsCompanyTranslationService,basicsCompanyICPartnerCardValidationServiceProcessor) {
		platformDetailControllerService.initDetailController($scope, basicsCompanyICPartnerAccDataService, basicsCompanyICPartnerCardValidationServiceProcessor, basicsCompanyICPartnerAccUIStandardService, basicsCompanyTranslationService);
	}

})(angular);
