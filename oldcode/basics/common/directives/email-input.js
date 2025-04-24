(function (angular) {
	'use strict';

	const moduleName = 'basics.common';

	/**
	 * @ngdoc directive
	 * @name basicsCommonEmailInput:
	 * @element div
	 * @restrict A
	 * @description Editor for email
	 */
	angular.module(moduleName).directive('basicsCommonEmailInput',
		['$window', '_', 'platformRuntimeDataService', '$injector', 'basicsEmailValidationFactory', '$timeout', '$compile', 'platformDomainControlService',
			function ($window, _, platformRuntimeDataService, $injector, basicsEmailValidationFactory, $timeout, $compile, platformDomainControlService) {
				function linkFn($scope, $element, attrs) {
					$scope.mailTo = function () {
						$window.location.href = 'mailto:' + getItemText();
					};

					$scope.parent = getParent();
					$scope.DisplayEmail = '';

					function getParent() {
						let parentScope = $scope.$parent;
						while (parentScope) {
							const entity = parentScope.entity;
							if (angular.isDefined(entity)) {
								break;
							}
							parentScope = $scope.$parent;
						}

						return parentScope;
					}

					$scope.getClass = function () {
						const isCellEditor = !!$scope.config;

						if (isCellEditor) {
							return 'form-control';
						} else {
							return 'grid-container';
						}
					};

					$scope.isForm = function isForm() {
						return !!$scope.config;
					};

					if (attrs.dirty) {
						attrs.change = 'parent.' + attrs.config + '.rt$change()';
					}

					if ($scope.config) {
						if ($scope.config.change) {
							attrs.ngModelOptions = null;
							attrs.change = 'parent.' + attrs.config + '.rt$change()';
						}

						// lookup of readonly in __rt$data in form; provided by row definition in form-content
						if ($scope.$eval('parent.' + attrs.config + '.rt$readonly')) {
							attrs.readonly = attrs.readonly && $scope.$eval(attrs.readonly) ? attrs.readonly : 'parent.' + attrs.config + '.rt$readonly()';
						}
					}

					function getItemText() {
						let ret = '';
						if (!$scope.parent) {
							return ret;
						}
						if ($scope.config && $scope.config.lookupDisplayColumn) {
							const model = $scope.config.model;
							ret = $scope.parent.entity && $scope.config.options.getItemText ? $scope.config.options.getItemText($scope.parent.entity[model]) : '';
						} else {
							if ($scope.parent.entity) {
								if (Object.prototype.hasOwnProperty.call($scope.parent.entity, $scope.field) === false) {
									$scope.parent.entity[$scope.field] = '';
								}
							}
							ret = $scope.parent.entity ? $scope.parent.entity[$scope.field] : '';
						}
						return ret;
					}

					function isLookupDisplayColumn() {
						return $scope.config && $scope.config.lookupDisplayColumn;
					}

					function getField() {
						let field = 'Email';
						if ($scope.config && $scope.config.model) {
							field = $scope.config.model;
						} else if ($scope.options && $scope.options.field) {
							field = $scope.options.field;
						}
						return field;
					}

					function isEmailValid(value) {
						const regex1 = /^[\s\S]{1,64}@[\s\S]{1,253}$/;
						const regex2 = /@[\s\S]*@/;
						return _.isNil(value) || _.isEmpty(value) || regex1.test(value) && !regex2.test(value);
					}

					function getDataService() {
						let dataService = null;
						let dataServiceName = null;
						if ($scope.config && $scope.config.dataServiceName) {
							dataServiceName = $scope.config.dataServiceName;
						} else if ($scope.config && $scope.config.getDataService) {
							dataService = $scope.config.getDataService();
						} else if ($scope.options && $scope.options.dataServiceName) {
							dataServiceName = $scope.options.dataServiceName;
						} else if ($scope.options && $scope.options.getDataService) {
							dataService = $scope.options.getDataService();
						}
						if (!dataService && dataServiceName) {
							dataService = $injector.get(dataServiceName);
						}

						return dataService;
					}

					$scope.lookupDisplayColumn = isLookupDisplayColumn();
					$scope.field = getField();

					$scope.isShowEmailButton = function () {
						const itemText = getItemText();
						return !!(itemText && itemText.length > 0 && isEmailValid(itemText));
					};

					const unwatch = null;
					if ($scope.lookupDisplayColumn) {
						$scope.$watch('parent.entity[field]', function (newValue, oldValue) {
							if (newValue !== oldValue) {
								if (newValue) {
									$scope.DisplayEmail = getItemText();
								} else {
									$scope.DisplayEmail = '';
								}
							}
						});
					}

					function getConfig() {
						return $scope.config || $scope.$parent.config;
					}

					$scope.dataService = getDataService();

					$scope.$on('$destroy', function () {
						if (unwatch) {
							unwatch();
						}
					});

					function init() {
						const config = getConfig();
						if (config && !config.validator && !config.asyncValidator) {

							if ($scope.dataService && !config.validator && !config.asyncValidator) {
								config.validator = basicsEmailValidationFactory.getService($scope.dataService, $scope.field)['validate' + $scope.field];
							}
						}
					}

					init();

					let attrList;

					if (!$scope.lookupDisplayColumn) {
						attrList = [
							'data-ng-model="parent.' + (attrs.ngModel) + '"',
							'data-ng-model-options="isForm() ? { updateOn: \'default blur\', debounce:{default: 2000, blur: 0}}: { updateOn: \'default blur\'}"',
							'data-entity="parent.entity"',
							!attrs.readonly ? '' : ' data-ng-readonly="' + attrs.readonly + '"',
							!attrs.enterstop ? '' : ' data-enterstop="' + attrs.enterstop + '"',
							!attrs.tabstop ? '' : ' data-tabstop="' + attrs.tabstop + '"',
							!attrs.domain ? '' : ' data-domain="' + attrs.domain + '"',
							!attrs.config ? '' : ' data-config="parent.' + attrs.config + '"',
							!attrs.change ? '' : ' data-ng-change="' + attrs.change + '"',
							!attrs.placeholder ? '' : ' placeholder="' + attrs.placeholder + '"',
							$scope.options.validKeys && $scope.options.validKeys.regular ? ' data-ng-pattern-restrict="' + $scope.options.validKeys.regular + '"' : '',
							$scope.options.validKeys && angular.isFunction($scope.options.validKeys.onBlur) ? ' data-ng-blur="onBlur($event)"' : '',
							$scope.isForm() ? ' data-platform-control-validation' : platformDomainControlService.gridInputKeyHandlerMarkup(attrs.domain)
						].join(' ');
					} else {
						attrList = [
							'data-ng-model="DisplayEmail"',
							'data-entity="parent.entity"',
							' data-ng-readonly="true"',
							!attrs.enterstop ? '' : ' data-enterstop="' + attrs.enterstop + '"',
							!attrs.tabstop ? '' : ' data-tabstop="' + attrs.tabstop + '"',
							!attrs.domain ? '' : ' data-domain="' + attrs.domain + '"'
						].join(' ');
					}

					let template = '<input type="text" class="@@cssclass@@" @@readonly@@ ' + attrList + '>';
					template = template
						.replace('@@cssclass@@', (!attrs.domain ? '' : 'domain-type-' + attrs.domain + ' ') + (attrs.cssclass || 'form-control'))
						.replace(/@@readonly@@/g, platformDomainControlService.readonlyMarkup(attrs.domain, attrs));

					const spanList = [
						'<span class="input-group-btn">',
						'<button class="btn btn-default control-icons ico-mail-noicon-1" data-ng-click="mailTo()" data-ng-show="isShowEmailButton()"></button>',
						'</span>'
					].join(' ');

					let content = '<div class="input-group" ng-class="getClass()">' + template + spanList + '</div>';
					content = angular.element(content);
					$element.append($compile(content)($scope));
				}

				return {
					restrict: 'A',
					require: 'ngModel',
					scope: {
						options: '=',
						config: '='
					},
					replace: true,
					link: linkFn
				};

			}]);
})(angular);

