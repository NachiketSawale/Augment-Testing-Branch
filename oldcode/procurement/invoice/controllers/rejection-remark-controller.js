(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	/**
	 * @ngdoc controller
	 * @name procurementInvoiceRemarkController
	 * @require $scope, procurementInvoiceHeaderDataService, procurementContractHeaderFormConfigurations, invoiceHeaderElementValidationService, platformFormControllerBase,platformTranslateService, platformFormConfigService
	 * @description controller for contract header's form view
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.invoice').controller('procurementInvoiceRemarkController',
		['$scope', 'procurementInvoiceHeaderDataService',
			function ($scope, parentService ) {

				$scope.rejectionremark='';

				function parentSelectionChange(e, parentItem) {
					$scope.rejectionremark=parentItem.RejectionRemark;
				}
				parentService.registerSelectionChanged(parentSelectionChange);
				$scope.$watch('rejectionremark', function (newValue) {
					let parentParm =  parentService.getSelected();
					if (parentParm) {
						if(parentParm.InvStatus) {
							$scope.rj_disabled = parentParm.InvStatus.IsReadOnly === true;
						}else{
							$scope.rj_disabled = false;
						}
						if (parentParm.RejectionRemark !== newValue) {
							parentParm.RejectionRemark = newValue;
							parentService.markItemAsModified(parentParm);
						}
					}else{
						$scope.rj_disabled = true;
					}

				});



			}
		]);

})(angular);