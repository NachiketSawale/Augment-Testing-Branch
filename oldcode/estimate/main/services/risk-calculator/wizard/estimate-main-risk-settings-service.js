/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {

	'use strict';
	let moduleName = 'estimate.main';

	/* global globals */
	/**
	 * @ngdoc service
	 * @name estimateMainContainerInformationService
	 * @description provides information on container used in estimate main module
	 */
	angular.module(moduleName).service('estimateMainRiskSettingsService', EstimateMainRiskSettingsService);

	EstimateMainRiskSettingsService.$inject = ['$http'];

	function EstimateMainRiskSettingsService($http) {
		let service = {};

		let userChoiceObj = {
			Id: -1,
			RiskEventFk: null,
			UseCalculation: false,
			IsX: false,
			IsMin:false,
			IsMean:false,
			IsMax:false,
			IsStdDev: false,
			IsSpread: false,
			IsDefault:false,
			XValue: 0.0,
			MinValue: 0.0,
			MeanValue:0.0,
			MaxValue:0.0,
			StdDevValue:0.0
		};

		function getUserChoiceObj(){
			return userChoiceObj;
		}


		function updateUserChoices(userChoices){

			return $http.post(globals.webApiBaseUrl + 'estimate/main/riskcalculator/updateriskchoices',userChoices);
		}

		angular.extend(service,{

			getUserChoiceObj: getUserChoiceObj,
			updateUserChoices: updateUserChoices
		});




		return service;
	}

})(angular);
