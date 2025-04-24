(function (angular) {
	'use strict';
	/* globals globals, _ */

	let moduleName = 'qto.formula';
	let qtoFormulaModule = angular.module(moduleName);

	/* jshint -W072 */ // many parameters because of dependency injection
	qtoFormulaModule.factory('qtoFormulaValidationScriptTranslationDataService', ['$q', '$injector', 'platformDataServiceFactory', 'qtoFormulaRubricCategoryDataService',
		'platformContextService', 'basicsCommonScriptEditorService', 'qtoFormulaValidationScriptTranslationReadonlyProcessor',
		function ($q, $injector, platformDataServiceFactory, parentService, platformContextService, basicsCommonScriptEditorService, readOnlyProcessor) {

			let currentTranslationItems = [];
			let serviceContainer = {};

			let serviceOption = {
				flatLeafItem: {
					module: qtoFormulaModule,
					serviceName: 'qtoFormulaValidationScriptTranslationDataService',
					// httpUpdate:{route: globals.webApiBaseUrl + 'qto/formula/header/'},
					httpCreate: {route: globals.webApiBaseUrl + 'qto/formula/scripttranslation/'},
					httpRead: {route: globals.webApiBaseUrl + 'qto/formula/scripttranslation/'},
					dataProcessor: [readOnlyProcessor],
					presenter: {
						list: {
							incorporateDataRead: function (readData, data) {
								var items = readData.Main || [];

								processTranslationItem(items);

								let dataRead = serviceContainer.data.handleReadSucceeded(items, data);
								serviceContainer.service.goToFirst();
								return dataRead;
							}
						}
					},
					entityRole: {
						leaf: {
							itemName: 'QtoFormulaScriptTrans',
							parentService: parentService
						}
					},
					translation: {
						uid: 'qtoFormulaValidationScriptTranslationDataService',
						title: 'qto.formula.scriptValidationTrans.scriptValidationTransContainerTitle',
						columns: [{header: 'qto.formula.scriptValidationTrans.validationText', field: 'ValidationText',maxLength : 255}],
						dtoScheme: {
							typeName: 'QtoFormulaScriptTransDto',
							moduleSubModule: 'qto.formula'
						}
					}
				}
			};

			serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);

			let service = serviceContainer.service;

			let baseOnCreateSucceeded = serviceContainer.data.onCreateSucceeded;
			serviceContainer.data.onCreateSucceeded = function onCreateSucceeded(newData, data, creationData) {
				let validationService = $injector.get('qtoFormulaValidationScriptTranslationValidationService');
				validationService.validateCode(newData, newData.Code, 'Code');
				baseOnCreateSucceeded(newData, data, creationData);
			};

			let basMergeInUpdateData = service.mergeInUpdateData;
			service.mergeInUpdateData = function(updateData){
				let result = basMergeInUpdateData(updateData);
				processTranslationItem(service.getList());
				return result;
			};

			function processTranslationItem(items){
				service.setCurrentTranslationItems(items);

				service.refreshValidationScriptParmList();
			}

			service.setCurrentTranslationItems = function(items){
				currentTranslationItems = items || [];
			};

			function getCurrentTranslationItems(){
				return currentTranslationItems;
			}

			service.getTranslatorHint = function(){
				let translatorHint = {};

				_.forEach(getCurrentTranslationItems(), function(transItem){
					translatorHint[transItem.Code] = { '!doc': transItem.Description };
				});

				return translatorHint;
			};

			service.getTranslator = function(){
				let translator = {};

				_.forEach(getCurrentTranslationItems(), function(trans){
					translator[trans.Code] = trans.Description;
				});

				return translator;
			};

			service.refreshValidationScriptParmList = function(){
				let validateScriptId = 'qto.formula.script.validation';

				let list = getCurrentTranslationItems();
				let parameterItems = (angular.isArray(list) ? list : []).map(function (item) {
					return {name: item.Code, type: 'string', description: item.Description};
				});

				basicsCommonScriptEditorService.addVariable(validateScriptId, parameterItems);
			};

			return service;
		}
	]);

})(angular);