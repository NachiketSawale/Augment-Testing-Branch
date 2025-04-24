/**
 * $Id:
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';
	const moduleName = 'model.project';

	/**
	 * @ngdoc service
	 * @name modelProjectClerkValidationService
	 * @description provides validation methods for model project clerk entities
	 */
	angular.module(moduleName).service('modelProjectClerkValidationService', modelProjectClerkValidationService);

	modelProjectClerkValidationService.$inject = ['platformValidationServiceFactory', 'modelProjectClerkDataService'];

	function modelProjectClerkValidationService(platformValidationServiceFactory, modelProjectClerkDataService) {
		const self = this;
		const schemeInfo = {typeName: 'ModelClerkRoleDto', moduleSubModule: 'Model.Project'};

		platformValidationServiceFactory.addValidationServiceInterface(schemeInfo, {
				mandatory: platformValidationServiceFactory.determineMandatoryProperties(schemeInfo)
			},
			self,
			modelProjectClerkDataService);
	}

})(angular);