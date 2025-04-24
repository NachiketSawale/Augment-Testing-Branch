/**
 * Created by lcn on 1/29/2019.
 */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.common';
	angular.module(moduleName).factory('procurementCommonTaxCodeChangeService',
		['$translate', 'platformModalService', '$http', '$injector',
			function ($translate, platformModalService, $http, $injector) {
				// eslint-disable-next-line no-unused-vars
				var service = {}, self = this;
				// eslint-disable-next-line no-unused-vars
				service.taxCodeChanged = function procurementCommonTaxCodeChange(taxCodeFk, moduleName, mainService, selected) {
					var yesNoDialogBodyText = $translate.instant('procurement.common.changeTaxCode.DialogTitle');
					var prcItemDataService = $injector.get('procurementCommonPrcItemDataService').getService(mainService);
					// eslint-disable-next-line no-unused-vars
					var prcItemValidationService = $injector.get('procurementCommonPrcItemValidationService')(prcItemDataService);
					if(mainService.taxCodeFkChanged){
						mainService.taxCodeFkChanged.fire();
					}

					if (moduleName === 'procurement.package' ||
						moduleName === 'procurement.contract' ||
						moduleName === 'procurement.requisition') {
						yesNoDialogBodyText += '<br/>' + $translate.instant('procurement.common.changeTaxCode.noteForPaymentSchedule');
					}

					var items = prcItemDataService.getList();
					var boqMainService = $injector.get('prcBoqMainService').getService(mainService);
					var prcBoqService = $injector.get('procurementCommonPrcBoqService').getService(mainService);

					var BoqItems = boqMainService.getList();
					if (items.length > 0 || BoqItems.length > 0) {
						platformModalService.showYesNoDialog(yesNoDialogBodyText, 'procurement.common.changeTaxCode.caption', 'no')
							.then(function (result) {
								if (result.yes) {
									mainService.update().then(function () {
										let containerData = mainService.getContainerData();
										let url = containerData.httpUpdateRoute;
										let modTrackServ = $injector.get('platformDataServiceModificationTrackingExtension');
										let updateData = modTrackServ.getModifications(mainService);
										if (mainService.doPrepareUpdateCall) {
											mainService.doPrepareUpdateCall(updateData);
										}
										$http.post(url + 'updateHeaderAndChildTaxCode', updateData).then(function (response) {
											var result = response.data;
											containerData.onUpdateSucceeded(result, containerData, updateData);
											modTrackServ.clearModificationsInRoot(mainService);
											updateData = {};
											prcItemDataService.load();
											prcBoqService.load();
											boqMainService.load();
										});
									});
								}else if(result.no){
									if(!_.isNil(selected.BpdVatGroupFk)){
										$http.get(globals.webApiBaseUrl + 'basics/taxcode/taxcodeMatrix/getmatrixbyvatgroup?TaxCodeFk='+selected.TaxCodeFk+'&VatGroupFk='+selected.BpdVatGroupFk).then(function (response) {
											const matrix = response.data;
											selected.MatrixCodeFk = matrix === '' ? null : matrix.Id;
											selected.MatrixComment = matrix === '' ? null : matrix.CommentTranslateInfo.Translated;
											mainService.fireItemModified(selected);
										});
									}
								}
							});
					}
				};

				return service;
			}]);
})(angular);
