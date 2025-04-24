/**
 * Created by jie on 09.02.2022.
 */

(function () {
	'use strict';

	angular.module('basics.workflow').value('basicsWorkflowHsqeCheckListService', {
		fromCheckListTemplate: {
			key: 'fromCheckListTemplate',
			actionKey: 'FromCheckListTemplate'
		},
		createDistinctChecklist: {
			key: 'createDistinctChecklist',
			actionKey: 'CreateDistinctChecklist'
		},
		checkListTemplateId: {
			key: 'checkListTemplateId',
			actionKey: 'CheckListTemplateId'
		},
		projectFk:{
			key: 'projectFk',
			actionKey: 'ProjectFk'
		},id:{
			key: 'id',
			actionKey: 'Id'
		},createCheckListFlg:{
			key:'createCheckListFlg',
			actionKey:'CreateCheckListFlg'
		}
	});

})();
