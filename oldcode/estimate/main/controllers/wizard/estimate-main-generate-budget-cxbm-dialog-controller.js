/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	/* global _ */
	'use strict';
	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainGenerateBudgetCXBMFormConfig', ['$injector', 'basicsLookupdataConfigGenerator', 'basicsLookupdataLookupDescriptorService',
		function($injector, basicsLookupdataConfigGenerator, lookupDescriptorService) {

			let service = {};
			service.formConfiguration = {
				'fid': 'estimate.main.wizard.generateBudgetCXBM',
				'version': '1.1.0',
				'showGrouping': false,
				'title$tr$': '',
				'skipPermissionCheck': true,
				'change': 'change',
				'groups': [
					{
						'gid': 'GenerateBudget',
						'header$tr$': 'estimate.main.bidCreationWizard.basic',
						'isOpen': true,
						'visible': true,
						'sortOrder': 1
					}
				],
				'rows': [
					basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm(
						'basics.customize.externalsource',
						'Description',
						{
							gid: 'GenerateBudget',
							rid: 'ExternalSourceFk',
							model: 'ExternalSourceFk',
							label: 'External Source',
							label$tr$: 'basics.customize.externalsource',
							sortOrder: 0
						},
						false,
						{
							filterKey: 'externalSourceFilter',
							required: true,
							showClearButton: false,
							events: [
								{
									name: 'onSelectedItemChanged', // register event and event handler here.
									handler: function (e, args) {
										lookupDescriptorService.removeData('EstimatesFromCXBM');
										let selectedItem = args.selectedItem;
										let externalSources = args.entity.ExternalSources;
										let externalSource = _.find(externalSources, {Id: selectedItem.Id});
										$injector.get('estimateMainGenerateBudgetCXBMDialogService').setExternalConfigId(externalSource.ExternalconfigFk);
									}
								}
							]
						}
					),
					{
						gid: 'GenerateBudget',
						rid: 'EstimateId',
						label$tr$: 'estimate.main.generateBudgetCXBMWizard.cxbmEstimate',
						type: 'directive',
						model: 'EstimateId',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective:'estimate-wizard-generate-cxbm-lookup',
							descriptionMember: 'EstimateDes',
							lookupType: 'EstimatesFromCXBM',
							lookupOptions: {
								showClearButton: false
							}
						},
						required : true
					},
					{
						gid: 'GenerateBudget',
						rid: 'StructureId',
						label$tr$: 'estimate.main.StructureId',
						type: 'directive',
						model: 'StructureId',
						directive: 'estimate-wizard-generate-structure-lookup',
						options: {
							displayMember: 'Desc',
							showClearButton: true,
							events: [
								{
									name: 'onSelectedItemChanged', // register event and event handler here.
									handler: function (e, args) {
										let selectedItem = args.selectedItem;
										let currentItem = args.entity;
										currentItem.RootItemId = selectedItem ? selectedItem.RootItemId : null;
										currentItem.StructureName = selectedItem ? selectedItem.StructureName : '';
										currentItem.StructureId = selectedItem ? selectedItem.EstStructureId : null;
									}
								}
							]
						}
					},
					{
						rid: 'BoqWicCatFk',
						gid: 'GenerateBudget',
						label$tr$: 'boq.main.wicGroup',
						model: 'BoqWicCatFk',
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'estimate-main-est-wic-group-lookup',
							descriptionMember: 'DescriptionInfo.Translated',
							lookupOptions: {
								showClearButton: true
							}
						}
					},
					{
						rid: 'WicBoqItemFk',
						gid: 'GenerateBudget',
						label$tr$: 'boq.main.boqHeaderSel',
						model: 'WicBoqItemFk',
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'basics-lookup-data-by-custom-data-service',
							descriptionMember: 'Description',
							lookupOptions: {
								dataServiceName: 'boqHeaderLookupDataService',
								valueMember: 'Id',
								displayMember: 'BoqNumber',
								filter: function (entity) {
								// using master data filter for the wic group lookup
									let filterIds = $injector.get('estimateProjectRateBookConfigDataService').getFilterIds(3);
									let boqMainBoqTypes = $injector.get('boqMainBoqTypes');
									return {
										boqType: boqMainBoqTypes.wic,
										boqGroupId: entity.BoqWicCatFk,
										projectId: 0,
										prcStructureId: 0,
										boqFilterWicGroupIds: filterIds
									};
								},
								disableDataCaching: true,
								filterOnSearchIsFixed: true,
								isClientSearch: true,
								columns: [
									{
										id: 'BoqNumber',
										field: 'BoqNumber',
										name: 'BoqNumber',
										formatter: 'code',
										name$tr$: 'boq.main.boqNumber'
									},
									{
										id: 'Description',
										field: 'Description',
										name: 'Description',
										formatter: 'description',
										name$tr$: 'cloud.common.entityDescription'
									}
								],
								events: [
									{
										name: 'onSelectedItemChanged', // register event and event handler here.
										handler: function (e, args) {
											let selectedItem = args.selectedItem;
											let currentItem = args.entity;
											currentItem.RootItemId = selectedItem ? selectedItem.BoqHeaderFk : null;
											currentItem.StructureName = selectedItem ? 'Boq' : '';
											currentItem.StructureId = selectedItem ? $injector.get('estimateMainParamStructureConstant').BoQs : null;
										}
									}
								],
								popupOptions: {
									width: 350
								},
								lookupModuleQualifier: 'boqHeaderLookupDataService',
								lookupType: 'boqHeaderLookupDataService',
								showClearButton: true
							}
						}
					},
					{
						gid: 'GenerateBudget',
						rid: 'scope',
						model: 'GenerateBudgetScope',
						type: 'radio',
						label: 'Generate Line item from',
						label$tr$: 'estimate.main.generateBudgetCXBMWizard.generateLineItem',
						options: {
							valueMember: 'value',
							labelMember: 'label',
							items: [
								{
									value: 1,
									label: 'Generate Line Items from Leading Structure',
									label$tr$: 'estimate.main.generateItemFromLeadingStructure'
								},
								{
									value: 0,
									label: 'Generate Line Items from Related Assemblies',
									label$tr$: 'estimate.main.generateBudgetCXBMWizard.generateLineItemFromAssembly'
								}]
						}
					},
					{
						gid: 'GenerateBudget',
						rid: 'scopeOption',
						model: 'GenerateBudgetScopeOption',
						type: 'radio',
						label: 'Transfer Benchmark result to',
						label$tr$: 'estimate.main.generateBudgetCXBMWizard.benchmarkResultWith',
						options: {
							valueMember: 'value',
							labelMember: 'label',
							items: [
								{
									value: 0,
									label: 'Transfer Benchmark result to Budget',
									label$tr$: 'estimate.main.generateBudgetCXBMWizard.toBudget'
								},
								{
									value: 1,
									label: 'Transfer Benchmark result to Cost',
									label$tr$: 'estimate.main.generateBudgetCXBMWizard.toCost'
								}]
						}
					},
					{
						rid: 'MdcCostCodeFk',
						gid: 'GenerateBudget',
						label: 'Cost Code',
						label$tr$: 'estimate.main.CostCode',
						model: 'MdcCostCodeFk',
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'basics-cost-codes-lookup',
							descriptionMember: 'DescriptionInfo.Translated',
							lookupOptions: {
								showClearButton: true
							}
						},
						required : true
					}
				]
			};

			service.getFormConfiguration = function getFormConfiguration() {
				return service.formConfiguration;
			};

			return service;
		}]);

	/**
	 * @ngdoc controller
	 * @name estimateMainGenerateBudgetCXBMDialogController
	 * @requires $scope
	 * @description
	 * #
	 * estimateMainGenerateBudgetCXBMDialogController
	 */
	/* jshint -W072 */
	angular.module(moduleName).controller('estimateMainGenerateBudgetCXBMDialogController', [
		'$scope', '$translate', '$injector', 'platformTranslateService', 'platformModalService', 'platformRuntimeDataService', 'estimateMainGenerateBudgetCXBMFormConfig',
		'estimateMainGenerateBudgetCXBMDialogService', 'basicsLookupdataLookupFilterService',
		function ($scope, $translate, $injector, platformTranslateService, platformModalService, platformRuntimeDataService, formConfig,
			estimateMainGenerateBudgetCXBMDialogService, basicsLookupdataLookupFilterService) {

			let filters = [
				{
					key: 'externalSourceFilter',
					serverSide: false,
					fn: function boqTypeFilter(dataItem) {
						let existItems = _.filter($scope.options.currentItem.ExternalSources, {Id: dataItem.Id});


						return existItems && existItems.length > 0;
					}
				}
			];

			basicsLookupdataLookupFilterService.registerFilter(filters);

			$scope.options = $scope.$parent.modalOptions;
			$scope.isOkDisabled = true;

			// init current item.
			$scope.currentItem = {
				GenerateBudgetScope: 1,
				ExternalSourceFk: $scope.options.currentItem.ExternalSources[0].Id,
				ExternalSources: $scope.options.currentItem.ExternalSources,
				GenerateBudgetScopeOption: 0
			};

			estimateMainGenerateBudgetCXBMDialogService.setExternalConfigId($scope.options.currentItem.ExternalSources[0].ExternalconfigFk);

			$scope.modalOptions = {
				headerText: $scope.options.headerText,
				closeButtonText: $translate.instant('basics.common.cancel'),
				actionButtonText: $translate.instant('basics.common.ok')
			};

			// get basic row setting from options
			$scope.options.formRows = $scope.options.formRows || [];

			let cxbmformConfig = angular.copy(formConfig.getFormConfiguration());

			// translate form config.
			platformTranslateService.translateFormConfig(cxbmformConfig);

			$scope.formContainerOptions = {
				statusInfo: function () {
				}
			};

			$scope.formContainerOptions.formOptions = {
				configure: cxbmformConfig,
				showButtons: [],
				validationMethod: function () {
				}
			};

			// init the wic boq and mdc cost code as readonly
			platformRuntimeDataService.readonly($scope.currentItem, [{field: 'WicBoqItemFk', readonly: true}, {field: 'MdcCostCodeFk', readonly: true}]);

			$scope.setTools = function (tools) {
				$scope.tools = tools;
			};

			$scope.change = function change(item, model) {
				let fields = [];
				// set the row to readonly
				if(model === 'StructureId' && item[model]){
					fields.push({field: 'BoqWicCatFk', readonly: true});
					fields.push({field: 'WicBoqItemFk', readonly: true});
					fields.push({field: 'GenerateBudgetScope', readonly: true});
					$scope.currentItem.GenerateBudgetScope = 2;
				}
				else  if(model === 'StructureId' && !item[model]){
					fields.push({field: 'BoqWicCatFk', readonly: false});
					fields.push({field: 'WicBoqItemFk', readonly: true});
					fields.push({field: 'GenerateBudgetScope', readonly: false});
					$scope.currentItem.GenerateBudgetScope = $scope.currentItem.GenerateBudgetScope === 0 ? 0 : 1;
				}
				else if(model === 'BoqWicCatFk' && item[model]){
					fields.push({field: 'StructureId', readonly: true});
					fields.push({field: 'WicBoqItemFk', readonly: false});
					item.WicBoqItemFk = null;
				}
				else if((model === 'BoqWicCatFk' && !item[model])){
					fields.push({field: 'StructureId', readonly: false});
					fields.push({field: 'WicBoqItemFk', readonly: true});
					item.WicBoqItemFk = null;
				}
				else if(model === 'GenerateBudgetScope') {
					fields.push({field: 'GenerateBudgetScopeOption', readonly: item[model] === 0});
					fields.push({field: 'MdcCostCodeFk', readonly: true});
					item.MdcCostCodeFk = null;
					if(item[model] === 0){
						$scope.currentItem.GenerateBudgetScopeOption = 2;
					}
					else{
						$scope.currentItem.GenerateBudgetScopeOption = 0;
					}
				}
				else if(model === 'GenerateBudgetScopeOption'){
					fields.push({field: 'MdcCostCodeFk', readonly: item.GenerateBudgetScopeOption === 0});
					if(item.GenerateBudgetScopeOption === 0) {
						item.MdcCostCodeFk = null;
					}
				}

				if(fields.length > 0){
					platformRuntimeDataService.readonly(item, fields);
				}

				// set the ok button disable
				if(item.EstimateId && (item.StructureId || (item.BoqWicCatFk && item.WicBoqItemFk)) &&
					(item.GenerateBudgetScopeOption === 0 || item.GenerateBudgetScopeOption === 2 || (item.GenerateBudgetScopeOption === 1 && item.MdcCostCodeFk))){
					$scope.isOkDisabled = false;
				}
				else {
					$scope.isOkDisabled = true;
				}
			};

			$scope.modalOptions.ok = function onOK() {
				estimateMainGenerateBudgetCXBMDialogService.generateLiFromLS($scope.currentItem);
				$scope.$close(false);
			};

			$scope.modalOptions.close = function onCancel() {
				$scope.$close(false);
			};

			$scope.modalOptions.cancel = function () {
				$scope.$close(false);
			};

			$scope.$on('$destroy', function () {
				$injector.get('estimateWizardGenerateSourceLookupService').setIsCXBM(false);
				basicsLookupdataLookupFilterService.unregisterFilter(filters);
			});
		}
	]);
})(angular);
