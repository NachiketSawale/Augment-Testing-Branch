/**
 * Created by waz on 2/23/2018.
 */
(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.requisition';
	var BundleModul = angular.module(moduleName);

	BundleModul.factory('transportplanningRequisitionDataServiceBuilder', TransportplanningRequisitionDataServiceBuilder);
	TransportplanningRequisitionDataServiceBuilder.$inject = [
		'$http',
		'$translate',
		'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor',
		'basicsCommonBaseDataServiceBuilder',
		'basicsLookupdataLookupDescriptorService',
		'transportplanningRequisitionAssembledService',
		'transportplanningRequisitionDataProcessor',
		'basicsLookupdataLookupFilterService'];

	function TransportplanningRequisitionDataServiceBuilder($http,
	                                                        $translate,
	                                                        platformDataServiceProcessDatesBySchemeExtension,
	                                                        basicsCommonMandatoryProcessor,
	                                                        BaseDataServiceBuilder,
	                                                        basicsLookupdataLookupDescriptorService,
	                                                        assembledService,
	                                                        dataProcessor,
	                                                        basicsLookupdataLookupFilterService) {
		var Builder = function (mainOptionsType) {
			BaseDataServiceBuilder.call(this, mainOptionsType);
			initOptions(this);
		};

		Builder.prototype = Object.create(BaseDataServiceBuilder.prototype);

		Builder.prototype.onBuildStarted = function () {
			setDefaultTranslation(this);
		};

		Builder.prototype.setupServiceContainer = function (serviceContainer) {

			function isItemAccepted(item) {
				if(!item){
					return false;
				}

				var status = basicsLookupdataLookupDescriptorService.getLookupItem('TrsRequisitionStatus', item.TrsReqStatusFk);
				return status && status.IsAccepted;
			}

			function isItemDeleteable(item) {
				if (item.Version <= 0) {
					return true;
				}

				var status = basicsLookupdataLookupDescriptorService.getLookupItem('TrsRequisitionStatus', item.TrsReqStatusFk);
				return status && status.IsDeletable;
			}

			function isSelectedItemAccepted() {
				var item = serviceContainer.service.getSelected();
				return isItemAccepted(item);
			}

			function updateProductInfo(requisitionsBundleIds) {
				$http.post(globals.webApiBaseUrl + 'transportplanning/requisition/calculateProductInfo', {
					RequisitionsBundleIds: requisitionsBundleIds
				}).then(function (response) {
					var keys = _.map(_.keys(response.data), Number);
					_.forEach(serviceContainer.data.itemList, function (item) {
						if (_.includes(keys, item.Id)) {
							item.BundleCollectionInfo = response.data[item.Id];
						}
					});
					serviceContainer.service.gridRefresh();
				});
			}

			function copy() {
				var source = serviceContainer.service.getSelected();
				if (source) {
					$http.post(globals.webApiBaseUrl + 'transportplanning/requisition/create').then(function (response) {
						var newItem = response.data;
						//newItem.AddressEntity = source.AddressEntity;
						newItem.CommentText = source.CommentText;
						newItem.ClerkFk = source.ClerkFk;
						newItem.PlannedStart = source.PlannedStart;
						newItem.PlannedTime = source.PlannedTime;
						newItem.PlannedFinish = source.PlannedFinish;
						newItem.EarliestStart = source.EarliestStart;
						newItem.EarliestFinish = source.EarliestFinish;
						newItem.LatestStart = source.LatestStart;
						newItem.LatestFinish = source.LatestFinish;
						newItem.DescriptionInfo.Description = source.DescriptionInfo.Description;
						newItem.DescriptionInfo.Translated = source.DescriptionInfo.Translated;
						newItem.LgmJobFk = source.LgmJobFk;
						newItem.BusinessPartnerFk = source.BusinessPartnerFk;
						newItem.ContactFk = source.ContactFk;
						newItem.MntActivityFk = source.MntActivityFk;
						newItem.ProjectFk = source.ProjectFk;
						newItem.ResTypeFk = source.ResTypeFk;
						newItem.SiteFk = source.SiteFk;
						newItem.IsLive = source.IsLive;
						newItem.Userdefined1 = source.Userdefined1;
						newItem.Userdefined2 = source.Userdefined2;
						newItem.Userdefined3 = source.Userdefined3;
						newItem.Userdefined4 = source.Userdefined4;
						newItem.Userdefined5 = source.Userdefined5;
						serviceContainer.data.onCreateSucceeded(newItem, serviceContainer.data);
					});
				}
			}

			function getCopyButton() {
				return [{
					id: 'copyReq',
					caption: $translate.instant('cloud.common.taskBarShallowCopyRecord'),
					type: 'item',
					iconClass: 'tlb-icons ico-copy-paste-deep',
					fn: function () {
						serviceContainer.service.copy();
					},
					disabled: function () {
						return !serviceContainer.service.getSelected();
					}
				}];
			}

			var validationService = this.validationService;
			serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'RequisitionDto',
				moduleSubModule: 'TransportPlanning.Requisition',
				validationService: validationService,
				mustValidateFields: true
			});

			serviceContainer.data.isItemAccepted = isItemAccepted;
			serviceContainer.data.isSelectedItemAccepted = isSelectedItemAccepted;
			serviceContainer.service.isItemAccepted = serviceContainer.data.isItemAccepted;
			serviceContainer.service.isSelectedItemAccepted = serviceContainer.data.isSelectedItemAccepted;
			serviceContainer.service.isItemDeleteable = isItemDeleteable;
			serviceContainer.service.updateProductInfo = updateProductInfo;
			serviceContainer.service.copy = copy;
			serviceContainer.service.getCopyButton = getCopyButton;
		};

		function initOptions(builder) {

			function setDefaultHttpResource() {
				builder.serviceOptions[builder.mainOptionsType].httpCRUD = {
					route: globals.webApiBaseUrl + 'transportplanning/requisition/'
				};
			}

			function setDefaultDataProcessor() {
				var dateProcessor = platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: 'RequisitionDto',
					moduleSubModule: 'TransportPlanning.Requisition'
				});
				builder.serviceOptions[builder.mainOptionsType].dataProcessor = [dataProcessor, dateProcessor];
			}

			function setDefaultPresenter() {
				builder.serviceOptions[builder.mainOptionsType].presenter = {
					list: {
						incorporateDataRead: function incorporateDataRead(readData, data) {
							var result = readData.Main ? assembleHttpResult(readData) : readData;
							return builder.serviceContainer.data.handleReadSucceeded(result, data);
						}
					}
				};
			}

			function assembleHttpResult(readData) {
				var result = {
					FilterResult: readData.FilterResult,
					dtos: readData.Main || []
				};
				basicsLookupdataLookupDescriptorService.attachData(readData);
				assembledService.assemble(result.dtos);
				return result;
			}

			function setDefaultActions() {
				builder.serviceOptions[builder.mainOptionsType].actions = {
					create: 'flat',
					delete: {},
					canDeleteCallBackFunc: function (selectedItem) {
						return builder.serviceContainer.service.isItemDeleteable(selectedItem);
					}
				};
			}

			setDefaultDataProcessor();
			setDefaultHttpResource();
			setDefaultPresenter();
			setDefaultActions();
		}

		function setDefaultTranslation(builder) {
			builder.serviceOptions[builder.mainOptionsType].entityNameTranslationID = 'transportplanning.requisition.entityRequisition';
			builder.serviceOptions[builder.mainOptionsType].translation = {
				uid: builder.serviceOptions[builder.mainOptionsType].serviceName,
				title: 'transportplanning.requisition.entityRequisition',
				columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
				dtoScheme: {
					typeName: 'RequisitionDto',
					moduleSubModule: 'TransportPlanning.Requisition'
				}
			};
		}

		var trsReqFilters = [{
			key: 'transportplanning-requisition-bizpartner-contact-filter',
			serverSide:true,
			serverKey:'project-main-bizpartner-contact-filter',
			fn: function (entity) {
				return {
					BusinessPartnerFk: entity.BusinessPartnerFk
				};
			}
		}];

		basicsLookupdataLookupFilterService.registerFilter(trsReqFilters);

		return Builder;
	}
})(angular);