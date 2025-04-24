/**
 * @author: chd
 * @date: 10/19/2020 5:31 PM
 * @description:
 */

/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	'use strict';
	/* global globals */
	let moduleName = 'estimate.main';
	angular.module(moduleName).controller('estimateMainLineItemsCostGroupSelectLevelController', [
		'$scope',
		'$translate',
		'$http',
		'platformModalService',
		'estimateMainService',
		function ($scope,
			$translate,
			$http,
			platformModalService,
			estimateMainService) {

			$scope.modalOptions = {
				lineItemsCostGroupMapping: $translate.instant('estimate.main.aiWizard.lineItemsCostGroupMapping'),

				selectCostGroupLevelTitle: $translate.instant('estimate.main.aiWizard.selectCostGroupLevelTitle'),
				projectLevel: $translate.instant('estimate.main.aiWizard.projectLevel'),
				enterpriseLevel: $translate.instant('estimate.main.aiWizard.enterpriseLevel'),
				levelSelect: '1',

				btnCancelText: $translate.instant('cloud.common.cancel'),
				btnNextText: $translate.instant('cloud.common.nextStep'),

				dialogLoading: false,
				loadingInfo: '',

				btnNextStatus: true,
				btnOkStatus: false,

				onNext: function onNext() {

					let params = {
						gridId: '5F75BAA8D1CC48BA956BF0D9D3E1A68B',
						mappingData: null,
						levelSelect: $scope.modalOptions.levelSelect,
						uuid: '6F75ABA8D1CD48BA956BF0D9D3E1A86B'
					};

					function lineCostGroupMap() {

						let modalOptions = {
							templateUrl: globals.appBaseUrl + 'estimate.main/templates/wizard/ai/line-items-cost-group-ai-mapping.html',
							backdrop: false,
							windowClass: 'form-modal-dialog',
							lazyInit: true,
							resizeable: true,
							width: '70%',
							height: '70%',
							params: params
						};
						estimateMainService.updateAndExecute(function () {
							platformModalService.showDialog(modalOptions);
							$scope.$close({ok: true});
						});
					}

					lineCostGroupMap();
				},

				onCancel: onCancel,
				cancel: onCancel
			};

			function onCancel() {
				$scope.$close(false);
			}
		}]
	);

})(angular);
