(function (angular) {
	'use strict';

	/**
	 * @ngdoc directive
	 * @name
	 * @element div
	 * @restrict A
	 * @description
	 * Header lookup.
	 */
	angular.module('scheduling.main').directive('schedulingLocationWizardDialogToolbar', ['$compile',
		function ($compile) {
			return {
				restrict: 'A',
				scope: {
					uuid: '&'
				},
				link: function (scope, elem) { // jshint ignore: line
					scope.getContainerUUID = function () {
						return scope.uuid;
					};

					scope.onContentResized = function () {
					};

					scope.setTools = function (tools) {
						scope.tools = tools;
					};

					var template = ['<div data-ng-controller="platformModalGridController" class="modal-wrapper">',
						'<div class="toolbar toolbar-icons">',
						'<div data-platform-menu-list data-list="tools" data-platform-refresh-on="tools.version"></div>',
						'</div>',
						'<platform-grid data="gridData"></platform-grid>',
						'</div>'
					].join('');

					var content = $compile(template)(scope);

					elem.replaceWith(content);

				}
			};
		}]);

})(angular);
