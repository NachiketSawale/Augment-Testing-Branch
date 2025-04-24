/**
 * Created by lnt on 08/26/2021.
 */

(function () {

	'use strict';
	let moduleName = 'project.assembly';
	/**
	 * @ngdoc service
	 * @name projectAssemblyStructureClipboardService
	 * @description provides cut, copy and paste functionality for the assemblies Categories
	 */
	angular.module(moduleName).factory('projectAssemblyStructureClipboardService',
		['estimateAssembliesStructureRuleClipboardServiceFactory', 'projectAssemblyStructureService',
			function (estimateAssembliesStructureRuleClipboardServiceFactory, projectAssemblyStructureService) {

				let service = {};
				service = estimateAssembliesStructureRuleClipboardServiceFactory.createAssemblyStructureCilpboardService(projectAssemblyStructureService);

				return service;
			}
		]);

})();
