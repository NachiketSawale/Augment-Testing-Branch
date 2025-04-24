(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.common';

	angular.module(moduleName).factory('ppsCommonBizPartnerServiceFactory', ['$translate', 'platformDataServiceFactory',
		'platformDataServiceProcessDatesBySchemeExtension',
		'platformRuntimeDataService',
		'$injector',
		'ppsCommonBizPartnerValidationServiceFactory',
		'basicsCommonMandatoryProcessor',

		function ($translate,
				  platformDataServiceFactory,
				  platformDataServiceProcessDatesBySchemeExtension,
				  platformRuntimeDataService,
				  $injector,
				  ppsCommonProjectBPValidationServiceFactory,
				  basicsCommonMandatoryProcessor) {

			var serviceCache = {};

			function getServiceBy(service) {
				return _.isObject(service) ? service : $injector.get(service);
			}

			function processBizPartner(item) {
				var fields = [];

				// if (!item.BusinessPartnerFk) {
				// 	fields.push({field: 'SubsidiaryFk', readonly: true});
				// }

				if (item.Version > 0) {
					fields.push({field: 'From', readonly: true});
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
				var projectIdField = serviceOptions.projectFk;
				var ppsHeaderIdField = serviceOptions.ppsHeaderFk;
				var mntReqIdField = serviceOptions.mntReqFk;
				var bpServiceInfo = {
					flatNodeItem: {
						module: moduleName,
						serviceName: parentService.getServiceName() + 'BizPartnerService',
						entityNameTranslationID: 'productionplanning.common.entityBizPartner',
						dataProcessor: [{processItem: processBizPartner}],
						httpRead: {
							route: globals.webApiBaseUrl + 'productionplanning/common/bizpartner/',
							endRead: 'list',
							initReadData: function initReadData(readData) {
								var selected = parentService.getSelected();
								var projectId = _.isNil(_.get(selected, projectIdField)) ? -1 : _.get(selected, projectIdField);
								var ppsHeaderId = _.isNil(_.get(selected, ppsHeaderIdField)) ? -1 : _.get(selected, ppsHeaderIdField);
								var mntReqId = _.isNil(_.get(selected, mntReqIdField)) ? -1 : _.get(selected, mntReqIdField);
								readData.filter = '?projectId=' + projectId + '&ppsHeaderId=' + ppsHeaderId + '&mntreqId=' + mntReqId;
							}
						},
						httpCreate: {
							route: globals.webApiBaseUrl + 'productionplanning/common/bizpartner/',
							endCreate: 'create'
						},
						entityRole: {
							node: {
								itemName: 'CommonBizPartner',
								parentService: parentService
							}
						},
						presenter: {
							list: {
								initCreationData: function initCreationData(creationData) {
									var selectedItem = parentService.getSelected();
									creationData.Id = selectedItem.Id;
									creationData.PKey1 = _.get(selectedItem, projectIdField);
									creationData.Pkey2 = _.get(selectedItem, ppsHeaderIdField);
								}
							}
						},
						actions: {
							delete: true, create: 'flat',
							canCreateCallBackFunc: function () {
								// As default condition of creation, we only create project-businessPartner(not ppsHeader-businessPartner or mntReq-businessPartner).
								// So for creation, we need to check if we can get projectId(as creation parameter) from parentItem. If we can't, create-functionality should be disabled.
								var selectedItem = parentService.getSelected();
								var projectId = _.get(selectedItem, projectIdField);
								return !_.isNil(projectId);
							}
						}
					}
				};

				var container = platformDataServiceFactory.createNewComplete(bpServiceInfo);
				container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
					mustValidateFields: true,
					typeName: 'Project2BusinessPartnerDto',
					moduleSubModule: 'Project.Main',
					validationService: ppsCommonProjectBPValidationServiceFactory.getService(container.service)
				});
				container.service.takeOver = function takeOver(entity) {
					ensureInvalid(entity);
					var data = container.data;
					var dataEntity = data.getItemById(entity.Id, data);

					data.mergeItemAfterSuccessfullUpdate(dataEntity, entity, true, data);
					// var fields = [
					// 	{field: 'SubsidiaryFk', readonly: !dataEntity.BusinessPartnerFk}
					// ];
					// platformRuntimeDataService.readonly(dataEntity, fields);

					var validateService = ppsCommonProjectBPValidationServiceFactory.getService(container.service);
					var result = validateService.validateSubsidiaryFk(dataEntity, dataEntity.SubsidiaryFk, 'SubsidiaryFk');
					platformRuntimeDataService.applyValidationResult(result, dataEntity, 'SubsidiaryFk');

					data.markItemAsModified(dataEntity, data);
				};

				// override findItemToMerge method
				var orginalFindItemToMerge = container.service.findItemToMerge;
				container.service.findItemToMerge = function newFindItemToMerge(item2Merge){
					var result = undefined;
					if(item2Merge){
						result = orginalFindItemToMerge(item2Merge); // original method that find by `Id`
						// find by `InitialId` if cannot find by `Id`. `InitialId` is only useful on creation/first-time-saving
						if(_.isNil(result)){
							result = (!item2Merge || !item2Merge.InitialId) ? undefined : _.find(container.service.getList(), {InitialId: item2Merge.InitialId});
						}
					}
					return result;
				};

				// for avoiding undefined error when calling communicationFormatter of email field, override onCreateSucceeded method to pre-setting property __rt$data.
				var orginalOnCreateSucceeded = container.data.onCreateSucceeded;
				container.data.onCreateSucceeded = function (newData, data, creationData) {
					if (!newData.__rt$data) {
						newData.__rt$data = {};
					}
					orginalOnCreateSucceeded(newData, data, creationData);
				};

				// for refreshing fields email and telephonenumber, here we have to override mergeItemAfterSuccessfullUpdate method.
				var orginalMergeItemAfterSuccessfullUpdate = container.data.mergeItemAfterSuccessfullUpdate;
				container.data.mergeItemAfterSuccessfullUpdate = function (oldItem, newItem, handleItem, data) {
					orginalMergeItemAfterSuccessfullUpdate(oldItem, newItem, handleItem, data);
					data.dataModified.fire(); // refresh UI
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
