/**
 * Created by wuj on 9/2/2015.
 */
(function (angular) {
	'use strict';
	/* global globals,_ */
	var moduleName = 'basics.procurementconfiguration';
	angular.module(moduleName)
		.factory('basicsProcurementConfigurationPrcTotalTypeDataService',
			['$injector', 'platformDataServiceFactory', 'basicsProcurementConfigHeaderDataService',
				'platformRuntimeDataService', 'basicsCommonReadDataInterceptor', 'basicsCommonMandatoryProcessor', 'basicsProcurementConfigurationTotalKinds', 'basicsLookupdataLookupDescriptorService',
				function ($injector, dataServiceFactory, parentService, platformRuntimeDataService, readDataInterceptor, basicsCommonMandatoryProcessor, totalKinds, lookupDescriptorService) {
					var service = {};
					var serviceOptions = {
						flatLeafItem: {
							module: angular.module(moduleName),
							serviceName: 'basicsProcurementConfigurationPrcTotalTypeDataService',
							httpCRUD: {
								route: globals.webApiBaseUrl + 'basics/procurementconfiguration/prctotaltype/'
							},
							presenter: {
								list: {
									initCreationData: initCreationData,
									handleCreateSucceeded: function (newData) {
										// if ((newData.PrcTotalKindFk !== 2) && (newData.PrcTotalKindFk !== 0)) {
										if ((newData.PrcTotalKindFk !== totalKinds.fromPackage) && (newData.PrcTotalKindFk !== totalKinds.freeTotal)) {
											platformRuntimeDataService.readonly(newData, [
												{
													field: 'IsEditableNet',
													readonly: true
												},
												{
													field: 'IsEditableTax',
													readonly: true
												},
												{
													field: 'IsEditableGross',
													readonly: true
												}
											]);
										}
									},
									incorporateDataRead: incorporateDataRead
								}
							},
							entityRole: {
								leaf: {
									itemName: 'PrcTotalType',
									parentService: parentService
								}
							},

							actions: {
								canDeleteCallBackFunc: function () {
									var item = service.getSelected();
									return !(item.Version !== 0 && item.PrcTotalKindFk === totalKinds.netTotal);
								},
								delete: true, create: 'flat',
								suppressAutoCreate: true
							},
							translation: {
								uid: 'A07094729144B8B7833BE1127436E8F1',
								title: 'basics.procurementconfiguration.totalTypeGridTitle',
								columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
								dtoScheme: {
									typeName: 'PrcTotalTypeDto',
									moduleSubModule: 'Basics.ProcurementConfiguration'
								}
							}
						}
					};

					var serviceContainer = dataServiceFactory.createNewComplete(serviceOptions);
					service = serviceContainer.service;
					readDataInterceptor.init(service, serviceContainer.data);

					var onCompleteEntityCreated = function onCompleteEntityCreated(e, completeData) {
						/** @namespace completeData.PrcTotalType */
						if (completeData.PrcTotalType) {
							// if ((completeData.PrcTotalType.PrcTotalKindFk !== 2) && (completeData.PrcTotalType.PrcTotalKindFk !== 0)) {
							if ((completeData.PrcTotalType.PrcTotalKindFk !== totalKinds.fromPackage) && (completeData.PrcTotalType.PrcTotalKindFk !== totalKinds.freeTotal)) {
								platformRuntimeDataService.readonly(completeData.PrcTotalType, [
									{
										field: 'IsEditableNet',
										readonly: true
									},
									{
										field: 'IsEditableTax',
										readonly: true
									},
									{
										field: 'IsEditableGross',
										readonly: true
									}
								]);
							}
							if (completeData.PrcTotalType.PrcTotalKindFk === totalKinds.netTotal) {
								completeData.PrcTotalType.Code = 'NET';
								const totalTypeItem = service.getTotalKind(completeData.PrcTotalType.PrcTotalKindFk);
								if (totalTypeItem) {
									completeData.PrcTotalType.DescriptionInfo.Description = totalTypeItem.Description;
									completeData.PrcTotalType.DescriptionInfo.Translated = totalTypeItem.Description;
									completeData.PrcTotalType.DescriptionInfo.DescriptionModified = true;
									completeData.PrcTotalType.DescriptionInfo.Modified = true;
								}
							}
							var totalTypes = [completeData.PrcTotalType];
							service.setCreatedItems(totalTypes);
							var validateService = $injector.get('basicsProcurementConfigurationPrcTotalTypeValidationService');

							angular.forEach(totalTypes, function (newItem) {
								validateService.validateCode(newItem, newItem.Code, 'Code');
							});
						}
					};

					var onCompleteEntityUpdated = function onCompleteEntityUpdated() {
						var totalList = service.getList();
						if (totalList !== undefined) {
							angular.forEach(totalList, function (totalType) {

								if (totalType !== null && totalType !== undefined && totalType.PrcTotalKindFk === totalKinds.netTotal) {
									platformRuntimeDataService.readonly(totalType, [
										{
											field: 'PrcTotalKindFk',
											readonly: true
										}
									]);
								}
							});
						}
						var item = service.getSelected();
						if (item !== null && item !== undefined) {
							var parentSelected = parentService.getSelected();
							service.setFilter('mainItemId=' + parentSelected.Id);
							service.read().then(function () {
								service.setSelected(item);
							});
						}
					};

					parentService.completeEntityCreateed.register(onCompleteEntityCreated);
					parentService.completeEntityUpdated.register(onCompleteEntityUpdated);


					serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
						typeName: 'PrcTotalTypeDto',
						moduleSubModule: 'Basics.ProcurementConfiguration',
						validationService: 'basicsProcurementConfigurationPrcTotalTypeValidationService',
						mustValidateFields: ['Code']
					});

					service.getTotalKind = function(totalTypeFk){
						return _.find(lookupDescriptorService.getData('PrcTotalKind'), {Id: totalTypeFk,});
					};
					return service;

					function initCreationData(creationData) {
						creationData.mainItemId = parentService.getSelected().Id;

						var totalKindItem = _.find(service.getList(), function (item) {
							return item;
						});
						creationData.IsNetTotalSite = !totalKindItem;
						var totalList = service.getList();
						if (totalList.length > 0) {
							creationData.MaxSorting = _.max(_.map(totalList, 'Sorting'));
						} else {
							creationData.MaxSorting = 0;
						}
					}

					function incorporateDataRead(readData, data) {
						let newPrcTotalType = lookupDescriptorService.getData('newPrcTotalType');
						if (newPrcTotalType) {
							if (_.isEmpty(readData)) {
								let validateService = $injector.get('basicsProcurementConfigurationPrcTotalTypeValidationService');
								angular.forEach(newPrcTotalType, function (newItem) {
									validateService.validateCode(newItem, newItem.Code, 'Code');
								});
								readData = newPrcTotalType;
							}
							lookupDescriptorService.removeData('newPrcTotalType');
						}

						var changeReadOnly = _.filter(readData, function (item) {
							// return item.PrcTotalKindFk !== 5;
							return item.PrcTotalKindFk !== totalKinds.formula;
						});
						_.forEach(changeReadOnly, function (item) {
							platformRuntimeDataService.readonly(item, [{
								field: 'Formula',
								readonly: true
							}]);
						});
						var changeReadOnly1 = _.filter(readData, function (item) {
							// return (item.PrcTotalKindFk !== 2)&& (item.PrcTotalKindFk !== 0);
							return (item.PrcTotalKindFk !== totalKinds.fromPackage) && (item.PrcTotalKindFk !== totalKinds.freeTotal);
						});
						_.forEach(changeReadOnly1, function (item) {
							platformRuntimeDataService.readonly(item, [
								{
									field: 'IsEditableNet',
									readonly: true
								},
								{
									field: 'IsEditableTax',
									readonly: true
								},
								{
									field: 'IsEditableGross',
									readonly: true
								}
							]);
							if (item.PrcTotalKindFk === totalKinds.netTotal) {
								platformRuntimeDataService.readonly(item, [
									{
										field: 'PrcTotalKindFk',
										readonly: true
									}
								]);
							}
						});

						var changeReadOnly2 = _.filter(readData, function (item) {
							// return item.PrcTotalKindFk !== 8;
							return item.PrcTotalKindFk !== totalKinds.configurableLine;
						});
						_.forEach(changeReadOnly2, function (item) {
							platformRuntimeDataService.readonly(item, [{
								field: 'SqlStatement',
								readonly: true
							}]);
						});

						return serviceContainer.data.handleReadSucceeded(readData, data);
					}

				}]);
})(angular);