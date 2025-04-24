(function (angular) {
	'use strict';

	const moduleName = 'platform';
	const directiveName = 'platformInfoFormControl';

	angular.module(moduleName).directive(directiveName, ['platformTranslateService', function (translateService) {
		return {
			restrict: 'A',
			template: //background-color: aliceblue;
				'<div style="padding: 5px;border: solid #eee 1px;background-color: aliceblue;" data-ng-class="options.cssClass" data-ng-style="options.style" data-ng-bind-html="options.info"></div>',
			scope: {
				options: '=',
				ngModel: '='
			},
			require: '^ngModel',
			link: function (scope /*, element, attrs */) {
				translateService.translateObject(scope.options, ['info']);
				// if (scope.options.checkIsValid && scope.ngModel && scope.ngModel.isValid) {
				// 	console.log ('Certificate '+scope.ngModel.thumbPrint+' is valid');
				// }
			}
		};
	}]);
})(angular);
