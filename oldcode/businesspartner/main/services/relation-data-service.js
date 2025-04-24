/**
 * Created by wwa on 11/4/2015.
 */
/**
 * Created by wuj on 8/19/2015.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */

	var moduleName = 'businesspartner.main';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('businessPartnerRelationDataService',
		['$injector', 'platformDataServiceFactory', 'businesspartnerMainHeaderDataService', 'basicsLookupdataLookupDescriptorService', 'platformDataValidationService',
			'platformRuntimeDataService', 'businesspartnerStatusRightService','basicsCommonMandatoryProcessor','basicsLookupdataLookupFilterService',
			function ($injector, dataServiceFactory, parentService, lookupDescriptorService, platformDataValidationService, runtimeDataService, businesspartnerStatusRightService,mandatoryProcessor,basicsLookupdataLookupFilterService) {

				var serviceContainer = {};
				var service = {};
				var serviceOption = {
					flatLeafItem: {
						module: angular.module(moduleName),
						httpCreate: {route: globals.webApiBaseUrl + 'businesspartner/main/relation/', endCreate: 'createrelation'},
						httpRead: {route: globals.webApiBaseUrl + 'businesspartner/main/relation/'},
						presenter: {
							list: {
								incorporateDataRead: function (readData, data) {
									var relationtypes = readData.BusinessPartnerRelationType;
									var relationtypes1 = angular.copy(relationtypes);
									_.forEach(relationtypes, function (item) {
										if (item.DescriptionInfo.Description !== item.OppositeDescriptionInfo.Description) {
											var entity = angular.copy(item);
											var temp = entity.DescriptionInfo;
											entity.Id = -(item.Id);
											entity.DescriptionInfo = entity.OppositeDescriptionInfo;
											entity.OppositeDescriptionInfo = temp;
											relationtypes1.push(entity);
										}

									});
									readData.BusinessPartnerRelationType = relationtypes1;

									var status = parentService.getItemStatus();
									if (status.IsReadonly === true) {
										businesspartnerStatusRightService.setListDataReadonly(readData.Main, true);
									}

									lookupDescriptorService.attachData(readData);
									var dataRead = serviceContainer.data.handleReadSucceeded(readData.Main, data);
									angular.forEach(readData.Main, function (item) {
										service.setEntityReadOnly(item);
									});
									return dataRead;
								},
								handleCreateSucceeded: function (newItem) {
									lookupDescriptorService.updateData('BusinessPartner', newItem.BusinessPartner);
									service.setEntityReadOnly(newItem.Dto);
									service.gridRefresh();
									return newItem.Dto;
								}

							}
						},
						entityRole: {
							leaf: {
								itemName: 'BusinessPartnerRelation',
								parentService: parentService
							}
						}
					}
				};

				serviceContainer = dataServiceFactory.createNewComplete(serviceOption);

				serviceContainer.data.newEntityValidator=mandatoryProcessor.create({
					typeName: 'BusinessPartnerRelationDto',
					moduleSubModule: 'BusinessPartner.Main',
					validationService: 'businessPartnerRelationValidationService',
					mustValidateFields: ['BusinessPartner2Fk']
				});

				service = serviceContainer.service;
				service.setEntityReadOnly = function (entity) {
					runtimeDataService.readonly(entity, [{field: 'BusinessPartnerFk', readonly: true}]);
				};

				service.getSelectedParent = function () {
					return parentService.getSelected();
				};

				var canCreate = serviceContainer.service.canCreate;
				serviceContainer.service.canCreate = function () {
					return canCreate() && !parentService.getItemStatus().IsReadonly;
				};

				var canDelete = serviceContainer.service.canDelete;
				serviceContainer.service.canDelete = function () {
					return canDelete() && !parentService.getItemStatus().IsReadonly;
				};

				parentService.updateSuccessedRegister.register(function () {
					service.load();
				});

				let filters = [
					{
						key: 'businesspartner-main-relation-subsidiary2-filter',
						serverSide: true,
						serverKey: 'businesspartner-main-relation-subsidiary2-filter',
						fn: function (entity) {
							return {
								BusinessPartnerFk: entity.BusinessPartner2Fk
							};
						}
					}
				];
				_.each(filters,function (filter) {
					if (!basicsLookupdataLookupFilterService.hasFilter(filter.key)) {
						basicsLookupdataLookupFilterService.registerFilter(filter);
					}
				});
				return service;
			}]);
})(angular);