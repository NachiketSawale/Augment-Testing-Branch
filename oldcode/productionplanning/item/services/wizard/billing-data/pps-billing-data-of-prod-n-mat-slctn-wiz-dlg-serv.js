/**
 * Created by zwz on 12/27/2024.
 */
(function (angular) {
	'use strict';
	/* global globals, _ */
	const moduleName = 'productionplanning.item';

	angular.module(moduleName).factory('ppsBillingDataOfProductAndMaterialSelectionWizardDialogService', DialogService);
	DialogService.$inject = ['$http', '$translate', '$injector', 'platformModalService', 'ppsBillingDataOfProductAndMaterialSelectionWizardDialogFormService',
		'ppsBillingDataOfProductAndMaterialSelectionWizardDialogTabsService', 'platformDialogService', '_'];

	function DialogService($http, $translate, $injector, platformModalService, formService, tabsService, platformDialogService, _) {
		let service = {};

		service.initialize = function initialize(scope, options) {
			scope.entity = options.filterObj;
			scope.formOptions = formService.getFormOptions(scope);
			scope.model = 'CreateNew';
			tabsService.initialize(scope);

			scope.doesCreateWIP = false;
			scope.modalOptions = {
				headerText: $translate.instant('productionplanning.item.wizard.billingDataOfProductAndMaterialSelection.dialogTitle'),
				cancel: close
			};

			scope.isBusy = false;

			scope.isOKDisabled = function () {
				return scope.isBusy || !tabsService.isValid() || !tabsService.isAnyProductSelected();
			};

			scope.handleOK = function (next) {

				//tabsService.endEdit();

				if (scope.isOKDisabled()) {
					return false;
				}
				scope.isBusy = true;
				const postData = {};
				_.extend(postData, tabsService.getResult());
				postData.DoesCreateWIP = !!(scope.entity.doesCreateWIP);
				$http.post(globals.webApiBaseUrl + 'productionplanning/product/billingdata/createbillingdata', postData).then(function (response) {
					if (response.data.ErrorMessage) {
						platformModalService.showErrorBox(JSON.stringify(response.data.ErrorMessage), $translate.instant('platform.error.errorDetails'));
					} else if(isEmptyArray(response.data.BillIds) && isEmptyArray(response.data.WipIds)) {
						//showWarning(JSON.stringify(response.data.ErrorMessage));
						let title = $translate.instant('productionplanning.item.wizard.billingDataOfProductAndMaterialSelection.nothingBilled');
						showSuccessDialog([title, response.data.ErrorMessage ?? '', ...response.data.Messages], false);
					}
					else {
						let toShowArray = [];
						if(!isEmptyArray(response.data.BillIds)){
							toShowArray = [$translate.instant('productionplanning.item.wizard.billingDataOfProductAndMaterialSelection.createBillSucceed'), ...response.data.BillIds];
						} else {
							toShowArray = [$translate.instant('productionplanning.item.wizard.billingDataOfProductAndMaterialSelection.createWipSucceed'), ...response.data.WipIds];
						}
						showSuccessDialog(toShowArray, true);
					}
					close();
				});
				close();
			};

			scope.$on('$destroy', function () {
				tabsService.destroy();
			});


			function close() {
				scope.$emit('pps-billing-data-of-prod-n-mat-slctn-wiz-is-closing');
				return scope.$close(false);
			}

			function showWarning(message) {
				let modalOptions = {
					headerTextKey: $translate.instant('platform.richTextEditor.warning'),
					bodyTextKey: message,
					showOkButton: true,
					iconClass: 'ico-warning'
				};
				platformModalService.showDialog(modalOptions);
			}

			function showSuccessDialog(messages, succeed) {
				const messagesToShow = messages.filter(msg => !_.isNil(msg));
				const formattedMessage = `<ul>${messagesToShow.map(msg => `<li>${msg}</li>`).join('')}</ul>`;
				let modalOptions = {
					headerText$tr$: succeed ? 'productionplanning.item.wizard.billingDataOfProductAndMaterialSelection.done' : 'productionplanning.item.wizard.billingDataOfProductAndMaterialSelection.warning',
					bodyTemplate: formattedMessage,
					showOkButton: true,
					showCancelButton: false,
					resizeable: true
				};

				platformDialogService.showDialog(modalOptions);
			}

			function isEmptyArray(arr) {
				return !Array.isArray(arr) || arr.length === 0;
			}
		};

		return service;
	}

})(angular);
