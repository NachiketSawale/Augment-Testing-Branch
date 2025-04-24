(function () {
	'use strict';

	angular.module('controlling.common').factory('controllingCommonProjectMainListControllerFactory',
		['_', '$translate', '$injector', 'platformGridControllerService', 'platformDetailControllerService', '$timeout',
			'platformModuleNavigationService', 'platformModuleInfoService', 'controllingCommonProjectMainUiConfigurationService', 'projectMainProjectValidationService',
			function (_, $translate, $injector, platformGridControllerService, platformDetailControllerService, $timeout, naviService,
				platformModuleInfoService, controllingCommonProjectMainUiConfigurationService, projectMainProjectValidationService) {

				let factory = {},
					projectModuleName = 'project.main';

				factory.initController = function initProjectListController($scope, dataService){
					let myGridConfig = {
						initCalled: false,
						columns: [],
						type : 'controlling.common.project',
						dragDropService : $injector.get('controllingCommonClipboardService')
					};

					platformGridControllerService.initListController($scope, controllingCommonProjectMainUiConfigurationService, dataService, projectMainProjectValidationService, myGridConfig);

					// add navigators
					function navigateTo(navigator) {
						let selectedItem = dataService.getSelected();

						if (dataService.isSelection(selectedItem)) {
							naviService.navigate(navigator, selectedItem);
						}
					}

					let tools =  [];
					tools.push({
						id: 't21',
						caption: $translate.instant('cloud.common.Navigator.goTo') + ' ' + platformModuleInfoService.getModuleDisplayNameById(projectModuleName),
						type: 'item',
						iconClass: 'tlb-icons ico-goto',
						fn: function openProject() {
							navigateTo({moduleName: projectModuleName, targetIdProperty: 'Id'});
						},
						disabled: function () {
							return _.isEmpty(dataService.getSelected());
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
							let projectEntity = dataService.getSelected();
							// show only 'iTWO 5D Project' (=4) project types, hide all others
							return _.isEmpty(projectEntity) || _.get(projectEntity, 'TypeFk') !== 4;
						}
					});

					platformGridControllerService.addTools(tools);

					// usability
					let selectProjectIfOnlyOne = function () {
						$timeout(function () {
							let projList = dataService.getList();
							let project = _.head(projList);
							if (project && _.size(projList) === 1) {
								dataService.setSelected(project);
							}
						});
					};

					// register for events
					dataService.registerListLoaded(selectProjectIfOnlyOne);

					// un-register on destroy
					$scope.$on('$destroy', function () {
						dataService.unregisterListLoaded(selectProjectIfOnlyOne);
					});
				};

				return factory;
			}]);
})();
