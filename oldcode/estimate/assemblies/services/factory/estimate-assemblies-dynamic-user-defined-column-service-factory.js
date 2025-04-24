/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	var moduleName = 'estimate.assemblies';
	/**
	 * @ngdoc service
	 * @name estimateAssembliesDynamicUserDefinedColumnServiceFactory
	 * @function
	 *
	 * @description
	 * estimateAssembliesDynamicUserDefinedColumnServiceFactory is the factory service for assembly dynamic user defined column
	 */
	angular.module(moduleName).factory('estimateAssembliesDynamicUserDefinedColumnServiceFactory', ['_', '$injector', 'userDefinedColumnTableIds', 'basicsCommonUserDefinedColumnServiceFactory', 'estimateAssembliesDynamicUserDefinedColumnCalculationService',
		function (_, $injector, userDefinedColumnTableIds, basicsCommonUserDefinedColumnServiceFactory, estimateAssembliesDynamicUserDefinedColumnCalculationService) {
			let factoryService = {};

			factoryService.initService = function(isPrjAssembly, options){
				let columnOptions = {
					columns : {
						idPreFix : 'EstimateAssembly',
						overloads : {
							readonly : true,
							editor : null
						}
					},
					addTotalColumn : true,
					totalColumns : {
						idPreFix : 'EstimateAssembly',
						overloads : {
							readonly : true,
							editor : null
						}
					},
				};

				let serviceOptions = {
						getRequestData : function(item){
							return {
								Pk1 : item.EstHeaderFk
							};
						},
						getFilterFn : function(tableId){
							return function(e, dto){
								return e.TableId === tableId && e.Pk1 === dto.EstHeaderFk && e.Pk2 === dto.Id;
							};
						},
						getModifiedItem : function(tableId, item){
							return {
								TableId : tableId,
								Pk1 : item.EstHeaderFk,
								Pk2 : item.Id,
								Pk3 : null
							};
						}
					},
					isPlantAssembly = options && options.isPlantAssembly,
					isPrjPlantAssembly = options && options.isPrjPlantAssembly,
					configurationExtendService = options ? options.configurationExtendService : null,
					assemblyDataService = options ? options.dataService : null,
					assemblyResourceDynamicUserDefinedColumnService = options ? options.assemblyResourceDynamicUserDefinedColumnService : null,
					moduleName = options && options.moduleName ? options.moduleName : null;

				let configService = $injector.get('estimateAssembliesConfigurationExtendService');
				if(isPrjAssembly){
					configService = $injector.get('projectAssembliesConfigurationExtendService');
				}
				if(isPrjPlantAssembly){
					configService = $injector.get('projectPlantAssemblyConfigurationExtendService');
				}
				if(isPlantAssembly && !_.isEmpty(configurationExtendService)){
					configService = $injector.get(configurationExtendService);
				}

				let dataService = isPrjAssembly ? 'projectAssemblyMainService' : isPlantAssembly && !_.isEmpty(assemblyDataService)  ? assemblyDataService : isPrjPlantAssembly ? 'projectPlantAssemblyMainService':'estimateAssembliesService';
				let service = basicsCommonUserDefinedColumnServiceFactory.getService(configService, userDefinedColumnTableIds.EstimateLineItem, dataService, columnOptions, serviceOptions, moduleName);

				service.calculate = function(lineitem, resourceList){
					let resFieldChange = isPrjAssembly ? $injector.get('projectAssemblyResourceDynamicUserDefinedColumnService').baseFieldChange : (isPlantAssembly || isPrjPlantAssembly) && !_.isEmpty(assemblyResourceDynamicUserDefinedColumnService) ? $injector.get(assemblyResourceDynamicUserDefinedColumnService).baseFieldChange : $injector.get('estimateAssembliesResourceDynamicUserDefinedColumnService').baseFieldChange;
					estimateAssembliesDynamicUserDefinedColumnCalculationService.setUserDefinedColumns(service.getUserDefinedColumnFields());
					estimateAssembliesDynamicUserDefinedColumnCalculationService.calculateLineItemAndResoruce(lineitem, resourceList, resFieldChange, service.fieldChange);
				};

				return service;
			};

			return factoryService;
		}
	]);
})(angular);
