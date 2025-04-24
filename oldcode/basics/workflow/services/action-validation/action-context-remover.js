(function (angular) {
	'use strict';

	function actionContextRemoverFactory(basicsWorkflowActionValidationHelper) {
		basicsWorkflowActionValidationHelper.registerActionValidation(
			function (item) {
				if (item.context) {
					delete item.context;
				}
			}
		);
	}

	actionContextRemoverFactory.$inject = ['basicsWorkflowActionValidationHelper'];

	angular.module('basics.workflow')
		.run(actionContextRemoverFactory);

})(angular);
