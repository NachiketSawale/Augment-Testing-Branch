(function (angular) {
	'use strict';

	angular.module('platform').directive('platformUnitConverter', converter);

	converter.$inject = ['platformDomainService', 'platformLanguageService', 'accounting', '_', 'math', 'basicsCommonUnitFormatterService'];

	function converter(platformDomainService, platformLanguageService, accounting, _, math, basicsCommonUnitFormatterService) {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function (scope, elem, attrs, ctrl) {
				var editedField = attrs.ngModel.replace('entity.', '');
				var definition = !_.isUndefined(scope.config) ? scope.config : {
					domain: attrs.domain,
					field: editedField,
					uom: parseInt(attrs.uom),
					fraction: (attrs.fraction ? attrs.fraction === 'true' : false)
				};
				var domainInfo = platformDomainService.loadDomain(definition.domain);

				// manipulate attributes eg. regex etc.
				if (definition.uom && domainInfo.regexFraction && domainInfo.regexDecimal) {
					attrs.ngPatternRestrict = definition.fraction ? domainInfo.regexFraction : domainInfo.regexDecimal;
				} else {
					attrs.ngPatternRestrict = definition.regex;
				}
				elem.attr('data-ng-pattern-restrict', attrs.ngPatternRestrict);

				// remove angular's default formatter
				ctrl.$formatters.pop();

				ctrl.$formatters.push(function (modelValue) {
					if (!_.isNull(modelValue) && !_.isUndefined(modelValue)) {
						return basicsCommonUnitFormatterService.uomBranch(modelValue, definition, scope.entity);
					}
					return '';
				});

				ctrl.$parsers.push(function (viewValue) {
					if (viewValue && _.isString(viewValue)) {
						return basicsCommonUnitFormatterService.uomParseBranch(viewValue, definition, scope.entity);
					}
					return viewValue;
				});
			}
		};
	}
})(angular);