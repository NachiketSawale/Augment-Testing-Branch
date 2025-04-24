/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals */
	'use strict';
	var moduleName = 'controlling.controllingunittemplate';

	angular.module(moduleName).factory('controllingControllingunittemplateGroupDataService',
		['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'controllingControllingunittemplateUnitDataService',
			function (_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, mainDataService) {

				var serviceOptions = {
					flatLeafItem: {
						module: angular.module(moduleName),
						serviceName: 'controllingControllingunittemplateGroupDataService',
						httpCRUD: {
							route: globals.webApiBaseUrl + 'controlling/controllingunittemplate/unit/group/',
							endRead: 'listbyparent',
							usePostForRead: true,
							initReadData: function initReadData(readData) {
								readData.PKey1 = _.get(mainDataService.getSelected(), 'Id');
							}
						},
						presenter: {
							list: {
								initCreationData: function initCreationData(creationData) {
									creationData.PKey1 = _.get(mainDataService.getSelected(), 'Id');
								}
							}},
						entityRole: {
							leaf: {
								itemName: 'ControllingUnitTemplateGroups',
								parentService: mainDataService
							}
						},
						entitySelection: {},
						dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
							typeName: 'ControltemplateGroupDto',
							moduleSubModule: 'Controlling.ControllingUnitTemplate'
						})]
					}
				};

				var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions),
					service = serviceContainer.service;

				return service;
			}]);
})();
