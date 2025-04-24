/**
 * Created by zos on 12/25/2014.
 */
(function (angular) {
	'use strict';
	let moduleName = 'businesspartner.contact';

	/**
	 * @ngdoc controller
	 * @name businesspartnerContactFormController
	 * @requires
	 * @description
	 * #
	 * Controller for businesspartner contact 'contact' form container.
	 */
	angular.module(moduleName).controller('businesspartnerContactFormController', [
		'$scope', 'platformDetailControllerService', 'platformTranslateService',
		'businessPartnerContactUIStandardService', 'businesspartnerContactDataService',
		'businessPartnerContactValidationService', 'businessPartnerContactVcardExtension',
		'businesspartnerContactPhotoDataService', 'businesspartnerContact2BpAssignmentDataService',
		function ($scope, platformDetailControllerService, platformTranslateService,
			uiStandardService, dataService,
			validationService, businessPartnerContactVcardExtension,
			photoService,bpAssignmentDataService) {

			let translateService = {
				translateFormConfig: function translateFormConfig(formConfig) {
					platformTranslateService.translateFormConfig(formConfig);
				}
			};

			platformDetailControllerService.initDetailController($scope, dataService, validationService(dataService), uiStandardService, translateService);

			businessPartnerContactVcardExtension.addVcardSupport($scope, dataService, photoService);
		}
	]);
})(angular);