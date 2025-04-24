(function () {

	'use strict';
	/*global angular*/
	var moduleName = 'project.main';

	/**
	 * @ngdoc controller
	 * @name projectMainForCOStructureListController
	 * @function
	 *
	 * @description
	 * Controller for list view of projects in controlling structure module
	 **/

	angular.module(moduleName).controller('projectMainForCOStructureListController', ProjectMainForCOStructureListController);

	ProjectMainForCOStructureListController.$inject = ['$scope', '$translate', 'platformGridControllerService', 'platformContainerControllerService', 'projectMainForCOStructureService', '$timeout', 'platformModuleNavigationService', 'platformModuleInfoService'];
	function ProjectMainForCOStructureListController($scope, $translate, platformGridControllerService, platformContainerControllerService, projectMainForCOStructureService, $timeout, naviService, platformModuleInfoService) {

		platformContainerControllerService.initController($scope, moduleName, '021C5211C099469BB35DCF68E6AEBEC7');

		// add navigators
		function navigateTo(navigator) {
			var selectedItem = projectMainForCOStructureService.getSelected();

			if (projectMainForCOStructureService.isSelection(selectedItem)) {
				naviService.navigate(navigator, selectedItem);
			}
		}

		var tools =  [];
		tools.push({
			id: 't21',
			caption: $translate.instant('cloud.common.Navigator.goTo') + ' ' + platformModuleInfoService.getModuleDisplayNameById(moduleName),
			type: 'item',
			iconClass: 'tlb-icons ico-goto',
			fn: function openProject() {
				navigateTo({moduleName: 'project.main', targetIdProperty: 'Id'});
			},
			disabled: function () {
				return _.isEmpty(projectMainForCOStructureService.getSelected());
			}
		});
		tools.push({
			id: 't22',
			caption: $translate.instant('cloud.common.Navigator.goTo') + ' iTWO 5D Controlling',
			type: 'item',
			iconClass: 'tlb-icons ico-goto2',
			fn: function openEnterpriseControlling() {
				navigateTo({moduleName: 'iTWO 5D Controlling'});
			},
			disabled: function () {
				var projectEntity = projectMainForCOStructureService.getSelected();
				// show only 'iTWO 5D Project' (=4) project types, hide all others
				return _.isEmpty(projectEntity) || _.get(projectEntity, 'TypeFk') !== 4;
			}
		});

		platformGridControllerService.addTools(tools);

		// usability
		var selectProjectIfOnlyOne = function () {
			$timeout(function () {
				var projList = projectMainForCOStructureService.getList();
				var project = _.head(projList);
				if (project && _.size(projList) === 1) {
					projectMainForCOStructureService.setSelected(project);
				}
			});
		};

		// register for events
		projectMainForCOStructureService.registerListLoaded(selectProjectIfOnlyOne);

		// un-register on destroy
		$scope.$on('$destroy', function () {
			projectMainForCOStructureService.unregisterListLoaded(selectProjectIfOnlyOne);
		});
	}

})();