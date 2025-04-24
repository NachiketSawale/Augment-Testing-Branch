(()=> {
	'use strict';
	angular.module('basics.config').directive('basicsConfigOverflowInfoDirective', basicsConfigOverflowInfoDirective);

	basicsConfigOverflowInfoDirective.$inject = ['platformTranslateService'];

	function basicsConfigOverflowInfoDirective(platformTranslateService) {
		return {
			restrict: 'AE',
			templateUrl: globals.appBaseUrl + 'app/components/tooltip/tooltip-popup-template.html',
			scope: {
				options: '='
			},
			link: function(scope, elem) {
				loadTranslations(scope.options);

				function loadTranslations(fields) {
					// load translation ids and convert result to object
					platformTranslateService.translateObject(fields, undefined, {recursive: true});
				}
			}
		};
	}

})();
