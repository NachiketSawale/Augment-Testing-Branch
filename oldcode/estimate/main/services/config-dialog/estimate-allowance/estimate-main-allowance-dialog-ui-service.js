
(function () {
	'use strict';

	angular.module('estimate.main').factory('estimateMainAllowanceDialogUIService',
		['platformTranslateService', 'basicsLookupdataConfigGenerator','basicsLookupdataLookupFilterService','$injector',
			function (platformTranslateService, basicsLookupdataConfigGenerator,basicsLookupdataLookupFilterService,$injector) {

				let service = {};

				let filters = [
					{
						key: 'AllowanceFilter',
						serverSide: false,
						fn: function (dataItem) {
							return dataItem.Id ===1 || dataItem.Id ===3;
						}
					}
				];
				basicsLookupdataLookupFilterService.registerFilter(filters);

				function getBaseFormConfig(isAddArea){
					let formConfiguration = {
						showGrouping: true,
						change: 'change',
						addValidationAutomatically: true,
						groups: [
							{
								gid: 'basicGroup',
								header: 'Basic Settings',
								header$tr$: 'estimate.main.bidCreationWizard.basic',
								isOpen: true,
								visible: true,
								sortOrder: 1,
								attributes: []
							},
							{
								gid: 'costCodeAssignment',
								header: 'Cost Code Details',
								header$tr$: 'estimate.main.costCodeDetails',
								isOpen: true,
								visible: true,
								sortOrder: 3,
								attributes: []
							},
							{
								gid: 'useInCompany',
								header: 'Used In Company',
								header$tr$: 'basics.costcodes.company',
								isOpen: true,
								visible: true,
								sortOrder: 4,
								attributes: []
							}
						],
						rows: [
							{
								gid: 'basicGroup',
								label: 'Code',
								label$tr$: 'estimate.main.estimateCode',
								rid: 'Code',
								model: 'Code',
								sortOrder: 1,
								type: 'code',
								domain: 'code',
							},
							{
								gid: 'basicGroup',
								rid: 'descriptioninfo',
								label: 'Description',
								label$tr$: 'cloud.common.entityDescription',
								model: 'DescriptionInfo',
								sortOrder: 2,
								readonly: false,
								type: 'translation',
								width: 300
							},
							basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm ('basics.customize.masterdatacontext', 'Description',
								{
									gid: 'basicGroup',
									rid: 'MasterContextFk',
									model: 'MasterContextFk',
									sortOrder: 3,
									label: 'Masterdata Context',
									label$tr$: 'estimate.main.masterContextFk',
									type: 'integer',
									required: true
								}),
							basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm ('basics.customize.allowancetype', 'Description',
								{
									gid: 'basicGroup',
									rid: 'AllowanceTypeFk',
									model: 'AllowanceTypeFk',
									sortOrder: 4,
									label: 'Allowance Type',
									label$tr$: 'estimate.main.allowance',
									type: 'integer',
									change: function (entity) {
										let areaVisiable = entity.AllowanceTypeFk === 3;
										entity.AllAreaGroupTypeFk = areaVisiable ? 1 : null;
										$injector.get('estimateAllowanceDialogDataService').afterChangeAllowanceTypeFk.fire(areaVisiable);
									},
									required: true
								}),
							basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm ('basics.customize.markupcalculationtype', 'Description',
								{
									gid: 'basicGroup',
									rid: 'MarkupCalcTypeFk',
									model: 'MarkupCalcTypeFk',
									sortOrder: 5,
									label: 'Markup Calculation Type',
									label$tr$: 'estimate.main.mdcMarkupCalcType',
									type: 'integer',
									required: true
								}),
							{
								gid: 'basicGroup',
								rid: 'IsOneStep',
								label: 'Single step Allowance',
								label$tr$: 'estimate.main.singleStep',
								type: 'boolean',
								model: 'IsOneStep',
								visible: true,
								sortOrder: 6
							},
							{
								gid: 'basicGroup',
								rid: 'IsBalanceFP',
								label: 'Level out differences from FP items',
								label$tr$: 'estimate.main.isBalanceFP',
								type: 'boolean',
								model: 'IsBalanceFP',
								visible: true,
								sortOrder: 7
							},
							basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm ('basics.customize.quantitytype', 'Code',
								{
									gid: 'basicGroup',
									rid: 'QuantityTypeFk',
									model: 'QuantityTypeFk',
									sortOrder: 8,
									label: 'DCM based on WQ/AQ Quantity',
									label$tr$: 'estimate.main.dcmQuantity',
									type: 'integer',
									required: true
								},
								false,
								{
									filterKey: 'AllowanceFilter',
									showClearButton: false
								}),
							{
								gid: 'basicGroup',
								rid: 'MarkupGa',
								model: 'MarkupGa',
								sortOrder: 9,
								label: 'G&A[%]',
								label$tr$: 'estimate.main.markupGA',
								type: 'money',
								domain: 'amount'
							},{
								gid: 'basicGroup',
								rid: 'MarkupAm',
								model: 'MarkupAm',
								sortOrder: 10,
								label: 'AM[%]',
								label$tr$: 'estimate.main.MarkupAM',
								type: 'money',
								domain: 'amount'
							},{
								gid: 'basicGroup',
								rid: 'MarkupRp',
								model: 'MarkupRp',
								sortOrder: 11,
								label: 'R&P[%]',
								label$tr$: 'estimate.main.MarkupRP',
								type: 'money',
								domain: 'amount'
							},
							{
								gid: 'allowanceArea',
								rid: 'Area',
								type: 'directive',
								model: 'allowanceArea',
								required: true,
								'directive': 'estimate-allowance-area',
								sortOrder: 14
							},
							{
								gid: 'costCodeAssignment',
								rid: 'costCodeDetails',
								type: 'directive',
								model: 'costCodeAssignment',
								required: true,
								'directive': 'estimate-allowance-markup2-cost-code-assignment-grid',
								sortOrder: 15
							},
							{
								gid: 'useInCompany',
								rid: 'useInCompanyDetails',
								type: 'directive',
								model: 'costCodeAssignment',
								'directive': 'estimate-mdc-allowance-company',
								sortOrder: 16
							}
						],
						overloads: {},
						skipPermissionCheck: true
					};

					if(isAddArea){
						formConfiguration.groups.push(
							{
								gid: 'allowanceArea',
								header: 'Allowance Areas & GC Areas',
								header$tr$: 'estimate.main.allowanceArea',
								isOpen: true,
								visible: true,
								sortOrder: 2,
								attributes: []
							});

						formConfiguration.rows.push(
							basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm ('basics.customize.allareagrouptype', 'Code',
								{
									gid: 'basicGroup',
									rid: 'AllAreaGroupTypeFk',
									model: 'AllAreaGroupTypeFk',
									sortOrder: 7,
									label: 'Areawise',
									label$tr$: 'estimate.main.areaWise',
									type: 'integer',
								})
						);
					}

					return formConfiguration;
				}

				service.getFormConfig = function(isAddArea) {
					let formConfig = getBaseFormConfig(isAddArea);
					platformTranslateService.translateFormConfig(formConfig);
					return formConfig;
				};

				return service;
			}

		]);

})();
