/**
 * Created by zwz on 7/11/2018.
 */
(function (angular) {
	'use strict';
	var moduleName = 'transportplanning.package';

	angular.module(moduleName).directive('transportplanningPackageSelectControl2',
		['$', '$injector', '_', '$compile', 'transportplanningPackagePkgTypeFormControlChangeService', 'packageTypes',
			function ($, $injector, _, $compile, controlChangeService, packageTypes) {

				var directive = {};
				var childscope;
				directive.restrict = 'A';

				directive.link = function (scope, element, attrs) {
					var options = scope.$eval(attrs.options);

					var unwatchTrsPkgTypeFk = null,
						unwatchEntity = null;

					unwatchEntity = scope.$watch('entity', function (/*newValue, oldValue*/) {
						if (!unwatchTrsPkgTypeFk) {
							unwatchTrsPkgTypeFk = scope.$watch('entity.TrsPkgTypeFk', function (newValue, oldValue) {
								if (newValue !== oldValue) {
									changeControl(scope, element, newValue);
								}
							});
						}
					});

					//init
					var pkgType = -1;
					if (scope.entity) { //entity is already selected.
						pkgType = scope.entity.TrsPkgTypeFk;
					}
					changeControl(scope, element, pkgType);

					scope.$on('$destroy', function () {
						unwatchEntity();
						if (unwatchTrsPkgTypeFk) {
							unwatchTrsPkgTypeFk();
						}
					});

					function getRowDefinition(typeValue) { /* jshint -W074 */
						var config = scope.$eval(attrs.config);
						var propObj = packageTypes.properties[typeValue];
						return propObj ? {
							afterId: config.afterId || '',
							rid: config.rid,
							gid: config.gid,
							model: config.model,
							type: 'directive',
							directive: _.get(propObj, 'directive', null),
							readonly: _.get(config, 'readonly', false),
							options: {
								displayMember: _.get(propObj, 'descriptionPropertyName', null),
								version: _.get(propObj, 'version', undefined)
							}
						} : {
							type: 'description',
							readonly: _.get(config, 'readonly', false)
						};
					}

					/**
					 *
					 * @param scope
					 * @param cs
					 * @returns {*|Object}
					 */
					function makeChildScopewithClean(scope, cs) {
						if (cs) {
							cs.$destroy();
						}
						//noinspection JSCheckFunctionSignatures
						return scope.$new();
					}

					function changeControl(scope, element, typeValue) {
						/* jshint -W074 */
						var lookuprow = getRowDefinition(typeValue);
						if (!lookuprow.directive) {
							var template = '<div class="form-control" data-ng-readonly="true"></div>';
							var ctrlElement = angular.element(template);
							element.html('');
							element.append(ctrlElement);
							$compile(ctrlElement)(scope);
							return;
						}
						//else

						var rows = [];
						var parent = $(element);

						rows.push(lookuprow);
						var html = controlChangeService.getContextHtml(scope, rows);
						parent.empty();
						childscope = makeChildScopewithClean(scope, childscope);
						childscope.options = rows[0].options ? rows[0].options : null;
						element.append($compile(html)(childscope));
					}
				};

				return directive;
			}]);
})(angular);



