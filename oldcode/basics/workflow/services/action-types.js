/* global angular, _ */
(function () {
	'use strict';

	function actionTypeFactory() {
		var obj = {};
		obj.asArray =
			[
				{
					id: 1,
					description: 'Start',
					key: 'basics.workflow.designer.start',
					icon: '',
					warningIcon: '',
					errorIcon: '',
					sort: -1,
					designerCss: 'start',
					image: null
				},
				{
					id: 2,
					description: 'End',
					key: 'basics.workflow.designer.end',
					icon: '',
					warningIcon: '',
					errorIcon: '',
					sort: 99,
					designerCss: 'end',
					image: null
				},
				{
					id: 3,
					description: 'Decision',
					key: 'basics.workflow.designer.decision',
					icon: 'ico-decision',
					warningIcon: 'cloud.style/content/images/control-icons.svg#ico-warning-level-attention',
					errorIcon: 'cloud.style/content/images/control-icons.svg#ico-warning-level-danger',
					sort: 1,
					designerCss: 'decision',
					image: null
				},
				{
					id: 4,
					description: 'Object Action',
					key: 'basics.workflow.designer.object',
					icon: 'ico-object',
					warningIcon: 'cloud.style/content/images/control-icons.svg#ico-warning-level-attention',
					errorIcon: 'cloud.style/content/images/control-icons.svg#ico-warning-level-danger',
					sort: 2,
					designerCss: 'action',
					image: 'cloud.style/content/images/control-icons.svg#ico-object'
				},									//Defect #107389 - Removed using of direct image references
				{
					id: 5,
					description: 'Script Action',
					key: 'basics.workflow.designer.script',
					icon: 'ico-script',
					warningIcon: 'cloud.style/content/images/control-icons.svg#ico-warning-level-attention',
					errorIcon: 'cloud.style/content/images/control-icons.svg#ico-warning-level-danger',
					sort: 3,
					designerCss: 'action',
					image: 'cloud.style/content/images/control-icons.svg#ico-script'
				},
				{
					id: 6,
					description: 'User Task',
					key: 'basics.workflow.designer.userTask',
					icon: 'ico-user-task',
					warningIcon: 'cloud.style/content/images/control-icons.svg#ico-warning-level-attention',
					errorIcon: 'cloud.style/content/images/control-icons.svg#ico-warning-level-danger',
					sort: 4,
					designerCss: 'action',
					image: 'cloud.style/content/images/control-icons.svg#ico-user-task'
				},
				{
					id: 7,
					description: 'External Function',
					key: 'basics.workflow.designer.externalFn',
					icon: 'ico-external-function',
					warningIcon: 'cloud.style/content/images/control-icons.svg#ico-warning-level-attention',
					errorIcon: 'cloud.style/content/images/control-icons.svg#ico-warning-level-danger',
					sort: 5,
					designerCss: 'action',
					image: 'cloud.style/content/images/control-icons.svg#ico-external-function'
				},
				{
					id: 8,
					description: 'Message',
					key: 'basics.workflow.designer.message',
					icon: 'ico-message',
					warningIcon: 'cloud.style/content/images/control-icons.svg#ico-warning-level-attention',
					errorIcon: 'cloud.style/content/images/control-icons.svg#ico-warning-level-danger',
					sort: 6,
					designerCss: 'action',
					image: 'cloud.style/content/images/control-icons.svg#ico-message'
				},
				{
					id: 9,
					description: 'User Form',
					key: 'basics.workflow.designer.userForm',
					icon: 'ico-user-form',
					warningIcon: 'cloud.style/content/images/control-icons.svg#ico-warning-level-attention',
					errorIcon: 'cloud.style/content/images/control-icons.svg#ico-warning-level-danger',
					sort: 7,
					designerCss: 'action',
					image: 'cloud.style/content/images/control-icons.svg#ico-user-form'
				},
				{
					id: 10,
					description: 'Workflow',
					key: 'basics.workflow.designer.workflow',
					icon: 'ico-workflow',
					warningIcon: 'cloud.style/content/images/control-icons.svg#ico-warning-level-attention',
					errorIcon: 'cloud.style/content/images/control-icons.svg#ico-warning-level-danger',
					sort: 8,
					designerCss: 'action',
					image: 'cloud.style/content/images/control-icons.svg#ico-workflow'
				}
			];
		obj.start = obj.asArray[0];
		obj.end = obj.asArray[1];
		obj.decision = obj.asArray[2];
		obj.object = obj.asArray[3];
		obj.script = obj.asArray[4];
		obj.userTask = obj.asArray[5];
		obj.externalFn = obj.asArray[6];
		obj.message = obj.asArray[7];
		obj.userForm = obj.asArray[8];
		obj.workflow = obj.asArray[9];
		obj.getById = function (id) {
			return _.find(obj.asArray, {id: id});
		};
		return obj;
	}

	angular.module('basics.workflow').constant('basicsWorkflowActionType', actionTypeFactory());
})();
