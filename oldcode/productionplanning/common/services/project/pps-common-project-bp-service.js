/**
 * Created by lav on 6/25/2019.
 */
(function (angular) {
	/*global angular*/
	/*global globals*/
	'use strict';
	var moduleName = 'productionplanning.common';

	/**
	 * @ngdoc service
	 * @name projectPrj2BPService
	 * @function
	 *
	 * @description
	 * ppsCommonProjectBPService is the data service for all generals related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('ppsCommonProjectBPService', ['platformDataServiceFactory',
		'platformDataServiceProcessDatesBySchemeExtension',
		'platformRuntimeDataService',
		'$injector',
		'ppsCommonProjectBPValidationService',
		'basicsCommonMandatoryProcessor',

		function (platformDataServiceFactory,
				  platformDataServiceProcessDatesBySchemeExtension,
				  platformRuntimeDataService,
				  $injector,
				  ppsCommonProjectBPValidationService,
				  basicsCommonMandatoryProcessor) {

			var serviceCache = {};

			function getServiceBy(service) {
				return _.isObject(service) ? service : $injector.get(service);
			}

			function processProject(item) {
				var fields = [];

				if (!item.BusinessPartnerFk) {
					fields.push({field: 'SubsidiaryFk', readonly: true});
				}

				if (fields.length > 0) {
					platformRuntimeDataService.readonly(item, fields);
				}
			}

			function ensureInvalid(newItem) {
				if (newItem.SubsidiaryFk === 0) {
					newItem.SubsidiaryFk = null;
				}
			}

			function createNewComplete(serviceOptions) {
				var parentService = getServiceBy(serviceOptions.parentService);
				var parentFk = serviceOptions.parentFk || 'Id';
				var bpServiceInfo = {
					flatNodeItem: {
						module: moduleName,
						serviceName: parentService.getServiceName() + 'projectPrj2BPService',
						entityNameTranslationID: 'project.main.entityPrj2BP',
						dataProcessor: [{processItem: processProject}],
						httpCreate: {route: globals.webApiBaseUrl + 'project/main/project2bp/'},
						httpRead: {
							route: globals.webApiBaseUrl + 'project/main/project2bp/', endRead: 'listByProject',
							initReadData: function initReadData(readData) {
								var selected = parentService.getSelected();
								readData.filter = '?projectId=' + selected[parentFk];
							}
						},
						entityRole: {
							node: {
								itemName: 'BusinessPartners',
								parentService: parentService,
								parentFilter: 'projectId'
							}
						},
						presenter: {
							list: {
								initCreationData: function initCreationData(creationData) {
									var selectedItem = parentService.getSelected();
									creationData.Id = selectedItem[parentFk];
									delete creationData.MainItemId;
								},
								handleCreateSucceeded: function (newItem) {
									ensureInvalid(newItem);
								}
							}
						}
					}
				};

				var container = platformDataServiceFactory.createNewComplete(bpServiceInfo);
				container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
					mustValidateFields: true,
					typeName: 'Project2BusinessPartnerDto',
					moduleSubModule: 'Project.Main',
					validationService: ppsCommonProjectBPValidationService.getService(container.service)
				});
				container.service.takeOver = function takeOver(entity) {
					ensureInvalid(entity);
					var data = container.data;
					var dataEntity = data.getItemById(entity.Id, data);

					data.mergeItemAfterSuccessfullUpdate(dataEntity, entity, true, data);
					var fields = [
						{field: 'SubsidiaryFk', readonly: !dataEntity.BusinessPartnerFk}
					];
					platformRuntimeDataService.readonly(dataEntity, fields);

					var validateService = ppsCommonProjectBPValidationService.getService(container.service);
					var result = validateService.validateSubsidiaryFk(dataEntity, dataEntity.SubsidiaryFk, 'SubsidiaryFk');
					platformRuntimeDataService.applyValidationResult(result, dataEntity, 'SubsidiaryFk');

					data.markItemAsModified(dataEntity, data);
				};

				return container.service;
			}

			function getService(serviceOptions) {
				var serviceKey = serviceOptions.serviceKey;
				if (!serviceCache[serviceKey]) {
					serviceCache[serviceKey] = createNewComplete(serviceOptions);
				}
				return serviceCache[serviceKey];
			}

			return {
				getService: getService
			};

		}]);
})(angular);
