/**
 * Created by chk on 2/1/2016.
 */
(function (angular) {
	'use strict';
	var moduleName = 'documents.project';
	angular.module(moduleName).controller('documentsProjectDocumentRevisionDetailController',
		[
			'$scope',
			'documentsProjectDocumentRevisionUIStandardService',
			'platformDetailControllerService',
			'documentsProjectDocumentModuleContext',
			'documentsProjectDocumentDataService',
			'documentsProjectDocumentRevisionDataService',
			'documentProjectCommonConfigControllerService',
			function ($scope,
				documentsRevisionUIStandardService,
				platformDetailControllerService,
				documentsProjectDocumentModuleContext,
				documentsProjectDocumentDataService,
				documentsProjectDocumentRevisionDataService,
				documentProjectCommonConfigControllerService) {

				var config = documentsProjectDocumentModuleContext.getConfig();

				var revisionConfig = angular.copy(config);

				documentsProjectDocumentDataService.setIsContainerConnected(true);
				revisionConfig.parentService = documentsProjectDocumentDataService.getService(config);

				var dataService = documentsProjectDocumentRevisionDataService.getService(revisionConfig);

				platformDetailControllerService.initDetailController($scope, dataService, {}, documentsRevisionUIStandardService, {});

				// update the toolbar after digest
				var tools = [];

				function initGrid($scope, dataService) {
					if (tools.length === 0) {
						tools = documentProjectCommonConfigControllerService.initialUploadController($scope, dataService);
					}
					if (tools.length > 0) {
						$scope.formContainerOptions.customButtons = tools;
						if($scope.formContainerOptions.deleteBtnConfig){
							delete $scope.formContainerOptions.deleteBtnConfig;
						}
						if($scope.formContainerOptions.createBtnConfig){
							delete $scope.formContainerOptions.createBtnConfig;
						}

						var containerScope = $scope.$parent;

						while (containerScope && ! Object.prototype.hasOwnProperty.call(containerScope, 'setTools')) {
							containerScope = containerScope.$parent;
						}
						if (containerScope && containerScope.tools) {
							containerScope.tools.update();
						}
					}
				}

				initGrid($scope, dataService);

				$scope.$on('$destroy', function () {
					documentsProjectDocumentDataService.setIsContainerConnected(false);
				});
			}]);
})(angular);