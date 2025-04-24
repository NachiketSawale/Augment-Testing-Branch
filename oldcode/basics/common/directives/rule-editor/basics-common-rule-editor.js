/*
 * $Id: basics-common-rule-editor.js 634323 2021-04-27 22:05:46Z haagf $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	angular.module('basics.common').directive('basicsCommonRuleEditor', main);

	main.$inject = ['basicsCommonRuleEditorService', '_', 'platformTranslateService'];

	function main(ruleEditorService, _, platformTranslateService) {

		function link($scope) {
			if (_.isNil($scope.editable)) {
				$scope.editable = true;
			}

			const mgr = $scope.manager || $scope.ruleEditorManager || ruleEditorService.getDefaultManager(Boolean($scope.readOnly));
			const cachedOtherOperands = {};

			$scope = angular.extend($scope, platformTranslateService.instant({'basics.common.matrixSettingsDialog': ['createRules']}));

			$scope.isEmpty = function isEmpty(obj) {
				return _.isEmpty(obj);
			};

			$scope.addMainGroup = function addMainGroup() {
				return mgr.creationCondition({
					Children: $scope.ruleDefinition,
					ConditionFktop: null, // is the top item fk, root has null
					ConditionFk: null  // has no parent is root
				}, 1, false);
			};

			$scope.addGroup = function addGroup(groupData) {
				mgr.creationCondition(groupData, 1, $scope.fakeCreate);

				mgr.notifyRuleChanged();
			};

			$scope.addRule = function addGroup(groupData) {
				mgr.creationCondition(groupData, 2, $scope.fakeCreate);

				mgr.notifyRuleChanged();
			};

			$scope.remove = function remove(item) {
				const list = $scope.ruleDefinition;
				mgr.remove(item, list);

				mgr.notifyRuleChanged();
			};

			$scope.determineDomain = function determineDomain(item) {
				return mgr.determineDomain(item);
			};

			$scope.determineLookupInfo = function determineLookupInfo(item) {
				const lookupCol = mgr.determineLookupColumn(item);
				if (lookupCol && lookupCol.editorOptions && lookupCol.editorOptions) {
					return lookupCol;
				}
			};

			$scope.determineEditorOptions = function determineEditorOptions(item) {
				const lookupCol = mgr.determineLookupColumn(item);
				if (lookupCol && lookupCol.editorOptions && lookupCol.editorOptions) {
					return lookupCol.editorOptions;
				}
			};

			$scope.isEditorLess = function isEditorLess(item) {
				return mgr.isEditorLess(item);
			};

			$scope.reset = function reset(condition) {
				condition.OperatorFk = null;
				if (_.isArray(condition.Operands)) {
					condition.Operands.splice(1, condition.Operands.length - 1);
				}
				condition.valid = null;
			};

			$scope.resetCompareValues = function reset(condition) {
				if (_.isArray(condition.Operands)) {
					condition.Operands.splice(1, condition.Operands.length - 1);
				}
				$scope.$broadcast('domainChanged');
			};

			$scope.hasToShow = function hasToDisplay(condition, fieldName) {
				// check depending on the type of operator
				if (!condition.OperatorFk) {
					return false;
				}
				return mgr.hasToShow(condition, fieldName);
			};

			$scope.getPlaceHolder = function (condition, fieldName) {
				if (!condition.OperatorFk || !fieldName) {
					return '';
				}
				return mgr.getPlaceHolder(condition, fieldName);
			};

			$scope.getOperandOptions = function getOperandOptions(condition, fieldName) {
				if (!condition.OperatorFk || !fieldName) {
					return '';
				}
				return mgr.getPlaceHolder(condition, fieldName);
			};

			$scope.getMissingPinningContext = function (condition) {
				return mgr.getMissingPinningContext(condition);
			};

			// if ($scope.hierarchy === false) {
			// $scope.addMainGroup().then(function (group) {
			// $scope.addRule(group);
			// });
			// }

			$scope.isLiteralOperand = function (condition, index) {
				const otherOperands = mgr.getOtherOperands(condition);
				if (otherOperands) {
					const op = otherOperands[index];
					if (op) {
						const displayDomain = mgr.getUiTypeByDisplayDomainId(op.DisplaydomainFk);
						if (!_.startsWith(op.Id, 'CompareProperty') && (displayDomain !== 'lookup') && (displayDomain !== 'relationset')) {
							return true;
						}
					}
				}
				return false;
			};

			$scope.isLookupOperand = function (condition, index) {
				const otherOperands = mgr.getOtherOperands(condition);
				if (otherOperands) {
					const op = otherOperands[index];
					if (op) {
						const displayDomain = mgr.getUiTypeByDisplayDomainId(op.DisplaydomainFk);
						if (!_.startsWith(op.Id, 'CompareProperty') && (displayDomain === 'lookup')) {
							return true;
						}
					}
				}
				return false;
			};

			$scope.isRelationSetOperand = function (condition, index) {
				const otherOperands = mgr.getOtherOperands(condition);
				if (otherOperands) {
					const op = otherOperands[index];
					if (op) {
						const displayDomain = mgr.getUiTypeByDisplayDomainId(op.DisplaydomainFk);
						if (!_.startsWith(op.Id, 'CompareProperty') && (displayDomain === 'relationset')) {
							return true;
						}
					}
				}
				return false;
			};

			$scope.isPropertyOperand = function (condition, index) {
				const otherOperands = mgr.getOtherOperands(condition);
				if (otherOperands) {
					const op = otherOperands[index];
					if (op) {
						if (_.startsWith(op.Id, 'CompareProperty')) {
							return true;
						}
					}
				}
				return false;
			};

			$scope.createSchemaGraphProvider = function () {
				return mgr.createSchemaGraphProvider();
			};

			$scope.getOtherOperands = function (condition) {
				if (condition) {
					const propPath = mgr.getPropertyOperandPath(0);
					const propId = _.get(condition, propPath);

					const cachePath = '[' + propId + '_' + condition.OperatorFk + ']';
					let result = _.get(cachedOtherOperands, cachePath);
					if (!result) {
						result = mgr.getOtherOperands(condition);
						if (!result.isFallback) {
							_.set(cachedOtherOperands, cachePath, result);
						}
					}
					return result;
				} else {
					return [];
				}
			};

			$scope.createOperatorAccessor = function (condition) {
				return function (operatorFk) {
					if (!condition) {
						$scope.otherOperands = [];
						return;
					}

					if (arguments.length <= 0) {
						return condition.OperatorFk;
					} else {
						if (condition.OperatorFk !== operatorFk) {
							condition.OperatorFk = operatorFk;
							condition.Operands.splice(1, condition.Operands.length - 1);
						}
					}
				};
			};

			$scope.createFirstOperandAccessor = function () {
				return mgr.getPropertyOperandPath(0);
			};

			$scope.createOperandAccessor = function (condition, operandIndex) {
				return function (operand) {
					if (!condition) {
						return;
					}

					const propPath = (function () {
						if (operandIndex > 0) {
							if ($scope.isPropertyOperand(condition, operandIndex - 1)) {
								return mgr.getPropertyOperandPath(operandIndex);
							} else {
								return mgr.getLiteralOperandPath(condition, operandIndex);
							}
						} else {
							return mgr.getPropertyOperandPath(operandIndex);
						}
					})();
					if (arguments.length <= 0) {
						return _.get(condition, propPath);
					} else {
						if (operand !== _.get(condition, propPath)) {
							_.set(condition, propPath, operand);
							if (operandIndex <= 0) {
								condition.Operands.splice(1, condition.Operands.length - 1);
							}
						}
					}
				};
			};

			$scope.createOperandDomainAccessor = function (operandIndex) {
				return function (item) {
					return mgr.determineDomain(item, operandIndex);
				};
			};

			$scope.getLiteralOperandPropertyPath = function (condition, operandIndex) {
				if (mgr.determineDomain(condition, operandIndex) === 'translation') {
					return 'data.' + mgr.getLiteralOperandPath(condition, operandIndex) + '.Translated';
				} else {
					return 'data.' + mgr.getLiteralOperandPath(condition, operandIndex);
				}
			};

			$scope.isFirstOperandReady = function (condition) {
				return mgr.isFirstOperandReady(condition);
			};

			$scope.isOperandVisible = function (data, operand) {
				return operand.Index < 3 || (operand.Index === 3 && !data.hideRangeOp);
			};

			$scope.getGroupOperatorSelectorOptions = function () {
				return {
					displayMember: 'DescriptionInfo.Translated',
					valueMember: 'Id',
					items: mgr.getGroupOperators()
				};
			};

			$scope.getColorInfo = function (entity) {
				return mgr.getColorInfo(entity);
			};

			function updateCompletionState() {
				$scope.$evalAsync();
			}

			mgr.registerDataLoaded(updateCompletionState);

			$scope.$on('$destroy', function () {
				mgr.unregisterDataLoaded(updateCompletionState);
			});

			$scope.$watch('ruleDefinition', function (newValue) {
				mgr.adaptForRule(_.isArray(newValue) ? newValue[0] : null);
			});
		}

		return {
			restrict: 'A',
			scope: {
				hierarchy: '=',
				ruleDefinition: '=',
				fakeCreate: '=',
				ruleEditorManager: '=',
				readOnly: '=',
				editable: '<'
			},
			link: link,
			templateUrl: window.location.pathname + '/basics.common/templates/matrixSettingsDialog/rule-editor-template.html'
		};
	}

})(angular);
