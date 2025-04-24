/**
 * $Id:  $
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	/* global globals */

	let moduleName = 'basics.controllingcostcodes';
	/**
     * @ngdoc service
     * @name basicsControllingCostCodesSidebarWizardService
     * @description provides wizard configuration
     */
	angular.module(moduleName).factory('basicsControllingCostCodesSidebarWizardService', ['$http','$translate','platformModalService','platformTranslateService','platformSidebarWizardConfigService',
		'platformModalFormConfigService','basicsControllingCostCodesMainService','salesCommonContextService',
		function ($http,$translate,platformModalService,platformTranslateService,platformSidebarWizardConfigService,platformModalFormConfigService, basicsControllingCostCodesMainService,salesCommonContextService) {

			let service = {};

			service.controllingCostCodesValidation = function controllingCostCodesValidation() {

				let title = 'basics.controllingcostcodes.mappingValidationWizard';
				let contrCostCodeMapValidationConfig = {
					title: $translate.instant(title),
					dataItem: { mdcLedgerContextTypeID: salesCommonContextService.getCompany().LedgerContextFk },
					formConfiguration: {
						fid: 'basics.controllingcostcodes.controllingCostCodesValidation',
						version: '0.1.1',
						showGrouping: false,
						groups: [
							{
								gid: 'baseGroup',
								attributes: ['selecteditem']
							}
						],
						'overloads': {},
						rows: [
							{
								gid: 'baseGroup',
								rid: 'mdcLedgerContextType',
								type: 'directive',
								label: 'Ledger Context',
								label$tr$: 'basics.controllingcostcodes.mdcLedgerContextFk',
								model: 'mdcLedgerContextTypeID',
								required: true,
								'directive': 'basics-prc-structure-ledger-context-combo-box',
								sortOrder: 1
							}
						]
					},
					handleOK: function handleOK(result) {
						if (!result || !result.ok || !result.data) {
							return;
						}

						let postData = {
							'mdcLedgerContextFk': result.data.mdcLedgerContextTypeID
						};

						if (postData.mdcLedgerContextFk === 0) {
							platformModalService.showMsgBox($translate.instant('basics.controllingcostcodes.selectLedgerContext'), $translate.instant('basics.controllingcostcodes.mappingValidationWizard'), 'warning');
							return;
						}

						function getContrCostCodeValidation() {
							$http.post(globals.webApiBaseUrl + 'basics/controllingcostcodes/validatecontrcostcodes?mdcLedgerContextFk=' + postData.mdcLedgerContextFk)
								.then(function(response) {
									platformModalService.showMsgBox($translate.instant('basics.controllingcostcodes.fileCreated'), $translate.instant('basics.controllingcostcodes.mappingValidationWizard'),'info');
									let link = angular.element(document.querySelectorAll('#downloadLink'));
									let fileName = response.headers('Content-Disposition').slice(21);
									link[0].href = response.data;
									link[0].download = fileName.split('"').join('');
									link[0].click();
									return response;
								},
								function (/* error */) {
								});
						}
						basicsControllingCostCodesMainService.updateAndExecute(getContrCostCodeValidation);
					}
				};

				platformTranslateService.translateFormConfig(contrCostCodeMapValidationConfig.formConfiguration);
				contrCostCodeMapValidationConfig.scope = platformSidebarWizardConfigService.getCurrentScope();

				platformModalFormConfigService.showDialog(contrCostCodeMapValidationConfig);
			};

			return service;
		}
	]);
})();