/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/*global angular */

	/**
	 * @ngdoc service
	 * @name modelMainFilterService
	 * @function
	 *
	 * @description
	 * modelMainFilterService for filtering e.g. properties container by combination of several filters.
	 */
	angular.module('model.main').factory('modelMainFilterService', ['modelCommonFilterServiceProvider',
		function (modelCommonFilterServiceProvider) {

			return modelCommonFilterServiceProvider.getInstance('main');
		}]);
})(angular);
