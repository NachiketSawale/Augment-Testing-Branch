/**
 * Created by clv on 10/23/2017.
 */
(function(angular) {

	'use strict';
	var moduleName = 'procurement.package';
	angular.module(moduleName).factory('packageItemAssignmentLayout', packageItemAssignmentLayout);
	function packageItemAssignmentLayout() {

		var addColumns = [{
			id: 'Description',
			field: 'DescriptionInfo',
			name: 'Description',
			width: 300,
			formatter: 'translation',
			name$tr$: 'cloud.common.entityDescription'
		},{
			id: 'EstLineItemExternalCode',
			field: 'ExternalCode',
			name: 'ExternalCode',
			width: 300,
			formatter: 'description',
			name$tr$: 'boq.main.ExternalCode',
			readonly: true
		}];

		return {
			fid: 'procurement.package.itemAssignment.detail',
			version: '1.1.0',
			showGrouping: true,
			addValidationAutomatically: true,
			groups: [
				{
					gid: 'basicData',
					attributes: ['estheaderfk', 'estlineitemfk', 'estresourcefk', 'prcitemfk', 'boqheaderreference', 'boqitemfk','iscontracted','prcitemassignmentfk']
				},
				{
					gid: 'entityHistory',
					isHistory: true
				}
			],
			transaltionInfos: {},
			overloads: {
				'estheaderfk': {
					'grid': {
						'editor': 'lookup',
						'editorOptions': {
							'directive': 'estimate-main-document-project-lookup',
							'filterKey': 'package-item-assignment-est-header-filter',
							'lookupOptions': {
								'filterKey': 'package-item-assignment-est-header-filter',
								'additionalColumns': true,
								'displayMember': 'Code',
								'addGridColumns': addColumns
							}
						},
						'formatter': 'lookup',
						'formatterOptions': {
							'lookupType': 'EstimateMainHeader',
							'displayMember': 'Code'
						}
					},
					'detail': {
						'type': 'directive',
						'directive': 'basics-lookupdata-lookup-composite',
						'options': {
							lookupDirective: 'estimate-main-document-project-lookup',
							descriptionMember: 'DescriptionInfo.Translated',
							lookupOptions: {
								filterKey: 'package-item-assignment-est-header-filter'
							}
						}
					}
				},
				'estlineitemfk': {
					'grid': {
						editor: 'lookup',
						editorOptions: {
							directive: 'estimate-main-est-line-item-lookup-dialog',
							lookupOptions: {
								filterKey: 'package-item-assignment-est-lineitem-filter',
								'additionalColumns': true,
								'displayMember': 'Code',
								'addGridColumns': addColumns
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'estlineitemlookup',
							displayMember: 'Code'
						}
					},
					'detail': {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'estimate-main-est-line-item-lookup-dialog',
							descriptionMember: 'DescriptionInfo.Translated',
							lookupOptions: {
								filterKey: 'package-item-assignment-est-lineitem-filter'
							}
						}
					}
				},
				'boqitemfk': {
					'grid': {
						'editor': 'lookup',
						'editorOptions': {
							directive: 'procurement-package-boq-dialog',
							showClearButton: true,
							lookupOptions: {
								additionalColumns: true,
								'displayMember': 'Reference',
								addGridColumns: [
									{
										id: 'brief',
										field: 'BriefInfo',
										name: 'Brief',
										width: 120,
										toolTip: 'Brief',
										formatter: 'translation',
										name$tr$: 'estimate.main.briefInfo'
									}
								]
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'packageboqitems',
							displayMember: 'Reference',
							dataServiceName: 'procurementPackageBoqLookupService'
						}
					},
					'detail': {
						'type': 'directive',
						'directive': 'basics-lookupdata-lookup-composite',
						'options': {
							lookupDirective: 'procurement-package-boq-dialog',
							descriptionMember: 'BriefInfo.Translated',
							'eagerLoad': true
						}
					}
				},
				'estresourcefk': {
					'grid': {
						'editor': 'directive',
						'editorOptions': {
							directive: 'package-resource-for-item-assignment-lookup',
							'filterKey': 'package-item-assignment-est-resource-filter',
							showClearButton: true,
							lookupOptions: {
								'additionalColumns': true,
								'displayMember': 'Code',
								'addGridColumns': [{
									id: 'Description',
									field: 'DescriptionInfo',
									name: 'Description',
									width: 300,
									formatter: 'translation',
									name$tr$: 'cloud.common.entityDescription'
								},{
									id: 'budgetunit',
									field: 'BudgetUnit',
									name: 'Budget Unit',
									width: 200,
									formatter: 'money',
									name$tr$: 'estimate.main.budgetUnit'
								},{
									id: 'budget',
									field: 'Budget',
									name: 'Budget',
									formatter: 'money',
									width: 200,
									name$tr$: 'estimate.main.budget'
								}]
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'estresource4itemassignment',
							displayMember: 'Code'
						}
					},
					'detail': {
						'type': 'directive',
						'directive': 'basics-lookupdata-lookup-composite',
						'options': {
							lookupDirective: 'package-resource-for-item-assignment-lookup',
							descriptionMember: 'DescriptionInfo.Translated',
							lookupOptions: {
								showClearButton: true,
								filterKey: 'package-item-assignment-est-resource-filter'
							}
						}
					}
				},
				prcitemfk: {
					grid: {
						editor: 'lookup',
						editorOptions: {
							directive: 'prc-common-item-material-lookup-dialog',
							filterKey: 'prc-item-assignment-item-filter',
							lookupOptions: {
								filterKey: 'prc-item-assignment-item-filter',
								showClearButton: true,
								additionalColumns: true,
								displayMember: 'MaterialCode',
								addGridColumns: [
									{
										id: 'materialdesc',
										field: 'MaterialDescription',
										name: 'Material Description',
										width: 200,
										name$tr$: 'procurement.common.warranty.description'
									},
									{ id: 'itemNo', field: 'Itemno', name: 'Item no', name$tr$: 'procurement.common.prcItemItemNo' },
									{
										id: 'prcitemdesc',
										field: 'PrcItemDescription',
										name: 'Prc Item Description',
										width: 200,
										name$tr$: 'procurement.common.prcItemDescription'
									}
								]
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'PrcItem',
							displayMember: 'MaterialCode'
						},
						width: 100
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'prc-common-item-material-lookup-dialog',
							descriptionMember: 'MaterialDescription',
							lookupOptions: {
								showClearButton: true,
								filterKey: 'prc-item-assignment-item-filter'
							}
						}
					}
				}
			}
		};
	}

	angular.module(moduleName).factory('packageItemAssignmentUIStandardService', packageItemAssignmentUIStandardService);
	packageItemAssignmentUIStandardService.$inject = ['platformUIStandardConfigService', 'platformSchemaService',
		'packageItemAssignmentLayout', 'procurementPackageTranslationService'];
	function packageItemAssignmentUIStandardService(platformUIStandardConfigService, platformSchemaService,
		packageItemAssignmentLayout, procurementPackageTranslationService) {
		var BaseService = platformUIStandardConfigService;
		var domainSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'PrcItemAssignmentDto',
			moduleSubModule: 'Procurement.Common'
		});
		if (domainSchema) {
			domainSchema = domainSchema.properties;
		}

		return new BaseService(packageItemAssignmentLayout, domainSchema, procurementPackageTranslationService);
	}
})(angular);