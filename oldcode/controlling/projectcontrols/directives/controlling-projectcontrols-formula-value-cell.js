(function (angular) {
	'use strict';

	var moduleName = 'controlling.projectcontrols';

	/**
	 * @ngdoc directive
	 * @name controllingProjectcontrolsFormulaValueCell
	 * @description
	 */
	angular.module(moduleName).directive('controllingProjectcontrolsFormulaValueCell', [
		'$q', '$timeout', '$compile', '$templateCache', 'keyCodes',
		'platformTranslateService', 'platformGridAPI', 'platformDomainService', 'platformDomainControlService',
		'controllingProjectcontrolsFormulaValuePopupService', '_', '$',
		function (
			$q, $timeout, $compile, $templateCache, keyCodes,
			platformTranslateService, platformGridAPI, platformDomainService, platformDomainControlService,
			popupService, _, $) {

			return {
				restrict: 'A',
				require: 'ngModel',
				link: function (scope, elem, attrs) {
					var inGrid = !_.isUndefined(attrs.grid);
					var config = (inGrid ? scope.config : (attrs.config ? scope.$eval(attrs.config) : null)) || {};
					var options = (inGrid ? scope.options : (attrs.options ? scope.$eval(attrs.options) : (config ? config.options : null))) || {};
					var domain = _.assign({}, platformDomainService.loadDomain(options.inputDomain || config.inputDomain || attrs.domain) || {});

					if (!inGrid) {
						if (!attrs.change) {
							// change tracking on entity
							if (attrs.dirty || config.change) {
								attrs.change = attrs.config + '.rt$change()';
							}
						}
						// create binding when used outside of grid, in grid readonly is handled in slickgrid internally
						if (config.readonly) {
							attrs.readonly = 'true';
						} else {
							// lookup of readonly in __rt$data in form; provided by row definition in form-content
							if (scope.$eval(attrs.config + '.rt$readonly')) {
								attrs.readonly = attrs.readonly && scope.$eval(attrs.readonly) ? attrs.readonly : attrs.config + '.rt$readonly()';
							}
						}

						if (config.placeholder && !attrs.placeholder) {
							attrs.placeholder = _.isFunction(config.placeholder) ? ('{{' + attrs.config + '.rt$placeholder()}}') : config.placeholder;
						}

						if (config.autofocus) {
							attrs.autofocus = config.autofocus;
						}
					}
					var field = scope.field;
					var attrList = [
						'data-ng-model="' + (attrs.model || attrs.ngModel) + (!inGrid ? '.Translated' : '') + '"',
						!inGrid ? ' data-platform-control-validation' : platformDomainControlService.gridInputKeyHandlerMarkup(attrs.domain),
						!attrs.ngModelOptions ? '' : ' data-ng-model-options="' + attrs.ngModelOptions + '"',
						!domain.regex ? '' : ' data-ng-pattern-restrict="' + domain.regex + '"',
						!domain.mandatory ? '' : ' required',
						!attrs.readonly ? '' : platformDomainControlService.readonlyMarkup(attrs.domain, attrs),
						!attrs.change ? '' : ' data-ng-change="' + attrs.change + '"',
						!attrs.enterstop ? '' : ' data-enterstop="' + attrs.enterstop + '"',
						!attrs.tabstop ? '' : ' data-tabstop="' + attrs.tabstop + '"',
						!attrs.domain ? '' : ' data-domain="' + (options.inputDomain || config.inputDomain || attrs.domain) + '"',
						!attrs.config ? '' : ' data-config="' + attrs.config + '"',
						!attrs.options ? '' : ' data-options="' + attrs.options + '"',
						!attrs.entity ? '' : ' data-entity="' + attrs.entity + '"',
						!attrs.placeholder ? '' : ' placeholder="' + attrs.placeholder + '"',
						_.isUndefined(attrs.autofocus) ? '' : (attrs.autofocus === '' ? ' autofocus' : ' data-autofocus="' + attrs.autofocus + '"'),
						!attrs.style ? '' : ' style="' + attrs.style + '"',
						!attrs.id ? '' : ' id="' + attrs.id + '"',
						!attrs.grid ? '' : ' data-grid="' + attrs.grid + '"',
						!config.tooltip ? '' : ' title="' + config.tooltip + '"',
						!field ? '' : ' data-field="' + field + '"',
						scope.options.validKeys || scope.options.validKeys.regular ? ' data-ng-pattern-restrict="' + scope.options.validKeys.regular + '"' : '',
						scope.options.validKeys || angular.isFunction(scope.options.validKeys.onBlur) ? ' data-ng-blur="onBlur($event)"' : '',
						scope.options.validKeys || angular.isFunction(scope.options.validKeys.onKeyup) ? ' data-ng-keyup="onKeyup($event)"' : ''
					];

					if (scope.options.validKeys || angular.isFunction(scope.options.validKeys.onBlur)) {
						var validKeys = scope.options.validKeys;
						scope.onChange = function () {
							scope.ngModel = validKeys.onBlur(scope.ngModel || '');
						};
					}

					var cssList = [
						'domain-type-' + attrs.domain,
						!config ? '' : inGrid ? ' grid-control' : ' form-control',
						!attrs.class ? '' : ' ' + attrs.class
					];

					var buttonAttributes = [
						!attrs.readonly ? '' : ' data-ng-disabled="' + attrs.readonly + '"'
					];
					var buttonClickParams = [
						'\'' + field + '\'', // jshint ignore:line
						'\'' + (!attrs.readonly ? '' : attrs.readonly) + '\'' // jshint ignore:line
					];
					var template = $templateCache.get('basics-common-translate-cell.html')
						.replace(/@@attributes@@/g, attrList.join(''))
						.replace(/@@cssclass@@/g, cssList.join(''))
						.replace(/@@buttonAttributes@@/, buttonAttributes.join(''))
						.replace(/@@buttonClickParams@@/g, buttonClickParams.join(','));

					var content = $compile(template)(scope);

					elem.replaceWith(content);
				},
				controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
					var isGrid = $attrs.grid;
					var field;
					if (isGrid) {
						if (_.isObject($scope.config) && _.isString($scope.config.field)) {
							field = $scope.config.field;
						}
					} else {
						if ($attrs.config) {
							var config = $scope.$eval($attrs.config);
							if (_.isString(config.model)) {
								field = config.model;
							}
						}
					}
					$scope.field = field;

					$scope.open = function (event, field, readOnly) {
						var element = event.currentTarget;
						while (!element.classList.contains('input-group')) {
							element = element.parentElement;
						}
						$scope.field = field;
						$scope.readOnly = readOnly;
						/**
						 * @ngdoc function
						 * @name focusOnElement
						 * @function
						 * @methodOf $scope
						 * @description Set focus on input element when user has pressed escape key on element.
						 */
						$scope.focusOnElement = function () {
							$(element).children('input').focus();
						};
						var popup = popupService.openPopup(element, $scope);
						popup.closed.then(function () {
						});
					};

					$scope.onKeyDown = function (event, field, readOnly) {
						var prevent = function () {
							event.preventDefault();
							event.stopPropagation();
						};

						switch (event.keyCode) {
							case keyCodes.DOWN: {
								prevent();
								$scope.open(event, field, readOnly);
								break;
							}
							case keyCodes.ESCAPE: {
								popupService.closePopup();
								break;
							}
						}
					};

					$scope.hasEntity = function () {
						return !$scope.entity;
					};

					$scope.$on('$destroy', function () {
						popupService.closePopup();
					}
					);
				}]
			};
		}
	]);
})(angular);