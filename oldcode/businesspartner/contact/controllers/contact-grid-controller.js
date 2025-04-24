(function (angular) {
	'use strict';
	let moduleName = 'businesspartner.contact';

	/**
	 * @ngdoc controller
	 * @name businessPartnerContactListController
	 * @requires $scope
	 * @description
	 * #
	 * Controller for businesspartner contact 'contact' grid container.
	 */
	angular.module(moduleName).controller('businessPartnerContactListController', [
		'$scope', 'businesspartnerContactDataService', 'businessPartnerContactUIStandardService',
		'platformGridControllerService', 'businessPartnerContactValidationService',
		'businessPartnerContactVcardExtension', 'businesspartnerContactPhotoDataService', 'businesspartnerContact2BpAssignmentDataService',
		function ($scope, dataService, uiStandardService,
			platformGridControllerService, validationService,
			businessPartnerContactVcardExtension, photoService, bpAssignmentDataService) {

			let gridConfig = {initCalled: false, columns: []};

			platformGridControllerService.initListController($scope, uiStandardService, dataService, validationService(dataService), gridConfig);

			businessPartnerContactVcardExtension.addVcardSupport($scope, dataService, photoService);
		}
	]);
})(angular);