(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	var moduleName = 'constructionsystem.main';

	/**
	 * @ngdoc service
	 * @name constructionSystemMainCreateInstanceWizardService
	 * @function
	 * @requires
	 * @description
	 * #
	 * construnctionsystem.main wizard 'create instance' service.
	 */
	angular.module(moduleName).factory('constructionSystemMainCreateInstanceAiWizardService', [
		'_', '$translate', '$http', 'platformModalService',
		'constructionSystemMainHeaderService', 'constructionSystemMainInstanceService',
		'constructionSystemMainJobDataService','platformSidebarWizardCommonTasksService',
		'basicsCommonAIService',
		function (_, $translate, $http, platformModalService,
			constructionSystemMainHeaderService, constructionSystemMainInstanceService,
			constructionSystemMainJobDataService,platformSidebarWizardCommonTasksService,
			basicsCommonAIService) {
			return {
				createInstance: createInstance
			};

			function createInstance() {
				basicsCommonAIService.checkPermission('a7cf3ad28b514377a8c09bb188f86108', true).then(function (canProceed) {
					if (!canProceed) {
						return;
					}
					doCreateInstance();
				});
			}

			function doCreateInstance() {
				var currentSelectedProjectId = constructionSystemMainInstanceService.getCurrentSelectedProjectId();
				var currentInstanceHeaderId = constructionSystemMainInstanceService.getCurrentInstanceHeaderId();

				if (!(angular.isNumber(currentSelectedProjectId) &&
					angular.isNumber(currentInstanceHeaderId))) {
					return platformModalService.showErrorBox('constructionsystem.main.entryError', 'Error');
				}

				var cosHeaders = _.filter(constructionSystemMainHeaderService.getList(), {IsChecked: true});

				constructionSystemMainInstanceService.updateAndExecute(function () {

					var parameter = {
						projectId: constructionSystemMainInstanceService.getCurrentSelectedProjectId(),
						modelId: constructionSystemMainInstanceService.getCurrentSelectedModelId(),
						cosInsHeaderId: constructionSystemMainInstanceService.getCurrentInstanceHeaderId(),
						cosHeaderIds: _.map(cosHeaders, 'Id'),
						onlyCreateHaveAssignObject: null,
						createAndCalculate: null,
						applyEstimateResultAutomatically: null
					};

					$http.post(globals.webApiBaseUrl + 'constructionsystem/main/instance/mtwoai/cosmapping', parameter).then(function (response) {
						var data = response.data;
						if (data) {
							platformModalService.showDialog({headerTextKey: 'cloud.common.informationDialogHeader', bodyTextKey: 'constructionsystem.main.aiCreateInstanceInfo', iconClass: 'ico-info'});
							if (data.job) {
								constructionSystemMainJobDataService.setList(_.union((constructionSystemMainJobDataService.getList()), [data.job]));
								constructionSystemMainJobDataService.setSelected(data.job);
							}
						} else {
							platformModalService.showMsgBox('constructionsystem.main.aiCreateInstanceError', 'Info', 'ico-warning');

						}
					});

				});
			}
		}
	]);
})(angular);
