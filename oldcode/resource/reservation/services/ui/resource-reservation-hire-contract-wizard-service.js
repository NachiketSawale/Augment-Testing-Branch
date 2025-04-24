(function (angular) {
	/* global globals */
	'use strict';

	var moduleName = 'resource.reservation';
	angular.module(moduleName).service('resourceReservationHireContractWizardService', ResourceReservationHireContractWizardService);

	ResourceReservationHireContractWizardService.$inject = ['resourceReservationDataService', '$http', 'resourceReservationPlanningBoardReservationService', 'platformWizardDialogService', '$translate', 'basicsCommonWizardHelper', 'basicsLookupdataConfigGenerator', 'platformModalService', 'basicsLookupdataLookupFilterService', '$injector', 'moment', 'platformRuntimeDataService', 'procurementCommonCreateService', 'procurementContextService', 'procurementContractHeaderFilterService', 'procurementRequisitionHeaderDataService', 'platformSchemaService', 'procurementContractNumberGenerationSettingsService', 'basicsLookupdataLookupDescriptorService', '_', 'platformDialogService', 'platformModuleNavigationService'];

	function ResourceReservationHireContractWizardService(resourceReservationDataService, $http, resourceReservationPlanningBoardReservationService, platformWizardDialogService, $translate, basicsCommonWizardHelper, basicsLookupdataConfigGenerator, platformModalService, basicsLookupdataLookupFilterService, $injector, moment, platformRuntimeDataService, procurementCommonCreateService, procurementContextService, procurementContractHeaderFilterService, procurementRequisitionHeaderDataService, platformSchemaService, procurementContractNumberGenerationSettingsService, basicsLookupdataLookupDescriptorService, _, platformDialogService, platformModuleNavigationService) {
		function setProcurementService(dataStep) {
			var serviceName = '';
			if (dataStep.creationType === 'procurement.contract') {
				serviceName = 'procurementContractHeaderDataService';
			} else {
				serviceName = 'procurementRequisitionHeaderDataService';
			}

			procurementContextService.setMainService($injector.get(serviceName));
			procurementContextService.setLeadingService($injector.get(serviceName));
		}

		function createRequisitionToContractWizard(requisitions, requisitionServiceName) {

			const filterStepUuid = 'dd8df440c48a47fd81d81db785adacdc';
			const dataStepUuid = 'c5f40c78a8ee4eaca063ce715d0f03d3';
			const gridStepUuid = '74bde59e658a47f999c482193b6dcee3';

			procurementContractHeaderFilterService.registerFilters();
			procurementRequisitionHeaderDataService.registerFilters();

			var _gid = 'group';
			var translationBasePath = 'cloud.common.requisitionHire.';
			var statusIdList = _.union(_.map(requisitions, function (requisition) {
				return requisition.RequisitionStatusFk;
			}));

			function getProjectIdList() {
				var projectIdList = _.union(_.map(requisitions, function (requisition) {
					return requisition.ProjectFk;
				}));

				return projectIdList;
			}

			var wizardLookupFilter = [
				{
					key: 'filter-status-list-by-requsition-list',
					fn: function (lookupItem) {
						return statusIdList.includes(lookupItem.Id);
					}
				},
				{
					key: 'dispatch-nodes-rubric-category-by-rubric-filter',
					fn: function (lookupItem) {
						return lookupItem.RubricFk === 34; // Logistic Dispatching Rubric
					}
				},
				{
					key: 'filter-project-list-by-requsition-list',
					fn: function (lookupItem) {
						return getProjectIdList().includes(lookupItem.Id);
					}
				},
				{
					key: 'jobs-by-project-filter',
					fn: function (lookupItem, entity) {
						var result = null;
						if (entity.filterStep.ProjectFk) {
							result = lookupItem.ProjectFk === entity.filterStep.ProjectFk;
						} else {
							result = getProjectIdList().includes(lookupItem.ProjectFk);
						}
						return result;
					}
				}
			];

			basicsLookupdataLookupFilterService.registerFilter(wizardLookupFilter);

			const filteredRequisitions = [
				...filterRequisitions(null, requisitionServiceName)
			];

			var hireContract = {
				meta: {
					AmountRequisition: filteredRequisitions.length,
				},
				filterStep: {
					RequisitionStatusFk: null,
					ProjectFk: null,
					From: null,
					To: null,
				},
				gridStep: {
					listModel: {},
					FilteredRequisitionList: filteredRequisitions,
				},
				dataStep: {
					creationType: 'procurement.contract', // default
					Code: null,
					currentItem: {
						Code: null,
						ConfigurationFk: null,
						BusinessPartnerFk: null
					},
					currentSerivce: {},
				},
			};

			let resourceRequisitionUIStandardService = $injector.get('resourceRequisitionUIStandardService');

			let requisitionFromLayout = _.cloneDeep(resourceRequisitionUIStandardService.getStandardConfigForDetailView());
			let requisitionGridLayout = _.cloneDeep(resourceRequisitionUIStandardService.getStandardConfigForListView());

			requisitionFromLayout.rows.forEach(function (row) {
				row.gid = _gid;
			});

			requisitionGridLayout.columns.forEach(function (column) {
				column.gid = _gid;
			});

			let checkBoxColumn = {
				editor: 'boolean',
				editorOptions: {},
				field: 'isSelectedForContract',
				formatter: 'boolean',
				fixed: true,
				width: 150,
				formatterOptions: {},
				id: 'SelectedForContract-checkbox',
				name: translationBasePath + 'isSelectedForContract',
				name$tr$: translationBasePath + 'isSelectedForContract',
				toolTip: translationBasePath + 'isSelectedForContractToolTip',
				toolTip$tr$: translationBasePath + 'isSelectedForContractToolTip'
			};
			requisitionGridLayout.columns.unshift(checkBoxColumn);

			function createGridStep() {
				let title = translationBasePath + 'createContractStepList';
				let topDescription = translationBasePath + 'topDescription';

				hireContract.gridStep.listModel = {
					items: hireContract.gridStep.FilteredRequisitionList,
					selectedId: null,
					stepId: gridStepUuid,
					selectionListConfig: {
						selectedIdProperty: 'SelectedId',
						idProperty: 'Id',
						columns: requisitionGridLayout.columns,
						multiSelect: false
					}
				};

				let gridStep = platformWizardDialogService.createListStep($translate.instant(title), $translate.instant(topDescription), 'gridStep.listModel', gridStepUuid);
				gridStep.disallowNext = false;

				return gridStep;
			}

			let filterStep = basicsCommonWizardHelper.createStep(translationBasePath + 'filterStepTitle', [{
				model: 'meta.AmountRequisition',
				tr: translationBasePath + 'amountRequisitions',
				domain: 'integer',
				options: {readonly: true}
			}, {
				model: 'filterStep.From',
				tr: translationBasePath + 'from',
				domain: 'dateutc'
			}, {
				model: 'filterStep.To',
				tr: translationBasePath + 'to',
				domain: 'dateutc'
			}
			], $translate.instant(translationBasePath + 'filterInfo'));

			if(filteredRequisitions.length <= 0){
				filterStep.disallowNext = true;
			}
			let dataStep =
				basicsCommonWizardHelper.createStep(translationBasePath + 'dataStepTitle', [
					{
						model: 'dataStep.creationType',
						tr: translationBasePath + 'creationType',
						domain: 'radio',
						options: {
							valueMember: 'value',
							labelMember: 'label',
							groupName: _gid,
							items: [{
								value: 'procurement.contract',
								label: $translate.instant(translationBasePath + 'createContract')
							}, {
								value: 'procurement.requisition',
								label: $translate.instant(translationBasePath + 'createRequisitions')
							}]
						}
					},
					{
						model: 'dataStep.Code',
						tr: 'cloud.common.entityCode',
						domain: 'code',
						options: {
							required: true,
							readonly: true,
						}
					}]);

			filterStep.id = filterStepUuid;
			dataStep.id = dataStepUuid;
			let steps = [
				filterStep,
				createGridStep(),
				dataStep
			];

			var requisitionStatusLookup = _.find(requisitionFromLayout.rows, {model: 'RequisitionStatusFk'});
			requisitionStatusLookup.model = 'filterStep.RequisitionStatusFk';
			requisitionStatusLookup.readonly = false;
			requisitionStatusLookup.options.filterKey = 'filter-status-list-by-requsition-list';

			var project = _.find(requisitionFromLayout.rows, {model: 'ProjectFk'});
			project.model = 'filterStep.ProjectFk';
			project.readonly = false;
			project.options.filterKey = 'filter-project-list-by-requsition-list';
			project.options.lookupOptions.showClearButton = true;

			filterStep.form.rows.push(requisitionStatusLookup, project);

			setProcurementService(hireContract.dataStep);
			procurementCommonCreateService.init(hireContract.dataStep.creationType, hireContract.dataStep).then(function () {
				addProcurementConfigurationLookup(hireContract);
				addProcurementBusinessPartner(hireContract);

				var wizardConfig = {
					id: 'requisitionHire',
					title: $translate.instant(translationBasePath + 'dialogTitle'),
					steps: steps,
					width: '20%',
					height: '70%',
					watches: [{
						expression: 'filterStep',
						fn: function (info) {
							let filterStep = _.find(info.wizard.steps, {id: filterStepUuid});
							let filteredRequisitions = filterRequisitions(info.model.filterStep, requisitionServiceName);
							info.model.meta.AmountRequisition = filteredRequisitions.length;

							// keep the reference, so the watch on the items works
							info.model.gridStep.FilteredRequisitionList.length = 0;
							info.model.gridStep.FilteredRequisitionList.push(...filteredRequisitions);

							filterStep.disallowNext = (info.model.meta.AmountRequisition <= 0);
						},
						deep: true
					}, {
						expression: 'gridStep',
						fn: function (info) {
							let createContractListStep = _.find(info.wizard.steps, {id: gridStepUuid});
							createContractListStep.disallowNext = _.filter(info.model.gridStep.FilteredRequisitionList, function (reservation) {
								return reservation.isSelectedForContract === true;
							}).length === 0;
						},
						deep: true
					}, {
						expression: 'dataStep',
						fn: function (info) {
							let dataStep = _.find(info.wizard.steps, {id: dataStepUuid});
							dataStep.canFinish = checkCanFinish(info.model);
							handleCreationType(info, hireContract);
						},
						deep: true
					}],
					onChangeStep: function (info) {
						handleCreationType(info, hireContract);
						// hireContract.wizardData.procurementData.dataStep.currentSerivce.ValidationService.validateDialogConfigurationFk(info.model.wizardData.procurementData.currentItem, info.model.wizardData.procurementData.currentItem.ConfigurationFk);
						if (hireContract.dataStep.currentSerivce && hireContract.dataStep.currentSerivce.ValidationService) {
							hireContract.dataStep.currentSerivce.ValidationService.validateDialogConfigurationFk(info.model.dataStep, info.model.dataStep.currentItem.ConfigurationFk);
						}
					}
				};

				function handleCreationType(info, hireContract) {
					let dataStep = info.model.dataStep;
					// if (info.newValue && info.oldValue && info.newValue.creationType !== info.oldValue.creationType) {
					if (hireContract) {
						setProcurementService(dataStep);
						procurementCommonCreateService.init(hireContract.dataStep.creationType, hireContract.dataStep).then(function () {
							addProcurementConfigurationLookup(hireContract);
							addProcurementBusinessPartner(hireContract);
							info.scope.$broadcast('form-config-updated');
						});
						if (hireContract.dataStep.currentSerivce && hireContract.dataStep.currentSerivce.ValidationService) {
							hireContract.dataStep.currentSerivce.ValidationService.validateDialogConfigurationFk(info.model.dataStep, info.model.dataStep.currentItem.ConfigurationFk);
						}
					}
				}

				function addProcurementConfigurationLookup(hireContract) {
					let formConfig = procurementCommonCreateService.getFormConfigForDialog(hireContract.dataStep);
					let dataStep = _.find(steps, {id: dataStepUuid});
					let model = 'dataStep.currentItem.ConfigurationFk';
					_.remove(dataStep.form.rows, {model: model});
					let prcConfig = _.find(formConfig.rows, {model: 'ConfigurationFk'});
					prcConfig.model = model;
					prcConfig.gid = _gid;
					prcConfig.visible = true;
					dataStep.form.rows.push(prcConfig);
				}

				function addProcurementBusinessPartner(hireContract) {
					let model = 'dataStep.currentItem.BusinessPartnerFk';
					let dataStep = _.find(steps, {id: dataStepUuid});
					_.remove(dataStep.form.rows, {model: model});
					if (hireContract.dataStep.creationType === 'procurement.contract') {
						let headerLayout = _.cloneDeep($injector.get('procurementContractHeaderUIStandardService').getStandardConfigForDetailView());
						let businessPartnerConfig = _.find(headerLayout.rows, {model: 'BusinessPartnerFk'});
						businessPartnerConfig.model = model;
						businessPartnerConfig.gid = _gid;
						businessPartnerConfig.visible = true;
						dataStep.form.rows.push(businessPartnerConfig);
					}
				}

				platformWizardDialogService.translateWizardConfig(wizardConfig);
				platformWizardDialogService.showDialog(wizardConfig, hireContract).then(function (result) {
					if (result.success) {
						const selectedRequisitions = _.filter(hireContract.gridStep.FilteredRequisitionList, function (reservation) {
							return reservation.isSelectedForContract === true;
						});

						createHireContractForRequisitions(selectedRequisitions, hireContract);
					}
					procurementContractHeaderFilterService.unRegisterFilters();
					procurementRequisitionHeaderDataService.unRegisterFilters();
				});
			});
		}

		function checkCanFinish(data) {
			let canFinish = true;
			if (!data.dataStep.Code || !data.dataStep.currentItem.ConfigurationFk || data.meta.AmountRequisition === 0) {
				canFinish = false;
			}
			if (data.dataStep.creationType === 'procurement.contract' && data.dataStep.currentItem && !data.dataStep.currentItem.BusinessPartnerFk) {
				canFinish = false;
			}

			return canFinish;
		}

		function filterRequisitions(filterObject, requisitionServiceName) {
			let requisitions = determineRequisitionList(requisitionServiceName);
			if (filterObject) {
				if (filterObject.ProjectFk) {
					requisitions = _.filter(requisitions, {ProjectFk: filterObject.ProjectFk});
				}

				if (filterObject.RequisitionStatusFk) {
					requisitions = _.filter(requisitions, {RequisitionStatusFk: filterObject.RequisitionStatusFk});
				}

				if (filterObject.From && moment.isMoment(filterObject.From)) {
					requisitions = _.filter(requisitions, function (reservation) {
						return reservation.RequestedFrom >= filterObject.From;
					});
				}

				if (filterObject.To && moment.isMoment(filterObject.To)) {
					requisitions = _.filter(requisitions, function (reservation) {
						return reservation.RequestedTo <= filterObject.To;
					});
				}
			}

			return requisitions;
		}

		function determineRequisitionList(requisitionServiceName) {
			return $injector.get(requisitionServiceName).getList();
		}

		function loadSchemasForWizard() {
			return platformSchemaService.getSchemas([{
				typeName: 'ConHeaderDto',
				moduleSubModule: 'Procurement.Contract'
			}]);
		}

		function startWizard(requisitionServiceName) {
			return loadSchemasForWizard().then(function () {
				let requisitionList = determineRequisitionList(requisitionServiceName);
				createRequisitionToContractWizard(requisitionList, requisitionServiceName);
			});
		}

		this.createHireContractFromReservation = function createHireContract() {
			startWizard('resourceReservationPlanningBoardRequisitionService');
		};

		this.createHireContractFromEnterprise = function createHireContract() {
			startWizard('resourceEnterprisePlanningBoardRequisitionService');
		};

		this.createHireContractFromProject = function createHireContract() {
			startWizard('resourceProjectPlanningBoardRequisitionService');
		};

		this.createHireContractFromActivity = function createHireContract() {
			startWizard('activityRequisitionService');
		};

		this.createHireContractFromTransport = function createHireContract() {
			startWizard('activityRequisitionService');
		};

		this.createHireContractFromMounting = function createHireContract() {
			startWizard('mountingRequisitionService');
		};

		this.createHireContractFromEngineering = function createHireContract() {
			startWizard('productionplanningEngineeringRequisitionService');
		};

		function createHireContractForRequisitions(requisitionList, hireContractData) {
			let code = hireContractData.dataStep.Code === procurementContractNumberGenerationSettingsService.provideNumberDefaultText(_.find(basicsLookupdataLookupDescriptorService.getData('prcConfiguration'), {Id: hireContractData.dataStep.currentItem.ConfigurationFk}).RubricCategoryFk, hireContractData.dataStep.Code) ? null : hireContractData.dataStep.Code;
			const payLoad = {
				RequisitionList: requisitionList,
				Code: code,
				ProcurementConfigurationFk: hireContractData.dataStep.currentItem.ConfigurationFk,
				BusinessPartnerFk: hireContractData.dataStep.currentItem.BusinessPartnerFk
			};
			let url = globals.webApiBaseUrl + 'procurement/contract/wizard/createContractFromResourceRequisitions2';

			if (hireContractData.dataStep.creationType === 'procurement.contract') {
				return $http.post(url, payLoad).then(function (response) {
					if (response && response.data) {
						let dataItem = {
							Code: response.data.Code,
						};

						const customButtons = typeof response.data.Code === 'undefined' || response.data.Code === null ? [] : [
							{
								id: 'goto',
								caption: 'Go To Contract',
								fn: function (button, event, closeFn) {
									let navigator = platformModuleNavigationService.getNavigator('procurement.contract');
									platformModuleNavigationService.navigate(navigator, dataItem, 'Code');
									closeFn();
								}
							}
						];
						return platformModalService.showDialog(
							{
								headerTextKey: 'Create Hire Contract',
								iconClass: 'ico-info',
								bodyTextKey: response.data.Message,
								showCancelButton: false,
								customButtons
							});
					}
				});
			}
			else if (hireContractData.dataStep.creationType === 'procurement.requisition') {
				url = globals.webApiBaseUrl + 'requisition/requisition/wizard/createFromResourceRequistions';
				return $http.post(url, payLoad).then(function (response) {
					let bodyTextKey;
					let headerTextKey;
					let iconClass;
					if (response.data) {
						headerTextKey = 'Create Requisition';
						iconClass = 'ico-info';
						bodyTextKey = response.data;
					}
					platformModalService.showMsgBox(bodyTextKey, headerTextKey, iconClass);
				});
			}
		}

	}

})(angular);
