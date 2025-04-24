
(function (angular) {
	'use strict';
	let moduleName = 'procurement.rfq';

	angular.module(moduleName).controller('procurementRfqPartialReqAssignedDialogController', procurementRfqPartialReqAssignedDialogController);

	procurementRfqPartialReqAssignedDialogController.$inject = ['$scope', '$translate',
		'procurementRfqPartialreqAssignedDataDirectiveDataService', '_',
		'procurementRfqMainService',
		'procurementRfqBusinessPartnerService'];

	function procurementRfqPartialReqAssignedDialogController($scope, $translate,
		procurementRfqPartialreqAssignedDataDirectiveDataService, _,
		procurementRfqMainService,
		procurementRfqBusinessPartnerService) {
		$scope.modalOptions = {
			headerText: $translate.instant('procurement.rfq.partialReqAssigned'),
			cancel: function () {
				$scope.$close(false);
			}
		};

		$scope.isRunning = false;
		$scope.disabledOk = disabledOk;
		$scope.ok = ok;

		// /////////////////
		function disabledOk() {
			let dataSelected = procurementRfqPartialreqAssignedDataDirectiveDataService.getSelectedData();
			if (_.isEmpty(dataSelected)) {
				return true;
			}

			let countInGroup = {};
			let uniqueValidation = true;
			_.forEach(dataSelected, function (item) {
				let id = item.Pid || item.Id;
				if (countInGroup[id]) {
					countInGroup[id] += 1;
					uniqueValidation = false;
				} else {
					countInGroup[id] = 1;
				}
			});

			return !uniqueValidation;
		}

		function ok() {
			procurementRfqPartialreqAssignedDataDirectiveDataService.storeChanges();
			$scope.isRunning = true;
			procurementRfqMainService.update()
				.finally(function (validationResult) {
					if (_.isBoolean(validationResult) && !validationResult) {
						return;
					}
					$scope.isRunning = false;
					procurementRfqBusinessPartnerService.gridRefresh();
					$scope.$close();
				});
		}
	}

})(angular);