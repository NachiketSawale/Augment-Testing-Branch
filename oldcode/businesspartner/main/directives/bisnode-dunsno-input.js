(function (angular) {

	'use strict';
	let moduleName = 'businesspartner.main';
	angular.module(moduleName).directive('bisnodeDunsnoInput', [
		'$window',
		'$translate',
		'$http',
		'globals',
		'_',
		'platformRuntimeDataService',
		'$injector',
		'platformDomainControlService',
		'$compile',
		function (
			$window,
			$translate,
			$http,
			globals,
			_,
			platformRuntimeDataService,
			$injector,
			platformDomainControlService,
			$compile) {
			let baseUrl = 'https://www.bisnode.de/upik/?search=[businesspartnername]&comid=[comid]&country=[addressdto_countryiso2]&address=[addressdto_street]&city=[addressdto_city]';
			let showDomainUrlButton = false;
			$http.get(globals.webApiBaseUrl + 'businesspartner/main/businesspartner/getbunsnoexternalconfig').then(function (item) {
				if (item?.data?.Url) {
					showDomainUrlButton = true;
					baseUrl = item.data.Url;
				} else {
					showDomainUrlButton = false;
					baseUrl = '';
				}
			});

			return {
				restrict: 'A',
				require: 'ngModel',
				scope: {
					options: '=',
					config: '='
				},
				replace: true,
				link:
					function ($scope, $element, attrs) {
						$scope.parent = getParent();
						$scope.showDomainUrlButton = showDomainUrlButton;
						$scope.bisnodeDunsNo = function () {
							let searchUrl = getSearchPart(baseUrl);
							if (!_.isEmpty(searchUrl)) {
								$window.open(searchUrl);
							}
						};

						$scope.onChange = function (dunsNo) {
							$scope.ngModel = dunsNo;
						};

						$scope.getClass = function () {
							return $scope.config ? 'form-control' : 'grid-container';
						};

						$scope.lookupDisplayColumn = isLookupDisplayColumn();

						function isLookupDisplayColumn() {
							return !!($scope.config?.lookupDisplayColumn);
						}

						$scope.isShowDomainUrlButton = function () {
							return showDomainUrlButton;
						};

						$scope.isForm = isForm;
						$scope.field = getFieldName();

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

						let subsidiary = 'SubsidiaryDescriptor';
						let specialCase = {
							businesspartnername: function (entity) {
								let name = getField(entity.BusinessPartnerName1) +
									getField(entity.BusinessPartnerName2) + getField(entity.BusinessPartnerName3) + getField(entity.BusinessPartnerName4);
								return name.trim();
							}
						};

						let attrList = [];
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
								$scope.options.validKeys?.regular ? ' data-ng-pattern-restrict="' + $scope.options.validKeys.regular + '"' : '',
								$scope.options.validKeys && angular.isFunction($scope.options.validKeys.onBlur) ? ' data-ng-blur="onBlur($event)"' : '',
								$scope.isForm() ? ' data-platform-control-validation' : platformDomainControlService.gridInputKeyHandlerMarkup(attrs.domain)
							].join(' ');
						}

						let template = '<input type="text" class="@@cssclass@@" @@readonly@@ ' + attrList + '>';
						template = template
							.replace('@@cssclass@@', (!attrs.domain ? '' : 'domain-type-' + attrs.domain + ' ') + (attrs.cssclass || 'form-control'))
							.replace(/@@readonly@@/g, platformDomainControlService.readonlyMarkup(attrs.domain, attrs));

						const spanList = [
							'<span class="input-group-btn">',
							'<button class="btn btn-default control-icons ico-domain-url" data-ng-click="bisnodeDunsNo()" title="Bisnode D-U-N-S query" data-ng-disabled="' + attrs.readonly + '" data-ng-show="isShowDomainUrlButton()"></button>',
							'</span>'
						].join(' ');

						let content = '<div class="input-group" ng-class="getClass()">' + template + spanList + '</div>';
						content = angular.element(content);
						$element.append($compile(content)($scope));

						function getSearchPart(currBaseUrl) {
							let resultUrl = currBaseUrl;
							let matchPartObj = null;
							let regExp = /\[(.+?)\]/g;
							let value = '';
							if ($scope.parent.entity) {
								/* jshint -W084 */
								matchPartObj = regExp.exec(currBaseUrl);
								while (matchPartObj) {
									let matchPart = matchPartObj[1];
									let hasNotUnderline = matchPart.indexOf('_') < 0;
									if (hasNotUnderline) {
										if (specialCase[matchPart]) {
											value = specialCase[matchPart]($scope.parent.entity);
										} else {
											value = getValueIgnoreCase($scope.parent.entity, [matchPart], 0);
										}
									} else {
										let splitStr = _.split(matchPart, '_');
										value = getValueIgnoreCase($scope.parent.entity[subsidiary], splitStr, 0);
									}
									resultUrl = resultUrl.replace(matchPartObj[0], getField(value));
									matchPartObj = regExp.exec(currBaseUrl);
								}
							}

							return resultUrl.replace(/\[.*?\]/g, '');
						}

						function getValueIgnoreCase(entity, fieldList, index) {
							/* jshint -W089 */
							for (let keyStr in entity) {
								if (keyStr.toLowerCase() === fieldList[index].toLowerCase()) {
									index++;
									if (_.isObject(entity[keyStr]) && index < fieldList.length) {
										return getValueIgnoreCase(entity[keyStr], fieldList, index);
									}
									return entity[keyStr];
								}
							}
							return '';
						}

						function getField(field) {
							return field ? field + ' ' : '';
						}

						function getFieldName() {
							let field = 'DunsNo';
							if ($scope.config?.model) {
								field = $scope.config.model;
							} else if ($scope.options?.field) {
								field = $scope.options.field;
							}
							return field;
						}

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

						function isForm() {
							return !!$scope.config;
						}
					}
			};
		}]);
})(angular);