(function (angular) {
	'use strict';
	/* global globals,_ */

	/* jshint -W072 */
	angular.module('constructionsystem.master').factory('constructionSystemMasterWizardService',
		['$http','platformTranslateService', 'platformSidebarWizardConfigService', '$translate', '$injector', 'cloudDesktopSidebarService',
			'platformSidebarWizardCommonTasksService',
			'platformModalService',
			'constructionSystemMasterHeaderService',
			'constructionSystemMasterTemplateDataService',
			'constructionSystemMasterParameter2TemplateDataService',
			'constructionSystemMasterImport5DContentService',
			function ($http, platformTranslateService, platformSidebarWizardConfigService, $translate, $injector, cloudDesktopSidebarService,
				platformSidebarWizardCommonTasksService,
				platformModalService,
				headerDataService,
				cosMasterTemplateDataService,
				cosMasterParam2TemplateDataService,
				constructionSystemMasterImport5DContentService) {

				var service = {};

				var wizardID = 'constructionSystemMasterSidebarWizards';

				function disableRecord() {
					return platformSidebarWizardCommonTasksService.provideDisableInstance(headerDataService, 'Disable Record', 'cloud.common.disableRecord', 'Code',
						'constructionsystem.master.disableDone', 'constructionsystem.master.alreadyDisabled', 'code', 13);
				}

				function enableRecord() {
					return platformSidebarWizardCommonTasksService.provideEnableInstance(headerDataService, 'Enable Record', 'cloud.common.enableRecord', 'Code',
						'constructionsystem.master.enableDone', 'constructionsystem.master.alreadyEnabled', 'code', 14);
				}

				service.disableRecord = disableRecord().fn;

				service.enableRecord = enableRecord().fn;

				service.updateParameterTemplates = function() {
					if (!cosMasterTemplateDataService.hasSelection()) {
						platformModalService.showMsgBox($translate.instant('constructionsystem.master.pleaseSelectTemplates'), $translate.instant('constructionsystem.master.updateParameterTemplates'), 'warning');
						return;
					}
					var templateIds = _.map(cosMasterTemplateDataService.getSelectedEntities(), function(e) {
						return e.Id;
					});
					var httpRoute = globals.webApiBaseUrl + 'constructionsystem/master/parameter2template/updateParameterTemplates',
						postData = {
							TemplateIds: templateIds
						};

					$http.post(httpRoute, postData).then(function(){
						platformModalService.showMsgBox($translate.instant('constructionsystem.master.finishUpdateParameterTemplates'), $translate.instant('constructionsystem.master.updateParameterTemplates'), 'info');
						cosMasterParam2TemplateDataService.clearCache();
						cosMasterParam2TemplateDataService.load();
					});
				};

				service.Import5DContent = function () {
					constructionSystemMasterImport5DContentService.execute();
				};

				var wizards = {
					showImages: true,
					showTitles: true,
					showSelected: true,
					items: [
						{
							id: 1,
							text: 'Change Status Wizard',
							text$tr$: 'procurement.common.wizard.change.status.wizard',
							groupIconClass: 'sidebar-icons ico-wiz-change-status',
							visible: true,
							subitems: [
								disableRecord(),
								enableRecord()
							]
						}
					]
				};

				service.active = function activate() {
					platformSidebarWizardConfigService.activateConfig(wizardID, wizards);
				};

				service.deactive = function deactivate() {
					platformSidebarWizardConfigService.deactivateConfig(wizardID);
				};
				// loads or updates translated strings
				var loadTranslations = function () {
					platformTranslateService.translateObject(wizards, ['text']);

				};

				// register translation changed event
				platformTranslateService.translationChanged.register(loadTranslations);

				// register a module - translation table will be reloaded if module isn't available yet
				if (!platformTranslateService.registerModule('constructionsystem.master')) {
					// if translation is already available, call loadTranslation directly
					loadTranslations();
				}
				return service;
			}]);
})(angular);