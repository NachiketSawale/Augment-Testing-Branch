/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'estimate.main';
	/**
	 * @ngdoc controller
	 * @name estimateMainRiskEventsImpactController
	 * @function
	 *
	 * @description
	 * Controller for the list view of estimate main riskEvents entities.
	 **/

	angular.module(moduleName).controller('estimateMainRiskEventsImpactController', EstimateMainRiskEventsImpactController);

	EstimateMainRiskEventsImpactController.$inject = ['$scope', 'platformDetailControllerService','estimateMainRiskEventsDataService',
		'basicsRiskRegisterImpactStandardConfigurationService','basicsRiskRegisterTranslationService','basicsRiskRegisterImpactDetailService'];

	function EstimateMainRiskEventsImpactController($scope, platformDetailControllerService,estimateMainRiskEventsDataService,
		basicsRiskRegisterImpactStandardConfigurationService,basicsRiskRegisterTranslationService,
		basicsRiskRegisterImpactDetailService) {

		let riskEventsDataServiceCopy = angular.copy(estimateMainRiskEventsDataService);

		riskEventsDataServiceCopy.getSelected = function getSelected(){
			let selected = estimateMainRiskEventsDataService.getSelected();

			if(selected){
				// eslint-disable-next-line no-prototype-builtins
				if(selected.hasOwnProperty('RiskRegisterImpactEntities')){
					return selected.RiskRegisterImpactEntities[0];
				}else{
					return selected;
				}

			}
			return selected;
		};
		$scope.change = function(entity, field,column){
			$scope.newEntity=entity;
			basicsRiskRegisterImpactDetailService.fieldChange(entity, field,column);
		};
		platformDetailControllerService.initDetailController($scope,riskEventsDataServiceCopy,null,basicsRiskRegisterImpactStandardConfigurationService,basicsRiskRegisterTranslationService);

		$scope.formOptions.configure.dirty = function dirty(entity, model, options) {
			if (!options.isTransient) {
				// options.change(entity,model,options);
				basicsRiskRegisterImpactDetailService.fieldChange(entity, model,options);
				riskEventsDataServiceCopy.markItemAsModified(entity);
				riskEventsDataServiceCopy.markCurrentItemAsModified();
				(riskEventsDataServiceCopy.gridRefresh || angular.noop())();
			}
		};
	}
})(angular);
