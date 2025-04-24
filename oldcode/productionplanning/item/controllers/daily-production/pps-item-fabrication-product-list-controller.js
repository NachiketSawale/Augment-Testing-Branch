/**
 * Created by anl on 07/04/2022.
 */

(function (angular) {
	'use strict';

	let moduleName = 'productionplanning.item';

	angular.module(moduleName).controller('productionplanningItemFabricationProductListController', UpdateProductionSubsetController);
	UpdateProductionSubsetController.$inject = [
		'$http', '$scope', '$options', '$translate',
		'platformGridAPI',
		'basicsLookupdataConfigGenerator'];

	function UpdateProductionSubsetController(
		$http, $scope, $options, $translate,
		platformGridAPI,
		basicsLookupdataConfigGenerator) {

		let columns = [
			{
				id: 'productCode',
				field: 'Code',
				name: '*ProductCode',
				formatter: 'code',
				width: 100,
				name$tr$: 'cloud.common.entityCode'
			},
			{
				id: 'productStatus',
				field: 'StatusFk',
				name: '*Status',
				name$tr$: 'cloud.common.entityStatus',
				readonly: true,
				formatter: 'lookup',
				formatterOptions: basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.ppsproductstatus', null, {
					showIcon: true,
					imageSelectorService: 'platformStatusSvgIconService',
					svgBackgroundColor: 'ProductStatusBackgroundColor',
					backgroundColorType: 'dec',
					backgroundColorLayer: [1, 2, 3, 4, 5, 6]
				}).grid.formatterOptions
			},
			{
				id: 'drawingCode',
				field: 'DrawingId',
				name: '*DrawingCode',
				name$tr$: 'productionplanning.item.drawingcode',
				formatter: 'lookup',
				formatterOptions: {
					lookupType: 'EngDrawing',
					displayMember: 'Code',
					valueMember: 'Id',
					version: 3
				},
			},
			{
				id: 'projectName',
				field: 'ProjectId',
				name: '*ProjectName',
				width: 100,
				name$tr$: 'cloud.common.entityProjectName2',
				formatter: 'lookup',
				formatterOptions: {
					displayMember: 'ProjectName2',
					lookupType: 'project',
					version: 3
				}
			},
			{
				id: 'deliveryDate',
				field: 'DeliveryDate',
				name: '*Delivery Date',
				formatter: 'datetimeutc',
				width: 100,
				name$tr$: 'transportplanning.transport.entityPlannedDeliveryDate'
			},
			{
				id: 'planQuantity',
				field: 'PlanQuantity',
				name: '*PlanQuantity',
				name$tr$: 'productionplanning.common.product.planQuantity',
				formatter: 'decimal',
				width: 100
			},
			{
				id: 'planUom',
				field: 'PlanUomFk',
				name: '*Plan Uom',
				width: 100,
				name$tr$: 'productionplanning.common.product.planUoM',
				formatter: 'lookup',
				formatterOptions: {
					lookupType: 'uom',
					displayMember: 'Unit'
				}
			},{
				id: 'productArea',
				field: 'Area',
				name: '*Product Area',
				name$tr$: 'productionplanning.common.product.area',
				formatter: 'decimal',
				width: 100
			},{
				id: 'areaUom',
				field: 'AreaUomFk',
				name: '*Area Uom',
				name$tr$: 'productionplanning.common.product.areaUoM',
				width: 100,
				formatter: 'lookup',
				formatterOptions: {
					lookupType: 'uom',
					displayMember: 'Unit'
				}
			},{
				id: 'productVolumn',
				field: 'Volume',
				name: '*Product Volume',
				name$tr$: 'productionplanning.common.product.volume',
				formatter: 'decimal',
				width: 100
			},{
				id: 'volumnUom',
				field: 'VolumeUomFk',
				name: '*Volume Uom',
				name$tr$: 'productionplanning.common.product.volumeUoM',
				width: 100,
				formatter: 'lookup',
				formatterOptions: {
					lookupType: 'uom',
					displayMember: 'Unit'
				}
			}
		];
		let headerText = $translate.instant('productionplanning.item.dailyProduction.allProducts');

		$scope.handleOK = () => {
			$scope.$close(false);
		};

		const initGrid = (data) => {

			if(data){
				_.forEach(data, (product) => {
					if (typeof (product.DeliveryDate) === 'string') {
						product.DeliveryDate  = moment(product.DeliveryDate).utc();
					}
				});
			}

			return {
				id: '148a0e9c5bf14345929d9a9ee2cc62bd',
				columns: columns,
				data: data,
				lazyInit: true,
				options: {
					indicator: true,
					editable: true,
					idProperty: 'Id',
					skipPermissionCheck: true,
					selectionModel: new Slick.RowSelectionModel()
				},
				state: '148a0e9c5bf14345929d9a9ee2cc62bd',
				toolbarItemsDisabled: false
			};
		};

		let grid = initGrid($options.Products || []);
		platformGridAPI.grids.config(grid);
		$scope.gridOptions = grid;

		$scope.modalOptions = {
			headerText: headerText,
			cancel: () => {
				return $scope.$close(false);
			}
		};

		$scope.$on('$destroy', () => {
		});
	}
})(angular);