(function (angular) {
	'use strict';
	/* global _ */
	angular.module('procurement.common').factory('prcCommonPaymentScheduleStatusChangeService',
		['basicsCommonChangeStatusService', 'procurementCommonPaymentScheduleDataService', 'procurementCommonPaymentScheduleFormatterProcessor',
			// eslint-disable-next-line no-unused-vars
			function (basicsCommonChangeStatusService, procurementCommonPaymentScheduleDataService, procurementCommonPaymentScheduleFormatterProcessor) {
				function providePrcPaymentScheduleStatusChangeInstance(headerDataService, parentDataService) {
					return basicsCommonChangeStatusService.provideStatusChangeInstance(
						{
							statusName: 'procurementpaymentschedule',
							mainService: headerDataService,
							getDataService: function () {
								return procurementCommonPaymentScheduleDataService.getService(parentDataService || headerDataService);
							},
							statusField: 'PrcPsStatusFk',
							descField: 'Description',
							statusDisplayField: 'DescriptionInfo.Translated',
							title: 'procurement.common.wizard.changePrcPaymentScheduleStatus',
							handleSuccess: function handleSuccess(result) {
								var paymentScheduleataService = procurementCommonPaymentScheduleDataService.getService(parentDataService || headerDataService);
								if (result.changed === true && result.executed === true){
									var item = result.entity;
									var selectedItem = _.find(paymentScheduleataService.getList(), {Id: item.Id});
									if (selectedItem) {
										angular.extend(selectedItem, item);
										procurementCommonPaymentScheduleFormatterProcessor.processItem(selectedItem);
										paymentScheduleataService.setSelected({}).then(function(){
											paymentScheduleataService.setSelected(selectedItem);
											paymentScheduleataService.setFieldsReadOnly(selectedItem);
											paymentScheduleataService.gridRefresh();
										});
									}
								}
							}
						}
					);
				}
				return {
					providePrcPaymentScheduleStatusChangeInstance: providePrcPaymentScheduleStatusChangeInstance
				};
			}]);
})(angular);
