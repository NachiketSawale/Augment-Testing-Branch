(function (angular) {
	'use strict';

	function basicsWorkflowDtoService() {
		var service = {};

		service.extendObject = function (obj) {
			for (var key in obj) {
				if (obj.hasOwnProperty(key)) {
					addGetterAndSetter(obj, key, invertPropertyName(key));
				}
			}
			obj.refreshWrapper = RefreshWrapper;
			return obj;
		};

		function RefreshWrapper() {
			service.extendObject(this);
		}

		function addGetterAndSetter(obj, prop, invProp) {

			if (!obj.hasOwnProperty(invProp)) {
				Object.defineProperty(obj, invProp, {
					get: function () {
						return this[prop];
					},
					set: function (val) {
						this[prop] = val;
					}
				});
			}
		}

		function invertPropertyName(prop) {
			var start = prop.charAt(0);
			var invStart;
			if (start.toUpperCase() === start) {
				invStart = start.toLowerCase();
			} else {
				invStart = start.toUpperCase();
			}
			return invStart + prop.substr(1);
		}

		return service;
	}

	basicsWorkflowDtoService.$inject = [];

	angular.module('basics.workflow')
		.service('basicsWorkflowDtoService', basicsWorkflowDtoService);

})(angular);
