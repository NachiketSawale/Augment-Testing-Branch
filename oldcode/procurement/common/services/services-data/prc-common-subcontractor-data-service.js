(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	/**
	 * @ngdoc service
	 * @name procurementCommonSubcontractorDataService
	 * @function
	 * @description Provide requisition data
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.common').factory('procurementCommonSubcontractorDataService',
		['procurementCommonDataServiceFactory', 'procurementContextService',
			function (dataServiceFactory, moduleContext) {

				// create a new data service object
				function constructorFn(parentService) {

					// service configuration
					var serviceContainer,
						serviceOptions = {
							flatLeafItem: {
								module: angular.module('procurement.common'),
								httpCRUD: {
									route: globals.webApiBaseUrl + 'procurement/common/prcsubreference/'
								},
								presenter: {
									list: {
										initCreationData: function initCreationData(creationData) {
											creationData.MainItemId = parentService.getSelected().PrcHeaderEntity.Id;
										}
									},
									isInitialSorted: true
								},
								entityRole: {leaf: {itemName: 'PrcSubreference', parentService: parentService}}
							}
						};

					serviceContainer = dataServiceFactory.createNewComplete(serviceOptions,
						{
							readonly: ['BpdSubsidiaryFk'],
							overview: {key:  moduleContext.overview.keys.sub}
						}
					);

					// read service from serviceContainer
					var service = serviceContainer.service;

					/**
					 * @ngdoc function
					 * @name getCellEditable
					 * @function
					 * @methodOf procurement.common.procurementCommonSubcontractorDataService
					 * @description get editable of model
					 * @returns boolean
					 */
					service.getCellEditable = function (item, model) {
						var editable = true;
						if (model === 'BpdSubsidiaryFk') {
							editable = !!item.BpdBusinesspartnerFk;
						}
						return editable;
					};

					service.registerLookupFilters({
						'prc-subcontactor-bpdcontact-filter':{
							serverSide: true,
							serverKey: 'prc-subcontactor-bpdcontact-filter',
							fn: function (dataItem) {
								return {
									BusinessPartnerFk: dataItem !== null ? dataItem.BpdBusinesspartnerFk : null,
									SubsidiaryFk: dataItem !== null ? dataItem.BpdSubsidiaryFk : null
								};
							}
						},
						'prc-subcontactor-bussinesspartner-filter':{
							fn: function (dataItem, dataContext) {
								var result = true;
								if (dataContext.BpdBusinesspartnerFk) {
									result = dataItem.BusinessPartnerFk === dataContext.BpdBusinesspartnerFk;
								} else {
									result = false;
								}
								return result;
							}
						},
						'prc-subcontactor-subsidiary-filter':{
							serverSide: true,
							serverKey: 'businesspartner-main-subsidiary-common-filter',
							fn: function (currentItem) {
								return {
									BusinessPartnerFk: currentItem !== null ? currentItem.BpdBusinesspartnerFk : null,
									SupplierFk: currentItem !== null ? currentItem.BpdSupplierFk : null
								};
							}
						},
						'prc-subcontactor-supplier-filter':{
							serverSide: true,
							serverKey: 'businesspartner-main-supplier-common-filter',
							fn: function (dataItem) {
								return {
									BusinessPartnerFk: dataItem !== null ? dataItem.BpdBusinesspartnerFk : null,
									SubsidiaryFk: dataItem !== null ? dataItem.BpdSubsidiaryFk : null
								};
							}
						}
					});

					return service;
				}
				return dataServiceFactory.createService(constructorFn, 'procurementCommonSubcontractorDataService');

			}]);
})(angular);