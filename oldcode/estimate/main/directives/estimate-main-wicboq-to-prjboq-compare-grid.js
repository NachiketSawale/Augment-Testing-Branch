/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	/* global globals */
	'use strict';

	let moduleName = 'estimate.main';

	/**
     * @ngdoc directive
     * @name estimateMainReplacedFieldsGrid
     * @restrict A
     * @description
     */
	angular.module(moduleName).directive('estimateMainWicboqToPrjboqCompareGrid', function () {
		return {
			restrict: 'A',
			// templateUrl: 'estimate-main-replace-resource-fields-grid.html'
			templateUrl: globals.appBaseUrl + 'estimate.main/templates/wizard/generate-project-boq/estimate-main-wicboq-to-prjboq-compare-grid.html'
		};
	});

})(angular);



/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {

	'use strict';

	let moduleName = 'estimate.main';

	/**
     * @ngdoc directive
     * @name estimateMainWicboqToPrjboqCompareCondition
     * @restrict A
     * @description
     */
	angular.module(moduleName).directive('estimateMainWicboqToPrjboqCompareCondition', ['estimateMainWicboqToPrjboqCompareDataForWicService','$translate',
		function (estimateMainWicboqToPrjboqCompareDataForWicService, $translate) {
			return {
				restrict: 'A',
				template: '<div class="radio spaceToUp pull-left margin-left-ld"><label for="compareType-1" style="padding-right: 10px"><input type="radio" ng-model="compType" name="compareType" id="compareType-1" ng-value="1" ng-click ="compTypeChange(1)" > '+ $translate.instant('estimate.main.generateProjectBoQsWizard.ref') +'</label>' +
					'</div><div class="radio spaceToUp pull-left margin-left-ld"><label for="compareType-2" style="padding-right: 30px"><input type="radio" ng-model="compType" name="compareType" id="compareType-2" ng-value="2" style="" ng-click ="compTypeChange(2)">'+ $translate.instant('estimate.main.generateProjectBoQsWizard.ref2') +'</label>' +
					'</div><div class="radio spaceToUp pull-left margin-left-ld"><label for="CompareWithUom" style="padding-right: 30px"><input type="checkbox" ng-model="compUom" data-domain="boolean" id="CompareWithUom" ng-click ="compUomChange()">'+ $translate.instant('estimate.main.generateProjectBoQsWizard.compareUom') +'</label>' +
					'</div><div class="radio spaceToUp pull-left margin-left-ld"><label for="CompateWithOutSp"><input type="checkbox" ng-model="compOutSp" data-domain="boolean" id="CompateWithOutSp" ng-click ="compOutSpChange()">'+ $translate.instant('estimate.main.generateProjectBoQsWizard.compareOutlienSpe') +'</label></div>',
				link:function(scope) {
					scope.compType = scope.entity.CompareType;
					scope.compUom = scope.entity.CompareWithUom;
					scope.compOutSp = scope.entity.CompateWithOutSp;

					scope.compTypeChange = function (newValue) {
						if(scope.entity.CompareType === newValue){
							return;
						}
						scope.entity.CompareType = newValue;
						estimateMainWicboqToPrjboqCompareDataForWicService.resetMatchRefNoByCompareCondition(scope.entity);
						estimateMainWicboqToPrjboqCompareDataForWicService.gridRefresh();
					};

					scope.compUomChange = function () {
						scope.entity.CompareWithUom = !scope.entity.CompareWithUom;
						estimateMainWicboqToPrjboqCompareDataForWicService.resetMatchRefNoByCompareCondition(scope.entity);
						estimateMainWicboqToPrjboqCompareDataForWicService.gridRefresh();
					};

					scope.compOutSpChange = function () {
						scope.entity.CompateWithOutSp = !scope.entity.CompateWithOutSp;
						estimateMainWicboqToPrjboqCompareDataForWicService.resetMatchRefNoByCompareCondition(scope.entity);
						estimateMainWicboqToPrjboqCompareDataForWicService.gridRefresh();
					};
				}
			};
		}]);

})(angular);
