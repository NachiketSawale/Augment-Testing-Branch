/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'sales.billing';
	var salesBillingModule = angular.module(moduleName);

	salesBillingModule.factory('salesBillingCopyBillDialogService', ['_', '$log', '$translate', '$injector', 'platformTranslateService', 'platformWizardDialogService', 'salesBillingNumberGenerationSettingsService', 'salesBillingCreateBillDialogService',
		function (_, $log, $translate, $injector, platformTranslateService, platformWizardDialogService, salesBillingNumberGenerationSettingsService, salesBillingCreateBillDialogService) {

			var service = {};

			function stepBasicData(billEntity) {
				var formConfig = _.cloneDeep(salesBillingCreateBillDialogService.getFormConfig());
				platformTranslateService.translateFormConfig(formConfig);

				var readOnlyRows = ['ordheaderfk', 'typeFk', 'rubricCategoryFk', 'projectfk', 'contractTypeFk'];
				_.each(readOnlyRows, (rowName) => {
					var row = _.find(formConfig.rows, {rid: rowName});
					if (row) {
						row.readonly = true;
					}
				});
				// 'billno' => generated/readonly
				var readonly = salesBillingNumberGenerationSettingsService.hasToGenerateForRubricCategory(billEntity.RubricCategoryFk);
				_.set(_.find(formConfig.rows, {rid: 'billno'}), 'readonly', readonly);

				return {title: 'Basic Data',title$tr$:'sales.common.copyItemDialog.firstPageTitle', form: formConfig};
			}

			function stepDependentData() {
				// TODO: simplify rows array
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
					rid: 'copyBoqQuantities',
					type: 'boolean',
					model: 'copy.BoqQuantities',
					label: 'Copy BoQ Quantities',
					cssClass: 'drag-right',
					label$tr$:'sales.common.copyItemDialog.copyBoqQuantities',
					visible: true,
					readonly:false,
					sortOrder: 2
				}, {
					gid: 'dependents',
					rid: 'copyBillItems',
					type: 'boolean',
					model: 'copy.BillItems',
					label: 'Copy Bill Items',
					label$tr$:'sales.common.copyItemDialog.copyBillItems',
					visible: true,
					sortOrder: 3
				}, {
					gid: 'dependents',
					rid: 'copyPriceConditions',
					type: 'boolean',
					model: 'copy.PriceConditions',
					label: 'Copy Price Conditions',
					label$tr$:'sales.common.copyItemDialog.copyPriceConditions',
					visible: true,
					sortOrder: 4
				}, {
					gid: 'dependents',
					rid: 'copyGenerals',
					type: 'boolean',
					model: 'copy.Generals',
					label: 'Copy Generals',
					label$tr$:'sales.common.copyItemDialog.copyGenerals',
					visible: true,
					sortOrder: 5
				}, {
					gid: 'dependents',
					rid: 'copyDocuments',
					type: 'boolean',
					model: 'copy.Documents',
					label: 'Copy Documents',
					label$tr$:'sales.common.copyItemDialog.copyDocuments',
					visible: true,
					sortOrder: 6
				}, {
					gid: 'dependents',
					rid: 'copyCharacteristics',
					type: 'boolean',
					model: 'copy.Characteristics',
					label: 'Copy Characteristics',
					label$tr$: 'sales.common.copyItemDialog.copyCharacteristics',
					visible: false,
					sortOrder: 7
				}, {
					gid: 'dependents',
					rid: 'copyComments',
					type: 'boolean',
					model: 'copy.Comments',
					label: 'Copy Comments',
					label$tr$:'sales.common.copyItemDialog.copyComments',
					visible: false,
					sortOrder: 8
				}];

				return {
					id: 'dependentData',
					title: 'Dependent Data',
					title$tr$: 'sales.common.copyItemDialog.title',
					form: {
						fid: 'sales.billing.wizards.copyBill.forms.dependentDataForm',
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

			service.showDeepCopyDialog = function showDeepCopyDialog(bill2BCopied) {

				if (!_.has(bill2BCopied, 'Id')) {
					$log.debug('Passed object "bill2BCopied" invalid!');
					return;
				}

				var wzConfig = {
					title: 'Copy Bill',
					title$tr$: 'sales.common.copyItemDialog.copyBillTitle',
					width: '25%',
					height: '60%',
					steps: [
						// step 1: Basic Data
						stepBasicData(bill2BCopied),
						// step 2: Dependent Data
						stepDependentData()
					],
					watches: [{
						expression: 'dialog.modalOptions.value.entity.copy.Boqs',
						fn: function (info) {
							var rows = _.find(info.scope.options.steps, {id: 'dependentData'}).form.rows;
							var boqQuantitiesRowConfig = _.find(rows, {rid: 'copyBoqQuantities'});
							boqQuantitiesRowConfig.readonly = !info.newValue;
							info.value.entity.copy.BoqQuantities = info.newValue;
							info.scope.$broadcast('form-config-updated');
						}
					}]
				};

				var createBillData = {
					// step basic data
					CompanyFk: bill2BCopied.CompanyFk,
					OrdHeaderFk: bill2BCopied.OrdHeaderFk,
					PreviousBillFk: bill2BCopied.PreviousBillFk,
					TypeFk: bill2BCopied.TypeFk,
					RubricCategoryFk: bill2BCopied.RubricCategoryFk,
					BillNo: salesBillingNumberGenerationSettingsService.provideNumberDefaultText(bill2BCopied.RubricCategoryFk, ''),
					Description: _.get(bill2BCopied, 'DescriptionInfo.Translated') + ' - Copy',
					ResponsibleCompanyFk: bill2BCopied.CompanyResponsibleFk,
					ClerkFk: bill2BCopied.ClerkFk,
					ProjectFk: bill2BCopied.ProjectFk,
					ContractTypeFk: bill2BCopied.ContractTypeFk,
					// step copy dependent data [x]
					copy: {
						Boqs: true,
						BoqQuantities: true,
						BillItems: true
					}
				};
				createBillData.getCopyIdentifiers = function getCopyIdentifiers() {
					// TODO: fill in identifiers
					var model2CpyId = {
						'Boqs': 'sales.billing.boq',
						'BoqQuantities': 'sales.billing.boqquantities',
						'BillItems': 'sales.billing.item',
						'PriceConditions': 'sales.billing.itempricecondition',
						'Generals': 'sales.billing.general',
						'Documents': 'sales.billing.document'
						// 'Characteristics': '',  // TODO: implement
						// 'Comments': ''          // TODO: implement
					};
					return _.map(_.keys(_.pickBy(createBillData.copy)), i => model2CpyId[i]);
				};

				platformWizardDialogService.translateWizardConfig(wzConfig);
				return platformWizardDialogService.showDialog(wzConfig, createBillData);
			};

			return service;

		}]);
})();
