(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name editor:platformTableCellPropertiesService
	 * @function
	 * @requires
	 * @description
	 */
	angular.module('platform').factory('platformTableCellPropertiesService', platformTableCellPropertiesService);

	platformTableCellPropertiesService.$inject = ['cloudDesktopTextEditorConsts'];


	function platformTableCellPropertiesService(cloudDesktopTextEditorConsts) {
		var service = {};
		service.tableDialogOptions = {
			formConfig: {
				configure: {
					fid: 'TableEditor',
					version: '0.1.1',
					showGrouping: true,
					skipPermissionCheck: true,
					groups: [
						{
							gid: 'dimension',
							header$tr$: 'platform.richTextEditor.tableProperties.dimensions',
							visible: true,
							isOpen: true,
							attributes: []
						}
						/*{
							gid: 'style',
							header$tr$: 'platform.richTextEditor.tableProperties.style',
							visible: true,
							isOpen: true,
							attributes: []
						}
						{
							gid: 'cellAlignment',
							header$tr$: 'platform.richTextEditor.tableProperties.cellAlignment',
							visible: true,
							isOpen: true,
							attributes: []
						}*/
					],

					rows: [
						{
							gid: 'dimension',
							rid: 'tableWidth',
							label$tr$: 'platform.richTextEditor.tableProperties.tableWidth',
							type: 'integer',
							model: 'tableWidth',
							regex:'^[0-9]{0,3}$'
						},
						/*{
							gid: 'dimension',
							rid: 'tableHeight',
							label$tr$: 'platform.richTextEditor.tableProperties.tableHeight',
							type: 'integer',
							model: 'tableHeight'
						},
						{
							gid: 'style',
							rid: 'borderStyle',
							label$tr$: 'platform.richTextEditor.tableProperties.borderStyle',
							type: 'select',
							visible: true,
							sortOrder: 2,
							model: 'borderStyle',
							options: {
								items: cloudDesktopTextEditorConsts.borderStyle,
								valueMember: 'description',
								displayMember: 'description',
								modelIsObject: false
							}
						},
						{
							gid: 'style',
							rid: 'borderWidth',
							label$tr$: 'platform.richTextEditor.tableProperties.borderWidth',
							type: 'integer',
							model: 'borderWidth',
							readonly: false
						},
						{
							gid: 'style',
							rid: 'borderColor',
							label$tr$: 'platform.richTextEditor.tableProperties.borderColor',
							type: 'color',
							visible: true,
							model: 'borderColor',
							options: { showHashCode: true, showClearButton: true, valueMember: 'borderColor' }
						},
						{
							gid: 'style',
							rid: 'backgroundColor',
							label$tr$: 'platform.richTextEditor.tableProperties.backgroundColor',
							type: 'color',
							visible: true,
							options: { showHashCode: true, showClearButton: true },
							model: 'backgroundColor'
						},
						{
							gid: 'cellAlignment',
							rid: 'horizontal',
							label$tr$: 'platform.richTextEditor.tableProperties.cellAlignmentHorizontal',
							type: 'select',
							visible: true,
							model: 'horizontal',
							options: {
								items: cloudDesktopTextEditorConsts.horizontalAlignment,
								valueMember: 'id',
								displayMember: 'description',
								modelIsObject: false,
							}
						}*/
					]
				}
			},
			headerText: 'Table properties',
			buttons: [
				{
					id: 'cancel',
				},
				{
					id: 'ok',
				}
			]
		};

		service.cellDialogOptions = {
			formConfig: {
				configure: {
					fid: 'CellEditor',
					version: '0.1.1',
					showGrouping: true,
					skipPermissionCheck: true,
					groups: [
						{
							gid: 'dimension',
							header$tr$: 'platform.richTextEditor.tableProperties.dimensions',
							visible: true,
							isOpen: true,
							attributes: []
						},
						{
							gid: 'style',
							header$tr$: 'platform.richTextEditor.tableProperties.style',
							visible: true,
							isOpen: true,
							attributes: []
						},
						{
							gid: 'cellAlignment',
							header$tr$: 'platform.richTextEditor.tableProperties.cellAlignment',
							visible: true,
							isOpen: true,
							attributes: []
						}
					],

					rows: [
						{
							gid: 'dimension',
							rid: 'cellWidth',
							label$tr$: 'platform.richTextEditor.tableProperties.cellWidth',
							type: 'decimal',
							model: 'cellWidth',
							options: {
								decimalPlaces: 0
							}
						},
						/*{
							gid: 'dimension',
							rid: 'cellHeight',
							label$tr$: 'platform.richTextEditor.tableProperties.cellHeight',
							type: 'integer',
							model: 'cellHeight',
							regex:'^[0-9]{0,3}$',
						},
						{
							gid: 'dimension',
							rid: 'verticalPadding',
							label$tr$: 'platform.richTextEditor.tableProperties.verticalPadding',
							type: 'integer',
							model: 'verticalPadding'
						},
						{
							gid: 'dimension',
							rid: 'horizontalPadding',
							label$tr$: 'platform.richTextEditor.tableProperties.horizontalPadding',
							type: 'integer',
							model: 'horizontalPadding'
						},
						{
							gid: 'style',
							rid: 'borderStyle',
							label$tr$: 'platform.richTextEditor.tableProperties.borderStyle',
							type: 'select',
							visible: true,
							sortOrder: 2,
							model: 'borderStyle',
							options: {
								items: cloudDesktopTextEditorConsts.borderStyle,
								valueMember: 'description',
								displayMember: 'description',
								modelIsObject: false,
							}
						},*/
						{
							gid: 'style',
							rid: 'borderWidth',
							label$tr$: 'platform.richTextEditor.tableProperties.borderWidth',
							type: 'integer',
							model: 'borderWidth',
							regex:'^[0-9]{0,2}$',
							readonly: false
						},
						{
							gid: 'style',
							rid: 'borderColor',
							label$tr$: 'platform.richTextEditor.tableProperties.borderColor',
							type: 'color',
							visible: true,
							options: { showHashCode: true, showClearButton: false },
							model: 'borderColor'
						},
						/*{
							gid: 'style',
							rid: 'backgroundColor',
							label$tr$: 'platform.richTextEditor.tableProperties.backgroundColor',
							type: 'color',
							visible: true,
							options: { showHashCode: true, showClearButton: true },
							model: 'backgroundColor'
						},*/
						{
							gid: 'cellAlignment',
							rid: 'horizontal',
							label$tr$: 'platform.richTextEditor.tableProperties.cellAlignmentHorizontal',
							type: 'select',
							visible: true,
							model: 'horizontal',
							options: {
								items: cloudDesktopTextEditorConsts.horizontalAlignment,
								valueMember: 'id',
								displayMember: 'description',
								modelIsObject: false,
							}
						}
						/*{
							gid: 'cellAlignment',
							rid: 'vertical',
							label$tr$: 'platform.richTextEditor.tableProperties.cellAlignmentVertical',
							type: 'select',
							visible: true,
							model: 'vertical',
							options: {
								items: cloudDesktopTextEditorConsts.verticalAlignment,
								valueMember: 'id',
								displayMember: 'description',
								modelIsObject: false,
							}
						}*/
					]
				}
			},
			headerText: 'Cell properties',
			buttons: [
				{
					id: 'cancel',
				},
				{
					id: 'ok',
				}
			]
		};

		return service;
	}
})();
