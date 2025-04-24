/**
 * Created by alm on 5/29/2020.
 */
// eslint-disable-next-line no-redeclare
/* global angular,globals,_ */

(function (angular) {
	'use strict';

	/**
     * @ngdoc controller
     * @name procurementStockAlternativeDialogController
     * @requires $scope
     * @description
     * #
     * Controller for Alternative dialog
     */
	/* jshint -W072 */
	angular.module('basics.common').controller('procurementStockAlternativeDialogController', [
		'$scope', '$http','$translate','$injector','platformGridAPI','platformTranslateService','platformUIConfigInitService','platformUIStandardExtentService','platformSchemaService','basicsLookupdataLookupDescriptorService','procurementStockStockTotalLayout','procurementStockTranslationService',
		function ($scope,$http, $translate,$injector,platformGridAPI,platformTranslateService,platformUIConfigInitService,platformUIStandardExtentService,platformSchemaService,lookupDescriptorService,procurementStockStockTotalLayout,procurementStockTranslationService) {
			$scope.options = $scope.$parent.modalOptions;
			var gridId = '8A5BC558CAC9437CBFD876B064128AAD';
			$scope.gridData = {
				state: gridId
			};
			function getColumns(){
				var dtoScheme = platformSchemaService.getSchemaFromCache({typeName:'StockTotalVDto', moduleSubModule: 'Procurement.Stock'}).properties;
				dtoScheme.OrderProposalStatuses = {domain: 'action'};
				return platformUIConfigInitService.provideConfigForListView(procurementStockStockTotalLayout, dtoScheme, procurementStockTranslationService);
			}
			// ProjectStock
			function setupGrid(){
				if (!platformGridAPI.grids.exist(gridId)) {
					var layoutUIGridColumns=getColumns().columns;
					var extraColumns=[{
						id: 'ProjectCode',
						field: 'ProjectFk',
						name: 'Project Number',
						name$tr$: 'cloud.common.entityProjectNo',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Project',
							displayMember: 'ProjectNo'
						}
					},{
						id: 'ProjectDescription',
						field: 'ProjectFk',
						name: 'Project Name',
						name$tr$: 'cloud.common.entityProjectName',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Project',
							displayMember: 'ProjectName'
						}
					},{
						id: 'StockCode',
						field: 'PrjStockFk',
						name: 'Stock Code',
						name$tr$: 'procurement.stock.header.stockCode',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'ProjectStock',
							displayMember: 'Code'
						}
					},{
						id: 'StockDescription',
						field: 'PrjStockFk',
						name: 'Stock Description',
						name$tr$: 'procurement.stock.header.PrjStockDescription',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'ProjectStock',
							displayMember: 'Description'
						}
					}, {
						id: 'StockLocation',
						field: 'StockLocation',
						name: 'StockLocation',
						name$tr$: 'cloud.common.entityType',
						readonly: true,
						width: 50,
						formatter: function(row, cell, value) {
							var  imageClass = 'block-image';
							var txtKey='';
							if(1===value){
								imageClass = imageClass + ' control-icons  ico-case1-alt-mat-diff-stock';
								txtKey='procurement.stock.stocktotal.AlternativeDiffStock';
							}
							else if(2===value){
								imageClass = imageClass + ' control-icons ico-case2-alt-mat-same-stock';
								txtKey='procurement.stock.stocktotal.AlternativeSameStock';
							}
							else if(3===value){
								imageClass = imageClass + ' control-icons ico-case3-same-mat-diff-stock';
								txtKey='procurement.stock.stocktotal.materialDiffStock';
							}
							var txt=$translate.instant(txtKey);
							return '<i class="' + imageClass + '" title="'+txt+'"></i>';
						}
					}];
					_.forEach(extraColumns,function(item){
						item.grouping={
							title: item.name,
							getter: item.field,
							aggregators: [],
							aggregateCollapsed: true
						};
					});
					var gridColumns=_.concat(extraColumns,layoutUIGridColumns);
					_.forEach(gridColumns,function(item){
						if(item.navigator) {
							item.navigator = null;
						}
					});
					var gridConfig = {
						columns: angular.copy(gridColumns),
						data: [],
						id: gridId,
						lazyInit: true,
						options: {
							tree: false,
							indicator: true,
							idProperty: 'Id',
							iconClass: '',
							enableDraggableGroupBy: true,
							enableConfigSave: true
						},
						enableConfigSave: true
					};
					platformGridAPI.grids.config(gridConfig);

				}
			}


			function  setupGridData() {
				var url = globals.webApiBaseUrl +'procurement/stock/stocktotal/alternativelist';
				var materialId=$scope.options.requestId;
				var stockId=$scope.options.stockId;
				$http.get(url+'?materialId='+materialId+'&stockId='+stockId).then(function (res) {
					var gridData = res.data;
					if(gridData.Main) {
						var filterId=$scope.options.filterId;
						var readData=gridData.Main;
						if(!_.isNil(filterId)){
							readData=_.filter(gridData.Main,function(item){return item.Id !== filterId;});
						}
						platformGridAPI.items.data(gridId,readData);
					}
					lookupDescriptorService.attachData(gridData);
				});
			}
			setupGrid();
			setupGridData();

			function setTools(tools) {
				$scope.tools = tools || {};
				$scope.tools.update = function () {};
			}
			setTools(
				{
					showImages: true,
					showTitles: true,
					cssClass: 'tools',
					items: [
						{
							id: 't4',
							caption: 'cloud.common.toolbarSearch',
							type: 'check',
							value: platformGridAPI.filters.showSearch(gridId),
							iconClass: 'tlb-icons ico-search',
							fn: function () {
								platformGridAPI.filters.showSearch(gridId, this.value);
							}
						},
						{
							id: 't16',
							sort: 10,
							caption: 'cloud.common.taskBarGrouping',
							type: 'check',
							iconClass: 'tlb-icons ico-group-columns',
							fn: function () {
								platformGridAPI.grouping.toggleGroupPanel(gridId, this.value);
							},
							value: platformGridAPI.grouping.toggleGroupPanel(gridId),
							disabled: false
						},
						{
							id: 't111',
							sort: 111,
							caption: 'cloud.common.gridlayout',
							iconClass: 'tlb-icons ico-settings',
							type: 'item',
							fn: function () {
								platformGridAPI.configuration.openConfigDialog(gridId);
							}
						}
					]
				});




			$scope.modalOptions = {
				headerText: $translate.instant($scope.options.headerTextKey),
				closeButtonText: $translate.instant('basics.common.cancel'),
				code: $scope.options.code,
				description: $scope.options.description,
			};
			$scope.modalOptions.close = function onCancel() {
				$scope.$close({ok: false});
			};
			$scope.$on('$destroy', function () {
				if (platformGridAPI.grids.exist(gridId)){
					platformGridAPI.grids.unregister(gridId);
				}
			});

		}
	]);
})(angular);