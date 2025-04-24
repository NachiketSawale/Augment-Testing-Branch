/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals */
	'use strict';
	var moduleName = 'controlling.controllingunittemplate';
	var controllingControllingUnitTemplateModule = angular.module(moduleName);

	controllingControllingUnitTemplateModule.factory('controllingControllingunittemplateDataService', ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'basicsCommonMandatoryProcessor',
		function (platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, basicsCommonMandatoryProcessor) {

			var serviceOptions = {
				flatRootItem: {
					module: controllingControllingUnitTemplateModule,
					serviceName: 'controllingControllingunittemplateDataService',
					entityNameTranslationID: 'controlling.controllingunittemplate.containerTitleTemplates', // TODO: check
					httpCRUD: {
						route: globals.webApiBaseUrl + 'controlling/controllingunittemplate/',
						endRead: 'filtered',
						endDelete: 'multidelete',
						usePostForRead: true
					},
					presenter: {list: {}},
					entityRole: {
						root: {
							codeField: 'Code',
							descField: 'Description',
							itemName: 'ControllingUnitTemplates',
							moduleName: 'cloud.desktop.moduleDisplayNameControllingUnitTemplate' // TODO:
						}
					},
					actions: {
						delete: true, create: 'flat',
						canDeleteCallBackFunc: function (/* item */) {
							return true;
						},
						canCreateCallBackFunc: function (/* item */) {
							return true;
						}
					},
					translation: {
						uid: 'controllingControllingunittemplateDataService',
						title: 'controlling.controllingunittemplate.controllingunittemplateListTitle',
						columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
						dtoScheme: {
							typeName: 'ControltemplateDto',
							moduleSubModule: 'Controlling.ControllingUnitTemplate'
						}
					},
					entitySelection: {supportsMultiSelection: true},
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: 'ControltemplateDto',
						moduleSubModule: 'Controlling.ControllingUnitTemplate'
					})],
					sidebarSearch: {
						options: {
							enhancedSearchEnabled: true,
							pattern: '',
							pageSize: 100,
							useCurrentClient: true,
							includeNonActiveItems: false,
							showOptions: true,
							showProjectContext: false,
							withExecutionHints: false
						}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions),
				service = serviceContainer.service;

			// newEntityValidator (validation processor)
			serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'ControltemplateDto',
				moduleSubModule: 'Controlling.ControllingUnitTemplate',
				validationService: 'controllingControllingunittemplateValidationService',
				mustValidateFields: ['Code']
			});

			return service;
		}]);
})();
