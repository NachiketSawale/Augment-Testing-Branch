/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	let estimateAssembliesModule = angular.module('estimate.assemblies');

	/**
	 * @ngdoc service
	 * @name estimateAssembliesContainerInformationService
	 * @function
	 * @description
	 */
	estimateAssembliesModule.factory('estimateAssembliesContainerInformationService',
		['estimateAssembliesContainerInformationServiceFactory', function (estimateAssembliesContainerInformationServiceFactory) {

			let service = {};
			let isProject = false;
			/* jshint -W074 */ // ignore cyclomatic complexity warning
			service.getContainerInfoByGuid = function getContainerInfoByGuid(guid, options) {
				return estimateAssembliesContainerInformationServiceFactory.getContainerInfoByGuid(guid, isProject, options);
			};

			return service;
		}]);
})();
