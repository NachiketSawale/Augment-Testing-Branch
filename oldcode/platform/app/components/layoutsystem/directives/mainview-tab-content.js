/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	tabContentDirective.$inject = ['$templateRequest', 'mainViewService', '_'];

	function tabContentDirective($templateRequest, mainViewService) {
		var directive = {};
		directive.restrict = 'A';
		directive.priority = 400;
		directive.terminal = true;
		directive.transclude = 'element';
		directive.controller = angular.noop;
		directive.compile = function () {
			return function (scope, ele, attr, ctrl, $transclude) {
				var currentScope,
					currentEle,
					previousEle;

				function cleanUpLastView() {
					if (previousEle) {
						previousEle.remove();
						previousEle = null;
					}
					if (currentScope) {
						currentScope.$destroy();
						currentScope = null;
					}
					if (currentEle) {
						previousEle = currentEle;
						currentEle.remove();
						currentEle = null;
					}
				}

				function updateContent() {
					cleanUpLastView();
					var tmpUrl = mainViewService.getTabContent();

					$templateRequest(tmpUrl, true)
						.then(function (response) {
							ctrl.template = response;
							currentEle = $transclude(scope, function (clone) {
								ele.after(clone);
								cleanUpLastView();
							});
						});
				}

				var unregister = [];

				unregister.push(mainViewService.registerListener('onTabChanged', updateContent));

				unregister.push(scope.$on('$destroy', function () {
					cleanUpLastView();

					_.over(unregister)();
					unregister = null;
				}));

				setTimeout(function () {
					updateContent();
				}, 0);
			};
		};

		return directive;
	}

	tabContentDirectiveFiller.$inject = ['$compile'];

	function tabContentDirectiveFiller($compile) {
		var directive = {};
		directive.restrict = 'A';
		directive.priority = -400;
		directive.require = 'mainviewContent';
		directive.link = function (scope, ele, attr, ctrl) {
			ele.html(ctrl.template);
			var linker = $compile(ele.contents());
			linker(scope);
		};

		return directive;
	}

	angular.module('platform').directive('mainviewContent', tabContentDirective);
	angular.module('platform').directive('mainviewContent', tabContentDirectiveFiller);

})(angular);
