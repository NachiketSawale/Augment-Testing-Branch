/**
 * Created by chd on 12/22/2021.
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name basicsMeetingDocumentsController
	 * @require $scope
	 * @description controller for basics meeting document
	 */
	angular.module('basics.meeting').controller('basicsMeetingDocumentsController',
		['$scope', '$translate', '$window', 'platformGridControllerService', 'platformModalService',
			'basicsMeetingDocumentsService', 'basicsMeetingDocumentUIStandardService',
			'basicsMeetingDocumentsValidationService', 'platformGridControllerService', 'platformGridAPI',
			'basicsCommonUploadDownloadControllerService', 'basicsCommonDocumentControllerService',
			function ($scope, $translate, $window, gridControllerService, platformModalService,
				dataService, gridColumns, validationService, platformGridControllerService, platformGridAPI,
				basicsCommonUploadDownloadControllerService,
				basicsCommonDocumentControllerService) {
				let gridConfig = {
					columns: []
				};

				$scope.validateModel = function validateModel(entity, filed, value) {
					if (validationService) {
						return entity ? validationService.validateModel(entity, filed, value) : true;
					}
				};

				gridControllerService.initListController($scope, gridColumns, dataService, validationService, gridConfig);

				$scope.gridFlag='4a764165f16f43b38cdd272bb51ed3a1';
				basicsCommonDocumentControllerService.initDocumentUploadController($scope, dataService, $scope.gridFlag);

				basicsCommonUploadDownloadControllerService.initGrid($scope, dataService);
			}
		]
	);
})(angular);