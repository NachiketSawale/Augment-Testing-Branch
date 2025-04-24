angular.module('platform').directive('sidebarEnvironmentExpression', ['_', '$injector', '$templateCache', '$compile', 'mainViewService',
	function (_, $injector, $templateCache, $compile, mainViewService) {
		'use strict';

		return {
			priority: 10,
			link: link, restrict: 'A',
			scope: true
			// templateUrl: globals.appBaseUrl + 'cloud.desktop/templates/sidebar/sidebar-environment-expression-template.html'
		};

		function link($scope, element, attr) {
			var environmentExpUuid = 'b65869ac92be4f45990495508754f903';

			$scope.options = $scope.$eval(attr.options);

			$scope.environmentExpressions = $scope.options.items;

			$scope.getEnvironmentModel = function getEnvironmentModel() {
				return $scope.$eval(attr.model);
			};

			$scope.$watch(attr.items, function () {
				$scope.environmentExpressions = $scope.options.items;
				retrieveSavedEnvironmentExpressions();
			});

			// #123504 code added to support editing +/-X Weeks

			// region EditMode

			$scope.$on('$stateChangeSuccess', function (e, toState, toParams, fromState, fromParams) {
				if (!toState.isDesktop) {
					if ((toParams.tab !== fromParams.tab) && (toState.name !== fromState.name)) {
						retrieveSavedEnvironmentExpressions();
					}
				}
			});

			function retrieveSavedEnvironmentExpressions() {
				if (!$scope.options.editMode) {
					return;
				}
				if ($scope.environmentExpressions) {
					let customWeeks = mainViewService.getModuleConfig(environmentExpUuid);
					let weekEnvExpItem = $scope.environmentExpressions.find(item => item.Name.startsWith('+/-'));
					if (customWeeks && customWeeks.Propertyconfig && customWeeks.Propertyconfig.weeks && weekEnvExpItem) {
						// only replace number within string
						weekEnvExpItem.Name = replaceNumber(weekEnvExpItem.Name, customWeeks.Propertyconfig.weeks);
						weekEnvExpItem.Parameters = [customWeeks.Propertyconfig.weeks];
					}
				}
			}

			$scope.onSettingsClick = function (event, item) {
				item.value = parseInt(item.Name.split(' ')[1]);
				item.showInput = true;
				event.stopPropagation();
			};

			$scope.onInputClick = function (event) {
				event.stopPropagation();
			};

			$scope.onCancel = function (event, item) {
				item.showInput = false;
				event.stopPropagation();
			};

			$scope.onSave = function (item) {
				saveWeekValue(item);
			};

			$scope.onKeyDown = function (event, item) {
				if (event.keyCode === 13) {
					saveWeekValue(item);
					$scope.options.onSelect(item);
				} else if (event.keyCode === 27) {
					cancelEditWeekValue(item);
				}
			};

			function saveWeekValue(item) {
				// only replace number within string
				item.Name = replaceNumber(item.Name, item.value);
				item.Parameters = [item.value];
				item.showInput = false;
				mainViewService.setModuleConfig(environmentExpUuid, {weeks: item.value});
			}

			function cancelEditWeekValue(item) {
				item.showInput = false;
			}

			function replaceNumber(originalName, number) {
				return originalName.replace(/[0-9]+/g, number);
			}

			// endregion

			$templateCache.loadTemplateFile(globals.appBaseUrl + 'cloud.desktop/templates/sidebar/sidebar-environment-expression-template.html').then(function () {
				var content = $templateCache.get('sidebar-environment-variables');
				element.append($compile(content)($scope));
			});

		}
	}
]);