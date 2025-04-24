/**
 * Created by ysl on 5/27/2017.
 */
/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	let moduleName = 'estimate.assemblies';
	/**
     * @ngdoc service
     * @name estimateAssembliesCategoriesRuleClipboardService
     * @description provides cut, copy and paste functionality for the assemblies Categories
     */
	angular.module(moduleName).factory('estimateAssembliesCategoriesRuleClipboardService',
		['estimateAssembliesStructureRuleClipboardServiceFactory', 'estimateAssembliesAssembliesStructureService',
			function (estimateAssembliesStructureRuleClipboardServiceFactory, assemblyStructureService) {

				let service = {};
				service = estimateAssembliesStructureRuleClipboardServiceFactory.createAssemblyStructureCilpboardService(assemblyStructureService);

				return service;
			}
		]);

})();
