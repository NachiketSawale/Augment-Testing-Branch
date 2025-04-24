/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals */
	'use strict';
	var moduleName = 'controlling.controllingunittemplate';

	angular.module(moduleName).factory('controllingControllingunittemplateUnitDataService',
		['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'controllingControllingunittemplateDataService', 'ServiceDataProcessArraysExtension', 'controllingControllingunittemplateImageProcessor', 'basicsCommonMandatoryProcessor',
			function (_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, mainDataService, ServiceDataProcessArraysExtension, controllingControllingunittemplateImageProcessor, basicsCommonMandatoryProcessor) {

				var serviceOptions = {
					hierarchicalNodeItem: {
						module: angular.module(moduleName),
						serviceName: 'controllingControllingunittemplateUnitDataService',
						httpCRUD: {
							route: globals.webApiBaseUrl + 'controlling/controllingunittemplate/unit/',
							endRead: 'treebyparent',
							usePostForRead: true,
							initReadData: function initReadData(readData) {
								readData.PKey1 = _.get(mainDataService.getSelected(), 'Id');
							}
						},
						presenter: {
							tree: {
								parentProp: 'ControltemplateUnitFk',
								childProp: 'ControltemplateUnitChildren',
								initCreationData: function initCreationData(creationData) {
									creationData.PKey1 = creationData.MainItemId;
									creationData.PKey2 = creationData.parentId;
								}
							}
						},
						actions: {
							delete: {}, create: 'hierarchical',
							canCreateCallBackFunc: function (/* item, data */) {
								// if no units available yet, user is allowed to create a controlling unit on root level
								// or if the selected unit is not the root element but child unit the user is also allowed
								var selected = service.getSelected();
								return (_.size(service.getList()) === 0) || _.get(selected, 'ControltemplateUnitFk') > 0;
							},
							canCreateChildCallBackFunc: function () {
								return !!service.getSelected();
							}
						},
						entityRole: {
							node: {
								itemName: 'ControllingUnitTemplateUnits',
								parentService: mainDataService
							}
						},
						translation: {
							uid: 'controllingControllingunittemplateDataService',
							title: 'controlling.controllingunittemplate.controllingunitListTitle',
							columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
							dtoScheme: {
								typeName: 'ControltemplateUnitDto',
								moduleSubModule: 'Controlling.ControllingUnitTemplate'
							}
						},
						entitySelection: {},
						dataProcessor: [
							platformDataServiceProcessDatesBySchemeExtension.createProcessor({
								typeName: 'ControltemplateUnitDto',
								moduleSubModule: 'Controlling.ControllingUnitTemplate'
							}),
							new ServiceDataProcessArraysExtension(['ControltemplateUnitChildren']),
							controllingControllingunittemplateImageProcessor
						]
					}
				};

				var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions),
					service = serviceContainer.service;

				// newEntityValidator (validation processor)
				serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
					typeName: 'ControltemplateUnitDto',
					moduleSubModule: 'Controlling.ControllingUnitTemplate',
					validationService: 'controllingControllingunittemplateUnitValidationService',
					mustValidateFields: ['Code', 'UomFk']
				});

				return service;
			}]);
})();
