(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.requisition').factory('procurementRequisitionCopyRequisitionWizard',
		['$http', 'procurementRequisitionCopyRequisitionDataService', 'procurementRequisitionHeaderDataService', 'platformModalService', 'cloudDesktopSidebarService',
			function ($http, procurementRequisitionCopyRequisitionDataService, procurementRequisitionHeaderDataService, platformModalService, cloudDesktopSidebarService) {
				return {
					execute: function () {
						let header = procurementRequisitionHeaderDataService.getSelected();
						if (header === null || header === undefined) {
							return;
						}
						procurementRequisitionCopyRequisitionDataService.copyRequisitionById(header.Id, header.PrcHeaderFk).then(function (data) {
							if (data) {
								cloudDesktopSidebarService.filterSearchFromPKeys([data.Id]);
							}
							else {
								let modalOptions = {
									headerTextKey: 'cloud.common.informationDialogHeader',
									bodyTextKey: 'procurement.requisition.copyRequisition.saveFail',
									showOkButton: true,
									iconClass: 'ico-info'
								};
								platformModalService.showDialog(modalOptions);
							}
						});
					}
				};
			}]);
})(angular);
