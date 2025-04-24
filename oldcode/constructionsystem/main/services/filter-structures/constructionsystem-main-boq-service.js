/**
 * Created by xsi on 2016-05-17.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	var moduleName = 'constructionsystem.main';

	/**
	 * @ngdoc service
	 * @name constructionSystemMainLocationService
	 * @function
	 * @description
	 * #
	 * data service of constructionsystem main location controller.
	 */
	angular.module(moduleName).factory('constructionSystemMainBoqService', [
		'constructionsystemMainInitFilterService', 'boqMainImageProcessor',
		function (constructionsystemMainInitFilterService, boqMainImageProcessor) {

			var service = constructionsystemMainInitFilterService.initDataService(
				{
					serviceName: 'constructionSystemMainBoqService',
					itemName: 'EstBoq',
					treePresOpt: {
						parentProp: 'BoqItemFk',
						childProp: 'BoqItems'
					},
					httpRead: { route: globals.webApiBaseUrl + 'boq/project/', endRead: 'getboqsearchlist'},
					toolBar: {
						id: 'filterBoq',
						costgroupName: 'BoqItemFk',
						iconClass: 'tlb-icons ico-filter-boq'
					}
				},
				function updateServiceOption(option) {
					if (option.hierarchicalRootItem) {
						option.hierarchicalRootItem.dataProcessor = option.hierarchicalRootItem.dataProcessor || [];
						option.hierarchicalRootItem.dataProcessor.push(boqMainImageProcessor);
					}
				}
			);
			service.uiConfig = ['Reference', 'BriefInfo', 'Quantity', 'BasUomFk', 'Param'];

			// filtered by project_fk and boqHeader_fk in container constructionSystem.main.boq
			service.setFilterByProjectId = function setFilterByProjectId(projectId, boqHeaderId) {
				if (projectId && boqHeaderId) {
					service.setFilter('projectId=' + projectId + '&filterValue='+'&boqHeaderId='+boqHeaderId);
					service.load();
				}
			};
			service.setFilterByProjectId();

			return service;
		}
	]);
})(angular);