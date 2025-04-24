/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	const moduleName = 'model.change';

	/**
	 * @ngdoc service
	 * @name modelChangeGenerateDefectsWizardService
	 * @function
	 *
	 * @description
	 * Provides a wizard to generate defects from changes.
	 */
	angular.module(moduleName).factory('modelChangeGenerateDefectsWizardService',
		modelChangeGenerateDefectsWizardService);

	modelChangeGenerateDefectsWizardService.$inject = ['_', '$http', '$translate', '$q', 'platformTranslateService',
		'basicsLookupdataConfigGenerator', 'platformModalFormConfigService', 'mainViewService', '$injector',
		'platformDialogService'];

	function modelChangeGenerateDefectsWizardService(_, $http, $translate, $q, platformTranslateService,
		basicsLookupdataConfigGenerator, platformModalFormConfigService, mainViewService, $injector,
		platformDialogService) {

		const service = {};

		function showDialog(modelId, changeSetId) {
			return $http.get(globals.webApiBaseUrl + 'model/change/defectcreationdefaults', {
				params: {
					modelId: modelId,
					changeSetId: changeSetId
				}
			}).then(function (response) {
				const defaults = response.data;

				const settings = {
					linkModel: defaults.ModelsFromSameProject ? '11' : '01',
					ObjectSetTypeId: defaults.ObjectSetTypeId,
					DefectTypeId: defaults.DefectTypeId,
					ObjectSetNamePattern: defaults.ObjectSetNamePattern,
					ObjectSetRemarkPattern: defaults.ObjectSetRemarkPattern,
					CodePattern: defaults.CodePattern,
					DescriptionPattern: defaults.DescriptionPattern,
					DetailPattern: defaults.DetailPattern
				};

				const modelLinkOptions = [{
					text$tr$: 'model.change.defectsWizard.linkModel1',
					value: '01'
				}, {
					text$tr$: 'model.change.defectsWizard.linkModel2',
					value: '10'
				}];
				if (defaults.ModelsFromSameProject) {
					modelLinkOptions.splice(0, 0, {
						text$tr$: 'model.change.defectsWizard.linkAll',
						value: '11'
					});
				}
				platformTranslateService.translateObject(modelLinkOptions, 'text');

				const dlgConfig = {
					title: $translate.instant('model.change.defectsWizard.title'),
					dataItem: settings,
					formConfiguration: {
						fid: 'model.change.createdefects',
						showGrouping: true,
						groups: [{
							gid: 'linkage',
							isOpen: true,
							header$tr$: 'model.change.defectsWizard.linkage'
						}, {
							gid: 'grouping',
							isOpen: true,
							header$tr$: 'model.change.defectsWizard.grouping'
						}, {
							gid: 'defect',
							isOpen: true,
							header$tr$: 'model.change.defectsWizard.defect'
						}],
						rows: [{
							gid: 'linkage',
							rid: 'model',
							label$tr$: 'model.change.defectsWizard.linkModel',
							type: 'select',
							options: {
								items: modelLinkOptions,
								valueMember: 'value',
								displayMember: 'text',
								modelIsObject: false
							},
							model: 'linkModel'
						}, {
							gid: 'linkage',
							rid: 'osName',
							label$tr$: 'model.change.defectsWizard.objectSetNamePattern',
							type: 'description',
							model: 'ObjectSetNamePattern'
						}, {
							gid: 'linkage',
							rid: 'osRemark',
							label$tr$: 'model.change.defectsWizard.objectSetRemarkPattern',
							type: 'remark',
							model: 'ObjectSetRemarkPattern'
						}, basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.objectsettype', '', {
							gid: 'linkage',
							rid: 'osType',
							label$tr$: 'model.change.defectsWizard.objectSetType',
							model: 'ObjectSetTypeId'
						}), {
							gid: 'grouping',
							rid: 'groupByChangeType',
							label$tr$: 'model.change.defectsWizard.groupByChangeType',
							type: 'boolean',
							model: 'GroupByChangeType'
						}, {
							gid: 'grouping',
							rid: 'groupByObject',
							label$tr$: 'model.change.defectsWizard.groupByObject',
							type: 'boolean',
							model: 'GroupByObject'
						}, {
							gid: 'grouping',
							rid: 'groupByPropertyKey',
							label$tr$: 'model.change.defectsWizard.groupByPropertyKey',
							type: 'boolean',
							model: 'GroupByPropertyKey'
						}, {
							gid: 'defect',
							rid: 'defectCode',
							label$tr$: 'model.change.defectsWizard.defectCodePattern',
							type: 'description',
							model: 'CodePattern'
						}, {
							gid: 'defect',
							rid: 'defectDesc',
							label$tr$: 'model.change.defectsWizard.defectDescriptionPattern',
							type: 'description',
							model: 'DescriptionPattern'
						}, {
							gid: 'defect',
							rid: 'defectDetail',
							label$tr$: 'model.change.defectsWizard.defectDetailPattern',
							type: 'description',
							model: 'DetailPattern'
						}, basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.defecttype', '', {
							gid: 'defect',
							rid: 'defectType',
							label$tr$: 'model.change.defectsWizard.defectType',
							model: 'DefectTypeId'
						})]
					}
				};

				platformTranslateService.translateFormConfig(dlgConfig.formConfiguration);
				return platformModalFormConfigService.showDialog(dlgConfig).then(function (result) {
					if (result.ok) {
						return result.data;
					} else {
						return $q.reject('Dialog cancelled by user.');
					}
				});
			});
		}

		service.runWizard = function () {
			let dlgPromise;
			let changeSetId;
			let changeIds;
			switch (mainViewService.getCurrentModuleName()) {
				case 'model.changeset':
					(function runWizardForChangeSet() {
						const modelChangeSetDataService = $injector.get('modelChangeSetDataService');
						const selComparison = modelChangeSetDataService.getSelected();
						if (selComparison) {
							changeSetId = {
								ModelId: selComparison.ModelFk,
								ChangeSetId: selComparison.Id
							};
							dlgPromise = showDialog(selComparison.ModelFk, selComparison.Id);
						} else {
							dlgPromise = platformDialogService.showMsgBox('model.change.defectsWizard.noChangeSetSel', 'model.change.defectsWizard.wizardUnavailable', 'info').then(function () {
								return $q.reject('No comparison selected.');
							});
						}
					})();
					break;
				case 'model.change':
					(function runWizardForChanges() {
						const modelChangeDataService = $injector.get('modelChangeDataService');
						const selComparison = modelChangeDataService.getChangeSetId();
						if (selComparison) {
							const allLoadedChanges = modelChangeDataService.getList();
							if (!_.isEmpty(allLoadedChanges)) {
								changeSetId = {
									ModelId: selComparison.modelId,
									ChangeSetId: selComparison.changeSetId
								};

								const selChanges = modelChangeDataService.getSelectedEntities();
								changeIds = _.map(_.isEmpty(selChanges) ? allLoadedChanges : selChanges, function (chg) {
									return chg.Id;
								});

								dlgPromise = showDialog(selComparison.modelId, selComparison.changeSetId);
							} else {
								dlgPromise = platformDialogService.showMsgBox('model.change.defectsWizard.noChangesLoaded', 'model.change.defectsWizard.wizardUnavailable', 'info').then(function () {
									return $q.reject('No changes loaded.');
								});
							}
						} else {
							dlgPromise = platformDialogService.showMsgBox('model.change.defectsWizard.noChangeSetSel', 'model.change.defectsWizard.wizardUnavailable', 'info').then(function () {
								return $q.reject('No comparison selected.');
							});
						}
					})();
					break;
				default:
					throw new Error('This wizard cannot be run in module ' + mainViewService.getCurrentModuleName() + '.');
			}

			return dlgPromise.then(function (settings) {
				settings.LinkModel1Objects = Boolean(settings.linkModel.charAt(0) === '1');
				settings.LinkModel2Objects = Boolean(settings.linkModel.charAt(1) === '1');
				delete settings.linkModel;
				if (_.isArray(changeIds)) {
					settings.ChangeIds = changeIds;
				}
				_.assign(settings, changeSetId);

				return $http.post(globals.webApiBaseUrl + 'model/change/createdefects', settings).then(function (response) {
					return platformDialogService.showDialog({
						headerText$tr$: 'model.change.defectsWizard.completedTitle',
						bodyText$tr$: 'model.change.defectsWizard.completedDesc',
						bodyText$tr$param$: {
							defectCount: response.data.DefectCount,
							projectName: response.data.ProjectName,
							projectCode: response.data.ProjectCode
						},
						showOkButton: true,
						iconClass: 'info'
					});
				});
			}, function (reason) {
				return $q.reject('Wizard not run: ' + reason);
			});
		};

		return service;
	}
})(angular);
