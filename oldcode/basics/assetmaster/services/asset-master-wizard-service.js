/**
 * Created by sfi on 8/27/2015.
 */
(function config(angular) {
	'use strict';

	/* jshint -W072 */ // many parameters because of dependency injection

	var moduleName = 'basics.assetmaster';
	angular.module(moduleName).factory('basicsAssetMasterSidebarWizardService', [
		'_',
		'platformSidebarWizardConfigService',
		'basicsAssetMasterService',
		'$translate',
		'platformTranslateService',
		'platformSidebarWizardCommonTasksService', 'platformModalService',

		function basicsAssetMasterSidebarWizardService(
			_,
			platformSidebarWizardConfigService,
			dataService,
			$translate,
			platformTranslateService,
			platformSidebarWizardCommonTasksService,
			platformModalService) {

			var service = {};
			var wizardID = 'basicsAssetMasterSidebarWizards';

			function disableRecord() {
				var list = dataService.getList();
				if (list !== null && list.length > 0) {
					provideInstance(dataService, 'Disable Record', 'cloud.common.disableRecord', 'Code',
						'basics.assetmaster.disableDone', 'basics.assetmaster.alreadyDisabled', 'code',
						'cloud.common.questionDisableSelection', false, 12);
				}

			}

			function enableRecord() {
				var list = dataService.getList();
				if (list !== null && list.length > 0) {
					provideInstance(dataService, 'Enable Record', 'cloud.common.enableRecord', 'Code',
						'basics.assetmaster.enableDone', 'basics.assetmaster.alreadyEnabled', 'code',
						'cloud.common.questionEnableSelection', true, 13);
				}
			}

			/* jshint -W072 */ // many parameters because they are needed
			function provideInstance(dataService, caption, captionTR, codeField, doneMsg, nothingToDoMsg, placeHolder, questionSelectionMsg, enable) {
				var selected = dataService.getSelected();
				var selectedEntities = dataService.getSelectedEntities();

				var modalOptions = {
					headerText: $translate.instant(captionTR),
					bodyText: '',
					iconClass: 'ico-info'
				};
				if (selectedEntities && selectedEntities.length >= 2) {
					var expandedEntities = [];
					var collapsedEntities = collapseEntities(selectedEntities);
					expandEntities(selectedEntities, expandedEntities);
					modalOptions.bodyText = platformSidebarWizardCommonTasksService.prepareMessageText(questionSelectionMsg, expandedEntities, codeField, 'sel');
					var doneSelection = [];
					var notDoneSelection = [];
					platformModalService.showYesNoDialog(modalOptions.bodyText, modalOptions.headerText, 'yes').then(function callback(result) {
						if (result.yes) {
							angular.forEach(collapsedEntities, function iterator(sel) {
								recordIsLive(sel, modalOptions, doneMsg, nothingToDoMsg, codeField, placeHolder, doneSelection, notDoneSelection, enable);
							});
							modalOptions.bodyText = '';
							if (doneSelection && doneSelection.length > 0) {
								modalOptions.bodyText = platformSidebarWizardCommonTasksService.prepareMessageText(doneMsg, doneSelection, codeField, placeHolder);
							}
							if (notDoneSelection && notDoneSelection.length > 0) {
								modalOptions.bodyText += platformSidebarWizardCommonTasksService.prepareMessageText(nothingToDoMsg, notDoneSelection, codeField, placeHolder);
							}
							platformModalService.showDialog(modalOptions);
						}
					});
				} else if (selected && selected.Id > 0) {
					recordData(selected, modalOptions, doneMsg, nothingToDoMsg, codeField, placeHolder, enable);
				} else {
					modalOptions.bodyText = platformSidebarWizardCommonTasksService.prepareMessageText('cloud.common.noCurrentSelection');
					platformModalService.showDialog(modalOptions);
				}
			}

			function recordData(selected, modalOptions, doneMsg, nothingToDoMsg, codeField, placeHolder, enable) {
				var doneSelection = [];
				var notDoneSelection = [];
				recordIsLive(selected, modalOptions, doneMsg, nothingToDoMsg, codeField, placeHolder, doneSelection, notDoneSelection, enable);

				if (doneSelection && doneSelection.length) {
					modalOptions.bodyText = platformSidebarWizardCommonTasksService.prepareMessageText(doneMsg, doneSelection, codeField, placeHolder);
					platformModalService.showDialog(modalOptions);
				}
				if (notDoneSelection && notDoneSelection.length) {
					modalOptions.bodyText = platformSidebarWizardCommonTasksService.prepareMessageText(doneMsg, notDoneSelection, codeField, placeHolder);
					platformModalService.showDialog(modalOptions);
				}
			}

			// enable or disable record and its children record
			function recordIsLive(selected, modalOptions, doneMsg, nothingToDoMsg, codeField, placeHolder, doneSelection, notDoneSelection, enable) {

				if (selected.IsLive !== enable) {
					selected.IsLive = enable;
					dataService.markItemAsModified(selected);
					if (!_.find(doneSelection, {Id: selected.Id})) {
						doneSelection.push(selected);
					}
				} else {
					if (!_.find(notDoneSelection, {Id: selected.Id})) {
						notDoneSelection.push(selected);
					}
				}
				if (selected.AssetMasterChildren.length > 0) {
					_.forEach(selected.AssetMasterChildren, function iterator(item) {
						recordIsLive(item, modalOptions, doneMsg, nothingToDoMsg, codeField, placeHolder, doneSelection, notDoneSelection, enable);
					});
				}
			}

			function expandEntities(entities, expandedEntities) {
				_.forEach(entities, function iterator(entity) {
					if (!_.find(expandedEntities, {Id: entity.Id})) {
						expandedEntities.push(entity);
					}
					if (entity.AssetMasterChildren.length > 0) {
						expandEntities(entity.AssetMasterChildren, expandedEntities);
					}
				});
			}

			function collapseEntities(entities) {
				var items = [];
				var parentsId = [];

				function getParentId(assetMasters, parentsId) {
					_.forEach(assetMasters, function iterator(assetMaster) {
						if (assetMaster.HasChildren) {
							parentsId.push(assetMaster.Id);
							getParentId(assetMaster.AssetMasterChildren, parentsId);
						}
					});
				}

				if (entities.length > 1) {
					getParentId(entities, parentsId);
					angular.forEach(entities, function iterator(item) {
						if (!item.AssetMasterParentFk) {
							items.push(item);
						} else if (item.AssetMasterParentFk && parentsId.indexOf(item.AssetMasterParentFk) === -1) {
							items.push(item);
						}
					});
				} else {
					items = entities;
				}
				return items;
			}

			service.disableRecord = disableRecord;// .fn;
			service.enableRecord = enableRecord;// ().fn;

			var wizardConfig = {
				showImages: true,
				showTitles: true,
				showSelected: true,
				items: [
					{
						id: 1,
						text: 'Asset Master',
						text$tr$: 'basics.assetmaster.moduleName',
						groupIconClass: 'sidebar-icons ico-wiz-change-status',
						visible: true,
						subitems: []
					}
				]
			};

			service.activate = function activate() {
				platformSidebarWizardConfigService.activateConfig(wizardID, wizardConfig);
			};

			service.deactivate = function deactivate() {
				platformSidebarWizardConfigService.deactivateConfig(wizardID);
			};

			// loads or updates translated strings
			var loadTranslations = function () {
				platformTranslateService.translateObject(wizardConfig, ['text']);

			};

			// register translation changed event
			platformTranslateService.translationChanged.register(loadTranslations);

			// register a module - translation table will be reloaded if module isn't available yet
			if (!platformTranslateService.registerModule('basics.assetmaster')) {
				// if translation is already available, call loadTranslation directly
				loadTranslations();
			}

			return service;
		}
	]);
})(angular);