/**
 * Created by wuj on 8/25/2015.
 */

(function (angular) {
	'use strict';

	/* jshint -W072 */ // many parameters because of dependency injection
	var moduleName = 'basics.procurementstructure';
	angular.module(moduleName).factory('procurementStructureSidebarWizardService',

		['$http', 'platformSidebarWizardConfigService', 'basicsProcurementStructureService', '$translate', 'platformTranslateService', 'platformSidebarWizardCommonTasksService', 'platformModalService',

			function ($http, platformSidebarWizardConfigService, dataService, $translate, platformTranslateService, platformSidebarWizardCommonTasksService, platformModalService) {


				var service = {};
				var wizardID = 'procurementStructureSidebarWizards';

				function disableRecord() {
					var list = dataService.getList();
					if(list !== null && list.length > 0) {
						provideInstance(dataService, 'Disable Record', 'cloud.common.disableRecord', 'Code',
							'basics.procurementstructure.disableDone', 'basics.procurementstructure.alreadyDisabled', 'code',
							'cloud.common.questionDisableSelection', false, 12);
					}
				}

				function enableRecord() {
					var list = dataService.getList();
					if(list !== null && list.length > 0) {
						provideInstance(dataService, 'Enable Record', 'cloud.common.enableRecord', 'Code',
							'basics.procurementstructure.enableDone', 'basics.procurementstructure.alreadyEnabled', 'code',
							'cloud.common.questionEnableSelection', true, 13);
					}
				}

				function provideInstance(dataService, caption, captionTR, codeField, doneMsg, nothingToDoMsg, placeHolder, questionSelectionMsg, enable) {
					var selected = dataService.getSelected();
					var selectedEntities = dataService.getSelectedEntities();

					var modalOptions = {
						headerText: $translate.instant(captionTR),
						bodyText: '',
						iconClass: 'ico-info'
					};
					if(selectedEntities && selectedEntities.length >= 2){
						var expandedEntities = [];
						var collapsedEntities = collapseEntities(selectedEntities);
						expandEntities(selectedEntities, expandedEntities);
						modalOptions.bodyText = platformSidebarWizardCommonTasksService.prepareMessageText(questionSelectionMsg, expandedEntities, codeField, 'sel');
						var doneSelection = [];
						var notDoneSelection = [];
						platformModalService.showYesNoDialog(modalOptions.bodyText, modalOptions.headerText, 'yes')
							.then( function(result){
								if(result.yes){
									angular.forEach(collapsedEntities, function(sel){
										recordIsLive(sel, modalOptions, doneMsg, nothingToDoMsg, codeField, placeHolder, doneSelection, notDoneSelection, enable);
									});
									modalOptions.bodyText = '';
									if(doneSelection && doneSelection.length >0) {
										modalOptions.bodyText = platformSidebarWizardCommonTasksService.prepareMessageText(doneMsg, doneSelection, codeField, placeHolder);
									}
									if(notDoneSelection && notDoneSelection.length >0){
										modalOptions.bodyText += platformSidebarWizardCommonTasksService.prepareMessageText(nothingToDoMsg, notDoneSelection, codeField, placeHolder);
									}
									platformModalService.showDialog(modalOptions);
								}
							});
					}
					else if(selected && selected.Id > 0) {
						recordData(selected, modalOptions, doneMsg, nothingToDoMsg, codeField, placeHolder, enable);
					}
					else
					{
						modalOptions.bodyText = platformSidebarWizardCommonTasksService.prepareMessageText('cloud.common.noCurrentSelection');
						platformModalService.showDialog(modalOptions);
					}
				}

				function recordData(selected, modalOptions, doneMsg, nothingToDoMsg, codeField, placeHolder, enable){
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

				function recordIsLive(selected, modalOptions, doneMsg, nothingToDoMsg, codeField, placeHolder, doneSelection, notDoneSelection, enable){

					if(selected.IsLive !== enable) {
						selected.IsLive = enable;
						dataService.markItemAsModified(selected);
						doneSelection.push(selected);
					} else {
						notDoneSelection.push(selected);
					}
					if(selected.ChildItems.length > 0) {
						_.forEach(selected.ChildItems, function(item) {
							recordIsLive(item, modalOptions, doneMsg, nothingToDoMsg, codeField, placeHolder, doneSelection, notDoneSelection, enable);
						});
					}
				}

				function expandEntities(entities, expandedEntities) {
					_.forEach(entities, function(entity) {
						if (!_.find(expandedEntities, {Id: entity.Id})) {
							expandedEntities.push(entity);
						}
						if(entity.ChildItems.length > 0) {
							expandEntities(entity.ChildItems, expandedEntities);
						}
					});
				}

				function collapseEntities(entities) {
					var items = [];
					var parentsId = [];
					function getParentId(prcStructures, parentsId) {
						_.forEach(prcStructures, function(prcStructure) {
							if (prcStructure.HasChildren) {
								parentsId.push(prcStructure.Id);
								getParentId(prcStructure.ChildItems, parentsId);
							}
						});
					}
					if (entities.length > 1) {
						getParentId(entities, parentsId);
						_.forEach(entities, function(item) {
							if (!item.PrcStructureFk) {
								items.push(item);
							}
							else if (item.PrcStructureFk && parentsId.indexOf(item.PrcStructureFk) === -1) {
								items.push(item);
							}
						});
					}
					else {
						items = entities;
					}
					return items;
				}

				service.disableRecord = disableRecord;//().fn;

				service.enableRecord = enableRecord;//().fn;

				var wizardConfig = {
					showImages: true,
					showTitles: true,
					showSelected: true,
					items: [
						{
							id: 1,
							text: 'Procurement Structures',
							text$tr$: 'basics.procurementstructure.wizardTitle',
							groupIconClass: 'sidebar-icons ico-wiz-change-status',
							visible: true,
							subitems: [
								//disableRecord(),
								//enableRecord()
							]
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
				if (!platformTranslateService.registerModule('basics.procurementstructure')) {
					// if translation is already available, call loadTranslation directly
					loadTranslations();
				}

				return service;
			}
		]);
})(angular);