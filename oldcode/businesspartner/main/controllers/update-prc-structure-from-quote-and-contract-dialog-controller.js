/**
 * Created by chi on 06/30/2021.
 */
(function (angular) {
	'use strict';

	var moduleName = 'businesspartner.main';

	angular.module(moduleName).controller('businessPartnerMainUpdatePrcStructureFromQtnNConDialogController', businessPartnerMainUpdatePrcStructureFromQtnNConDialogController);

	businessPartnerMainUpdatePrcStructureFromQtnNConDialogController.$inject = ['$scope', '$translate', '_', '$http', 'globals', 'platformModalService', 'businesspartnerMainProcurementStructureDataService'];

	function businessPartnerMainUpdatePrcStructureFromQtnNConDialogController($scope, $translate, _, $http, globals, platformModalService, businesspartnerMainProcurementStructureDataService) {

		$scope.data = {
			quoteStatuses: [],
			quoteStatusId: 0,
			contractStatuses: [],
			contractStatusId: 0,
			from: null,
			to: null
		};

		$scope.text = {
			quoteStatus: $translate.instant('businesspartner.main.updatePrcStructureWizard.label.quoteStatus'),
			contractStatus: $translate.instant('businesspartner.main.updatePrcStructureWizard.label.contractStatus'),
			from: $translate.instant('businesspartner.main.updatePrcStructureWizard.label.from'),
			to: $translate.instant('businesspartner.main.updatePrcStructureWizard.label.to'),
			processingInfo: $translate.instant('platform.processing')
		};

		$scope.config = {
			status: {
				rt$hasError: function () {
					return $scope.data.quoteStatuses.length === 0 && $scope.data.contractStatuses.length === 0;
				},
				rt$errorText: function () {
					if ($scope.config.status.rt$hasError()) {
						return $translate.instant('businesspartner.main.updatePrcStructureWizard.error.emptyQuoteOrContractStatus', {quoteStatus: $scope.text.quoteStatus, contractStatus: $scope.text.contractStatus});
					}
				}
			},
			date: {
				rt$hasError: function () {
					return $scope.data.from && $scope.data.to && $scope.data.from > $scope.data.to;
				},
				rt$errorText: function () {
					if ($scope.config.date.rt$hasError()) {
						return $translate.instant('businesspartner.main.updatePrcStructureWizard.error.validFromToDate', {from: $scope.text.from, to: $scope.text.to});
					}
				}
			}
		};

		$scope.update = update;
		$scope.canUpdate = canUpdate;
		$scope.isProcessing = false;

		// ////////////////////////////

		function canUpdate() {
			return !$scope.config.status.rt$hasError() && !$scope.config.date.rt$hasError();
		}

		function update() {
			var request = {};
			request.SubsidiaryIds = $scope.modalOptions.subpIds;
			request.QuoteStatusIds = _.map($scope.data.quoteStatuses, 'Id');
			request.ContractStatusIds = _.map($scope.data.contractStatuses, 'Id');
			request.DateFrom = $scope.data.from;
			request.DateTo = $scope.data.to;
			$scope.isProcessing = true;

			$http.post(globals.webApiBaseUrl + 'businesspartner/main/businesspartnermain/updateprcstructurefromquotencontract', request)
				.then(function (response) {
					var count = response && response.data || 0;
					var msgBoxOptions = {};
					msgBoxOptions.bodyText = $translate.instant('businesspartner.main.updatePrcStructureWizard.result', {count: count});
					msgBoxOptions.headerTextKey = $scope.modalOptions.headerTextKey;
					msgBoxOptions.iconClass = 'ico-info';
					msgBoxOptions.windowClass = 'msgbox';
					platformModalService.showDialog(msgBoxOptions)
						.then(function () {
							$scope.isProcessing = false;
							if (count > 0) {
								businesspartnerMainProcurementStructureDataService.reloadData();
							}
							$scope.modalOptions.ok();
						});
				}, function () {
					$scope.isProcessing = false;
					$scope.modalOptions.cancel();
				});
		}
	}
})(angular);