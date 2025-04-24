(function () {
	'use strict';

	function importWizardCtrl($scope, basicsWorkflowUploadService, basicsWorkflowTemplateService, platformDialogService) {
		$scope.templateList = [];
		$scope.destinationList = [];

		basicsWorkflowTemplateService.getListHeader().then(function (response) {
			_.forEach(response, function (item) {
				if (item.Description) {
					item.SearchPattern = item.Description.trim().toUpperCase();
				}
				$scope.destinationList.push(item);
			});
		});
		$scope.upload = function () {
			basicsWorkflowUploadService.uploadFile('.zip, .json').then(function (result) {
				basicsWorkflowTemplateService.analyseImportSource(result.data.FileArchiveDocId).then(prepareList);
			});
		};
		$scope.add = function () {
			if ($scope.source && $scope.source.length > 0) {
				basicsWorkflowTemplateService.analyseImportSource($scope.source).then(prepareList);
			}
		};

		function prepareList(result) {
			_.forEach(result.data, function (item) {
				item.Selected = true;
				var destination = _.find($scope.destinationList, {'SearchPattern': item.Description.trim().toUpperCase()});
				if (destination) {
					item.DestinationId = destination.Id;
				}
				$scope.templateList.push(item);
			});
			$scope.source = '';
		}

		//Wait for loading the downloading. after clicking the wait spinner comes up
		$scope.waitSpinner = false;

		//Button to call the Import.
		var importCall = $scope.dialog.getButtonById('create');

		importCall.fn = function () {
			var list = _.filter($scope.templateList, {'Selected': true});
			$scope.testSpinning = true;
			basicsWorkflowTemplateService.importZippedTemplates(list)
				.then(function () {
					$scope.waitSpinner = false;						//Remove wait spinner
					$scope.dialog.cancel();							//close modal dialoag or main wizard dialog manually.
					platformDialogService.showMsgBox('basics.workflow.exportZipWizard.successMsz.successImportBodyText', 'basics.workflow.exportZipWizard.successMsz.successImportHeader', 'info');
				});
		};

		//Download Button disable untill atleast one template is selected.
		importCall.disabled = function () {
			var list = _.filter($scope.templateList, {'Selected': true});
			return list.length === 0;
		};

	}

	importWizardCtrl.$inject = ['$scope', 'basicsWorkflowUploadService', 'basicsWorkflowTemplateService', 'platformDialogService'];

	angular.module('basics.workflow').controller('basicsWorkflowImportWizardController', importWizardCtrl);
})();