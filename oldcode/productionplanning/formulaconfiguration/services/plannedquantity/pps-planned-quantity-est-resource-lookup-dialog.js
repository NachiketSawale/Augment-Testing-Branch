(function (angular) {
	'use strict';
	/* global globals */
	/**
	 * @ngdoc directive
	 * @name pps-planned-quantity-est-resource-lookup-dialog
	 * @description
	 */

	const moduleName = 'productionplanning.formulaconfiguration';

	angular.module(moduleName).directive('ppsPlannedQuantityEstResourceLookupDialog', ppsPlannedQuantityResourceItemLookupDialog);
	ppsPlannedQuantityResourceItemLookupDialog.$inject = ['$injector', 'platformRuntimeDataService', 'LookupFilterDialogDefinition', 'ppsPlannedQuantityEstResourceLookupDialogDataService'];

	function ppsPlannedQuantityResourceItemLookupDialog($injector, platformRuntimeDataService, LookupFilterDialogDefinition, ppsPlannedQuantityEstResourceLookupDialogDataService) {
		const formSettings = {
			fid: 'pps.plannedQuantity.estResource.selectionFilter',
			version: '1.0.0',
			showGrouping: false,
			change: function (entity, model, row) {
				if (model === 'EstHeaderFk') {
					entity.EstLineItemFk = null;
					ppsPlannedQuantityEstResourceLookupDialogDataService.clearSelectionFilter();
				}
			},
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
				validator: function(entity, value) {
					platformRuntimeDataService.readonly(entity, [{field: 'EstLineItemFk', readonly: !value}]);
				},
			}, {
				gid: 'selectionfilter',
				rid: 'estimateLineItemFk',
				label: 'Estimate Line Item',
				label$tr$: 'cloud.common.estimateLineItemGridContainerTitle',
				model: 'EstLineItemFk',
				required: true,
				sortOrder: 2,
				type: 'directive',
				directive: 'basics-lookupdata-lookup-composite',
				options: {
					lookupDirective: 'estimate-main-est-line-item-lookup-dialog',
					descriptionMember: 'DescriptionInfo.Translated',
					lookupOptions: {
						filterOptions: {
							serverSide: true,
							serverKey: 'package-item-assignment-est-lineitem-filter',
							fn: function (entity) {
								return { estHeaderId: entity.EstHeaderFk };
							},
						},
					},
				},
			}]
		};

		const gridSettings = {
			layoutOptions: {
				translationServiceName: 'estimateMainTranslationService',
				uiStandardServiceName: 'packageEstimateResourceUIStandardService',
				schemas: [{ typeName: 'EstResourceDto', moduleSubModule: 'Estimate.Main' }],
			},
		};

		const lookupOptions = {
			uuid: '130ce965b8694db9890e5becddc4fc2b',
			title: 'productionplanning.formulaconfiguration.plannedQuantity.estResourceSearchDialogTitle',
			lookupType: 'estresource4itemassignment',
			valueMember: 'Id',
			displayMember: 'Code',
			version: 2,
			filterOptions: {
				serverSide: true,
				serverKey: 'package-item-assignment-est-resource-filter',
				fn: function () {
					const filterParams = ppsPlannedQuantityEstResourceLookupDialogDataService.getFilterParams();
					return {
						estHeaderFk: filterParams.EstHeaderFk,
						estLineItemFk: filterParams.EstLineItemFk,
						notIncludedResourceIds: [],
					};
				},
			},
			dialogOptions: {
				templateUrl: globals.appBaseUrl + 'basics.lookupdata/partials/lookup-filter-dialog-form-grid.html',
				controller: 'ppsPlannedQuantityEstResourceLookupDialogController',
			}
		};

		return new LookupFilterDialogDefinition(lookupOptions, ppsPlannedQuantityEstResourceLookupDialogDataService, formSettings, gridSettings);
	}
})(angular);
