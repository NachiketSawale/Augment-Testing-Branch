/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular){
	'use strict';

	angular.module('estimate.main').controller('estimateMainLineitemParamertersController', ['_','$scope', '$injector', 'platformGridAPI', 'platformCreateUuid', 'platformGridControllerService',
		'estimateMainLineItemParameterUiService','estimateMainLineitemParamertersService','estimateRuleCommonService','estimateRuleParameterConstant','estimateMainParamListValidationService',
		function(_, $scope, $injector, platformGridAPI, platformCreateUuid, platformGridControllerService,
			layoutSerice, dataService,estimateRuleCommonService,estimateRuleParameterConstant, estimateMainParamListValidationService){

			let gridConfig = {
				initCalled: false,
				columns: [],
				cellChangeCallBack: function cellChangeCallBack(args) {

					let item = args.item;
					let col = args.grid.getColumns()[args.cell].field;

					let modified = false;
					if (col === 'ValueDetail') {
						modified = true;
					}else if (col === 'ParameterValue'){
						item.ParameterValue = (item.ParameterValue === '') ? 0 : item.ParameterValue;
						estimateRuleCommonService.calculateDetails(item, col, null, dataService);

						modified = true;
					}else if(col === 'ParameterText'){
						if(item.ValueType !== estimateRuleParameterConstant.TextFormula) {
							item.ValueDetail = item.ParameterText;
						}
						modified = true;
					}else if(item.ValueType === 1 && col === 'EstRuleParamValueFk'){
						let referenceParams = {params: []};
						estimateRuleCommonService.calculateDetails(item, 'ParameterValue', undefined, dataService, referenceParams);
						modified = true;
					}

					if(modified){
						platformGridAPI.items.invalidate($scope.gridId, item);
					}
					dataService.gridRefresh();
					// estimateMainCommonFeaturesService.fieldChanged(col,item);
				},

			};

			let setCellEditable = function () {
				return true;
			};

			function onSelectedRowsChanged(e, args) {
				let rows = args.rows;
				if(rows.length === 0){
					$scope.tools.update();
				}

			}

			platformGridControllerService.initListController($scope, layoutSerice, dataService, estimateMainParamListValidationService, gridConfig);

			platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);

			platformGridAPI.events.register($scope.gridId, 'onBeforeEditCell', setCellEditable);
			dataService.setGrid($scope.gridId);

			$scope.$on('$destroy', function () {
				platformGridAPI.events.unregister($scope.gridId, 'onBeforeEditCell', setCellEditable);
				platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
			});

		}
	]);

})(angular);
