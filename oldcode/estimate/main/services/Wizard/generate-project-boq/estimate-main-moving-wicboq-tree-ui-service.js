/**
 * Created by wul on 12/18/2018.
 */

(function () {
	'use strict';
	let moduleName = 'estimate.main';

	/**
     * @ngdoc service
     * @name estimateMainMovingWicboqTreeUiService
     * @function
     *
     * @description
     *
     */
	angular.module(moduleName).factory('estimateMainMovingWicboqTreeUiService',
		['basicsLookupdataConfigGenerator', 'platformTranslateService', '$translate',
			function (basicsLookupdataConfigGenerator, platformTranslateService, $translate) {

				let service = {};

				let gridColumns = [
					{ id: 'refOrig', field: 'OriginalRefNo', name: 'WIC BoQ Ref No.',  width:100, toolTip: 'Reference', formatter: 'description', name$tr$: 'estimate.main.generateProjectBoQsWizard.structureRefNo'},
					{ id: 'ref', field: 'Reference', name: 'To Project BoQ Ref No.',  width:120, toolTip: 'Reference', name$tr$: 'estimate.main.generateProjectBoQsWizard.toPrjBooRefNo',
						formatter: function(row, cell, value, columnDef, entity){
							if(entity.MatchRefNo){
								return '<span style="color:green" title="'+ $translate.instant('estimate.main.generateProjectBoQsWizard.matchedPrjBoqRefNo') +'">' + entity.Reference + '</span>';
							}else{
								return '<span>' + entity.Reference + '</span>';
							}
						}
					},
					{ id: 'ref2', field: 'Reference2', name: 'To Project BoQ Ref No.2', width: 125, toolTip: 'Reference2', formatter: 'description', name$tr$: 'estimate.main.generateProjectBoQsWizard.toPrjBoqRefNo2'}
				];

				platformTranslateService.translateGridConfig(gridColumns);

				service.getStandardConfigForListView = function () {
					return {
						columns: gridColumns
					};
				};

				return service;
			}
		]);
})(angular);
