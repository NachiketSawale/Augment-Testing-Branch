(function (angular) {
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	'use strict';

	var moduleName = 'procurement.pes';

	/**
	 * @ngdoc service
	 * @model procurementPesPlantQuantityWizardService
	 */
	angular.module(moduleName).service('procurementPesPlantQuantityWizardService', ProcurementPesPlantQuantityWizardService);

	function ProcurementPesPlantQuantityWizardService($http, $q, platformWizardDialogService, _, basicsLookupdataConfigGenerator, $translate, $rootScope, moment, procurementPesHeaderService, platformModalService, $injector, resourceCommonContextService, basicsLookupdataLookupFilterService) {

		var self = this;
		var gid = 'configuration';
		self.workOperationFks =[];

		self.updatePlantQuantity = function updatePlantQuantity(pesItemList) {

			var modelData = {
				plantQuantityInitData: {
					pesItems: pesItemList
				}
			};

			var amountSteps = pesItemList.length;

			if(pesItemList[0].PlantTypeFk){
				asyncGetAvailableWOTFksFromPlantTypes(pesItemList[0].PlantTypeFk).then(function (wotFks) {
					self.workOperationFks = wotFks;
				});
			}
			var stepName = 'procurement.pes.plantQuantityWizard.step';

			var steps = [];

			// create for each pesItem an own step
			_.each(pesItemList, function (pesItem, index) {
				steps.push(createPlantQuantityStep(stepName + index, [
					{
						model: 'plantQuantityInitData.pesItems[' + index + '].ItemNo',
						tr: 'procurement.pes.entityItemNo',
						domain: 'code',
						readonly: true
					},
					{
						model: 'plantQuantityInitData.pesItems[' + index + '].Quantity',
						tr: 'procurement.pes.plantQuantityWizard.quantity',
						domain: 'quantity',
						readonly: true
					}
				], index));
			});

			var wizardConfig = {
				id: 'prc-item-to-plant-item-wizard',
				title: $translate.instant('procurement.pes.plantQuantityWizard.dialogTitle'),
				steps: steps,
				width: '30%',
				height: '55%',
				watches: [{
					expression: 'plantQuantityInitData',
					fn: function (info) {
						var step = _.find(info.wizard.steps, {id: stepName + (amountSteps - 1)});
						step.canFinish = validateWizardData(info.newValue.pesItems);
					},
					deep: true
				}]
			};

			platformWizardDialogService.translateWizardConfig(wizardConfig);

			return platformWizardDialogService.showDialog(wizardConfig, modelData).then(function (result) {
				if (result.success) {
					// set PesItemFk for useCase DTO
					_.each(modelData.plantQuantityInitData.pesItems, function (pesItem) {
						pesItem.PesItemFk = pesItem.Id;
					});

					$http({
						method: 'POST',
						url: globals.webApiBaseUrl + 'logistic/job/plantallocation/createFromPesItem',
						data: modelData.plantQuantityInitData.pesItems
					}).then(function (response) {
						showMessage(response.data);
					});
				}
			});

		};

		function validateWizardData(pesItems) {
			var isValid = true;
			_.each(pesItems, function (pesItem) {
				// those are mandatory
				if (!pesItem.JobFk || !pesItem.WorkOperationTypeFk) {
					isValid = false;
				}
			});
			return isValid;
		}

		function showMessage(result) {
			var bodyTextKey;
			var headerTextKey;
			if (result && !_.isEmpty(result)) {
				headerTextKey = 'procurement.pes.plantQuantityWizard.wizardResult';
				bodyTextKey = result;
			}
			platformModalService.showMsgBox(bodyTextKey, headerTextKey, 'ico-info');
		}

		function createPlantQuantityStep(stepTitleTranslationId, fieldList, index) {
			var stub = getFormConfigStub();
			var step = {title$tr$: stepTitleTranslationId, form: stub, canFinish: false, id: stepTitleTranslationId};
			_.each(fieldList, function createStep(fieldObject) {
				stub.rows.push(createDomainRow(fieldObject));
			});

			var allocationUiService = $injector.get('resourceEquipmentPlantAllocationViewUIStandardService');

			var allocationLayout = _.cloneDeep(allocationUiService.getStandardConfigForDetailView());

			allocationLayout.rows.forEach(function (row) {
				row.gid = gid;
			});


			var plant = _.find(allocationLayout.rows, {model: 'PlantFk'});
			plant.model = 'plantQuantityInitData.pesItems[' + index + '].PlantFk';
			plant.sortOrder = 3;
			plant.readonly = true;
			stub.rows.push(plant);

			var job = _.find(allocationLayout.rows, {model: 'JobFk'});
			job.sortOrder = 4;
			job.model = 'plantQuantityInitData.pesItems[' + index + '].JobFk';
			stub.rows.push(job);


			let workOperationTypeRow = basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm(
				{
					dataServiceName: 'resourceWorkOperationTypePlantTypeFilterLookupDataService',
					showClearButton: true,
					filterKey: 'resource-wot-by-plant-type-filter'
				},
				{
					gid: 'configuration',
					label$tr$: 'logistic.job.changeWOTOfDispatchNotesWizard.entityWorkoperationType',
					label: 'Work Operation Type',
					readonly: false,
					required: true,
					sortOrder: 5
				});
			var workOperationType = workOperationTypeRow;
			workOperationType.model = 'plantQuantityInitData.pesItems[' + index + '].WorkOperationTypeFk';
			workOperationType.sortOrder = 5;
			workOperationType.required = true;

			stub.rows.push(workOperationType);

			return step;
		}

		function createDomainRow(fieldObject) {
			return {
				gid: 'configuration',
				rid: fieldObject.model,
				label$tr$: fieldObject.tr,
				model: fieldObject.model,
				type: fieldObject.domain,
				readonly: fieldObject.readonly,
				sortOrder: 0,
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

		let wizardLookupFilter = [
			{
				key: 'resource-wot-by-plant-type-filter',
				fn: function (lookupItem) {
					return _.some(self.workOperationFks, wotFk => wotFk === lookupItem.Id);
				}
			}
		];

		basicsLookupdataLookupFilterService.registerFilter(wizardLookupFilter);
		let asyncGetAvailableWOTFksFromPlantTypes = function asyncGetAvailableWOTFksFromPlants(plantTypeFk) {
			let promises = [
				resourceCommonContextService.init(),
				$http.get(globals.webApiBaseUrl +'resource/wot/workoperationtype/listbyplanttype?plantTypeFk=' + plantTypeFk)
			];
			return $q.all(promises).then(function (response) {
				let wots = response[1].data;
				let context = response[0];
				return _.map(_.filter(wots, w => w.EquipmentContextFk === context.EquipmentContextFk), w => w.Id);
			});
		};
	}


	ProcurementPesPlantQuantityWizardService.$inject = ['$http', '$q', 'platformWizardDialogService', '_', 'basicsLookupdataConfigGenerator', '$translate', '$rootScope', 'moment', 'procurementPesHeaderService', 'platformModalService', '$injector', 'resourceCommonContextService', 'basicsLookupdataLookupFilterService'];

})(angular);
