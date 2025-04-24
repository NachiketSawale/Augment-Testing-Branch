/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	angular.module('model.main')
		.directive('modelMainFilterByExpressionActionEditorContainer',
			modelMainFilterByExpressionActionEditorContainer).config(modelMainFilterByExpressionActionEditorContainerConfig);

	modelMainFilterByExpressionActionEditorContainer.$inject = ['_', 'platformCreateUuid',
		'basicsWorkflowGlobalContextUtil', 'basicsWorkflowActionEditorService', 'platformGridAPI', '$log', '$q',
		'basicsCommonRuleEditorService', 'basicsCommonDataDictionaryOperatorService',
		'basicsWorkflowFilterChainUtilitiesService'];

	function modelMainFilterByExpressionActionEditorContainer(_, platformCreateUuid,
		basicsWorkflowGlobalContextUtil, basicsWorkflowActionEditorService, platformGridAPI,
		$log, $q, basicsCommonRuleEditorService, basicsCommonDataDictionaryOperatorService,
		basicsWorkflowFilterChainUtilitiesService) {

		return basicsWorkflowFilterChainUtilitiesService.createFilterByExpressionActionEditorDirective('MDL_OBJECT');
	}

	modelMainFilterByExpressionActionEditorContainerConfig.$inject = ['basicsWorkflowModuleOptions'];

	function modelMainFilterByExpressionActionEditorContainerConfig(basicsWorkflowModuleOptions) {
		basicsWorkflowModuleOptions.actionEditors.push({
			actionId: 'db80ea48e8fc40bfa182b7f77885e545',
			directive: 'modelMainFilterByExpressionActionEditorContainer',
			prio: null,
			tools: []
		});
	}
})(angular);
