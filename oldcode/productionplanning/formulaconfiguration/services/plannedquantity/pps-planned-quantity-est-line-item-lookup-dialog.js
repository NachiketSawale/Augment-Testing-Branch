(function (angular) {
	'use strict';

	/**
	 * @ngdoc directive
	 * @name pps-planned-quantity-est-line-item-lookup-dialog
	 * @description
	 */

	const moduleName = 'productionplanning.formulaconfiguration';

	angular.module(moduleName).directive('ppsPlannedQuantityEstLineItemLookupDialog', ppsPlannedQuantityEstLineItemLookupDialog);
	ppsPlannedQuantityEstLineItemLookupDialog.$inject = ['$injector', 'LookupFilterDialogDefinition', 'ppsPlannedQuantityEstLineItemLookupDialogDataService'];

	function ppsPlannedQuantityEstLineItemLookupDialog($injector, LookupFilterDialogDefinition, ppsPlannedQuantityEstLineItemLookupDialogDataService) {
		const formSettings = {
			fid: 'pps.plannedQuantity.estLineItem.selectionFilter',
			version: '1.0.0',
			showGrouping: false,
			groups: [{
				gid: 'selectionfilter',
				isOpen: true,
				visible: true,
				sortOrder: 1,
			}],
			rows: [{
				gid: 'selectionfilter',
				rid: 'estimateHeaderFk',
				label: 'Estimate Header',
				label$tr$: 'cloud.common.estimateHeaderGridControllerTitle',
				model: 'EstHeaderFk',
				required: true,
				sortOrder: 1,
				type: 'directive',
				directive: 'basics-lookupdata-lookup-composite',
				options: {
					lookupDirective: 'estimate-main-document-project-lookup',
					descriptionMember: 'DescriptionInfo.Translated',
					lookupOptions: {
						filterOptions: {
							serverSide: true,
							serverKey: 'package-item-assignment-est-header-filter',
							fn: function () {
								const selectedParent = $injector.get('productionplanningHeaderDataService').getSelected();
								return { projectId: selectedParent.ProjectFk };
							},
						},
					},
				},
			}]
		};

		const gridSettings = {
			layoutOptions: {
				translationServiceName: 'estimateMainTranslationService',
				uiStandardServiceName: 'packageEstimateLineitemUIStandardService',
				schemas: [{ typeName: 'EstLineItemDto', moduleSubModule: 'Estimate.Main' }],
			},
		};

		const lookupOptions = {
			uuid: 'e76482f7ee1d4d8a80e2fa4ab84d84d5',
			title: 'productionplanning.formulaconfiguration.plannedQuantity.estLineItemSearchDialogTitle',
			lookupType: 'estlineitemlookup',
			valueMember: 'Id',
			displayMember: 'Code',
			version: 3,
			pageOptions: { enabled: true, size: 100 },
			filterOptions: {
				serverSide: true,
				serverKey: 'package-item-assignment-est-lineitem-filter',
				fn: function () {
					const filterParams = ppsPlannedQuantityEstLineItemLookupDialogDataService.getFilterParams();
					return { estHeaderId: filterParams.EstHeaderFk };
				},
			},
		};

		return new LookupFilterDialogDefinition(lookupOptions, ppsPlannedQuantityEstLineItemLookupDialogDataService, formSettings, gridSettings);
	}
})(angular);
