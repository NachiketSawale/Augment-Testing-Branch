/**
 * Created by baf on 30.01.2018
 */

(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'logistic.dispatching';

	/**
	 * @ngdoc controller
	 * @name logisticDispatchingRecordUIConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  logistic dispatching ui entity.
	 **/
	angular.module(moduleName).service('logisticDispatchingRecordDropService', LogisticDispatchingRecordDropService);

	LogisticDispatchingRecordDropService.$inject = ['_', '$q', 'platformDropServiceFactory', 'logisticDispatchingHeaderDataService',
		'logisticDispatchingRecordDataService', 'logisticDispatchingConstantValues', 'platformPermissionService', '$http',
		'$injector', 'logisticDispatchingRecordRuntimeService', 'platformRuntimeDataService',
		'logisticDispatchingRecordValidationService', 'logisticDispatchingRecordAsyncArticleValidationService',
		'platformDataValidationService'
	];

	function LogisticDispatchingRecordDropService(
		_, $q, platformDropServiceFactory, logisticDispatchingHeaderDataService,
		logisticDispatchingRecordDataService, logisticDispatchingConstantValues, platformPermissionService, $http,
		$injector, logisticDispatchingRecordRuntimeService, platformRuntimeDataService,
		logisticDispatchingRecordValidationService, logisticDispatchingRecordAsyncArticleValidationService,
		platformDataValidationService) {
		var self = this;

		this.isValidSource = function isValidSource(source) {
			return !_.isNull(source) && !_.isUndefined(source) && !_.isNull(source.data) && !_.isUndefined(source.data) && source.data.length > 0;
		};

		this.makeArticleFieldValid = function makeArticleFieldValid(record) {
			let res = logisticDispatchingRecordValidationService.validateArticleFk(record, record.ArticleFk, 'ArticleFk');

			platformRuntimeDataService.applyValidationResult(res, record, 'ArticleFk');
		};

		this.getCreationCommand = function getCreationCommand() {
			var selHeader = logisticDispatchingHeaderDataService.getSelected();

			return {
				PKey1: selHeader.Id,
				PKey2: selHeader.CompanyFk
			};
		};

		var isReadyForDispatching;

		function getJobCardStatus() {
			if (_.isNil(isReadyForDispatching)) {
				var lookup = $injector.get('basicsLookupdataSimpleLookupService');
				lookup.refreshCachedData({
					valueMember: 'Id',
					displayMember: 'Description',
					lookupModuleQualifier: 'basics.customize.jobcardstatus',
					filter: {
						customBoolProperty: 'ISREADYFORDISPATCHING',
						field: 'Isreadyfordispatching'
					}
				}).then(function (response) {
					if (response) {
						var isready = _.find(response, {Isreadyfordispatching: true});
						isReadyForDispatching = isready && isready.Id ? isready.Id : null;
					}
				});
			}
			return isReadyForDispatching;
		}

		this.dropJobMaterialStockRecord = function dropJobMaterialStockRecord(source /* , itemOnDragEnd, itemService */) {
			if (self.isValidSource(source)) {
				var creationCmd = self.getCreationCommand();
				const data = {
					projectStockIds: source.data.map((material) => material.PrjStockFk),
					matIds: source.data.map((material) => material.MdcMaterialFk),
				};

				return $http.post(globals.webApiBaseUrl + 'basics/material/material2projectstock/getbystockandmaterial', data).then(function (res) {
					if (res && res.data) {
						const material2ProjectStockDtos = res.data;

						creationCmd.Id = _.size(source.data);
						creationCmd.PKey3 = logisticDispatchingConstantValues.record.type.material;

						return $http.post(globals.webApiBaseUrl + 'logistic/dispatching/record/multicreate', creationCmd).then(function (created) {
							let index = 0;
							let records = created.data;

							_.forEach(source.data, function (material) {
								let stockLocationFk = null;
								if (material2ProjectStockDtos.length !== 0) {
									stockLocationFk = _.filter(material2ProjectStockDtos, {
										ProjectStockFk: material.PrjStockFk,
										MaterialFk: material.MdcMaterialFk
									})[0].StockLocationFk;
								}

								let record = records[index];
								record.Quantity = 1.00;
								record.UoMFk = material.UoMFk || 0;
								record.RecordTypeFk = logisticDispatchingConstantValues.record.type.material;
								record.MaterialCatalogFk = material.MaterialCatalogFk;
								record.MaterialFk = material.MdcMaterialFk;
								record.ArticleFk = material.MdcMaterialFk;
								record.PrjStockFk = material.PrjStockFk;
								record.PrjStockLocationFk = stockLocationFk;
								record.PrcStructureFk = material.PrcStructureFk;
								record.ProductFk = material.ProductFk !== null ? material.ProductFk : record.ProductFk;
								++index;
							});

							logisticDispatchingRecordDataService.takeOverRecords(records);

							_.forEach(records, function (record) {
								logisticDispatchingRecordRuntimeService.lockProductFk(record);
								logisticDispatchingRecordValidationService.validateWorkOperationTypeFk(record, null, 'WorkOperationTypeFk');
								logisticDispatchingRecordAsyncArticleValidationService.validateRecordArticleAsynchronouosly({
									dispatchRecord: record,
									newArticle: record.MaterialFk,
									validator: logisticDispatchingRecordValidationService,
									service: logisticDispatchingRecordDataService
								});

								self.makeArticleFieldValid(record);
								logisticDispatchingRecordDataService.markItemAsModified(record);
							});

							return true;
						});
					}
				});
			}
		};

		this.executeDropPlantStockRecord = function (plantLocations) {
			let creationCmd = self.getCreationCommand();
			return $http.get(globals.webApiBaseUrl + 'resource/wot/workoperationtype/getdefaultbycontext', creationCmd.PKey2).then(function (res) {
				let defaultWorkOperationTypeFk = res.data.Id;
				creationCmd.Id = _.size(plantLocations);
				creationCmd.PKey3 = logisticDispatchingConstantValues.record.type.plant;

				return $http.post(globals.webApiBaseUrl + 'logistic/dispatching/record/multicreate', creationCmd).then(function (created) {
					let index = 0;
					let records = created.data;

					_.forEach(plantLocations, function (plant) {
						let record = records[index];
						record.Quantity = plant.PlantIsBulk ? 0.0 : 1.0;
						record.UoMFk = plant.UoMFk;
						record.RecordTypeFk = logisticDispatchingConstantValues.record.type.plant;
						record.ArticleFk = plant.PlantFk;
						record.PlantFk = plant.PlantFk;
						record.IsBulkPlant = plant.PlantIsBulk;
						record.PrecalculatedWorkOperationTypeFk = plant.PlantIsBulk ? plant.WorkOperationTypeFk : null;
						record.WorkOperationTypeFk = defaultWorkOperationTypeFk;

						++index;
					});

					logisticDispatchingRecordDataService.takeOverRecords(records);

					_.forEach(records, function (record) {
						logisticDispatchingRecordAsyncArticleValidationService.validateRecordArticleAsynchronouosly({
							dispatchRecord: record,
							newArticle: record.PlantFk,
							validator: logisticDispatchingRecordValidationService,
							service: logisticDispatchingRecordDataService
						}).then(function (errorInfo) {
							if(record.IsBulkPlant){
								let error = platformRuntimeDataService.createInvalidError('logistic.dispatching.errors.enterBulkQuantity');
								platformRuntimeDataService.applyValidationResult(error, record, 'Quantity');
								platformDataValidationService.finishValidation(error, record, record.Quantity, 'Quantity', logisticDispatchingRecordValidationService, logisticDispatchingRecordDataService);
								logisticDispatchingRecordDataService.markItemAsModified(record);
							}
						});
						self.makeArticleFieldValid(record);
						logisticDispatchingRecordDataService.markItemAsModified(record);
					});

					return true;
				});
			});
		};

		this.dropJobPlantStockRecord = function dropJobPlantStockRecord(source/* , itemOnDragEnd, itemService */) {
			if (self.isValidSource(source)) {
				self.executeDropPlantStockRecord(source.data);
			}
		};

		this.dropJobCard = function dropJobCard(source/* , itemOnDragEnd, itemService */) {
			let header = logisticDispatchingHeaderDataService.getSelected();
			if (self.isValidSource(source) && header) {
				let data = {
					JobId: header.Job1Fk,
					JobCardId: null,
					JobCardIds: _.map(source.data, 'Id'),
					DispatchHeader: header
				};
				filterAlreadyDragedItems(header, data);

				$http.post(globals.webApiBaseUrl + 'logistic/dispatching/header/dispatchnotefromjobcardwithoutheaderbydraganddrop', data)
					.then(function (result) {
						if (result && result.data) {
							logisticDispatchingHeaderDataService.takeOverHeadersFromDragedJobCards2DispRecords([result.data.DispatchHeader]);
							logisticDispatchingRecordDataService.takeOverRecords(result.data.DispatchRecordToSave);
						}
					});
			}
		};

		function filterAlreadyDragedItems(header, data) {
			if( !_.isArray(header.DragedJobCards2DispRecordsIds)){
				header.DragedJobCards2DispRecordsIds = [];
			}
			let validIds = [];
			_.forEach(data.JobCardIds, function (jobId) {
				if (header.DragedJobCards2DispRecordsIds && !header.DragedJobCards2DispRecordsIds.includes(jobId)) {
					validIds.push(jobId);
				}
			});
			data.JobCardIds = validIds;
		}

		platformDropServiceFactory.initializeDropService(self, [
			{
				type: 'sourceJobMaterialStock',
				fn: self.dropJobMaterialStockRecord
			},
			{
				type: 'sourceJobPlantStock',
				fn: self.dropJobPlantStockRecord
			},
			{
				type: 'sourceJobCard',
				fn: self.dropJobCard
			},
			{
				type: 'performingJobLocation',
				fn: self.dropJobPlantStockRecord
			}
		]);

		var doCanPaste = self.doCanPaste;

		self.canPastLocations2DispatchRecord = function (locations) {
			var allDispatchRecords = logisticDispatchingRecordDataService.getList();
			return  !_.some(locations, function (dragItem) {
				return _.some(allDispatchRecords, function (dispRec) {
					return dragItem.PlantFk === dispRec.ArticleFk && (dispRec.WorkOperationIsHire || dispRec.IsBulkPlant);
				});
			});
		};

		self.doCanPaste = function doCanPasteNew(source, target) {
			var res = doCanPaste(source);
			if (res && !platformPermissionService.hasWrite('2aba47e0b663449e8cd86d5e6258e417')) {
				res = false;
			}
			if (res && source && source.type === 'sourceJobCard') {
				if (source && source.data && source.data[0].JobCardStatusFk !== getJobCardStatus()) {
					res = false;
				}
			}
			else if (res && source && (source.type === 'sourceJobPlantStock' || source.type === 'performingJobLocation') && target === 'dispatchRecord') {
				res = self.canPastLocations2DispatchRecord(source.data);
			}
			else if (res && source && (source.type === 'sourceJobPlantStock' || source.type === 'performingJobLocation') && target !== 'dispatchRecord') {
				res = false;
			}
			return res;
		};
	}
})(angular);
