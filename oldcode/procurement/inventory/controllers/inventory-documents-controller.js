/**
 * Created by pel on 7/9/2019.
 */
// eslint-disable-next-line no-redeclare
/* global angular,$ */
(function (angular) {
	'use strict';
	var moduleName='procurement.inventory';
	angular.module(moduleName).controller('inventoryDocumentListController',
		['$scope', 'procurementContextService', 'platformGridControllerService', 'inventoryDocumentDataService', 'inventoryDocumentValidationService',
			'inventoryDocumentUIStandardService', 'basicsCommonUploadDownloadControllerService', 'basicsCommonDocumentControllerService', '$translate', 'platformModalService', '$rootScope',
			function ($scope, moduleContext, gridControllerService, dataService, validationService, gridColumns,
				basicsCommonUploadDownloadControllerService, basicsCommonDocumentControllerService, $translate, platformModalService,
				$rootScope) {
				var gridConfig = {
					columns: []
				};

				$rootScope.$on('updateDone', function () {
					$('#docsaveerror').hide();
				});

				gridControllerService.initListController($scope, gridColumns, dataService, validationService, gridConfig);

				$scope.gridFlag='4f820e32822c44249552398b28c645cc';
				basicsCommonDocumentControllerService.initDocumentUploadController($scope, dataService, $scope.gridFlag);
				basicsCommonUploadDownloadControllerService.initGrid($scope, dataService);

			}
		]
	);
})(angular);
