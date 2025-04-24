(function ()
{
	/* global angular, globals, _ */
	'use strict';
	var moduleName = 'basics.costgroups';
	/**
	 * @ngdoc service
	 * @name basicsCostGroupsWizardService
	 * @description provides wizard configuarion
	 */
	angular.module(moduleName).factory('basicsCostGroupsWizardService', ['$translate', 'platformDialogService', 'basicsCommonImportDataService', 'basicsCostGroupDataService','platformSidebarWizardCommonTasksService','platformModalService',
		function ($translate, platformDialogService, basicsCommonImportDataService, basicsCostGroupDataService,platformSidebarWizardCommonTasksService,platformModalService)
		{
			function importCrbBkp()
			{
				var modalOptions =
				{
					headerText:      'Copyright',
					bodyTemplateUrl: globals.appBaseUrl + 'basics.costgroups/templates/basics-costgroups-crb-bkp-copyright.html',
					showOkButton:    true,
					width:           '560px',
					height:          '560px'
				};
				platformDialogService.showDialog(modalOptions).then(function()
				{
					var modalOptions =
					{
						headerText$tr$:  'basics.costgroups.bkpImport',
						bodyTemplateUrl:  globals.appBaseUrl + 'basics.costgroups/templates/basics-costgroups-crb-bkp-import.html',
						showOkButton:     true,
						showCancelButton: true,
						resizeable:       true,
						height:           '500px',
						width:            '250px',
						minWidth:         '250px'
					};
					platformDialogService.showDialog(modalOptions);
				});
			}

			function importCostGroups()
			{
				basicsCommonImportDataService.execute(basicsCostGroupDataService, moduleName);
			}
			function disableRecord() {
				var list = basicsCostGroupDataService.getList();
				if(list !== null && list.length > 0) {
					provideInstance(basicsCostGroupDataService, 'Disable Record', 'cloud.common.disableRecord', 'Code',
						'basics.costgroups.disableDone', 'basics.costgroups.alreadyDisabled', 'code',
						'cloud.common.questionDisableSelection', false, 12);
				}
			}

			function enableRecord() {
				let list = basicsCostGroupDataService.getList();
				if(list !== null && list.length > 0) {
					provideInstance(basicsCostGroupDataService, 'Enable Record', 'cloud.common.enableRecord', 'Code',
						'basics.costgroups.enableDone', 'basics.costgroups.alreadyEnabled', 'code',
						'cloud.common.questionEnableSelection', true, 13);
				}
			}
			function provideInstance(dataService, caption, captionTR, codeField, doneMsg, nothingToDoMsg, placeHolder, questionSelectionMsg, enable) {
				let selected = dataService.getSelected();
				let selectedEntities = dataService.getSelectedEntities();

				let modalOptions = {
					headerText: $translate.instant(captionTR),
					bodyText: '',
					iconClass: 'ico-info'
				};
				if(selectedEntities && selectedEntities.length >= 2){
					let expandedEntities = [];
					let collapsedEntities = collapseEntities(selectedEntities);
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
				let doneSelection = [];
				let notDoneSelection = [];
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
					basicsCostGroupDataService.markItemAsModified(selected);
					doneSelection.push(selected);
				} else {
					notDoneSelection.push(selected);
				}
				if(selected.ChildItems !== null && selected.ChildItems.length > 0) {
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
					if(entity.ChildItems !== null &&entity.ChildItems.length > 0) {
						expandEntities(entity.ChildItems, expandedEntities);
					}
				});
			}

			function collapseEntities(entities) {
				let items = [];
				let parentsId = [];
				function getParentId(costgroups, parentsId) {
					_.forEach(costgroups, function(costgroup) {
						if (costgroup.HasChildren) {
							parentsId.push(costgroup.Id);
							getParentId(costgroup.ChildItems, parentsId);
						}
					});
				}
				if (entities.length > 1) {
					getParentId(entities, parentsId);
					_.forEach(entities, function(item) {
						if (!item.CostGroupFk) {
							items.push(item);
						}
						else if (item.CostGroupFk && parentsId.indexOf(item.CostGroupFk) === -1) {
							items.push(item);
						}
					});
				}
				else {
					items = entities;
				}
				return items;
			}

			return { importCrbBkp: importCrbBkp,importCostGroups:importCostGroups,disableRecord:disableRecord,enableRecord: enableRecord};
		}
	]);
})();