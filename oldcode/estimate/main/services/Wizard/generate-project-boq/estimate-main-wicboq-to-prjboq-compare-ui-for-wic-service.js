/**
 * Created by wul on 4/17/2018.
 */
(function () {
	'use strict';
	let moduleName = 'estimate.main';

	/**
     * @ngdoc service
     * @name estimateMainWicboqToPrjboqCompareUiForWicService
     * @function
     *
     * @description
     *
     */
	angular.module(moduleName).factory('estimateMainWicboqToPrjboqCompareUiForWicService',
		['basicsLookupdataConfigGenerator', 'platformTranslateService', '$translate',
			function (basicsLookupdataConfigGenerator, platformTranslateService, $translate) {

				let service = {};

				let gridColumns = [
					{ id: 'refOrig', field: 'OriginalRefNo', name: 'WIC BoQ Ref No.',  width:100, toolTip: 'Reference', formatter: 'description', name$tr$: 'estimate.main.generateProjectBoQsWizard.structureRefNo'},
					{ id: 'ref', field: 'Reference', name: 'To Project BoQ Ref No.',  width:120, toolTip: 'Reference', name$tr$: 'estimate.main.generateProjectBoQsWizard.toPrjBooRefNo',
						editor:'directive',
						editorOptions: {
							directive: 'estimate-main-wicboq-to-prjboq-moveboq'
						},
						formatter: function(row, cell, value, columnDef, entity){
							let html;
							if(entity.MatchRefNo){
								html = '<span style="color:green" title="'+ $translate.instant('estimate.main.generateProjectBoQsWizard.matchedPrjBoqRefNo') +'">' + entity.Reference + '</span>';
							}else{
								html = '<span>' + entity.Reference + '</span>';
							}

							let error = entity.__rt$data && entity.__rt$data.errors && entity.__rt$data.errors[columnDef.field];
							if(!error){
								return html;
							}

							if (error.error$tr$) {
								platformTranslateService.translateObject(error, 'error');
							}

							return '<div class="invalid-cell" title="' + error.error + '">' + html + '</div>';
						}
					},
					{ id: 'ref2', field: 'Reference2', name: 'To Project BoQ Ref No.2', editor:'description', width: 125, toolTip: 'Reference2', formatter: 'description', name$tr$: 'estimate.main.generateProjectBoQsWizard.toPrjBoqRefNo2'},
					{ id: 'brief', field: 'BriefInfo', name: 'Brief', editor:'description', width: 120, toolTip: 'Brief', formatter: 'translation', name$tr$: 'boq.main.BriefInfo', 'maxLength': 255},
					{ id: 'qtyuom', field: 'BasUomFk', name: 'BasUomFk', width: 60, toolTip: 'QuantityUoM', name$tr$: 'cloud.common.entityUoM', formatter: 'lookup',
						formatterOptions: {
							lookupType: 'uom',
							displayMember: 'Unit'
						}},
					{ id: 'matchRef', field: 'MatchRefNo', name: 'Match Code', width: 100, toolTip: 'MatchRefNo', formatter: 'description', name$tr$: 'estimate.main.generateProjectBoQsWizard.matchCode'}
				];

				platformTranslateService.translateGridConfig(gridColumns);

				service.getStandardConfigForListView = function () {
					return {
						addValidationAutomatically: true,
						columns: gridColumns
					};
				};

				return service;
			}
		]);
})(angular);
