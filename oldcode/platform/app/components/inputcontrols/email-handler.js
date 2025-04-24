(function (angular) {
	'use strict';

	angular.module('platform').directive('platformEmailHandler', handler);

	handler.$inject = ['_'];

	function handler(_) {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function (scope, elem, attrs) {
				let inGrid = !_.isUndefined(attrs.grid);
				let config = (inGrid ? scope.config : (attrs.config ? scope.$eval(attrs.config) : null)) || {};
				let options = (inGrid ? scope.options : (attrs.options ? scope.$eval(attrs.options) : (config ? config.options : null))) || {};
				scope.btnClick = function (entity) {
					if(options.buttonFn){
						options.buttonFn(scope.$eval(entity));
					}
				};
			}
		};
	}
})(angular);