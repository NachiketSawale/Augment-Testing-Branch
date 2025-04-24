/**
 * Created by leo on 13.10.2015.
 */
(function () {
	/* global globals */
	'use strict';
	var moduleName = 'project.main';
	var projectMainModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name projectMainSaleService
	 * @function
	 *
	 * @description
	 * projectMainSaleService is the data service for all project related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	projectMainModule.factory('projectMainSaleService',
		['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'projectMainService', 'platformDataServiceSelectionExtension',

			function (platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, projectMainService, platformDataServiceSelectionExtension) {

				// The instance of the main service - to be filled with functionality below
				var activityServiceOption = {
					flatLeafItem: {
						module: projectMainModule,
						serviceName: 'projectMainSaleService',
						entityNameTranslationID: 'cloud.common.entityProject',
						dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
							typeName: 'SaleDto',
							moduleSubModule: 'Project.Main'
						})],
						httpCreate: {route: globals.webApiBaseUrl + 'project/main/sale/', endCreate: 'create'},
						httpRead: {
							route: globals.webApiBaseUrl + 'project/main/sale/',
							endRead: 'list'
						},
						actions: {create: 'flat', delete: {}},
						entitySelection: {},
						presenter: {
							list: {
								initCreationData: function initCreationData(creationData) {
									var project = projectMainService.getSelected();
									creationData.Id = project.Id;
									delete creationData.MainItemId;
								}
							}
						},
						entityRole: {
							leaf: {
								itemName: 'Sales',
								parentService: projectMainService,
								parentFilter: 'projectId'
							}
						},
						longText: {
							relatedContainerTitle: 'project.main.listSaleTitle',
							relatedGridId: '011b0cf9e74e4e5094995de0ec1e9217',
							longTextProperties: [{
								displayProperty: 'Remark',
								propertyTitle: 'project.main.remarkContainerTitle'
							}, {
								displayProperty: 'RemarkOutcome',
								propertyTitle: 'project.main.entityRemarkOutcome'
							}, {
								displayProperty: 'Remark01',
								propertyTitle: 'project.main.entityRemark01'
							}, {
								displayProperty: 'Remark02',
								propertyTitle: 'project.main.entityRemark02'
							}, {
								displayProperty: 'Remark03',
								propertyTitle: 'project.main.entityRemark03'
							}, {
								displayProperty: 'Remark04',
								propertyTitle: 'project.main.entityRemark04'
							}, {
								displayProperty: 'Remark05',
								propertyTitle: 'project.main.entityRemark05'
							}]
						}
					}
				};

				var serviceContainer = platformDataServiceFactory.createNewComplete(activityServiceOption);

				function doNavi(item) {
					serviceContainer.service.setSelected(item);
				}

				serviceContainer.service.doNavi = doNavi;

				serviceContainer.data.onReadSucceeded = function onReadSucceededSales(readItems, data) {
					var res = serviceContainer.data.handleReadSucceeded(readItems, data);
					if (!_.isEmpty(serviceContainer.data.itemList)) {
						platformDataServiceSelectionExtension.doSelect(serviceContainer.data.itemList[0], serviceContainer.data);
					}

					return res;
				};

				return serviceContainer.service;
			}]);
})();
