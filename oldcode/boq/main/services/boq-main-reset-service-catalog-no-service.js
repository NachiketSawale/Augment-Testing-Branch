/**
 * Created by bh on 04.09.2020.
 */
(function () {
	/* global _ */
	'use strict';
	var moduleName = 'boq.main';

	/**
	 * @ngdoc service
	 * @name boqMainResetServiceCatalogNoService
	 * @function
	 *
	 * @description
	 * boqMainResetServiceCatalogNoService is the data service for all functionality related to boq renumbering functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('boqMainResetServiceCatalogNoService', ['$log', 'platformModalService', 'platformModalFormConfigService', 'platformTranslateService', 'platformSidebarWizardConfigService', 'platformGridAPI', '$translate',
		function ($log, platformModalService, platformModalFormConfigService, platformTranslateService, platformSidebarWizardConfigService, platformGridAPI, $translate) {

			var service = {};

			var resetOptions = {
				resetMode: 1 // 1: reset service catalog no of whole boq; 2: reset service catalog no of currently selected items and their children
			};

			var formConfig = {
				showGrouping: true,
				change: 'change',
				groups: [
					{gid: '1', header: 'Selection', header$tr$: 'boq.main.resetServiceCatalogNoSelection', isOpen: true, visible: true, sortOrder: 1}
				],
				rows: [
					{
						gid: '1', rid: 'selection', label: 'Selection', label$tr$: 'boq.main.resetServiceCatalogNoSelection',
						type: 'select', model: 'resetMode',
						options: {
							displayMember: 'Description',
							valueMember: 'Id',
							inputDomain: 'description',
							select: 1,
							items: [
								{Id: 1, Description: ''}, // Description set below
								{Id: 2, Description: ''}  // Description set below
							]
						},
						readonly: false, disabled: false, visible: true, sortOrder: 1
					}
				]
			};

			platformTranslateService.translateFormConfig(formConfig);

			service.resetServiceCatalogNoOfBoqItems = function renumberBoqItems(boqMainService) {
				var modalResetBoqConfig = null;
				var modalOptions = null;
				var title = 'boq.main.boqResetServiceCatalogNo';

				if (!boqMainService.isRootBoqItemLoaded()) {
					modalOptions = {
						headerTextKey: 'boq.main.warning',
						bodyTextKey: 'boq.main.gaebImportBoqMissing', // Delivers a reasonable message although originally meant for boq import.
						showOkButton: true,
						iconClass: 'ico-warning'
					};
					platformModalService.showDialog(modalOptions);
					$log.warn('Resetting service catalog numbers not possible - reason: No BoQ is selected!');
					return;
				}

				formConfig.rows[0].options.items[0].Description = $translate.instant('boq.main.resetServiceCataLogNoModeAll');
				formConfig.rows[0].options.items[1].Description = $translate.instant('boq.main.resetServiceCataLogNoModeSelected');

				modalResetBoqConfig = {
					title: $translate.instant(title),
					dataItem: resetOptions,
					formConfiguration: formConfig,
					resizeable: true,
					showOkButton: true,
					scope: platformSidebarWizardConfigService.getCurrentScope()
				};

				platformModalFormConfigService.showDialog(modalResetBoqConfig).then(function (result) {
					if (result.ok) {
						var selectedBoqItems = null;
						var errorModalOptions = null;

						platformGridAPI.grids.commitAllEdits();

						if (resetOptions.resetMode === 2) {
							selectedBoqItems = boqMainService.getSelectedEntities();

							if (!_.isArray(selectedBoqItems) || selectedBoqItems.length === 0) {
								errorModalOptions = {
									headerTextKey: 'boq.main.resetServiceCatalogNoInvalidSelection',
									bodyTextKey: 'boq.main.resetServiceCatalogNoNoValidSelection',
									showOkButton: true,
									iconClass: 'ico-error'
								};

								return platformModalService.showDialog(errorModalOptions).then(function () {
									return false;
								});
							}
						}

						boqMainService.resetServiceCatalogNoForBoqItems(selectedBoqItems).then(function (resetSucceeded) {
							if (!resetSucceeded) {
								errorModalOptions = {
									headerTextKey: 'boq.main.resetServiceCatalogNoAborted',
									bodyTextKey: 'boq.main.resetServiceCatalogNoFailed',
									showOkButton: true,
									iconClass: 'ico-error'
								};

								return platformModalService.showDialog(errorModalOptions).then(function () {
									return false;
								});
							}
						});
					}
				});
			};

			return service;
		}]);
})();
