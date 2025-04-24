/**
 * @ngdoc directive
 * @name platform.directive:platformAlarmOverlay
 * @element div
 * @restrict A
 * @priority default value
 * @scope isolate scope
 * @description
 * Provide feedback messages for typical user actions with the standard info alert message.
 * Just set a text into info to display a message for 2 seconds. The directive requires any parent element with position: relative.
 * Inside of this element the message is displayed centered.
 *
 * @example
 * <div data-platform-alarm-overlay data-info="alarmbox.text" data-config="alarmbox.config"></div>
 */
(function (angular) {
	'use strict';

	angular.module('platform').directive('platformAlarmOverlay', ['$compile', '$timeout', 'platformTranslateService',
		function ($compile, $timeout, platformTranslateService) {
			return {
				restrict: 'A',
				scope: {
					info: '=',
					config: '='
				},
				link: function (scope, elem) {
					scope.show = false;

					function getText() {
						if (scope.config) {
							if (scope.config.info$tr$) {
								platformTranslateService.translateObject(scope.config, undefined, {recursive: false});
								return scope.config.info;
							} else if (scope.config.info) {
								return scope.config.info;
							}
						}

						return platformTranslateService.instant(scope.info, undefined, true);
					}

					var unbindWatch = scope.$watch('info',
						function (newText) {
							if (!_.isEmpty(newText)) {
								scope.message = getText();
								scope.show = true;
								$timeout(function () {
										scope.show = false;
										scope.info = undefined;
									}, 2000
								);
							}
						});

					var unbindWatchConfig = scope.$watch('config',
						function (newConfig) {
							if (_.isObject(newConfig)) {
								scope.message = getText();
								scope.show = true;
								$timeout(function () {
										scope.show = false;
										scope.config = undefined;
									}, 2000
								);
							}
						});

					scope.$on('$destroy', function () {
						unbindWatch();
						unbindWatchConfig();
					});

					var content = '<div data-ng-if="show" class="alarm-overlay" data-ng-class="config.cssClass"><div class="alert" role="alert" data-ng-bind="message"></div></div>';
					elem.replaceWith($compile(content)(scope));
				}
			};
		}]
	);
})(angular);
