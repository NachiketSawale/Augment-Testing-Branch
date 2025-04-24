(function (angular) {

	'use strict';
	/**
     * @ngdoc directive
     * @description This directive is used for special string input editor. It can put custom-made restriction.
     */
	var moduleName = 'basics.procurementstructure';
	angular.module(moduleName).directive('eventLimitInput', ['$compile', 'globals',
		function ($compile, globals) {
			return {

				restrict: 'A',
				scope: false,

				link: function linker (scope, elem, attrs) { // jshint ignore:line
					var template = null;

					scope.path = globals.appBaseUrl;

					scope.options = scope.$eval(attrs.options);

					scope.cssclass = attrs.cssclass || 'form-control';

					var config = !attrs.config || scope.$eval(attrs.config);

					if(attrs.dirty) {
						attrs.change = attrs.config + '.rt$change()';
					}

					if(config) {
						if (config.change) {
							attrs.ngModelOptions = null;
							attrs.change = attrs.config + '.rt$change()';
						}

						// lookup of readonly in __rt$data in form; provided by row definition in form-content
						if (scope.$eval(attrs.config + '.rt$readonly')) {
							attrs.readonly = attrs.readonly && scope.$eval(attrs.readonly) ? attrs.readonly : attrs.config + '.rt$readonly()';
						}
					}

					var attrList = [
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
						scope.options.isCodeProperty ? ' data-event-code-converter' : '',
						scope.options.validKeys || scope.options.validKeys.regular ? ' data-ng-pattern-restrict="' + scope.options.validKeys.regular + '"' : '',
						scope.options.validKeys || angular.isFunction( scope.options.validKeys.onBlur) ? ' data-ng-blur="onBlur($event)"' : ''
					];

					if (attrs.cssclass){
						template = '<input type="text" class="@@cssclass@@" ' + attrList.join('') + '>';
					} else {
						template = '<div class="platform-form-col"><input type="text" class="@@cssclass@@" ' + attrList.join('') + '></div>';
					}

					template = template
						.replace('@@cssclass@@', (!attrs.domain ? '' : 'domain-type-' + attrs.domain + ' ') + (attrs.cssclass || 'form-control'));

					if (scope.options.validKeys || angular.isFunction(scope.options.validKeys.onBlur)) {
						var validKeys = scope.options.validKeys;
						scope.onChange = function(){
							scope.ngModel = validKeys.onBlur(scope.ngModel || '');
						};
					}

					var linkFn = $compile(template);
					var content = linkFn(scope);
					elem.replaceWith(content);
				}
			};
		}]);
})(angular);
