(function () {

	'use strict';
	var moduleName = 'basics.dependentdata';

	angular.module(moduleName).controller('basicsDependentDataChartSeriesListController',
		['$scope','$translate', 'basicsDependentDataChartSeriesService', 'basicsDependentDataChartSeriesUIService', 'platformGridControllerService','platformModalFormConfigService','platformModalService','basicsDependentDataChartSeriesConfigDetailLayout',
			function ($scope, $translate,basicsDependentDataChartSeriesService, basicsDependentDataChartSeriesUIService, platformGridControllerService,platformModalFormConfigService,platformModalService,basicsDependentDataChartSeriesConfigDetailLayout) {

				var myGridConfig = { initCalled: false, columns: [] };

				platformGridControllerService.initListController($scope, basicsDependentDataChartSeriesUIService, basicsDependentDataChartSeriesService, null, myGridConfig);
				var toolbarItems = [
					{
						id: 't5',
						caption: $translate.instant('basics.dependentdata.seriesConfig'),
						type: 'item',
						iconClass: 'tlb-icons ico-container-config',
						fn: function() {
							var entity=basicsDependentDataChartSeriesService.getSelected();
							if(!entity){
								var modalOptions = {
									bodyText: $translate.instant('cloud.common.noCurrentSelection'),
									iconClass: 'ico-info'
								};
								platformModalService.showDialog(modalOptions);
								return false;
							}
							basicsDependentDataChartSeriesConfigDetailLayout.setConfig(entity.Config,entity.ChartTypeFk);
							platformModalFormConfigService.showDialog(basicsDependentDataChartSeriesConfigDetailLayout.getLayout(entity.ChartTypeFk)).then(function (result) {
								if(result.ok) {
									var data = result.data;
									entity.Config = JSON.stringify(data);
									basicsDependentDataChartSeriesService.markItemAsModified(entity);
								}
							});
						}
					}
				];
				platformGridControllerService.addTools(toolbarItems);
				$scope.addTools([toolbarItems]);

			}
		]);
})();
