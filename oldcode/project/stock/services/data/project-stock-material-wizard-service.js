/**
 * Created by Shankar
 * 13-03-2024
 */
// eslint-disable-next-line no-redeclare
/* global angular,globals,Set */

(function (angular) {
	'use strict';

	var moduleName = 'project.stock';
	angular.module(moduleName).factory('projectStockMaterialWizardService',
		['$http', '_', '$q', 'platformModalService', '$translate', 'platformContextService', 'basicsCommonChangeStatusService', 'projectMainService', 'projectStockMaterialDataService','projectStockDataService',
			function ($http, _, $q, platformModalService, $translate, platformContextService, basicsCommonChangeStatusService, projectMainService, projectStockMaterialDataService, projectStockDataService) {

				var service = {};
				// change status of project stock material (in project module)
				let changeProjectStockStatus = function changeProjectStockStatus() {

					return basicsCommonChangeStatusService.provideStatusChangeInstance(
						{
							statusName: 'stockmaterial',
							mainService: projectMainService,

							getDataService: function () {
								return {
									getSelected: function () {
										return projectStockMaterialDataService.getSelected();
									},
									getSelectedEntities: function () {
										return _.map(projectStockMaterialDataService.getSelectedEntities());
									},
									gridRefresh: function () {
										projectStockMaterialDataService.gridRefresh();
									}
								};
							},
							statusField: 'Stock2MaterialStatusFk',
							statusDisplayField: 'DescriptionInfo.Translated',
							title: 'project.main.changeStockStatus',
						}
					);
				};
				service.changeProjectStockStatus = changeProjectStockStatus().fn;
				return service;

			}
		]);
})(angular);