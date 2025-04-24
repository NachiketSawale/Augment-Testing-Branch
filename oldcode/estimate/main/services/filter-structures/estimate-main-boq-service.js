/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals, _, Platform */
	'use strict';
	let moduleName = 'estimate.main';
	let estimateMainModule = angular.module(moduleName);

	/* jslint nomen:true */
	/* jshint -W072 */ // many parameters because of dependency injection
	estimateMainModule.factory('estimateMainBoqService', ['$injector','estimateMainBoqServiceFactory',
		function ($injector,estimateMainBoqServiceFactory) {

			let service = {};

			let serviceContainer = estimateMainBoqServiceFactory.createEstimateMainBoqService();
			service = serviceContainer.service;

			return service;

		}]);
})(angular);
