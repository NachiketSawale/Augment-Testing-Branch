/**
 * Created by baf on 19.03.2019
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('logistic.card');

	/**
	 * @ngdoc service
	 * @name logisticCardActivityDataService
	 * @description pprovides methods to access, create and update logistic card activity entities
	 */
	myModule.service('logisticCardActivityDataService', LogisticCardActivityDataService);

	LogisticCardActivityDataService.$inject = ['_', 'platformDataServiceFactory', '$http', '$q', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'logisticCardConstantValues', 'logisticCardDataService', 'logisticJobDataService', 'logisticActivityReadOnlyProcessor', 'platformRuntimeDataService'];

	function LogisticCardActivityDataService(_, platformDataServiceFactory, $http, $q, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, logisticCardConstantValues, logisticCardDataService, logisticJobDataService, logisticActivityReadOnlyProcessor, platformRuntimeDataService) {
		var self = this;

		var logisticCardActivityServiceOption = {
			flatNodeItem: {
				module: myModule,
				serviceName: 'logisticCardActivityDataService',
				entityNameTranslationID: 'logistic.common.activityEntity',
				httpCreate: {route: globals.webApiBaseUrl + 'logistic/card/activity/'},
				httpRead: {
					route: globals.webApiBaseUrl + 'logistic/card/activity/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = logisticCardDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat', canDeleteCallBackFunc: logisticCardDataService.canCreateOrDelete, canCreateCallBackFunc: logisticCardDataService.canCreateOrDelete},
				dataProcessor: [
					platformDataServiceProcessDatesBySchemeExtension.createProcessor(logisticCardConstantValues.schemes.activity),
					logisticActivityReadOnlyProcessor,
					{ processItem: asyncAssignProjectFk },
				],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = logisticCardDataService.getSelected();
							creationData.PKey1 = selected.Id;
						},
						handleCreateSucceeded: function handleCreateSucceeded(newItem, data) {
							if (newItem && data.itemList.length > 0) {
								let record = _.find(data.itemList, function (item) {
									let newCode = parseInt(item.Code);
									let newItemCode = parseInt(newItem.Code);
									if(!_.isNaN(newCode) && !_.isNaN(newItemCode))
										return newItemCode === newCode;
								});
								if (record) {
									let list = _.filter(data.itemList, function (item){
										let newCode = parseInt(item.Code);
										if(!_.isNaN(newCode)){
											return newCode;
										}
									});
									let newList = _.sortBy(list, function (item) {
										return parseInt(item.Code);
									});
									let lastItem = _.last(newList);
									if (lastItem) {
										let itemCode = parseInt(lastItem.Code);
										newItem.Code = parseInt(newItem.Code);
										newItem.Code = itemCode + 10;
									}
								}
							}
						}
					}
				},
				entityRole: {
					node: {itemName: 'Activities', parentService: logisticCardDataService}
				}
			}
		};

		function assignProjectFromJobCard (item, jobCardFk) {
			var jobCard = logisticCardDataService.getItemById(jobCardFk);

			if (jobCard.JobPerformingFk) {
				var jobPerforming = logisticJobDataService.getItemById(jobCard.JobPerformingFk);
				item.ProjectFk = jobPerforming.ProjectFk;

				platformRuntimeDataService.readonly(item, [{ field: 'ControllingUnitFk', readonly: item.ProjectFk === null }]);
			}
		}

		function asyncAssignProjectFk (item) {
			var deffered = $q.defer();

			if (item.ProjectFk === null) {
				var jobs = logisticJobDataService.getList();

				if (jobs.length === 0) {
					logisticJobDataService.load()
						.then(function () {
							assignProjectFromJobCard(item, item.JobCardFk);
							deffered.resolve();
						});

				} else {
					var p = new Promise(function (resolve /* , reject */) {
						assignProjectFromJobCard(item, item.JobCardFk);
						resolve();
					});

					p.then(function () {
						deffered.resolve();
					});
				}
			}

			return deffered.promise;
		}


		var serviceContainer = platformDataServiceFactory.createService(logisticCardActivityServiceOption, self);

		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'logisticCardActivityValidationService'
		}, logisticCardConstantValues.schemes.activity));
	}
})(angular);
