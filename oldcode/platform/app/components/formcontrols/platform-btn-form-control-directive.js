(function (angular) {
	'use strict';

	var modulename = 'platform';
	var directiveName = 'platformBtnFormControl';

	angular.module(modulename).directive(directiveName, ['platformTranslateService', function (translateService) {
		return {
			restrict: 'A',
			template: '<button class="btn btn-default" data-ng-class="options.cssClass" data-ng-click="options.fnc($event)" data-ng-bind="options.caption"></button>',
			scope: {
				options: '<'
			},
			link: function (scope, element, attrs) {
				translateService.translateObject(scope.options, ['caption']);
			}
		};
	}]);
})(angular);
