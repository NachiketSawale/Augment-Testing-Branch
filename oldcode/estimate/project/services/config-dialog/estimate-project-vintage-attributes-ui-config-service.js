/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global Slick */
	'use strict';

	let modulename = 'estimate.project';

	/**
	 * @ngdoc estimateProjectVintageAttributesUIConfigService
	 * @name estimateProjectVintageAttributesUIConfigService
	 * @description
	 * This is the configuration service for the Vintage Attributes wizard portion.
	 */
	angular.module(modulename).factory('estimateProjectVintageAttributesUIConfigService', [ 'basicsLookupdataConfigGenerator', 'basicsLookupdataLookupFilterService',
		function (basicsLookupdataConfigGenerator, basicsLookupdataLookupFilterService) {
			let service = {};
			let lookupFilter = [
				{
					key: 'basics-characteristic-plantno-filterkey',
					serverSide: false,
					fn: function (lookupitem, item) {
						if(item.plantnoFk !== null) {
							return item.plantnoFk === lookupitem.CharacteristicFk;
						}
						else {
							return false;
						}
					}
				},
				{
					key: 'basics-characteristic-generalruid-filterkey',
					serverSide: false,
					fn: function (lookupitem, item) {
						if(item.generalruidFk !== null) {
							return item.generalruidFk === lookupitem.CharacteristicFk;
						}
						else {
							return false;
						}
					}
				}
				/* {
					key: 'basics-characteristic-specificruid-filterkey',
					serverSide: false,
					fn: function (lookupitem, item) {
						if(item.specificruidFk !== null && item.specificruidFk !== -1) {
							return item.specificruidFk === lookupitem.CharacteristicFk;
						}
						else {
							return false;
						}
					}
				}, */
			];

			basicsLookupdataLookupFilterService.registerFilter(lookupFilter);
			let gridConfig = {
				id: '5bf72693bc3d4accae3bdd883fdcef2a',
				lazyInit: true,
				state: '5bf72693bc3d4accae3bdd883fdcef2a',
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
						editor: 'lookup',
						directive: 'basics-lookupdata-lookup-composite',
						editorOptions: {
							directive: 'basics-characteristic-data-discrete-value-combobox',
							lookupOptions: {
								filterKey: 'basics-characteristic-plantno-filterkey',
								showClearButton: false,
								displayMember: 'DescriptionInfo.Translated',
								events: [
									{
										name: 'onSelectedItemChanged',
										handler: function (e, args) {
											args.entity.plantno = args.selectedItem.plantno;
											args.entity.specificruid = -1;
											args.entity.specificruidFk = -1;
											args.selectedItem.specificruid = -1;
											args.selectedItem.specificruidFk = -1;
										}
									},
								]
							}
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
						editor: 'lookup',
						formatter: 'lookup',
						directive: 'basics-lookupdata-lookup-composite',
						editorOptions: {
							lookupDirective: 'basics-characteristic-data-discrete-value-combobox',
							lookupOptions: {
								filterKey: 'basics-characteristic-generalruid-filterkey',
								showClearButton: false,
								displayMember: 'DescriptionInfo.Translated',
								events: [
									{
										name: 'onSelectedItemChanged',
										handler: function (e, args) {
											args.entity.generalruid = args.selectedItem.generalruid;
										}
									},
								]
							},
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
						editor: 'lookup',
						sortable: true,
						directive: 'estimate-wizard-specific-ruid-lookup',
						editorOptions: {
							lookupDirective: 'estimate-wizard-specific-ruid-lookup',
							lookupOptions: {
								showClearButton: false,
								displayMember: 'DescriptionInfo.Translated',
								events: [
									{
										name: 'onSelectedItemChanged',
										handler: function (e, args)
										{
											args.entity.specificruid = args.selectedItem.Id;
											args.entity.specificruidFk = args.selectedItem.CharacteristicFk;
										}
									},
								]
							},
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'CharacteristicValue',
							valueMember: 'Id',
							displayMember: 'DescriptionInfo.Translated'
						}
					},
					{
						id: 'currentvalue',
						field: 'currentvalue',
						name: 'Current Value',
						editor: 'decimal',
						formatter: 'decimal',
						width: 75,
						sortable:true
					},
					{
						id: 'vintageyear',
						field: 'vintageyear',
						name: 'Vintage Year',
						width: 75,
						sortable: true,
						editor: 'integer',
						formatter: 'integer'
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

			service.getVintageAttributesGridConfig = function() {
				return angular.copy(gridConfig);
			};

			return service;
		}
	]);
})();
