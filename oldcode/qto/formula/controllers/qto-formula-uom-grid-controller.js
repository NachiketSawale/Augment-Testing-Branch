(function (angular) {
	'use strict';
	var moduleName = 'qto.formula';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('qtoFormulaUomGridController',
		['_', '$scope', '$translate', 'platformGridControllerService', 'qtoFormulaUomDataService', 'qtoFormulaUomValidationService', 'qtoFormulaUomUIStandardService','platformGridAPI','qtoFormulaDataService','qtoMainFormulaType',
			function (_, $scope, $translate, gridControllerService, dataService, validationService, qridColumns,platformGridAPI,qtoFormulaDataService,qtoMainFormulaType) {
				let gridConfig = {
					initCalled: false,
					columns: [],
					cellChangeCallBack:function cellChangeCallBack(arg){
						let col = arg.grid.getColumns()[arg.cell].field;
						let curItem = arg.item;
						let parentFormual = qtoFormulaDataService.getSelected();
						if(col === 'Value1IsActive' || col === 'Value2IsActive' || col === 'Value3IsActive' || col === 'Value4IsActive' || col === 'Value5IsActive') {
							if (parentFormual && parentFormual.QtoFormulaTypeFk === qtoMainFormulaType.Predefine) {
								curItem.Operator1 = curItem.Value1IsActive ? curItem.Operator1 : null;
								curItem.Operator2 = curItem.Value2IsActive ? curItem.Operator2 : null;
								curItem.Operator3 = curItem.Value3IsActive ? curItem.Operator3 : null;
								curItem.Operator4 = curItem.Value4IsActive ? curItem.Operator4 : null;
								curItem.Operator5 = curItem.Value5IsActive ? curItem.Operator5 : null;
							}
						}
					}
				};

				gridControllerService.initListController($scope, qridColumns, dataService, validationService, gridConfig);

				let setCellEditable = function (e, arg) {
					let curColumn = arg.grid.getColumns()[arg.grid.getActiveCell().cell];
					let currentItem = arg.item;
					if(curColumn.field.substr(0, 8) === 'Operator'){
						let index=curColumn.field.substr(8);
						return currentItem['Value'+index+'IsActive'];
					}

				};

				function onQtoFormulaTypeFkChangeEvent () {
					let parentFormual = qtoFormulaDataService.getSelected();
					let items = dataService.getList();
					let OperatorColumns = ['Operator1', 'Operator2', 'Operator3', 'Operator4', 'Operator5'];
					let modelScriptArray = ['Value1IsActive', 'Value2IsActive', 'Value3IsActive', 'Value4IsActive', 'Value5IsActive'];

					if(parentFormual && parentFormual.QtoFormulaTypeFk === qtoMainFormulaType.FreeInput){

						_.forEach(items, function (item) {
							dataService.updateReadOnly(item, OperatorColumns, true);
							item.Operator1 = null;
							item.Operator2 = null;
							item.Operator3 = null;
							item.Operator4 = null;
							item.Operator5 = null;
							dataService.markItemAsModified(item);

							let _readOnly = parentFormual.QtoFormulaTypeFk === qtoMainFormulaType.FreeInput;
							dataService.updateReadOnly(item, modelScriptArray, _readOnly);
						});

					}else{
						_.forEach(items, function (item) {
							dataService.updateReadOnly(item, OperatorColumns, false);
							dataService.updateReadOnly(item, modelScriptArray, false);
						});
					}
					dataService.gridRefresh();
				}


				platformGridAPI.events.register($scope.gridId, 'onBeforeEditCell', setCellEditable);
				qtoFormulaDataService.onQtoFormulaTypeFkChangeEvent.register(onQtoFormulaTypeFkChangeEvent);

				$scope.$on('$destroy', function () {
					platformGridAPI.events.unregister($scope.gridId, 'onBeforeEditCell', setCellEditable);
					qtoFormulaDataService.onQtoFormulaTypeFkChangeEvent.unregister(onQtoFormulaTypeFkChangeEvent);
				});
			}]);
})(angular);