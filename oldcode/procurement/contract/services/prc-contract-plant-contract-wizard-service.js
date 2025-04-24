(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,Promise */
	var moduleName = 'procurement.contract';

	/**
	 * @ngdoc service
	 * @model cloudDesktopClerkProxyService
	 */
	angular.module(moduleName).service('procurementContractPlantWizardService', ProcurementContractPlantWizardService);

	function ProcurementContractPlantWizardService($http, platformWizardDialogService, _, basicsLookupdataConfigGenerator, $translate, $rootScope, moment, procurementContractHeaderDataService, procurementCommonPrcItemDataService, platformModalService, $injector, procurementContractDocumentDataService, procurementContractDocumentCoreDataService, platformSchemaService, platformDataValidationService, resourceEquipmentPlantDataService) {

		var self = this;
		var service = {};
		var gid = 'configuration';
		var translationBasePath = 'procurement.contract.plantWizard.';

		function loadSchemasForWizard() {
			return platformSchemaService.getSchemas([{
				typeName: 'JobPlantAllocationDto',
				moduleSubModule: 'Logistic.Job'
			}]);
		}

		self.getModule = function getModule() {
			return moduleName;
		};

		self.createPlantContract = function createPlantContract() {

			var prcItem = procurementCommonPrcItemDataService.getService().getSelected();
			if (prcItem) {
				var conHeader = procurementContractHeaderDataService.getSelected();

				var contractData = {
					PlantInitData: {
						PrcItemId : prcItem.Id,
						Code: prcItem ? prcItem.ItemCode : null,
						Description: prcItem && prcItem.Description1 ? prcItem.Description1 : prcItem.Description2 ? prcItem.Description2 : null,
						GroupFk: null,
						KindFk: null,
						TypeFk: null,
						RubricCategoryFk: null,
						CompanyFk: conHeader.CompanyFk,
						ProcurementStructureFk: prcItem ? prcItem.PrcStructureFk : null,
						ProcurementItemFk: prcItem ? prcItem.Id : null,
						UomFk: prcItem ? prcItem.BasUomFk : null,
						PrcHeaderId: conHeader.PrcHeaderFk,
						ConHeaderId: conHeader.Id,
						ProjectDocumentIds: _.map(procurementContractDocumentDataService.getSelectedEntities(), function (document) {
							return document.Id;
						}),
						PrjDocumentIds: _.map(procurementContractDocumentCoreDataService.getSelectedEntities(), function (prcDocument) {
							return prcDocument.Id;
						}),
						UpdateExistingPlant: false
					}
				};

				contractData.PlantInitData.amountDocumentsTransfer = contractData.PlantInitData.ProjectDocumentIds.length + contractData.PlantInitData.PrjDocumentIds.length;

				var steps = [
					createPlantStep('procurement.contract.plantWizard.plantStep', [
						{
							model: 'PlantInitData.UpdateExistingPlant',
							tr: 'procurement.contract.plantWizard.updateExistingPlant',
							domain: 'radio',
							options: {
								valueMember: 'value',
								labelMember: 'label',
								groupName: '_gid',
								items: [{
									value: true,
									label: $translate.instant(translationBasePath + 'yes')
								}, {
									value: false,
									label: $translate.instant(translationBasePath + 'no')
								}]
							},
							sortOrder: 0
						},
						{
							model: 'PlantInitData.Code',
							tr: 'procurement.contract.plantWizard.plantCode',
							domain: 'code'
						},
						{
							model: 'PlantInitData.Description',
							tr: 'procurement.contract.plantWizard.plantDescription',
							domain: 'description'
						},
						{
							model: 'PlantInitData.amountDocumentsTransfer',
							tr: 'procurement.contract.plantWizard.amountDocumentsTransfer',
							domain: 'integer',
							readonly: true,
							sortOrder: 2
						}
					])];

				createDefaults(steps, contractData);

				var wizardConfig = {
					id: 'prc-item-to-plant-item-wizard',
					title: $translate.instant('procurement.contract.plantWizard.dialogTitle'),
					steps: steps,
					width: '50%',
					height: '75%',
					watches: [{
						expression: 'PlantInitData',
						fn: function (info) {
							var step = _.find(info.wizard.steps, {id: 'procurement.contract.plantWizard.plantStep'});

							step.canFinish = !!isPlantDataValid(info);

							info.scope.$broadcast('form-config-updated');
						},
						deep: true
					}, {
						expression: 'PlantInitData.Code',
						fn: function (info) {
							var code = _.find(steps[0].form.rows, {model: 'PlantInitData.Code'});
							var isGeneratedText = $translate.instant('cloud.common.isGenerated');

							if ((info.oldValue === isGeneratedText) === (info.newValue === isGeneratedText)) {
								return;
							} else {
								code.readonly = info.newValue === isGeneratedText;
								info.scope.$broadcast('form-config-updated');
							}
						}
					}, {
						expression: 'PlantInitData.UpdateExistingPlant',
						fn: function (info) {
							var step = _.find(info.wizard.steps, {id: 'procurement.contract.plantWizard.plantStep'});
							changeInputs(info);
							step.canFinish = !!isPlantDataValid(info);
						}
					}]

				};

				platformWizardDialogService.translateWizardConfig(wizardConfig);
				return platformWizardDialogService.showDialog(wizardConfig, contractData).then(function (result) {
					if (result.success) {

						var code = _.find(wizardConfig.steps[0].form.rows, { model: 'PlantInitData.Code' });
						if (code.readonly) {
							contractData.PlantInitData.Code = '';
						}
						// create new plant and component and write the plantId back to the prc_item
						$http({
							method: 'POST',
							url: globals.webApiBaseUrl + 'resource/equipment/plant/createfromProcurementItem',
							data: contractData.PlantInitData
						}).then(function (response) {
							if (response.data && response.data.length >= 1) {
								prcItem.PlantFk = response.data[0];
								procurementCommonPrcItemDataService.getService().markItemAsModified(prcItem);
								return procurementContractHeaderDataService.update().then(function () {
									showMessage(prcItem, {success: true});
								});
							}else {
									showMessage(prcItem,{success:false});
							}
						});
					}
				});
			} else {
				showMessage(prcItem, {success: false});
			}
		};

		function showMessage(prcItem, result) {
			var bodyTextKey;
			var headerTextKey;
			var iconClass = 'ico-error'; // error
			if (result && result.success === true) {
				headerTextKey = $translate.instant('procurement.contract.plantWizard.creationSuccess'/* 'Code': + prcItem.ItemCode }*/);
				iconClass = 'ico-info';
				bodyTextKey = headerTextKey;
			} else if (!prcItem) {
				headerTextKey = 'procurement.contract.plantWizard.creationErrorNoItemSelectedTitle';
				bodyTextKey = 'procurement.contract.plantWizard.creationErrorNoItemSelected';
			} else {
				headerTextKey = 'procurement.contract.plantWizard.creationError';
				bodyTextKey = headerTextKey;
			}
			platformModalService.showMsgBox(bodyTextKey, headerTextKey, iconClass);
		}

		function createDefaults(steps, copiedCommand) {
			_.each(steps, function (step) {
				_.each(step.form.rows, function (row) {
					if (row.isChecked) {
						_.set(copiedCommand, row.model, true);
					}
				});
			});
		}

		function createPlantStep(stepTitleTranslationId, fieldList) {
			var stub = getFormConfigStub();
			var step = { title$tr$: stepTitleTranslationId, form: stub, canFinish: true, id: stepTitleTranslationId };

			_.each(fieldList, function createStep(fieldObject) {
				stub.rows.push(createDomainRow(fieldObject));
			});

			var plantLayoutService = $injector.get('resourceEquipmentPlantLayoutService');

			var plantLayout = _.cloneDeep(plantLayoutService.getStandardConfigForDetailView());

			plantLayout.rows.forEach(function (row) {
				row.gid = gid;
			});

			var plantGroup = _.find(plantLayout.rows, {model: 'PlantGroupFk'});
			plantGroup.sortOrder = 3;
			plantGroup.model = 'PlantInitData.GroupFk';
			plantGroup.validator = validatePlantGroup;
			stub.rows.push(plantGroup);

			var planKind = _.find(plantLayout.rows, {model: 'PlantKindFk'});
			planKind.model = 'PlantInitData.KindFk';
			stub.rows.push(planKind);

			var plantType = _.find(plantLayout.rows, {model: 'PlantTypeFk'});
			plantType.model = 'PlantInitData.TypeFk';
			stub.rows.push(plantType);

			var rubricCategory = _.find(plantLayout.rows, {model: 'RubricCategoryFk'});
			rubricCategory.model = 'PlantInitData.RubricCategoryFk';
			rubricCategory.validator = validateSelectedRubricCatForPlant;
			stub.rows.push(rubricCategory);

			var company = _.find(plantLayout.rows, {model: 'CompanyFk'});
			company.model = 'PlantInitData.CompanyFk';
			company.readonly = true;
			stub.rows.push(company);

			var procurementStructure = _.find(plantLayout.rows, {model: 'ProcurementStructureFk'});
			procurementStructure.model = 'PlantInitData.ProcurementStructureFk';
			procurementStructure.readonly = true;
			stub.rows.push(procurementStructure);

			var code = _.find(stub.rows, {model: 'PlantInitData.Code'});

			code.required = true;
			code.asyncValidator = function (entity, value, model) {
				var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, resourceEquipmentPlantDataService);

				if (value === '') {
					asyncMarker.myPromise = new Promise(function (resolve) {
						resolve(
							platformDataValidationService.finishAsyncValidation({
								valid: false,
								apply: true,
								error: '...',
								error$tr$: 'cloud.common.emptyOrNullValueErrorMessage',
								error$tr$param: {object: model.toLowerCase()}
							}, entity, value, model, asyncMarker, self, resourceEquipmentPlantDataService)
						);
					});
				} else {
					asyncMarker.myPromise = $http.get(globals.webApiBaseUrl + 'resource/equipment/plant/isunique' + '?id=0&code=' + value)
						.then(function (response) {
							if (!entity[model] && angular.isObject(response)) {
								response.apply = true;
							}

							if (!response.data) {
								return platformDataValidationService.finishAsyncValidation({
									valid: false,
									apply: true,
									error: '...',
									error$tr$: 'cloud.common.uniqueValueErrorMessage',
									error$tr$param: {object: model.toLowerCase()}
								}, entity, value, model, asyncMarker, self, resourceEquipmentPlantDataService);
							} else {
								return platformDataValidationService.finishAsyncValidation(response, entity, value, model, null, self, resourceEquipmentPlantDataService);
							}
						})
						.catch(function () {
							return platformDataValidationService.finishAsyncValidation({
								valid: false,
								apply: true,
								error: ''
								// error$tr$: 'cloud.common.emptyOrNullValueErrorMessage',
								// error$tr$param: {object: model.toLowerCase()}
							}, entity, value, model, asyncMarker, self, resourceEquipmentPlantDataService);
						});

				}
				return asyncMarker.myPromise;
			};

			// sortOrder can be random?
			loadSchemasForWizard().then(function () {
				var logisticJobPlantAllocationUIStandardService = $injector.get('logisticJobPlantAllocationUIStandardService');
				var allocationLayout = _.cloneDeep(logisticJobPlantAllocationUIStandardService.getStandardConfigForDetailView());
				var plant = _.find(allocationLayout.rows, {model: 'PlantFk'});
				plant.model = 'PlantInitData.PlantFk';
				plant.sortOrder = 2;
				plant.gid = gid;
				plant.readonly = true;
				plant.required = false;
				stub.rows.push(plant);
			});

			return step;
		}

		function isPlantDataValid(info) {
			var plantFk = info.model.PlantInitData.PlantFk;
			var updateExistingPlant = info.model.PlantInitData.UpdateExistingPlant;
			var kindFk = info.model.PlantInitData.KindFk;
			var plantGroupFk = info.model.PlantInitData.GroupFk;
			var plantTypeFk = info.model.PlantInitData.TypeFk;
			var rubricCategoryFk = info.model.PlantInitData.RubricCategoryFk;
			var procurementStructureFk = info.model.PlantInitData.ProcurementStructureFk;
			if (updateExistingPlant) {
				return plantFk !== null;
			} else {
				return !_.isEmpty(info.model.PlantInitData.Code) && kindFk && plantGroupFk && plantTypeFk && rubricCategoryFk && procurementStructureFk;
			}
		}

		/*------------------------------------
Rubric Category
------------------------------------------*/
		$injector.get('basicsCompanyNumberGenerationInfoService').getNumberGenerationInfoService('resourceEquipmentNumberInfoService', 30).load();

		function validateSelectedRubricCatForPlant(entity, value, model) {
			if (entity.PlantInitData.RubricCategoryFk !== value || entity.PlantInitData.Version === 0) {
				var infoService = $injector.get('basicsCompanyNumberGenerationInfoService').getNumberGenerationInfoService('resourceEquipmentNumberInfoService', 30);
				if (infoService.hasToGenerateForRubricCategory(value)) {
					entity.PlantInitData.Code = infoService.provideNumberDefaultText(value, entity.PlantInitData.Code);
				} else {
					entity.PlantInitData.Code = '';
				}
				platformDataValidationService.validateMandatory(entity.PlantInitData, entity.PlantInitData.Code, 'Code', service, resourceEquipmentPlantDataService);
				return platformDataValidationService.finishValidation(!_.isNil(entity.PlantInitData.RubricCategoryFk), entity.PlantInitData, value, model, service, resourceEquipmentPlantDataService);
			}
		}

		function validatePlantGroup(entity, value, model) {
			var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, resourceEquipmentPlantDataService);

			var resourceEquipmentGroupLookupDataService = $injector.get('resourceEquipmentGroupLookupDataService');
			asyncMarker.promise = resourceEquipmentGroupLookupDataService.getList({})
				.then(function (plantGroups) {
					var selectedPlantGroups = plantGroups.filter(function (e) {
						return e.Id === value;
					});

					if (selectedPlantGroups.length > 0) {
						var selectedPlantGroup = selectedPlantGroups[0];

						if (entity.PlantInitData.RubricCategoryFk !== selectedPlantGroup.RubricCategoryFk || entity.PlantInitData.Version === 0) {
							entity.PlantInitData.RubricCategoryFk = selectedPlantGroup.RubricCategoryFk;
							var infoService = $injector.get('basicsCompanyNumberGenerationInfoService').getNumberGenerationInfoService('resourceEquipmentNumberInfoService', 30);
							if (infoService.hasToGenerateForRubricCategory(selectedPlantGroup.RubricCategoryFk)) {
								entity.PlantInitData.Code = infoService.provideNumberDefaultText(selectedPlantGroup.RubricCategoryFk, entity.PlantInitData.Code);
							} else {
								entity.PlantInitData.Code = '';
							}
							platformDataValidationService.validateMandatory(entity.PlantInitData, entity.PlantInitData.Code, 'Code', service, resourceEquipmentPlantDataService);
							return platformDataValidationService.finishValidation(!_.isNil(entity.PlantInitData.RubricCategoryFk), entity.PlantInitData, value, model, service, resourceEquipmentPlantDataService);
						}
					}

					return platformDataValidationService.finishAsyncValidation({
						valid: true,
						apply: true,
						error: '...',
						error$tr$: 'cloud.common.emptyOrNullValueErrorMessage',
						error$tr$param: {object: model.toLowerCase()}
					}, entity, value, model, asyncMarker, self, resourceEquipmentPlantDataService);
				});

			return asyncMarker.promise;
		}

		function changeInputs(info) {
			// var code = _.find(info.wizard.steps[0].form.rows, {model: 'PlantInitData.Code'});
			var plant = _.find(info.wizard.steps[0].form.rows, {model: 'PlantInitData.PlantFk'});

			if (info.newValue === true) {
				info.model.PlantInitData.Code = '';
				// code.readonly = true;
				plant.readonly = false;

			} else {
				info.model.PlantInitData.PlantFk = null;
				plant.readonly = true;
				// code.readonly = false;
			}
			info.scope.$broadcast('form-config-updated');
		}

		function createDomainRow(fieldObject) {
			return {
				gid: 'configuration',
				rid: fieldObject.model,
				label$tr$: fieldObject.tr,
				model: fieldObject.model,
				validator: '',
				type: fieldObject.domain,
				sortOrder: _.isNumber(fieldObject.sortOrder) ? fieldObject.sortOrder : 3,
				options: fieldObject.options ? fieldObject.options : null,
				readonly: fieldObject.readonly
			};
		}

		function getFormConfigStub() {
			return {
				showGrouping: false,
				groups: [
					{
						gid: gid,
						attributes: []
					}
				],
				rows: []
			};
		}
	}

	ProcurementContractPlantWizardService.$inject = ['$http', 'platformWizardDialogService', '_', 'basicsLookupdataConfigGenerator', '$translate', '$rootScope', 'moment', 'procurementContractHeaderDataService', 'procurementCommonPrcItemDataService', 'platformModalService', '$injector', 'procurementContractDocumentDataService', 'procurementContractDocumentCoreDataService', 'platformSchemaService', 'platformDataValidationService', 'resourceEquipmentPlantDataService', 'platformRuntimeDataService'];

})(angular);
