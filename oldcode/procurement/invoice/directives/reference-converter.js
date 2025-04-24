
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	angular.module('procurement.invoice').directive('invoiceReferenceConverter', converter);

	converter.$inject = ['_'];

	function converter(_) {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function (scope, elem, attrs, ctrl) {
				ctrl.$formatters.unshift(function (modelValue) {
					return modelValue;
				});

				function tranInput(newValue){
					// eslint-disable-next-line no-useless-escape
					var regex = new RegExp('^([ÄäÖöÜüß]|[a-z]|[A-Z]|[0-9]|_|\w){0,42}$');
					var arrChar=[];
					_.forEach(newValue,function(item){
						var flg=regex.test(item);
						if(flg) {
							if ('ß' !== item) {
								item=item.toUpperCase();
							}
							arrChar.push(item);
						}
					});
					var trans=arrChar.join('');
					return trans;
				}

				ctrl.$parsers.push(function (viewValue) {
					if(viewValue) {
						if(_.isString(viewValue)) {
							var trans=tranInput(viewValue);
							if(trans !== viewValue) {
								ctrl.$setViewValue(trans);
								ctrl.$render();
							}

							return trans;
						}

						return viewValue;
					}

					return '';
				});
			}
		};
	}
})(angular);