(function () {
	'use strict';

	function toolBarDirective($rootScope, config, service, basicsConfigNavCommandbarService, _) {
		var directive = {};

		directive.restrict = 'A';
		directive.templateUrl = config.templateUrl;
		directive.scope = true;
		directive.link = function (scope) {
			scope.$watch(function() {
				return basicsConfigNavCommandbarService.moduleConfigurations[$rootScope.currentModule];
			}, function() {
				let moduleConfig = basicsConfigNavCommandbarService.moduleConfigurations[$rootScope.currentModule];
				if(moduleConfig) {
					setupTools(moduleConfig.NavbarConfig);
				}
				else {
					setupTools();
				}
			}, true);

			function setupTools(configuredItems) {
				scope.tools = service.getTools(configuredItems);
				scope.optEnabled = showOptionMenu();
				// process for svg-tag
				scope.splitIcoCssClass = function (toSplit, index) {
					var css = _.isFunction(toSplit) ? toSplit().split(' ') : toSplit.split(' ');
					return css[index];
				};
			}

			function showOptionMenu() {
				return scope.tools.defaultOptionsActions.length > 0 || scope.tools.moduleOptionsActions.length > 0;
			}
		};

		return directive;
	}

	angular.module('platform').value('platformNavBarConfig', {templateUrl: window.location.pathname + '/app/components/toolbar/nav-bar-template.html'});
	angular.module('platform').directive('platformNavBarDirective', ['$rootScope', 'platformNavBarConfig', 'platformNavBarService', 'basicsConfigNavCommandbarService', '_', toolBarDirective]);
})();



