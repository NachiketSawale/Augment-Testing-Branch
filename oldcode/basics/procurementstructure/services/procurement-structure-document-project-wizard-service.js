/**
 * Created by lcn on 1/4/2018.
 */
(function (angular) {
	'use strict';
	var moduleName = 'basics.procurementstructure';
	angular.module(moduleName).factory('procurementStructureDocumentProjectWizardService',
		['documentsProjectDocumentDataService', 'documentProjectDocumentsStatusChangeService',
			function (documentsProjectDocumentDataService, documentProjectDocumentsStatusChangeService) {
				var service = {};

				function changeStatusForProjectDocument() {
					return documentProjectDocumentsStatusChangeService.provideStatusChangeInstance(documentsProjectDocumentDataService, 'basics.procurementstructure');
				}

				service.changeStatusForProjectDocument = changeStatusForProjectDocument().fn;


				return service;
			}
		]);

})(angular);
