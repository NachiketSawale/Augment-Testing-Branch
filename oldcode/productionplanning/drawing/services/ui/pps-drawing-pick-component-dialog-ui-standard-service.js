(function (angular) {
	'use strict';
	/* globals angular, _, Slick */
	const moduleName = 'productionplanning.drawing';
	angular.module(moduleName).factory('ppsDrawingPickComponentsUIStandardService', PpsDrawingPickComponentsUIStandardService);
	PpsDrawingPickComponentsUIStandardService.$inject = [
		'$injector',
		'platformRuntimeDataService',
		'platformTranslateService'];

	function PpsDrawingPickComponentsUIStandardService(
		$injector,
		platformRuntimeDataService,
		platformTranslateService) {
		let gridConfig = angular.copy($injector.get('mdcDrawingComponentUIStandardService').getStandardConfigForListView());
		if (!gridConfig.isTranslated) {
			platformTranslateService.translateGridConfig(gridConfig.columns);
			gridConfig.isTranslated = true;
		}

		// set options for quantity fields, and set all grid columns readonly except quantity fields
		const editableFields = ['Quantity', 'Quantity2', 'Quantity3', 'BillingQuantity'];
		const editableQtyFields = ['Quantity', 'Quantity2', 'Quantity3'];
		_.each(gridConfig.columns, function (col) {
			if (editableFields.includes(col.field)) {
				if (editableQtyFields.includes(col.field)) {
					col.pinned = true;
					col.validator = (entity, value, field) => {
						entity.Checked = true; // auto select the checkbox when quantity/quantity2/quantity3 is changed
						if (field === 'Quantity') {
							if (entity.IsProportionalBill === true) {
								entity.BillingQuantity = value * (entity.BillQtyFactor ?? 1);
							}
						}
					};
				}
			}
			else if (col.editor) {
				col.editor = null;
				if (col.editorOptions) {
					col.editorOptions = null;
				}
			}
		});

		gridConfig.columns.unshift({
			id: 'Checked',
			field: 'Checked',
			model: 'Checked',
			formatter: 'boolean',
			editor: 'boolean',
			name$tr$: 'productionplanning.drawing.pickComponents.pick',
			headerChkbox: true,
			width: 50
		},
		{
			id: 'isProportionalBill',
			field: 'IsProportionalBill',
			editor: 'boolean',
			formatter: 'boolean',
			validator: (item, value, field) => {
				platformRuntimeDataService.readonly(item, [{ field: 'BillingQuantity', readonly: !!value }, { field: 'BasUomBillFk', readonly: !!value }]);
				if (value === true) {
					item.BillingQuantity = item.Quantity * (item.BillQtyFactor ?? 1);
				}
				return true;
			},
			name: '*Proportional Bill',
			name$tr$: 'productionplanning.drawing.quantityAssignment.quantitySelection.proportionalBill',
			headerChkbox: true,
			width: 50
		});
		gridConfig.id = 'f0705cd23c794ee1a8e268e46c975f86';
		gridConfig.state = 'f0705cd23c794ee1a8e268e46c975f86';
		//gridConfig.columns.current = gridConfig.columns;
		gridConfig.options = {
			indicator: true,
			enableConfigSave: true,
			enableModuleConfig: true,
			selectionModel: new Slick.RowSelectionModel()
		};

		return {
			getGridConfig: function () {
				return {
					columns: gridConfig.columns,
					id: gridConfig.id,
					options: gridConfig.options,
					state: gridConfig.state,
					isTranslated:true
				};
			}
		};
	}
})(angular);