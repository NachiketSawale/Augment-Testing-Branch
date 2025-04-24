/**
 * Created by pel on 2021/08/05
 */
/* jshint -W072 */ // many parameters because of dependency injection
(function (angular) {
	'use strict';
	var moduleName = 'procurement.contract';
	var contractMainModule = angular.module(moduleName);
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	/**
	 * @ngdoc service
	 * @name contractCreationInitialDialogService
	 * @function
	 *
	 * @description
	 * contractCreationInitialDialogService is the data service for all creation initial dialog related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	contractMainModule.service('contractCreationInitialDialogService', ContractCreationInitialDialogService);

	ContractCreationInitialDialogService.$inject = ['_', '$q', 'procurementContextService', '$injector', 'basicsLookupdataLookupDescriptorService', 'platformRuntimeDataService',
		'$http' , 'platformDataValidationService', 'platformModuleStateService','$translate'];

	function ContractCreationInitialDialogService(_, $q, procurementContextService, $injector, basicsLookupdataLookupDescriptorService, platformRuntimeDataService, $http, platformDataValidationService,platformModuleStateService,$translate) {

		function requestDefaultForContract(createItem) {
			var validationService = $injector.get('contractHeaderElementValidationService');
			var projectId = createItem.dataItem.ProjectFk;
			if (_.isNil(projectId)) {
				projectId = 0;
			}
			return $http.get(globals.webApiBaseUrl + 'procurement/contract/header/getdefaultvalues?projectFk=' + projectId).then(function callback(response) {
				var defaultContract = response.data.ConHeaderDto;
				_.extend(createItem.dataItem, defaultContract);
				if (defaultContract.ProjectFk === 0) {
					delete createItem.dataItem.ProjectFk;
				}
				if (defaultContract.Id === 0) {
					delete createItem.dataItem.Id;
				}
				if (defaultContract.CurrencyFk === 0) {
					delete createItem.dataItem.BasCurrencyFk;
				}
				if (defaultContract.TaxCodeFk === 0) {
					delete createItem.dataItem.TaxCodeFk;
				}
				if (defaultContract.BusinessPartnerFk === 0) {
					delete createItem.dataItem.BusinessPartnerFk;
				}
				createItem.dataItem.ConfigurationFk = createItem.dataItem.PrcHeaderEntity.ConfigurationFk;
				var result1 = validationService.validateDialogConfigurationFk(createItem.dataItem, createItem.dataItem.ConfigurationFk, 'ConfigurationFk');
				platformRuntimeDataService.applyValidationResult(result1, createItem.dataItem, 'ConfigurationFk');

				var result2 = validationService.validateBusinessPartnerFk(createItem.dataItem, createItem.dataItem.BusinessPartnerFk, 'BusinessPartnerFk', true, true);
				platformRuntimeDataService.applyValidationResult(result2, createItem.dataItem, 'BusinessPartnerFk');

				var result3 = validationService.syncValidateBasCurrencyFk(createItem.dataItem, createItem.dataItem.BasCurrencyFk, 'BasCurrencyFk');
				platformRuntimeDataService.applyValidationResult(result3, createItem.dataItem, 'BasCurrencyFk');

			});
		}

		function requestContractCreationData(modalCreateProjectConfig) {
			return $q.all([
				requestDefaultForContract(modalCreateProjectConfig)
			]);
		}

		function provideConfigurationFk() {
			return {
				gid: 'allData',
				rid: 'configurationfk',
				model: 'PrcHeaderEntity.ConfigurationFk',
				required: true,
				sortOrder: 0,
				label: 'Configuration',
				label$tr$: 'procurement.common.prcConfigurationDescription',
				type: 'directive',
				directive: 'basics-lookupdata-lookup-composite',
				options: {
					lookupDirective: 'basics-configuration-configuration-combobox',
					descriptionMember: 'Description',
					lookupOptions: {
						filterKey: 'prc-con-configuration-filter'
					}
				}
			};
		}

		function provideStructureFk() {
			return {
				gid: 'allData',
				rid: 'structurefk',
				model: 'PrcHeaderEntity.StructureFk',
				required: false,
				sortOrder: 0,
				label: 'Structure',
				label$tr$: 'basics.common.entityPrcStructureFk',
				type: 'directive',
				directive: 'basics-lookupdata-lookup-composite',
				options: {
					lookupDirective: 'procurement-contract-prc-structure-dialog',
					descriptionMember: 'Code',
					lookupOptions: {
						filterKey: 'prc-req-structure-filter'
					}
				}
			};
		}

		function provideConHeaderFk() {
			return {
				gid: 'allData',
				rid: 'conHeaderFk',
				model: 'ContractHeaderFk',
				required: false,
				sortOrder: 0,
				label: 'Basis Contract',
				label$tr$: 'procurement.contract.ConHeaderBasisContract',
				type: 'directive',
				directive: 'basics-lookupdata-lookup-composite',
				options: {
					lookupDirective: 'prc-con-header-dialog',
					descriptionMember: 'Description',
					lookupOptions: {
						'showClearButton': true,
						'filterKey': 'prc-con-header-filter',
						'dialogOptions': {
							'alerts': [{
								theme: 'info',
								message: 'Setting basis contract will overwrite quite a lot of related fields',
								message$tr$: 'procurement.common.contractHeaderUpdateInfo'
							}]
						}
					}
				}
			};
		}

		this.adjustCreateConfiguration = function adjustCreateConfiguration(dlgLayout,conf) {

			var validationService = $injector.get('contractHeaderElementValidationService');
			var contractService = $injector.get('procurementContractHeaderDataService');
			var selectedContract = contractService.getSelected();
			contractService.deselect();
			dlgLayout.dataItem.ProjectFk = procurementContextService.loginProject;
			var row = _.find(dlgLayout.formConfiguration.rows, {rid: 'projectfk'});
			if (!_.isNil(row)) {
				row.validator = validationService.validateDialogProjectFk;
			}

			var configRow = _.find(dlgLayout.formConfiguration.rows, {rid: 'configurationfk'});
			if (_.isNil(configRow)) {
				configRow = provideConfigurationFk();
				dlgLayout.formConfiguration.rows.push(configRow);
			}
			configRow.validator = validationService.validatePrcHeaderEntity$ConfigurationFk;

			var structureRow = _.find(dlgLayout.formConfiguration.rows, {rid: 'structurefk'});
			if (_.isNil(structureRow)) {
				structureRow = provideStructureFk();
				dlgLayout.formConfiguration.rows.push(structureRow);
			}

			structureRow.validator = validationService.validatePrcHeaderEntity$StructureFk;

			let conHeaderRow = _.find(conf.ColumnsForCreateDialog, {PropertyName: 'ConHeaderFk'});
			if (conHeaderRow && conHeaderRow.ShowInWizard) {
				conHeaderRow = provideConHeaderFk();
				dlgLayout.formConfiguration.rows.push(conHeaderRow);
				conHeaderRow.validator = validationService.validateContractHeaderFk;
			}

			// reject controlling unit “Budget(CU)” and “Cost(CU)” and change order  Change type
			dlgLayout.formConfiguration.rows = _.reject(dlgLayout.formConfiguration.rows, function (row) {
				return 'lookupDisplayColumn' in row || 'afterId' in row;
			});

			//it's workaround fn, ticket:https://rib-40.atlassian.net/browse/DEV-34970 fix done,remove below code
			_.forEach(dlgLayout.formConfiguration.rows, function(row) {
				if(row.rid === 'configurationfk'){
					row.label = $translate.instant('procurement.package.entityConfiguration');
				}
				if(row.rid === 'structurefk'){
					row.label = $translate.instant('basics.common.entityPrcStructureFk');
				}
			});

			dlgLayout.handleCancel = function handleCancel() {
				if(!_.isNil(selectedContract)){
					contractService.setSelected(selectedContract);
				}
				if (platformDataValidationService.hasErrors(contractService)) {
					var modState = platformModuleStateService.state(contractService.getModule());
					modState.validation.issues = [];
				}
				return true;
			};
			return requestContractCreationData(dlgLayout).then(function () {
				return dlgLayout;
			});
		};
	}
})(angular);
