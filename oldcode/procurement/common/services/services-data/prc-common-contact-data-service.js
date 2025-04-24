(function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	/**
	 * @ngdoc service
	 * @name procurementCommonContactDataService
	 * @function
	 * @requireds
	 *
	 * @description Provide requisition data
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.common').factory('procurementCommonContactDataService',
		['procurementCommonDataServiceFactory', 'basicsLookupdataLookupDescriptorService','procurementContextService',
			function (dataServiceFactory, basicsLookupdataLookupDescriptorService, procurementContextService) {
				// create a new data service object
				var constructorFn = function (parentService) {
					// service configuration
					var serviceOptions = {
						flatLeafItem: {
							serviceName: 'procurementCommonContactDataService',
							httpCRUD: {
								route: globals.webApiBaseUrl + 'procurement/common/prccontact/'
							},
							presenter: {
								list: {
									initCreationData: function initCreationData(creationData) {
										var prcHeader = parentService.getSelected().PrcHeaderEntity;
										creationData.PrcConfigFk = prcHeader.ConfigurationFk;
										creationData.MainItemId = prcHeader.Id;

										let parentSelected = getParentSelectedInCludeBP(parentService);
										if (parentSelected) {
											creationData.BusinessPartnerFk = parentSelected.BusinessPartnerFk;
											creationData.SubsidiaryFk = parentSelected.SubsidiaryFk;
										}
									}
								}
							},
							entityRole: {leaf: {itemName: 'PrcContact', parentService: parentService}}
						}
					};

					function getParentSelectedInCludeBP(parentService) {
						let tmpParentService = _.extend({}, parentService);
						while (tmpParentService) {
							let selected = tmpParentService.getSelected()
							if (selected) {
								if (selected.hasOwnProperty('BusinessPartnerFk') && selected.hasOwnProperty('SubsidiaryFk')) {
									return selected;
								} else {
									tmpParentService = tmpParentService.parentService();
								}
							} else {
								return null;
							}
						}
						return null;
					}

					var serviceContainer = dataServiceFactory.createNewComplete(serviceOptions);
					let onCreateSucceeded = serviceContainer.data.onCreateSucceeded;
					serviceContainer.data.onCreateSucceeded = function (newData, data) {
						if (newData.BpdContactFk > 0) {
							basicsLookupdataLookupDescriptorService.getItemByKey('contact', newData.BpdContactFk)
								.then(function (response) {
									if (response) {
										basicsLookupdataLookupDescriptorService.addData('contact', [response]);
									}
									onCreateSucceeded(newData, data);
								});
						} else {
							onCreateSucceeded(newData, data);
						}
					}

					serviceContainer.service.registerLookupFilters({
						'prc-req-contact-filter': {
							serverSide: true,
							serverKey: 'prc-req-contact-filter',
							fn: function () {
								var currentItem = parentService.getSelected();
								if (!currentItem) {
									return {};
								}

								var selectedItem = currentItem.ReqHeaderEntity || parentService.getSelected();

								let subsidiaryFk = null;
								if (parentService.name === 'procurement.quote.requisition') {
									const parParentService = parentService.parentService();
									if (parParentService) {
										const selected = parParentService.getSelected();
										if (selected) {
											subsidiaryFk = selected.SubsidiaryFk;
										}
									}
								} else {
									subsidiaryFk = selectedItem !== null ? selectedItem.SubsidiaryFk : null;
								}

								return {
									BusinessPartnerFk: selectedItem !== null ? selectedItem.BusinessPartnerFk : null,
									BusinessPartner2Fk: selectedItem !== null ? selectedItem.BusinessPartner2Fk : null,
									SubsidiaryFk: subsidiaryFk
									// ,
									// ContactRoleFk: item !== null && item.BpdContactRoleFk ? item.BpdContactRoleFk : null
								};
							}
						}
					});

					return serviceContainer.service;
				};

				return dataServiceFactory.createService(constructorFn, 'procurementCommonContactDataService');
			}]);
})(angular);