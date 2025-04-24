(function (angular) {
	'use strict';

	angular.module('platform').directive('infoBarDirective', infoBarDirective);

	infoBarDirective.$inject = ['$', '$rootScope', 'platformModuleNavigationService'];

	function infoBarDirective($, $rootScope, naviService) {
		return {
			restrict: 'E',
			templateUrl: globals.appBaseUrl + 'app/components/wizard/partials/info-bar-template.html',
			scope: {
				config: '=',
				goTo: '='
			},
			link: function ($scope) {

				$scope.openEntityInNewTab = function openInNewTab(entity) {
					var moduleName = entity.moduleName;
					var navigatorConfig = {
						moduleName: moduleName,
						targetIdProperty: 'Id',
						forceNewTab: true
					};

					naviService.navigate(navigatorConfig, entity);
				};

				$scope.hasModulePermission = function hasModulePermission(entity) {
					var moduleName = entity.moduleName;
					return naviService.hasPermissionForModule(moduleName);
				};

				$scope.goToStep = function (header, index) {
					$scope.goTo(header);
					var step = $('#scroll-tabs-tab-' + index);
					$('.tab_selected').removeClass('tab_selected');
					step.addClass('tab_selected');
					if (step[0]) {
						step[0].scrollIntoView();
					}
					$('.modal-body')[0].scrollTo({top: 0});
				};

				$scope.getHeaderCount = function (header) {
					var count = 0;
					_.each(header.headerInfos, function (info) {
						count += info.filterFn(info.list).length;
					});
					return count;
				};

				var genericWizardSend = $rootScope.$on('config:genericWizardSend', function () {
					var config = $scope.config;
					var index = config.length - 1;
					var lastTab = config[index];
					$scope.goToStep(lastTab, index);
				});

				$scope.$on('$destroy', function () {
					genericWizardSend();
				});
			}
		};
	}
})(angular);