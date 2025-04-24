/**
 * Created by pel on 12/27/2019.
 */

(function (angular) {
	'use strict';
	/* global ,_ */
	/* jshint -W072 */ // many parameters because of dependency injection
	var moduleName = 'documents.centralquery';
	angular.module(moduleName).controller('documentCentralQueryHeaderDetailController',
		['$scope', 'platformGridControllerService', 'documentCentralQueryDataService', 'platformDetailControllerService',
			'documentProjectHeaderValidationService', 'documentProjectHeaderUIStandardService', 'platformTranslateService',
			'documentProjectCommonConfigControllerService',
			function ($scope, gridControllerService, dataService, platformDetailControllerService, documentProjectHeaderValidationService,
				documentProjectHeaderUIStandardService, platformTranslateService, documentProjectCommonConfigControllerService) {

				platformDetailControllerService.initDetailController($scope, dataService, documentProjectHeaderValidationService, documentProjectHeaderUIStandardService,
					platformTranslateService);
				var tools = [];

				function initDetail($scope, dataService) {
					if (tools.length === 0) {
						tools = documentProjectCommonConfigControllerService.initialUploadController($scope, dataService);
					}
					if (tools.length > 0) {
						$scope.formContainerOptions.customButtons = _.filter(tools, function (tool) {
							if (tool.id === 'preview') {
								tool.disabled = !dataService.canPreviewDocument();
							}
							if (tool.id !== 'upload') {
								return tool;
							}
						});
						var containerScope = $scope.$parent;

						while (containerScope && ! Object.prototype.hasOwnProperty.call(containerScope, 'setTools')) {
							containerScope = containerScope.$parent;
						}
						if (containerScope && containerScope.tools) {
							containerScope.tools.update();
						}
					}
				}

				initDetail($scope, dataService);
				dataService.registerSelectionChanged(function () {
					initDetail($scope, dataService);
				});
			}]
	);
})(angular);