(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.transport';
	angular.module(moduleName).factory('transportplanningTransportPackageUIService', ['transportplanningPackageUIStandardService',
		'basicsLookupdataLookupDescriptorService', 'transportplanningTransportPackageDataService',
		function (uiStandardService, lookupService, dataServ) {
			//set row good additionalFilters option
			var listView = _.cloneDeep(uiStandardService.getStandardConfigForListView());
			var detailView = _.cloneDeep(uiStandardService.getStandardConfigForDetailView());
			listView.columns.push(
				{id: 'ProductTemplateCode',
					field: 'ProductTemplateCode',
					name: '*ProductTemplateCode',
					name$tr$: 'productionplanning.common.product.productDescriptionFk',
					sortable: true,
					readonly: true
				});
			detailView.rows.push({
				gid: 'baseGroup',
				rid: 'ProductTemplateCode',
				label: '*ProductTemplateCode',
				label$tr$: 'productionplanning.common.product.productDescriptionFk',
				type: 'code',
				model: 'ProductTemplateCode',
				readonly: true
			});

			_.each(detailView.rows, function (row) {
				if (row.rid === 'good') {
					row.options.additionalFilters = [{
						ProjectId: 'ProjectId', // remark: ProjectId uses for product lookup
						getAdditionalEntity: function () {
							var item = dataServ.getSelected();
							var job = lookupService.getLookupItem('logisticJobEx', item.LgmJobDstFk);
							var projectId = job ? job.ProjectFk : null;
							return {
								ProjectId: projectId
							};
						},
						ProjectIdReadOnly: function (entity) {
							return !!entity.ProjectId;
						}
					}, {
						projectId: 'projectId', // remark: projectId uses for bundle lookup
						getAdditionalEntity: function () {
							var item = dataServ.getSelected();
							var job = lookupService.getLookupItem('logisticJobEx', item.LgmJobDstFk);
							var projectId = job ? job.ProjectFk : null;
							return {
								projectId: projectId
							};
						},
						projectIdReadOnly: function (entity) {
							return !!entity.projectId;
						}
					}, {
						siteId: 'siteId', // remark: siteId uses for bundle lookup
						getAdditionalEntity: function () {
							var item = dataServ.getSelected();
							var route = lookupService.getLookupItem('TrsRoute', item.TrsRouteFk);
							var siteId = _.get(route, 'SiteFk');
							return {
								siteId: siteId
							};
						}
					}, {
						siteFk: 'siteId', // remark: siteFk uses for resource lookup
						getAdditionalEntity: function () {
							var item = dataServ.getSelected();
							var route = lookupService.getLookupItem('TrsRoute', item.TrsRouteFk);
							var siteId = _.get(route, 'SiteFk');
							return {
								siteId: siteId
							};
						}
					}];
				}
			});
			var uiStandardServ = {
				getStandardConfigForListView: function () {
					return listView;
				},
				getStandardConfigForDetailView: function () {
					return detailView;
				}
			};

			return uiStandardServ;
		}]);
})(angular);