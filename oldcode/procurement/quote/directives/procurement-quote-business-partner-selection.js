(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	var moduleName = 'procurement.quote';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).directive('procurementQuoteBusinessPartnerSelection',
		['$rootScope', '$timeout', 'platformGridAPI', 'platformDataServiceFactory', 'platformGridControllerService', 'platformObjectHelper', 'procurementQuoteSelectionService',
			function ($rootScope, $timeout, platformGridAPI, platformDataServiceFactory, platformGridControllerService, platformObjectHelper, procurementQuoteSelectionService) {

				var defaultOption = {
					serviceName: 'procurementQuoteSelection',
					UUID: '9BBB088E62D549E7B125EFF6FC5A43D8',
					valueMember: 'Id',
					height: '200px'
				};

				return {
					restrict: 'A',
					require: 'ngModel',
					scope: {
						ngModel: '=',
						config: '='
					},
					templateUrl: 'app/components/base/grid-partial.html',
					link: function ($scope, $element) {
						$timeout(function () {
							$element.find('.platformgrid').css({height: $scope.option.height, border: '1px solid'});
							platformGridAPI.grids.resize($scope.gridId);
						}, 500);
					},
					controller: ['$scope', function ($scope) {
						var option = $scope.option = angular.extend({}, defaultOption, $scope.config && $scope.config.options);
						var uiService = getUiService(option.columns);
						var dataService = procurementQuoteSelectionService;
						$scope.removeToolByClass = angular.noop;
						initListController($scope, uiService, dataService, option);

						$scope.refresh = function refresh(reqData) {
							if (reqData instanceof Array) {
								_.forEach(reqData, function (item) {
									item.Selected = item.Selected ? item.Selected : false; // set default value
								});
								dataService.setList(reqData);
								platformGridAPI.columns.configuration($scope.gridId, option.columns);
							}
							platformGridAPI.items.data($scope.gridId, dataService.getList());
							platformGridAPI.grids.resize($scope.gridId);
						};

						dataService.rawDataLoaded.register($scope.refresh);
						$scope.$on('$destroy', function () {
							dataService.rawDataLoaded.unregister($scope.refresh);
							dataService.rawData = [];
						});

						$scope.refresh(dataService.rawData);

						platformGridAPI.events.register($scope.gridId, 'onHeaderCheckboxChanged', checkAll);
						$scope.$on('$destroy', function () {
							platformGridAPI.events.unregister($scope.gridId, 'onHeaderCheckboxChanged', checkAll);
						});

						function checkAll(event, args) {
							if (args.column.field === 'Selected') {
								$scope.$apply();
							}
						}
					}]
				};

				function initListController(scope, uiService, dataService, option) {
					scope.getContainerUUID = function () {
						return option.UUID;
					};
					scope.onContentResized = function () {
					};
					scope.setTools = function (tools) {
						scope.tools = tools || {};

						// avoid error in console of explorer.
						scope.tools.update = function () {
						};
					};

					platformGridControllerService.initListController(scope, uiService, dataService, {}, {skipPermissionCheck: option.skipPermissionCheck});

					// workaround to make sure the grid config in the dialog can be saved by default.
					if (angular.isUndefined(option.enableConfigSave) || option.enableConfigSave === true) {
						var grid = platformGridAPI.grids.element('id', option.UUID);
						grid.enableConfigSave = true;
					}

					return scope;
				}

				function getUiService(columns) {
					return {
						getStandardConfigForListView: function getStandardConfigForListView() {
							return {
								addValidationAutomatically: true,
								columns: columns
							};
						}
					};
				}
			}]);

})(angular);