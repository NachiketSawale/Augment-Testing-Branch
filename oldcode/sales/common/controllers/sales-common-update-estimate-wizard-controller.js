/**
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function () {

	'use strict';

	let moduleName = 'sales.common';
	angular.module(moduleName).controller('salesCommonUpdateEstimateController',
		['_', '$scope', 'salesCommonUpdateEstimateUIService', 'salesCommonUpdateEstimateWizardService',
			function (_, $scope, salesCommonUpdateEstimateUIService, salesCommonUpdateEstimateWizardService) {
				let okBtn = $scope.dialog.getButtonById('ok');

				$scope.entity = {
					isLinkedBoqItem: true,
					isLineItemForNewBoq: true,
					estimateFk: null
				};

				// pre-select the lookup with 'default' estimate
				salesCommonUpdateEstimateWizardService.getDefaultEstimate().then(function (estimateHeader) {
					$scope.entity.estimateFk = _.has(estimateHeader, 'Id') ? estimateHeader.Id : null;
				});

				$scope.formOptionsSettings = {
					configure: salesCommonUpdateEstimateUIService.getLayoutConfig({
						getProjectId: function () {
							return salesCommonUpdateEstimateWizardService.getCurrentProjectId();
						}
					})
				};
				okBtn.disabled = function () { // OK Button logic
					if (_.isNil($scope.entity.estimateFk)) {
						return true;
					}
					$scope.dialog.modalOptions.value.isLinkedBoqItem = $scope.entity.isLinkedBoqItem;
					$scope.dialog.modalOptions.value.isLineItemForNewBoq = $scope.entity.isLineItemForNewBoq;
					$scope.dialog.modalOptions.value.estimateFk = $scope.entity.estimateFk;
				};
			}
		]);

})();
