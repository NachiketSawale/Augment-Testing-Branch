/**
 * Created by lav on 8/9/2019.
 */
(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.ppsmaterial';
	var angModule = angular.module(moduleName);

	angModule.factory('ppsCadToMaterialDataService', DataService);
	DataService.$inject = ['$injector', 'platformDataServiceFactory', 'basicsCommonMandatoryProcessor'];

	function DataService($injector, platformDataServiceFactory, basicsCommonMandatoryProcessor) {

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
				module: moduleName + '.cad2material',
				serviceName: 'ppsCadToMaterialDataService',
				entityNameTranslationID: 'productionplanning.ppsmaterial.ppsCadToMaterial.entityCad2Material',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'productionplanning/ppsmaterial/cad2material/',
					endRead: 'filtered',
					endDelete: 'multidelete',
					usePostForRead: true
				},
				entityRole: {
					root: {
						itemName: 'PpsCad2mdcMaterials'
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
			typeName: 'PpsCad2mdcMaterialDto',
			moduleSubModule: 'ProductionPlanning.PpsMaterial',
			validationService: 'ppsCadToMaterialValidationService'
		});

		return container.service;
	}
})(angular);
