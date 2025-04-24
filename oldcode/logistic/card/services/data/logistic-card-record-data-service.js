/**
 * Created by baf on 18.03.2019
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('logistic.card');

	/**
	 * @ngdoc service
	 * @name logisticCardRecordDataService
	 * @description pprovides methods to access, create and update logistic card record entities
	 */
	myModule.service('logisticCardRecordDataService', LogisticCardRecordDataService);

	LogisticCardRecordDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'logisticCardConstantValues', 'logisticCardActivityDataService', 'platformRuntimeDataService', '$http', '$q','logisticCardDataService', 'logisticJobCardRecordProcessorService'];

	function LogisticCardRecordDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, logisticCardConstantValues, logisticCardActivityDataService, platformRuntimeDataService, $http, $q, logisticCardDataService, logisticJobCardRecordProcessorService) {
		var self = this;
		var service;
		var data;
		var logisticCardRecordServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'logisticCardRecordDataService',
				entityNameTranslationID: 'logistic.common.cardRecordEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'logistic/card/record/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = logisticCardActivityDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat', canDeleteCallBackFunc: logisticCardDataService.canCreateOrDelete, canCreateCallBackFunc: logisticCardDataService.canCreateOrDelete},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					logisticCardConstantValues.schemes.record), logisticJobCardRecordProcessorService],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = logisticCardActivityDataService.getSelected();
							creationData.PKey1 = selected.Id;
							creationData.PKey2 = selected.JobCardFk;
						},
						handleCreateSucceeded: function handleCreateSucceeded(newItem, data) {
							if (newItem && data.itemList.length > 0) {
								let record = _.find(data.itemList, function (item) {
									return newItem.RecordNo === item.RecordNo;
								});
								if (record) {
									let newList = _.sortBy(data.itemList, function (item) {
										return item.RecordNo;
									});
									let lastItem = _.last(newList);
									if (lastItem) {
										newItem.RecordNo = lastItem.RecordNo + 10;
									}
								}
							}
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'Records', parentService: logisticCardActivityDataService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(logisticCardRecordServiceOption, self);
		serviceContainer.data.Initialised = true;
		service = serviceContainer.service;
		data = serviceContainer.data;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'logisticCardRecordValidationService'
		}, logisticCardConstantValues.schemes.record));

		function takeOverCodeAndDescription(record, article) {
			if(!_.isNull(article) && !_.isUndefined(article)) {
				if(_.isNil(record.Description) || !record.Description.length) {
					record.Description = article.DescriptionInfo.Translated;
				}
				record.CardRecordDescription = article.DescriptionInfo.Translated;
				record.UomFk = article.UomFk;
				record.ProcurementStructureFk = article.ProcurementStructureFk;

				data.markItemAsModified(record, data);
			}
		}

		function getArticleInformation(artId, artType) {
			return $http.post(globals.webApiBaseUrl + 'logistic/cardtemplate/recordtemplate/articleinformation', {
				Id: artId,
				PKey3: artType
			});
		}

		service.setArticleInformation = function (item, article){
			switch (item.JobCardRecordTypeFk) {
				case logisticCardConstantValues.types.record.plant:
					return getArticleInformation(article || item.PlantFk, item.JobCardRecordTypeFk).then(function(result) {
						takeOverCodeAndDescription(item, result.data);
						return item;
					});
				case logisticCardConstantValues.types.record.material:
					return getArticleInformation(article || item.MaterialFk, item.JobCardRecordTypeFk).then(function(result) {
						takeOverCodeAndDescription(item, result.data);
						return item;
					});
				case logisticCardConstantValues.types.record.sundryService:
					return getArticleInformation(article || item.SundryServiceFk, item.JobCardRecordTypeFk).then(function(result) {
						takeOverCodeAndDescription(item, result.data);
						return item;
					});

				default: return $q.when(item);
			}
		};

		service.takeOverFromCreateDispatchingJobCardWizard =  function takeOverFromCreateDispatchingJobCardWizard (response) {
			_.forEach(response, function (changedCardRecord) {
				var viewCardRecord = serviceContainer.service.getItemById(changedCardRecord.Id);
				if(viewCardRecord){
					viewCardRecord.DispatchRecordFk = changedCardRecord.DispatchRecordFk;
					service.fireItemModified(viewCardRecord);
				}
			});
		};
	}
})(angular);
