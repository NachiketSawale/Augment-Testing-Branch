/**
 * Created by alm on 2020-7-13.
 */
(function (angular) {
	'use strict';
	var moduleName = 'documents.project';
	angular.module(moduleName).controller('documentsProjectModelObjectDetailController', ['$scope', 'platformDetailControllerService', 'documentsProjectDocumentModuleContext', 'documentsProjectDocumentDataService', 'documentsProjectModelObjectUIService', 'documentsProjectModelObjectDataService', 'documentsProjectModelObjectValidationService', 'documentProjectDocumentTranslationService',
		function ($scope, platformDetailControllerService, documentsProjectDocumentModuleContext, documentsProjectDocumentDataService, formConfiguration, documentsProjectModelObjectDataService, documentsProjectModelObjectValidationService, documentProjectDocumentTranslationService) {

			var config = documentsProjectDocumentModuleContext.getConfig();
			var modelConfig = angular.copy(config);

			modelConfig.parentService = documentsProjectDocumentDataService.getService(config);
			var dataService = documentsProjectModelObjectDataService.getService(modelConfig);
			var validationService = documentsProjectModelObjectValidationService.getService(dataService);

			platformDetailControllerService.initDetailController($scope, dataService, validationService, formConfiguration, documentProjectDocumentTranslationService);

		}]);
})(angular);
