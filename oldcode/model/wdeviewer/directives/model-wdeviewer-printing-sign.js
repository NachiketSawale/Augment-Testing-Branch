(function (angular) {
	'use strict';

	var moduleName = 'model.wdeviewer';

	angular.module(moduleName).directive('modelWdeviewerPrintingSign', [
		function () {
			return {
				templateUrl: globals.appBaseUrl + 'model.wdeviewer/templates/sign-editors.html',
				restrict: 'A',
				scope: {
					entity: '=',
					config: '='
				},
				controller: ['$scope', 'platformTranslateService', 'modelWdeViewerPrintingSections',
					function ($scope, platformTranslateService, modelWdeViewerPrintingSections) {
						$scope.activeSection = '';
						$scope.sectionConfig = {
							left: {name: $scope.config.title + 'left', section: 'left'},
							center: {name: $scope.config.title + 'center', section: 'center'},
							right: {name: $scope.config.title + 'right', section: 'right'}
						};

						$scope.select = function select(item) {
							if (!$scope.entity[$scope.activeSection]) {
								$scope.entity[$scope.activeSection] = [];
							}
							if (!$scope.sectionConfig[$scope.activeSection].content) {
								$scope.sectionConfig[$scope.activeSection].content = [];
							}
							$scope.sectionConfig[$scope.activeSection].content.push(modelWdeViewerPrintingSections.labelContentJson(item.value));
							$('#' + ($scope.config.title + $scope.activeSection).toLowerCase()).focus();
						};

						platformTranslateService.translateObject($scope.config);
					}]
			};
		}
	]);

})(angular);