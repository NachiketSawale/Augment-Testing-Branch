/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	let modulename = 'estimate.main';

	/**
     * @ngdoc service
     * @name estimateMainCopySourceCopyOptionsDialogConfigService
     * @description configuration to show dialog for Copy Options on during Estimate source Copy.
     */
	angular.module(modulename).service('estimateMainCopySourceCopyOptionsDialogConfigService', ['$translate',
		function ($translate) {
			let service = {
				getFormConfig : getFormConfig
			};
			return service;

			function getFormConfig() {
				return {
					showGrouping: true,
					overloads: {},
					skipPermissionCheck: true,
					change : 'change',
					groups: [
						{
							gid: 'copyResourceTo',
							header: 'Copy Resource To',
							header$tr$: 'estimate.main.copyResourceTo',
							isOpen: true,
							visible: true,
							sortOrder: 1
						},
						{
							gid: 'copyLineItems',
							header: 'Copy LineItems',
							header$tr$: 'estimate.main.copyLineItems',
							isOpen: true,
							visible: true,
							sortOrder: 2
						},
						{
							gid: 'copyLeadingStructures',
							header: 'Copy Leading Structures',
							header$tr$: 'estimate.main.copyLeadingStructures',
							isOpen: true,
							visible: true,
							sortOrder: 3
						},
						{
							gid: 'copyResources',
							header: 'Copy Resources',
							header$tr$: 'estimate.main.copyResources',
							isOpen: true,
							visible: true,
							sortOrder: 4
						}
					],
					rows: [
						{
							gid: 'copyResourceTo',
							rid: 'selectEstimateScope',
							model: 'CopyResourcesTo',
							type: 'radio',
							label: 'Select Estimate Scope',
							label$tr$:'estimate.main.updateMaterialPackageWizard.selectEstimateScope',
							options: {
								labelMember: 'Description',
								valueMember: 'Value',
								groupName: 'copyResourceTo',
								items: [
									{
										Id: 1,
										Description: $translate.instant('estimate.main.createBoqPackageWizard.selectScopeSource.scope.Highlighted'),
										Value: 2
									},
									{
										Id: 2,
										Description: $translate.instant('estimate.main.createBoqPackageWizard.selectScopeSource.scope.resultSet'),
										Value: 1
									},
									{
										Id: 3,
										Description: $translate.instant('estimate.main.createBoqPackageWizard.selectScopeSource.scope.allEstimate'),
										Value: 0
									}]
							},
							sortOrder: 1
						},
						{
							rid:'quantity',
							gid:'copyLineItems',
							label:'Quantity',
							label$tr$: 'estimate.main.quantity',
							type:'boolean',
							model:'LiQuantity',
							sortOrder: 1
						},
						{
							rid:'allQuantityFactors',
							gid:'copyLineItems',
							label:'All Quantity Factors',
							label$tr$: 'estimate.main.allQuantityFactors',
							type:'boolean',
							model:'LiQuantityFactors',
							sortOrder: 2
						},
						{
							rid:'allCostFactors',
							gid:'copyLineItems',
							label:'All Cost Factors',
							label$tr$: 'estimate.main.allCostFactors',
							type:'boolean',
							model:'LiCostFactors',
							sortOrder: 3
						},
						{
							rid:'budget',
							gid:'copyLineItems',
							label:'Budget',
							label$tr$: 'estimate.main.budget',
							type:'boolean',
							model:'LiBudget',
							sortOrder: 4
						},
						{
							rid:'resources',
							gid:'copyLineItems',
							label:'Resources',
							label$tr$: 'estimate.main.resources',
							type:'boolean',
							model:'LiResources',
							sortOrder: 5
						},
						{
							rid:'packageItemAssignment',
							gid:'copyLineItems',
							label:'Package Item Assignment',
							label$tr$: 'estimate.main.packageItemAssignment',
							type:'boolean',
							model:'LiPackageItemAssignment',
							sortOrder: 6
						},
						{
							rid:'characteristics',
							gid:'copyLineItems',
							label:'Characteristics',
							label$tr$: 'estimate.main.characteristics',
							type:'boolean',
							model:'LiCharacteristics',
							sortOrder: 7
						},
						{
							rid:'boqs',
							gid:'copyLeadingStructures',
							label:'BoQs',
							label$tr$: 'estimate.main.boqContainer',
							type:'boolean',
							model:'LiBoq',
							sortOrder: 1
						},
						{
							rid:'activities',
							gid:'copyLeadingStructures',
							label:'Activities',
							label$tr$: 'estimate.main.activityContainer',
							type:'boolean',
							model:'LiActivity',
							sortOrder: 2
						},
						{
							rid:'controllingUnits',
							gid:'copyLeadingStructures',
							label:'Controlling Units',
							label$tr$: 'estimate.main.mdcControllingUnitFk',
							type:'boolean',
							model:'LiControllingUnit',
							sortOrder: 3
						},
						{
							rid:'costGroups',
							gid:'copyLeadingStructures',
							label:'Cost Groups',
							label$tr$: 'estimate.main.CostGroupContainer',
							type:'boolean',
							model:'LiCostGroup',
							sortOrder: 4
						},
						{
							rid:'projectCostGroups',
							gid:'copyLeadingStructures',
							label:'Project Cost Groups',
							label$tr$: 'estimate.main.CostGrouptitle1',
							type:'boolean',
							model:'LiPrjCostGroup',
							sortOrder: 5
						},
						{
							rid:'procurementStructure',
							gid:'copyLeadingStructures',
							label:'Procurement Structure',
							label$tr$: 'estimate.main.ProcurementStructure',
							type:'boolean',
							model:'LiProcurementStructure',
							sortOrder: 6
						},
						{
							rid:'locations',
							gid:'copyLeadingStructures',
							label:'Locations',
							label$tr$: 'estimate.main.locationContainer',
							type:'boolean',
							model:'LiLocation',
							sortOrder: 7
						},
						{
							rid:'wicboq',
							gid:'copyLeadingStructures',
							label:'WIC BoQs',
							label$tr$: 'estimate.main.lookupAssignWicItem',
							type:'boolean',
							model:'LiWicBoq',
							sortOrder: 8
						},
						{
							rid:'quantity',
							gid:'copyResources',
							label:'Quantity',
							label$tr$: 'estimate.main.quantity',
							type:'boolean',
							model:'ResQuantity',
							sortOrder: 1
						},
						{
							rid:'allQuantityFactors',
							gid:'copyResources',
							label:'All Quantity Factors',
							label$tr$: 'estimate.main.allQuantityFactors',
							type:'boolean',
							model:'ResQuantityFactors',
							sortOrder: 2
						},
						{
							rid:'allCostFactors',
							gid:'copyResources',
							label:'All Cost Factors',
							label$tr$: 'estimate.main.allCostFactors',
							type:'boolean',
							model:'ResCostFactors',
							sortOrder: 3
						},
						{
							rid:'costUnit',
							gid:'copyResources',
							label:'Cost Unit',
							label$tr$: 'estimate.main.costUnit',
							type:'boolean',
							model:'ResCostUnit',
							sortOrder: 4
						},
						{
							rid:'packageItemAssignment',
							gid:'copyResources',
							label:'Package Item Assignment',
							label$tr$: 'estimate.main.packageItemAssignment',
							type:'boolean',
							model:'ResPackageItemAssignment',
							sortOrder: 5
						},
						{
							rid:'characteristics',
							gid:'copyResources',
							label:'Characteristics',
							label$tr$: 'estimate.main.characteristics',
							type:'boolean',
							model:'ResCharacteristics',
							sortOrder: 6
						}
					]
				};
			}
		}
	]);
})();
