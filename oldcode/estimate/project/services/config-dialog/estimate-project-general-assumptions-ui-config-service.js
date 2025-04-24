/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	let modulename = 'estimate.project';

	/**
	 * @ngdoc estimateProjectGeneralAssumptionsUIConfigService
	 * @name estimateProjectGeneralAssumptionsUIConfigService
	 * @description
	 * This is the configuration service for the General Assumptions wizard portion.
	 */
	angular.module(modulename).factory('estimateProjectGeneralAssumptionsUIConfigService',
		['basicsLookupdataLookupDescriptorService', 'basicsLookupdataLookupFilterService',
			function (basicsLookupdataLookupDescriptorService, basicsLookupdataLookupFilterService ){
				let service = {};

				let formConfig = {
					name:'generalAssumptions',
					fid: 'estimate.project.createEstimateModal',
					version: '0.0.1',
					showGrouping: true,
					groups: [
						{
							gid: 'outsideServicesConstructionLabor',
							header: 'Outside Services Construction Labor',
							isOpen: true,
							visible: true,
							sortOrder: 1
						},
						{
							gid: 'internalConstructionLabor',
							header: 'Internal Construction Labor',
							isOpen: true,
							visible: true,
							sortOrder: 2
						},
						{
							gid: 'estimateAssumptions',
							header: 'Estimate Assumptions',
							isOpen: true,
							visible: true,
							sortOrder: 3
						}
					],
					rows: [
						{
							gid: 'outsideServicesConstructionLabor',
							rid:  'EstimateCharacteristicsByCode.LBR_CONT.ValueFk',
							// label$tr$: 'cloud.common.entityCode',
							label: 'Labor Contract',
							model: 'EstimateCharacteristicsByCode.LBR_CONT.ValueFk',
							type: 'directive',
							directive: 'basics-cost-codes-price-version-lookup',
							visible: true,
							required: true,
							sortOrder: 1,
							options: {
								filterKey: 'template-type-filter',
								valueMember: 'Id',
								displayMember: 'DescriptionInfo.Translated',
								lookupType: 'CostCodePriceVersion',
								showClearButton: true,
								events: [
									{
										name: 'onSelectedItemChanged',
										handler: function(e, args) {
											if(args.selectedItem !== null){
												args.entity.EstimateCharacteristicsByCode.LBR_CONT.Value = args.selectedItem.DescriptionInfo.Description;}
											else {
												args.entity.EstimateCharacteristicsByCode.LBR_CONT.Value = '';
											}
										}
									}],
								lookupOptions: {
									showClearButton: true
								}
							},
						},
						{
							gid: 'internalConstructionLabor',
							rid: 'ConstructionNotes',
							// label$tr$: 'cloud.common.entityDescription',
							label: 'Construction Assumptions / Notes',
							model: 'ConstructionNotes',
							// height: 300,
							type: 'text',
							visible: true,
							sortOrder: 2
						},
						{
							gid: 'estimateAssumptions',
							rid: 'EstimateNotes',
							// label$tr$: 'cloud.common.entityDescription',
							label: 'Estimate Assumptions / Notes',
							model: 'EstimateNotes',
							type: 'text',
							// height: 300,
							visible: true,
							sortOrder: 3
						}
					]
				};


				let filters = [
					{
						key: 'template-type-filter',
						serverSide: false,
						fn: function (lookupitem, item) {
							let type = item.EstimateCharacteristicsByCode.BASE_TEMP_INT.Value;
							let search = type.search('Station') === -1 ? 'Transmission Line' : 'Station';
							let filtertypeforjobs = '';
							switch(type.split('+')[1])
							{
								case 'Installation':
								case 'REAM':
								case 'ROW':
									filtertypeforjobs = '|INSTALL';
									break;

								case 'Removal':
									filtertypeforjobs = '|REMOVAL';
									break;

							}
							return lookupitem.PriceListDescription === search
							&& lookupitem.DescriptionInfo.Description.includes(filtertypeforjobs);
						}
					}
				];
				basicsLookupdataLookupFilterService.registerFilter(filters);

				service.getFormConfig = function() {
					return angular.copy(formConfig);
				};

				return service;
			}
		]);
})();
