/*globals angular */

(function (angular) {
	'use strict';
	var module = 'basics.workflow';

	function basicsWorkflowCommonService(_) {
		var service = {};

		var fnList = [];
		service.registerFn = function (fn) {
			fnList.push(fn);
		};

		service.unregisterFn = function (fn) {
			fnList.pop(fn);
		};

		service.clearFn = function () {
			fnList.length = 0;
		};

		service.getFnList = function () {
			return fnList;
		};

		return service;
	}

	angular.module(module)
		.factory('basicsWorkflowCommonService', ['_', basicsWorkflowCommonService]);
})(angular);