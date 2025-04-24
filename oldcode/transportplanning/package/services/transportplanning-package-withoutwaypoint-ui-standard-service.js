/**
 * Created by zwz on 6/19/2019.
 */

(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.package';
	var packageModule = angular.module(moduleName);

	packageModule.factory('transportplanningPackageWithoutWaypointUIStandardService', PackageUIStandardService);
	PackageUIStandardService.$inject = ['_', 'transportplanningPackageUIStandardService', 'transportplanningPackageMainService', 'basicsLookupdataLookupDescriptorService'];

	function PackageUIStandardService(_, uiStandardService, dataService, lookupService) {

		function createUiService(uiStandardService) {
			var listView = _.cloneDeep(uiStandardService.getStandardConfigForListView());
			_.remove(listView.columns, {id: 'trswaypointsrcfk'});
			_.remove(listView.columns, {id: 'trswaypointdstfk'});
			_.remove(listView.columns, {id: 'productionorder'});
			_.remove(listView.columns, {id: 'reproduced'});
			var detailView = _.cloneDeep(uiStandardService.getStandardConfigForDetailView());
			_.remove(detailView.rows, {rid:'trswaypointsrcfk'});
			_.remove(detailView.rows, {rid:'trswaypointdstfk'});
			_.remove(detailView.rows, {rid:'productionorder'});
			_.remove(detailView.rows, {rid:'reproduced'});
			// set additionalFilters option of good. Here we inject the pkg data service for getting selected pkg
			_.each(detailView.rows, function (row) {
				if(row.rid === 'good') {
					//noinspection JSConstructorReturnsPrimitive,JSConstructorReturnsPrimitive
					row.options.additionalFilters = [{
						ProjectId: 'ProjectId', // remark: ProjectId uses for product lookup
						getAdditionalEntity: function () {
							var item = dataService.getSelected();
							var job = lookupService.getLookupItem('logisticJobEx',item.LgmJobDstFk);
							var projectId = job ? job.ProjectFk : null;
							return {
								ProjectId: projectId
							};
						},
						ProjectIdReadOnly: function (entity) {
							return !!entity.ProjectId;
						}
					}, {
						siteId: 'siteId', // remark: siteId uses for bundle lookup
						getAdditionalEntity: function () {
							var item = dataService.getSelected();
							var route = lookupService.getLookupItem('TrsRoute', item.TrsRouteFk);
							var siteId = _.get(route, 'SiteFk');
							return {
								siteId: siteId
							};
						}
					}, {
						projectId: 'projectId', // remark: projectId uses for bundle lookup
						getAdditionalEntity: function () {
							var item = dataService.getSelected();
							var job = lookupService.getLookupItem('logisticJobEx',item.LgmJobDstFk);
							var projectId = job ? job.ProjectFk : null;
							return {
								projectId: projectId
							};
						},
						projectIdReadOnly: function (entity) {
							return !!entity.projectId;
						}
					}, {
						siteFk: 'siteId', // remark: siteFk uses for resource lookup
						getAdditionalEntity: function () {
							var item = dataService.getSelected();
							var route = lookupService.getLookupItem('TrsRoute', item.TrsRouteFk);
							var siteId = _.get(route, 'SiteFk');
							return {
								siteId: siteId
							};
						}
					}];
				}
			});

			return {
				getStandardConfigForListView: function () {
					return listView;
				},
				getStandardConfigForDetailView: function () {
					return detailView;
				}
			};
		}
		return createUiService(uiStandardService);
	}
})(angular);