/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'sales.wip';
	var salesWipModule = angular.module(moduleName);

	salesWipModule.factory('salesWipCopyWipDialogService', ['_', '$log', '$translate', '$injector', 'platformTranslateService', 'platformWizardDialogService', 'salesWipNumberGenerationSettingsService', 'salesWipCreateWipDialogService',
		function (_, $log, $translate, $injector, platformTranslateService, platformWizardDialogService, salesWipNumberGenerationSettingsService, salesWipCreateWipDialogService) {

			var service = {};

			function stepBasicData(wipEntity) {
				var formConfig = _.cloneDeep(salesWipCreateWipDialogService.getFormConfig());

				// clean up form config, keep only some fields:
				var baseGroup = _.find(formConfig.groups, {gid: 'baseGroup'});
				_.set(baseGroup, 'attributes', [
					'ordheaderfk', 'rubriccategoryfk', 'code', 'description', 'responsiblecompanyfk', 'clerkfk', 'projectfk'
				]);
				_.remove(formConfig.rows, function(item) { return !_.includes(baseGroup.attributes, _.toLower(item.rid));});

				platformTranslateService.translateFormConfig(formConfig);

				var readOnlyRows = ['ordheaderfk', 'typeFk', 'rubricCategoryFk', 'projectfk'];
				_.each(readOnlyRows, (rowName) => {
					var row = _.find(formConfig.rows, {rid: rowName});
					if (row) {
						row.readonly = true;
					}
				});
				// 'code' => generated/readonly
				var readonly = salesWipNumberGenerationSettingsService.hasToGenerateForRubricCategory(wipEntity.RubricCategoryFk);
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
					visible: false,   // TODO: implement option
					sortOrder: 5
				}, {
					gid: 'dependents',
					rid: 'copyComments',
					type: 'boolean',
					model: 'copy.Comments',
					label: 'Copy Comments',
					label$tr$:'sales.common.copyItemDialog.copyComments',
					visible: false,   // TODO: implement option
					sortOrder: 6
				}];

				return {
					id: 'dependentData',
					title: 'Dependent Data',
					title$tr$: 'sales.common.copyItemDialog.title',
					form: {
						fid: 'sales.wip.wizards.copyWip.forms.dependentDataForm',
						version: '0.2.0',
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

			service.showDeepCopyDialog = function showDeepCopyDialog(wip2BCopied) {

				if (!_.has(wip2BCopied, 'Id')) {
					$log.debug('Passed object "wip2BCopied" invalid!');
					return;
				}

				var wzConfig = {
					title: 'Copy Wip',
					title$tr$: 'sales.common.copyItemDialog.copyWipTitle',
					width: '25%',
					height: '50%',
					steps: [
						// step 1: Basic Data
						stepBasicData(wip2BCopied),
						// step 2: Dependent Data
						stepDependentData()
					]
				};

				var createWipData = {
					// step basic data
					CompanyFk: wip2BCopied.CompanyFk,
					OrdHeaderFk: wip2BCopied.OrdHeaderFk,
					RubricCategoryFk: wip2BCopied.RubricCategoryFk,
					Code:  salesWipNumberGenerationSettingsService.provideNumberDefaultText(wip2BCopied.RubricCategoryFk, ''),
					Description: _.get(wip2BCopied, 'DescriptionInfo.Translated') + ' - Copy',
					ResponsibleCompanyFk: wip2BCopied.CompanyResponsibleFk,
					ClerkFk: wip2BCopied.ClerkFk,
					ProjectFk: wip2BCopied.ProjectFk,
					// step copy dependent data [x]
					copy: {
						Boqs: true
					}
				};
				createWipData.getCopyIdentifiers = function getCopyIdentifiers() {
					// TODO: fill in identifiers
					var model2CpyId = {
						'Boqs': 'sales.wip.boq',
						'Generals': 'sales.wip.general',
						'Documents': 'sales.wip.document',
						// 'Characteristics': '',
						// 'Comments': ''
					};
					return _.map(_.keys(_.pickBy(createWipData.copy)), i => model2CpyId[i]);
				};

				platformWizardDialogService.translateWizardConfig(wzConfig);
				return platformWizardDialogService.showDialog(wzConfig, createWipData);
			};

			return service;

		}]);
})();
