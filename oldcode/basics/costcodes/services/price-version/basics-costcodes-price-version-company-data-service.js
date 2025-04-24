/**
 * Created by joshi on 16.09.2014.
 */
(function (angular) {
	'use strict';
	let moduleName = 'basics.costcodes';
	/* global globals */
	
	/**
	 * @ngdoc service
	 * @name basicsCostCodesPriceVersionDataService
	 * @function
	 *
	 * @description
	 * basicsCostCodesPriceVersionDataService
	 */

	/* jshint -W072 */
	angular.module(moduleName).factory('basicsCostCodesPriceVersionCompanyDataService',
		['platformDataServiceFactory', '$http',
			'basicsCostCodesPriceVersionDataService',
			'ServiceDataProcessArraysExtension',
			'basicsCompanyImageProcessor', 'basicsCostcodesPriceVersionCompanyReadonlyProcessor',
			function (platformDataServiceFactory, $http, parentService,
				ServiceDataProcessArraysExtension, basicsCompanyImageProcessor,
				basicsCostcodesPriceVersionCompanyReadonlyProcessor) {

				let serviceOptions = {
					hierarchicalRootItem: {
						module: angular.module(moduleName),
						serviceName: 'basicsCostCodesPriceVersionCompanyDataService',
						httpRead: {
							useLocalResource: true,
							resourceFunction: function (r1, r2, onReadSucceeded) {
								let parentEntity = parentService.getSelected() || {};
								let newGroup = parentEntity.Version === 0;
								let endPoint = 'tree?mainItemId=' + parentEntity.Id + '&mdcContextId=' + parentEntity.ContextFk;
								return $http.get(globals.webApiBaseUrl + 'basics/costcodes/version/company/' + endPoint).then(function (response) {
									if (newGroup) {
										onReadSucceeded(response.data, serviceContainer.data);
										angular.forEach(serviceContainer.service.getList(), function (value) {
											if (value.Checked) {
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
						dataProcessor: [basicsCostcodesPriceVersionCompanyReadonlyProcessor, new ServiceDataProcessArraysExtension(['Companies']), basicsCompanyImageProcessor],
						presenter: {
							tree: {
								parentProp: 'CompanyFk',
								childProp: 'Companies'
							}
						},
						entityRole: {
							leaf: {
								itemName: 'Companies',
								parentService: parentService
							}
						},
						modification: {
							multi: {}
						},
						actions: {
							delete: false,
							create: false
						}
					}
				};

				let serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
				let service = serviceContainer.service;

				service.fieldChangeCallBack = function fieldChangeCallBack(arg) {
					let item = arg.item;

					let header = parentService.getSelected();

					function setStateRecursive(item, newState) {
						if(header.ContextFk === item.MdcContextFk){
							item.IsChecked = newState;
							service.markItemAsModified(item);
						}
						let len = item.Companies ? item.Companies.length : 0;
						for (let i = 0; i < len; i++) {
							setStateRecursive(item.Companies[i], newState);
						}
					}

					if (item.Companies && item.Companies.length > 0)   // node has child items
					{
						setStateRecursive(item, item.IsChecked);
					}
				};

				return service;
			}
		]);
})(angular);
