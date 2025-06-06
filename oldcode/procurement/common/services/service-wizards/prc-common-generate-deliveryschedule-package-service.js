/**
 * Created by lcn on 2017-11-28.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	var moduleName = 'procurement.common';
	angular.module(moduleName).factory('procurementCommonGenerateDeliverySchedulePackageService',
		['platformModalService', '$translate', function (platformModalService, $translate) {
			var service = {};
			service.showGenerateDeliveryScheduleWizardDialog = function (PrcItemsService, parentService) {
				var selectedLead = parentService.getSelected();
				if (selectedLead) {
					var selectedPrcItems = PrcItemsService.getService().getList();
					platformModalService.showDialog({
						templateUrl: globals.appBaseUrl + 'procurement.common/templates/prc-common-generate-deliveryschedule-package-wizard.html',
						controller: 'procurementCommonGenerateDeliverySchedulePackageController',
						width: '800px',
						resolve: {
							'params': [
								function () {
									return {
										selectedPrcItems: selectedPrcItems,
										selectedLead: selectedLead
									};
								}
							]
						}
					}).then(function (res) {
						if (res.isOk) {
							parentService.refresh();
						}
					});
				}
				else {
					// select a data first.
					var modalOptions = {
						headerText: $translate.instant('procurement.common.wizard.generateDeliverySchedule.wizard'),
						bodyText: $translate.instant('procurement.common.wizard.replaceNeutralMaterial.errorNoSelectOnePackage'),
						iconClass: 'ico-info'
					};
					platformModalService.showDialog(modalOptions);
				}
			};
			return angular.extend(service, {});
		}]);
})(angular);