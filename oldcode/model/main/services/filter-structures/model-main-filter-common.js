/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/*global angular */

	/**
	 * @ngdoc service
	 * @name modelMainFilterCommon
	 * @description
	 * service for all common filter structure services functions and tasks.
	 */
	angular.module('model.main').factory('modelMainFilterCommon', ['_',
		function (_) {
		return {
			collectItems: function collectItems(item, childProp, resultArr) {
				resultArr = resultArr || [];
				resultArr.push(item);
				_.each(item[childProp], function (item) {
					collectItems(item, childProp, resultArr);
				});
				return resultArr;
			}
		};

	}]);
})(angular);
