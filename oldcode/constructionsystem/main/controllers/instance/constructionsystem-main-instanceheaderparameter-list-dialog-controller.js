/**
 * Created by chase on 9/9/2024.
 */
/* global _ */
(function (angular) {
	'use strict';

	var moduleName = 'constructionsystem.main';

	/**
	 * @ngdoc controller
	 * @name constructionSystemMainInstanceHeaderParameterListDialogController
	 * @requires $scope
	 * @description
	 * #
	 * Controller for constructionSystem main instance header parameter grid.
	 */
	angular.module(moduleName).controller('constructionSystemMainInstanceHeaderParameterListDialogController',
		['$scope', 'basicsCommonDialogGridControllerService', 'constructionSystemMainInstanceHeaderParameterUIConfigService',
			'constructionSystemMainInstanceHeaderParameterService', 'constructionSystemMainInstanceHeaderParameterValidationService',
			'$injector',
			function ($scope, platformGridDialogControllerService, uiConfigService, dataService, validationService, $injector) {

				$scope.saveGlobalParameters = saveGlobalParameters;
				$scope.parentGuid = '60c71b8ac0914eeaad2a2fe12de50451';
				$scope.setTools = function (tools) {
					tools.update = function () {
						tools.version += 1;
					};
					tools.refreshVersion = Math.random();
					tools.refresh = function () {
						tools.refreshVersion += 1;
					};
					// remove btn grouping, print, pin, copy/paste.
					_.remove(tools.items, function (item) {
						return ['t12', 't108', 't-addpinningdocument', 't199'].includes(item.id);
					});
					// remove btn 'Show Statusbar', 'autofitTableWidth'.
					var gridSetItem = _.find(tools.items, {id: 't200'});
					if (gridSetItem) {
						_.remove(gridSetItem.list.items, function (item) {
							return ['t155', 'autofitTableWidth'].includes(item.id);
						});
					}
					$scope.tools = tools;
				};
				$scope.removeToolByClass = function (cssClassArray) {
					$scope.tools.items = _.filter($scope.tools.items, function (toolItem) {
						var notFound = true;
						_.each(cssClassArray, function (CssClass) {
							if (CssClass === toolItem.iconClass) {
								notFound = false;
							}
						});
						return notFound;
					});
					$scope.tools.update();
				}

				platformGridDialogControllerService.initListController($scope, uiConfigService, dataService, validationService, {
					uuid: '962190ed40074f40a687064875cdccbc'
				});

				function saveGlobalParameters() {
					const instanceHeaderParameterService = $injector.get('constructionSystemMainInstanceHeaderParameterService');
					instanceHeaderParameterService.saveInstanceHeaderParameter();
					$scope.$close();
				}

			}
		]);

})(angular);
