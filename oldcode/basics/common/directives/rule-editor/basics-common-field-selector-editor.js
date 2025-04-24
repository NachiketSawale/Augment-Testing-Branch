/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	angular.module('basics.common').directive('basicsCommonFieldSelectorEditor', ['_',
		'basicsCommonFieldSelectorDialogService', '$q',
		function (_, fieldSelectorDialogService, $q) {
			return {
				restrict: 'EA',
				templateUrl: globals.appBaseUrl + 'basics.common/templates/field-selector/field-selector-editor.html',
				scope: {
					graphProviderFn: '=',
					entity: '=',
					model: '=',
					readonly: '<',
					colorInfo: '='
				},
				link: function (scope) {
					if (!_.isFunction(scope.graphProviderFn)) {
						throw 'Missing graphProviderFn';
					}

					const graphProvider = scope.$parent.graphProvider = scope.graphProviderFn();

					function updateDisplayedValue(value) {
						$q.when(graphProvider.getDisplayNameForItem(value)).then(function setDisplayedValue(value) {
							if (_.isString(value)) {
								value = {
									long: value,
									short: value
								};
							} else if (!_.isObject(value)) {
								value = {
									long: '',
									short: ''
								};
							}

							scope.displayValue = value.long;
							scope.shortDisplayValue = value.short;
						});
					}

					function updateEditorValue(value) {
						// updateDisplayedValue(value);
						_.set(scope.entity, scope.model, value);
					}

					function getValue() {
						return _.get(scope.entity, scope.model);
					}

					scope.clickFn = function () {
						fieldSelectorDialogService.showDialog({
							schemaGraphProvider: graphProvider,
							value: getValue(),
							isESV2: !_.isUndefined(scope.entity.Operands)
						}).then(function (result) {
							updateEditorValue(result.value);
						});
					};

					// updateDisplayedValue(getValue());

					scope.$watch('entity.' + scope.model, updateDisplayedValue);
				}
			};
		}]);

})(angular);
