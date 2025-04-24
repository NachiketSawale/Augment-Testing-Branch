/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	let modulename = 'estimate.project';

	/**
     * @ngdoc estimateProjectEstimateAttributesUIConfigService
     * @name estimateProjectEstimateAttributesUIConfigService
     * @description
     * This is the configuration service for the Estimate Attributes wizard portion.
     */
	angular.module(modulename).factory('estimateProjectEstimateAttributesUIConfigService', [ 'basicsLookupdataLookupDescriptorService', 'basicsCharacteristicTypeHelperService', 'basicsLookupdataConfigGenerator',
		function (basicsLookupdataLookupDescriptorService, basicsCharacteristicTypeHelperService, basicsLookupdataConfigGenerator ) {
			let service = {};

			let formConfig = {
				name: 'estimateAttributes',
				fid: 'estimate.project.createEstimateModal',
				version: '0.0.1',
				showGrouping: true,
				change: 'change',
				groups: [
					{
						gid: 'estimateAttributes',
						header: 'Estimate Attributes',
						isOpen: true,
						visible: true,
						sortOrder: 1
					},
					{
						gid: 'workOrderCreationInformation',
						header: 'Work Order Creation Information',
						isOpen: true,
						visible: true,
						sortOrder: 2
					}
				],
				rows: [
					{
						gid: 'estimateAttributes',
						rid: 'Name',
						// label$tr$: 'cloud.common.entityDescription',
						label: 'Name',
						model: 'Name',
						type: 'description',
						visible: true,
						readonly: true,
						placeholder: function(args) {
							let name = '';
							if (args.EstimateId !== -1) {
								if (args.EstimateCharacteristicsByCode.BASE_TEMP_INT.Value !== null
                                    && args.EstimateCharacteristicsByCode.BASE_TEMP_INT.Value.includes('Station')) {
									// [ASST]_[EST_VOLT]_[BPID]_[EST_SHORT_NAME]_[WORK]_Option [OPTN]_[VERSION]_CL[CLASS]
									name = args.EstimateCharacteristicsByCode.ASST.Value + '_' +
                                        args.EstimateCharacteristicsByCode.EST_VOLT.Value + '_' +
                                        args.EstimateCharacteristicsByCode.BPID.Value + '_' +
                                        args.EstimateCharacteristicsByCode.EST_SHORT_NAME.Value + '_' +
                                        args.EstimateCharacteristicsByCode.WORK.Value + '_Option ' +
                                        args.EstimateCharacteristicsByCode.OPTN.Value + '_' +
                                        args.EstimateCharacteristicsByCode.VERSION.Value + '_CL' +
                                        args.EstimateCharacteristicsByCode.CLASS.Value;
								} else if (args.EstimateCharacteristicsByCode.BASE_TEMP_INT.Value !== null
                                    && args.EstimateCharacteristicsByCode.BASE_TEMP_INT.Value.includes('Line')) {
									// [EST_VOLT]_[BPID]_[EST_SHORT_NAME]_[WORK]_Option [OPTN]_[VERSION]_CL[CLASS]
									name = args.EstimateCharacteristicsByCode.EST_VOLT.Value + '_' +
                                        args.EstimateCharacteristicsByCode.BPID.Value + '_' +
                                        args.EstimateCharacteristicsByCode.EST_SHORT_NAME.Value + '_' +
                                        args.EstimateCharacteristicsByCode.WORK.Value + '_Option ' +
                                        args.EstimateCharacteristicsByCode.OPTN.Value + '_' +
                                        args.EstimateCharacteristicsByCode.VERSION.Value + '_CL' +
                                        args.EstimateCharacteristicsByCode.CLASS.Value;

								}
								return name;
							}
						},
						sortOrder: 1
					},
					{
						gid: 'estimateAttributes',
						rid: 'EstimateCharacteristicsByCode.EST_SHORT_NAME.Value',
						required: true,
						// label$tr$: 'cloud.common.entityDescription',
						label: 'Estimate Short Name',
						model: 'EstimateCharacteristicsByCode.EST_SHORT_NAME.Value',
						type: 'description',
						visible: true,
						readonly: false,
						mandatory: true,
						sortOrder: 2,
					},
					{
						gid: 'estimateAttributes',
						rid: 'EstimateType',
						label: 'Estimate Type',
						required: true,
						model: 'EstimateType',
						type: 'directive',
						visible: true,

						sortOrder: 3,
						directive: 'estimate-project-est-type-combobox',
						options: {
							mandatory: true,
							showClearButton: true,
							descriptionMember: 'DescriptionInfo.Translated',
							lookupOptions: {
								showClearButton: true,
								valueMember: 'Id',
								displayMember: 'Description'
							},
							events: [
								{
									name: 'onSelectedItemChanged',
									handler: function(e, args) {
										if(args.selectedItem !== null){
											args.entity.EstimateCharacteristicsByCode.VERSION.Value = args.selectedItem.DescriptionInfo.Description;
											args.entity.EstimateTypeDescription = args.selectedItem.DescriptionInfo.Description;
										}
										else {
											args.entity.EstimateCharacteristicsByCode.VERSION.Value = '';
											args.entity.EstimateTypeDescription = '';
										}
									}
								}],
						},
					},
					basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
						dataServiceName: 'estimateWizardMainHeaderLookupDataService',
						desMember: 'DescriptionInfo.Translated',
						enableCache: true,
						showClearButton: false,
						filter: function (item) {
							return {
								projectId: item && item.EstimateTemplatesProjectFk ? item.EstimateTemplatesProjectFk : 0,
								isActive: item && item.EstimateId === -1 ? 1 : 0
							};
						},
					},
					{
						gid: 'estimateAttributes',
						rid: 'Template',
						required: true,
						label: 'Template',
						model: 'Template',
						visible: true,
						sortOrder: 4,
					}),
					basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm(
						{
							dataServiceName: 'basicsCharacteristicDiscreteValueLookupForEstimateService',
							moduleQualifier: 'CharacteristicValue',
							enableCache: true,
							showClearButton: true,
							filter: function (item){
								return item.EstimateCharacteristicsByCode.CLASS.CharacteristicFk;
							},
							events: [
								{
									name: 'onSelectedItemChanged',
									handler: function(e, args) {
										if(args.selectedItem !== null) {
											args.entity.EstimateCharacteristicsByCode.CLASS.Value = args.selectedItem.DescriptionInfo;
											args.entity.EstimateCharacteristicsByCode.CLASS.ValueFk = args.selectedItem.Id;
										}
										else {
											args.entity.EstimateCharacteristicsByCode.CLASS.ValueFk = -1;
										}
									}
								}]
						},
						{
							gid: 'estimateAttributes',
							rid: 'EstimateCharacteristicsByCode.CLASS.ValueFk',
							label: 'Class',
							required: true,
							model: 'EstimateCharacteristicsByCode.CLASS.ValueFk',
							type: 'lookup',
							visible: true,
							sortOrder: 5,
							directive: 'basicsCharacteristicDiscreteValueCombobox',
							options: {
								valueMember: 'Id',
								displayMember: 'DescriptionInfo.Description',
								lookupType: 'basicsCharacteristicDataDiscreteValueLookup',
							}
						}),
					basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm(
						{
							dataServiceName: 'basicsCharacteristicDiscreteValueLookupForEstimateService',
							moduleQualifier: 'CharacteristicValue',
							enableCache: true,
							showClearButton: true,
							filter: function (item){
								return item.EstimateCharacteristicsByCode.STATUS.CharacteristicFk;
							},
							events: [
								{
									name: 'onSelectedItemChanged',
									handler: function(e, args) {
										if(args.selectedItem !== null) {
											args.entity.EstimateCharacteristicsByCode.STATUS.Value = args.selectedItem.DescriptionInfo;
											args.entity.EstimateCharacteristicsByCode.STATUS.ValueFk = args.selectedItem.Id;
										}
										else {
											args.entity.EstimateCharacteristicsByCode.STATUS.ValueFk = -1;
										}
									}
								}]
						},
						{
							gid: 'estimateAttributes',
							rid: 'EstimateCharacteristicsByCode.STATUS.ValueFk',
							label: 'Status',
							required: true,
							model: 'EstimateCharacteristicsByCode.STATUS.ValueFk',
							type: 'lookup',
							visible: true,
							sortOrder: 6,
							readonly: true,
							directive: 'basicsCharacteristicDiscreteValueCombobox',
							options: {
								valueMember: 'Id',
								displayMember: 'DescriptionInfo.Description',
								lookupType: 'basicsCharacteristicDataDiscreteValueLookup',
							}
						}),
					basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm(
						{
							dataServiceName: 'basicsCharacteristicDiscreteValueLookupForEstimateService',
							moduleQualifier: 'CharacteristicValue',
							enableCache: true,
							showClearButton: true,
							filter: function (item){
								return item.EstimateCharacteristicsByCode.WOT_CONST.CharacteristicFk;
							},
							events: [
								{
									name: 'onSelectedItemChanged',
									handler: function(e, args) {
										if(args.selectedItem !== null) {
											args.entity.EstimateCharacteristicsByCode.WOT_CONST.Value = args.selectedItem.DescriptionInfo;
											args.entity.EstimateCharacteristicsByCode.WOT_CONST.ValueFk = args.selectedItem.Id;
											args.entity.EstimateCharacteristicsByCode.WORK.Value = args.selectedItem.DescriptionInfo;
										}
										else {
											args.entity.EstimateCharacteristicsByCode.WOT_CONST.ValueFk = -1;
											args.entity.EstimateCharacteristicsByCode.WORK.Value = '';
										}
									}
								}]
						},
						{
							gid: 'estimateAttributes',
							rid: 'EstimateCharacteristicsByCode.WOT_CONST.ValueFk',
							label: 'Work',
							required: true,
							model: 'EstimateCharacteristicsByCode.WOT_CONST.ValueFk',
							type: 'lookup',
							visible: false,
							sortOrder: 7,
							directive: 'basicsCharacteristicDiscreteValueCombobox',
							options: {
								valueMember: 'Id',
								displayMember: 'DescriptionInfo.Description',
								lookupType: 'basicsCharacteristicDataDiscreteValueLookup',

							}
						}),
					basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm(
						{
							dataServiceName: 'basicsCharacteristicDiscreteValueLookupForEstimateService',
							moduleQualifier: 'CharacteristicValue',
							enableCache: true,
							showClearButton: true,
							filter: function (item){
								return item.EstimateCharacteristicsByCode.WOT_EST_DFT.CharacteristicFk;
							},
							events: [
								{
									name: 'onSelectedItemChanged',
									handler: function(e, args) {
										if(args.selectedItem !== null) {
											args.entity.EstimateCharacteristicsByCode.WOT_EST_DFT.Value = args.selectedItem.DescriptionInfo;
											args.entity.EstimateCharacteristicsByCode.WOT_EST_DFT.ValueFk = args.selectedItem.Id;
											args.entity.EstimateCharacteristicsByCode.WORK.Value = args.selectedItem.DescriptionInfo;
										}
										else {
											args.entity.EstimateCharacteristicsByCode.WOT_EST_DFT.ValueFk = -1;
											args.entity.EstimateCharacteristicsByCode.WORK.Value = '';
										}
									}
								}]
						},
						{
							gid: 'estimateAttributes',
							rid: 'EstimateCharacteristicsByCode.WOT_EST_DFT.ValueFk',
							label: 'Work',
							required: true,
							model: 'EstimateCharacteristicsByCode.WOT_EST_DFT.ValueFk',
							type: 'lookup',
							visible: false,
							sortOrder: 7,
							directive: 'basicsCharacteristicDiscreteValueCombobox',
							options: {
								valueMember: 'Id',
								displayMember: 'DescriptionInfo.Description',
								lookupType: 'basicsCharacteristicDataDiscreteValueLookup',

							}
						}),
					basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm(
						{
							dataServiceName: 'basicsCharacteristicDiscreteValueLookupForEstimateService',
							moduleQualifier: 'CharacteristicValue',
							enableCache: true,
							showClearButton: true,
							filter: function (item){
								return item.EstimateCharacteristicsByCode.WOT_MAINT.CharacteristicFk;
							},
							events: [
								{
									name: 'onSelectedItemChanged',
									handler: function(e, args) {
										if(args.selectedItem !== null) {
											args.entity.EstimateCharacteristicsByCode.WOT_MAINT.Value = args.selectedItem.DescriptionInfo;
											args.entity.EstimateCharacteristicsByCode.WOT_MAINT.ValueFk = args.selectedItem.Id;
											args.entity.EstimateCharacteristicsByCode.WORK.Value = args.selectedItem.DescriptionInfo;
										}
										else {
											args.entity.EstimateCharacteristicsByCode.WOT_MAINT.ValueFk = -1;
											args.entity.EstimateCharacteristicsByCode.WORK.Value = '';
										}
									}
								}]
						},
						{
							gid: 'estimateAttributes',
							rid: 'EstimateCharacteristicsByCode.WOT_MAINT.ValueFk',
							label: 'Work',
							required: true,
							model: 'EstimateCharacteristicsByCode.WOT_MAINT.ValueFk',
							type: 'lookup',
							visible: false,
							sortOrder: 7,
							directive: 'basicsCharacteristicDiscreteValueCombobox',
							options: {
								valueMember: 'Id',
								displayMember: 'DescriptionInfo.Description',
								lookupType: 'basicsCharacteristicDataDiscreteValueLookup',

							}
						}),
					basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm(
						{
							dataServiceName: 'basicsCharacteristicDiscreteValueLookupForEstimateService',
							moduleQualifier: 'CharacteristicValue',
							enableCache: true,
							showClearButton: true,
							filter: function (item){
								return item.EstimateCharacteristicsByCode.WOT_REAM.CharacteristicFk;
							},
							events: [
								{
									name: 'onSelectedItemChanged',
									handler: function(e, args) {
										if(args.selectedItem !== null) {
											args.entity.EstimateCharacteristicsByCode.WOT_REAM.Value = args.selectedItem.DescriptionInfo;
											args.entity.EstimateCharacteristicsByCode.WOT_REAM.ValueFk = args.selectedItem.Id;
											args.entity.EstimateCharacteristicsByCode.WORK.Value = args.selectedItem.DescriptionInfo;
										}
										else {
											args.entity.EstimateCharacteristicsByCode.WOT_REAM.ValueFk = -1;
											args.entity.EstimateCharacteristicsByCode.WORK.Value = '';
										}
									}
								}]
						},
						{
							gid: 'estimateAttributes',
							rid: 'EstimateCharacteristicsByCode.WOT_REAM.ValueFk',
							label: 'Work',
							required: true,
							model: 'EstimateCharacteristicsByCode.WOT_REAM.ValueFk',
							type: 'lookup',
							visible: false,
							sortOrder: 7,
							directive: 'basicsCharacteristicDiscreteValueCombobox',
							options: {
								valueMember: 'Id',
								displayMember: 'DescriptionInfo.Description',
								lookupType: 'basicsCharacteristicDataDiscreteValueLookup',

							}
						}),
					basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm(
						{
							dataServiceName: 'basicsCharacteristicDiscreteValueLookupForEstimateService',
							moduleQualifier: 'CharacteristicValue',
							enableCache: true,
							showClearButton: true,
							filter: function (item){
								return item.EstimateCharacteristicsByCode.WOT_RMV.CharacteristicFk;
							},
							events: [
								{
									name: 'onSelectedItemChanged',
									handler: function(e, args) {
										if(args.selectedItem !== null) {
											args.entity.EstimateCharacteristicsByCode.WOT_RMV.Value = args.selectedItem.DescriptionInfo;
											args.entity.EstimateCharacteristicsByCode.WOT_RMV.ValueFk = args.selectedItem.Id;
											args.entity.EstimateCharacteristicsByCode.WORK.Value = args.selectedItem.DescriptionInfo;
										}
										else {
											args.entity.EstimateCharacteristicsByCode.WOT_RMV.ValueFk = -1;
											args.entity.EstimateCharacteristicsByCode.WORK.Value = '';
										}
									}
								}]
						},
						{
							gid: 'estimateAttributes',
							rid: 'EstimateCharacteristicsByCode.WOT_RMV.ValueFk',
							label: 'Work',
							required: true,
							model: 'EstimateCharacteristicsByCode.WOT_RMV.ValueFk',
							type: 'lookup',
							visible: false,
							sortOrder: 7,
							directive: 'basicsCharacteristicDiscreteValueCombobox',
							options: {
								valueMember: 'Id',
								displayMember: 'DescriptionInfo.Description',
								lookupType: 'basicsCharacteristicDataDiscreteValueLookup',

							}
						}),
					basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm(
						{
							dataServiceName: 'basicsCharacteristicDiscreteValueLookupForEstimateService',
							moduleQualifier: 'CharacteristicValue',
							enableCache: true,
							showClearButton: true,
							filter: function (item){
								return item.EstimateCharacteristicsByCode.WOT_ROW.CharacteristicFk;
							},
							events: [
								{
									name: 'onSelectedItemChanged',
									handler: function(e, args) {
										if(args.selectedItem !== null) {
											args.entity.EstimateCharacteristicsByCode.WOT_ROW.Value = args.selectedItem.DescriptionInfo;
											args.entity.EstimateCharacteristicsByCode.WOT_ROW.ValueFk = args.selectedItem.Id;
											args.entity.EstimateCharacteristicsByCode.WORK.Value = args.selectedItem.DescriptionInfo;
										}
										else {
											args.entity.EstimateCharacteristicsByCode.WOT_ROW.ValueFk = -1;
											args.entity.EstimateCharacteristicsByCode.WORK.Value = '';
										}
									}
								}]
						},
						{
							gid: 'estimateAttributes',
							rid: 'EstimateCharacteristicsByCode.WOT_ROW.ValueFk',
							label: 'Work',
							required: true,
							model: 'EstimateCharacteristicsByCode.WOT_ROW.ValueFk',
							type: 'lookup',
							visible: false,
							sortOrder: 7,
							directive: 'basicsCharacteristicDiscreteValueCombobox',
							options: {
								valueMember: 'Id',
								displayMember: 'DescriptionInfo.Description',
								lookupType: 'basicsCharacteristicDataDiscreteValueLookup',

							}
						}),
					basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm(
						{
							dataServiceName: 'basicsCharacteristicDiscreteValueLookupForEstimateService',
							moduleQualifier: 'CharacteristicValue',
							enableCache: true,
							showClearButton: true,
							filter: function (item){
								return item.EstimateCharacteristicsByCode.ENG_RESC.CharacteristicFk;
							},
							events: [
								{
									name: 'onSelectedItemChanged',
									handler: function(e, args) {
										if(args.selectedItem !== null) {
											args.entity.EstimateCharacteristicsByCode.ENG_RESC.Value = args.selectedItem.DescriptionInfo;
											args.entity.EstimateCharacteristicsByCode.ENG_RESC.ValueFk = args.selectedItem.Id;
										}
										else {
											args.entity.EstimateCharacteristicsByCode.ENG_RESC.ValueFk = -1;
										}
									}
								}]
						},
						{
							gid: 'estimateAttributes',
							rid: 'EstimateCharacteristicsByCode.ENG_RESC.ValueFk',
							label: 'EPC Estimate',
							required: true,
							model: 'EstimateCharacteristicsByCode.ENG_RESC.ValueFk',
							type: 'lookup',
							visible: true,
							sortOrder: 8,
							directive: 'basicsCharacteristicDiscreteValueCombobox',
							options: {
								valueMember: 'Id',
								displayMember: 'DescriptionInfo.Description',
								lookupType: 'basicsCharacteristicDataDiscreteValueLookup',

							}
						}),
					{
						gid: 'estimateAttributes',
						rid: 'EstimateCharacteristicsByCode.REMOVAL.Value',
						label: 'This is an Entire Removal',
						model: 'EstimateCharacteristicsByCode.REMOVAL.Value',
						type: 'boolean',
						disabled: false,
						visible: false,
						sortOrder: 9
					},
					basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm(
						{
							dataServiceName: 'basicsCharacteristicDiscreteValueLookupForEstimateService',
							moduleQualifier: 'CharacteristicValue',
							enableCache: true,
							showClearButton: true,
							filter: function (item){
								return item.EstimateCharacteristicsByCode.STATN_TYP.CharacteristicFk;
							},
							events: [
								{
									name: 'onSelectedItemChanged',
									handler: function(e, args) {
										if(args.selectedItem !== null) {
											args.entity.EstimateCharacteristicsByCode.STATN_TYP.Value = args.selectedItem.DescriptionInfo;
											args.entity.EstimateCharacteristicsByCode.STATN_TYP.ValueFk = args.selectedItem.Id;
										}
										else {
											args.entity.EstimateCharacteristicsByCode.STATN_TYP.ValueFk = -1;
										}
									}
								}]
						},
						{
							gid: 'estimateAttributes',
							rid: 'EstimateCharacteristicsByCode.STATN_TYP.ValueFk',
							label: 'Station Type',
							required: true,
							model: 'EstimateCharacteristicsByCode.STATN_TYP.ValueFk',
							type: 'lookup',
							visible: true,
							sortOrder: 10,
							directive: 'basicsCharacteristicDiscreteValueCombobox',
							options: {
								valueMember: 'Id',
								displayMember: 'DescriptionInfo.Description',
								lookupType: 'basicsCharacteristicDataDiscreteValueLookup',
							}
						}),
					basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm(
						{
							dataServiceName: 'basicsCharacteristicDiscreteValueLookupForEstimateService',
							moduleQualifier: 'CharacteristicValue',
							enableCache: true,
							showClearButton: true,
							filter: function (item){
								return item.EstimateCharacteristicsByCode.TLNE_TYP.CharacteristicFk;
							},
							events: [
								{
									name: 'onSelectedItemChanged',
									handler: function(e, args) {
										if(args.selectedItem !== null) {
											args.entity.EstimateCharacteristicsByCode.TLNE_TYP.Value = args.selectedItem.DescriptionInfo;
											args.entity.EstimateCharacteristicsByCode.TLNE_TYP.ValueFk = args.selectedItem.Id;
										}
										else {
											args.entity.EstimateCharacteristicsByCode.TLNE_TYP.ValueFk = -1;
										}
									}
								}]
						},
						{
							gid: 'estimateAttributes',
							rid: 'EstimateCharacteristicsByCode.TLNE_TYP.ValueFk',
							label: 'Line Type',
							required: true,
							model: 'EstimateCharacteristicsByCode.TLNE_TYP.ValueFk',
							type: 'lookup',
							visible: true,
							sortOrder: 11,
							directive: 'basicsCharacteristicDiscreteValueCombobox',
							options: {
								valueMember: 'Id',
								displayMember: 'DescriptionInfo.Description',
								lookupType: 'basicsCharacteristicDataDiscreteValueLookup',

							}
						}),
					basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm(
						{
							dataServiceName: 'basicsCharacteristicDiscreteValueLookupForEstimateService',
							moduleQualifier: 'CharacteristicValue',
							enableCache: true,
							showClearButton: true,
							filter: function (item){
								return item.EstimateCharacteristicsByCode.EST_VOLT.CharacteristicFk;
							},
							events: [
								{
									name: 'onSelectedItemChanged',
									handler: function(e, args) {
										if(args.selectedItem !== null) {
											args.entity.EstimateCharacteristicsByCode.EST_VOLT.Value = args.selectedItem.DescriptionInfo;
											args.entity.EstimateCharacteristicsByCode.EST_VOLT.ValueFk = args.selectedItem.Id;
										}
										else {
											args.entity.EstimateCharacteristicsByCode.EST_VOLT.ValueFk = -1;
										}
									}
								}]
						},
						{
							gid: 'estimateAttributes',
							rid: 'EstimateCharacteristicsByCode.EST_VOLT.ValueFk',
							label: 'Highest Estimate Voltage',
							required: true,
							model: 'EstimateCharacteristicsByCode.EST_VOLT.ValueFk',
							type: 'lookup',
							visible: true,
							sortOrder: 12,
							directive: 'basicsCharacteristicDiscreteValueCombobox',
							options: {
								valueMember: 'Id',
								displayMember: 'DescriptionInfo.Description',
								lookupType: 'basicsCharacteristicDataDiscreteValueLookup',

							}
						}),
					basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm(
						{
							dataServiceName: 'basicsCharacteristicDiscreteValueLookupForEstimateService',
							moduleQualifier: 'CharacteristicValue',
							enableCache: true,
							showClearButton: true,
							filter: function (item){
								return item.EstimateCharacteristicsByCode.RISK.CharacteristicFk;
							},
							events: [
								{
									name: 'onSelectedItemChanged',
									handler: function(e, args) {
										if(args.selectedItem !== null) {
											args.entity.EstimateCharacteristicsByCode.RISK.Value = args.selectedItem.DescriptionInfo;
											args.entity.EstimateCharacteristicsByCode.RISK.ValueFk = args.selectedItem.Id;
										}
										else {
											args.entity.EstimateCharacteristicsByCode.RISK.ValueFk = -1;
										}
									}
								}]
						},
						{
							gid: 'estimateAttributes',
							rid: 'EstimateCharacteristicsByCode.RISK.ValueFk',
							label: 'Detail Project Risk Level',
							required: true,
							model: 'EstimateCharacteristicsByCode.RISK.ValueFk',
							type: 'lookup',
							visible: true,
							sortOrder: 13,
							directive: 'basicsCharacteristicDiscreteValueCombobox',
							options: {
								valueMember: 'Id',
								displayMember: 'DescriptionInfo.Description',
								lookupType: 'basicsCharacteristicDataDiscreteValueLookup',

							}
						}),
					{
						gid: 'estimateAttributes',
						rid: 'EstimateCharacteristicsByCode.OPTN.Value',
						label: 'Option',
						model: 'EstimateCharacteristicsByCode.OPTN.Value',
						type: 'description',
						visible: true,
						readonly: true,
						sortOrder: 14,
					},
					basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm(
						{
							dataServiceName: 'basicsCharacteristicDiscreteValueLookupForEstimateService',
							moduleQualifier: 'CharacteristicValue',
							enableCache: true,
							showClearButton: true,
							filter: function (item){
								return item.EstimateCharacteristicsByCode.LAYOUT.CharacteristicFk;
							},
							events: [
								{
									name: 'onSelectedItemChanged',
									handler: function(e, args) {
										if(args.selectedItem !== null) {
											args.entity.EstimateCharacteristicsByCode.LAYOUT.Value = args.selectedItem.DescriptionInfo;
											args.entity.EstimateCharacteristicsByCode.LAYOUT.ValueFk = args.selectedItem.Id;
										}
										else {
											args.entity.EstimateCharacteristicsByCode.LAYOUT.ValueFk = -1;
										}
									}
								}]
						},
						{
							gid: 'estimateAttributes',
							rid: 'EstimateCharacteristicsByCode.LAYOUT.ValueFk',
							label: 'Station Layout',
							required: true,
							model: 'EstimateCharacteristicsByCode.LAYOUT.ValueFk',
							type: 'lookup',
							visible: true,
							sortOrder: 15,
							directive: 'basicsCharacteristicDiscreteValueCombobox',
							options: {
								valueMember: 'Id',
								displayMember: 'DescriptionInfo.Description',
								lookupType: 'basicsCharacteristicDataDiscreteValueLookup',

							}
						}),
					basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm(
						{
							dataServiceName: 'basicsCharacteristicDiscreteValueLookupForEstimateService',
							moduleQualifier: 'CharacteristicValue',
							enableCache: true,
							showClearButton: true,
							filter: function (item){
								return item.EstimateCharacteristicsByCode.TLNE_PRJTYP.CharacteristicFk;
							},
							events: [
								{
									name: 'onSelectedItemChanged',
									handler: function(e, args) {
										if(args.selectedItem !== null) {
											args.entity.EstimateCharacteristicsByCode.TLNE_PRJTYP.Value = args.selectedItem.DescriptionInfo;
											args.entity.EstimateCharacteristicsByCode.TLNE_PRJTYP.ValueFk = args.selectedItem.Id;
										}
										else {
											args.entity.EstimateCharacteristicsByCode.TLNE_PRJTYP.ValueFk = -1;
										}
									}
								}]
						},
						{
							gid: 'estimateAttributes',
							rid: 'EstimateCharacteristicsByCode.TLNE_PRJTYP.ValueFk',
							label: 'Project Type T-Line',
							required: true,
							model: 'EstimateCharacteristicsByCode.TLNE_PRJTYP.ValueFk',
							type: 'lookup',
							visible: true,
							sortOrder: 16,
							directive: 'basicsCharacteristicDiscreteValueCombobox',
							options: {
								valueMember: 'Id',
								displayMember: 'DescriptionInfo.Description',
								lookupType: 'basicsCharacteristicDataDiscreteValueLookup',

							}
						}),
					{
						gid: 'estimateAttributes',
						rid: 'EstimateCharacteristicsByCode.CONST_DATE.Value',
						label: 'Construction Start Date',
						required: true,
						model: 'EstimateCharacteristicsByCode.CONST_DATE.Value',
						type: 'dateutc',
						visible: true,
						sortOrder: 17
					},

					{
						gid: 'estimateAttributes',
						rid: 'EstimateCharacteristicsByCode.SRVCE_DATE.Value',
						label: 'In Service Date',
						required: true,
						model: 'EstimateCharacteristicsByCode.SRVCE_DATE.Value',
						type: 'dateutc',
						visible: true,
						sortOrder: 18,
					},
					{
						gid: 'estimateAttributes',
						rid: 'EstimateCharacteristicsByCode.VERSION.Value',
						label: 'Version',
						model: 'EstimateCharacteristicsByCode.VERSION.Value',
						type: 'description',
						visible: true,
						readonly: true,
						sortOrder: 19,
					},
					{
						gid: 'estimateAttributes',
						rid: 'CreatedBy',
						label: 'Created By',
						model: 'CreatedBy',
						type: 'description',
						visible: true,
						sortOrder: 20,
						readonly: true
					},
					{
						gid: 'estimateAttributes',
						rid: 'DateCreated',
						label: 'Date Created',
						model: 'DateCreated',
						type: 'dateutc',
						visible: true,
						sortOrder: 21,
						readonly: true
					},
					{
						gid: 'estimateAttributes',
						rid: 'ModifiedBy',
						label: 'Modified By',
						model: 'ModifiedBy',
						type: 'description',
						visible: true,
						sortOrder: 22,
						readonly: true
					},
					{
						gid: 'estimateAttributes',
						rid: 'DateModified',
						label: 'Date Modified',
						model: 'DateModified',
						type: 'dateutc',
						visible: true,
						sortOrder: 23,
						readonly: true

					},
					{
						gid: 'workOrderCreationInformation',
						rid: 'EstimateCharacteristicsByCode.WO_CLMDBY.Value',
						label: 'Request Claimed by iTWO Admin',
						model: 'EstimateCharacteristicsByCode.WO_CLMDBY.Value',
						type: 'description',
						disabled: false,
						readonly: true,
						visible: true,
						sortOrder: 24
					},
					{
						gid: 'workOrderCreationInformation',
						rid: 'EstimateCharacteristicsByCode.WO_POSTBY.Value',
						label: 'Request Posted by iTWO Admin',
						model: 'EstimateCharacteristicsByCode.WO_POSTBY.Value',
						type: 'description',
						disabled: false,
						readonly: true,
						visible: true,
						sortOrder: 25
					}
				]
			};

			service.getFormConfig = function() {
				return angular.copy(formConfig);
			};

			return service;
		}
	]);
})();
