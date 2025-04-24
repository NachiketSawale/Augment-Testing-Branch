/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	angular.module('model.administration').directive('modelAdministrationPropertyKeyTagSelector',
		modelAdministrationPropertyKeyTagSelector);

	modelAdministrationPropertyKeyTagSelector.$inject = ['_', 'modelAdministrationPropertyKeyTagDataService',
		'modelAdministrationPropertyKeyTagSelectorDialogService'];

	function modelAdministrationPropertyKeyTagSelector(_, modelAdministrationPropertyKeyTagDataService,
		modelAdministrationPropertyKeyTagSelectorDialogService) {

		return {
			restrict: 'EA',
			templateUrl: globals.appBaseUrl + 'model.administration/templates/model-administration-property-key-tag-selector.html',
			scope: {
				entity: '=',
				readonly: '<',
				options: '='
			},
			link: function (scope) {
				const privateState = {
					nextDisplayNamesRequestId: 1,
					lastDisplayNamesRequestId: null
				};

				function updateDisplayedValue(value) {
					if (!_.isArray(value)) {
						value = [];
					}

					const requestId = privateState.nextDisplayNamesRequestId++;
					privateState.lastDisplayNamesRequestId = requestId;
					modelAdministrationPropertyKeyTagDataService.getDisplayTextForTagIds(value).then(function (text) {
						if (requestId === privateState.lastDisplayNamesRequestId) {
							privateState.lastDisplayNamesRequestId = null;
							scope.displayValue = text;
						}
					});
				}

				function updateEditorValue(value) {
					updateDisplayedValue(value);
					_.set(scope.entity, scope.options.model, value);

					if (_.isFunction(scope.options.change)) {
						scope.options.change(scope.entity);
					}
				}

				scope.clickFn = function () {
					const currentVal = _.get(scope.entity, scope.options.model);
					modelAdministrationPropertyKeyTagSelectorDialogService.showDialog({
						selectedTags: _.isArray(currentVal) ? currentVal : []
					}).then(function (result) {
						updateEditorValue(result);
					}, function () {
					});
				};

				scope.isReadOnly = function () {
					return Boolean(scope.readonly) || !scope.entity;
				};

				scope.$watch('entity.' + scope.options.model, updateDisplayedValue);
			}
		};
	}
})(angular);
