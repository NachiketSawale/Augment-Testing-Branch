(function (angular) {

	'use strict';
	var projectAssemblyModule = angular.module('project.assembly');

	/**
	 * @ngdoc service
	 * @name projectAssemblyContainerInformationService
	 * @function
	 *
	 * @description
	 *
	 */
	projectAssemblyModule.factory('projectAssemblyContainerInformationService', ['estimateAssembliesContainerInformationServiceFactory',
		function (estimateAssembliesContainerInformationServiceFactory) {

			let service = {};

			service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
				return estimateAssembliesContainerInformationServiceFactory.getContainerInfoByGuid(guid, true);
			};

			return service;
		}
	]);
})(angular);