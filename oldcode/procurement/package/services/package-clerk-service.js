/**
 * Created by chi on 2018/4/4.
 */
(function(angular){
	'use strict';

	var moduleName = 'procurement.package';

	angular.module(moduleName).factory('procurementPackageClerkService', procurementPackageClerkDataService);

	procurementPackageClerkDataService.$inject = ['_', '$http','$q', 'globals', 'bascisCommonClerkDataServiceFactory',
		'ServiceDataProcessDatesExtension'];

	function procurementPackageClerkDataService(_, $http, $q, globals, bascisCommonClerkDataServiceFactory,
		ServiceDataProcessDatesExtension){

		var dataService = bascisCommonClerkDataServiceFactory.getService('procurement.package.clerk', 'procurementPackageDataService',null,true);

		// dataService.copyClerksFromProject = copyClerksFromProject;
		var parentService = dataService.parentService();
		parentService.onStructureFkChanged.register(copyClerksFromPrcStructure);
		dataService.copyClerksFromConfiguration = copyClerksFromConfiguration;

		var dateProcessor = new ServiceDataProcessDatesExtension(['ValidFrom', 'ValidTo']);
		return dataService;

		function refreshClerk(param){
			/*
                var oldList = dataService.getList();
                dataService.deleteEntities(oldList);
                */
			var currentList =[];
			var deffer = $q.defer();
			$http.post(globals.webApiBaseUrl + 'procurement/package/clerk/copyclerktopackage', param).then(function (request) {
				if (!request.data) {
					return;
				}
				var oldList = dataService.getList();

				var oldStrClerks=request.data.OriginalClerks;
				angular.forEach(oldList, function (item) {
					var itemEntity=_.find(oldStrClerks,function(item1){ return item1.ClerkRoleFk===item.ClerkRoleFk&&item1.ClerkFk===item.ClerkFk;});
					if (itemEntity) {
						dataService.deleteItem(item);
					}
					else{
						currentList.push(item);
					}
				});

				var newClerks=request.data.Main;
				_.forEach(newClerks, function(item) {
					var itemEntity=_.find(currentList,function(item1){ return item1.ClerkRoleFk===item.ClerkRoleFk&&item1.ClerkFk===item.ClerkFk;});
					if(!itemEntity) {
						dateProcessor.processItem(item);
						currentList.push(item);
					}
				});
				dataService.setList(currentList);
				dataService.markEntitiesAsModified(currentList);
				dataService.gridRefresh();
				deffer.resolve(null);
			});
			return  deffer.promise;
		}

		/** *****by structure****/
		function copyClerksFromPrcStructure(flg,param) {
			var parentItem  = parentService.getSelected();
			// var currentList = dataService.getList();
			var data = {
				PackageId: parentItem ? parentItem.Id : 0,
				PrcStructureId: parentItem.StructureFk,
				ProjectId:parentItem.ProjectFk,
				ConfigurationId:parentItem.ConfigurationFk,
				OriginalPrcStructureId:param.OriginalPrcStructureId,
				Excludes: []
			};
			refreshClerk(data);
		}

		/** *****by configuration****/
		function copyClerksFromConfiguration(OriginalConfigurationId) {
			var parentItem  = parentService.getSelected();
			if(!_.isNil(parentItem)){
				var data = {
					PackageId: parentItem ? parentItem.Id : 0,
					PrcStructureId: parentItem.StructureFk,
					ProjectId:parentItem.ProjectFk,
					ConfigurationId:parentItem.ConfigurationFk,
					OriginalConfigurationId:OriginalConfigurationId,
					Excludes: []
				};
				refreshClerk(data);
			}

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