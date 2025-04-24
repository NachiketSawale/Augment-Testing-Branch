/**
 * Created by zov on 15/11/2018.
 */
(function () {
	'use strict';
	/* global angular*/
	var moduleName = 'transportplanning.transport';
	var transportModule = angular.module(moduleName);
	transportModule.factory('trsTransportDispatchingHeaderProcessor', dispatchingHeaderProcessor);
	dispatchingHeaderProcessor.$inject = ['platformRuntimeDataService'];
	function dispatchingHeaderProcessor(platformRuntimeDataService) {
		return {
			processItem: function (item) {
				if (item) {
					var setting =  Object.getOwnPropertyNames(item).map(function (ppt) {
						return {
							field: ppt,
							readonly: true
						};
					});
					platformRuntimeDataService.readonly(item, setting);
				}
			}
		};
	}
})(angular);