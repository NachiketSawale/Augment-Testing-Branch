/**
 * Created by chk on 11/7/2016.
 */
(function (angular) {

	'use strict';
	var moduleName = 'model.main';

	//documentsProjectDocumentController
	angular.module(moduleName).factory('modelMainDocumentDataService', ['modelMainObjectDataService','documentsProjectDocumentDataService',
		function(parentService,dataServiceFactory){
			dataServiceFactory.register({
				moduleName: moduleName,
				parentService: parentService,
				columnConfig: [
					{documentField: 'ObjectFk', dataField: 'Id', readOnly: false},
					{documentField: 'ModelFk', dataField: 'ModelFk', readOnly: false}
				]
			});
			return dataServiceFactory.getService({
				moduleName: moduleName
			});
		}]);

	//documentsProjectDocumentRevisionController
	angular.module(moduleName).factory('modelMainDocumentRevisionDataService', ['modelMainObjectDataService','documentsProjectDocumentRevisionDataService','documentsProjectDocumentDataService',
		function(parentService,dataServiceFactory,documentsProjectDocumentDataService){
			var config = {
				moduleName: moduleName,
				parentService: parentService,
				columnConfig: [
					{documentField: 'ObjectFk', dataField: 'Id', readOnly: false},
					{documentField: 'ModelFk', dataField: 'ModelFk', readOnly: false}
				],
				title: moduleName
			};

			var revisionConfig = angular.copy(config);

			revisionConfig.parentService = documentsProjectDocumentDataService.getService(config);

			return dataServiceFactory.getService(revisionConfig);
		}]);

})(angular);