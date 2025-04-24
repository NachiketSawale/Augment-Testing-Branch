/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global Slick */
	'use strict';

	let modulename = 'estimate.project';

	/**
     * @ngdoc estimateProjectTargetValuesUIConfigService
     * @name estimateProjectTargetValuesUIConfigService
     * @description
     * This is the configuration service for the Vintage Attributes wizard portion.
     */
	angular.module(modulename).factory('estimateProjectTargetValuesUIConfigService', [
		function () {
			let service = {};
			let gridConfig = {
				id: '72ccc9c3392846089f3f5552503ef6aa',
				lazyInit: true,
				state: '72ccc9c3392846089f3f5552503ef6aa',
				columns: [
					{
						id: 'Id',
						field: 'Id',
						name: 'Id',
						width: 10,
						sortable: true,
						formatter: 'integer'
					},
					{
						id: 'plantno',
						field: 'plantno',
						name: 'Plant No./FERC Account',
						width: 130,
						// editor: 'lookup',
						directive: 'basics-lookupdata-lookup-composite',
						editorOptions: {
							directive: 'basics-characteristic-data-discrete-value-combobox',
							lookupOptions: {
								filterKey: 'basics-characteristic-plantno-filterkey',
								showClearButton: false,
								displayMember: 'DescriptionInfo.Translated'
							},
							events: [
								{
									name: 'onSelectedItemChanged',
									handler: function (e, args) {
										args.entity.plantno = args.selectedItem.plantno;
									}
								},
							]
						},
						formatter: 'lookup',
						sortable: true,
						formatterOptions: {
							lookupType: 'CharacteristicValue',
							valueMember: 'Id',
							displayMember: 'DescriptionInfo.Translated',

						}
					},
					{
						id: 'generalruid',
						field: 'generalruid',
						name: 'General RUID',
						width: 110,
						sortable: true,
						// editor: 'lookup',
						formatter: 'lookup',
						directive: 'basics-lookupdata-lookup-composite',
						editorOptions: {
							lookupDirective: 'basics-characteristic-data-discrete-value-combobox',
							lookupOptions: {
								filterKey: 'basics-characteristic-generalruid-filterkey',
								showClearButton: false,
								displayMember: 'DescriptionInfo.Translated'
							},
							events: [
								{
									name: 'onSelectedItemChanged',
									handler: function (e, args) {
										args.entity.generalruid = args.selectedItem.generalruid;
									}
								},
							]
						},
						formatterOptions: {
							lookupType: 'CharacteristicValue',
							valueMember: 'Id',
							displayMember: 'DescriptionInfo.Translated'
						}
					},
					{
						id: 'specificruid',
						field: 'specificruid',
						name: 'Specific RUID',
						width: 110,
						// editor: 'lookup',
						sortable: true,
						directive: 'basics-lookupdata-lookup-composite',
						editorOptions: {
							lookupDirective: 'basics-characteristic-data-discrete-value-combobox',
							lookupOptions: {
								filterKey: 'basics-characteristic-specificruid-filterkey',
								showClearButton: false,
								displayMember: 'DescriptionInfo.Translated'
							},
							events: [
								{
									name: 'onSelectedItemChanged',
									handler: function (e, args) {
										args.entity.specificruid = args.selectedItem.specificruid;
									}
								},
							]
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'CharacteristicValue',
							valueMember: 'Id',
							displayMember: 'DescriptionInfo.Translated'
						}
					},
					{
						id: 'targetvalue',
						field: 'targetvalue',
						name: 'Total Amount',
						formatter: 'decimal',
						width: 75
					},

				],
				options: {
					tree: false,
					indicator: true,
					allowRowDrag: false,
					editable: true,
					asyncEditorLoading: true,
					autoEdit: true,
					enableCellNavigation: true,
					enableColumnReorder: false,
					selectionModel: new Slick.RowSelectionModel(),
					showItemCount: false,
					idProperty: 'Id',
					// autoHeight: true
				}
			};

			service.getTargetValuesGridConfig = function() {
				return angular.copy(gridConfig);
			};

			return service;
		}
	]);
})();
