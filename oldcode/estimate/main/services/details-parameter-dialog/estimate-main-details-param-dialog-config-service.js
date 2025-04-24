/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	let modulename = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainDetailsParamDialogConfigService
	 * @description configuration to show dialog for detail formula parameters with values and parameter assignment on selected level.
	 */
	angular.module(modulename).service('estimateMainDetailsParamDialogConfigService', [ '$translate','$injector','estimateMainParamStructureConstant',
		function ($translate,$injector,estimateMainParamStructureConstant) {
			return {
				getFormConfig: createAndGetFormConfig

			};

			function getFormConfig(currentStructureId) {

				let items=[
					{Id: $injector.get('estimateMainDetailsParamDialogService').getLeadingStructureId(), Description: $translate.instant('estimate.main.paramLevelElementLevel'), Value :$injector.get('estimateMainDetailsParamDialogService').getLeadingStructureId()},
					{Id:  estimateMainParamStructureConstant.EstHeader, Description: $translate.instant('estimate.main.paramLevelEstimateRootLevel'), Value : estimateMainParamStructureConstant.EstHeader},
					{Id:  estimateMainParamStructureConstant.Project, Description: $translate.instant('estimate.main.paramLevelProjectLevel'), Value : estimateMainParamStructureConstant.Project}
				];

				if(currentStructureId  === estimateMainParamStructureConstant.EstHeader){
					items.splice(1, 1);
				}
				if(currentStructureId === estimateMainParamStructureConstant.LineItem && $injector.get('projectAssemblyMainService').IsActived){
					items.splice(1);
				}
				if(currentStructureId === estimateMainParamStructureConstant.AssemblyCategoryStructure && $injector.get('projectAssemblyStructureService').IsActived){
					items.splice(1);
				}

				return {
					showGrouping: true,
					change: 'change',
					overloads: {},
					skipPermissionCheck: true,
					groups: [
						{
							gid: 'paramValues',
							header: 'Parameters',
							header$tr$: 'estimate.main.detailParamDialogHeader',
							isOpen: true,
							visible: true,
							sortOrder: 1
						},
						{
							gid: 'paramAssignLevel',
							header: 'Create Parameters',
							header$tr$: 'estimate.main.paramLevelDialogHeader',
							isOpen: true,
							visible: true,
							sortOrder: 2
						}
					],
					rows: [
						{
							gid: 'paramValues', rid: 'paramItems', label: 'Details Formula Parameters', label$tr$: 'estimate.main.detailsFormulaParams',
							type: 'directive', model: 'detailsParamItems', directive:'estimate-main-details-param-dialog',
							readonly: false, maxlength : 5000, rows:20, visible: true, sortOrder: 1
						},

						{
							rid:'assignedTo',
							gid:'paramAssignLevel',
							label:'Parameters Assigned To',
							label$tr$: 'estimate.main.paramLevelTo',
							type:'radio',
							model:'selectedLevel',
							options : {
								labelMember: 'Description',
								valueMember: 'Value',
								groupName:'ruleParamOutputConfig',
								items: items,
							},
							sortOrder: 1
						},

						{
							rid:'assignRemember',
							gid:'paramAssignLevel',
							label:'Automatically Assign',
							label$tr$: 'estimate.main.saveParamLevelSelected',
							type:'boolean',
							model:'doRememberSelect',
							checked:false,
							readonly: false,
							disabled:false,
							visible: true,
							sortOrder: 2
						}
					]
				};
			}

			function createAndGetFormConfig(currentStructureId){
				return getFormConfig(currentStructureId);
			}
		}
	]);

})();
