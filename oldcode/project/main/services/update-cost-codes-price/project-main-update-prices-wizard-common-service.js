/**
 * Created by bel on 9/10/2018.
 */
(function (angular) {
	'use strict';
	var moduleName = 'project.main';
	angular.module(moduleName).factory('projectMainUpdatePricesWizardCommonService',
		['$http', 'platformGridAPI', 'projectMainService', 'cloudDesktopPinningContextService',
			function ($http, platformGridAPI, projectMainService, cloudDesktopPinningContextService) {
				var service = {}, resultGridData = [];
				service.onResultGridDataSet = new Platform.Messenger();
				service.onMaterialPriceDataSet = new Platform.Messenger();
				service.isUsingInEstimateResourceSummary = function () {
					return platformGridAPI.grids.exist('3c17c15475964e4fae3d1e8915a56947');
				};

				service.setResultGridData = function (data) {
					resultGridData = data;
				};

				service.getResultGridData = function () {
					return resultGridData;
				};

				service.getProject = function () {
					var project = projectMainService.getSelected() ? projectMainService.getSelected() : (cloudDesktopPinningContextService.getPinningItem('project.main') ? cloudDesktopPinningContextService.getPinningItem('project.main') : null);
					if(project && project.id){
						project.Id = project.id;
					}
					return project;
				};

				service.clearGridData = function () {
					resultGridData = [];
				};
				return service;
			}
		]);
})(angular);