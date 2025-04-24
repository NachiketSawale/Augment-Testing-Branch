/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	let moduleName = 'estimate.assemblies';
	let estimateAssembliesModule = angular.module(moduleName);

	estimateAssembliesModule.factory('estimateAssembliesService', ['$injector', 'estimateAssembliesServiceFactory','estimateAssembliesProcessor','estimateMainConflictType',
		function ($injector, estimateAssembliesServiceFactory,estimateAssembliesProcessor, estimateMainConflictType) {

			let option = {
				module: estimateAssembliesModule,
				structureServiceName: 'estimateAssembliesAssembliesStructureService',
				resourceContainerId: '20c0401F80e546e1bf12b97c69949f5b',
				assemblyFilterService: 'estimateAssembliesFilterService',
				serviceName: 'estimateAssembliesService',
				assemblyDynamicUserDefinedColumnService: 'estimateAssembliesDynamicUserDefinedColumnService',
				assemblyResourceDynamicUserDefinedColumnService: 'estimateAssembliesResourceDynamicUserDefinedColumnService',
				estimateAssembliesProcessor:estimateAssembliesProcessor
			};
			let service = estimateAssembliesServiceFactory.createNewEstAssemblyListService(option);

			service.getConcurrencyConfig = function(){
				return {
					mainService: service,
					mergeInClientSide: true,
					conflictConfigs : [{
						typeName: estimateMainConflictType.LineItem,
						title: 'estimate.assemblies.containers.assemblies',
						configurationService: 'estimateAssembliesConfigurationService',
						dataService: service
					}, {
						typeName: estimateMainConflictType.Resource,
						title: 'estimate.assemblies.containers.assemblyResources',
						configurationService: 'estimateAssembliesResourceConfigurationService',
						dataService: 'estimateAssembliesResourceService'
					}]
				};
			};

			service.registerListLoaded(setCharacteristicColumn);

			function setCharacteristicColumn() {
				$injector.get('estimateAssembliesDynamicColumnService').asyncLoadCharacteristicColumn(service);
			}

			return service;
		}]);
})();
