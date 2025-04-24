/**
 * Created by anl on 8/1/2019.
 */


(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.accounting';

	angular.module(moduleName).directive('productionplanningAccountingResultSelectControl',
		['$injector', '_', '$compile', 'transportplanningPackagePkgTypeFormControlChangeService', 'ComponentTypesResult',
			function ($injector, _, $compile, controlChangeService, componentTypesResult) {

				var directive = {};
				var childscope;
				directive.restrict = 'A';

				directive.link = function (scope, element, attrs) {
					var options = scope.$eval(attrs.options);
					//var rowTypeFields = options.rowTypeFields;

					var unwatchComponentTypeFk = null,
						unwatchEntity = null;

					unwatchEntity = scope.$watch('entity', function (/*newValue, oldValue*/) {
						if (!unwatchComponentTypeFk) {
							unwatchComponentTypeFk = scope.$watch('entity.ComponentTypeFk', function (newValue, oldValue) {
								if (newValue !== oldValue) {
									changeControl(scope, element, newValue);
								}
							});
						}
					});

					//init
					var componentType = 3;
					if (scope.entity) { //entity is already selected.
						componentType = scope.entity.ComponentTypeFk;
					}
					changeControl(scope, element, componentType);

					scope.$on('$destroy', function () {
						unwatchEntity();
						if (unwatchComponentTypeFk) {
							unwatchComponentTypeFk();
						}
					});

					function getRowDefinition(typeValue) { /* jshint -W074 */
						return {
							rid: options.rid,
							gid: 'baseGroup',
							model: options.model,
							type: 'directive',
							directive: (componentTypesResult.properties[typeValue]) ?
								componentTypesResult.properties[typeValue].directive : null
							// options: {
							// 	events: [{
							// 		name: 'onSelectedItemChanged',
							// 		handler: function (e, args) {
							// 			args.entity[componentTypesResult.properties[typeValue].property] = args.selectedItem;
							// 		}
							// 	}]
							// }
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

						rows.push(getRowDefinition(typeValue));
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