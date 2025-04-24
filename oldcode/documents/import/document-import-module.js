
(function () {
	'use strict';
	/* global globals */
	var moduleName = 'documents.import';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	angular.module(moduleName).
		config(['mainViewServiceProvider',
			function (mainViewServiceProvider) {
				mainViewServiceProvider.registerModule({
					'moduleName': moduleName,
					'controller': 'documentsImportController',
					'resolve': {
						'loadDomains': ['platformSchemaService', function (platformSchemaService) {
							return platformSchemaService.getSchemas([
								{ typeName: 'DocumentorphanDto', moduleSubModule: 'Documents.Import' }
							]);
						}]
					}
				});
			}
		]);/* .run(['genericWizardContainerLayoutService', 'basicsConfigWizardSidebarService',
        function(layoutService, wizardService){
           var wizardData = [{
                serviceName: 'documentsImportWizardService',
                wizardGuid: '9B7489F3B16C4F7A9B77CDEB43BCBBC7',
                methodName: 'importDouments',
                canActivate: true
            }, {
                serviceName: 'documentsImportWizardService',
                wizardGuid: '8892884572AC41C4BB974EE2B12B7DD6',
                methodName: 'assignmentAgain',
                canActivate: true
            }];
            wizardService.registerWizard(wizardData);
    }]); */
})();