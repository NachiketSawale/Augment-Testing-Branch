/**
 * Created by xsi on 2016-03-24.
 */
(function () {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,$ */

	var moduleName = 'constructionsystem.main';

	/* jshint -W074 */
	angular.module(moduleName).directive('constructionSystemMainInstanceParameterParameterValueControl',
		['$compile', 'cosMasterParameterFormControlChangeService','parameterDataTypes',
			'basicsLookupdataLookupDescriptorService',
			function ($compile, controlChangeService,parameterDataTypes,
				basicsLookupdataLookupDescriptorService) {
				var directive = {};
				var childscope = null;
				directive.restrict = 'A';
				// directive.scope = true;
				directive.link = function (scope, element) {
					if (scope.entity !== null && Object.prototype.hasOwnProperty.call(scope.entity,'Id')) {
						changeControlByIsLookupOrType(scope, scope.entity, element);
					}

					var unwatchIsLookup = scope.$watch('entity.IsLookup', function (newValue, oldValue) {
						// noinspection JSValidateTypes
						if (newValue !== oldValue) {
							changeControlByIsLookupOrType(scope, scope.entity, element);
						}
					});

					var unwatchCosParameterTypeFk = scope.$watch('entity.ParameterFk', function (newLineTypeFk, oldLineTypeFk) {
						// noinspection JSValidateTypes
						if (newLineTypeFk !== oldLineTypeFk) {
							changeControlByIsLookupOrType(scope, scope.entity, element);
						}
					});

					scope.$on('$destroy', function () {
						unwatchCosParameterTypeFk();
						unwatchIsLookup();
					});
				};

				function getRowDefinition(entity) {
					var lookupRow = {
						'rid': 'parametervalue',
						'gid': 'baseGroup',
						'model': 'ParameterValueVirtual' // TODO chi: right?
					};
					if (!entity) {
						lookupRow.type = 'integer';
						return lookupRow;
					}
					if (entity.IsLookup) {
						lookupRow.type = 'directive';
						lookupRow.directive = 'construction-system-main-instance-parameter-value-lookup';
						return lookupRow;
					}
					switch (entity.ParameterTypeFk) {
						case parameterDataTypes.Integer:
							lookupRow.type = 'integer';
							break;
						case parameterDataTypes.Decimal1:
							lookupRow.type = 'money';
							break;
						case parameterDataTypes.Decimal2:
							lookupRow.type = 'money';
							break;
						case parameterDataTypes.Decimal3:
							lookupRow.type = 'decimal';
							break;
						case parameterDataTypes.Decimal4:
							lookupRow.type = 'exchangerate';
							break;
						case parameterDataTypes.Decimal5:
							lookupRow.type = 'exchangerate';
							break;
						case parameterDataTypes.Decimal6:
							lookupRow.type = 'factor';
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

				function changeControlByIsLookupOrType(scope, entity, element) {
					var items = basicsLookupdataLookupDescriptorService.getData('CosMainInstanceParameterValue');
					if (items&&entity) {
						var item = items[entity.ParameterFk];

						var rows = [];
						var parent = $(element);

						rows.push(getRowDefinition(item));

						var html = controlChangeService.getContextHtml(scope, rows);

						parent.empty();

						childscope = makeChildScopewithClean(scope, childscope);

						element.append($compile(html)(childscope));
					}
				}
				return directive;
			}]);
})();
