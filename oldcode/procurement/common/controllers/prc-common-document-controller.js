// / <reference path="../_references.js" />
(function (angular) {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name procurementCommonDocumentListController
	 * @require $scope, $translate, $filter, platformModalService, gridControllerBase, procurementCommonDocumentDataService, procurementCommonDocumentLayout, procurementCommonDocumentValidationService, platformContextService, platformTranslateService
	 * @description controller for procurement document
	 */
	// eslint-disable-next-line no-redeclare
	/* global angular,$ */
	angular.module('procurement.common').controller('procurementCommonDocumentListController',
		['$scope', '$translate', '$window', 'procurementContextService', 'platformGridControllerService', 'procurementCommonDocumentCoreDataService',
			'procurementCommonDocumentValidationService', 'procurementCommonDocumentUIStandardService',
			'procurementCommonHelperService', 'platformGridAPI', 'platformGridControllerService', 'basicsCommonUploadDownloadControllerService', 'basicsCommonDocumentControllerService', '$injector', 'platformModalService',
			'$rootScope',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, $translate, $window, moduleContext, gridControllerService, dataServiceFactory, validationService,
				gridColumns, procurementCommonHelperService, platformGridAPI, platformGridControllerService, basicsCommonUploadDownloadControllerService, basicsCommonDocumentControllerService, $injector, platformModalService, $rootScope) {

				// when container Document does not belong to current module, it uses parentService to get dataService.
				var mainServiceName = $scope.getContentValue('parentService');
				var mainService = mainServiceName ? $injector.get(mainServiceName) : null;
				var gridConfig = {initCalled: false, columns: []},
					dataService = dataServiceFactory.getService(mainService || moduleContext.getMainService());
				validationService = validationService(dataService);

				// cutom config for document
				var parentDataService = dataService.parentService();
				if (parentDataService.containerReadonly === true) {
					dataService.isReadonly = true;
				}

				parentDataService.registerSelectionChanged(onParentSelectionChange);

				function onParentSelectionChange() {
					$('#docsaveerror').hide();
				}

				$rootScope.$on('updateDone', function () {
					$('#docsaveerror').hide();
				});

				gridControllerService.initListController($scope, gridColumns, dataService, validationService, gridConfig);

				$scope.gridFlag = '2bac93628c56416991e49f4c61a722ad';
				basicsCommonDocumentControllerService.initDocumentUploadController($scope, dataService, $scope.gridFlag);
				basicsCommonUploadDownloadControllerService.initGrid($scope, dataService);

			}
		]
	);
})(angular);