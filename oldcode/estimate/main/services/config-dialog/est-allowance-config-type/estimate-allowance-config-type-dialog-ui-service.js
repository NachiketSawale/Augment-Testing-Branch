
(function () {
	'use strict';

	angular.module('estimate.main').factory('estimateAllowanceConfigTypeDialogUIService',
		['platformTranslateService', 'basicsLookupdataConfigGenerator','basicsLookupdataLookupFilterService',
			function (platformTranslateService, basicsLookupdataConfigGenerator,basicsLookupdataLookupFilterService) {

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

				function getBaseFormConfig(){
					return {
						showGrouping: true,
						change: 'change',
						addValidationAutomatically: true,
						groups: [
							{
								gid: 'basicGroup',
								header: 'Allowance Assignment',
								header$tr$: 'estimate.main.allowanceConfig',
								isOpen: true,
								visible: true,
								sortOrder: 1,
								attributes: []
							}
						],
						rows: [
							{
								gid: 'basicGroup',
								rid: 'descriptioninfo',
								label: 'Description',
								label$tr$: 'estimate.main.allowanceConfigTypeDesc',
								model: 'DescriptionInfo',
								sortOrder: 2,
								readonly: false,
								type: 'translation',
								width: 300
							},
							{
								gid: 'basicGroup',
								rid: 'estAllowanceConfigDesc',
								label: 'Description',
								label$tr$: 'cloud.common.entityDescription',
								model: 'EstAllowanceConfigDesc',
								sortOrder: 2,
								readonly: false,
								type: 'translation',
								width: 300
							},
							basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm ('basics.customize.masterdatacontext', 'Description',
								{
									gid: 'basicGroup',
									rid: 'MasterContextFk',
									model: 'MasterdataContextFk',
									sortOrder: 3,
									label: 'Masterdata Context',
									label$tr$: 'estimate.main.masterContextFk',
									type: 'integer',
									required: true
								}),

							{
								gid: 'basicGroup',
								rid: 'allowanceAssignmentDetails',
								label: 'Allowance Assignment Config Details',
								label$tr$: 'estimate.main.allowanceAssignmentDetails',
								type: 'directive',
								model: 'allowanceAssignmentDetails',
								directive:'estimate-allowance-assignment-grid',
								readonly: false,
								maxlength:5000,
								rows:20,
								sortOrder: 4
							},
							{
								gid: 'basicGroup',
								rid: 'useInCompanyDetails',
								label: 'Used In Company',
								label$tr$: 'basics.costcodes.company',
								type: 'directive',
								model: 'costCodeAssignment',
								directive:'estimate-mdc-allowance-company',
								readonly: true,
								sortOrder: 5
							},
						]
					};
				}

				service.getFormConfig = function() {
					let formConfig = getBaseFormConfig();
					platformTranslateService.translateFormConfig(formConfig);
					return formConfig;
				};

				return service;
			}

		]);

})();
