/**
 * Created by xia on 5/8/2019.
 */
(function () {
	/* global globals */
	'use strict';
	var basicsIndexTableModule = angular.module('basics.indextable');
	/**
     * @ngdoc service
     * @name basicsIndexDetailService
     * @function
     *
     * @description
     * basicsIndexDetailService is the data service for all index detail related functionality.
     */
	/* jshint -W072 */ // many parameters because of dependency injection
	basicsIndexTableModule.factory('basicsIndexDetailService', [
		'basicsIndexHeaderService', 'platformDataServiceFactory', 'basicsIndexDetailValidationProcessService', 'moment',
		function (basicsIndexHeaderService, platformDataServiceFactory, basicsIndexDetailValidationProcessService, moment) {

			var basicsIndexDetailServiceOption = {
				flatLeafItem: {
					module: basicsIndexTableModule,
					serviceName: 'basicsIndexDetailService',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'basics/indexdetail/'
					},
					actions: { delete: true, create: 'flat' },
					entityRole: {
						leaf: { itemName: 'IndexDetail', parentService: basicsIndexHeaderService  }
					},
					presenter: {
						list: {

							handleCreateSucceeded: function (item) {
								item.Date = moment.utc(item.Date);
							}
						}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(basicsIndexDetailServiceOption);
			var service = serviceContainer.service;
			var data = serviceContainer.data;

			data.newEntityValidator = basicsIndexDetailValidationProcessService;

			return service;
		}]);
})(angular);
