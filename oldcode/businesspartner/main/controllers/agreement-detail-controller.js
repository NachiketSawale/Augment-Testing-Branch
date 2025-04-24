/**
 * Created by chi on 4/20/2016.
 */
(function (angular) {
	'use strict';

	angular.module('businesspartner.main').controller('businesspartnerMainAgreementDetailController', businesspartnerMainAgreementDetailController);

	businesspartnerMainAgreementDetailController.$inject = [
		'$scope',
		'platformTranslateService',
		'platformDetailControllerService',
		'businesspartnerMainAgreementDataService',
		'basicsCommonUploadDownloadControllerService',
		'businesspartnerMainAgreementUIStandardService',
		'businesspartnerMainAgreementValidationService'
	];

	/* jshint -W072 */
	function businesspartnerMainAgreementDetailController(
		$scope,
		platformTranslateService,
		platformDetailControllerService,
		businesspartnerMainAgreementDataService,
		basicsCommonUploadDownloadControllerService,
		businesspartnerMainAgreementUIStandardService,
		businesspartnerMainAgreementValidationService
	) {
		// var validator = businesspartnerMainActivityValidationService(businesspartnerMainActivityDataService);

		var translateService = {
			translateFormConfig: function translateFormConfig(formConfig) {
				platformTranslateService.translateFormConfig(formConfig);
			}
		};

		platformDetailControllerService.initDetailController(
			$scope,
			businesspartnerMainAgreementDataService,
			businesspartnerMainAgreementValidationService(businesspartnerMainAgreementDataService),
			businesspartnerMainAgreementUIStandardService,
			translateService
		);

		basicsCommonUploadDownloadControllerService.initDetail($scope, businesspartnerMainAgreementDataService);

		businesspartnerMainAgreementDataService.fillReadonlyModels($scope.formOptions.configure);
	}
})(angular);