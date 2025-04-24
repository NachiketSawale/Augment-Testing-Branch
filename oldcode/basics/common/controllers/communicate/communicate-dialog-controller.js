(function (angular) {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name basicsCommonCommunicateDialogController
	 * @requires $scope
	 * @description
	 * #
	 * Controller for communication dialog for send email/fax.
	 */
	/* jshint -W072 */
	angular.module('basics.common').controller('basicsCommonCommunicateDialogController', [
		'$scope', '$translate', '$http', '$injector', '$timeout', '_', 'platformModalService', 'basicsCommonCommunicateAccountService',
		function ($scope, $translate, $http, $injector, $timeout, _, platformModalService, communicateAccountService) {

			const options = $scope.$parent.modalOptions;
			const dataService1 = options.dataServiceOfGroup1 ? $injector.get(options.dataServiceOfGroup1) : null;
			const dataService2 = options.dataServiceOfGroup2 ? $injector.get(options.dataServiceOfGroup2) : null;
			let isBtnSendDisable = false;
			let isBtnPreviewDisable = true;

			$scope.modalOptions = {
				closeButtonText: $translate.instant('basics.common.button.close'),
				actionButtonText: $translate.instant('basics.common.button.send'),
				previewButtonText: $translate.instant('basics.common.button.preview'),
				headerText: options.headerText,
				isBtnSendDisable: false,
				isLoading: false,
				isBtnPreviewShow: options.isBtnPreviewShow || false,
				isBtnPreviewDisable: true
			};

			$scope.containerOptions = {
				formOptions: {
					configure: options.dialogFormConfig
				}
			};

			/**
			 * preview the selected report.
			 */
			$scope.modalOptions.preview = function preview() {
				if (options.previewReportFn && _.isFunction(options.previewReportFn)) {
					options.previewReportFn(options.communicateType);
				}
			};

			$scope.modalOptions.ok = function onOK() {
				const dataInfo = getEmailOrFaxInfo();

				// receiver's email address or fax number should have value.
				// (1) special data object used for rfq wizard 'send email'
				if (dataInfo.EmailInfo && dataInfo.EmailInfo.Receivers && _.isEmpty(dataInfo.EmailInfo.Receivers)) {
					return platformModalService.showMsgBox(options.recipientText, 'cloud.common.informationDialogHeader', 'ico-info');
				}
				// (2) common data object used
				if (dataInfo.Receivers && _.isEmpty(dataInfo.Receivers)) {
					return platformModalService.showMsgBox(options.recipientText, 'cloud.common.informationDialogHeader', 'ico-info');
				}

				$scope.modalOptions.isBtnSendDisable = true;
				$scope.modalOptions.isLoading = true;

				// begin to send email or fax.
				$http({
					method: 'POST',
					url: options.url,
					data: dataInfo
				}).then(
					function (response) {
						// update UI
						if (response.data && _.isFunction(options.sendSuccessFn)) {
							options.sendSuccessFn();
						}
						platformModalService.showMsgBox(options.sendSuccessText, 'cloud.common.informationDialogHeader', 'ico-info');
						$scope.modalOptions.close();
					},
					function (error) {
						let msg = options.sendFailText;
						if (error && error.data && error.data.ErrorMessage) {
							msg = msg + ' ' + error.data.ErrorMessage;
						}
						platformModalService.showMsgBox(msg, 'cloud.common.informationDialogHeader', 'ico-info');
						$scope.modalOptions.isBtnSendDisable = false;
					}
				).finally(
					function () {
						$scope.modalOptions.isLoading = false;
					}
				);
			};

			$scope.modalOptions.close = function onCancel() {
				$scope.$close({ok: false});
			};

			/**
			 * set button 'send' enable or disable.
			 */
			$scope.$watch(
				function () {
					getBtnSendStatus();
					return isBtnSendDisable;
				},
				function (newVal) {
					$scope.modalOptions.isBtnSendDisable = newVal;
				}
			);

			/**
			 * set button 'preview' enable or disable.
			 */
			$scope.$watch(
				function () {
					getBtnPreviewStatus();
					return isBtnPreviewDisable;
				},
				function (newVal) {
					$scope.modalOptions.isBtnPreviewDisable = newVal;
				}
			);

			/**
			 * get send email or fax data info.
			 */
			function getEmailOrFaxInfo() {
				let dataInfo = {};

				if (dataService2 && _.isFunction(options.getSendDataFn)) {
					dataInfo = options.getSendDataFn(dataService2.getList(), options.communicateType);
				}

				dataInfo.CommunicateType = options.communicateType;
				dataInfo.EmailInfo.EmailAccount = {
					UserName: dataService1.getSelectedSenderEmail()
				};
				return dataInfo;
			}

			function getBtnSendStatus() {
				let data1 = true;
				let data2 = true;

				if (dataService1 && angular.isFunction(dataService1.getBtnSendStatus)) {
					data1 = dataService1.getBtnSendStatus();
				}
				if (dataService2 && angular.isFunction(dataService2.getBtnSendStatus)) {
					data2 = dataService2.getBtnSendStatus();
				}

				isBtnSendDisable = !(data1 && data2);
			}

			function getBtnPreviewStatus() {
				if (dataService1 && angular.isFunction(dataService1.getBtnPreviewStatus)) {
					isBtnPreviewDisable = dataService1.getBtnPreviewStatus();
				}
			}
		}
	]);
})(angular);