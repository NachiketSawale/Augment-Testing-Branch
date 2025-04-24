/**
 * Created by leo on 12.03.2018.
 */
(function (angular) {
	'use strict';
	var myModule = angular.module('logistic.job');

	/**
	 * @ngdoc service
	 * @name logisticJobPrj2MaterialPriceConditionDataService
	 * @description pprovides methods to access, create and update logistic job Material entities
	 */
	myModule.service('logisticJobPrj2MaterialPriceConditionDataService', LogisticJobPrj2MaterialPriceConditionDataService);

	LogisticJobPrj2MaterialPriceConditionDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'logisticJobPrj2MaterialDataService', 'basicsCommonMandatoryProcessor'];

	function LogisticJobPrj2MaterialPriceConditionDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
	                                                          logisticJobPrj2MaterialDataService, mandatoryProcessor) {
		var self = this;
		var option = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'logisticJobPrj2MaterialPriceConditionDataService',
				entityNameTranslationID: 'logistic.job.prjMaterialPriceConditionListTitle',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'logistic/job/project2materialpricecondition/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = logisticJobPrj2MaterialDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: 'Project2MaterialPriceConditionDto',
					moduleSubModule: 'Logistic.Job'
				})],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = logisticJobPrj2MaterialDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {
						itemName: 'MaterialPriceConditions',
						parentService: logisticJobPrj2MaterialDataService
					}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(option, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = mandatoryProcessor.create({
			mustValidateFields: true,
			typeName: 'Project2MaterialPriceConditionDto',
			moduleSubModule: 'Logistic.Job',
			validationService: 'logisticJobPrj2MaterialPriceCondValidationService'
		});
	}
})(angular);
