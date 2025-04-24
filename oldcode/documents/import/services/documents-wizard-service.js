(function (angular) {
	'use strict';

	/* jshint -W072 */
	angular.module('documents.import').factory('documentsImportWizardService',
		['platformTranslateService',
			'platformSidebarWizardConfigService',
			'documentsImportWizardImportService',
			'documentsWizardReimportResultService',
			function (platformTranslateService,
				platformSidebarWizardConfigService,
				documentsImportWizardImportService,
				documentsWizardReimportResultService) {

				var service = {};
				var wizardID = 'documentsImportSidebarWizards';

				service.importDouments = function updateCount() {
					documentsImportWizardImportService.execute();
				};

				service.assignmentAgain = function assignmentAgain() {
					documentsWizardReimportResultService.handleResult();
				};

				var wizards = {
					showImages: true,
					showTitles: true,
					showSelected: true,
					items: [
						{
							id: 1,
							text: 'Document Import',
							text$tr$: 'documents.import.wizard.documentsImport',
							groupIconClass: 'sidebar-icons ico-wiz-gaeb-ex',
							subitems: [
								{
									id: 11,
									text: 'Document Import',
									text$tr$: 'documents.import.wizard.documentsImport',
									type: 'item',
									showItem: true,
									fn: service.importDouments
								},
								{
									id: 12,
									text: 'Try assignment again',
									text$tr$: 'documents.import.wizard.assignmentAgain',
									type: 'item',
									showItem: true,
									fn: service.assignmentAgain
								}
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
				if (!platformTranslateService.registerModule('documents.import')) {
					// if translation is already available, call loadTranslation directly
					loadTranslations();
				}
				return service;
			}]);
})(angular);