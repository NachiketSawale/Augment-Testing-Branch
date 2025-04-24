/**
 * Created by pel on 5/10/2019.
 */
/* global */
(function(angular){
	'use strict';

	var moduleName = 'defect.main';

	angular.module(moduleName).factory('defectClerkService', defectClerkDataService);

	defectClerkDataService.$inject = ['_', '$http','$q', 'globals', 'bascisCommonClerkDataServiceFactory',
		'ServiceDataProcessDatesExtension'];

	function defectClerkDataService(_, $http, $q, globals, bascisCommonClerkDataServiceFactory,
		ServiceDataProcessDatesExtension){

		var dataService = bascisCommonClerkDataServiceFactory.getService('defect.main.clerk', 'defectMainHeaderDataService');
		// dataService.copyClerksFromProject = copyClerksFromProject;
		var parentService = dataService.parentService();
		parentService.onStructureFkChanged.register(copyClerksFromPrcStructure);

		var dateProcessor = new ServiceDataProcessDatesExtension(['ValidFrom', 'ValidTo']);
		return dataService;

		function refreshClerk(param){
			// console.log(dataService);
			var oldList = dataService.getList();
			dataService.deleteEntities(oldList);
			var currentList =[];
			var deffer = $q.defer();
			$http.post(globals.webApiBaseUrl + 'procurement/package/clerk/copyclerktopackage', param).then(function (request) {
				if (!request.data) {
					return;
				}
				_.forEach(request.data, function(item) {
					dateProcessor.processItem(item);
					currentList.push(item);
				});
				dataService.setList(currentList);
				dataService.markEntitiesAsModified(currentList);
				dataService.setSelected(request.data[request.data.length - 1]);
				dataService.gridRefresh();
				deffer.resolve(null);
			});
			return  deffer.promise;
		}

		/** *****by structure****/
		function copyClerksFromPrcStructure() {
			var parentItem  = parentService.getSelected();
			var projectId=parentItem.ProjectFk;
			var data = {
				PackageId: parentItem ? parentItem.Id : 0,
				PrcStructureId: parentItem.StructureFk,
				ProjectId:projectId,
				ConfigurationId:parentItem.ConfigurationFk,
				Excludes: []
			};
			refreshClerk(data);
		}

		/** *****by project****/
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
