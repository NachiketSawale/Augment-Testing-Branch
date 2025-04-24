/**
 * Created by pel on 1/3/2020.
 */

(function (angular) {
	'use strict';
	/* global */
	var moduleName = 'documents.centralquery';

	angular.module(moduleName).factory('centralQueryClerkService', centralQueryClerkService);

	centralQueryClerkService.$inject = ['_', '$http', '$q', 'globals', 'bascisCommonClerkDataServiceFactory',
		'ServiceDataProcessDatesExtension'];

	function centralQueryClerkService(_, $http, $q, globals, bascisCommonClerkDataServiceFactory) {

		var dataService = bascisCommonClerkDataServiceFactory.getService('documents.project.clerk', 'documentCentralQueryDataService');

		return dataService;


		/*
		 function copyClerksFromProject(projectId) {
		 var deffer = $q.defer();
		 var parentItem  = parentService.getSelected();
		 if(!parentItem){
		 return deffer.promise;
		 }
		 var prcStructureId=parentItem.StructureFk;
		 var data = {
		 PackageId: parentItem ? parentItem.Id : 0,
		 PrcStructureId: prcStructureId,
		 ProjectId:projectId,
		 ConfigurationId:parentItem.ConfigurationFk,
		 Excludes: []
		 };
		 return refreshClerk(data);
		 }
		 */
	}
})(angular);

