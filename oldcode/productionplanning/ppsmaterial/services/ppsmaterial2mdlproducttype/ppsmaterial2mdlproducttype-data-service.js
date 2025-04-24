/**
 * Created by zwz on 2024/5/22.
 */
(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.ppsmaterial';
	var angModule = angular.module(moduleName);

	angModule.factory('ppsMaterialToMdlProductTypeDataService', DataService);
	DataService.$inject = ['platformDataServiceProcessDatesBySchemeExtension', 'platformDataServiceFactory', 'basicsCommonMandatoryProcessor'];

	function DataService(platformDataServiceProcessDatesBySchemeExtension, platformDataServiceFactory, basicsCommonMandatoryProcessor) {

		function enSureInvalidValue(newItem) {
			if (newItem) {
				Object.keys(newItem).forEach(function (prop) {
					if (prop.endsWith('Fk')) {
						if (newItem[prop] === 0) {
							newItem[prop] = null;
						}
					}
				});
			}
		}

		var serviceInfo = {
			flatRootItem: {
				module: moduleName + '.ppsmaterial2mdlproducttype',
				serviceName: 'ppsMaterialToMdlProductTypeDataService',
				entityNameTranslationID: 'productionplanning.ppsmaterial.ppsMaterialToMdlProductType.entityPpsMaterial2MdlProductType',
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: 'PpsMaterial2MdlProductTypeDto',
					moduleSubModule: 'ProductionPlanning.PpsMaterial'
				})],
				httpCRUD: {
					route: globals.webApiBaseUrl + 'productionplanning/ppsmaterial/ppsmaterial2mdlproducttype/',
					endRead: 'filtered',
					endDelete: 'multidelete',
					usePostForRead: true
				},
				entityRole: {
					root: {
						itemName: 'PpsMaterial2MdlProductTypes'
					}
				},
				presenter: {
					list: {
						handleCreateSucceeded: function (newItem) {
							enSureInvalidValue(newItem);
						}
					}
				},
				entitySelection: {supportsMultiSelection: true}
			}
		};

		/*jshint-W003*/
		var container = platformDataServiceFactory.createNewComplete(serviceInfo);

		container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			typeName: 'PpsMaterial2MdlProductTypeDto',
			moduleSubModule: 'ProductionPlanning.PpsMaterial',
			validationService: 'ppsMaterialToMdlProductTypeValidationService'
		});

		return container.service;
	}
})(angular);
