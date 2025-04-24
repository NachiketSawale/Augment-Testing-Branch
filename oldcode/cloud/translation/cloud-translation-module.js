/**
 * Created by baf on 30.05.2016.
 */
(function (angular) {
	/* global globals */
	'use strict';

	var moduleName = 'cloud.translation';

	angular.module(moduleName, ['ui.router', 'platform']);
	globals.modules.push(moduleName);

	angular.module(moduleName)
		.config(['mainViewServiceProvider',
			function (mainViewServiceProvider) {

				var options = {
					'moduleName': moduleName,
					'resolve': {
						'loadDomains': ['platformSchemaService', function (platformSchemaService) {

							return platformSchemaService.getSchemas([
								{typeName: 'LanguageDto', moduleSubModule: 'Cloud.Translation'},
								{typeName: 'ResourceDto', moduleSubModule: 'Cloud.Translation'},
								{typeName: 'TranslationDto', moduleSubModule: 'Cloud.Translation'},
								{typeName: 'SourceDto', moduleSubModule: 'Cloud.Translation'},
								{typeName: 'TranslationsTodoVDto', moduleSubModule: 'Cloud.Translation'}
							]);
						}],
						'loadWizards': ['basicsConfigWizardSidebarService', 'platformPermissionService', 'permissions', function (basicsConfigWizardSidebarService) {
							var wizards = [];
							var wizardData = null;
							wizardData = new basicsConfigWizardSidebarService.WizardData('cloudTranslationWizardService', '0a50c634b7e74d5da40019496d259992', 'exportToExcel', true, false);
							wizards.push(wizardData);
							wizardData = new basicsConfigWizardSidebarService.WizardData('cloudTranslationWizardService', '6d6d39e3a4e04f0ba98531a669ae0a79', 'importFromExcel', true, false);
							wizards.push(wizardData);
							wizardData = new basicsConfigWizardSidebarService.WizardData('cloudTranslationWizardService', 'b57ecfe4bd884779b745ae0929f814a8', 'showExportModuleDialog', true, false);
							wizards.push(wizardData);
							basicsConfigWizardSidebarService.registerWizard(wizards);
						}],
						'loadResourceCategories': ['cloudTranslationImportExportService', function (cloudTranslationImportExportService){
							return cloudTranslationImportExportService.loadResourceCategories();
						}]
					}
				};

				mainViewServiceProvider.registerModule(options);
			}
		]).run(['$injector', 'platformModuleNavigationService', function ($injector, naviService) {
			naviService.registerNavigationEndpoint(
				{
					moduleName: moduleName + '-focus',
					navFunc: function (item/* , triggerField */) {
						var service = $injector.get('cloudTranslationResourceDataService');
						service.update().then(function () {
							service.getItemByIdAsync(item.ResourceId).then(function (resource) {
								service.setListWithoutModification([resource]);
								service.selectResource(resource);
								service.gridRefresh();
							});
						});
					}
				}
			);
		}]);
})(angular);
