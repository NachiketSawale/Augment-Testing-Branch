/**
 * Created by lcn on 2019-07-04.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	var moduleName = 'procurement.common';
	angular.module(moduleName).factory('procurementCommonGeneratePaymentScheduleService', ['_', '$injector', '$translate', 'platformModalService',
		function (_, $injector, $translate, platformModalService) {
			var service = {};
			service.showGeneratePaymentScheduleWizardDialog = function (totalDataService, parentService) {
				let selectedLead = parentService.getSelected();
				let selectedLeads = null;
				let bodyText;
				if (_.isNil(selectedLead)) {
					bodyText = $translate.instant('cloud.common.noCurrentSelection');
				}
				if (selectedLead && selectedLead.ContractHeaderFk) {
					bodyText = $translate.instant('procurement.common.paymentSchedule.pleaseSelectMainContract');
				}
				if (bodyText) {
					var modalOptions = {
						headerText: $translate.instant('procurement.common.wizard.generatePaymentSchedule.wizard'),
						bodyText: bodyText,
						iconClass: 'ico-info'
					};
					platformModalService.showDialog(modalOptions);
				} else {
					let moduleName = parentService.getModule().name;
					let multipleSelection = false;
					let selectedTotal;
					let allTotal;
					switch (moduleName) {
						case 'sales.contract':
							selectedTotal = {ValueNetOc: selectedLead.AmountNetOc, GrossOc: selectedLead.AmountGrossOc};
							break;
						case 'procurement.contract':
							allTotal = totalDataService.getList();
							selectedTotal = getTotalByConfiguration(totalDataService, allTotal);
							var contracts = parentService.getSelectedEntities();
							if (contracts && contracts.length > 1) {
								multipleSelection = true;
								selectedLeads = contracts;
							}
							break;
						case 'procurement.package':
							allTotal = totalDataService.getList();
							selectedTotal = getTotalByConfiguration(totalDataService, allTotal);
							var selectedSupPackage = $injector.get('procurementPackagePackage2HeaderService').getSelected();
							selectedLead.PrcHeaderFk = selectedSupPackage.PrcHeaderFk;
							var packages = parentService.getSelectedEntities();
							if (packages && packages.length > 1) {
								multipleSelection = true;
								selectedLeads = packages;
							}
							break;
					}
					var modalOptionsSelectedLead = {
						templateUrl: globals.appBaseUrl + 'procurement.common/templates/prc-common-generate-paymentschedule-wizard.html',
						controller: 'procurementCommonGeneratePaymentScheduleController',
						width: '530px',
						resolve: {
							'params': [
								function () {
									return {
										multipleSelection: multipleSelection,
										selectedtotal: selectedTotal,
										alltotal: allTotal,
										selectedLead: selectedLead,
										selectedLeads: selectedLeads,
										moduleName: moduleName
									};
								}
							]
						}
					};
					platformModalService.showDialog(modalOptionsSelectedLead).then(function (res) {
						if (res) {
							parentService.refresh();
						}
					});
				}
			};

			function getTotalByConfiguration(totalDataService, totalList) {
				var PrcTotalKindFk = 1;
				var totalItem = _.filter(totalList, function (totalItem) {
					var type = totalDataService.getTotalType(totalItem);
					return type && type.PrcTotalKindFk === PrcTotalKindFk;
				});
				if (totalItem && totalItem[0]) {
					return totalItem[0];
				}
			}

			return angular.extend(service, {});
		}]);
})(angular);