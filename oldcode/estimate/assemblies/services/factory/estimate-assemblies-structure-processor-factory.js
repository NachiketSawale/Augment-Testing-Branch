/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

/* global _ */

(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name estimateAssembliesStructureProcessorFactory
	 * @function
	 *
	 * @description
	 * The estimateAssembliesStructureProcessorFactory is the service set assembly categories readonly or editable.
	 */
	let moduleName = 'estimate.assemblies';

	angular.module(moduleName).factory('estimateAssembliesStructureProcessorFactory', ['$injector', 'platformRuntimeDataService',
		function ($injector, platformRuntimeDataService) {

			let factoryService = {};

			factoryService.createNewEstAssembliesStructureProcessorService = function createNewEstAssembliesStructureProcessorService(/* option */){
				let service = {};

				let setFromToCodeFields = function setFromToCodeFields(item, isDisabled) {
					let fields = [
						{field: 'MaxValue', readonly: isDisabled},
						{field: 'MinValue', readonly: isDisabled}
					];
					platformRuntimeDataService.readonly(item, fields);
					if (item && item.HasChildren && item.AssemblyCatChildren) {
						_.each(item.AssemblyCatChildren, function (item) {
							setFromToCodeFields(item, isDisabled);
						});
					}
				};

				service.processItem = function processItem(entity) {

					if (entity && !entity.EstAssemblyCatFk) {
						setFromToCodeFields(entity, !(entity && entity.EstAssemblyTypeLogicFk && entity.EstAssemblyTypeLogicFk === 2));
					}
				};

				service.setColumnReadOnly = function setColumnReadOnly(item, column, flag) {
					let fields = [
						{field: column, readonly: flag}
					];
					platformRuntimeDataService.readonly(item, fields);
				};

				return service;
			};

			return factoryService;
		}]);
})(angular);
