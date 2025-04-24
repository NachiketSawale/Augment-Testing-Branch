/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	let modulename = 'estimate.project';

	/**
	 * @ngdoc service
	 * @name estimateMainEstTypeDialogConfigService
	 * @description configuration to show dialog for EstimateType selection during Estimate Deep Copy.
	 */
	angular.module(modulename).service('estimateProjectEstTypeDialogConfigService', [
		function () {
			let service = {
				getFormConfig : getFormConfig

			};
			return service;

			function getFormConfig(displaySetAqQuantity) {
				return {
					showGrouping: true,
					overloads: {},
					skipPermissionCheck: true,
					change : 'change',
					groups: [
						{
							gid: 'estTypes',
							header: 'Type',
							header$tr$: 'estimate.project.typeDialogText',
							isOpen: true,
							visible: true,
							sortOrder: 1
						},
						{
							gid: 'estUpdate',
							header: 'Update Estimate',
							header$tr$: 'estimate.project.updateEstimate',
							isOpen: true,
							visible: true,
							sortOrder: 2
						},
						{
							gid: 'setAqQuantity',
							header: 'Set AQ = 0 for Optional as long as not ‘awarded alternative item’',
							header$tr$: 'estimate.project.setAqQuantity',
							isOpen: true,
							visible: displaySetAqQuantity,
							sortOrder: 3
						},
						{
							gid: 'estBudget',
							header: 'Budget',
							header$tr$: 'estimate.project.estBudgetDialogText',
							isOpen: true,
							visible: true,
							sortOrder: 4
						},
						{
							gid: 'itemAssignment',
							header: 'Item Assignment',
							header$tr$: 'estimate.project.itemAssignment',
							isOpen: true,
							visible: true,
							sortOrder: 5
						}
					],
					rows: [
						{
							rid:'actualType',
							gid:'estTypes',
							label:'Actual Estimate Type',
							label$tr$: 'estimate.project.actualEstType',
							type:'directive',
							model:'actualEstType',
							directive: 'estimate-project-est-type-combobox',
							sortOrder: 1
						},
						{
							rid:'newType',
							gid:'estTypes',
							label:'New Estimate Type',
							label$tr$: 'estimate.project.newEstType',
							type:'directive',
							model:'newEstType',
							directive: 'estimate-project-est-type-combobox',
							sortOrder: 2,
							options:{
								filterKey: 'estimate-project-est-type-filter'
							}
						},
						{
							rid:'copyCostTotal2Budget',
							gid:'estBudget',
							label:'Copy Cost Total to Budget',
							label$tr$: 'estimate.project.copyCostTotalToBudget',
							type:'boolean',
							model:'IsCopyCostTotalToBudget',
							sortOrder: 1
						},
						{
							rid:'copyBudget',
							gid:'estBudget',
							label:'Copy Budget',
							label$tr$: 'estimate.project.copyBudget',
							type:'boolean',
							model:'IsCopyBudget',
							sortOrder: 2
						},
						{
							rid:'updStrBudget',
							gid:'estBudget',
							label:'Update Controlling Structure Budget',
							label$tr$: 'estimate.project.updateBudget',
							type:'boolean',
							model:'IsUpdStrBudget',
							sortOrder: 3
						},
						{
							rid:'copyBaseCost',
							gid:'estBudget',
							label:'Copy Cost to Base Cost',
							label$tr$: 'estimate.project.copyBaseCost',
							type:'boolean',
							model:'IsCopyBaseCost',
							sortOrder: 4
						},
						{
							rid:'calcRuleParam',
							gid:'estUpdate',
							label:'Calculate Rule/Parameter',
							label$tr$: 'estimate.main.calculateRuleParam',
							type:'boolean',
							model:'calcRuleParam',
							sortOrder: 1
						},
						{
							rid:'setUnitPrice',
							gid:'estUpdate',
							label:'Set Fixed Price flag',
							label$tr$: 'estimate.main.setFixUnitPrice',
							type:'boolean',
							model:'SetFixUnitPrice',
							sortOrder: 2
						},
						{
							rid:'deleteItemAssignment',
							gid:'itemAssignment',
							label:'Delete Item Assignments of Source Estimate',
							label$tr$: 'estimate.project.deleteItemAssignment',
							type:'boolean',
							model:'IsDeleteItemAssignment',
							sortOrder: 1
						},
						{
							rid:'optionalWithIT',
							gid:'setAqQuantity',
							label:'Optional With IT',
							label$tr$: 'estimate.project.optionalWithIT',
							type:'boolean',
							model:'clearAqQuantityOfOptionalWithIT',
							sortOrder: 1
						},
						{
							rid:'optionalWithoutIT',
							gid:'setAqQuantity',
							label:'Optional Without IT',
							label$tr$: 'estimate.project.optionalWithoutIT',
							type:'boolean',
							model:'clearAqQuantityOfOptionalWithoutIT',
							sortOrder: 2
						},
					]
				};
			}

		}
	]);

})();
