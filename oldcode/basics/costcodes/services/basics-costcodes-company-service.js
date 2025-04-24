/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/* global globals */
	let moduleName = 'basics.costcodes';
	/**
	 * @ngdoc service
	 * @name basicsCostCodesMainService
	 * @function
	 *
	 * @description
	 * basicsCostCodesMainService is the data service for costcode company related functionality.
	 */
	angular.module(moduleName).factory('basicsCostCodesCompanyMainService',
		['_',
			'$http',
			'$injector',
			'$translate',
			'platformDataServiceFactory',
			'basicsCostCodesMainService',
			'ServiceDataProcessArraysExtension',
			'basicsCompanyImageProcessor',
			'basicsCostCodesCompanyProcessor',
			function (_,
				$http,
				$injector,
				$translate,
				platformDataServiceFactory,
				basicsCostCodesMainService,
				ServiceDataProcessArraysExtension,
				basicsCompanyImageProcessor, basicsCostCodesCompanyProcessor) {

				let serviceOptions = {
					hierarchicalRootItem: {
						module: angular.module(moduleName),
						serviceName: 'basicsCharacteristicUsedInCompanyService',
						httpRead: {
							useLocalResource: true,
							resourceFunction: function (r1, r2, onReadSucceeded) {
								let parentEntity = basicsCostCodesMainService.getSelected() || {};
								let newGroup = parentEntity.Version === 0;
								let endPoint;
								endPoint = 'tree?mainItemId=' + parentEntity.Id + '&mdcContextId='+parentEntity.ContextFk;
								return $http.get(globals.webApiBaseUrl + 'basics/costcodes/company/' + endPoint).then(function(response) {
									if (newGroup) {
										onReadSucceeded(response.data, serviceContainer.data);
										angular.forEach(serviceContainer.service.getList(), function (value) {
											if (value.IsChecked) {
												serviceContainer.service.markItemAsModified(value);
											}
										});
									}
									else {
										onReadSucceeded(response.data, serviceContainer.data);
									}
								});

							}
						},
						dataProcessor: [new ServiceDataProcessArraysExtension(['Companies']), basicsCompanyImageProcessor, basicsCostCodesCompanyProcessor],
						presenter: {
							tree: {
								parentProp: 'CompanyFk',
								childProp: 'Companies'
							}
						},
						entityRole: {
							leaf: {
								itemName: 'Companies',
								parentService: basicsCostCodesMainService
							}
						},
						modification: {
							multi: {}
						},
						actions:{
							delete:false,
							create:false
						}
					}
				};

				let serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
				let service = serviceContainer.service;

				service.fieldChangeCallBack = function fieldChangeCallBack(arg) {
					let item = arg.item;
					function setStateRecursive(item, newState) {
						item.IsChecked = newState;
						service.markItemAsModified(item);
						let len = item.Companies ? item.Companies.length : 0;
						for (let i = 0; i < len; i++){
							setStateRecursive(item.Companies[i], newState);
						}
					}
					if (item.Companies && item.Companies.length > 0)   // node has child items
					{
						setStateRecursive(item, item.IsChecked);
					}
					if(!item.IsChecked){
						return basicsCostCodesMainService.setCompanyCostCodes(false);
					}
					let platformModalService = $injector.get('platformModalService');
					let modalOptions = {
						headerTextKey: moduleName + '.confirmAssignCompany',
						bodyTextKey: $translate.instant(moduleName + '.confirmAssignCompanyToChildren'),
						showYesButton: true,
						showNoButton: true,
						iconClass: 'ico-question'
					};

					return platformModalService.showDialog(modalOptions).then(function (result) {
						let includeChild = result.yes ? true : false;
						return basicsCostCodesMainService.setCompanyCostCodes(includeChild);
					});
				};
				return service;
			}
		]);
})(angular);
