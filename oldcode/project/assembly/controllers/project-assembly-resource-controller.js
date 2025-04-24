/**
 * Created by lnt on 31.08.2021.
 */

/*global angular */

(function (angular) {

	'use strict';
	let moduleName = 'project.assembly';

	/**
	 * @ngdoc controller
	 * @name projectAssemblyResourceController
	 * @function
	 *
	 * @description
	 * Controller for the list view of Assembly Resources entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('projectAssemblyResourceController',
		['$scope', '$injector', 'estimateAssembliesResourcesTreeControllerFactory', 'projectAssemblyResourceService', 'projectAssemblyResourceDynamicConfigurationService',
		'platformGridAPI', 'platformPermissionService', 'permissions', 'estimateMainWizardContext',
			function ($scope, $injector, estimateAssembliesResourcesTreeControllerFactory, projectAssemblyResourceService, projectAssemblyResourceDynamicConfigurationService,
			platformGridAPI, platformPermissionService, permissions, estimateMainWizardContext) {
				let isPrjAssembly = true;

				estimateAssembliesResourcesTreeControllerFactory.initAssembliesResourceController($scope, moduleName, projectAssemblyResourceService, projectAssemblyResourceDynamicConfigurationService,'20c0401F80e546e1bf12b97c69949f5b', isPrjAssembly);

				function onPrjAssemblyChanged() {
					let selectedItem = $injector.get('projectAssemblyMainService').getSelected();
					if (selectedItem) {
						if (selectedItem.readOnlyByJob) {
							platformPermissionService.restrict('20c0401f80e546e1bf12b97c69949f5b', permissions.read);
						} else {
							platformPermissionService.restrict('20c0401f80e546e1bf12b97c69949f5b', false);
						}
					}
				}
				projectAssemblyResourceService.onPrjAssemlyChanged.register(onPrjAssemblyChanged);

				estimateMainWizardContext.setConfig('project.assemblies');

				$scope.$on('$destroy', function () {
					projectAssemblyResourceService.onPrjAssemlyChanged.unregister(onPrjAssemblyChanged);
				});
			}
		]);
})(angular);
