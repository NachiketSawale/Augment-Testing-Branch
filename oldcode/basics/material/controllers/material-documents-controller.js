(function (angular) {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name basics.Material.basicsMaterialGroupsController
	 * @require $scope
	 * @description controller for basics material catalog
	 */
	angular.module('basics.material').controller('basicsMaterialDocumentsController',
		['$scope', '$translate', '$window', 'platformGridControllerService', 'platformModalService',
			'basicsMaterialDocumentsService', 'basicsMaterialDocumentStandardConfigurationService',
			'basicsMaterialDocumentsValidationService', 'platformGridControllerService', 'platformGridAPI', 'basicsCommonUploadDownloadControllerService',
			'basicsCommonDocumentControllerService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, $translate, $window, gridControllerService, platformModalService,
				dataService, gridColumns, validationService, platformGridControllerService, platformGridAPI, basicsCommonUploadDownloadControllerService,
				basicsCommonDocumentControllerService) {
				var gridConfig = {
					columns: []
				};

				$scope.validateModel = function validateModel(entity, filed, value) {
					if (validationService) {
						return entity ? validationService.validateModel(entity, filed, value) : true;
					}
				};

				gridControllerService.initListController($scope, gridColumns, dataService, validationService, gridConfig);

				$scope.gridFlag='19004da082644d6e9f3ce323eabc9196';
				basicsCommonDocumentControllerService.initDocumentUploadController($scope, dataService, $scope.gridFlag);

				basicsCommonUploadDownloadControllerService.initGrid($scope, dataService);
			}
		]
	);
})(angular);