/**
 * Created by lvy on 5/10/2018.
 */

(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,$ */

	var moduleName = 'constructionsystem.main';

	angular.module(moduleName).directive('constructionsystemMainDynamicTypeValueControl',
		['_', '$compile', 'constructionSystemMainInstanceHeaderParameterService', 'cosMasterParameterFormControlChangeService', 'parameterDataTypes', 'constructionSystemMainInstanceHeaderParameterValidationService',
			function (_, $compile, dataService, controlChangeService, parameterDataTypes, validationService) {

				var directive = {};
				var childscope;
				directive.restrict = 'A';

				directive.link = function (scope, element, attrs) {
					var unwatches = [];
					var options = scope.$eval(attrs.options);
					var entity = options.useParent ? dataService.getSelected() : scope.entity;
					var rowTypeFields = options.rowTypeFields;
					if (entity !== null && Object.prototype.hasOwnProperty.call(entity,'Id')) {
						changeControl(scope, entity, element);
					}

					if (options && angular.isArray(options.watchFields)) {
						_.forEach(options.watchFields, function(watchField) {
							var exp = watchExp(watchField);
							var unwatch = scope.$watch(exp, watchHandler);
							unwatches.push(unwatch);
						});
					}
					var unwatchCosParameterValueVirtual = scope.$watch('entity.ParameterValueVirtual', function (newValue, oldValue) {
						if (newValue !== oldValue && scope.entity) {
							validationService.validateParameterValueVirtual(scope.entity, newValue);
							dataService.markItemAsModified(scope.entity);
						}
					});

					scope.$on('$destroy', function () {
						unwatchCosParameterValueVirtual();
						_.forEach(unwatches, function(watch) {
							watch();
						});
					});

					// /////////////////////////
					function watchExp (watchField){
						if (options.useParent) {
							return function exp() {
								if (angular.isDefined((dataService.getSelected() || {})[watchField])) {
									return dataService.getSelected()[watchField];
								}
							};
						} else {
							return 'entity.' + watchField;
						}
					}

					function watchHandler (newValue, oldValue) {
						var entity = options.useParent ? dataService.getSelected() : scope.entity;
						if (newValue !== oldValue) {
							changeControl(scope, entity, element);
						}
					}

					function getRowDefinition(entity) { /* jshint -W074 */
						var lookupRow = {
							'rid': options.rid,
							'gid': 'basicData',
							'model': options.model
						};

						if (!entity || !rowTypeFields) {
							lookupRow.type = 'integer';
							return lookupRow;
						}

						if (angular.isDefined(rowTypeFields.isLookup) && entity[rowTypeFields.isLookup]) {
							lookupRow.type = 'directive';
							lookupRow.directive = options.lookupDirective;
							return lookupRow;
						}

						if (angular.isUndefined(rowTypeFields.parameterType)) {
							lookupRow.type = 'integer';
							return lookupRow;
						}
						switch (entity[rowTypeFields.parameterType]) {
							case parameterDataTypes.Integer:
								lookupRow.type = 'integer';
								break;
							case parameterDataTypes.Decimal1:
								lookupRow.type = 'decimal';
								lookupRow.options = {decimalPlaces: 1};
								break;
							case parameterDataTypes.Decimal2:
								lookupRow.type = 'decimal';
								lookupRow.options = {decimalPlaces: 2};
								break;
							case parameterDataTypes.Decimal3:
								lookupRow.type = 'decimal';
								lookupRow.options = {decimalPlaces: 3};
								break;
							case parameterDataTypes.Decimal4:
								lookupRow.type = 'decimal';
								lookupRow.options = {decimalPlaces: 4};
								break;
							case parameterDataTypes.Decimal5:
								lookupRow.type = 'decimal';
								lookupRow.options = {decimalPlaces: 5};
								break;
							case parameterDataTypes.Decimal6:
								lookupRow.type = 'decimal';
								lookupRow.options = {decimalPlaces: 6};
								break;
							case parameterDataTypes.Boolean:
								lookupRow.type = 'boolean';
								break;
							case parameterDataTypes.Date:
								lookupRow.type = 'dateutc';
								break;
							case parameterDataTypes.Text:
								lookupRow.type = 'description';
								break;
							default :
								lookupRow.type = 'integer';
								break;
						}

						return lookupRow;
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
						// noinspection JSCheckFunctionSignatures
						return scope.$new();
					}

					function changeControl(scope, entity, element) {
						/* jshint -W074 */
						var rows = [];
						var parent = $(element);

						rows.push(getRowDefinition(entity));

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