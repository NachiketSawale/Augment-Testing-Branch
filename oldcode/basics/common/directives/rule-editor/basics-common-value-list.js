/*
 * $Id: basics-common-value-list.js 520488 2018-11-08 12:09:20Z haagf $
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	/**
	 * @ngdoc directive
	 * @name basics.common.directive:basicsCommonValueList
	 * @element div
	 * @restrict A
	 * @description Represents a control that allows to add any number of items from a list.
	 */
	angular.module('basics.common').directive('basicsCommonValueList', ['$compile', '_',
		function ($compile, _) {
			return {
				restrict: 'A',
				scope: {
					entity: '=',
					model: '=',
					valueModel: '=',
					ruleEditorManager: '=',
					operand: '=',
					readonly: '='
				},
				link: function (scope, elem) {

					scope.filteredEnumValues = scope.ruleEditorManager.getEnumValues(scope.operand.TargetKind, scope.operand.TargetId, true);
					const allEnumValues = scope.ruleEditorManager.getEnumValues(scope.operand.TargetKind, scope.operand.TargetId);

					scope.criterion = {
						valueListDataSource: []
					};
					const setValueListDataSource = () => {
						// clear list
						scope.criterion.valueListDataSource.length = 0;
						// then add again (including current selection!)
						let hiddenSelectedEntities = _.isArray(scope.internalModel) ?
							_.filter(allEnumValues, (v) => {
								let containedInFiltered = (enumVal) => {
									return enumVal.Id === v.Id;
								};
								let inSelection = () => {
									return scope.internalModel.includes(v.Id.toString());
								};
								return !_.some(scope.filteredEnumValues, containedInFiltered) && inSelection();
							}) : [];
						let shownEntities = _.concat(hiddenSelectedEntities, scope.filteredEnumValues);
						let mappedEntities = _.map(shownEntities, function (item) {
							return {
								id: item.Id,
								description: item.Name
							};
						});
						scope.criterion.valueListDataSource.push(...mappedEntities);
					};
					setValueListDataSource();

					var fullModelPath = 'entity.' + scope.model;
					scope.$watch(fullModelPath, function (newValue) {
						if (!_.isArray(newValue)) {
							newValue = [];
							_.set(scope, fullModelPath, newValue);
						}

						scope.internalModel = _.map(newValue, function (v) {
							return _.get(v, scope.valueModel) + '';
						});
					}, true);

					scope.$watchCollection('internalModel', function (newValue) {
						_.set(scope, fullModelPath, _.map(newValue, function (v) {
							switch (scope.operand.DisplaydomainFk) {
								case 10:
									v = parseInt(v);
									break;
							}

							var result = {};
							_.set(result, scope.valueModel, v);
							return result;
						}));
					});

					scope.$watchCollection('filteredEnumValues', setValueListDataSource);

					var template = '<div data-cloud-desktop-filter-value-list data-model="internalModel" data-placeholder="operand.DescriptionInfo.Translated" class="flex-element lookup-value-list" data-readonly="readonly"></div>';
					var content = $compile(template)(scope);
					elem.html('');
					content.appendTo(elem);
				}
			};
		}
	]);
})();
