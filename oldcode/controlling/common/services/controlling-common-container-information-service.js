/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	var controllingCommonModule = angular.module('controlling.common');

	/**
	 * @ngdoc service
	 * @name controllingCommonContainerInformationService
	 * @function
	 *
	 * @description
	 * Provides some information on all containers in the module.
	 */
	controllingCommonModule.factory('controllingCommonContainerInformationService', [
		function () {
			let service = {};

			service.getContainerInfoByGuid = function getContainerInfoByGuid() {
				return {};
			};

			return service;
		}
	]);
})(angular);
