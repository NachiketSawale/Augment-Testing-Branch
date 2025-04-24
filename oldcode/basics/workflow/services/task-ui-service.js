(function (angular) {
	'use strict';

	var moduleName = 'basics.workflow';

	function taskUiService(_, $q, basicsWorkflowInstanceService, platformModuleNavigationService, basicsWorkflowMasterDataService,
	                       basicsWorkflowModuleUtilService, basicsWorkflowTaskPopUpService, basicsWorkflowUIService,
	                       basicsWorkflowCommonService) {
		function addProcessingFns(obj, responseFn) {

			function setCurrentUser(item) {
				basicsWorkflowMasterDataService.getCurrentClerk().then(function (response) {
					item.ProgressById = response.Id;
					changeProgressedByUser(item.id, item.ProgressById);
				});

			}

			function changeProgressedByUser(id, userId) {
				basicsWorkflowInstanceService.changeProgressedByUser(id, userId).then(responseFn);
			}

			obj.edit = setCurrentUser;
			obj.take = setCurrentUser;
			obj.cancel = function cancelEditTask(item) {
				item.ProgressById = null;
				item.Owner = null;
				changeProgressedByUser(item.id, null);
			};
		}

		function addNavigationFns(obj, ctrl) {
			obj.ok = function (selectedItem) {
				var promises = _.map(basicsWorkflowCommonService.getFnList(),function (fn) {
					return fn();
				});
				$q.all(promises).then(function (response) {
					basicsWorkflowCommonService.clearFn();
				basicsWorkflowInstanceService.continueWorkflow(selectedItem);
				basicsWorkflowTaskPopUpService.removeFromNotShowList(selectedItem.Id);
				selectedItem.Status = 4;
				ctrl.updateView();
				ctrl.detailFn.switchListDetail();
				basicsWorkflowUIService.removeItemAndRefreshList('basics.workflowTask', selectedItem);
				});
			};
			obj.break = function (selectedItem) {
				basicsWorkflowInstanceService.escalateTask(selectedItem.id);
				basicsWorkflowTaskPopUpService.removeFromNotShowList(selectedItem.Id);
				selectedItem.Status = 3;
				ctrl.updateView();
				ctrl.detailFn.switchListDetail();
				basicsWorkflowUIService.removeItemAndRefreshList('basics.workflowTask', selectedItem);
			};

			obj.okNext = function (selectedItem) {
				basicsWorkflowInstanceService.continueWorkflow(selectedItem);
				basicsWorkflowTaskPopUpService.removeFromNotShowList(selectedItem.Id);
				selectedItem.Status = 4;
				obj.nextTask();
				basicsWorkflowModuleUtilService.refreshSelected();
			};

			obj.save = function (selectedItem) {
				basicsWorkflowInstanceService.saveTask(selectedItem).then(function () {
					// Do something
				});
			};

			obj.goToDesigner = function (selectedItem) {
				platformModuleNavigationService.navigate({moduleName: moduleName}, selectedItem);
			};
		}

		return {
			addProcessingFns: addProcessingFns,
			addNavigationFns: addNavigationFns,
			processingButtonState: {
				no: 0,
				edit: 1,
				cancle: 2,
				inProgress: 3
			}
		};
	}

	taskUiService.$inject = ['_', '$q', 'basicsWorkflowInstanceService', 'platformModuleNavigationService',
		'basicsWorkflowMasterDataService', 'basicsWorkflowModuleUtilService', 'basicsWorkflowTaskPopUpService', 'basicsWorkflowUIService',
		'basicsWorkflowCommonService'];

	angular.module(moduleName).factory('basicsWorkflowTaskUiService', taskUiService);
})(angular);
