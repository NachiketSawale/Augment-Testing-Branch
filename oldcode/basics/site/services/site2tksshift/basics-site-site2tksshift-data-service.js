/**
 * Created by lav on 11/28/2019.
 */
(function () {
	'use strict';
	var moduleName = 'basics.site';
	var module = angular.module(moduleName);
	module.factory('basicsSite2TksShiftDataService', DataService);

	DataService.$inject = ['platformDataServiceFactory',
		'basicsCommonMandatoryProcessor',
		'basicsSiteMainService',
		'basicsLookupdataLookupDescriptorService'];

	function DataService(platformDataServiceFactory,
						 basicsCommonMandatoryProcessor,
						 mainService,
						 lookupDescriptorService) {
		lookupDescriptorService.loadData('sitetype');//load asap, not 100%

		var serviceInfo = {
			flatLeafItem: {
				module: module,
				serviceName: 'basicsSite2TksShiftDataService',
				entityNameTranslationID: 'timekeeping.shiftmodel.entityShift',
				httpCRUD: {route: globals.webApiBaseUrl + 'basics/site/site2tksshift/'},
				entityRole: {
					leaf: {
						itemName: 'Site2TksShifts',
						parentService: mainService
					}
				},
				presenter: {
					list: {
						initCreationData: function (creationData) {
							creationData.Id = mainService.getSelected().Id;
						},
						handleCreateSucceeded: function (newItem) {
							if (newItem.TksShiftFk < 1) {
								newItem.TksShiftFk = null;
							}
						}
					}
				},
				actions: {
					delete: {},
					create: 'flat',
					canCreateCallBackFunc: function (parentItem) {
						var selectedSite = mainService.getSelected();
						if (selectedSite && selectedSite.SiteTypeFk) {
							var responseSiteType = lookupDescriptorService.getLookupItem('sitetype', selectedSite.SiteTypeFk);
							return responseSiteType && responseSiteType.IsFactory;
						}
						return false;
					}
				}
			}
		};

		/* jshint -W003 */
		var container = platformDataServiceFactory.createNewComplete(serviceInfo);

		container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			typeName: 'Site2TksShiftDto',
			validationService: 'basicsSite2TksShiftValidationService',
			moduleSubModule: 'Basics.Site'
		});

		return container.service;
	}
})();