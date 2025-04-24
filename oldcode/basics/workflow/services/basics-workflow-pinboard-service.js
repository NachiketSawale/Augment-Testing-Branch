/**
 * Created by hzh on 2020/06/12.
 */
(function (angular) {
	'use strict';
	var moduleName = 'basics.workflow';
	/**
	 * @ngdoc service
	 * @name basicsWorkflowPinboardService
	 * @function
	 * @requireds platformDataServiceFactory
	 *
	 * @description Provide header data service
	 */
	/* jshint -W072*/ //many parameters because of dependency injection
	angular.module(moduleName).factory('basicsWorkflowPinboardService',
		['platformDataServiceFactory', function (platformDataServiceFactory) {
			var serviceOptions = {
				flatRootItem: {
					entityRole: {
						root: {}
					},
					entitySelection: {},
					module: moduleName
				}
			};
			var container = platformDataServiceFactory.createNewComplete(serviceOptions);
			return container.service;
		}]
	);
})(angular);
