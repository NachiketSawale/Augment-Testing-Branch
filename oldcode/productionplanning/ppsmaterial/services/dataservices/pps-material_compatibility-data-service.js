(function (angular) {
	'use strict';
	/* global angular, globals */
	var moduleName = 'productionplanning.ppsmaterial';
	var masterModule = angular.module(moduleName);

	/**
     * @ngdoc service
     * @name ppsMaterialCompatibilityDataService
     * @function
     *
     * @description
     * entityPpsEventTypeRelation is the data service for Pps Material Compatibility.
     */

	masterModule.factory('ppsMaterialCompatibilityDataService', ppsMaterialCompatibilityDataService);
	ppsMaterialCompatibilityDataService.$inject = ['$injector', 'productionplanningPpsMaterialRecordMainService', 'platformDataServiceFactory',
		'platformDataServiceProcessDatesBySchemeExtension', 'basicsLookupdataLookupDescriptorService','basicsCommonMandatoryProcessor'];

	function ppsMaterialCompatibilityDataService($injector, parentService, platformDataServiceFactory,
		platformDataServiceProcessDatesBySchemeExtension, basicsLookupdataLookupDescriptorService,basicsCommonMandatoryProcessor) {

		var serviceInfo = {
			flatLeafItem: {
				module: moduleName,
				serviceName: 'ppsMaterialCompatibilityDataService',
				entityNameTranslationID: 'productionplanning.ppsmaterial.ppsMaterialComp.entityPpsMaterialComp',
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: 'PpsMaterialCompDto',
					moduleSubModule: 'ProductionPlanning.PpsMaterial'
				})],
				httpCreate: {route: globals.webApiBaseUrl + 'productionplanning/ppsmaterial/ppsmaterialcomp/'},
				httpRead: {route: globals.webApiBaseUrl + 'productionplanning/ppsmaterial/ppsmaterialcomp/'},
				entityRole: {
					leaf: {
						itemName: 'PpsMaterialComp',
						parentService: parentService,
						parentFilter: 'mainItemId',
						filterParent: function (data) {
							var parentItemId;
							data.currentParentItem = data.parentService.getSelected();
							if (data.currentParentItem && data.currentParentItem.PpsMaterial) {
								parentItemId = data.currentParentItem.PpsMaterial.Id;
							}
							data.selectedItem = null;
							return parentItemId;
						}
					}
				},
				actions: {
					delete: true,
					create: 'flat'
				},

				presenter: {
					list: {
						incorporateDataRead: function (readData, data) {
							basicsLookupdataLookupDescriptorService.attachData(readData);
							var result = {
								FilterResult: readData.FilterResult,
								dtos: readData || []
							};
							return container.data.handleReadSucceeded(result, data);
						},
						initCreationData: function (creationData) {
							if (parentService.getSelected()) {
								creationData.PKey1 = parentService.getSelected().Id; // MdcMaterialId
								creationData.Id = parentService.getSelected().PpsMaterial ? parentService.getSelected().PpsMaterial.Id : 0;
							}
						}
					}
				}
			}
		};

		/* jshint -W003 */
		var container = platformDataServiceFactory.createNewComplete(serviceInfo);

		container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			typeName: 'PpsMaterialCompDto',
			moduleSubModule: 'ProductionPlanning.PpsMaterial',
			validationService: 'ppsMaterialCompatibilityValidationService',
			mustValidateFields:['MdcMaterialItemFk','UserFlag1','UserFlag2']
		});

		return container.service;
	}

})(angular);
