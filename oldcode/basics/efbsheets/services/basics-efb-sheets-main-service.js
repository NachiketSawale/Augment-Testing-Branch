/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	/* global globals */

	let moduleName = 'basics.efbsheets';

	/**
     * @ngdoc service
     * @name basicsEfbsheetsMainService
     * @function
     *
     * @description
     * basicsEfbsheetsMainService is the data service for all Efb Sheets related functionality.
     */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('basicsEfbsheetsMainService', ['_', '$injector','PlatformMessenger','platformDataServiceFactory', 'platformModalService', 'basicsCommonMandatoryProcessor',
		function (_,$injector, PlatformMessenger,platformDataServiceFactory, platformModalService, basicsCommonMandatoryProcessor) {

			let efbSheetMainService = {
				flatRootItem: {
					module: moduleName,
					serviceName: 'basicsEfbsheetsMainService',
					entityNameTranslationID: 'basics.efbsheets.crewMixes',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'basics/efbsheets/crewmixes/'
					},
					entityRole: {
						root: {
							codeField: 'Code',
							descField: 'Description',
							itemName: 'EstCrewMixes',
							moduleName: 'cloud.desktop.moduleDisplayNameCrewMixes',
						}
					},
					presenter: {
						list: {
						}
					},
					sidebarSearch: {
						options: {
							moduleName: moduleName,
							enhancedSearchEnabled: false,
							pattern: '',
							pageSize: 100,
							useCurrentClient: null,
							includeNonActiveItems: null,
							showOptions: false,
							showProjectContext: false,
							withExecutionHints: true
						}
					},
					translation: {
						uid: 'basicsEfbsheetsMainService',
						title: 'basics.efbsheets.crewMixes',
						columns: [{header: 'cloud.common.descriptionInfo', field: 'DescriptionInfo'}]
					},
					entitySelection: {supportsMultiSelection: true}
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(efbSheetMainService);

			serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'EstCrewMixDto',
				moduleSubModule: 'Basics.EfbSheets',
				validationService: 'basicsEfbsheetsValidationService'
			});

			angular.extend(serviceContainer.service, {
				addList: addList,
				fireListLoaded: fireListLoaded,
	
			});

			function fireListLoaded() {
				serviceContainer.data.listLoaded.fire();
			}

			function addList(data) {
				let list = serviceContainer.data.itemList;
				let containerData = serviceContainer.data;
				let platformDataServiceDataProcessorExtension = $injector.get('platformDataServiceDataProcessorExtension');

				if (data && data.length) {
					angular.forEach(data, function (d) {
						let item = _.find(list, {Id: d.Id});
						if (item) {
							angular.extend(list[list.indexOf(item)], d);
						} else {
							serviceContainer.data.itemList.push(d);
						}
					});
					angular.forEach(list, function (li) {
						platformDataServiceDataProcessorExtension.doProcessItem(li, containerData);
					});
				}
			}

			return serviceContainer.service;
		}]);

})(angular);