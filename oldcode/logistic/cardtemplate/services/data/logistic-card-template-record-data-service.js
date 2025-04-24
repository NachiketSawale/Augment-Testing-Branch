/**
 * Created by baf on 19.03.2019
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('logistic.cardtemplate');

	/**
	 * @ngdoc service
	 * @name logisticCardTemplateRecordDataService
	 * @description pprovides methods to access, create and update logistic cardTemplate record entities
	 */
	myModule.service('logisticCardTemplateRecordDataService', LogisticCardTemplateRecordDataService);

	LogisticCardTemplateRecordDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'logisticCardTemplateConstantValues', 'logisticCardTemplateActivityDataService',
		'$http', '$q', 'logisticJobCardTemplateRecordProcessorService'];

	function LogisticCardTemplateRecordDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, logisticCardTemplateConstantValues, logisticCardTemplateActivityDataService,
		$http, $q, logisticJobCardTemplateRecordProcessorService) {
		var service;
		var data;
		var self = this;
		var logisticCardTemplateRecordServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'logisticCardTemplateRecordDataService',
				entityNameTranslationID: 'logistic.common.recordEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'logistic/cardtemplate/recordtemplate/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = logisticCardTemplateActivityDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					logisticCardTemplateConstantValues.schemes.cardTemplateRecord), logisticJobCardTemplateRecordProcessorService],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = logisticCardTemplateActivityDataService.getSelected();
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
					leaf: {itemName: 'RecordTemplates', parentService: logisticCardTemplateActivityDataService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(logisticCardTemplateRecordServiceOption, self);
		serviceContainer.data.Initialised = true;
		service = serviceContainer.service;
		data = serviceContainer.data;

		data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'logisticCardTemplateRecordValidationService'
		}, logisticCardTemplateConstantValues.schemes.cardTemplateRecord));

		function takeOverCodeAndDescription(record, article) {
			if(!_.isNull(article) && !_.isUndefined(article)) {
				if(_.isNil(record.DescriptionInfo) || _.isNil(record.DescriptionInfo.Translated) || !record.DescriptionInfo.Translated.length) {
					record.DescriptionInfo.Description = article.DescriptionInfo.Translated;
					record.DescriptionInfo.Translated = article.DescriptionInfo.Translated;
				}
				record.CardRecordDescription = article.DescriptionInfo.Translated;
				record.UomFk = article.UomFk;

				data.markItemAsModified(record, data);
			}
		}

		function getArticleInformation(artId, artType) {
			return $http.post(globals.webApiBaseUrl + 'logistic/cardtemplate/recordtemplate/articleinformation', {
				Id: artId,
				PKey3: artType
			});
		}

		service.setArticleInformation = function (item){
			switch (item.JobCardRecordTypeFk) {
				case logisticCardTemplateConstantValues.type.plant:
					return getArticleInformation(item.PlantFk, item.JobCardRecordTypeFk).then(function(result) {
						takeOverCodeAndDescription(item, result.data);
						return item;
					});
				case logisticCardTemplateConstantValues.type.material:
					return getArticleInformation(item.MaterialFk, item.JobCardRecordTypeFk).then(function(result) {
						takeOverCodeAndDescription(item, result.data);
						return item;
					});
				case logisticCardTemplateConstantValues.type.sundryService:
					return getArticleInformation(item.SundryServiceFk, item.JobCardRecordTypeFk).then(function(result) {
						takeOverCodeAndDescription(item, result.data);
						return item;
					});

				default: return $q.when(item);
			}
		};

	}
})(angular);
