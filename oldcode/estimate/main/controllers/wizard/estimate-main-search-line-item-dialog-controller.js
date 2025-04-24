/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	/* global _ */
	'use strict';

	/**
	 * @ngdoc controller
	 * @name estimateMainSearchLineItemDialogController
	 * @requires $scope
	 * @description
	 * #
	 * estimateMainSearchLineItemDialogController
	 */
	/* jshint -W072 */
	angular.module('estimate.main').controller('estimateMainSearchLineItemDialogController', [
		'$scope', '$translate', '$timeout', '$interval', 'platformGridAPI', 'basicsCommonDialogGridControllerService', 'estimateMainSearchLineItemDialogService',
		function ($scope, $translate, $timeout, $interval, platformGridAPI, dialogGridControllerService, estSearchLineItemDialogService) {

			let requestData = null;

			$scope.options = $scope.$parent.modalOptions;
			$scope.isOkDisabled = true;

			$scope.modalOptions = {
				headerText: $scope.options.headerText,
				closeButtonText: $translate.instant('basics.common.cancel'),
				actionButtonText: $translate.instant('basics.common.ok')
			};

			$scope.modalOptions.ok = function onOK() {
				$scope.$close({ok: true});
			};

			$scope.modalOptions.close = function onCancel() {
				$scope.$close({ok: false});
			};

			$scope.modalOptions.cancel = function cancel() {
				$scope.$close({ok: false});
			};

			// Intervals created by this service must be explicitly destroyed when you are finished with them
			$scope.$on('$destroy', function () {
				stopRequestData();
			});

			let gridConfig = {
				initCalled: false,
				columns: [],
				grouping: false,
				uuid: $scope.options.uuid
			};

			dialogGridControllerService.initListController($scope, $scope.options.columns, estSearchLineItemDialogService.dataService, null, gridConfig);

			$timeout(function () {
				platformGridAPI.grids.resize($scope.options.uuid);
				startInquiryData();
			});

			function startInquiryData() {
				if (angular.isFunction($scope.options.inquiryDataFn)) {
					$scope.options.inquiryDataFn($scope.options.requestId);

					// request data every 5 second until user saved the selected items from lineitem dialog.
					requestData = $interval(function () {
						if (angular.isFunction($scope.options.requestDataFn)) {
							$scope.options.requestDataFn($scope.options.requestId).then(function (response) {

								if (response && _.isArray(response.data) && response.data.length > 0) {
									stopRequestData();
									estSearchLineItemDialogService.dataService.setList(response.data);
									$scope.isOkDisabled = false;
								}
							});
						}
					}, 5000);
				}
			}

			function stopRequestData() {
				if (requestData) {
					$interval.cancel(requestData);
					requestData = null;
				}
			}
		}
	]);
})(angular);
