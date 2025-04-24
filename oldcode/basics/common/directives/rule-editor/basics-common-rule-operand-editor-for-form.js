/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc directive
	 * @name basics.common.directive:basicsCommonRuleOperandEditor
	 * @element div
	 * @restrict A
	 * @description Represents an editor for values in the rule editor.
	 */
	angular.module('basics.common').directive('basicsCommonRuleOperandEditorForForm',
		basicsCommonRuleOperandEditorForForm);

	basicsCommonRuleOperandEditorForForm.$inject = ['basicsCommonRuleEditorService', '_'];

	function basicsCommonRuleOperandEditorForForm(/* basicsCommonRuleEditorService, _ */) {
		return {
			restrict: 'A',
			template: '<div data-basics-common-rule-operand-editor data-operand="options.operand" data-model="options.model" data-entity="options.Entity" data-rule-editor-manager="options.ruleEditorManager" data-editable="editable"></div>',
			replace: false,
			scope: {
				options: '=',
				operand: '=', // operand declaration
				model: '=', // operand data object
				entity: '=' // condition entity,
			},
			compile: function () {
				return {
					pre: function (scope) {
						console.log('scope of directive');
						console.log(scope);

						scope.editable = true;
					}
				};
			}
		};
	}
})(angular);
