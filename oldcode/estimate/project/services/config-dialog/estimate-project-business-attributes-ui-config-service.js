/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	let modulename = 'estimate.project';

	/**
	 * @ngdoc estimateProjectBusinessAttributesUIConfigService
	 * @name estimateProjectBusinessAttributesUIConfigService
	 * @description
	 * This is the configuration service for the Business Attributes wizard portion.
	 */
	angular.module(modulename).factory('estimateProjectBusinessAttributesUIConfigService', [ 'basicsLookupdataConfigGenerator', 'basicsLookupdataLookupFilterService',
		function (basicsLookupdataConfigGenerator, basicsLookupdataLookupFilterService) {
			let service = {};
			let filters = [
				{
					key: 'CompanyFk',
					serverSide: true,
					fn: function (item) {
						if (item) {
							return 'CountryFk=' + item.CountryFk;
						}
					}
				},
			];

			basicsLookupdataLookupFilterService.registerFilter(filters);

			let formConfig = {
				name: 'businessAttributes',
				fid: 'estimate.project.createEstimateModal',
				version: '0.0.1',
				showGrouping: true,
				change: 'change',
				groups: [
					{
						gid: 'projectAttributes',
						header: 'Project Attributes',
						isOpen: true,
						visible: true,
						sortOrder: 1
					},
					{
						gid: 'assetAttributesLine',
						header: 'Line Asset Attributes',
						isOpen: true,
						visible: true,
						sortOrder: 2
					},
					{
						gid: 'assetAttributesStation',
						header: 'Station Asset Attributes',
						isOpen: true,
						visible: true,
						sortOrder: 3
					},
					{
						gid: 'transmissionLineAttributes',
						header: 'Transmission Line Attributes',
						isOpen: true,
						visible: true,
						sortOrder: 4
					}
				],
				rows: [
					// /////STATION AND LINE ATTRIBUTES////////////////////////
					basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
						dataServiceName: 'estimateWizardEcosysStagingLookupDataService',
						enableCache: true,
						displayMember: 'Project_BPID',
						showClearButton: true,
						required: function(args){
							return args.entity.EstimateType.Value === 'Functional' || args.entity.EstimateType.Value === 'Detail';
						},
						additionalColumns: false,
						events: [{
							name: 'onSelectedItemChanged',
							handler: function (e, args) {
								if(args.selectedItem !== null) {
									args.entity.EstimateCharacteristicsByCode.MP_NAME.Value = args.selectedItem.MasterProject_Name;
									args.entity.EstimateCharacteristicsByCode.SP_NAME.Value = args.selectedItem.SuperProject_Name;
									args.entity.EstimateCharacteristicsByCode.CI.Value = args.selectedItem.Project_CINumber;
									args.entity.EstimateCharacteristicsByCode.CPP_NUM.Value = args.selectedItem.Project_CPP;
									args.entity.EstimateCharacteristicsByCode.BPID.ValueFk = args.selectedItem.Id;
									args.entity.EstimateCharacteristicsByCode.BPID.Value = args.selectedItem.Project_BPID;
								}
								else
								{
									args.entity.EstimateCharacteristicsByCode.BPID.Value = '';
									args.entity.EstimateCharacteristicsByCode.BPID.ValueFk = -1;
									args.entity.EstimateCharacteristicsByCode.MP_NAME.Value = '';
									args.entity.EstimateCharacteristicsByCode.SP_NAME.Value = '';
									args.entity.EstimateCharacteristicsByCode.CI.Value = '';
									args.entity.EstimateCharacteristicsByCode.CPP_NUM.Value = '';
								}
							},
						}]
					},
					{
						gid: 'projectAttributes',
						rid: 'EstimateCharacteristicsByCode.BPID.ValueFk',
						label: 'BPID',
						model: 'EstimateCharacteristicsByCode.BPID.ValueFk',
						visible: true,
						type: 'lookup',
						directive: 'estimate-wizard-ecosys-staging-lookup',
						width: 150,
						sortOrder: 1,
						options: {
							showClearButton: false,
						}
					}),
					{
						gid: 'projectAttributes',
						rid: 'EstimateCharacteristicsByCode.MP_NAME.Value',
						// label$tr$: 'cloud.common.entityCode',
						label: 'Master Project',
						model: 'EstimateCharacteristicsByCode.MP_NAME.Value',
						type: 'description',
						visible: true,
						sortOrder: 2,
						readonly: true,
					},
					{
						gid: 'projectAttributes',
						rid: 'EstimateCharacteristicsByCode.SP_NAME.Value',
						// label$tr$: 'cloud.common.entityCode',
						label: 'Super Project',
						model: 'EstimateCharacteristicsByCode.SP_NAME.Value',
						type: 'description',
						visible: true,
						sortOrder: 2,
						readonly: true,
					},
					{
						gid: 'projectAttributes',
						rid: 'EstimateCharacteristicsByCode.CI.Value',
						// label$tr$: 'cloud.common.entityDescription',
						label: 'CI Number',
						model: 'EstimateCharacteristicsByCode.CI.Value',
						type: 'description',
						visible: true,
						sortOrder: 3,
						readonly: true,
					},
					{
						gid: 'projectAttributes',
						rid: 'EstimateCharacteristicsByCode.CPP_NUM.Value',
						// label$tr$: 'cloud.common.entityDescription',
						label: 'CPP Number',
						model: 'EstimateCharacteristicsByCode.CPP_NUM.Value',
						type: 'description',
						visible: true,
						sortOrder: 4,
						readonly: true
					},
					// //////////END STATION AND LINE ATTRIBUTES//////////
					// ////////// BEGIN LINE ASSET ATTRIBUTES ///////////
					basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm(
						{
							dataServiceName: 'basicsCharacteristicDiscreteValueLookupForEstimateService',
							moduleQualifier: 'CharacteristicValue',
							enableCache: true,
							showClearButton: true,
							filter: function (item){
								return item.EstimateCharacteristicsByCode.STATE.CharacteristicFk;
							},
							events: [
								{
									name: 'onSelectedItemChanged',
									handler: function(e, args) {
										if (args.selectedItem !== null) {
											args.entity.EstimateCharacteristicsByCode.STATE.ValueFk = args.selectedItem.Id;
											args.entity.EstimateCharacteristicsByCode.STATE.Value = args.selectedItem.DescriptionInfo.Description;
											args.entity.EstimateCharacteristicsByCode.ASST_ACCNT.ValueFk = -1;
											args.entity.EstimateCharacteristicsByCode.OPCO.Value = '';
											args.entity.EstimateCharacteristicsByCode.REGION_NM.Value = '';
										}
										else {
											args.entity.EstimateCharacteristicsByCode.STATE.ValueFk = -1;
											args.entity.EstimateCharacteristicsByCode.STATE.Value = '';
											args.entity.EstimateCharacteristicsByCode.ASST_ACCNT.ValueFk = -1;
											args.entity.EstimateCharacteristicsByCode.OPCO.Value = '';
											args.entity.EstimateCharacteristicsByCode.REGION_NM.Value = '';
										}
									}
								}
							]
						},
						{
							gid: 'assetAttributesLine',
							rid: 'EstimateCharacteristicsByCode.STATE.ValueFk',
							label: 'State',
							required : true,
							model: 'EstimateCharacteristicsByCode.STATE.ValueFk',
							type: 'lookup',
							visible: true,
							sortOrder: 1,
							directive: 'basicsCharacteristicDiscreteValueCombobox',
							options: {
								valueMember: 'Id',
								displayMember: 'DescriptionInfo.Description',
								lookupType: 'basicsCharacteristicDataDiscreteValueLookup',
							}
						}),
					basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
						dataServiceName: 'estimateWizardIpsStagingLookupDataService',
						enableCache: true,
						displayMember: 'FULL_BEN_LOC',
						additionalColumns: false,
						showClearButton: true,
						filter: function (item) {
							return {fercAcct: item.EstimateCharacteristicsByCode.FERC_ACCT.Value, state: item.EstimateCharacteristicsByCode.STATE.Value};
						},
						events: [{
							name: 'onSelectedItemChanged',
							handler: function (e, args) {
								if(args.selectedItem !== null) {
									args.entity.EstimateCharacteristicsByCode.FERC_ACCT.Value = args.selectedItem.FERC_ACCT;
									args.entity.EstimateCharacteristicsByCode.OPCO.Value = args.selectedItem.OPCO;
									args.entity.EstimateCharacteristicsByCode.REGION_NM.Value = args.selectedItem.REGION_NM;
									args.entity.EstimateCharacteristicsByCode.ASST_ACCNT.ValueFk = args.selectedItem.Id;
									args.entity.EstimateCharacteristicsByCode.ASST_ACCNT.Value = args.selectedItem.FULL_BEN_LOC;
								}
								else {
									args.entity.EstimateCharacteristicsByCode.ASST_ACCNT.ValueFk = -1;
									args.entity.EstimateCharacteristicsByCode.FERC_ACCT.Value = '';
									args.entity.EstimateCharacteristicsByCode.OPCO.Value = '';
									args.entity.EstimateCharacteristicsByCode.REGION_NM.Value = '';
								}
							},
						}]
					},
					{
						gid: 'assetAttributesLine',
						rid: 'EstimateCharacteristicsByCode.ASST_ACCNT.ValueFk',
						label: 'Asset Accounting',
						required : true,
						model:'EstimateCharacteristicsByCode.ASST_ACCNT.ValueFk',
						type: 'lookup',
						visible: true,
						sortOrder: 2,
						directive: 'estimate-wizard-ips-staging-lookup',
					}),
					{
						gid: 'assetAttributesLine',
						rid: 'EstimateCharacteristicsByCode.OPCO.Value', // formerly OP_CMPNY
						label: 'Operating Company',
						required : true,
						model: 'EstimateCharacteristicsByCode.OPCO.Value',
						type: 'description',
						visible: true,
						sortOrder: 3,
						readonly: true,
					},
					{
						gid: 'assetAttributesLine',
						rid: 'EstimateCharacteristicsByCode.REGION_NM.Value',
						label: 'Transmission Region',
						model: 'EstimateCharacteristicsByCode.REGION_NM.Value',
						type: 'description',
						visible: true,
						sortOrder: 4,
						readonly: true,
					},
					// ////////// END LINE ASSET ATTRIBUTES /////////
					// /////////////BEGIN STATION///////////////////

					basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
						dataServiceName: 'estimateWizardIpsStagingStationAssetLookupDataService',
						enableCache: true,
						displayMember: 'STATION_ID',
						additionalColumns: true,
						showClearButton: true,
						filter: function (item) {
							return { fercAcct: item.EstimateCharacteristicsByCode.FERC_ACCT.Value,
								estimateId: item.EstimateId === -1 ? item.Template : item.EstimateId };
						},
						events: [{
							name: 'onSelectedItemChanged',
							handler: function (e, args) {
								if(args.selectedItem !== null) {
									args.entity.EstimateCharacteristicsByCode.STATION_ID.Value = args.selectedItem.STATION_ID;
									args.entity.EstimateCharacteristicsByCode.STATION_NM.Value = args.selectedItem.STATION_NM;
									args.entity.EstimateCharacteristicsByCode.ASST_ACCNT.ValueFk = -1;
									args.entity.EstimateCharacteristicsByCode.ASST_ID.ValueFk = args.selectedItem.Id;
									args.entity.EstimateCharacteristicsByCode.ASST_ID.Value = args.selectedItem.Id;
									args.entity.EstimateCharacteristicsByCode.ASST.Value = args.selectedItem.STATION_NM;
									args.entity.EstimateCharacteristicsByCode.FERC_ACCT.Value = args.selectedItem.FERC_ACCT;
									args.entity.EstimateCharacteristicsByCode.OPCO.Value = '';
									args.entity.EstimateCharacteristicsByCode.REGION_NM.Value = '';
									args.entity.EstimateCharacteristicsByCode.STATE_CD.Value = '';
								}
								else {
									args.entity.EstimateCharacteristicsByCode.ASST_ID.ValueFk = -1;
									args.entity.EstimateCharacteristicsByCode.STATION_ID.Value = '';
									args.entity.EstimateCharacteristicsByCode.STATION_NM.Value = '';
									args.entity.EstimateCharacteristicsByCode.ASST_ACCNT.ValueFk = -1;
									args.entity.EstimateCharacteristicsByCode.ASST.Value = '';
									args.entity.EstimateCharacteristicsByCode.FERC_ACCT.Value = '';
									args.entity.EstimateCharacteristicsByCode.OPCO.Value = '';
									args.entity.EstimateCharacteristicsByCode.REGION_NM.Value = '';
									args.entity.EstimateCharacteristicsByCode.STATE_CD.Value = '';
								}
							},
						}]
					},
					{
						gid: 'assetAttributesStation',
						rid: 'EstimateCharacteristicsByCode.ASST_ID.ValueFk',
						label: 'Asset',
						required: true,
						model: 'EstimateCharacteristicsByCode.ASST_ID.ValueFk',
						type: 'lookup',
						visible: true,
						sortOrder: 3,
						directive: 'estimate-wizard-ips-staging-lookup',
						options: {

						}
					}),
					basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
						dataServiceName: 'estimateWizardIpsStagingLookupDataService',
						enableCache: true,
						displayMember: 'FULL_BEN_LOC',
						additionalColumns: false,
						showClearButton: true,
						filter: function (item) {
							return {
								fercAcct: item.EstimateCharacteristicsByCode.FERC_ACCT.Value,
								stationId: item.EstimateCharacteristicsByCode.STATION_ID.Value,
								stationName: item.EstimateCharacteristicsByCode.STATION_NM.Value,
								state: item.EstimateCharacteristicsByCode.STATE_CD.Value
							};
						},
						events: [{
							name: 'onSelectedItemChanged',
							handler: function (e, args) {
								if (args.selectedItem !== null){
									args.entity.EstimateCharacteristicsByCode.OPCO.Value = args.selectedItem.OPCO;
									args.entity.EstimateCharacteristicsByCode.REGION_NM.Value = args.selectedItem.REGION_NM;
									args.entity.EstimateCharacteristicsByCode.ASST_ACCNT.Value = args.selectedItem.FULL_BEN_LOC;
									args.entity.EstimateCharacteristicsByCode.ASST_ACCNT.ValueFk = args.selectedItem.Id;
									args.entity.EstimateCharacteristicsByCode.FERC_ACCT.Value = args.selectedItem.FERC_ACCT;
									args.entity.EstimateCharacteristicsByCode.STATE_CD.Value = args.selectedItem.STATE_CD;
								}
								else{
									args.entity.EstimateCharacteristicsByCode.ASST_ACCNT.ValueFk = -1;
									args.entity.EstimateCharacteristicsByCode.OPCO.Value = '';
									args.entity.EstimateCharacteristicsByCode.REGION_NM.Value = '';
									args.entity.EstimateCharacteristicsByCode.STATE_CD.Value = '';
								}
							},
						}]
					},
					{
						gid: 'assetAttributesStation',
						rid: 'EstimateCharacteristicsByCode.ASST_ACCNT.ValueFk',
						label: 'Asset Accounting',
						required: true,
						model: 'EstimateCharacteristicsByCode.ASST_ACCNT.ValueFk',
						type: 'directive',
						visible: true,
						sortOrder: 3,
						directive: 'estimate-wizard-ips-staging-lookup',
					}),
					{
						gid: 'assetAttributesStation',
						rid: 'EstimateCharacteristicsByCode.OPCO.Value',
						label: 'Operating Company',
						model: 'EstimateCharacteristicsByCode.OPCO.Value',
						type: 'description',
						visible: true,
						sortOrder: 5,
						readonly: true,
					},
					{
						gid: 'assetAttributesStation',
						rid: 'EstimateCharacteristicsByCode.REGION_NM.Value',
						label: 'Transmission Region',
						model: 'EstimateCharacteristicsByCode.REGION_NM.Value',
						type: 'description',
						visible: true,
						sortOrder: 6,
						readonly: true,
					},
					{
						gid: 'assetAttributesStation',
						rid: 'EstimateCharacteristicsByCode.STATE_CD.Value',
						label: 'State',
						model: 'EstimateCharacteristicsByCode.STATE_CD.Value',
						type: 'description',
						visible: true,
						sortOrder: 7,
						readonly: true,
						// directive: 'basics-lookupdata-state-combobox',
						options: {
							// filterKey: 'CompanyFk',
							showClearButton: false
						}
					},
					{
						gid: 'assetAttributesStation',
						rid: 'EstimateCharacteristicsByCode.CIAC.Value',
						label: 'Is CIAC Applicable?',
						model: 'EstimateCharacteristicsByCode.CIAC.Value',
						type: 'boolean',
						visible: true,
						sortOrder: 8
					},
					{
						gid: 'assetAttributesStation',
						rid: 'EstimateCharacteristicsByCode.ADDER_CIAC.Value',
						// rid: 'EstimateCharacteristicsByCode.CIACTAX.Value',
						label: 'CIAC Percentage',
						model: 'EstimateCharacteristicsByCode.ADDER_CIAC.Value',
						type: 'quantity',
						visible: true,
						sortOrder: 9,
						options: {
						}
					},
					// /////////////END STATION////////////////////////////

					// /////////////BEGIN LINE//////////////////////////////////
					basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm(
						{
							dataServiceName: 'basicsCharacteristicDiscreteValueLookupForEstimateService',
							moduleQualifier: 'CharacteristicValue',
							enableCache: true,
							showClearButton: true,
							filter: function (item){
								return item.EstimateCharacteristicsByCode.CONST_TYPE.CharacteristicFk;
							},
							events: [
								{
									name: 'onSelectedItemChanged',
									handler: function(e, args) {
										if(args.selectedItem !== null) {
											args.entity.EstimateCharacteristicsByCode.CONST_TYPE.Value = args.selectedItem.DescriptionInfo;
											args.entity.EstimateCharacteristicsByCode.CONST_TYPE.ValueFk = args.selectedItem.Id;
										}
										else {
											args.entity.EstimateCharacteristicsByCode.CONST_TYPE.ValueFk = -1;
										}
									}
								}]
						},
						{
							gid: 'transmissionLineAttributes',
							rid: 'EstimateCharacteristicsByCode.CONST_TYPE.ValueFk',
							label: 'Construction Type',
							model: 'EstimateCharacteristicsByCode.CONST_TYPE.ValueFk',
							type: 'lookup',
							visible: true,
							sortOrder: 1,
							directive: 'basicsCharacteristicDiscreteValueCombobox',
							options: {
								valueMember: 'Id',
								displayMember: 'DescriptionInfo.Description',
								lookupType: 'basicsCharacteristicDataDiscreteValueLookup',

							}
						}),

					{
						gid: 'transmissionLineAttributes',
						rid: 'EstimateCharacteristicsByCode.SHLDWIRE1.Value',
						label: 'Shield Wire 1',
						required : true,
						model: 'EstimateCharacteristicsByCode.SHLDWIRE1.Value',
						type: 'description',
						visible: true,
						sortOrder: 2
					},
					{
						gid: 'transmissionLineAttributes',
						rid: 'EstimateCharacteristicsByCode.SHLDWIRE2.Value',
						label: 'Shield Wire 2',
						required : true,
						model: 'EstimateCharacteristicsByCode.SHLDWIRE2.Value',
						type: 'description',
						visible: true,
						sortOrder: 3
					},
					{
						gid: 'transmissionLineAttributes',
						rid: 'EstimateCharacteristicsByCode.WIRE_PHASE.Value',
						label: 'Conductor Wires per Phase',
						required : true,
						model: 'EstimateCharacteristicsByCode.WIRE_PHASE.Value',
						type: 'quantity',
						visible: true,
						sortOrder: 4
					},
					{
						gid: 'transmissionLineAttributes',
						rid: 'EstimateCharacteristicsByCode.TLNE_LNTH.Value',
						label: 'Line Length (Miles)',
						required : true,
						model: 'EstimateCharacteristicsByCode.TLNE_LNTH.Value',
						type: 'quantity',
						visible: true,
						sortOrder: 5
					},
					basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm(
						{
							dataServiceName: 'basicsCharacteristicDiscreteValueLookupForEstimateService',
							moduleQualifier: 'CharacteristicValue',
							enableCache: true,
							showClearButton: true,
							filter: function (item){
								return item.EstimateCharacteristicsByCode.TERR.CharacteristicFk;
							},
							events: [
								{
									name: 'onSelectedItemChanged',
									handler: function(e, args) {
										if(args.selectedItem !== null) {
											args.entity.EstimateCharacteristicsByCode.TERR.Value = args.selectedItem.DescriptionInfo;
											args.entity.EstimateCharacteristicsByCode.TERR.ValueFk = args.selectedItem.Id;
										}
										else {
											args.entity.EstimateCharacteristicsByCode.TERR.ValueFk = -1;
										}
									}
								}]
						},
						{
							gid: 'transmissionLineAttributes',
							rid: 'EstimateCharacteristicsByCode.TERR.ValueFk',
							label: 'Terrain',
							required : true,
							model: 'EstimateCharacteristicsByCode.TERR.ValueFk',
							type: 'lookup',
							visible: true,
							sortOrder: 6,
							directive: 'basicsCharacteristicDiscreteValueCombobox',
							options: {
								valueMember: 'Id',
								displayMember: 'DescriptionInfo.Description',
								lookupType: 'basicsCharacteristicDataDiscreteValueLookup',

							}
						}),
					{
						gid: 'transmissionLineAttributes',
						rid: 'EstimateCharacteristicsByCode.ROW_WIDTH.Value',
						label: 'Right of Way Width (Feet)',
						model: 'EstimateCharacteristicsByCode.ROW_WIDTH.Value',
						type: 'quantity',
						visible: true,
						sortOrder: 7
					},
					basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm(
						{
							dataServiceName: 'basicsCharacteristicDiscreteValueLookupForEstimateService',
							moduleQualifier: 'CharacteristicValue',
							enableCache: true,
							showClearButton: true,
							filter: function (item){
								return item.EstimateCharacteristicsByCode.CNDCTR_TYP.CharacteristicFk;
							},
							events: [
								{
									name: 'onSelectedItemChanged',
									handler: function(e, args) {
										if(args.selectedItem !== null) {
											args.entity.EstimateCharacteristicsByCode.CNDCTR_TYP.Value = args.selectedItem.DescriptionInfo;
											args.entity.EstimateCharacteristicsByCode.CNDCTR_TYP.ValueFk = args.selectedItem.Id;
										}
										else {
											args.entity.EstimateCharacteristicsByCode.CNDCTR_TYP.ValueFk = -1;
										}
									}
								}]
						},
						{
							gid: 'transmissionLineAttributes',
							rid: 'EstimateCharacteristicsByCode.CNDCTR_TYP.ValueFk',
							label: 'Conductor Type',
							model: 'EstimateCharacteristicsByCode.CNDCTR_TYP.ValueFk',
							type: 'lookup',
							visible: true,
							sortOrder: 7,
							directive: 'basicsCharacteristicDiscreteValueCombobox',
							options: {
								valueMember: 'Id',
								displayMember: 'DescriptionInfo.Description',
								lookupType: 'basicsCharacteristicDataDiscreteValueLookup',

							}
						}),
					{
						gid: 'transmissionLineAttributes',
						rid: 'EstimateCharacteristicsByCode.BNDLCNDCTR.Value',
						label: 'Is Bundled Conductor',
						model: 'EstimateCharacteristicsByCode.BNDLCNDCTR.Value',
						type: 'boolean',
						checked: false,
						disabled: false,
						visible: true,
						sortOrder: 8
					},
					{
						gid: 'transmissionLineAttributes',
						rid: 'EstimateCharacteristicsByCode.NUM_CIRC.Value',
						label: 'Number of Circuits',
						model: 'EstimateCharacteristicsByCode.NUM_CIRC.Value',
						type: 'quantity',
						visible: true,
						sortOrder: 9
					},
					{
						gid: 'transmissionLineAttributes',
						rid: 'EstimateCharacteristicsByCode.CIAC.Value',
						label: 'Is CIAC Applicable?',
						model: 'EstimateCharacteristicsByCode.CIAC.Value',
						type: 'boolean',
						visible: true,
						sortOrder: 10
					},
					{
						gid: 'transmissionLineAttributes',
						rid: 'EstimateCharacteristicsByCode.ADDER_CIAC.Value',
						label: 'CIAC Percentage',
						model: 'EstimateCharacteristicsByCode.ADDER_CIAC.Value',
						type: 'quantity',
						visible: true,
						sortOrder: 12,
					},

				]
			};

			service.getFormConfig = function() {
				return angular.copy(formConfig);
			};

			return service;
		}
	]);
})();
