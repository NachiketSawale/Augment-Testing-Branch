/**
 * Created by jim on 3/3/2017.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_,$ */
	var moduleName='procurement.ticketsystem';
	angular.module(moduleName).directive('procurementTicketSystemCartQuantityConverter',
		['platformLanguageService', 'accounting',
			function (platformLanguageService, accounting) {
				return {
					require: 'ngModel',
					restrict: 'A',
					scope: false,
					link: function ($scope, elem, attrs, ctrl) {

						var lang = platformLanguageService.getLanguageInfo();

						var options = {
							'thousand': lang.numeric.thousand,
							'decimal': lang.numeric.decimal,
							'precision': 2
						};

						var entity=$scope.$parent.entity;
						var uom='';
						if(entity.BasUomFk!==entity.BasUomPriceUnitFk){
							var UomInfo=entity.UomInfo;
							uom =  UomInfo.Translated?UomInfo.Translated:UomInfo.Description;
						}

						var inFocus = false;
						$(elem).focus(function () {
							inFocus = true;
							ctrl.$setViewValue(ctrl.$formatters[0](parseFloat(parseFloat(ctrl.$modelValue+'').toFixed(3))));
							ctrl.$render();
						});

						$(elem).blur(function () {
							inFocus = false;
							ctrl.$setViewValue(ctrl.$formatters[0](parseFloat(parseFloat(ctrl.$modelValue+'').toFixed(3))));
							ctrl.$render();
						});

						ctrl.$formatters.unshift(function (modelValue) {
							if (inFocus === true) {
								return parseFloat($scope.ngModel+'').toFixed(3);
							}
							var trans = !_.isNull(modelValue) && !_.isUndefined(modelValue) ? accounting.formatNumber(modelValue, options.precision, options.thousand, options.decimal) : '';
							trans += ' '+uom;

							return trans;
						});

						ctrl.$parsers.push(function (viewValue) {
							if (viewValue && _.isString(viewValue)) {
								viewValue = viewValue.replace(uom, '');
								var split = viewValue.replace(/,/g, options.decimal).replace(/\./g, options.decimal).split(options.decimal);
								var last = split.pop();

								viewValue = split.length ? split.join('').concat(options.decimal, last) : last;
								return accounting.unformat(viewValue, options.decimal);
							}
							return viewValue;
						});

						$scope.$on('$destroy', function () {
							$(elem).unbind('focus');
							$(elem).unbind('blur');
						});
					}
				};
			}]);

})(angular);


