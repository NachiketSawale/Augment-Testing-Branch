/**
 * Created by wul on 4/17/2018.
 */
(function () {
	'use strict';
	let moduleName = 'estimate.main';

	/**
     * @ngdoc service
     * @name estimateMainWicboqToPrjboqCompareUiForBoqService
     * @function
     *
     * @description
     *
     */
	angular.module(moduleName).factory('estimateMainWicboqToPrjboqCompareUiForBoqService',
		['basicsLookupdataConfigGenerator', 'platformTranslateService',
			function (basicsLookupdataConfigGenerator, platformTranslateService) {

				let service = {};

				let gridColumns = [
					{ id: 'pref', field: 'Reference', name: 'Project BoQ Ref No.', width:100, toolTip: 'Reference', formatter: 'description', name$tr$: 'estimate.main.generateProjectBoQsWizard.prjBoqRefNo'},
					{ id: 'pref2', field: 'Reference2', name: 'Project BoQ Ref No.2', width: 120, toolTip: 'Reference2', formatter: 'description', name$tr$: 'estimate.main.generateProjectBoQsWizard.prjBoqRefNo2'},
					{ id: 'pbrief', field: 'BriefInfo', name: 'Brief', width: 120, toolTip: 'Brief', formatter: 'translation', name$tr$: 'boq.main.BriefInfo'},
					{ id: 'pqtyuom', field: 'BasUomFk', name: 'BasUomFk', width: 60, toolTip: 'QuantityUoM', name$tr$: 'cloud.common.entityUoM', formatter: 'lookup',
						formatterOptions: {
							lookupType: 'uom',
							displayMember: 'Unit'
						}},
				];

				platformTranslateService.translateGridConfig(gridColumns);

				service.getStandardConfigForListView = function () {
					return {
						addValidationAutomatically: false,
						columns: gridColumns
					};
				};

				return service;
			}
		]);
})(angular);
