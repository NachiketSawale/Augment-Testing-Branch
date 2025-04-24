(function (angular) {
	'use strict';

	function basicsWorkflowExportTemplatesController(_, $scope, basicsWorkflowTemplateService, keyCodes, $translate, platformDialogService) {

		$scope.selectedTemplatedList = [];
		$scope.selectedExportOptions = [];

		//export options Objects
		$scope.exportOptions = {
			statusMatrix: true,
			subscribedEvents: true,
			versionContext: true,
			wizardDefinition: false,
			schedulerDefinition: false,
			allVersions: false,
			fileName: 'templateZipPackage'
		};

		//Wait for loading the downloading. after clicking the wait spinner comes up
		$scope.waitSpinner = false;

		//Search the requested text in the search bar.
		$scope.onSearchInputKeydown = function (event, filterString) {
			if (event.keyCode === keyCodes.ENTER) {
				$scope.executeSearch(filterString);
			}
		};

		//Execute the search function and call the search service call.
		$scope.executeSearch = function (searchValue) {
			searchValue = searchValue ? searchValue : '';
			basicsWorkflowTemplateService.getFilteredExportList(searchValue).then(function (resultList) {
				//$scope.templateList = resultList;
				$scope.templateList = _.filter(resultList, function (item) {
					return !_.find($scope.selectedTemplatedList, {Id: item.Id});
				});
			});
		};

		//Button to call the Download.
		var downloadCall = $scope.dialog.getButtonById('Download');

		downloadCall.fn = function () {
			var templateIdList = _.map($scope.selectedTemplatedList, 'Id');         //An array of the Template Ids.
			$scope.testSpinning = true;
			basicsWorkflowTemplateService.exportZippedTemplates(templateIdList, $scope.exportOptions)
				.then(function () {
					$scope.waitSpinner = false;//Remove wait spinner
					$scope.dialog.cancel();//close modal dialog or main wizard dialog manually.
					platformDialogService.showMsgBox('basics.workflow.exportZipWizard.successMsz.successExportBodyText', 'basics.workflow.exportZipWizard.successMsz.successExportHeader', 'info');
				});
		};

		//Download Button disable untill atleast one template is selected.
		downloadCall.disabled = function () {
			return $scope.selectedTemplatedList.length === 0;
		};

		//Create template list with checked/selected one's
		$scope.chnagecheckbox = function (template) {
			$scope.selectedTemplatedList.push(template);
		};

		//Remove template from the list which are checked/selected one's
		$scope.changeRemoveItem = function (selectedItem) {
			_.remove($scope.selectedTemplatedList, {Id: selectedItem.Id});
			$scope.templateList.push(selectedItem);
			$scope.templateList = _.sortBy($scope.templateList, 'Id');
		};

		//Status Matrix Object
		$scope.statusMatrixOpt = {
			ctrlId: 'statusMatrix',
			labelText: $translate.instant('basics.workflow.exportZipWizard.templateExportOptionsTab.statusMatrix')
		};

		//Subscribed Events Object
		$scope.subscribedEventsOpt = {
			ctrlId: 'subscribedEvents',
			labelText: $translate.instant('basics.workflow.exportZipWizard.templateExportOptionsTab.subscribedEvents')
		};

		//Version Context Object
		$scope.versionContextOpt = {
			ctrlId: 'versionContext',
			labelText: $translate.instant('basics.workflow.exportZipWizard.templateExportOptionsTab.versionContext')
		};

		// for future task!
		// //Wizard definition Object
		// $scope.wizardDefinitionOpt = {
		//     ctrlId: 'wizardDefinition',
		//     labelText: $translate.instant('basics.workflow.exportZipWizard.templateExportOptionsTab.wizardDefinition')
		// };
		//
		// //scheduler definition Object
		// $scope.schedulerDefinitionOpt = {
		//     ctrlId: 'schedulerDefinition',
		//     labelText: $translate.instant('basics.workflow.exportZipWizard.templateExportOptionsTab.schedulerDefinition')
		// };
		//
		// //All Versions Object
		// $scope.allVersionsOpt = {
		//     ctrlId: 'allVersions',
		//     labelText: $translate.instant('basics.workflow.exportZipWizard.templateExportOptionsTab.allTemplateVersions')
		// };
	}

	basicsWorkflowExportTemplatesController.$inject = ['_', '$scope', 'basicsWorkflowTemplateService', 'keyCodes', '$translate', 'platformDialogService'];

	angular.module('basics.workflow').controller('basicsWorkflowExportTemplatesController', basicsWorkflowExportTemplatesController);

})(angular);
