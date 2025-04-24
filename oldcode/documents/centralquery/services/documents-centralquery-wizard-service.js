/**
 * Created by pel on 3/16/2020.
 */

(function (angular) {
	'use strict';
	/* global  */
	var moduleName = 'documents.centralquery';
	/* jshint -W072 */
	angular.module(moduleName).factory('documentsCentralQueryWizardService',
		['platformTranslateService','platformSidebarWizardConfigService','documentCentralQueryDataService','platformSidebarWizardCommonTasksService',
			'$translate','platformModalService','$http','cloudDesktopSidebarService','documentProjectDocumentsStatusChangeService',
			'documentsCentralquerySyncBim360DocumentToITwo40DialogService','documentsCentralquerySyncITwo40DocumentToBim360DialogService',
			'documentProjectChangeRubricCategoryService','platformDialogService','$injector',

			function (platformTranslateService,platformSidebarWizardConfigService,documentCentralQueryDataService,platformSidebarWizardCommonTasksService,
				$translate,platformModalService,$http,cloudDesktopSidebarService,documentProjectDocumentsStatusChangeService,
				documentsCentralquerySyncBim360DocumentToITwo40DialogService, documentsCentralquerySyncITwo40DocumentToBim360DialogService,
				documentProjectChangeRubricCategoryService, platformDialogService, $injector) {

				var service = {};

				function changeStatusForProjectDocument() {
					return documentProjectDocumentsStatusChangeService.provideStatusChangeInstance(documentCentralQueryDataService, moduleName);
				}
				service.changeStatusForProjectDocument = changeStatusForProjectDocument().fn;

				service.syncBim360Document2itwo40 = function syncBim360Document2itwo40(){
					documentsCentralquerySyncBim360DocumentToITwo40DialogService.showPostDialog();
				};
				service.syncItwo40Document2bim360 = function syncItwo40Document2bim360(){
					documentsCentralquerySyncITwo40DocumentToBim360DialogService.showPostDialog();
				};
				service.changeRubricCategory = function changeRubricCategory(wizardParams, userParams){
					documentProjectChangeRubricCategoryService.execute(userParams.moduleName);
				};

				var wizardID = 'documentCentralQuerySidebarWizards';

				var wizards = {
					showImages: true,
					showTitles: true,
					showSelected: true,
					items: [

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
				if (!platformTranslateService.registerModule(moduleName)) {
					// if translation is already available, call loadTranslation directly
					loadTranslations();
				}

				return service;
			}]);
})(angular);
