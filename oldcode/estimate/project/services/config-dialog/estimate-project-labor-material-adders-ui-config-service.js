/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	let modulename = 'estimate.project';

	/**
	 * @ngdoc estimateProjectLaborMaterialAddersUIConfigService
	 * @name estimateProjectLaborMaterialAddersUIConfigService
	 * @description
	 * This is the configuration service for the Labor Material Adders wizard portion.
	 */
	angular.module(modulename).factory('estimateProjectLaborMaterialAddersUIConfigService', [ function () {
		let service = {};
		let formConfig = {
			name: 'laborMaterialAdders',
			fid:'estimate.project.createEstimateModal',
			version:'0.0.1',
			showGrouping: true,
			groups: [
				{
					gid: 'override',
					header: 'Override Entries',
					isOpen: true,
					visible:true,
					sortOrder: 1
				},
				/* {
						gid: 'projectSize',
					  	header: 'Project Size',
					   	isOpen: true,
						visible:true,
						sortOrder: 2
					}, */
				{
					gid: 'laborOnly',
					header: 'Labor Only Adders by %',
					isOpen: true,
					visible:true,
					sortOrder: 3
				},
				{
					gid: 'materialOnly',
					header: 'Material Only Adders by %',
					isOpen: true,
					visible:true,
					sortOrder: 4
				},
				{
					gid: 'contingencyAdders',
					header: 'Contingency Adders by %',
					isOpen: true,
					visible:true,
					sortOrder: 5
				},
				{
					gid: 'otherAdders',
					header: 'Other Adder by %',
					isOpen: true,
					visible:true,
					sortOrder: 6
				},
				{
					gid: 'nonPercentageAdders',
					header: 'Non-Percentage Adders (as % of Total Cost)',
					isOpen: true,
					visible:true,
					sortOrder: 7
				},
			],
			rows: [
				{
					gid: 'override',
					rid: 'EstimateCharacteristicsByCode.SKP_CUST_TOT.Value',
					label: 'Override:',
					model: 'EstimateCharacteristicsByCode.SKP_CUST_TOT.Value',
					type: 'boolean',
					visible: true,
					sortOrder: 1,
				},
				{
					gid: 'laborOnly',
					rid: 'EstimateCharacteristicsByCode.ADDER_NONPRO.Value',
					// label$tr$: 'cloud.common.entityDescription',
					label: 'Non-Productive:',
					model: 'EstimateCharacteristicsByCode.ADDER_NONPRO.Value',
					type: 'quantity',
					visible: true,
					sortOrder: 2
				},
				{
					gid: 'laborOnly',
					rid: 'EstimateCharacteristicsByCode.ADDER_TRANSP.Value',
					// label$tr$: 'cloud.common.entityDescription',
					label: 'Transportation (Fleet):',
					model: 'EstimateCharacteristicsByCode.ADDER_TRANSP.Value',
					type: 'quantity',
					visible: true,
					sortOrder: 3
				},
				{
					gid: 'laborOnly',
					rid: 'EstimateCharacteristicsByCode.ADDER_SHDSVC.Value',
					// label$tr$: 'cloud.common.entityDescription',
					label: 'Shared Services:',
					model: 'EstimateCharacteristicsByCode.ADDER_SHDSVC.Value',
					type: 'quantity',
					visible: true,
					sortOrder: 4
				},
				{
					gid: 'laborOnly',
					rid: 'EstimateCharacteristicsByCode.ADDER_INC.Value',
					// label$tr$: 'cloud.common.entityDescription',
					label: 'Incentive:',
					model: 'EstimateCharacteristicsByCode.ADDER_INC.Value',
					type: 'quantity',
					visible: true,
					sortOrder: 5
				},
				{
					gid: 'laborOnly',
					rid: 'EstimateCharacteristicsByCode.ADDER_FRINGE.Value',
					// label$tr$: 'cloud.common.entityDescription',
					label: 'Fringe:',
					model: 'EstimateCharacteristicsByCode.ADDER_FRINGE.Value',
					type: 'quantity',
					visible: true,
					sortOrder: 6
				},
				{
					gid: 'laborOnly',
					rid: 'EstimateCharacteristicsByCode.ADDER_GA.Value',
					// label$tr$: 'cloud.common.entityDescription',
					label: 'General & Administrative (O&M):',
					model: 'EstimateCharacteristicsByCode.ADDER_GA.Value',
					type: 'quantity',
					visible: true,
					sortOrder: 7
				},
				{
					gid: 'materialOnly',
					rid: 'EstimateCharacteristicsByCode.ADDER_STAX.Value',
					// label$tr$: 'cloud.common.entityDescription',
					label: 'Sales Tax:',
					model: 'EstimateCharacteristicsByCode.ADDER_STAX.Value',
					type: 'quantity',
					visible: true,
					sortOrder: 8
				},
				{
					gid: 'materialOnly',
					rid: 'EstimateCharacteristicsByCode.ADDER_STORE.Value',
					// label$tr$: 'cloud.common.entityDescription',
					label: 'Stores Loading:',
					model: 'EstimateCharacteristicsByCode.ADDER_STORE.Value',
					type: 'quantity',
					visible: true,
					sortOrder: 9
				},
				{
					gid: 'contingencyAdders',
					rid: 'EstimateCharacteristicsByCode.ADDER_ENGR.Value',
					// label$tr$: 'cloud.common.entityDescription',
					label: 'Engineering Contingency:',
					model: 'EstimateCharacteristicsByCode.ADDER_ENGR.Value',
					type: 'quantity',
					visible: true,
					sortOrder: 10
				},
				{
					gid: 'contingencyAdders',
					rid: 'EstimateCharacteristicsByCode.ADDER_MATL.Value',
					// label$tr$: 'cloud.common.entityDescription',
					label: 'Material Contingency:',
					model: 'EstimateCharacteristicsByCode.ADDER_MATL.Value',
					type: 'quantity',
					visible: true,
					sortOrder: 11
				},
				{
					gid: 'contingencyAdders',
					rid: 'EstimateCharacteristicsByCode.ADDER_CONS.Value',
					// label$tr$: 'cloud.common.entityDescription',
					label: 'Construction Contingency:',
					model: 'EstimateCharacteristicsByCode.ADDER_CONS.Value',
					type: 'quantity',
					visible: true,
					sortOrder: 12
				},
				{
					gid: 'otherAdders',
					rid: 'EstimateCharacteristicsByCode.ADDER_CONOH.Value',
					// label$tr$: 'cloud.common.entityDescription',
					label: 'Construction OH:',
					model: 'EstimateCharacteristicsByCode.ADDER_CONOH.Value',
					type: 'quantity',
					visible: true,
					sortOrder: 13
				},
				{
					gid: 'otherAdders',
					rid: 'EstimateCharacteristicsByCode.ADDER_DCONOH.Value',
					// label$tr$: 'cloud.common.entityDescription',
					label: 'Construction OH (Dist):',
					model: 'EstimateCharacteristicsByCode.ADDER_DCONOH.Value',
					type: 'quantity',
					visible: true,
					sortOrder: 14
				},
				{
					gid: 'otherAdders',
					rid: 'EstimateCharacteristicsByCode.ADDER_AFUDC.Value',
					// label$tr$: 'cloud.common.entityDescription',
					label: 'AFUDC:',
					model: 'EstimateCharacteristicsByCode.ADDER_AFUDC.Value',
					type: 'quantity',
					visible: true,
					sortOrder: 15
				},
				/* {
						gid: 'otherAdders',
						rid: 'EstimateCharacteristicsByCode.ADDER_CIAC.Value',
						//label$tr$: 'cloud.common.entityDescription',
						label: 'CIAC Tax:',
						model: 'EstimateCharacteristicsByCode.ADDER_CIAC.Value',
						type: 'quantity',
						visible: true,
						sortOrder: 16
					}, */
				{
					gid: 'nonPercentageAdders',
					rid: 'Escalation',
					// label$tr$: 'cloud.common.entityDescription',
					label: 'Escalation:',
					model: 'Escalation',
					type: 'quantity',
					readonly: true,
					visible: true,
					sortOrder: 17
				},
				{
					gid: 'nonPercentageAdders',
					rid: 'RiskBasedContingency',
					// label$tr$: 'cloud.common.entityDescription',
					label: 'Risk-Based Contingency:',
					model: 'RiskBasedContingency',
					type: 'quantity',
					visible: true,
					readonly: true,
					sortOrder: 18
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
