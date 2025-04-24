(function(angular) {
	'use strict';

	var moduleName = 'basics.company';

	angular.module(moduleName).controller('basicsCompanyICPartnerCardDetailController', BasicsCompanyICPartnerCardDetailController);

	BasicsCompanyICPartnerCardDetailController.$inject = ['$scope', 'platformDetailControllerService','basicsCompanyICPartnerCardDataService','basicsCompanyICPartnerUIStandardService'
	,'basicsCompanyTranslationService','basicsCompanyICPartnerCardValidationServiceProcessor'];
	function BasicsCompanyICPartnerCardDetailController($scope, platformDetailControllerService,basicsCompanyICPartnerCardDataService,basicsCompanyICPartnerUIStandardService,
		basicsCompanyTranslationService,basicsCompanyICPartnerCardValidationServiceProcessor) {
		platformDetailControllerService.initDetailController($scope,basicsCompanyICPartnerCardDataService,basicsCompanyICPartnerCardValidationServiceProcessor, basicsCompanyICPartnerUIStandardService, basicsCompanyTranslationService);
	}

})(angular);
