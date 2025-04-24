/*globals angular */

(function (angular) {
	'use strict';

	function actionValidationUtilService(basicsWorkflowActionValidationHelper, basicsWorkflowMasterDataService,
		basicsWorkflowActionType, platformTranslateService, _, platformModuleStateService) {
		var state = platformModuleStateService.state('basics.workflow');

		return {
			actionValidationHelper: basicsWorkflowActionValidationHelper,
			masterDataService: basicsWorkflowMasterDataService,
			actionTypeEnum: basicsWorkflowActionType,
			translateService: platformTranslateService,
			_: _,
			get actionList() {
				return state.actions;
			},
			translate: function (key) {
				return platformTranslateService.instant(key, null, true);
			},
			isStartOrEnd: function (item) {
				return (item.actionTypeId === this.actionTypeEnum.end.id || item.actionTypeId === this.actionTypeEnum.start.id);
			}
		};
	}

	actionValidationUtilService.$inject = ['basicsWorkflowActionValidationHelper', 'basicsWorkflowMasterDataService',
		'basicsWorkflowActionType', 'platformTranslateService', '_', 'platformModuleStateService'];

	angular.module('basics.workflow')
		.factory('basicsWorkflowActionValidationUtilService', actionValidationUtilService);

})(angular);