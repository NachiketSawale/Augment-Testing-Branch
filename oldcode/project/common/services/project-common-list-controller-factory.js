/**
 * Created by jack.wu on 10.04.20235.
 */

(function () {
	'use strict';
	let module = angular.module('project.common');

	/**
	 * @ngdoc service
	 * @name service  projectCommonListControllerFactory
	 * @function
	 *
	 * @description
	 */
	module.factory('projectCommonListControllerFactory',
		[ '_', '$translate', '$timeout', 'platformGridControllerService', 'projectMainProjectValidationService',
			'platformModuleNavigationService', 'platformModuleInfoService', 'projectMainDynamicConfigurationService',
			function ( _, $translate, $timeout, platformGridControllerService, projectMainProjectValidationService,
				naviService, platformModuleInfoService, projectMainDynamicConfigurationService) {
				let factory = {},
					projectModuleName = 'project.main';

				factory.initController = function initProjectListController($scope, gridConfig, dataService, option){

					let uiService = option && option.useCustomUiService ? option.customUiService : projectMainDynamicConfigurationService;
					platformGridControllerService.initListController($scope, uiService, dataService, projectMainProjectValidationService, gridConfig);

					// add navigators
					function navigateTo(navigator) {
						let selectedItem = dataService.getSelected();

						if (dataService.isSelection(selectedItem)) {
							naviService.navigate(navigator, selectedItem);
						}
					}

					let tools =  [];
					if(option && option.addNavigateToProject){
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
					}

					if(option && option.addNavigateToITwo5DControlling){
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
					}

					if(tools.length > 0){
						platformGridControllerService.addTools(tools);
					}

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
