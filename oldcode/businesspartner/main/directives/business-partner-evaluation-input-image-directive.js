/**
 * input-image directive, including input value and image.
 */

(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,$ */

	angular.module('businesspartner.main').directive('businessPartnerEvaluationInputImageDirective', ['$compile',
		function ($compile) {

			return {
				restrict: 'A',
				scope: {},
				link: linker
			};

			function linker(scope, element, attrs) {
				var options = scope.$parent.$eval(attrs.options),
					// icon = options.displayIcon ? ('data-ng-src="{{$parent.entity.' + options.displayIcon + '}}"') : '',
					entityValue = options.displayValue ? ('data-ng-model="$parent.entity.' + options.displayValue + '"') : '',
					template = $('<input type="text" class="text-right form-control lg-4 md-4 ng-pristine ng-valid ng-scope ng-touched" data-platform-numeric-converter="" ' + entityValue + ' data-platform-control-validation="" readonly="" data-ng-change="groups[0].rows[5].rt$change()" data-enterstop="true" data-tabstop="true" data-domain="percent" data-config="groups[0].rows[5]" data-entity="entity"><img class="sg-8 sd-8" style="width:20px;padding:5px 0;margin-left:5px;">');

				scope.$watch('$parent.entity.' + options.displayIcon, function () {
					if (!scope.$parent.entity || !scope.$parent.entity[options.displayIcon] || scope.$parent.entity[options.displayIcon] === '') {
						template[1].src = '';
						template[1].style.display = 'none';
					} else {
						template[1].style.display = '';
						template[1].src = scope.$parent.entity[options.displayIcon] || '';
					}
				});

				$compile(template.appendTo(element))(scope);
			}
		}]);

})(angular);