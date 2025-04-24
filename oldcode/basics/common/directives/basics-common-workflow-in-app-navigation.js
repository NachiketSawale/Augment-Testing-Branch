/**
 * Created by lst on 11/22/2019.
 *
 * usage:
 * <basics-common-workflow-in-app-navigation
 * data-navigation-to-module = "'businesspartner.main'"
 * data-navigation-to-entity-ids="Context.bpids"
 * data-btn-text="'Navigate to BusinessPartner Module'">
 * </basics-common-workflow-in-app-navigation>
 */

(function (angular) {
	'use strict';
	const moduleName = 'basics.common';
	angular.module(moduleName).directive('basicsCommonWorkflowInAppNavigation',
		['$injector',
			function ($injector) {
				return {
					scope: {
						navigationToModule: '=',
						navigationToEntityIds: '=',
						btnText: '='
						// todo:lst
						// btnTextKey: '=' // if key is set btnText will be replaced by translation of btnTextKey.
					},
					template: '<a href="javascript:void();" title="{{btnText}}" data-ng-click="navigation();">{{btnText}}</a>',
					controller: ['$scope', function ($scope) {
						$scope.navigation = function () {
							if (!$scope.navigationToModule) {
								return false;
							}
							if (!$scope.navigationToEntityIds || !$scope.navigationToEntityIds.length) {
								return false;
							}

							// var procurementContextService = $injector.get('procurementContextService');
							// make sure the main service is set, if not set , get module may cause an error.
							// var currentModule = procurementContextService.getMainService() && procurementContextService.getModuleName();
							// if navigate to current module, call search method.
							// if (currentModule && $scope.navigationToModule === currentModule) {
							// var cloudDesktopSidebarService = $injector.get('cloudDesktopSidebarService');
							// cloudDesktopSidebarService.filterSearchFromPKeys($scope.navigationToEntityIds);
							// } else {
							// var navService = $injector.get('platformModuleNavigationService');
							// navService.navigate({moduleName: $scope.navigationToModule}, $scope.navigationToEntityIds, 'workflow');
							// }

							const navService = $injector.get('platformModuleNavigationService');
							navService.navigate({moduleName: $scope.navigationToModule}, $scope.navigationToEntityIds, 'workflow');
						};
					}]
				};
			}]
	);
})(angular);