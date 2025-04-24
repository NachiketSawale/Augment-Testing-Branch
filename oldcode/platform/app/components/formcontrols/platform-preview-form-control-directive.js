(function (angular) {
	'use strict';

	var modulename = 'platform';
	var directiveName = 'platformPreviewFormControl';

	angular.module(modulename).directive(directiveName, ['$compile', 'platformTranslateService', function ($compile, translateService) {  // jshint ignore:line
		return {
			restrict: 'A',
			scope: false,
			link: function (scope, elem, attrs) {    // jshint ignore:line
				var template = '<div style="padding: 5px;border: solid #eee 1px;background-color: bisque;" data-ng-class="options.cssClass" data-ng-bind-html="@@preview@@"></div>';
				if (attrs.model) {
					template = template.replace(/@@preview@@/g, attrs.model);
				}
				var content = $compile(template)(scope);
				elem.replaceWith(content);
			}
		};
	}]);
})(angular);
