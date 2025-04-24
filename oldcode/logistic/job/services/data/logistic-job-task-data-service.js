/**
 * Created by welss on 12.04.2019
 */

(function (angular) {
	'use strict';
	var myModule = angular.module('logistic.job');

	/**
	 * @ngdoc service
	 * @name logisticJobTaskDataService
	 * @description provides methods to access, create and update logistic job task entities
	 */
	myModule.service('logisticJobTaskDataService', LogisticJobTaskDataService);

	LogisticJobTaskDataService.$inject = ['$http', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'logisticJobDataService','basicsCommonMandatoryProcessor'];

	function LogisticJobTaskDataService($http, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, logisticJobDataService, basicsCommonMandatoryProcessor) {
		var self = this;
		var logisticJobTaskServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'logisticJobTaskDataService',
				entityNameTranslationID: 'logistic.job.jobTaskListTitle',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'logistic/job/jobtask/',
					endRead: 'listbyParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = logisticJobDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = logisticJobDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'JobTasks', parentService: logisticJobDataService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(logisticJobTaskServiceOption, self);
		serviceContainer.data.Initialised = true;

		serviceContainer.data.typeChanged = new Platform.Messenger();
		serviceContainer.service.registerTypeChanged = function (callBackFn) {
			serviceContainer.data.typeChanged.register(callBackFn);
		};
		serviceContainer.service.unregisterTypeChanged = function (callBackFn) {
			serviceContainer.data.typeChanged.unregister(callBackFn);
		};
		serviceContainer.service.typeChanged = function typeChanged(e, entity) {
			serviceContainer.data.typeChanged.fire(e, entity);
		};

		serviceContainer.data.articleChanged = new Platform.Messenger();
		serviceContainer.service.registerArticleChanged = function (callBackFn) {
			serviceContainer.data.articleChanged.register(callBackFn);
		};
		serviceContainer.service.unregisterArticleChanged = function (callBackFn) {
			serviceContainer.data.articleChanged.unregister(callBackFn);
		};
		serviceContainer.service.articleChanged = function articleChanged(entity, value) {
			serviceContainer.data.articleChanged.fire(entity, value);
		};

		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			mustValidateFields: true,
			typeName: 'JobTaskDto',
			moduleSubModule: 'Logistic.Job',
			validationService: 'logisticJobTaskValidationService'
		});

		serviceContainer.service.registerArticleChanged(getArticleInformation);

		function getArticleInformation(entity, value){
			var ident = {
				Id: entity.Id,
				PKey1: value,
				PKey2: entity.JobTaskTypeFk
			};
			return $http.post(logisticJobTaskServiceOption.flatLeafItem.httpCRUD.route + 'articleinformation', ident).then(function(result){
				if(result && result.data){
					entity.ContractHeaderFk = result.data.ContractHeaderFk;
					entity.BusinessPartnerFk = result.data.BusinessPartnerFk;
					entity.InvHeaderFk = result.data.InvHeaderFk;

					serviceContainer.data.markItemAsModified(entity, serviceContainer.data);
				}
				return entity;
			});
		}
	}
})(angular);
