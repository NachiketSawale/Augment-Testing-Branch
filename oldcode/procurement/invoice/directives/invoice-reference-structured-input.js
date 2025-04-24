(function (angular) {

	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	/**
     * @ngdoc directive
     * @description This directive is used for special string input editor. It can put custom-made restriction.
     */
	angular.module('procurement.invoice').directive('invoiceReferenceStructuredInput', ['$templateCache', '$compile',
		function ($templateCache, $compile) {
			return {
				restrict: 'A',
				require: '?ngModel',
				link: function (scope, elem, attrs, ngModelController) {

					if (attrs.dirty) {
						attrs.change = attrs.config + '.rt$change()';
					}
					var config = !attrs.config || scope.$eval(attrs.config);
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
						!attrs.placeholder ? '' : ' placeholder="' + attrs.placeholder + '"'
					];

					var template = '<input type="text" class="@@cssclass@@" ' + attrList.join('') + '>';
					template = template.replace('@@cssclass@@', 'domain-type-code ' + (attrs.cssclass || 'form-control'));

					var iElement = initializeElement(template);
					var linkFn = $compile(iElement);
					var content = linkFn(scope);
					elem.replaceWith(content);

					// ///////////////////////////
					function initializeElement(template) {
						var eventsBound = false;
						// eslint-disable-next-line no-useless-escape
						var regex = new RegExp('^([+*/]|[a-z]|[A-Z]|[0-9]|_|\w){0,250}$');
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
							} else{
								if (newValue.length > 250) {
									revertToPreviousValue();
									return;
								}
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
								oldValue=newValue=arrChar.join('');
								if (ngModelController) {
									scope.$apply(function () {
										ngModelController.$setViewValue(newValue);
									});
								}
								inputElement.val(newValue);
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