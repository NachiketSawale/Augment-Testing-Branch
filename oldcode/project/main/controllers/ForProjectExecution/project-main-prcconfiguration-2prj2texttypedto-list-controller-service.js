(function () {

	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc controller
	 * @name projectMainPrcConfiguration2Prj2TextTypeDtoListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of any kind of entity causing a change in a project
	 **/
	angular.module(moduleName).controller('projectMainPrcConfiguration2Prj2TextTypeDtoListController', ProjectMainForProjectExecutionListController);

	ProjectMainForProjectExecutionListController.$inject = ['$scope', 'platformContainerControllerService','projectMainContainerInformationService',
		'projectMainForProjectExecutionContainerService', 'platformObjectHelper'];

	function ProjectMainForProjectExecutionListController($scope, platformContainerControllerService, projectMainContainerInformationService,
	                                                      projectMainForProjectExecutionContainerService, platformObjectHelper) {
		var containerUid = $scope.getContentValue('uuid');

		//if(true || !projectMainContainerInformationService.hasDynamic(containerUid)) {
		var addition = {
			'grid': platformObjectHelper.extendGrouping([
				{
					'id': 'prcconfigheaderfk',
					'field': 'PrcConfigheaderFk',
					'name': 'Configuration Header',
					'name$tr$': 'project.main.entityConfigHeader',
					formatter: 'lookup',
					formatterOptions: {
						'lookupType': 'prcconfigheader',
						'displayMember': 'DescriptionInfo.Translated'
					}
				},
				{
					'id': 'prcconfigurationfk',
					'field': 'PrcConfigurationFk',
					'name': 'Configuration',
					'name$tr$': 'project.main.entityPrcConfiguration',
					formatter: 'lookup',
					formatterOptions: {
						'lookupType': 'prcconfiguration',
						'displayMember': 'DescriptionInfo.Translated'
					},
					width: 140
				}

			])
		};
		projectMainForProjectExecutionContainerService.prepareGridConfig(containerUid, $scope, projectMainContainerInformationService, addition);
		//}

		platformContainerControllerService.initController($scope, moduleName, containerUid);
	}
})();
