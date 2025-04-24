/**
 * Created by xia on 4/10/2018.
 */

(function (angular) {
	/* global globals, _ */
	'use strict';

	var moduleName = 'boq.main';

	angular.module(moduleName).controller('boqMainGenerateWicNumberController', ['$scope', 'boqMainGenerateWicNumberDataService', 'boqMainLookupFilterService',
		'boqHeaderLookupDataService', 'boqMainBoqLookupService', 'boqMainService', 'basicsLookupdataLookupFilterService', 'estimateProjectRateBookConfigDataService',
		function ($scope, boqMainGenerateWicNumberDataService, boqMainLookupFilterService,
			boqHeaderLookupDataService, boqMainBoqLookupService, boqMainService, basicsLookupdataLookupFilterService, estimateProjectRateBookConfigDataService) {

			$scope.path = globals.appBaseUrl;
			// $scope.modalTitle = boqMainGenerateWicNumberDataService.getDialogTitle();
			if ($scope.modalOptions) {
				$scope.modalOptions.headerText = boqMainGenerateWicNumberDataService.getDialogTitle();
			}
			$scope.dataItem = boqMainGenerateWicNumberDataService.getDataItem();

			var formConfig = boqMainGenerateWicNumberDataService.getFormConfiguration();

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
				$scope.dataItem.GeneratePreLineItems = false;
			}

			$scope.initialize = function initialize() {

				$scope.dataItem.__rt$data = {
					readonly: []
				};

				$scope.setReadonly($scope.dataItem.ComparisonProperty);
			};

			$scope.setReadonly = function setReadonly(value) {

				if (value === 1) {
					$scope.dataItem.__rt$data.readonly = [
						{'field': 'CompareNumberUpTo', 'readonly': true}];

					if (boqMainService.isFreeBoq()) {
						$scope.dataItem.__rt$data.readonly.push({'field': 'BoqLineTypeFk', 'readonly': true});
					}
				} else if (value === 2) {
					$scope.dataItem.__rt$data.readonly = [
						{'field': 'BoqLineTypeFk', 'readonly': true},
						{'field': 'IgnoreIndex', 'readonly': true}];
				}else{
					$scope.dataItem.__rt$data.readonly = [
						{'field': 'CompareNumberUpTo', 'readonly': true},
						{'field': 'BoqLineTypeFk', 'readonly': true},
						{'field': 'IgnoreIndex', 'readonly': true}];
				}
			};

			$scope.initialize();

			$scope.change = function change(item, model) {
				if (model === 'WicGroupId') {
					item.WicBoqItemId = null;
					item.WicBoqHeaderId = null;
				}
			};

			$scope.onSelectionChanged = function (value) {
				$scope.dataItem.ComparisonProperty = value;
				$scope.setReadonly(value);
				if (value === 2 || value === 3) {
					$scope.dataItem.BoqLineTypeFk = null;
				}
			};

			$scope.hasErrors = function checkForErrors() {
				if (!$scope.dataItem.WicGroupId || !$scope.dataItem.WicBoqHeaderId) {
					return true;
				}
				return false;
			};

			// using master data filter for the wic group lookup
			var filterIds = estimateProjectRateBookConfigDataService.getFilterIds(3);
			var filters = [
				{
					key: 'generate-wic-number-wic-group-master-data-filter',
					fn: function (item) {
						if (filterIds && filterIds.length > 0) {
							return _.includes(filterIds, item.Id);
						}
						return true;
					}
				}
			];

			basicsLookupdataLookupFilterService.registerFilter(filters);

			$scope.onOK = function () {
				$scope.$close({ok: true, data: $scope.dataItem});
			};

			$scope.onCancel = function () {
				basicsLookupdataLookupFilterService.unregisterFilter(filters);
				$scope.dataItem.__rt$data.errors = null;
				$scope.$close({});
			};

			$scope.onClose = function () {
				basicsLookupdataLookupFilterService.unregisterFilter(filters);
				$scope.dataItem.__rt$data.errors = null;
				$scope.$close(false);
			};

			if ($scope.modalOptions) {
				$scope.modalOptions.cancel = function () {
					$scope.dataItem.__rt$data.errors = null;
					$scope.$close(false);
				};
			}

		}]);
})(angular);
