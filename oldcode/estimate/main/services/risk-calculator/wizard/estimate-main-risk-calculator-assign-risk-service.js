/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';
	let moduleName = 'estimate.main';
	angular.module(moduleName).service('estimateMainRiskCalculatorAssignRiskService', [
		'$http', '$translate', 'estimateMainService', 'platformModalService', 'platformTranslateService', '$injector',
		function ($http, $translate, estimateMainService, platformModalService, platformTranslateService, $injector) {

			let service = {};

			let self = service;

			service.assignRiskEvents = function assignRiskEvents(riskEventIds, estLineItems) {

				let data = {
					'riskEventIds': riskEventIds,
					'lineItems': estLineItems
				};

				return $http.post(globals.webApiBaseUrl + 'estimate/main/riskcalculator/assignrisk', data);
			};

			service.dataItem = {
				applyToLineItemStructure: false,
				applyToSelectedLineItem: false,
				applyToEntireEstimate: false
			};

			service.formConfiguration = {
				fid: 'estimate.main.assignRiskEvent',
				version: '0.0.1',
				showGrouping: true,
				groups: [
					{
						gid: 'assignedLevel',
						header: 'Assigned Level',
						header$tr$: 'estimate.main.assignRiskEventWizard.riskGroupTitle1',
						visible: true,
						isOpen: true,
						attributes: []
					},
					{
						gid: 'riskEvents',
						header: 'Risk Events',
						header$tr$: 'estimate.main.assignRiskEventWizard.riskGroupTitle2',
						visible: true,
						isOpen: true,
						attributes: []
					}
				],
				rows: [
					{
						gid: 'assignedLevel',
						rid: 'selectedItem',
						label: 'Apply To',
						label$tr$: 'estimate.main.riskApplyTo',
						type: 'radio',
						model: 'selectedLevel',
						options: {
							labelMember: 'Description',
							valueMember: 'Value',
							groupName: 'assignToRiskEventsConfig',
							items: [
								{
									Id: 0,
									Description: $translate.instant('estimate.main.assignRiskEventWizard.applyToEntireEstimate'),
									Value: 'applyToEntireEstimate'
								},
								{
									Id: 1,
									Description: $translate.instant('estimate.main.assignRiskEventWizard.applyToLineItemStructure'),
									Value: 'applyToLineItemStructure'
								},
								{
									Id: 2,
									Description: $translate.instant('estimate.main.assignRiskEventWizard.applyToSelectedLineItem'),
									Value: 'applyToSelectedLineItem'
								},

							]
						}
					},
					{
						gid: 'riskEvents',
						rid: 'registerConfig',
						type: 'directive',
						model: 'registerConfigDetails',
						directive: 'estimate-main-risk-register-dialog-grid',
						sortOrder: 4
					}
				]
			};

			service.getPostData = function () {
				let postData = {
					'ProjectId': estimateMainService.getSelectedProjectId(),
					'EstHeaderFk': parseInt(estimateMainService.getSelectedEstHeaderId()),
					'SelectedEstLineItems': estimateMainService.getSelectedEntities()
				};

				return postData;
			};

			self.showCreateDialog = function showCreateDialog() {
				platformModalService.showDialog({
					templateUrl: globals.appBaseUrl + 'estimate.main/templates/risk-calculator/wizard/estimate-main-risk-assign-dialog.html',
					backdrop: false,
					width: 600

				}).then(function (result) {
					if (result && result.ok && result.data) {
						preparePostData(result.data).then(function (/* response */) {
							let dataService = $injector.get('estimateMainAssignedRiskDataService');
							dataService.load();
							dataService = $injector.get('estimateMainRiskEventsDataService');
							dataService.load();
						});
					}
				}
				);
			};

			service.showDialog = function showDialog(/* value */) {
				platformTranslateService.translateFormConfig(self.formConfiguration);
				self.showCreateDialog();
			};

			service.getDialogTitle = function getDialogTitle() {
				return $translate.instant('estimate.main.assignRiskEvent');
			};

			Object.defineProperties(service, {
				'dialogTitle': {
					get: function () {
						return '';
					}, enumerable: true
				}
			}
			);

			service.getDataItem = function getDataItem() {
				return service.dataItem;
			};

			service.getFormConfiguration = function getFormConfiguration() {
				return service.formConfiguration;
			};

			service.getAssignedRisksWithLineItems = function () {

			};
			function preparePostData(dataFromForm) {

				let lineItems = null;
				let selectedRisks = null;
				let selectedRiskIds = [];
				switch (dataFromForm.selectedLevel) {
					case 'applyToEntireEstimate':
						lineItems = applyToEntireEstimate();
						selectedRisks = dataFromForm.selectedRisks;
						break;
					case 'applyToLineItemStructure':
						break;
					case 'applyToSelectedLineItem':
						lineItems = applyToSelectedLineItems();
						selectedRisks = dataFromForm.selectedRisks;
						break;
					default:
						break;
				}

				if(lineItems !== null && selectedRisks !== null){
					angular.forEach(selectedRisks,function (risk) {
						selectedRiskIds.push(risk.Id);
					});
					return self.assignRiskEvents(selectedRiskIds,lineItems);
				}
			}

			function applyToEntireEstimate(){
				return estimateMainService.getList();
			}
			function applyToSelectedLineItems(){
				return[ estimateMainService.getSelected()];
			}
			return service;
		}
	]);
})(angular);
