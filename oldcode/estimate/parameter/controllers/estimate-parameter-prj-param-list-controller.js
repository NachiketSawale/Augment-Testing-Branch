/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	let moduleName = 'estimate.parameter';
	/**
	 * @ngdoc controller
	 * @name estimateParameterPrjParamListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of project estimate parameter entities.
	 **/
	angular.module(moduleName).controller('estimateParameterPrjParamListController',
		['_', '$scope','$injector','platformGridAPI','platformCreateUuid', 'platformGridControllerService', 'estimateParameterPrjParamService', 'estimateParameterPrjParamStandardConfigurationService', 'estimateParameterPrjParamValidationService','estimateRuleCommonService','estimateRuleParameterConstant','estimateMainCommonFeaturesService',
			function (_, $scope,$injector,platformGridAPI,platformCreateUuid, platformGridControllerService, estimateParameterPrjParamService, estimateParameterPrjConfigService, estimateParamPrjValidationService, estimateRuleCommonService,estimateRuleParameterConstant,estimateMainCommonFeaturesService) {
				let gridConfig = {
					cellChangeCallBack: function cellChangeCallBack(args) {

						let item = args.item;
						let col = args.grid.getColumns()[args.cell].field;

						let modified = false;
						if (col === 'ValueDetail') {

							if(item.ValueType === estimateRuleParameterConstant.Text){

								item.ParameterText = item.ValueDetail;
							}else{

								if(!item.CalculateDefaultValue){
									estimateRuleCommonService.calculateDetails(item, col, 'ParameterValue', estimateParameterPrjParamService);
								}else{
									if(estimateParameterPrjParamService &&  _.isFunction(estimateParameterPrjParamService.getList)) {
										estimateRuleCommonService.calculateReferenceParams(item, estimateParameterPrjParamService);
									}
								}
							}
							modified = true;
						}else if (col === 'ParameterValue'){
							item.ParameterValue = (item.ParameterValue === '') ? 0 : item.ParameterValue;
							estimateRuleCommonService.calculateDetails(item, col, null, estimateParameterPrjParamService);

							modified = true;
						}else if(col === 'ParameterText'){
							if(item.ValueType !== estimateRuleParameterConstant.TextFormula) {
								item.ValueDetail = item.ParameterText;
							}
							modified = true;
						}
						else if (col === 'Code') {
							modified = true;
							let estimateParamDataService = $injector.get('estimateParamDataService');
							_.forEach(estimateParamDataService.getParams(), function (param) {
								if(item.Id === param.Id){
									param.Code = item.Code;
								}
							})
						}

						if(modified){
							platformGridAPI.items.invalidate($scope.gridId, item);
						}
						estimateParameterPrjParamService.gridRefresh();
						estimateMainCommonFeaturesService.fieldChanged(col,item);
					},
					rowChangeCallBack: function rowChangeCallBack(){
						let selectedParam = estimateParameterPrjParamService.getSelected();
						let estimateParamDataService = $injector.get('estimateParamDataService');
						if(selectedParam){
							estimateParamDataService.setSelectParam(selectedParam);
						}
					}
				};

				platformGridControllerService.initListController($scope, estimateParameterPrjConfigService, estimateParameterPrjParamService, estimateParamPrjValidationService, gridConfig);
			}
		]);
})();
