/**
 * Created by chi on 4/20/2016.
 */
(function (angular) {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('businesspartner.main').controller('businesspartnerMainAgreementListController', businesspartnerMainAgreementListController);

	businesspartnerMainAgreementListController.$inject = [
		'$scope',
		'platformGridControllerService',
		'businesspartnerMainAgreementDataService',
		'businesspartnerMainAgreementUIStandardService',
		'basicsCommonUploadDownloadControllerService',
		'businesspartnerMainAgreementValidationService',
		'$translate',
		'platformModalService',
		'basicsCommonDocumentControllerService'
	];

	function businesspartnerMainAgreementListController(
		$scope,
		platformGridControllerService,
		businesspartnerMainAgreementDataService,
		businesspartnerMainAgreementUIStandardService,
		basicsCommonUploadDownloadControllerService,
		businesspartnerMainAgreementValidationService,
		$translate,
		platformModalService,
		basicsCommonDocumentControllerService

	) {
		let myGridConfig = {initCalled: false, columns: []};
		// var validator = businesspartnerMainActivityValidationService(businesspartnerMainActivityDataService);
		platformGridControllerService.initListController($scope, businesspartnerMainAgreementUIStandardService, businesspartnerMainAgreementDataService, businesspartnerMainAgreementValidationService(businesspartnerMainAgreementDataService), myGridConfig);

		businesspartnerMainAgreementDataService.fillReadonlyModels(businesspartnerMainAgreementUIStandardService.getStandardConfigForListView());

		$scope.gridFlag = 'eae0db97bfe840c986070f26cf81c906';
		basicsCommonDocumentControllerService.initDocumentUploadController($scope, businesspartnerMainAgreementDataService, $scope.gridFlag);

		basicsCommonUploadDownloadControllerService.initGrid($scope, businesspartnerMainAgreementDataService);
	}
})(angular);