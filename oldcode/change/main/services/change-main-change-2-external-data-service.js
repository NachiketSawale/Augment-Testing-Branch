/**
 * Created by nitsche on 21.08.2019
 */

(function (angular) {
	'use strict';
	var myModule = angular.module('change.main');

	/**
	 * @ngdoc service
	 * @name changeMainDataService
	 * @description pprovides methods to access, create and update change main  entities
	 */
	myModule.service('changeMainChange2ExternalDataService', ChangeMainChange2ExternalDataService);

	ChangeMainChange2ExternalDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'platformDataServiceEntityReadonlyProcessor', 'changeMainConstantValues', 'changeMainService'];

	function ChangeMainChange2ExternalDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, platformDataServiceEntityReadonlyProcessor, changeMainConstantValues, changeMainChangeEntityDataService) {
		var self = this;
		var changeMainServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'changeMainChange2ExternalDataService',
				entityNameTranslationID: 'change.main.change2ExternalEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'change/main/change2external/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = changeMainChangeEntityDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: false, create: false},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					changeMainConstantValues.schemes.chang2Externals),
					platformDataServiceEntityReadonlyProcessor],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = changeMainChangeEntityDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'Change2External', parentService: changeMainChangeEntityDataService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(changeMainServiceOption, self);
		serviceContainer.data.Initialised = true;
	}
})(angular);
