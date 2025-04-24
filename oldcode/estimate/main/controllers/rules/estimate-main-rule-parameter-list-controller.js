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
	 * * estimateMainRuleParameterListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of any kind of entity causing a change in the Estimate rules parameter
	 **/
	angular.module(moduleName).controller('estimateMainRuleParameterListController', estimateMainRuleParameterListController);

	estimateMainRuleParameterListController.$inject = ['$scope','$injector','estimateMainContainerInformationService', 'estimateMainRuleParameterContainerService',];

	function estimateMainRuleParameterListController($scope, $injector, estimateMainContainerInformationService, estimateMainRuleParameterContainerService) {

		let containerUid = $scope.getContentValue('uuid');

		estimateMainRuleParameterContainerService.prepareGridConfig(containerUid, $scope, estimateMainContainerInformationService);

		let conatainerInfo = estimateMainContainerInformationService.getDynamicConfig(containerUid);

		let options = {
			scope: $scope,
			containerUid : $scope.getContentValue('uuid'),
			rootMainServiceName : 'estimateMainService',
			dataServiceName: conatainerInfo.dataServiceName,
			dataValidationServiceName: conatainerInfo.validationServiceName,
			dataConfigServiceName: conatainerInfo.standardConfigurationService,
			paramValueServiceName: 'estimateMainRuleParameterValueDataServiceFactory',
			userFormOpenMethod: 'userFormOpenMethod'
		};

		$injector.get('estimateProjectEstRuleParameterControllerFactory').initRuleParameterListController(options);
	}

})(angular);