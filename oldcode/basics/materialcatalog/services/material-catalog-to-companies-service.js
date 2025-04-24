/**
 * Created by lvy on 5/15/2019.
 */
(function (angular) {
	'use strict';
	var moduleName = 'basics.materialcatalog';

	angular.module(moduleName).factory('basicsMaterialCatalogToCompaniesService',
		['$http',
			'platformDataServiceFactory',
			'basicsMaterialCatalogService',
			'ServiceDataProcessArraysExtension',
			'basicsCompanyImageProcessor', 'platformContextService',
			function ($http,
				platformDataServiceFactory,
				basicsMaterialCatalogService,
				ServiceDataProcessArraysExtension,
				basicsCompanyImageProcessor, platformContextService) {

				var serviceContainer = null;
				var serviceOptions = {
					hierarchicalRootItem: {
						module: angular.module(moduleName),
						serviceName: 'basicsMaterialCatalogToCompanysService',
						httpRead: {
							useLocalResource: true,
							resourceFunction: function (p1, p2, onReadSucceeded) {

								var parentEntity = basicsMaterialCatalogService.getSelected() || {};
								var newGroup = parentEntity.Version === 0;
								var endPoint;
								endPoint = 'tree?mdcContexId=' + parentEntity.MdcContextFk + '&materialCatalogId=' + parentEntity.Id;

								return $http.get(globals.webApiBaseUrl + 'basics/materialcatalog/tocompanies/' + endPoint).then(function (response) {
									if (newGroup || basicsMaterialCatalogService.isDeepCopy) {
										basicsMaterialCatalogService.isDeepCopy = false;
										onReadSucceeded(response.data, serviceContainer.data);
										let loginCompanyFk = platformContextService.clientId;
										angular.forEach(serviceContainer.service.getList(), function (value) {
											if (value.Id === loginCompanyFk) {
												value.CanEdit = true;
												value.CanLookup = true;
												value.IsOwner = true;
											}
											if (value.IsOwner || value.CanEdit || value.CanLookup) {
												serviceContainer.service.markItemAsModified(value);
											}
										});

									} else {
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
								itemName: 'MdcMaterialCatCompany',
								parentService: basicsMaterialCatalogService
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

				serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
				return serviceContainer.service;
			}
		]);
})(angular);