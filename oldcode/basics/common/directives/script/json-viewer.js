/**
 * Created by wui on 3/9/2018.
 */

/* global CodeMirror */
(function (angular, CodeMirror) {
	'use strict';

	var moduleName = 'basics.common';

	/* jshint -W040 */
	angular.module(moduleName).directive('basicsCommonJsonViewer', ['$timeout',
		function ($timeout) {
			return {
				restrict: 'A',
				controllerAs: 'ctrl',
				controller: ['$scope', '$element', controller],
				link: link
			};

			function controller($scope, $element) {
				var self = this;
				var defaults = {
					lineNumbers: false,
					autoCloseBrackets: true,
					matchBrackets: true,
					theme: 'default script',
					tabSize: 8,
					indentUnit: 8,
					indentWithTabs: true,
					mode: 'application/json',
					foldGutter: true,
					// gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
					readOnly: true,
					lineWrapping: true
				};

				self.cm = new CodeMirror($element[0], defaults);
			}

			function link(scope, element, attr) {
				var unwatchAction = scope.$watch(attr.text, function ngBindWatchAction(value) {
					if (angular.isString(value)) {
						scope.ctrl.cm.setValue(value);
					} else {
						scope.ctrl.cm.setValue('');
					}
					scope.ctrl.cm.refresh();
				});

				var cancelTimeout = $timeout(function () {
					scope.ctrl.cm.refresh();
					cancelTimeout = null;
				}, 1000);

				// ui destroy.
				scope.$on('$destroy', function () {
					unwatchAction();
					if (cancelTimeout) {
						$timeout.cancel(cancelTimeout);
					}
				});
			}
		}
	]);

})(angular, CodeMirror);