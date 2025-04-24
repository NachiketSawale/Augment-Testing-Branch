/**
 * Created by xsi on 2016-04-07.
 */
(function () {
	'use strict';
	/* global globals */

	var moduleName = 'constructionsystem.main';
	angular.module(moduleName).factory('constructionSystemMainControllingService',
		['constructionsystemMainInitFilterService',
			function (constructionsystemMainInitFilterService) {
				var hasLoaded = false;
				var service = constructionsystemMainInitFilterService.initDataService({
					serviceName: 'constructionSystemMainControllingService',
					itemName: 'EstCtu',
					treePresOpt: {parentProp: 'ControllingunitFk', childProp: 'ControllingUnits'},
					httpRead: {route: globals.webApiBaseUrl + 'controlling/structure/', endRead: 'tree'},
					toolBar: {
						id: 'filterControlling',
						costgroupName: 'MdcControllingUnitFk',
						iconClass: 'tlb-icons ico-filter-controlling'
					}
				});
				service.uiConfig = ['Code', 'DescriptionInfo', 'Param'];
				service.setFilterByProjectId = function setFilterByProjectId(projectId) {
					if (projectId) {
						service.setFilter('mainItemId=' + projectId);
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

			}]);
})();