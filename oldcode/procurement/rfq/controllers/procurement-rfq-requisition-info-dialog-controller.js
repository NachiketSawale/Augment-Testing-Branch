/**
 * Created by chi on 4/13/2016.
 */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.rfq';

	angular.module(moduleName).controller('procurementRfqRequisitionInfoDialogController', procurementRfqRequisitionInfoDialogController);

	procurementRfqRequisitionInfoDialogController.$inject = ['$scope', '$translate'];

	function procurementRfqRequisitionInfoDialogController($scope, $translate) {
		var translatePrefix = 'procurement.rfq.requisitionCreation.';
		$scope.value = $scope.modalOptions.value;

		initTranslation();
		initInfoTexts();
		initButton();

		// ///////////////////////
		function initTranslation() {
			$scope.modalOptions.headerText = $translate.instant(translatePrefix + 'warningDialogTitle');
			$scope.modalOptions.OkButtonText = $translate.instant('basics.common.button.ok');
			$scope.modalOptions.ProceedButtonText = $translate.instant('basics.common.button.proceed');
			$scope.modalOptions.CancelButtonText = $translate.instant('basics.common.button.cancel');
		}

		function initInfoTexts(){
			$scope.infoTexts = [];
			var infoText = {};
			var errIcon = 'tlb-icons ico-error';
			var warningIcon = 'tlb-icons ico-warning';

			if ($scope.value.isDiffCurrency) {
				infoText = {
					type: $translate.instant(translatePrefix + 'warningType.diffCurrency'),
					info: $translate.instant(translatePrefix + 'warningInfo.currencyInfo'),
					icon: errIcon
				};
				$scope.infoTexts.push(infoText);
			} else {
				if ($scope.value.isDiffConfiguration) {
					infoText = {
						type: $translate.instant(translatePrefix + 'warningType.diffConfiguration'),
						info: $translate.instant(translatePrefix + 'warningInfo.configurationInfo'),
						icon: warningIcon
					};
					$scope.infoTexts.push(infoText);
				}
				if ($scope.value.isDiffProcurementStructure) {
					infoText = {
						type: $translate.instant(translatePrefix + 'warningType.diffProcurementStructure'),
						info: $translate.instant(translatePrefix + 'warningInfo.procurementStructureInfo'),
						icon: warningIcon
					};
					$scope.infoTexts.push(infoText);
				}
			}
		}

		function initButton() {
			$scope.buttonStatus = {
				showOkButton: $scope.value.isDiffCurrency,
				showCancelAndProceedButton: !$scope.value.isDiffCurrency
			};

			$scope.modalOptions.ok = ok;
			$scope.modalOptions.proceed = proceed;
			$scope.modalOptions.cancel = cancel;

			// ////////////////////
			function ok() {
				$scope.$close(false);
			}

			function proceed() {
				$scope.$close(true);
			}

			function cancel() {
				$scope.$dismiss(false);
			}

		}
	}
})(angular);