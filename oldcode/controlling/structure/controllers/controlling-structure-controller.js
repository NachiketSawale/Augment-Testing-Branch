/**
 * Created by janas on 12.11.2014.
 */


(function () {
	'use strict';
	let moduleName = 'controlling.structure';

	/**
	 * @ngdoc controller
	 * @name controllingStructureController
	 * @function
	 *
	 * @description
	 * Main controller for the controlling.structure module
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('controllingStructureController',
		['globals', '$scope', '$translate', 'platformMainControllerService', 'projectMainForCOStructureService', 'controllingStructureTranslationService', 'cloudDesktopSidebarService', 'cloudDesktopInfoService', 'controllingStructureContextService', 'controllingStructureLookupService', 'basicsWorkflowSidebarRegisterService', 'controllingStructureMainService','_',
			function (globals, $scope, $translate, platformMainControllerService, projectMainForCOStructureService, controllingStructureTranslationService, cloudDesktopSidebarService, cloudDesktopInfoService, controllingStructureContextService, controllingStructureLookupService, basicsWorkflowSidebarRegisterService, controllingStructureMainService, _) {

				// Header info
				cloudDesktopInfoService.updateModuleInfo($translate.instant('cloud.desktop.moduleDisplayNameControllingUnits'));

				let options = {search: true, auditTrail: '6963851eef6443709e59a5f74a39f391'};
				let configObject = {};
				let sidebarReports = platformMainControllerService.registerCompletely($scope, projectMainForCOStructureService, configObject, controllingStructureTranslationService, moduleName, options);

				// reload lookup data when user enters the module
				controllingStructureLookupService.reload();

				// sidebar
				let info = {
					name: cloudDesktopSidebarService.getSidebarIds().info,
					title: 'Info',
					type: 'template',
					templateUrl: globals.appBaseUrl + 'controlling.structure/templates/sidebar-info.html'
				};
				cloudDesktopSidebarService.registerSidebarContainer(info, true);

				// To Register Required EntityFacade For Project Module
				basicsWorkflowSidebarRegisterService.registerEntityForModule('f449df6514a54263b720454f9ddd694c', 'controlling.structure', false,
					function getSelectedModelId() {
						let selModel = projectMainForCOStructureService.getSelected();
						if (selModel) {
							return selModel.Id;
						}
						return undefined;
					}, function getModelIdList() {
						let items = projectMainForCOStructureService.getList();
						return _.map(_.isArray(items) ? items : [], function (modelEntity) {
							return modelEntity.Id;
						});
					}, angular.noop, angular.noop, angular.noop, true);

				basicsWorkflowSidebarRegisterService.registerEntityForModule('B1C6FCF517F74AC1BE434740EC3E699B', 'controlling.structure', false,
					function getSelectedModelId() {
						let selModel = controllingStructureMainService.getSelected();
						if (selModel) {
							return selModel.Id;
						}
						return undefined;
					}, function getModelIdList() {
						let items = controllingStructureMainService.getList();
						return _.map(_.isArray(items) ? items : [], function (modelEntity) {
							return modelEntity.Id;
						});
					}, angular.noop, angular.noop, angular.noop, true);

				// un-register on destroy
				$scope.$on('$destroy', function () {
					platformMainControllerService.unregisterCompletely(projectMainForCOStructureService, sidebarReports, controllingStructureTranslationService, options);
					cloudDesktopSidebarService.unRegisterSidebarContainer(info.name, true);
				});
			}]);
})();
