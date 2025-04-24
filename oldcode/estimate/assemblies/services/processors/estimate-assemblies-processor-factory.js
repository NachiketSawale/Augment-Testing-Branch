/* global _ */

(function (angular) {
	'use strict';

	let moduleName = 'estimate.assemblies';
	angular.module(moduleName).factory('estimateAssembliesProcessorFactory', ['$injector','platformRuntimeDataService',
		function ($injector,platformRuntimeDataService) {

			var factoryService = {};

			factoryService.createReadOnlyProcessorService = function (assembliesServiceName,assemblyStructureServiceName) {
				let service = {};
				angular.extend(service, {
					processItem: processItem
				});

				return service;

				function processItem(entity) {
					if (entity) {
						let assemblyCategory = $injector.get(assembliesServiceName).getAssemblyCategory();
						if(!assemblyCategory || !assemblyCategory.Id){
							let categoriesList = $injector.get(assemblyStructureServiceName).getList();

							assemblyCategory = _.find(categoriesList, {Id: entity.EstAssemblyCatFk});
						}
						let estAssemblyTypeLogics = $injector.get('estimateMainCommonService').getEstAssemblyTypeLogics();
						if( (assemblyCategory && (assemblyCategory.EstAssemblyTypeLogicFk === estAssemblyTypeLogics.ProtectedAssembly)) || entity.EstAssemblyTypeLogicFk === estAssemblyTypeLogics.ProtectedAssembly){
							platformRuntimeDataService.readonly(entity, [{
								field: 'MdcCostCodeFk',  readonly: true},{
								field: 'MdcMaterialFk', readonly: true
							}]);
						}else{
							if (entity.MdcMaterialFk === null) {
								platformRuntimeDataService.readonly(entity, [{
									field: 'MdcMaterialFk', readonly: !_.isNull(entity.MdcCostCodeFk)},{
									field: 'MdcCostCodeFk', readonly: false
								}]);
							}
							else if (entity.MdcCostCodeFk === null) {
								platformRuntimeDataService.readonly(entity, [{
									field: 'MdcCostCodeFk', readonly: !_.isNull(entity.MdcMaterialFk) },{
									field: 'MdcMaterialFk', readonly: false
								}]);
							}
						}
					}
				}
			};

			return factoryService;
		}]);
})(angular);
