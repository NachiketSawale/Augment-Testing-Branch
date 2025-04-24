(function () {

	'use strict';
	var moduleName = 'basics.dependentdata';

	/**
     * @ngdoc controller
     * @name
     * @function
     *
     * @description
     * Controller to administrate the columns grid
     **/
	angular.module(moduleName).controller('basicsDependentDataChartListController',
		['$scope', '$translate','basicsDependentDataChartService', 'basicsDependentDataChartUIService', 'platformGridControllerService','platformModalService','platformModalFormConfigService','basicsDependentDataChartValidationService','platformGridAPI','basicsDependentDataColumnLookupService',
			function ($scope,$translate, basicsDependentDataChartService, basicsDependentDataChartUIService, platformGridControllerService,platformModalService,platformModalFormConfigService,basicsDependentDataChartValidationService,platformGridAPI,basicsDependentDataColumnLookupService) {
				var myGridConfig = { initCalled: false, columns: [] };
				platformGridControllerService.initListController($scope, basicsDependentDataChartUIService, basicsDependentDataChartService,  basicsDependentDataChartValidationService(basicsDependentDataChartService), myGridConfig);

				var toolbarItems = [
					{
						id: 't5',
						caption: $translate.instant('basics.dependentdata.chartConfig'),
						type: 'item',
						iconClass: 'tlb-icons ico-container-config',
						fn: function () {
							var entity = basicsDependentDataChartService.getSelected();
							var modalOptions = null;
							if (!entity) {
								modalOptions = {
									bodyText: $translate.instant('cloud.common.noCurrentSelection'),
									iconClass: 'ico-info'
								};
								platformModalService.showDialog(modalOptions);
								return false;
							}
							platformGridAPI.grids.commitEdit($scope.gridId);
							if (0 === entity.DependentdatacolumnXFk || 0 === entity.DependentdatacolumnYFk) {
								modalOptions = {
									bodyText: $translate.instant('basics.dependentdata.noXYColumn'),
									iconClass: 'ico-info'
								};
								platformModalService.showDialog(modalOptions);
								return false;
							}

							if (isNaN(entity.DependentdatacolumnYFk)) {
								modalOptions = {
									bodyText: $translate.instant('basics.dependentdata.noNumErrorMessage'),
									iconClass: 'ico-info'
								};
								platformModalService.showDialog(modalOptions);
								return false;
							}

							var defaultConfig = entity.Config ? JSON.parse(entity.Config) : {
								version: 1.0,
								title: {show: true, position: 'left', color: 3355443},
								legend: {show: true, position: 'left', color: 3355443},
								group: {enable: false},
								scale: {
									x: {
										type: 'linear',
										time: {dataFormat: 'MM/DD/YYY', unit: 'day'},
										customCategory: false,
										categorys: []
									}, y: {type: 'linear'}
								}
							};


							var scaleXOptions = {
								displayMember: 'Description',
								valueMember: 'Id',
								items: [{Id: 'linear', Description: 'Numeric Linear'}, {
									Id: 'time',
									Description: 'Time'
								}, {Id: 'category', Description: 'Category'}]
							};

							//by chart type
							if (1 === entity.ChartTypeFk || 2 === entity.ChartTypeFk || 7 === entity.ChartTypeFk) {
								scaleXOptions.items = [{Id: 'linear', Description: 'Numeric Linear'}, {
									Id: 'time',
									Description: 'Time'
								}, {Id: 'category', Description: 'Category'}];
								//defaultConfig.scale.x.type='linear';
							}
							else {
								scaleXOptions.items = [{Id: 'category', Description: 'Category'}];
								defaultConfig.scale.x.type = 'category';

								if (defaultConfig.scale.x.type === 'time' && defaultConfig.scale.x.time) {
									if (defaultConfig.scale.x.time.max) {
										defaultConfig.scale.x.time.max = moment.utc(defaultConfig.scale.x.time.max);
									}
									if (defaultConfig.scale.x.time.min) {
										defaultConfig.scale.x.time.min = moment.utc(defaultConfig.scale.x.time.min);
									}
								}
							}
							//by column type
							var xcolumnEntity = basicsDependentDataColumnLookupService.getItemById(entity.DependentdatacolumnXFk);
							var xDomainName = xcolumnEntity.DisplayDomainEntity.DomainName;
							if ('default' === xDomainName) {
								scaleXOptions.items = [{Id: 'category', Description: 'Category'}];
								defaultConfig.scale.x.type = 'category';
							}
							var modalOptions1 = {
								headerTextKey: 'basics.dependentdata.chartConfig',
								showCancelButton: true,
								showOkButton: true,
								width: '500px',
								height: '600px',
								dataItem: defaultConfig,
								scaleXOptions: scaleXOptions,
								windowClass: 'body-flex-column',
								bodyTemplateUrl: globals.appBaseUrl + 'basics.dependentdata/templates/scale-config-template.html'
							};
							platformModalService.showDialog(modalOptions1).then(function (result) {
								if (result.ok) {
									if (modalOptions1.dataItem.scale.x.type === 'category') {
										platformGridAPI.grids.commitEdit('1cf32e710ad84d299c55ca404083b721');
									}
									entity.Config = JSON.stringify(modalOptions1.dataItem);
									basicsDependentDataChartService.markItemAsModified(entity);
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
