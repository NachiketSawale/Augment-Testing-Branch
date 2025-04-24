(function (angular) {
	'use strict';
	var moduleName = 'project.plantassembly';
	/**
	 * @ngdoc service
	 * @name projectPlantAssemblyDynamicUserDefinedColumnService
	 * @function
	 *
	 * @description
	 * projectPlantAssemblyDynamicUserDefinedColumnService is the config service for project assembly dynamic user defined column
	 */
	angular.module(moduleName).factory('projectPlantAssemblyDynamicUserDefinedColumnService', ['estimateAssembliesDynamicUserDefinedColumnServiceFactory', '$injector',
		function (estimateAssembliesDynamicUserDefinedColumnServiceFactory, $injector) {
			let isPrjAssembly = false,
				options = {
					moduleName : 'ProjectPlantAssembly',
					dataService : 'projectPlantAssemblyMainService',
					configurationExtendService: 'projectPlantAssemblyConfigurationExtendService',
					assemblyResourceDynamicUserDefinedColumnService: 'projectPlantAssemblyResourceDynamicUserDefinedColumnService',
					isPrjPlantAssembly: true
				};

			let service = estimateAssembliesDynamicUserDefinedColumnServiceFactory.initService(isPrjAssembly, options);

			let origanlHandleUpdateDone = service.handleUpdateDone;

			service.handleUpdateDone = function(prjAssemblyUpdatedUDPValue, prjAssemblyItemToSave){
				let userDefinedcolsOfLineItemModified = [];

				if(prjAssemblyItemToSave && prjAssemblyItemToSave.length > 0){
					if(!prjAssemblyUpdatedUDPValue){
						prjAssemblyUpdatedUDPValue = {
							UserDefinedColumnValueToUpdate : []
						};
					}else if(!prjAssemblyUpdatedUDPValue.UserDefinedColumnValueToUpdate) {
						prjAssemblyUpdatedUDPValue.UserDefinedColumnValueToUpdate = [];
					}

					_.forEach(prjAssemblyItemToSave,function(prjAssemblyToSave){
						if(!prjAssemblyToSave || !prjAssemblyToSave.PrjPlantAssemblyToSave || !prjAssemblyToSave.PrjPlantAssemblyToSave.UserDefinedPriceColVal) {return;}
						let existedUDPValue = _.find(prjAssemblyUpdatedUDPValue.UserDefinedColumnValueToUpdate, function(value){
							return value.TableId === prjAssemblyToSave.PrjPlantAssemblyToSave.UserDefinedPriceColVal.TableId && value.Pk1 === prjAssemblyToSave.PrjPlantAssemblyToSave.UserDefinedPriceColVal.Pk1 && value.Pk2 === prjAssemblyToSave.PrjPlantAssemblyToSave.UserDefinedPriceColVal.Pk2;
						});

						if(!existedUDPValue){
							let updatedUDPValue = angular.copy(prjAssemblyToSave.PrjPlantAssemblyToSave.UserDefinedPriceColVal);
							prjAssemblyUpdatedUDPValue.UserDefinedColumnValueToUpdate.push(updatedUDPValue);
							userDefinedcolsOfLineItemModified.push(updatedUDPValue);
						}
					});
				}

				let dataService = $injector.get('projectAssemblyMainService');
				let projectAssemblies = dataService.getList();

				if(angular.isArray(userDefinedcolsOfLineItemModified) && userDefinedcolsOfLineItemModified.length > 0){
					service.attachUpdatedValueToColumn(projectAssemblies, userDefinedcolsOfLineItemModified, true);
					dataService.gridRefresh();
				}

				origanlHandleUpdateDone(prjAssemblyUpdatedUDPValue);
			};

			return service;
		}
	]);
})(angular);