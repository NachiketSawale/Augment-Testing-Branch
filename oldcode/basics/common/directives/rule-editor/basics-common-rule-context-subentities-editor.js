/*
 * $Id: basics-common-rule-operand-editor.js 568976 2019-12-02 09:12:24Z saa\hof $
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	/**
	 * @ngdoc directive
	 * @name basics.common.directive:basicsCommonRuleContextSubentitiesEditor
	 * @element div
	 * @restrict A
	 * @description Represents an editor for values in the rule editor.
	 */
	angular.module('basics.common').directive('basicsCommonRuleContextSubentitiesEditor', ['_',
		function (_) {
			return {
				restrict: 'A',
				replace: false,
				scope: false,
				link: function ($scope) {

					$scope.getLabel = function (entity) {
						if (_.isObject(entity)) {
							return _.get(entity, $scope.ruleEditorManager.getNameOperandDataPath());
						} else {
							return null;
						}
					};

					$scope.getLongDisplayName = function (entity) {
						return _.get(getDisplayName(entity), 'long');
					};

					$scope.getShortDisplayName = function (entity) {
						return _.get(getDisplayName(entity), 'short');
					};

					$scope.removeContext = function (entity) {
						const indexPath = $scope.ruleEditorManager.getIndexOperandDataPath();
						const removedEntity = _.remove($scope.data.Context.SubEntities, function (c) {
							return _.get(entity, indexPath) === _.get(c, indexPath);
						});
						if (!_.isEmpty(removedEntity)) {
							$scope.ruleEditorManager.setRuleContext($scope.data, true);
						}
					};

					function getDisplayName(entity) {
						if (_.isObject(entity)) {
							const subE = {
								id: _.get(entity, $scope.ruleEditorManager.getIndexOperandDataPath())
							};
							return $scope.ruleEditorManager.getContextEntityDisplayName(subE);
						} else {
							return null;
						}
					}

					const updateCurrentContext = function () {
						$scope.ruleEditorManager.setRuleContext($scope.data);
					};

					// initialise on creation
					if (_.isNil(_.get($scope, 'data.Context'))) {
						$scope.data.Context = {
							SubEntities: [],
							AliasExpressions: []
						};
					}
					$scope.ruleEditorManager.setRuleContext($scope.data, true, true);
					// register to rule editor to update context!
					$scope.ruleEditorManager.registerContextChanged(updateCurrentContext);

					$scope.$on('$destroy', function () {
						$scope.ruleEditorManager.unregisterContextChanged(updateCurrentContext);
					});
				}
			};
		}]);
})();
