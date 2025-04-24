(function () {

	/* global angular, globals */
	'use strict';
	var moduleName = 'productionplanning.common';

	/* jshint -W072*/ //many parameters because of dependency injection
	angular.module(moduleName).service('ppsCommonTransportInfoHelperService', Service);

	Service.$inject = ['basicsLookupdataLookupDescriptorService', 'moment', 'platformRuntimeDataService',
		'platformDataValidationService', 'basicsLookupdataConfigGenerator', '$injector', '_',
		'platformDataServiceDataProcessorExtension', 'productionplanningCommonActivityDateshiftService', '$http', '$q', 'platformDateshiftHelperService',
		'$rootScope', 'platformDataServiceModificationTrackingExtension'];

	function Service(basicsLookupdataLookupDescriptorService, moment, platformRuntimeDataService,
					 platformDataValidationService, basicsLookupdataConfigGenerator, $injector, _,
					 platformDataServiceDataProcessorExtension, ppsActivityDateshiftService, $http, $q, platformDateshiftHelperService,
					 $rootScope, platformDataServiceModificationTrackingExtension) {

		var trsReqCache = {serviceContainers: [], trsReqs: []};

		//has to call when refresh/search
		function clearCache() {
			trsReqCache.trsReqs = [];
		}

		function getTrsReqFromCache(trsReqId) {
			return _.find(trsReqCache.trsReqs, {Id: trsReqId});
		}

		function updateTrsReqInfo(entity) {
			var existed = getTrsReqFromCache(entity.TrsRequisitionFk);
			if (_.isNil(existed)) {
				return;
			}
			entity.TrsRequisitionDate = moment.utc(existed.PlannedStart);
			entity.TrsRequisitionEventFk = existed.PpsEventFk;
			entity.TrsReqStatusFk = existed.TrsReqStatusFk;
		}

		function trsReqLinkOthers(entity) {
			var existed = getTrsReqFromCache(entity.TrsRequisitionFk);
			return _.get(existed, 'TrsGoods.length') > 1;
		}

		let updateDone = true;
		$rootScope.$on('updateDone', ()=>updateDone = true);

		function registerItemModified(serviceContainer, validationService) {
			if (trsReqCache.serviceContainers.indexOf(serviceContainer) === -1) {
				trsReqCache.serviceContainers.push(serviceContainer);
				$rootScope.$on('updateRequested', ()=>{
					var updateData = platformDataServiceModificationTrackingExtension.getModifications(serviceContainer.service);
					if (updateData && updateData.EntitiesCount >= 1) {
						updateDone = false; // there exists updateData, means update request going to start
					}
				});
			}
			var processTransportInfo = function (items, isModified) {
				_.forEach(items, function (item) {
					if (item.TrsRequisitionFk !== null) {
						item.hasTrsReq = true;
						var requisition = basicsLookupdataLookupDescriptorService.getLookupItem('TrsRequisition', item.TrsRequisitionFk);
						if (!_.isNil(requisition)) {
							var existed = _.find(trsReqCache.trsReqs, {Id: requisition.Id});//always use own cache to calculate
							if (_.isNil(existed)) {
								trsReqCache.trsReqs.push(requisition);
								existed = requisition;
							}
							updateTrsReq(item, existed, validationService, isModified, serviceContainer);
						} else {
							basicsLookupdataLookupDescriptorService.loadItemByKey({
								ngModel: item.TrsRequisitionFk,
								options: {lookupType: 'TrsRequisition', version: 3}
							}).then(function (result) {
								if (!_.isNil(result)) {
									processTransportInfo([item], isModified);//this should be triggered by create new trs-req, so isModified false
								}
								serviceContainer.service.gridRefresh();//refresh show update UI
							});
						}
					} else {
						updateTrsReq(item, null, validationService, isModified, serviceContainer);
					}
				});
			};
			var onItemModifies = function (e, item) {
				if(updateDone){
					processTransportInfo([item], true);
				}
			};
			serviceContainer.service.registerItemModified(onItemModifies);
			var clearContentOldFn = serviceContainer.data.clearContent;
			serviceContainer.data.clearContent = function () {//extend to clear cache
				clearContentOldFn(serviceContainer.data);
				clearCache();
			};
			serviceContainer.service.processTransportInfo = processTransportInfo;
		}

		function updateTrsReq(item, requisition, validationService, isModified, currentServiceContainer) {
			var dateChange;
			var oldRequisition = getTrsReqFromCache(item.TrsRequisitionFkBak);
			if (requisition === null) {
				if (item.hasTrsReq) {
					item.TrsRequisitionDate = null;
					dateChange = true;
				}
				item.hasTrsReq = false;
			} else if (oldRequisition !== requisition) {
				dateChange = true;
			} else {
				requisition.PlannedStart = item.TrsRequisitionDate;
			}
			updateTrsReqInfo(item);
			item.TrsRequisitionFkBak = requisition ? requisition.Id : null;
			if (isModified) {
				if (oldRequisition !== requisition) {
					var type = null;
					if (Object.prototype.hasOwnProperty.call(item, 'ProductStatusFk')) {
						type = 2;
					} else if (Object.prototype.hasOwnProperty.call(item, 'TrsBundleStatusFk')) {
						type = 3;
					}
					var targetTrsGoods = {'m_Item1': type, 'm_Item2': item.Id};
					if (oldRequisition) {//remove old
						oldRequisition.TrsGoods = oldRequisition.TrsGoods || [];
						var existed = _.find(oldRequisition.TrsGoods, targetTrsGoods);
						if (!existed) {
							// eslint-disable-next-line no-console
							console.warn('Could not find record in TrsGoods cache!');
						} else {
							oldRequisition.TrsGoods.splice(_.indexOf(oldRequisition.TrsGoods, existed), 1);
						}
					}
					if (requisition) {//add new
						requisition.TrsGoods = requisition.TrsGoods || [];
						requisition.TrsGoods.push(targetTrsGoods);
					}
				}
				if (dateChange && validationService) {
					validationService = _.isObject(validationService) ? validationService : $injector.get(validationService);
					var result = validationService.validateTrsRequisitionDateManual(item, item.TrsRequisitionDate, 'TrsRequisitionDate');
					platformRuntimeDataService.applyValidationResult(result, item, 'TrsRequisitionDate');
				}
				var relatedContainers = _.filter(trsReqCache.serviceContainers, function (sc) {
					return sc.service.getModule() === currentServiceContainer.service.getModule();
				});
				_.forEach(relatedContainers, function (serviceContainer) {
					platformDataServiceDataProcessorExtension.doProcessData(serviceContainer.data.itemList, serviceContainer.data);
					_.forEach(serviceContainer.data.itemList, function (dataItem) {
						updateTrsReqInfo(dataItem);
					});
					serviceContainer.service.gridRefresh();
				});
			}
		}

		function addValidations(dataService, validateService) {
			let moduleName = dataService.getModule().name === 'productionplanning.item' ? 'productionplanning.common' : dataService.getModule().name;
			let registeredVirtualDataService = ppsActivityDateshiftService.getVirtualDataServiceByMatch(moduleName);
			let dateshiftId = 'trsReqBundleDateshift';
			const needValidate = (entity) => {
				return angular.isDefined(entity.TrsReq_DateshiftMode) && entity.TrsReq_DateshiftMode === 1;
			};

			validateService.validateTrsRequisitionDateManual = function validateTrsRequisitionDate(entity, value, model) {
				let result = true;
				if (!needValidate(entity)) {
					return result;
				}
				let start = !entity.TrsReq_Start ? null : moment.utc(entity.TrsReq_Start);
				let end = !entity.TrsReq_Finish ? null : moment.utc(entity.TrsReq_Finish);
				if (value && start && end && (value < start || value > end)) {
					result = platformDataValidationService.createErrorObject('cloud.common.amongValueErrorMessage', {
						object: model.toLowerCase(),
						rang: '(' + start.format('L LTS') + ') - (' + end.format('L LTS') + ')'
					}, true);
				}
				return platformDataValidationService.finishValidation(result, entity, value, model, validateService, dataService);
			};

			validateService.validateTrsRequisitionDate = (entity, value, model) => {
				let result = true;
				if (!needValidate(entity)) {
					return result;
				}
				let start = !entity.TrsReq_Start ? null : moment.utc(entity.TrsReq_Start);
				let end = !entity.TrsReq_Finish ? null : moment.utc(entity.TrsReq_Finish);
				if (value && start && end && (value < start || value > end)) {
					result = platformDataValidationService.createErrorObject('cloud.common.amongValueErrorMessage', {
						object: model.toLowerCase(),
						rang: '(' + start.format('L LTS') + ') - (' + end.format('L LTS') + ')'
					}, true);
				}
				return platformDataValidationService.finishValidation(result, entity, value, model, validateService, dataService);

			};

			validateService.asyncValidateTrsRequisitionDate = function asyncValidateTrsRequisitionDate(entity, value, model) {
				let asyncValidation = $q.when(value);
				//treat like a slot!
				if (_.isNil(entity.TrsRequisitionFk) && _.isNil(entity[model]) && !_.isNil(value)) {
					asyncValidation = $http.post(globals.webApiBaseUrl + 'productionplanning/common/event/create', {}).then((response) => {
						//set event id
						entity.TrsRequisitionEventFk = response.data.Id;
						//register created event!
						if (!_.isNil(registeredVirtualDataService)) {
							let subEvents = [{
								Id: entity.TrsRequisitionEventFk,
								PlannedStart: value,
								PlannedFinish: value
							}];
							let addedVirtualEntities = {
								Event: subEvents
							};
							registeredVirtualDataService.addVirtualEntities(addedVirtualEntities);
							//find connected entity based on parent entity!
							let superEvent = {
								Id: entity.TrsReq_EventFk,
								DateshiftMode: entity.TrsReq_DateshiftMode
							};
							registeredVirtualDataService.changeEvents(subEvents, null, superEvent);
						}
						return value;
					});
				} else {
					//if event already exists: shift date
					let dateshiftEntity = {
						PpsEventFk: entity.TrsRequisitionEventFk,
						PlannedStart: entity.TrsRequisitionDate
					};
					asyncValidation = ppsActivityDateshiftService.shiftActivityAsync(dateshiftEntity, value, 'PlannedStart', moduleName, null, dateshiftId).then((dsResult) => {
						return dsResult.value;
					});
				}
				return asyncValidation.then((newValue) => {
					let syncValidationResult = validateService.validateTrsRequisitionDateManual(entity, newValue, model);
					return {
						valid: syncValidationResult,
						apply: value.isSame(newValue)
					};
				});
			};

			//finally, check for virtual data service
			if (!_.isNil(registeredVirtualDataService)) {
				//initialize dateshift options
				var dateshiftOptions = [{id: 'dateshiftModes', hidden: true, value: 'both'}, {id: 'fullshift', hidden: true, value: true}];
				platformDateshiftHelperService.getDateshiftTools(registeredVirtualDataService.getServiceName(), dateshiftOptions, dateshiftId);

				//update values on virtual data update
				var onVirtualDataChangedCallback = function (modifiedGenericEntities) {
					let matchingEntities = [];
					_.forEach(dataService.getList(), (trsInfoEntity) => {
						let matchingEntity = _.find(modifiedGenericEntities, (genEntity) => {
							return genEntity.EntityName === 'Event' && genEntity.Id === trsInfoEntity.TrsRequisitionEventFk;
						});
						if (_.isNil(matchingEntity) || trsInfoEntity.TrsRequisitionDate.isSame(matchingEntity.StartDate)) {
							return;
						}
						trsInfoEntity.TrsRequisitionDate = moment(matchingEntity.StartDate);
						matchingEntities.push(matchingEntity);
					});
					if (!_.isEmpty(matchingEntities)) {
						dataService.gridRefresh();
						//remove the generic entity from the list of modified entities via vds
						//TODO: Find a solution that balances transport info helper and dateshift
						registeredVirtualDataService.markEntitiesAsUnmodified(matchingEntities);
					}
				};
				registeredVirtualDataService.onVirtualDataChanged.register(onVirtualDataChangedCallback);
			}
		}

		function addAdditionUiConfiguration(configuration) {
			var trsRequisitionStatusLookup = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.transportrequisitionstatus', null, {
				field: 'requisition.TrsReqStatusFk',
				showIcon: true
			});

			var grids = [{
				afterId: 'trsrequisitionfk',
				id: 'trsrequisitionDesc',
				field: 'TrsRequisitionFk',
				name: 'TrsRequisition-Description',
				name$tr$: 'transportplanning.requisition.entityRequisitionDesc',
				formatter: 'lookup',
				formatterOptions: {
					lookupType: 'TrsRequisition',
					displayMember: 'DescriptionInfo.Translated',
					width: 140,
					version: 3
				}
			}, _.extend({
				afterId: 'trsrequisitionDesc',
				id: 'trsRequisitionStatus',
				field: 'TrsReqStatusFk',
				name: '*Transport Requisition Status',
				name$tr$: 'transportplanning.requisition.entityRequisitionStatus',
				sortable: true
			}, trsRequisitionStatusLookup.grid), {
				afterId: 'trsRequisitionStatus',
				id: 'trsRouteCodes',
				field: 'RoutesInfo.Codes',
				name: '*Transport Codes',
				name$tr$: 'transportplanning.transport.TransportCodes',
				sortable: true,
				editor: null,
				formatter: 'description',
				readonly: true,
				navigator: {
					moduleName: 'transportplanning.transport'
				}
			}, {
				afterId: 'trsRouteCodes',
				id: 'trsRoutePlannedDelivery',
				field: 'RoutesInfo.PlannedDelivery',
				name: '*Transport Planned Delivery Time',
				name$tr$: 'transportplanning.transport.TransportDeliveryTime',
				sortable: true,
				editor: null,
				formatter: 'datetimeutc',
				readonly: true
			}];
			configuration.grid = _.concat([], configuration.grid, grids);

			var details = [_.extend({
				afterId: 'trsRouteCodes',
				rid: 'trsRequisitionStatus',
				gid: 'transport',
				model: 'TrsReqStatusFk',
				label: '*Transport Requisition Status',
				label$tr$: 'transportplanning.requisition.entityRequisitionStatus',
				readonly: true,
			}, trsRequisitionStatusLookup.detail), {
				afterId: 'trsRequisitionStatus',
				rid: 'trsRouteCodes',
				gid: 'transport',
				model: 'RoutesInfo.Codes',
				label: '*Transport Codes',
				label$tr$: 'transportplanning.transport.TransportCodes',
				type: 'description',
				readonly: true,
				navigator: {
					moduleName: 'transportplanning.transport'
				}
			}, {
				afterId: 'trsRouteCodes',
				rid: 'trsRoutePlannedDelivery',
				gid: 'transport',
				model: 'RoutesInfo.PlannedDelivery',
				label: '*Transport Planned Delivery Time',
				label$tr$: 'transportplanning.transport.TransportDeliveryTime',
				type: 'datetimeutc',
				readonly: true
			}];

			configuration.detail = _.concat([], configuration.detail, details);
		}

		function isTrsRequisitionAccepted(item) {
			var status;
			var requisition = getTrsReqFromCache(item.TrsRequisitionFk);
			if (requisition) {
				status = basicsLookupdataLookupDescriptorService.getLookupItem('TrsRequisitionStatus', requisition.TrsReqStatusFk);
			}
			return status && status.IsAccepted;
		}

		return {
			registerItemModified: registerItemModified,
			addValidations: addValidations,
			addAdditionUiConfiguration: addAdditionUiConfiguration,
			isTrsRequisitionAccepted: isTrsRequisitionAccepted,
			clearCache: clearCache,
			trsReqLinkOthers: trsReqLinkOthers,
			updateTrsReqInfo: updateTrsReqInfo
		};
	}
})();
