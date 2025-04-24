(function (angular) {
	'use strict';
	/* globals globals, _ */
	let qtoFormulaModule = angular.module('qto.formula');

	/* jshint -W072 */ // many parameters because of dependency injection
	qtoFormulaModule.factory('qtoFormulaDataService',
		['platformDataServiceFactory', 'qtoFormulaRubricCategoryDataService', 'basicsLookupdataLookupFilterService',
			'basicsLookupdataLookupDataService', 'platformContextService', 'basicsLookupdataLookupDescriptorService',
			'$http', '$q', 'qtoFormulaIcons', 'PlatformMessenger', 'platformModalService','platformRuntimeDataService','qtoMainFormulaType','qtoFormulaDataValidationProcessService','basicsUserformCommonService', 'basicsUserFormPassthroughDataService', 'userFormOpenMethod','$injector','platformPermissionService','$translate',
			function (dataServiceFactory, parentDataService, basicsLookupdataLookupFilterService,
				lookupDataService, platformContextService, basicsLookupdataLookupDescriptorService,
				$http, $q, qtoFormulaIcons, PlatformMessenger, platformModalService,platformRuntimeDataService,qtoMainFormulaType,qtoFormulaDataValidationProcessService,basicsUserformCommonService,basicsUserFormPassthroughDataService,userFormOpenMethod,$injector,platformPermissionService,$translate) {

				basicsLookupdataLookupDescriptorService.attachData({
					'qtoFormulaIcon': qtoFormulaIcons
				});

				let permissionUuid = '0a38c749abe04233aa0704f7d6c27088';
				let serviceContainer = {};
				let serviceOption = {
					flatNodeItem: {
						module: qtoFormulaModule,
						serviceName: 'qtoFormulaDataService',
						httpCreate: {route: globals.webApiBaseUrl + 'qto/formula/'},
						httpRead: {route: globals.webApiBaseUrl + 'qto/formula/'},
						presenter: {
							list: {
								incorporateDataRead: function (readData, data) {
									basicsLookupdataLookupDescriptorService.attachData(readData);
									var items = readData.Main ? readData.Main : readData;
									if(items && items.length>0){
										serviceContainer.service.updateColumnReadOnly(items);
									}

									var grid = $injector.get('platformGridAPI').grids.element('id', permissionUuid);
									if (grid && grid.instance && grid.options) {
										grid.options.enableColumnSort = false;
									}

									return serviceContainer.data.handleReadSucceeded(items, data);
								},
								initCreationData: function initCreationData(creationData) {
									creationData.mainItemId = parentDataService.getSelected().Id;
									creationData.maxCode = getMaxCode();
								}
							}
						},
						entityRole: {
							node: {
								itemName: 'QtoFormula',
								parentService: parentDataService
							}
						},
						translation: {
							uid: 'qtoFormulaDataService',
							title: 'qto.formula.gridViewTitle',
							columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
							dtoScheme: {
								typeName: 'QtoFormulaDto',
								moduleSubModule: 'qto.formula'
							}
						}
					}
				};

				function getMaxCode() {
					let items = serviceContainer.data.itemList;
					if (items.length > 0) {
						let Code = _.map(items, function (k) {
							return parseInt(k.Code);
						});
						return _.max(Code);
					}
					return '0';
				}

				serviceContainer = dataServiceFactory.createNewComplete(serviceOption);

				let data = serviceContainer.data;
				data.newEntityValidator = qtoFormulaDataValidationProcessService;

				serviceContainer.service.onQtoFormulaTypeFkChangeEvent = new PlatformMessenger();

				serviceContainer.service.parseScript = function (script) {
					let defer = $q.defer();
					$http.post(globals.webApiBaseUrl + 'qto/formula/parse', {script: script}).then(function (response) {
						defer.resolve(response.data);
					}
					);

					return defer.promise;
				};

				serviceContainer.service.getKeywords = function () {
					let defer = $q.defer();
					$http.get(globals.webApiBaseUrl + 'qto/formula/keywords').then(function (response) {
						defer.resolve(response.data);
					}
					);

					return defer.promise;
				};

				serviceContainer.service.changeSciptEditStatus = new PlatformMessenger();

				serviceContainer.service.updateColumnReadOnly = function updateColumnReadOnly(items){

					let OperatorColumns = ['Operator1', 'Operator2', 'Operator3', 'Operator4', 'Operator5'];
					let modelScriptArray = ['Value1IsActive', 'Value2IsActive', 'Value3IsActive', 'Value4IsActive', 'Value5IsActive'];
					let multSettingArray = ['MaxLinenumber'];

					_.forEach(items, function (item) {
						if(item.QtoFormulaTypeFk === qtoMainFormulaType.FreeInput){
							serviceContainer.service.updateReadOnly(item, OperatorColumns, true);
						}

						if(!item.IsMultiline){
							serviceContainer.service.updateReadOnly(item, multSettingArray, true);
						}

						let _readOnly = item.QtoFormulaTypeFk === qtoMainFormulaType.FreeInput;
						serviceContainer.service.updateReadOnly(item, modelScriptArray, _readOnly);
					});
				};


				serviceContainer.service.updateReadOnly = function (item, modelArray, value) {
					_.forEach(modelArray, function (model) {
						platformRuntimeDataService.readonly(item, [
							{field: model, readonly: value}
						]);
					});
				};

				let originalDeletedeleteEntities = serviceContainer.data.deleteEntities;
				serviceContainer.data.deleteEntities = function deleteChildItem(entities, data) {
					let formulaIds = [];
					for(let i = 0; i < entities.length; ++i){
						formulaIds.push(entities[i].Id);
					}
					if(formulaIds.length > 0){
						return $http.post(globals.webApiBaseUrl + 'qto/formula/candelete', formulaIds).then(function (response) {
							let responseData = response.data;
							if(formulaIds.length === 1){
								if(responseData.length > 0 && responseData[0] === entities[0].Id){
									return platformModalService.showErrorBox('qto.formula.dialog.allFormulaAssignedMessage', 'cloud.common.errorMessage');
								}else
								{
									return originalDeletedeleteEntities(entities, data);
								}
							}
							else{
								let delEntities = entities.filter(
									function (entity){
										return(responseData.indexOf(entity.Id) === -1);
									}
								);

								return originalDeletedeleteEntities(delEntities, data);
							}
						});
					}
				};

				serviceContainer.service.previewSelectedFormula = function previewSelectedFormula() {
					let selectedFormula = serviceContainer.service.getSelected();
					let hasCreate = platformPermissionService.hasCreate(permissionUuid);
					let hasWrite =  platformPermissionService.hasWrite(permissionUuid);
					let hasDelete = platformPermissionService.hasDelete(permissionUuid);
					if (selectedFormula && selectedFormula.BasFormFk) {
						$injector.get('cloudCommonLanguageService').getLanguageItems().then(function (allLanguage) {
							let initialData = {
								imageBlob : !_.isNull(selectedFormula.Blob) ? selectedFormula.Blob.Content : null,
								qtoFormula : selectedFormula,
								isOkBtnDisabled : true,
								isFromPreview : true,
								dataList : [],
								allLanguage : allLanguage,
								permission: {
									hasCreate: hasCreate,
									hasWrite: hasWrite,
									hasDelete: hasDelete
								},
								validationText: {
									maxRowSize: $translate.instant('qto.main.detail.validationText.maxRowSize'),
									minRowSize: $translate.instant('qto.main.detail.validationText.minRowSize'),
									factor: $translate.instant('qto.main.detail.validationText.factor'),
									result: $translate.instant('qto.main.detail.validationText.result'),
									displayControlGraphic: $translate.instant('qto.main.detail.validationText.displayControlGraphic'),
									controlGraphic: $translate.instant('qto.main.detail.validationText.controlGraphic'),
									formula: $translate.instant('qto.main.detail.validationText.formula'),
									qTOFormulaConfig: $translate.instant('qto.main.detail.validationText.qTOFormulaConfig'),
									dataLanguageConfigText: $translate.instant('qto.main.detail.validationText.dataLanguageConfigText'),
									languageText: $translate.instant('qto.main.detail.validationText.languageText'),
									basicConfigText: $translate.instant('qto.main.detail.validationText.basicConfigText'),
									maximumRowNumber: $translate.instant('qto.main.detail.validationText.maximumRowNumber'),
									minimalRowNumber: $translate.instant('qto.main.detail.validationText.minimalRowNumber'),
									factorInFirstRow: $translate.instant('qto.main.detail.validationText.factorInFirstRow'),
									setEqualSymbolAutomatically: $translate.instant('qto.main.detail.validationText.setEqualSymbolAutomatically'),
									activateAddOrDeleteButton: $translate.instant('qto.main.detail.validationText.activateAddOrDeleteButton'),
									activateControlGraphic: $translate.instant('qto.main.detail.validationText.activateControlGraphic'),
									appendValueAutomaticallyText: $translate.instant('qto.main.detail.validationText.appendValueAutomaticallyText'),
									columnConfigText: $translate.instant('qto.main.detail.validationText.columnConfigText'),
									column1: $translate.instant('qto.main.detail.validationText.column1'),
									column2: $translate.instant('qto.main.detail.validationText.column2'),
									column3: $translate.instant('qto.main.detail.validationText.column3'),
									column4: $translate.instant('qto.main.detail.validationText.column4'),
									column5: $translate.instant('qto.main.detail.validationText.column5'),
									column6: $translate.instant('qto.main.detail.validationText.column6'),
									column7: $translate.instant('qto.main.detail.validationText.column7'),
									column8: $translate.instant('qto.main.detail.validationText.column8'),
									column9: $translate.instant('qto.main.detail.validationText.column9'),
									column10: $translate.instant('qto.main.detail.validationText.column10'),
									headTitleText: $translate.instant('qto.main.detail.validationText.headTitleText'),
									headerDescriptionText: $translate.instant('qto.main.detail.validationText.headerDescriptionText'),
									isOperatorColumn: $translate.instant('qto.main.detail.validationText.isOperatorColumn'),
									valueColumnMapping: $translate.instant('qto.main.detail.validationText.valueColumnMapping'),
									onlyActivateInTheFirstRow: $translate.instant('qto.main.detail.validationText.onlyActivateInTheFirstRow'),
									setInputsToTheLastQTOLine: $translate.instant('qto.main.detail.validationText.setInputsToTheLastQTOLine'),
									notAllowInputValueIsNegative: $translate.instant('qto.main.detail.validationText.notAllowInputValueIsNegative'),
									hideColumnText: $translate.instant('qto.main.detail.validationText.hideColumnText'),
									onlySetInputToOneOperator: $translate.instant('qto.main.detail.validationText.onlySetInputToOneOperator'),
									preview: $translate.instant('qto.main.detail.validationText.preview'),
									editButtonText: $translate.instant('qto.main.detail.validationText.editButtonText'),
									saveNclose: $translate.instant('qto.main.detail.validationText.saveNclose'),
									Value1Mapping: $translate.instant('qto.main.detail.validationText.Value1Mapping'),
									Value2Mapping: $translate.instant('qto.main.detail.validationText.Value2Mapping'),
									Value3Mapping: $translate.instant('qto.main.detail.validationText.Value3Mapping'),
									Value4Mapping: $translate.instant('qto.main.detail.validationText.Value4Mapping'),
									Value5Mapping: $translate.instant('qto.main.detail.validationText.Value5Mapping'),
									Operator1Mapping: $translate.instant('qto.main.detail.validationText.Operator1Mapping'),
									Operator2Mapping: $translate.instant('qto.main.detail.validationText.Operator2Mapping'),
									Operator3Mapping: $translate.instant('qto.main.detail.validationText.Operator3Mapping'),
									Operator4Mapping: $translate.instant('qto.main.detail.validationText.Operator4Mapping'),
									Operator5Mapping: $translate.instant('qto.main.detail.validationText.Operator5Mapping'),
									valueInputPlaceholder: $translate.instant('qto.main.detail.validationText.valueInputPlaceholder'),
									column1ConfigText: $translate.instant('qto.main.detail.validationText.column1ConfigText'),
									column2ConfigText: $translate.instant('qto.main.detail.validationText.column2ConfigText'),
									column3ConfigText: $translate.instant('qto.main.detail.validationText.column3ConfigText'),
									column4ConfigText: $translate.instant('qto.main.detail.validationText.column4ConfigText'),
									column5ConfigText: $translate.instant('qto.main.detail.validationText.column5ConfigText'),
									column6ConfigText: $translate.instant('qto.main.detail.validationText.column6ConfigText'),
									column7ConfigText: $translate.instant('qto.main.detail.validationText.column7ConfigText'),
									column8ConfigText: $translate.instant('qto.main.detail.validationText.column8ConfigText'),
									column9ConfigText: $translate.instant('qto.main.detail.validationText.column9ConfigText'),
									column10ConfigText: $translate.instant('qto.main.detail.validationText.column10ConfigText'),
									activateColumnSubConfig: $translate.instant('qto.main.detail.validationText.activateColumnSubConfig')
								}
							};
							basicsUserFormPassthroughDataService.setInitialData(initialData);

							let postData = [{
								FormId: selectedFormula.BasFormFk,
								ContextId: selectedFormula.Id,
								ContextId1: 0
							}];

							$http.post(globals.webApiBaseUrl + 'basics/userform/getlistbyids?rubricFk=' + 87, postData).then(function (response) {
								if (response && response.data) {
									let item = response.data[0];
									if (item) {
										let userFormOption = {
											formId: item.Id,
											formDataId: item.CurrentFormDataId,
											contextId: selectedFormula.Id,
											context1Id: 0,
											editable: true,
											modal: true,
											rubricFk: 87,
											openMethod: userFormOpenMethod.PopupWindow
										};

										basicsUserformCommonService.showData(userFormOption);
									}
								}
							});
						});
					}
				};

				return serviceContainer.service;

			}]);
})(angular);