(function (angular) {

	'use strict';
	/**
	 * @ngdoc directive
	 * @description This directive is used for special string input editor. It can put custom-made restriction.
	 */
	angular.module('basics.common').directive('basicsCommonLimitInput', ['$compile', 'globals',
		function ($compile, globals) {
			return {

				restrict: 'A',
				scope: false,

				link: function linker(scope, elem, attrs) { // jshint ignore:line
					let template;

					scope.path = globals.appBaseUrl;

					scope.options = scope.$eval(attrs.options);

					scope.cssclass = attrs.cssclass || 'form-control';

					const config = !attrs.config || scope.$eval(attrs.config);

					if (attrs.dirty) {
						attrs.change = attrs.config + '.rt$change()';
					}

					if (config) {
						if (config.change) {
							attrs.ngModelOptions = null;
							attrs.change = attrs.config + '.rt$change()';
						}

						// lookup of readonly in __rt$data in form; provided by row definition in form-content
						if (scope.$eval(attrs.config + '.rt$readonly')) {
							attrs.readonly = attrs.readonly && scope.$eval(attrs.readonly) ? attrs.readonly : attrs.config + '.rt$readonly()';
						}
					}

					const attrList = [
						'data-ng-model="' + (attrs.model || attrs.ngModel) + '"',
						!attrs.cssclass ? ' data-platform-control-validation' : '',
						!attrs.ngModelOptions ? '' : ' data-ng-model-options="' + attrs.ngModelOptions + '"',
						!attrs.readonly ? '' : ' data-ng-readonly="' + attrs.readonly + '"',
						!attrs.enterstop ? '' : ' data-enterstop="' + attrs.enterstop + '"',
						!attrs.tabstop ? '' : ' data-tabstop="' + attrs.tabstop + '"',
						!attrs.domain ? '' : ' data-domain="' + attrs.domain + '"',
						!attrs.config ? '' : ' data-config="' + attrs.config + '"',
						!attrs.change ? '' : ' data-ng-change="' + attrs.change + '"',
						!attrs.entity ? '' : ' data-entity="' + attrs.entity + '"',
						!attrs.placeholder ? '' : ' placeholder="' + attrs.placeholder + '"',
						scope.options.isCodeProperty ? ' data-platform-code-converter' : '',
						scope.options.isNumericProperty ? 'data-platform-numeric-converter' : '',
						scope.options.validKeys || scope.options.validKeys.regular ? ' data-ng-pattern-restrict="' + scope.options.validKeys.regular + '"' : '',
						scope.options.validKeys || angular.isFunction(scope.options.validKeys.onBlur) ? ' data-ng-blur="onBlur($event)"' : ''
					];

					template = '<input type="text" class="@@cssclass@@" ' + attrList.join('') + '>';

					template = template
						.replace('@@cssclass@@', (!attrs.domain ? '' : 'domain-type-' + attrs.domain + ' ') + (attrs.cssclass || 'form-control'));

					if (scope.options.validKeys || angular.isFunction(scope.options.validKeys.onBlur)) {
						const validKeys = scope.options.validKeys;
						scope.onChange = function () {
							scope.ngModel = validKeys.onBlur(scope.ngModel || '');
						};
					}

					const linkFn = $compile(template);
					const content = linkFn(scope);
					elem.replaceWith(content);
				}
			};
		}]);
})(angular);

