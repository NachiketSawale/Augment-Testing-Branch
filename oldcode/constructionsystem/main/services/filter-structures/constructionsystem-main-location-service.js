/**
 * Created by xsi on 2016-04-06.
 */
(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.main';

	/* global globals */
	/**
	 * @ngdoc service
	 * @name constructionSystemMainLocationService
	 * @function
	 * @description
	 * #
	 * data service of constructionsystem main location controller.
	 */
	angular.module(moduleName).factory('constructionSystemMainLocationService', [
		'constructionsystemMainInitFilterService', 'projectLocationMainImageProcessor',
		function (constructionsystemMainInitFilterService, projectLocationMainImageProcessor) {
			var hasLoaded = false;
			var service = constructionsystemMainInitFilterService.initDataService(
				{
					serviceName: 'constructionSystemMainLocationService',
					itemName: 'EstPrjLocation',
					treePresOpt: {parentProp: 'LocationParentFk', childProp: 'Locations'},
					httpRead: {route: globals.webApiBaseUrl + 'project/location/', endRead: 'tree'},
					toolBar: {
						id: 'filterLocation',
						costgroupName: 'PrjLocationFk',
						iconClass: 'tlb-icons ico-filter-location'
					}
				},
				function updateServiceOption(option) {
					if (option.hierarchicalRootItem) {
						option.hierarchicalRootItem.dataProcessor = option.hierarchicalRootItem.dataProcessor || [];
						option.hierarchicalRootItem.dataProcessor.push(projectLocationMainImageProcessor);
					}
				}
			);
			service.uiConfig=['Code', 'DescriptionInfo', 'Quantity',  'Param'];

			service.setFilterByProjectId = function setFilterByProjectId(projectId) {
				if (projectId) {
					service.setFilter('projectId=' + projectId);
					service.load();
					hasLoaded = true;
				}
			};

			service.markAsHasntLoaded = function markAsHasntLoaded(){
				hasLoaded = false;
			};

			service.loadDataOnlyOnce = function loadDataOnlyOnce(projectId){
				if(!hasLoaded){
					service.setFilterByProjectId(projectId);
				}
			};

			service.setFilterByProjectId();
			return service;
		}
	]);
})(angular);
