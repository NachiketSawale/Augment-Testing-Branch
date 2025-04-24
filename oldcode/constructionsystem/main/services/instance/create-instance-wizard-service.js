(function (angular) {
	'use strict';
	/* global globals, Platform */
	var moduleName = 'constructionsystem.main';

	/**
	 * @ngdoc service
	 * @name constructionSystemMainCreateInstanceWizardService
	 * @function
	 * @requires
	 *
	 * @description
	 * #
	 * construnctionsystem.main wizard 'create instance' service.
	 */
	angular.module(moduleName).factory('constructionSystemMainCreateInstanceWizardService', [
		'_', '$translate', '$http', 'platformModalService', 'constructionSystemMainHeaderService', 'constructionSystemMainInstanceService', 'constructionSystemMainJobDataService',
		function (_, $translate, $http, platformModalService, constructionSystemMainHeaderService, constructionSystemMainInstanceService, constructionSystemMainJobDataService) {
			var _loadingStatus = false;

			var service = {};


			service.createInstance = function createInstance() {
				var currentSelectedProjectId = constructionSystemMainInstanceService.getCurrentSelectedProjectId();
				var currentInstanceHeaderId = constructionSystemMainInstanceService.getCurrentInstanceHeaderId();

				if (!(angular.isNumber(currentSelectedProjectId) &&
					angular.isNumber(currentInstanceHeaderId))) {
					return platformModalService.showErrorBox('constructionsystem.main.entryError', 'Error');
				}

				var cosHeaders = _.filter(constructionSystemMainHeaderService.getList(), {IsChecked: true});

				var disableCreateBySelectionStatement = false;
				if (_.isEmpty(cosHeaders)) {
					// return platformModalService.showDialog({
					//    headerTextKey: 'cloud.common.informationDialogHeader',
					//    bodyTextKey: 'constructionsystem.main.createInstanceInfo',
					//    iconClass: 'ico-info'
					// });

					disableCreateBySelectionStatement = true;
				}


				constructionSystemMainInstanceService.updateAndExecute(function () {
					var modalOptions = {
						templateUrl: globals.appBaseUrl + 'constructionsystem.main/partials/construction-system-main-create-instance.html',
						backDrop: false,
						windowClass: 'form-modal-dialog',
						resizeable: true,
						headerText: $translate.instant('constructionsystem.main.createInstanceWizard.title'),
						model: {
							disableCreateBySelectionStatement: disableCreateBySelectionStatement,
							createType: disableCreateBySelectionStatement ? 'createByBindingObjects': 'createBySelectionStatement', // createBySelectionStatement or createByBindingObjects
							onlyCreateHaveAssignObject: true,
							applyEstimateResultAutomatically: false
						},
						text: {
							createBySelectionStatement: $translate.instant('constructionsystem.main.createInstanceWizard.createBySelectionStatement'),
							onlyCreateHaveAssignObject: $translate.instant('constructionsystem.main.createInstanceWizard.onlyCreateHaveAssignObject'),
							createByBindingObjects: $translate.instant('constructionsystem.main.createInstanceWizard.createByBindingObjects'),
							applyEstimateResultAutomatically: $translate.instant('constructionsystem.main.createInstanceWizard.applyEstimateResultAutomatically'),
							evaluateAndCalculate: $translate.instant('constructionsystem.main.createInstanceWizard.evaluateAndCalculate'),
							modifyGlobalParameter: $translate.instant('constructionsystem.main.createInstanceWizard.modifyGlobalParameter'),
						}
					};

					platformModalService.showDialog(modalOptions);
				});
			};

			service.loadingStatusChanged = new Platform.Messenger();

			function setLoadingStatus (newStatus) {
				_loadingStatus = newStatus;
				service.loadingStatusChanged.fire(_loadingStatus);
			}

			service.close = new Platform.Messenger();

			function setClose(){
				service.close.fire();
				setLoadingStatus (false);
			}

			service.ok = function (result){
				setLoadingStatus (true);
				if (result.ok === true && Object.prototype.hasOwnProperty.call(result,'model')) {
					var cosHeaders = _.filter(constructionSystemMainHeaderService.getList(), {IsChecked: true});
					var parameter = {
						projectId: constructionSystemMainInstanceService.getCurrentSelectedProjectId(),
						modelId: constructionSystemMainInstanceService.getCurrentSelectedModelId(),
						cosInsHeaderId: constructionSystemMainInstanceService.getCurrentInstanceHeaderId(),
						cosHeaderIds: _.map(cosHeaders, 'Id'),
						createBySelectionStatement: result.model.createType === 'createBySelectionStatement',
						onlyCreateHaveAssignObject: result.model.onlyCreateHaveAssignObject,
						createByBindingObjects: result.model.createType === 'createByBindingObjects',
						createAndCalculate: result.model.evaluateAndCalculate,
						applyEstimateResultAutomatically: result.model.applyEstimateResultAutomatically
					};

					parameter.cosHeader2Templates = [];
					_.forEach(cosHeaders, function (cosHeader) {
						if(cosHeader.CosTemplateFk !== null){
							var cosHeader2Template = {
								cosHeaderId: cosHeader.Id,
								cosTemplateId: cosHeader.CosTemplateFk
							};
							parameter.cosHeader2Templates.push(cosHeader2Template);
						}
					});

					$http.post(globals.webApiBaseUrl + 'constructionsystem/main/instance/createinstance', parameter).then(function (response) {
						if(response.data.JobId){
							checkImportState(response.data.JobId);
						}else{
							ImportFinish(null);
						}
					});
				}

				function checkImportState(jobId) {
					$http.get(globals.webApiBaseUrl + 'constructionsystem/main/instance/createstate?jobId=' + jobId)
						.then(function (response) {
							if (response.data) {
								var data = response.data;
								ImportFinish(data);
							} else {
								setTimeout(function () {
									checkImportState(jobId);
								}, 5000);
							}
						},function () {
							setClose();
						});
				}

				function ImportFinish(data){
					if (data && data.instances && data.instances.length > 0) {
						angular.forEach(data.instances, function (item) {
							item.IsChecked = true;
						});
						var readData = {
							dtos: data.instances,
							CostGroupToSave: _.flatten(_.map(_.filter(data.instances, function (instance) {
								return instance.CostGroups && instance.CostGroups.length > 0;
							}), function (item) {
								return item.CostGroups;
							}))
						};
						constructionSystemMainInstanceService.syncCostGroups(readData.dtos, [readData]);
						constructionSystemMainInstanceService.setList(_.union((constructionSystemMainInstanceService.getList()), data.instances));
						constructionSystemMainInstanceService.setSelected(data.instances[0]);
						if (result.model.evaluateAndCalculate && data.job) {
							constructionSystemMainJobDataService.setList(_.union([data.job], (constructionSystemMainJobDataService.getList())));
							constructionSystemMainJobDataService.setSelected(data.job);
						}
					} else {
						if(result.model.createType === 'createBySelectionStatement'){
							platformModalService.showMsgBox('constructionsystem.main.createInstanceWizard.searchResult', 'cloud.common.informationDialogHeader', 'info');
						}else{
							platformModalService.showMsgBox('constructionsystem.main.createInstanceWizard.noBindObjects', 'cloud.common.informationDialogHeader', 'info');
						}
					}
					setClose();
				}

			};


			return service;
		}
	]);
})(angular);