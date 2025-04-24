(function (angular) {
	'use strict';

	/* jshint -W072 */

	angular.module('qto.formula').controller('qtoFormulaGridController',
		['_', '$scope', 'platformGridControllerService', 'qtoFormulaDataService',
			'qtoFormulaDataUIStandardService', 'qtoFormulaValidationService', 'platformContextService', 'platformGridAPI','qtoMainFormulaType','$injector',

			function (_, $scope, gridControllerService, dataService, gridColumns, validationService, platformContextService, platformGridAPI,qtoMainFormulaType,$injector) {

				let gridConfig = {
					columns: [],
					type: 'qto.formula',
					dragDropService : $injector.get('basicsCommonClipboardService'),
					cellChangeCallBack:function cellChangeCallBack(arg){
						let col = arg.grid.getColumns()[arg.cell].field;
						let curItem = arg.item;
						let modelScriptArray = ['Value1IsActive', 'Value2IsActive', 'Value3IsActive', 'Value4IsActive', 'Value5IsActive'];
						let OperatorColumns = ['Operator1', 'Operator2', 'Operator3', 'Operator4', 'Operator5',''];

						if(col === 'Value1IsActive' || col === 'Value2IsActive' || col === 'Value3IsActive' || col === 'Value4IsActive' || col === 'Value5IsActive') {
							if(curItem.QtoFormulaTypeFk === qtoMainFormulaType.Predefine || curItem.QtoFormulaTypeFk === qtoMainFormulaType.Script){
								curItem.Operator1 = curItem.Value1IsActive ? curItem.Operator1 : null;
								curItem.Operator2 = curItem.Value2IsActive ? curItem.Operator2 : null;
								curItem.Operator3 = curItem.Value3IsActive ? curItem.Operator3 : null;
								curItem.Operator4 = curItem.Value4IsActive ? curItem.Operator4 : null;
								curItem.Operator5 = curItem.Value5IsActive ? curItem.Operator5 : null;
							}
						}else if (col === 'QtoFormulaTypeFk'){
							if(curItem.QtoFormulaTypeFk === qtoMainFormulaType.FreeInput) {
								curItem.Operator1 = null;
								curItem.Operator2 = null;
								curItem.Operator3 = null;
								curItem.Operator4 = null;
								curItem.Operator5 = null;

								dataService.updateReadOnly(curItem, OperatorColumns, true);
							}

							dataService.onQtoFormulaTypeFkChangeEvent.fire();

							let _readOnly = curItem.QtoFormulaTypeFk === qtoMainFormulaType.FreeInput;
							dataService.updateReadOnly(curItem, modelScriptArray, _readOnly);
						}else if (col === 'IsMultiline'){
							if(!curItem.IsMultiline)
							{
								curItem.MaxLineNumber = null;
							}
							dataService.updateReadOnly(curItem, ['MaxLinenumber'], !curItem.IsMultiline);
						}
					}
				};

				gridControllerService.initListController($scope, gridColumns, dataService, validationService, gridConfig);

				let setCellEditable = function (e, arg) {
					let curColumn = arg.grid.getColumns()[arg.grid.getActiveCell().cell];
					let currentItem = arg.item;
					if(currentItem.QtoFormulaTypeFk === qtoMainFormulaType.FreeInput){
						if(curColumn.field.substr(0, 8) === 'Operator') {
							return false;
						}
					}
					else{
						if(curColumn.field.substr(0, 8) === 'Operator'){
							let index=curColumn.field.substr(8);
							return currentItem['Value'+index+'IsActive'];
						}
					}

				};


				function selectionChanged(){
					let selectedFormula = dataService.getSelected();
					let canUserBtn =  selectedFormula && selectedFormula.BasFormFk;

					angular.forEach($scope.tools.items, function (item) {
						if (item.id === 't100') {
							item.disabled = !canUserBtn;
						}
					});
					$scope.tools.update();
				}

				platformGridAPI.events.register($scope.gridId, 'onBeforeEditCell', setCellEditable);
				dataService.registerSelectionChanged(selectionChanged);

				function masterSelectionChanged(){
					$injector.get('qtoFormulaScriptDataService').load();
				}

				let toolbarItems = [
					{
						id: 't100',
						caption: 'Preview',
						type: 'item',
						cssClass: 'tlb-icons ico-preview-form',
						fn: function() {
							dataService.previewSelectedFormula();
						},
						disabled: function () {
							let selectedQtoDetailItem = dataService.getSelected();

							return _.isEmpty(selectedQtoDetailItem) || _.isEmpty(selectedQtoDetailItem.BasFormFk) || selectedQtoDetailItem.BasFormFk === null;
						}
					}
				];

				gridControllerService.addTools(toolbarItems);


				dataService.registerSelectionChanged(masterSelectionChanged);

				$scope.$on('$destroy', function () {
					platformGridAPI.events.unregister($scope.gridId, 'onBeforeEditCell', setCellEditable);
					dataService.unregisterSelectionChanged(masterSelectionChanged);
					dataService.unregisterSelectionChanged(selectionChanged);
				});
			}]);
})(angular);