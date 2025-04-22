/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'sales.contract';
	var salesContractModule = angular.module(moduleName);

	salesContractModule.factory('salesContractCopyContractDialogService', ['_', '$log', '$translate', '$injector', 'platformTranslateService', 'platformWizardDialogService', 'salesContractNumberGenerationSettingsService', 'salesContractCreateContractDialogService',
		function (_, $log, $translate, $injector, platformTranslateService, platformWizardDialogService, salesContractNumberGenerationSettingsService, salesContractCreateContractDialogService) {

			var service = {};

			function stepBasicData(contractEntity) {
				var formConfig = _.cloneDeep(salesContractCreateContractDialogService.getFormConfig());
				platformTranslateService.translateFormConfig(formConfig);

				var readOnlyRows = ['ordheaderfk', 'typeFk', 'rubricCategoryFk', 'projectfk', 'contractTypeFk'];
				_.each(readOnlyRows, (rowName) => {
					var row = _.find(formConfig.rows, {rid: rowName});
					if (row) {
						row.readonly = true;
					}
				});
				// 'code' => generated/readonly
				var readonly = salesContractNumberGenerationSettingsService.hasToGenerateForRubricCategory(contractEntity.RubricCategoryFk);
				_.set(_.find(formConfig.rows, {rid: 'code'}), 'readonly', readonly);

				return {title: 'Basic Data',title$tr$:'sales.common.copyItemDialog.firstPageTitle', form: formConfig};
			}

			function stepDependentData() {
				// TODO: simplify rows array
				// _.map(_.map(dependentDataRows, 'rid'), (v, i) => {return {rid: v, sortOrder: i + 1};});

				var dependentDataRows = [{
					gid: 'dependents',
					rid: 'copyBoqs',
					type: 'boolean',
					model: 'copy.Boqs',
					label: 'Copy BoQs',
					label$tr$:'sales.common.copyItemDialog.copyBoqs',
					visible: true,
					sortOrder: 1
				}, {
					gid: 'dependents',
					rid: 'copyGenerals',
					type: 'boolean',
					model: 'copy.Generals',
					label: 'Copy Generals',
					label$tr$:'sales.common.copyItemDialog.copyGenerals',
					visible: true,
					sortOrder: 2
				}, {
					gid: 'dependents',
					rid: 'copyCertificates',
					type: 'boolean',
					model: 'copy.Certificates',
					label: 'Copy Certificates',
					label$tr$:'sales.common.copyItemDialog.copyCertificates',
					visible: true,
					sortOrder: 3
				}, {
					gid: 'dependents',
					rid: 'copyDocuments',
					type: 'boolean',
					model: 'copy.Documents',
					label: 'Copy Documents',
					label$tr$:'sales.common.copyItemDialog.copyDocuments',
					visible: true,
					sortOrder: 4
				}, {
					gid: 'dependents',
					rid: 'copyCharacteristics',
					type: 'boolean',
					model: 'copy.Characteristics',
					label: 'Copy Characteristics',
					label$tr$:'sales.common.copyItemDialog.copyCharacteristics',
					visible: false,   // TODO: implement
					sortOrder: 5
				}, {
					gid: 'dependents',
					rid: 'copyComments',
					type: 'boolean',
					model: 'copy.Comments',
					label: 'Copy Comments',
					label$tr$:'sales.common.copyItemDialog.copyComments',
					visible: false,   // TODO: implement
					sortOrder: 6
				}];

				return {
					id: 'dependentData',
					title: 'Dependent Data',
					title$tr$: 'sales.common.copyItemDialog.title',
					form: {
						fid: 'sales.contract.wizards.copyContract.forms.dependentDataForm',
						version: '0.1.0',
						showGrouping: false,
						skipPermissionsCheck: true,
						groups: [{
							gid: 'dependents'
						}],
						rows: dependentDataRows
					},
					disallowNext: false,
					canFinish: true
				};
			}

			service.showDeepCopyDialog = function showDeepCopyDialog(contract2BCopied) {

				if (!_.has(contract2BCopied, 'Id')) {
					$log.debug('Passed object "contract2BCopied" invalid!');
					return;
				}

				var wzConfig = {
					title: 'Copy Contract',
					title$tr$: 'sales.common.copyItemDialog.copyContractTitle',
					width: '25%',
					height: '60%',
					steps: [
						// step 1: Basic Data
						stepBasicData(contract2BCopied),
						// step 2: Dependent Data
						stepDependentData()
					]
				};

				var createContractData = {
					// step basic data
					CompanyFk: contract2BCopied.CompanyFk,
					BidHeaderFk: contract2BCopied.BidHeaderFk,
					OrdHeaderFk: contract2BCopied.OrdHeaderFk,
					RubricCategoryFk: contract2BCopied.RubricCategoryFk,
					Code: salesContractNumberGenerationSettingsService.provideNumberDefaultText(contract2BCopied.RubricCategoryFk, ''),
					Description: _.get(contract2BCopied, 'DescriptionInfo.Translated') + ' - Copy',
					ResponsibleCompanyFk: contract2BCopied.CompanyResponsibleFk,
					ClerkFk: contract2BCopied.ClerkFk,
					ProjectFk: contract2BCopied.ProjectFk,
					ContractTypeFk: contract2BCopied.ContractTypeFk,
					// step copy dependent data [x]
					copy: {
						Boqs: true,
						Certificates: true
					}
				};
				createContractData.getCopyIdentifiers = function getCopyIdentifiers() {
					// TODO: fill in identifiers
					var model2CpyId = {
						'Boqs': 'sales.contract.boq',
						'Generals': 'sales.contract.general',
						'Certificates': 'sales.contract.certificate',
						'Documents': 'sales.contract.document',
						// 'Characteristics': '',
						// 'Comments': ''
					};
					return _.map(_.keys(_.pickBy(createContractData.copy)), i => model2CpyId[i]);
				};
				platformWizardDialogService.translateWizardConfig(wzConfig);
				return platformWizardDialogService.showDialog(wzConfig, createContractData);
			};

			return service;

		}]);
})();
