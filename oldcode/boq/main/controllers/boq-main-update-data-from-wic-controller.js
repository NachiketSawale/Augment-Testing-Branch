(function () {
	/* global globals */
	'use strict';
	var moduleName = 'boq.main';
	angular.module(moduleName).controller('boqMainUpdateDataFromWicController', ['$scope', '$translate', 'boqMainUpdateDataFromWicDataService', 'boqMainService', function ($scope, $translate, boqMainUpdateDataFromWicDataService, boqMainService) {
		$scope.path = globals.appBaseUrl;
		// $scope.modalTitle = boqMainUpdateDataFromWicDataService.getDialogTitle();
		$scope.modalOptions.headerText = boqMainUpdateDataFromWicDataService.getDialogTitle();
		$scope.dataItem = boqMainUpdateDataFromWicDataService.getDataItem();

		var formConfig = boqMainUpdateDataFromWicDataService.getFormConfiguration();

		$scope.formOptions = {
			configure: formConfig
		};

		$scope.formContainerOptions = {
			formOptions: $scope.formOptions,
			setTools: function () {
			}
		};

		if (boqMainService.getSelectedHeaderFk()) {
			$scope.dataItem.BoqHeaderId = boqMainService.getSelectedHeaderFk();
		}

		if (boqMainService.getSelected()) {
			$scope.dataItem.FromBoqItemId = boqMainService.getSelected().Id;
			$scope.dataItem.ToBoqItemId = boqMainService.getSelected().Id;
		} else if (boqMainService.getRootBoqItem()) {
			var rootBoqItem = boqMainService.getRootBoqItem();
			$scope.dataItem.FromBoqItemId = rootBoqItem.Id;
			$scope.dataItem.ToBoqItemId = rootBoqItem.Id;
		}

		if ($scope.dataItem) {
			$scope.dataItem.Userdefined1 = null;
			$scope.dataItem.Userdefined2 = null;
			$scope.dataItem.Userdefined3 = null;
			$scope.dataItem.Userdefined4 = null;
			$scope.dataItem.Userdefined5 = null;

			$scope.dataItem.OutSpecification = null;
			$scope.dataItem.BasUomFk = null;
			$scope.dataItem.Reference2 = null;
			$scope.dataItem.PrcStructureFk = null;
			$scope.dataItem.CopyPricecondition = false;
			$scope.dataItem.CopyDocument = false;

			$scope.dataItem.WorkContent = null;
			$scope.dataItem.PrjCharacterFk = null;
			$scope.dataItem.TextConfigurationFk = null;

			$scope.dataItem.TextComplementsFk = null;
			$scope.dataItem.BasBlobsSpecificationFk = null;
			$scope.dataItem.IsOverWrite = true;
		}

		$scope.onOK = function () {
			var data = $scope.dataItem;
			if (data) {
				boqMainUpdateDataFromWicDataService.ValidatiePrjBoqItemAssigedWic(data).then(function (responseData) {
					if (responseData) {
						$scope.assignError.show = responseData.data;
						if (!responseData.data) {
							$scope.$close({ok: true, data: $scope.dataItem});
						}
					}
				});
			}

		};

		$scope.onCancel = function () {
			$scope.dataItem.__rt$data.errors = null;
			$scope.$close({});
		};

		$scope.onClose = function () {
			$scope.dataItem.__rt$data.errors = null;
			$scope.$close(false);
		};

		$scope.modalOptions.cancel = function () {
			$scope.dataItem.__rt$data.errors = null;
			$scope.$close(false);
		};

		$scope.change = function change(item, model) {
			if (model === 'FromBoqItemId' || model === 'ToBoqItemId') {
				boqMainUpdateDataFromWicDataService.ValidatiePrjBoqItemAssigedWic(item).then(function (responseData) {
					if (responseData) {
						$scope.assignError.show = responseData.data;
					}
				});
			}
		};

		$scope.hasErrors = function checkForErrors() {
			$scope.assignError.show;
		};

		$scope.assignError = {
			show: false,
			messageCol: 1,
			message: $translate.instant('boq.main.AssignmentError'),
			iconCol: 1,
			type: 3
		};
	}]);
})(angular);
