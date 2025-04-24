(function (angular) {
	'use strict';
	let muduleName = 'businesspartner.contact';

	/**
	 * @ngdoc controller
	 * @name businessPartnerContact2CompanyFormController
	 * @requires
	 * @description
	 * #
	 * Controller for businesspartner contact 'contact' form container.
	 */
	angular.module(muduleName).controller('businessPartnerContact2CompanyFormController', [
		'$scope', 'platformDetailControllerService', 'platformTranslateService',
		'businessPartnerContact2CompanyUIStandardService', 'businessPartnerContact2CompanyDataService',
		'businessPartnerContact2CompanyValidationService',
		function ($scope, platformDetailControllerService, platformTranslateService,
			uiStandardService, dataService,
			validationService) {

			let translateService = {
				translateFormConfig: function translateFormConfig(formConfig) {
					platformTranslateService.translateFormConfig(formConfig);
				}
			};

			platformDetailControllerService.initDetailController($scope, dataService, validationService, uiStandardService, translateService);
		}
	]);
})(angular);