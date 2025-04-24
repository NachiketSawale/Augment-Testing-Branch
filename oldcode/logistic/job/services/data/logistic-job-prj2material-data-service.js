/**
 * Created by leo on 08.03.2018.
 */

(function (angular) {
	'use strict';
	var myModule = angular.module('logistic.job');

	/**
	 * @ngdoc service
	 * @name logisticJobPrj2MaterialDataService
	 * @description pprovides methods to access, create and update logistic job Material entities
	 */
	myModule.service('logisticJobPrj2MaterialDataService', LogisticJobPrj2MaterialDataService);

	LogisticJobPrj2MaterialDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 
		'logisticJobDataService', 'basicsCommonMandatoryProcessor', 'platformRuntimeDataService'];

	function LogisticJobPrj2MaterialDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, 
	                                            logisticJobDataService, mandatoryProcessor, platformRuntimeDataService) {
		var self = this;
		var logisticJobMaterialDataServiceOption = {
			flatNodeItem: {
				module: myModule,
				serviceName: 'logisticJobPrj2MaterialDataService',
				entityNameTranslationID: 'logistic.job.prjMaterialListTitle',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'logistic/job/project2material/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = logisticJobDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: false, create: false},
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = logisticJobDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					node: {
						itemName: 'Prj2Materials', 
						parentService: logisticJobDataService 
					}
				},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: 'Project2MaterialDto',
					moduleSubModule: 'Logistic.Job'
				}), {processItem: processItem}]
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(logisticJobMaterialDataServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = mandatoryProcessor.create({
			mustValidateFields: true,
			typeName: 'Project2MaterialDto',
			moduleSubModule: 'Logistic.Job',
			validationService: 'logisticJobPrj2MaterialValidationService'
		});

		function processItem(item) {
			if (item) {
				var fields = [
					{
						field: 'MaterialFk',
						readonly: !item.MaterialGroupFk
					}
				];
				platformRuntimeDataService.readonly(item, fields);
			}
		}
	}
})(angular);
