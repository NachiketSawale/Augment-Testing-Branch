/**
 * Created by miu on 11/22/2021.
 */
(function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	angular.module('procurement.common').factory('procurementCommonUpdateVersionBoqService', [
		'_', '$http', '$translate', 'platformModalService', 'procurementContextService', function (_, $http, $translate, platformModalService, moduleContext) {
			let service = {};
			let mainService = moduleContext.getMainService();
			let updateMode = {
				updateAllFields: 1,
				updatePartialFields: 2
			};

			let selectedBoqHeaders = [];

			function doUpdate(formData) {
				let mainItem = mainService.getSelected();
				let params = {
					MainItemId: mainItem.Id,
					TargetModules: formData.targetModules,
					UpdateMode: formData.updateMode,
					BaseBoqHeaderIds: _.map(formData.selectBoqHeaders, 'Id'),
					UpdateFields: formData.updateFields
				};
				return $http.post(globals.webApiBaseUrl + 'procurement/common/boq/updateversionboq', params)
					.then(function (response) {
						return response.data;
					});
			}

			function validateForm(formData) {
				if (formData.selectBoqHeaders.length === 0) {
					return {result: false, message: 'please select at least one base BoQ for update.'};
				}
				if (formData.targetModules.length === 0) {
					return {result: false, message: 'noTargetModuleWarning'};
				}
				if (!formData.updateMode) {
					return {result: false, message: 'noUpdateModeWarning'};
				}

				return {result: true};
			}

			function boqHeaders(items) {
				if (items) {
					selectedBoqHeaders = angular.copy(items);
				} else {
					return selectedBoqHeaders;
				}
			}

			function showUpdateResultDialog(data) {
				let targetModules = ['requisition', 'quotation', 'contract', 'pes'];
				let updateSuccess = false;
				_.forEach(targetModules, function (key) {
					let processResult = _.find(data.processResults, function (item) {
						return item.Module === key;
					});
					if (processResult) {
						if (processResult.SuccessLeadEntitys.length > 0) {
							updateSuccess = true;
						}
					}
				});
				if (updateSuccess) {
					let modalOptions = {
						templateUrl: globals.appBaseUrl + 'procurement.common/templates/update-version-boq-result-dialog.html',
						headerText: $translate.instant('procurement.common.wizard.updateVersionBoQ.updateStatus'),
						resizeable: true,
						width: '800px',
						data: data
					};
					platformModalService.showDialog(modalOptions);
				} else {
					let msgBoxTitle = $translate.instant('procurement.common.wizard.updateVersionBoQ.warningTitle');
					platformModalService.showMsgBox($translate.instant('procurement.common.wizard.updateVersionBoQ.failMsg'), msgBoxTitle, 'warning');
				}
			}

			service.boqHeaders = boqHeaders;
			service.updateMode = updateMode;
			service.doUpdate = doUpdate;
			service.validateForm = validateForm;
			service.showUpdateResultDialog = showUpdateResultDialog;
			return service;
		}]);
})(angular);