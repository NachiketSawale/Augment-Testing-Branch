/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc directive
	 * @name platform.directive:platformScopedConfigContainer
	 * @element div
	 * @restrict A
	 * @description Inserts a user interface for editing settings based upon the defined configuration scopes.
	 */
	angular.module('platform').directive('platformScopedConfigContainer', [
		function () {
			return {
				restrict: 'A',
				scope: {},
				templateUrl: globals.appBaseUrl + 'app/components/scopedconfigdialog/partials/scoped-config-container-template.html',
				controller: 'platformScopedConfigDialogController'
			};
		}]);
})(angular);
