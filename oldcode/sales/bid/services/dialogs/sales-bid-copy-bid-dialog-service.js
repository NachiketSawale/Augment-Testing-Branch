/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'sales.bid';
	var salesBidModule = angular.module(moduleName);

	salesBidModule.factory('salesBidCopyBidDialogService', ['_', '$log', '$translate', '$injector', 'platformTranslateService', 'platformWizardDialogService', 'salesBidNumberGenerationSettingsService', 'salesBidCreateBidDialogService',
		function (_, $log, $translate, $injector, platformTranslateService, platformWizardDialogService, salesBidNumberGenerationSettingsService, salesBidCreateBidDialogService) {

			var service = {};

			function stepBasicData(bidEntity) {
				var formConfig = _.cloneDeep(salesBidCreateBidDialogService.getFormConfig());
				platformTranslateService.translateFormConfig(formConfig);

				var readOnlyRows = ['ordheaderfk', 'typeFk', 'rubricCategoryFk', 'projectfk', 'contractTypeFk'];
				_.each(readOnlyRows, (rowName) => {
					var row = _.find(formConfig.rows, {rid: rowName});
					if (row) {
						row.readonly = true;
					}
				});
				// 'code' => generated/readonly
				var readonly = salesBidNumberGenerationSettingsService.hasToGenerateForRubricCategory(bidEntity.RubricCategoryFk);
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
					label$tr$: 'sales.common.copyItemDialog.copyCharacteristics',
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
						fid: 'sales.bid.wizards.copyBid.forms.dependentDataForm',
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

			service.showDeepCopyDialog = function showDeepCopyDialog(bid2BCopied) {

				if (!_.has(bid2BCopied, 'Id')) {
					$log.debug('Passed object "bid2BCopied" invalid!');
					return;
				}

				var wzConfig = {
					title: 'Copy Bid',
					title$tr$: 'sales.common.copyItemDialog.copyBidTitle',
					width: '25%',
					height: '60%',
					steps: [
						// step 1: Basic Data
						stepBasicData(bid2BCopied),
						// step 2: Dependent Data
						stepDependentData()
					]
				};

				var createBidData = {
					// step basic data
					CompanyFk: bid2BCopied.CompanyFk,
					RubricCategoryFk: bid2BCopied.RubricCategoryFk,
					Code: salesBidNumberGenerationSettingsService.provideNumberDefaultText(bid2BCopied.RubricCategoryFk, ''),
					Description: _.get(bid2BCopied, 'DescriptionInfo.Translated') + ' - Copy',
					ResponsibleCompanyFk: bid2BCopied.CompanyResponsibleFk,
					ClerkFk: bid2BCopied.ClerkFk,
					ProjectFk: bid2BCopied.ProjectFk,
					ContractTypeFk: bid2BCopied.ContractTypeFk,
					BusinesspartnerFk: bid2BCopied.BusinesspartnerFk,
					SubsidiaryFk: bid2BCopied.SubsidiaryFk,
					CustomerFk: bid2BCopied.CustomerFk,
					BidHeaderFk: bid2BCopied.BidHeaderFk,
					// step copy dependent data [x]
					copy: {
						Boqs: true,
						Certificates: true
					}
				};
				createBidData.getCopyIdentifiers = function getCopyIdentifiers() {
					// TODO: fill in identifiers
					var model2CpyId = {
						'Boqs': 'sales.bid.boq',
						'Generals': 'sales.bid.general',
						'Certificates': 'sales.bid.certificate',
						'Documents': 'sales.bid.document',
						// 'Characteristics': '',
						// 'Comments': ''
					};
					return _.map(_.keys(_.pickBy(createBidData.copy)), i => model2CpyId[i]);
				};

				platformWizardDialogService.translateWizardConfig(wzConfig);
				return platformWizardDialogService.showDialog(wzConfig, createBidData);
			};

			return service;

		}]);
})();
