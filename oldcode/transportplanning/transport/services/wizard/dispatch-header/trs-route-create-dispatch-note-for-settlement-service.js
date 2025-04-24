(function (angular) {
	'use strict';
	/* global globals, angular, _, Slick */

	let moduleName = 'transportplanning.transport';
	angular.module(moduleName).factory('trsRouteCreateDispatchNoteForSettlementService', CreateDispatchNoteForSettlementService);
	CreateDispatchNoteForSettlementService.$inject = [
		'$injector', '$q', 'moment',
		'$http',
		'$translate',
		'platformTranslateService',
		'platformGridAPI',
		'platformModalService',
		'ppsCommonGridToolbarBtnService',
		'logisticDispatchingRecordUIConfigurationService',
		'productionplanningProductEngProdComponentUIStandardService'];

	function CreateDispatchNoteForSettlementService(
		$injector, $q, moment,
		$http,
		$translate,
		platformTranslateService,
		platformGridAPI,
		platformModalService,
		gridToolbarBtnService,
		recordUIConfigurationService,
		productComponentUIStandardService) {

		let service = {};
		let data = {};
		let FromComponentQtyField = '';

		service.GetWizardQuantity = () =>{
			return FromComponentQtyField;
		};

		service.createDispatchingNoteForSettlement = function (wizParams, routes) {
			FromComponentQtyField = wizParams['Bill Quantity Column'];
			if (routes && (routes instanceof Array) && routes.length > 0) {
				let ids = routes.map(function (route) {
					return route.Id;
				});
				let param = {
					routeIds: ids,
					currentRouteId: ids[0],
					wizParams: wizParams,
					isDraft: true
				};
				return $http.post(globals.webApiBaseUrl + 'transportplanning/transport/route/createDispatchingNote', param).then((response) => {
					data = response.data;
					return service.showDialog(response.data).then(function (response) {
						if (response === true) {
							return {
								errorMsg: data.errorMsg,
								succeedRtes: data.succeedRtes,
								need2Refresh: data.need2Refresh
							};
						}
					});
				});
			}
		};

		service.showDialog = function (data) {
			if (data.dispatchRecords !== null) {
				let modalCreateConfig = {
					width: '900px',
					resizeable: true,
					templateUrl: globals.appBaseUrl + 'transportplanning.transport/templates/trs-route-pick-components-for-settlement-dialog.html',
					controller: 'trsRoutePickComponentsForSettlementController'
				};
				return platformModalService.showDialog(modalCreateConfig);
			}
		};

		service.initial = function ($scope) {
			_.forEach(data.ppsComponents, (component)=>{
				component.MdcMaterialCostCodeProductFk = component.MdcMaterialFk;
				const mappingMaterial = _.find(data.mdcMaterials, {Id: component.MdcMaterialFk});
				if(mappingMaterial){
					component.MdcMaterialCostCodeProductFkDescription = mappingMaterial.DescriptionInfo1.Translated;
				}
				component.Convertable = component.Sorting;
			});
			_.forEach(data.dispatchRecords, (record)=>{
				if(typeof(record.DateEffective) === 'string'){
					record.DateEffective = moment(record.DateEffective);
				}
				record.SettlementPrice = GetSettlementPrice(record);
				record.TotalPrice = GetTotalPrice(record);
			});

			$scope.records = data.dispatchRecords;
			$scope.ppsComponents = data.ppsComponents;
			$scope.mdcMaterials = data.mdcMaterials;
			$scope.dispatchingNoteResults = data.dispatchingNoteResults;

			initRecordGrid($scope);
			initComponentGrid($scope);
		};

		const GetSettlementPrice = (record) => {
			return record.RecordTypeFk === 3 ? record.Price : record.PricePortion01 / record.Quantity;
		};

		const GetTotalPrice = (record) => {
			return record.RecordTypeFk === 6 ? record.PricePortion01 : record.DeliveredQuantity * record.Price;
		};

		const initRecordGrid = ($scope) => {
			let recordGridConfig = recordUIConfigurationService.getStandardConfigForListView();
			let columns = angular.copy(recordGridConfig.columns);
			let uuid = '3822aae4dd4a471fa3c2916db72ae88b';
			let availableColumns = ['articlecode','description','recordtypefk','dispatchrecordstatusfk','recordno','uomfk','quantity',
				'prcstructurefk','dateeffective'];

			let gridConfig = getGridConfig(uuid, $scope.records, columns, availableColumns);
			gridConfig.columns = gridConfig.columns.concat([{
				id: 'settlementPrice',
				field: 'SettlementPrice',
				name: '*Settlement Price',
				name$tr$: 'productionplanning.common.product.settlementPrice',
				editor: 'decimal',
				formatter: 'decimal'
			},{
				id: 'totalPrice',
				field: 'TotalPrice',
				name: '*Settlement Total Price',
				name$tr$: 'productionplanning.common.product.settlementTotalPrice',
				readonly: true,
				formatter: 'decimal'
			}]);

			gridConfig.gridId = uuid;
			$scope.tempLookupControllerForLayoutBtns = gridToolbarBtnService.addToolsIncludesLayoutBtns(gridConfig);
			if (!platformGridAPI.grids.exist(uuid)) {
				platformGridAPI.grids.config(gridConfig);
			}
			$scope.recordGrid = gridConfig;
		};

		const initComponentGrid = ($scope) => {
			let componentGridConfig = productComponentUIStandardService.getStandardConfigForListView();
			let columns = angular.copy(componentGridConfig.columns);
			let uuid = 'ea7110a9ef2a45cfa704944bca586f31';
			let availableColumns = ['description','mdcmaterialfk','ppsproductfk', 'mdcmaterialcostcodeproductfk', 'mdcmaterialcostcodeproductfkdescription',
				'actualquantity','actualquantity2','actualquantity3','quantity','quantity2','quantity3','basuomfk'];

			let gridConfig = getGridConfig(uuid, [], columns, availableColumns);

			gridConfig.columns.unshift({
				id: 'Checked',
				field: 'Checked',
				formatter: 'boolean',
				editor: 'boolean',
				name:'$pick',
				name$tr$: 'productionplanning.drawing.pickComponents.pick',
				headerChkbox: false,
				width: 50
			});
			gridConfig.columns.unshift({
				id: 'Convertable',
				field: 'Convertable',
				name: '*Valid',
				name$tr$: 'transportplanning.transport.wizard.validComponent',
				readonly: true,
				formatter: 'image',
				formatterOptions: {
					imageSelector: 'trsRouteSettlementConvertableImageService',
					tooltip: true
				}
			});
			gridConfig.columns.unshift({
				id: 'billQuantity',
				field: 'BillQuantity',
				name: '*Bill Quantity',
				name$tr$: 'productionplanning.common.product.billQuantity',
				readonly: true,
				formatter: 'decimal'
			});
			gridConfig.columns.unshift({
				id: 'componentPrice',
				field: 'ComponentPrice',
				name: '*Component Price',
				name$tr$: 'productionplanning.common.product.componentPrice',
				editor: 'decimal',
				formatter: 'decimal'
			});
			gridConfig.columns.unshift({
				id: 'totalPrice',
				field: 'TotalPrice',
				name: '*Component Total Price',
				name$tr$: 'productionplanning.common.product.componentTotalPrice',
				readonly: true,
				formatter: 'decimal'
			});

			gridConfig.gridId = uuid;
			$scope.tempLookupControllerForLayoutBtns = gridToolbarBtnService.addToolsIncludesLayoutBtns(gridConfig);
			if (!platformGridAPI.grids.exist(uuid)) {
				platformGridAPI.grids.config(gridConfig);
			}
			$scope.componentGrid = gridConfig;
		};

		const getGridConfig = (uuid, data, columns, availableColumns) => {
			let filteredColumns = [];
			_.each(columns, function (col) {
				if (_.find(availableColumns, (name)=> name === col.field.toLowerCase())) {
					col.editor = null;
					col.editorOptions = null;
					filteredColumns.push(col);
				}
			});

			return {
				id: uuid,
				data: data,
				columns: filteredColumns,
				state: uuid,
				isTranslated: true,
				lazyInit: true,
				options: {
					indicator: true,
					selectionModel: new Slick.RowSelectionModel(),
					idProperty: 'Id',
					skipPermissionCheck: true,
					enableConfigSave: true,
					enableModuleConfig: true
				},
			};
		};

		return service;
	}
})(angular);