(function (angular) {
	'use strict';
	/* global globals */
	var moduleName = 'constructionsystem.master';

	/* jshint -W072 */
	angular.module(moduleName).factory('constructionSystemMasterControllingGroupService',
		['platformDataServiceFactory',
			'constructionSystemMasterHeaderService',

			function (platformDataServiceFactory,
				constructionSystemMasterHeaderService) {

				var procurementPesItemServiceOption = {
					flatLeafItem: {
						module: angular.module(moduleName),
						serviceName: 'constructionSystemMasterControllingGroupService',
						httpCRUD: {
							route: globals.webApiBaseUrl + 'constructionsystem/master/controllinggroup/',
							endRead: 'list'
						},
						presenter: {
							list: {
							}
						},
						entityRole: {
							leaf: {
								itemName: 'CosControllingGroup',
								parentService: constructionSystemMasterHeaderService
							}
						},
						dataProcessor: []
					}
				};

				var serviceContainer = platformDataServiceFactory.createNewComplete(procurementPesItemServiceOption);

				angular.extend(serviceContainer.service,
					{
					}
				);

				return serviceContainer.service;
			}
		]);
})(angular);