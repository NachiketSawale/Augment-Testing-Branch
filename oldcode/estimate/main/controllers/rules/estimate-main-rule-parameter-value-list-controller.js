/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	const moduleName = 'estimate.main';

	/**
	 * @ngdoc controller
	 * @name
	 * * estimateMainRuleParameterValueListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of any kind of entity causing a change in the Estimate rules parameter values
	 **/
	angular.module(moduleName).controller('estimateMainRuleParameterValueListController', EstimateMainRuleParameterValueListController);

	EstimateMainRuleParameterValueListController.$inject = ['$scope','$injector','platformGridAPI','platformContainerControllerService',
		'estimateMainContainerInformationService', 'estimateMainRuleParameterValueContainerService',
	];

	function EstimateMainRuleParameterValueListController($scope, $injector, platformGridAPI, platformContainerControllerService,
		estimateMainContainerInformationService, estimateMainRuleParameterValueContainerService) {

		let containerUid = $scope.getContentValue('uuid');

		estimateMainRuleParameterValueContainerService.prepareGridConfig(containerUid, $scope, estimateMainContainerInformationService);

		let conatainerInfo = estimateMainContainerInformationService.getDynamicConfig(containerUid);

		let parentDatafactory = $injector.get('estimateMainRuleParameterDataServiceFactory');

		let ruleDataService = $injector.get('estimateMainRuleDataService');

		let options = {
			scope: $scope,
			containerUid : $scope.getContentValue('uuid'),
			dataService: conatainerInfo.dataServiceName,
			dataValidationService: conatainerInfo.validationServiceName,
			dataConfigService: conatainerInfo.standardConfigurationService,
			parentService: parentDatafactory,
			ruleDataService: ruleDataService
		};

		$injector.get('estimateProjectEstRuleParameterValueControllerFactory').initRuleParameterValueListController(options);
	}

})(angular);