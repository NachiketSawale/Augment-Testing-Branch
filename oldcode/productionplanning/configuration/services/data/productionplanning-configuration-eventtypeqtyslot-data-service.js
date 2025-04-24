/**
 * Created by zwz on 2019/12/18
 */
(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.configuration';
	var angModule = angular.module(moduleName);
	var serviceName = 'productionplanningConfigurationEventTypeQtySlotDataService';
	angModule.factory(serviceName, DataService);
	DataService.$inject = ['platformDataServiceFactory', 'basicsCommonMandatoryProcessor'];

	function DataService(platformDataServiceFactory, basicsCommonMandatoryProcessor) {

		var serviceInfo = {
			flatRootItem: {
				module: moduleName + '.eventtypeqtyslot',
				serviceName: serviceName,
				entityNameTranslationID: 'productionplanning.configuration.entityEventTypeQtySlot',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'productionplanning/configuration/eventtypeslot/',
					endRead: 'filtered',
					initReadData: function (readData) {
						readData.FurtherFilters = [{'Token':'ColumnSelection', Value: 'quantity'}];
					},
					usePostForRead: true
				},
				entityRole: {
					root: {
						itemName: 'EventTypeSlot',
						moduleName: 'productionplanning.configuration.moduleDisplayNameEventTypeQtySlot',
						descField: 'DescriptionInfo.Translated'
					}
				},
				presenter: {
					list: {
						handleCreateSucceeded: function (newItem) {
							newItem.ColumnSelection = 6; // columnSelection: 6 maps column Quantity
							newItem.IsReadOnly = true;
						}
					}
				},
				translation: {
					uid: 'productionplanningConfigurationEventTypeQtySlotDataService',
					title: 'productionplanning.configuration.entityEventTypeQtySlot',
					columns: [{header: 'cloud.common.entityDescription', field: 'ColumnTitle'}],
					dtoScheme: {
						typeName: 'EventTypeSlotDto',
						moduleSubModule: 'ProductionPlanning.Configuration',
					},
				}
			}
		};

		/*jshint-W003*/
		var container = platformDataServiceFactory.createNewComplete(serviceInfo);

		container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			typeName: 'EventTypeSlotDto',
			moduleSubModule: 'ProductionPlanning.Configuration',
			validationService: 'productionplanningConfigurationEventTypeQtySlotValidationService'
		});

		return container.service;
	}
})(angular);
