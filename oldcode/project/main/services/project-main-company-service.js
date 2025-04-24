/**
 * Created by chin-han.lai on 18/08/2023
 */

(function (angular) {
	'use strict';
	/* global globals */
	let moduleName = 'project.main';
	/**
	 * @ngdoc service
	 * @name projectMainCompanyService
	 * @function
	 *
	 * @description
	 * projectMainCompanyService is the data service for publish company related functionality.
	 */

	angular.module(moduleName).factory('projectMainCompanyService',
		['_',
			'$http',
			'$injector',
			'$translate',
			'platformDataServiceFactory',
			'projectMainService',
			'ServiceDataProcessArraysExtension',
			'basicsCompanyImageProcessor',
			function (_,
				$http,
				$injector,
				$translate,
				platformDataServiceFactory,
				projectMainService,
				ServiceDataProcessArraysExtension,
				basicsCompanyImageProcessor) {
				let serviceOptions = {
					hierarchicalRootItem: {
						module: angular.module(moduleName),
						serviceName: 'projectMainCompanyService',
						httpRead: {
							useLocalResource: true,
							resourceFunction: function (r1, r2, onReadSucceeded) {
								let parentEntity = projectMainService.getSelected() || {};
								let newGroup = parentEntity.Version === 0;
								let endPoint;
								endPoint = 'tree?projectId=' + parentEntity.Id;
								return $http.get(globals.webApiBaseUrl + 'project/main/project2company/' + endPoint).then(function(response) {
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
						dataProcessor: [new ServiceDataProcessArraysExtension(['Companies']), basicsCompanyImageProcessor],
						presenter: {
							tree: {
								parentProp: 'CompanyFk',
								childProp: 'Companies'
							}
						},
						entityRole: {
							leaf: {
								itemName: 'Companies',
								parentService: projectMainService
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
				};
				service.refresh = function () {
					if(projectMainService.getSelected())
					{
						service.load();
					}
				};

				return service;
			}
		]);
})(angular);