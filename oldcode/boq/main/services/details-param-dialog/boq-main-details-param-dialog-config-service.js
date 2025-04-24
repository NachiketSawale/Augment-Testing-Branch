/**
 * Created by zos on 3/14/2018.
 */

(function () {
	/* global _ */
	'use strict';

	var modulename = 'boq.main';

	/**
	 * @ngdoc service
	 * @name boqMainDetailsParamDialogConfigService
	 * @description configuration to show dialog for detail formula parameters with values and parameter assignment on selected level.
	 */
	angular.module(modulename).service('boqMainDetailsParamDialogConfigService', ['$translate', 'estimateMainParamStructureConstant',
		function ($translate, estimateMainParamStructureConstant) {
			var service = {
				getFormConfig: createAndGetFormConfig

			};
			return service;

			function getFormConfig(isNavFromBoqWic) {

				var items = [
					{Id: estimateMainParamStructureConstant.BoQs, Description: $translate.instant('estimate.main.paramLevelElementLevel'), Value: estimateMainParamStructureConstant.BoQs},  // BoQ
					{Id: estimateMainParamStructureConstant.Project, Description: $translate.instant('estimate.main.paramLevelProjectLevel'), Value: estimateMainParamStructureConstant.Project} // project
				];

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
							type: 'directive', model: 'detailsParamItems', directive: 'boq-main-details-param-dialog',
							readonly: false, maxlength: 5000, rows: 20, visible: true, sortOrder: 1
						},

						{
							rid: 'assignedTo',
							gid: 'paramAssignLevel',
							label: 'Parameters Assigned To',
							label$tr$: 'estimate.main.paramLevelTo',
							type: 'radio',
							model: 'selectedLevel',
							options: {
								labelMember: 'Description',
								valueMember: 'Value',
								groupName: 'ruleParamOutputConfig',
								items: isNavFromBoqWic ? _.filter(items, {Id: 1}) : items,
								sortOrder: 1
							}
						},

						{
							rid: 'assignRemember',
							gid: 'paramAssignLevel',
							label: 'Automatically Assign',
							label$tr$: 'estimate.main.saveParamLevelSelected',
							type: 'boolean',
							model: 'doRememberSelect',
							checked: false,
							readonly: false,
							disabled: false,
							visible: true,
							sortOrder: 2
						}
					]
				};
			}

			function createAndGetFormConfig(isNavFromBoqWic, isFormula) {
				var config = getFormConfig(isNavFromBoqWic, isFormula);
				if (isFormula) {
					config.groups[1].visible = false;
				}
				return config;
			}
		}
	]);

})();
