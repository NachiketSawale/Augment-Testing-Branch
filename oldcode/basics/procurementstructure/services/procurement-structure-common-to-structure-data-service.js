(function (angular) {

	'use strict';
	var moduleName = 'basics.procurementstructure';

	//documentsProjectDocumentController
	angular.module(moduleName).factory('procurementStructureDocumentDataService', ['basicsProcurementStructureService','documentsProjectDocumentDataService',
		function(parentService,dataServiceFactory){
			dataServiceFactory.register({
				moduleName: moduleName,
				parentService: parentService,
				columnConfig: [
					{documentField: 'PrcStructureFk', dataField: 'Id', readOnly: false},
					{documentField: 'PrjProjectFk', readOnly: false}
				]
			});
			return dataServiceFactory.getService({
				moduleName: moduleName
			});
		}]);

	//documentsProjectDocumentRevisionController
	angular.module(moduleName).factory('procurementStructureDocumentRevisionDataService', ['basicsProcurementStructureService','documentsProjectDocumentRevisionDataService','documentsProjectDocumentDataService',
		function(parentService,dataServiceFactory,documentsProjectDocumentDataService){
			var config = {
				moduleName: moduleName,
				parentService: parentService,
				columnConfig: [
					{documentField: 'PrcStructureFk', dataField: 'Id', readOnly: false},
					{documentField: 'PrjProjectFk', readOnly: false}
				],
				title: moduleName
			};

			var revisionConfig = angular.copy(config);

			revisionConfig.parentService = documentsProjectDocumentDataService.getService(config);

			return dataServiceFactory.getService(revisionConfig);
		}]);

})(angular);