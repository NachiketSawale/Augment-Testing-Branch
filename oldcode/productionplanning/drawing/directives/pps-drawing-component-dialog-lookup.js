/**
 * Created by zwz on 12/23/2020.
 */
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.drawing';

	/**
	 * @ngdoc service
	 * @name productionplanningDrawingComponentDialogLookupDataService
	 * @function
	 *
	 * @description
	 * productionplanningDrawingComponentDialogLookupDataService is the data service for drawing component look ups
	 */
	angular.module(moduleName).factory('productionplanningDrawingComponentDialogLookupDataService', Service);
	Service.$inject = ['lookupFilterDialogDataService'];
	function Service(lookupFilterDialogDataService) {
		var config = {};
		return lookupFilterDialogDataService.createInstance(config);
	}


	angular.module(moduleName).directive('productionplanningDrawingComponentDialogLookup', Lookup);
	Lookup.$inject = [
		'_',
		'basicsLookupdataConfigGenerator',
		'basicsLookupdataLookupFilterService',
		'LookupFilterDialogDefinition',
		'platformDataServiceProcessDatesBySchemeExtension',
		'productionplanningDrawingComponentDialogLookupDataService'];
	function Lookup(_,
		basicsLookupdataConfigGenerator,
		basicsLookupdataLookupFilterService,
		LookupFilterDialogDefinition,
		platformDataServiceProcessDatesBySchemeExtension,
		lookupDataService) {

		var gid = 'selectionFilter';

		var formSettings = {
			fid: 'productionplanning.drawing.component.selectionfilter',
			version: '1.0.0',
			showGrouping: false,
			groups: [
				{
					gid: gid,
					isOpen: true,
					visible: true,
					sortOrder: 1
				}
			],
			rows: [
				{
					gid: gid,
					rid: 'drawing',
					label: 'Drawing',
					label$tr$: 'productionplanning.common.product.drawing',
					type: 'directive',
					directive: 'productionplanning-drawing-dialog-lookup',
					options: {
						showClearButton: true
					},
					model: 'drawingId'
				},

				basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.engineeringdrawingcomponenttype', '',
					{
						gid: gid,
						rid: 'drwCompType',
						label: 'Component Type',
						label$tr$: 'productionplanning.drawing.drawingComponent.engDrwCompTypeFk',
						type: 'integer',
						model: 'drwCompTypeId'
					}, false, { required: false, showIcon: true }
				)

			]
		};

		var gridSettings = {
			columns: [
				{
					id: 'engDrwCompStatusFk',
					field: 'EngDrwCompStatusFk',
					name: 'Status',
					name$tr$: 'cloud.common.entityStatus',
					formatter: 'lookup',
					formatterOptions: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.engineeringdrawingcomponentstatus', null, {
						showIcon: true
					}).grid.formatterOptions

				},
				{
					id: 'description',
					field: 'Description',
					name: 'Description',
					name$tr$: 'cloud.common.entityDescription',
					formatter: 'description'
				},
				{
					id: 'engDrwCompTypeFk',
					field: 'EngDrwCompTypeFk',
					name: 'Component Type',
					name$tr$: 'productionplanning.drawing.drawingComponent.engDrwCompTypeFk',
					formatter: 'lookup',
					formatterOptions: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.engineeringdrawingcomponenttype', null, {
						showIcon: true
					}).grid.formatterOptions

				},
				{
					id: 'engDrawingFk',
					field: 'EngDrawingFk',
					name: 'Drawing',
					name$tr$: 'productionplanning.common.product.drawing',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'EngDrawing',
						displayMember: 'Code'
					}
				},
				{
					id: 'remark',
					name: 'Remark',
					name$tr$: 'cloud.common.entityRemark',
					field: 'Remark',
					formatter: 'reamrk'
				},
				{
					id: 'insertedat',
					field: 'InsertedAt',
					name: 'Inserted At',
					name$tr$: 'cloud.common.entityInsertedAt',
					formatter: 'datetime'
				}
			],
			inputSearchMembers: ['Description']

		};

		var lookupOptions = {
			lookupType: 'EngDrawingComponent',
			valueMember: 'Id',
			displayMember: 'Description',
			title: 'productionplanning.drawing.drawingComponent.dialogTitle',
			filterOptions: {
				serverSide: true,
				serverKey: 'productionplanning-drawing-component-filter',
				fn: function (entity) {
					return lookupDataService.getFilterParams(entity);
				}
			},
			pageOptions: {
				enabled: true,
				size: 100
			},
			dataProcessors: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
				typeName: 'EngDrawingComponentDto',
				moduleSubModule: 'ProductionPlanning.Drawing'
			})
			],
			version: 3,
			uuid: '32fc137648804886b240ad40b0d0f9fa'
		};

		return new LookupFilterDialogDefinition(lookupOptions, 'productionplanningDrawingComponentDialogLookupDataService', formSettings, gridSettings);
	}
})(angular);
