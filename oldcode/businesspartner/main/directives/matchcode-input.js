/**
 * Created by chi on 3/10/2016.
 */
(function (angular) {

	'use strict';
	/**
	 * @ngdoc directive
	 * @description This directive is used for special string input editor. It can put custom-made restriction.
	 */
	angular.module('businesspartner.main').directive('businessPartnerMainMatchCodeInput', ['$compile', 'globals',
		function ($compile, globals) {
			return {

				restrict: 'A',
				require: '?ngModel',
				scope: false,

				link: function linker(scope, elem, attrs, ngModelController) { // jshint ignore:line

					scope.path = globals.appBaseUrl;

					scope.options = scope.$eval(attrs.options);

					scope.cssclass = attrs.cssclass || 'form-control';

					var config = !attrs.config || scope.$eval(attrs.config);

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

					var maxLen = !scope.options.maxLen ? 42 : scope.options.maxLen;
					if(scope.options.lookupOptions.maxLen)
					{
						maxLen=scope.options.lookupOptions.maxLen;
					}
					/** @namespace attrs.tabstop */
					/** @namespace attrs.enterstop */
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
						' data-platform-code-converter',
						' data-ng-pattern-restrict=' + '"^[\\s\\S]{0,' + maxLen + '}$"'
					];

					var template = '<input type="text" class="@@cssclass@@" ' + attrList.join('') + '>';
					template = template
						.replace('@@cssclass@@', 'domain-type-code ' + (attrs.cssclass || 'form-control'));

					var iElement = initializeElement(template);
					var linkFn = $compile(iElement);
					var content = linkFn(scope);
					elem.replaceWith(content);

					// ///////////////////////////
					function initializeElement(template) {
						var eventsBound = false;
						var regex = new RegExp('^([a-z]|[A-Z]|[0-9]|-| ){0,' + maxLen + '}$');// it can include 0-9, ' ', '-'
						var inputElement = angular.element(template);
						var oldValue = inputElement.val();
						bindListeners();

						scope.$on('$destroy', uninitialize);
						return inputElement;

						// /////////////////////////
						function bindListeners() {
							if (eventsBound) {
								return;
							}

							inputElement.bind('input keyup click', genericEventHandler);
						}

						//-------------------------------------------------------------------
						// event handlers
						function genericEventHandler(evt) {
							var newValue = inputElement.val();

							// HACK Chrome returns an empty string as value if user inputs a non-numeric string into a number type input
							// with this happening, we cannot rely on the value to validate the regex, we need to assume this to be wrong
							var inputValidity = inputElement.prop('validity');
							if (newValue === '' && inputElement.attr('type') === 'number' && inputValidity && inputValidity.badInput) {
								evt.preventDefault();
								revertToPreviousValue();
							} else if (regex.test(newValue)) {
								oldValue = newValue.toUpperCase();
							} else {
								evt.preventDefault();
								correctValue(newValue);
							}
						}

						function revertToPreviousValue() {
							if (ngModelController) {
								scope.$apply(function () {
									ngModelController.$setViewValue(oldValue);
								});
							}
							inputElement.val(oldValue);
						}

						function correctValue(newValue) {
							if (newValue.length > maxLen) {
								revertToPreviousValue();
								return;
							}

							// noinspection JSUnusedAssignment
							oldValue = newValue = newValue
								.replace(/[Ääà]/g, 'A')
								.replace(/[ç]/g, 'C')
								.replace(/[éèê]/g, 'E')
								.replace(/[î]/g, 'I')
								.replace(/[Öö]/g, 'O')
								.replace(/[ß]/g, 'S')
								.replace(/[Üüùû]/g, 'U')
								.replace(/[^A-Za-z0-9\- ]*/g, '');

							if (ngModelController) {
								scope.$apply(function () {
									ngModelController.$setViewValue(oldValue);
									ngModelController.$viewChangeListeners.push(function () {
										scope.$eval(attrs.change);
									});
								});
							}
							inputElement.val(oldValue);
						}

						function uninitialize() {
							unbindListeners();
						}

						function unbindListeners() {
							if (!eventsBound) {
								return;
							}

							inputElement.unbind('input', genericEventHandler);
							// input: HTML5 spec, changes in content

							inputElement.unbind('keyup', genericEventHandler);
							// keyup: DOM L3 spec, key released (possibly changing content)

							inputElement.unbind('click', genericEventHandler);
							// click: DOM L3 spec, mouse clicked and released (possibly changing content)

							eventsBound = false;
						}
					}
				}
			};
		}]);
})(angular);
