/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	/* global angular, globals, _ */
	const moduleName = 'productionplanning.formworktype';

	angular.module(moduleName).factory('productionplanningFormworktypeDataService', [
		'platformDataServiceFactory', 'basicsCommonMandatoryProcessor', 'productionplanningFormworktypeConstantValues', 'productionplanningCommonSortingProcessor',
		function (platformDataServiceFactory, basicsCommonMandatoryProcessor, constantValues, sortingProcessor) {
			let container;
			let serviceOptions = {
				flatRootItem: {
					module: moduleName,
					serviceName: 'productionplanningFormworktypeDataService',
					dataProcessor: [sortingProcessor.create({ 'dataServiceName': 'productionplanningFormworktypeDataService' })],
					entityNameTranslationID: 'productionplanning.formworktype.entityFormworktype',
					addValidationAutomatically: true,
					httpCRUD: {
						route: globals.webApiBaseUrl + 'productionplanning/formworktype/',
						usePostForRead: true,
						endRead: 'filtered',
						endDelete: 'delete'
						// endDelete: 'multidelete' // if we need multidelete feature in the future, enable current line code
					},
					// entitySelection: { supportsMultiSelection: true }, // if we need multidelete feature in the future, enable current line code
					entityRole: {
						root: {
							itemName: 'FormworkType', // remark: if entitySelection.supportsMultiSelection is true, we use 'FormworkTypes' as itemName, or we use 'FormworkType' as itemName
							moduleName: 'cloud.desktop.moduleDisplayNamePpsFormworkType',
							descField: 'Description'
						}
					},
					presenter: {
						list: {
							handleCreateSucceeded: function (newItem) {
								if (newItem.Version === 0 && newItem.RubricCategoryFk === 0) {
									newItem.RubricCategoryFk = null;
								}
							}
						}
					},
					sidebarSearch: {
						options: {
							moduleName: moduleName,
							enhancedSearchEnabled: false,
							pattern: '',
							pageSize: 100,
							useCurrentClient: null,
							includeNonActiveItems: false,
							showOptions: true,
							showProjectContext: null,
							pinningOptions: null,
							withExecutionHints: true
						}
					},
					translation: {
						uid: 'productionplanningFormworktypeDataService',
						title: 'productionplanning.formworktype.entityFormworktype',
						columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
						dtoScheme: constantValues.schemes.formworktype,
					}
				}
			};
			container = platformDataServiceFactory.createNewComplete(serviceOptions);
			container.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
				mustValidateFields: true,
				validationService: 'productionplanningFormworktypeValidationService'
			}, constantValues.schemes.formworktype));

			return container.service;
		}
	]);
})();
