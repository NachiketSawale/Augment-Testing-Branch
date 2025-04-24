(function (angular) {
	/* global globals, _ */
	'use strict';

	var moduleName = 'resource.requisition';
	angular.module(moduleName).service('resourceRequisitionSidebarWizardService', ResourceRequisitionSidebarWizardService);

	ResourceRequisitionSidebarWizardService.$inject = ['$q', '$http', '$translate', 'platformModalService', 'resourceRequisitionDataService', 'basicsCommonChangeStatusService',
		'basicsLookupdataConfigGenerator', 'platformTranslateService', 'platformModalFormConfigService', 'basicsLookupdataLookupFilterService', 'platformLayoutHelperService',
		'basicsCompanyNumberGenerationInfoService', 'platformRuntimeDataService', 'resourceMasterConstantValues',
		'resourceCommonContextService', 'platformWizardDialogService', 'procurementContractHeaderFilterService', 'procurementRequisitionHeaderDataService', 'procurementContextService', 'basicsLookupdataLookupDescriptorService', 'platformSchemaService', 'basicsCommonWizardHelper', '$injector', 'procurementCommonCreateService', 'procurementContractNumberGenerationSettingsService', 'platformModuleNavigationService', 'platformSidebarWizardCommonTasksService'];

	function ResourceRequisitionSidebarWizardService($q, $http, $translate, platformModalService, resourceRequisitionDataService, basicsCommonChangeStatusService,
		basicsLookupdataConfigGenerator, platformTranslateService, platformModalFormConfigService, basicsLookupdataLookupFilterService,
		platformLayoutHelperService, basicsCompanyNumberGenerationInfoService, platformRuntimeDataService, resourceMasterConstantValues,
		resourceCommonContextService, platformWizardDialogService, procurementContractHeaderFilterService, procurementRequisitionHeaderDataService, procurementContextService, basicsLookupdataLookupDescriptorService, platformSchemaService, basicsCommonWizardHelper, $injector, procurementCommonCreateService, procurementContractNumberGenerationSettingsService, platformModuleNavigationService, platformSidebarWizardCommonTasksService) {
		var setRequisitionStatus = function setRequisitionStatus() {
			return basicsCommonChangeStatusService.provideStatusChangeInstance(
				{
					mainService: resourceRequisitionDataService,
					statusField: 'RequisitionStatusFk',
					descField: 'Description',
					projectField: '',
					title: 'basics.customize.resrequisitionstatus',
					statusName: 'resrequisitionstatus',
					updateUrl: 'resource/requisition/changestatus',
					id: 3
				}
			);
		};
		let self = this;
		this.setRequisitionStatus = setRequisitionStatus().fn;

		self.workOperationFks = [];
		var wizardLookupFilter = [
			{
				key: 'dispatch-nodes-rubric-category-by-rubric-filter',
				fn: function (lookupItem) {
					return lookupItem.RubricFk === 34; // Logistic Dispatching Rubric
				}
			}, {
				key: 'resource-wot-by-plant-type-filter',
				fn: function (lookupItem) {
					return _.some(self.workOperationFks, wotFk => wotFk === lookupItem.Id);
				}
			}
		];

		basicsLookupdataLookupFilterService.registerFilter(wizardLookupFilter);

		function getItemWoStockText(itemInfos) {
			let text = 'No stock is assigned to the following requisition items:';
			_.forEach(itemInfos, function(item) {
				text += '<br>Requisition: ' + item.Requisition + '  ';
				text += ', Material: ' + item.Material;
				text += ', Item: ' + item.Item;
			});

			return text;
		}
		this.reserveMaterialAndStock = function reserveMaterialAndStock() {
			var title = $translate.instant('resource.requisition.titelreservematerialandstock');

			if (resourceRequisitionDataService.getSelected()) {

				var data = {
					Requisitions: resourceRequisitionDataService.getSelectedEntities(),

				};
				$http.post(globals.webApiBaseUrl + 'resource/requisition/reservematerial', data).then(function (response) {
					if (response && response.data !== 'undefined' && response.data.length > 0) {
						resourceRequisitionDataService.takeOverFromMaterialReservation(response);

						let reqItemWoStock = [];
						_.forEach(response.data, function (res) {
							if(res.RequisitonItemsWOStock && res.RequisitonItemsWOStock.length) {
								_.forEach(res.RequisitonItemsWOStock, function(item) {
									reqItemWoStock.push({ Requisition: res.Description, Material: item.MaterialCode, Item: item.Description });
								});
							}
						});
						if (reqItemWoStock.length >= 1) {
							var modalOptions = {
								headerTextKey: 'resource.requisition.requisitionDetailTitle',
								bodyTextKey: getItemWoStockText(reqItemWoStock),
								showOkButton: true,
								showCancelButton: true,
								resizeable: true,
								height: '200px',
								iconClass: 'info'
							};
						} else {
							var modalOptions = {
								headerTextKey: 'resource.requisition.requisitionDetailTitle',
								bodyTextKey: 'Material is reserved for all requisition items',
								showOkButton: true,
								showCancelButton: true,
								resizeable: true,
								height: '200px',
								iconClass: 'info'
							};
						}

						platformModalService.showDialog(modalOptions);

					} else {
						platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage(modalCreateConfig.title);
					}

				});

			} else {
				// Error MessageText
				var modalOptions = {
					headerText: $translate.instant(title),
					bodyText: $translate.instant('cloud.common.noCurrentSelection'),
					iconClass: 'ico-info'
				};
				platformModalService.showDialog(modalOptions);
			}
		};

		this.createDispatchingForMaterialReservation = function createDispatchingForMaterialReservation() {
			var title = $translate.instant('resource.requisition.dispatchingWizard.titelCreateDispatchingForMaterialReservation');
			if (resourceRequisitionDataService.getSelected()) {
				var infoService = basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('logisticDispatchingHeaderNumberInfoService', 34);
				infoService.load();
				var dataItem = {
					RubricCategoryFk: null,
					WorkoperationTypeFk: null,
					DateEffective: null,
					PerformingJob: resourceRequisitionDataService.getSelected().JobPreferredFk,
					ReceivingJob: resourceRequisitionDataService.getSelected().JobFk,
					PlantFk: null,
					TypeFk: resourceRequisitionDataService.getSelected().TypeFk,
				};

				let withoutPreferredResources = false;
				let checkDisallowStep2 = function () {
					if (resourceRequisitionDataService.getSelected().RequisitionTypeFk === 1) {
						return !(dataItem.RubricCategoryFk && dataItem.PerformingJob && dataItem.ReceivingJob && withoutPreferredResources && dataItem.TypeFk);
					} else {
						return true;
					}
				};

				let checkCanFinishStep1 = function () {
					return dataItem.RubricCategoryFk && dataItem.PerformingJob && dataItem.ReceivingJob && (withoutPreferredResources || dataItem.WorkoperationTypeFk) && checkDisallowStep2();
				};

				let checkCanFinishStep2 = function () {
					return dataItem.PlantFk;
				};

				var validateRubricCategory = function (entity, value) {
					if (entity.RubricCategoryFk !== value) {
						if (infoService.hasToGenerateForRubricCategory(value)) {
							platformRuntimeDataService.readonly(entity, [{field: 'Code', readonly: true}]);
							entity.Code = infoService.provideNumberDefaultText(value, entity.Code);
						} else {
							entity.Code = '';
							platformRuntimeDataService.readonly(entity, [{field: 'Code', readonly: false}]);
						}
					}
				};

				var showInfoMsg = function showInfoMsg() {
					var modalOptions = {
						headerText: $translate.instant('resource.requisition.dispatchingWizard.titelCreateDispatchingForMaterialReservation'),
						bodyText: $translate.instant('resource.requisition.dispatchingWizard.errorMsgNoRequisition'),
						iconClass: 'ico-info'
					};
					platformModalService.showDialog(modalOptions);
				};
				var showSomeHaveNoMaterialOrResourceInfoMsg = function showSomeHaveNoMaterialOrResourceInfoMsg() {
					var modalOptions = {
						headerText: $translate.instant('resource.requisition.dispatchingWizard.titelCreateDispatchingForMaterialReservation'),
						bodyText: $translate.instant('resource.requisition.dispatchingWizard.errorMsgNoMaterial'),
						iconClass: 'ico-info'
					};
					platformModalService.showDialog(modalOptions);
				};
				var showSomeHaveNoPlantResourcePartInfoMsg = function showSomeHaveNoPlantResourcePartInfoMsg() {
					var modalOptions = {
						headerText: $translate.instant('resource.requisition.dispatchingWizard.titelCreateDispatchingForMaterialReservation'),
						bodyText: $translate.instant('resource.requisition.dispatchingWizard.errorMsgNoPlantResourcePart'),
						iconClass: 'ico-info'
					};
					platformModalService.showDialog(modalOptions);
				};

				var showFinishedMsg = function showFinishedMsg(headerCode) {
					var modalOptions = {
						headerText: $translate.instant('resource.requisition.dispatchingWizard.titelCreateDispatchingForMaterialReservation'),
						bodyText: $translate.instant('resource.requisition.dispatchingWizard.finishedMsg').replace('{0}', headerCode),
						iconClass: 'ico-info'
					};
					platformModalService.showDialog(modalOptions);
				};

				let requistions = resourceRequisitionDataService.getSelectedEntities();
				if (requistions !== null) {
					let selectedRequisition = resourceRequisitionDataService.getSelected();
					let filteredRequistions = _.filter(requistions, req => req.JobFk === selectedRequisition.JobFk);
					dataItem.DateEffective = _.min(_.map(filteredRequistions, req => req.RequestedFrom));
					let resourceRequistions = _.filter(filteredRequistions, req => req.ResourceFk !== null);
					self.resourceFks = _.map(resourceRequistions, resReq => resReq.ResourceFk);
					$http.post(globals.webApiBaseUrl + 'resource/master/resourcePart/listByParents', _.map(resourceRequistions, req => req.ResourceFk)).then(function (response) {
						if (_.every(resourceRequistions, req => _.some(response.data, part => part.ResourceFk === req.ResourceFk && part.ResourcePartTypeFk === resourceMasterConstantValues.type.plant))) {
							let allAppearingPlantFks = _.map(_.filter(response.data, part => part.ResourcePartTypeFk === resourceMasterConstantValues.type.plant), part => part.PlantFk);
							let promises = [resourceCommonContextService.init(), $http.post(globals.webApiBaseUrl + 'resource/wot/workoperationtype/getworkoperationtypbycontextandplants', allAppearingPlantFks)];
							$q.all(promises).then(function (response) {
								let wots = response[1].data;
								let context = response[0];
								self.workOperationFks = _.map(_.filter(wots, w => w.EquipmentContextFk === context.EquipmentContextFk), w => w.Id);

								withoutPreferredResources = !_.some(self.resourceFks);

								var modalCreateConfig = {
									title: title,
									dataItem: dataItem,
									formConfiguration: {
										fid: 'resource.requisition.createdispatchingformaterialreservation',
										version: '0.2.4',
										showGrouping: false,
										groups: [
											{
												gid: 'baseGroup',
												attributes: ['PrjStockFk']
											}
										],
										rows: [
											{
												gid: 'baseGroup',
												rid: 'rubricCategoryFk',
												model: 'RubricCategoryFk',
												required: true,
												sortOrder: 1,
												label$tr$: 'resource.requisition.dispatchingWizard.entityRubric',
												label: 'Rubric Category',
												validator: validateRubricCategory,
												type: 'directive',
												directive: 'basics-lookupdata-lookup-composite',
												options: {
													lookupDirective: 'basics-lookupdata-rubric-category-by-rubric-and-company-lookup',
													descriptionMember: 'Description',
													lookupOptions: {
														filterKey: 'dispatch-nodes-rubric-category-lookup-filter',
														showClearButton: true
													}
												},
												formatter: 'lookup',
												formatterOptions: {
													lookupType: 'RubricCategoryByRubricAndCompany',
													displayMember: 'Description'
												}
											},
											{
												gid: 'baseGroup',
												rid: 'Dateeffective',
												label: 'Date Effectiv',
												label$tr$: 'resource.requisition.dispatchingWizard.entityDateEffective',
												model: 'DateEffective',
												type: 'datetimeutc'
											},
											getJobRow({
												gid: 'baseGroup',
												rid: 'performingjob',
												label: 'Performing Job',
												label$tr$: 'resource.requisition.dispatchingWizard.entityPerformingJob',
												model: 'PerformingJob'
											}, 4),
											getJobRow({
												gid: 'baseGroup',
												rid: 'receivingjob',
												label: 'Receiving Job',
												label$tr$: 'resource.requisition.dispatchingWizard.entityReceivingJob',
												model: 'ReceivingJob'
											}, 5),

										]
									},
									handleOK: function handleOK(result) {
										var data = {
											RubricCategoryId: result.data.RubricCategoryFk,
											RequisitionIds: _.map(filteredRequistions, 'Id'),
											DateEffective: result.data.DateEffective,
											PerformingJobId: result.data.PerformingJob,
											ReceivingJobId: result.data.ReceivingJob,
											WorkoperationTypeId: result.data.WorkoperationTypeFk,
											FocusedRequisitionId: selectedRequisition.Id
										};
										$http.post(globals.webApiBaseUrl + 'resource/requisition/dispatchingformaterialres', data).then(function (response) {
											resourceRequisitionDataService.refresh();
											showFinishedMsg(response.data);
											return null;
										});
									},
									dialogOptions: {
										disableOkButton: checkDisallowStep2
									}
								};

								if (!withoutPreferredResources) {
									modalCreateConfig.formConfiguration.rows.push(
										basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm(
											'resource.wot.workoperationtype',
											'Description',
											{
												gid: 'baseGroup',
												rid: 'workoperationTypeFk',
												model: 'WorkoperationTypeFk',
												required: !withoutPreferredResources,
												sortOrder: 1,
												label$tr$: 'resource.requisition.dispatchingWizard.WorkoperationTypeFk',
												showClearButton: false,
											},
											false,
											{
												filterKey: 'resource-wot-by-plant-type-filter',
											}));
								}

								function updateValidationStatus(info) {
									info.wizard.steps[0].disallowNext = checkDisallowStep2();
									info.wizard.steps[0].canFinish = checkCanFinishStep1();
									info.scope.$broadcast('form-config-updated');
								}

								let step2Rows = [
									getPlantRow({
										gid: 'baseGroup',
										rid: 'plantFk',
										label: 'Plant',
										label$tr$: 'resource.requisition.dispatchingWizard.entityPlant',
										model: 'PlantFk',
									}, 1),
									basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
										dataServiceName: 'resourceTypeLookupDataService',
										cacheEnable: true,
										additionalColumns: false,
										showClearButton: true,
										// filterKey: 'fllter-type-by-isplant',
									}, {
										gid: 'baseGroup',
										rid: 'type',
										label: 'ResourceType',
										label$tr$: 'ResourceType',
										type: 'integer',
										model: 'TypeFk',
										required: true,
										readonly: true,
										sortOrder: 2
									}),
								];

								function updateValidationStatus2(info) {
									info.wizard.steps[1].canFinish = checkCanFinishStep2();
									info.scope.$broadcast('form-config-updated');
								}

								let wizardConfig = {
									id: 'createDispatchNotes',
									title: modalCreateConfig.title,
									steps: [
										{
											id: 'createDispatchNotes1',
											title: modalCreateConfig.title,
											form: modalCreateConfig.formConfiguration,
											disallowBack: true,
											disallowNext: checkDisallowStep2(),
											canFinish: checkCanFinishStep1(),
											watches: [
												{
													expression: 'RubricCategoryFk',
													fn: updateValidationStatus
												},
												{
													expression: 'PerformingJob',
													fn: updateValidationStatus
												},
												{
													expression: 'ReceivingJob',
													fn: updateValidationStatus
												},
												{
													expression: 'WorkoperationTypeFk',
													fn: updateValidationStatus
												},
											]
										},
										{
											id: 'createDispatchNotes2',
											title$tr$: 'resource.requisition.createdispatchingformaterialreservation',
											form: {
												fid: 'resource.requisition.createdispatchingformaterialreservation',
												version: '1.0.0',
												showGrouping: false,
												skipPermissionsCheck: true,
												groups: [{
													gid: 'baseGroup',
												}],
												rows: step2Rows,

											},
											canFinish: checkCanFinishStep2(),
											disallowBack: false,
											disallowNext: true,
											watches: [
												{
													expression: 'PlantFk',
													fn: updateValidationStatus2
												},
											]
										}
									]
								};

								// platformTranslateService.translateFormConfig(modalCreateConfig.formConfiguration);
								// setReadonly(modalCreateConfig);
								// platformModalFormConfigService.showDialog(modalCreateConfig);

								platformWizardDialogService.translateWizardConfig(wizardConfig);
								platformWizardDialogService.showDialog(wizardConfig, dataItem).then(function (result) {
									console.log(result);
									if (result.success) {
										var data = {
											RubricCategoryId: result.data.RubricCategoryFk,
											RequisitionIds: _.map(filteredRequistions, 'Id'),
											DateEffective: result.data.DateEffective,
											PerformingJobId: result.data.PerformingJob,
											ReceivingJobId: result.data.ReceivingJob,
											WorkoperationTypeId: result.data.WorkoperationTypeFk,
											FocusedRequisitionId: selectedRequisition.Id,
											PlantId: result.data.PlantFk,
											TypeId: result.data.TypeFk
										};
										$http.post(globals.webApiBaseUrl + 'resource/requisition/dispatchingformaterialres', data).then(function (response) {
											resourceRequisitionDataService.refresh();
											showFinishedMsg(response.data);
											return null;
										});

									}
								});
							});
						} else {
							showSomeHaveNoPlantResourcePartInfoMsg();
						}
					});
				} else {
					showInfoMsg();
				}
			} else {
				// Error MessageText
				var modalOptions = {
					headerText: $translate.instant(title),
					bodyText: $translate.instant('cloud.common.noCurrentSelection'),
					iconClass: 'ico-info'
				};
				platformModalService.showDialog(modalOptions);
			}

		};

		function setReadonly(modalCreateConfig) {
			var entity = _.find(modalCreateConfig.formConfiguration.rows, {model: 'ReceivingJob'});
			entity.readonly = true;
		}

		function getJobRow(options, sortOrder) {
			var jobRow = platformLayoutHelperService.provideJobLookupOverload().detail;
			angular.extend(jobRow, {
				sortOrder: sortOrder, required: true,
				gid: options.gid,
				rid: options.rid,
				label: options.label,
				label$tr$: options.label$tr$,
				model: options.model
			});
			return jobRow;
		}

		function getPlantRow(options, sortOrder) {
			let plantRow = platformLayoutHelperService.providePlantLookupOverload().detail;
			angular.extend(plantRow, {
				sortOrder: sortOrder,
				required: true,
				gid: options.gid,
				rid: options.rid,
				label: options.label,
				label$tr$: options.label$tr$,
				model: options.model
			});
			return plantRow;
		}

		// **************************************************Create Hire Contract from a requisition ************************************************************************
		function createRequisitionToContractWizard(requisitions) {

			function setProcurementService(wizardData) {
				let serviceName = '';
				if (wizardData.creationType === 'procurement.contract') {
					serviceName = 'procurementContractHeaderDataService';
				} else {
					serviceName = 'procurementRequisitionHeaderDataService';
				}

				procurementContextService.setMainService($injector.get(serviceName));
				procurementContextService.setLeadingService($injector.get(serviceName));
			}

			const dataStepUuid = '208b6bcf99814688921c26450d40130f';
			procurementContractHeaderFilterService.registerFilters();
			procurementRequisitionHeaderDataService.registerFilters();

			let _gid = 'group';
			let translationBasePath = 'cloud.common.requisitionHire.';

			let hireContract = {
				Code: null,
				Version: 0,
				wizardData: {
					Version: 0,
					RubricCategoryFk: null,
					creationType: 'procurement.contract',// default
				},
				currentSerivce: {},
				currentItem: {
					Code: null,
					Version: 0
				}
			};

			let dataStep =
				basicsCommonWizardHelper.createStep(translationBasePath + 'dataStepTitle', [
					{
						model: 'wizardData.creationType',
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
						model: 'Code',
						tr: 'cloud.common.entityCode',
						domain: 'code',
						options: {required: true}
					}]);

			dataStep.id = dataStepUuid;
			let steps = [
				dataStep
			];

			setProcurementService(hireContract.wizardData);
			procurementCommonCreateService.init(hireContract.wizardData.creationType, hireContract).then(function () {
				addProcurementConfigurationLookup(hireContract);
				addProcurementBusinessPartner(hireContract);

				let wizardConfig = {
					id: 'requisitionHire',
					title: $translate.instant(translationBasePath + 'dialogTitle'),
					steps: steps,
					width: '20%',
					height: '70%',
					watches: [{
						expression: 'wizardData',
						fn: function (info) {

							let dataStep = _.find(info.wizard.steps, {id: dataStepUuid});
							let data = info.model;
							dataStep.canFinish = checkCanFinish(data);
							handleCreationType(info, hireContract);
						},
						deep: true
					}, {
						expression: 'Code',
						fn: function (info) {
							let dataStep = _.find(info.wizard.steps, {id: dataStepUuid});
							dataStep.canFinish = checkCanFinish(info.model);
						}
					},
					{
						expression: 'currentItem',
						fn: function (info) {
							let dataStep = _.find(info.wizard.steps, {id: dataStepUuid});
							dataStep.canFinish = checkCanFinish(info.model);
						},
						deep: true
					}
					],
					onChangeStep: function (info) {
						handleCreationType(info, hireContract);
						// hireContract.wizardData.procurementData.currentSerivce.ValidationService.validateDialogConfigurationFk(info.model.wizardData.procurementData.currentItem, info.model.wizardData.procurementData.currentItem.ConfigurationFk);
						if (hireContract.currentSerivce && hireContract.currentSerivce.ValidationService) {
							hireContract.currentSerivce.ValidationService.validateDialogConfigurationFk(info.model, info.model.currentItem.ConfigurationFk);
						}
					}
				};

				function handleCreationType(info, hireContract) {
					let wizardData = info.model.wizardData;
					// if (info.newValue && info.oldValue && info.newValue.creationType !== info.oldValue.creationType) {
					if (hireContract) {
						setProcurementService(wizardData);
						procurementCommonCreateService.init(hireContract.wizardData.creationType, hireContract).then(function () {
							addProcurementConfigurationLookup(hireContract);
							addProcurementBusinessPartner(hireContract);
							info.scope.$broadcast('form-config-updated');
						});
						if (hireContract.currentSerivce && hireContract.currentSerivce.ValidationService) {
							hireContract.currentSerivce.ValidationService.validateDialogConfigurationFk(info.model, info.model.currentItem.ConfigurationFk);
						}
					}
				}

				function addProcurementConfigurationLookup(hireContract) {
					let formConfig = procurementCommonCreateService.getFormConfigForDialog(hireContract);
					let model = 'currentItem.ConfigurationFk';
					_.remove(steps[0].form.rows, {model: model});
					let prcConfig = _.find(formConfig.rows, {model: 'ConfigurationFk'});
					prcConfig.model = model;
					prcConfig.gid = _gid;
					prcConfig.visible = true;
					steps[0].form.rows.push(prcConfig);

				}

				function addProcurementBusinessPartner(hireContract) {
					let model = 'currentItem.BusinessPartnerFk';
					_.remove(steps[0].form.rows, {model: model});
					if (hireContract.wizardData.creationType === 'procurement.contract') {
						let headerLayout = _.cloneDeep($injector.get('procurementContractHeaderUIStandardService').getStandardConfigForDetailView());
						let businessPartnerConfig = _.find(headerLayout.rows, {model: 'BusinessPartnerFk'});
						businessPartnerConfig.model = model;
						businessPartnerConfig.gid = _gid;
						businessPartnerConfig.visible = true;
						steps[0].form.rows.push(businessPartnerConfig);
					}
				}

				platformWizardDialogService.translateWizardConfig(wizardConfig);
				platformWizardDialogService.showDialog(wizardConfig, hireContract).then(function (result) {

					if (result.success) {
						// let requisitionList = resourceRequisitionDataService.getList();//filterRequisitions(hireContract.wizardData, requisitionServiceName);
						requisitions = resourceRequisitionDataService.getSelectedEntities();
						createHireContractForRequisitions(requisitions, hireContract);
					}
					procurementContractHeaderFilterService.unRegisterFilters();
					procurementRequisitionHeaderDataService.unRegisterFilters();
				});
			});
		}

		function checkCanFinish(data) {
			let canFinish = true;
			if (!data.Code || !data.currentItem.ConfigurationFk) {
				canFinish = false;
			}
			if (data.wizardData.creationType === 'procurement.contract' && data.currentItem && !data.currentItem.BusinessPartnerFk) {
				canFinish = false;
			}

			return canFinish;
		}

		function loadSchemasForWizard() {
			return platformSchemaService.getSchemas([{
				typeName: 'ConHeaderDto',
				moduleSubModule: 'Procurement.Contract'
			}]);
		}

		function startWizard(requisitionServiceName) {
			return loadSchemasForWizard().then(function () {
				let selectedRequisitions = resourceRequisitionDataService.getSelectedEntities();
				if (selectedRequisitions.length <= 0) {
					showMessage('', false);
					return;
				}

				createRequisitionToContractWizard(selectedRequisitions, requisitionServiceName);
			});
		}

		this.createHireContractFromRequisition = function createHireContract() {
			startWizard('resourceRequisitionDataService');
		};

		function createHireContractForRequisitions(requisitionList, hireContractData) {
			let code = hireContractData.Code === procurementContractNumberGenerationSettingsService.provideNumberDefaultText(_.find(basicsLookupdataLookupDescriptorService.getData('prcConfiguration'), {Id: hireContractData.currentItem.ConfigurationFk}).RubricCategoryFk, hireContractData.Code) ? null : hireContractData.Code;
			const payLoad = {
				RequisitionList: requisitionList,
				Code: code,
				ProcurementConfigurationFk: hireContractData.currentItem.ConfigurationFk,
				BusinessPartnerFk: hireContractData.currentItem.BusinessPartnerFk
			};
			let url = globals.webApiBaseUrl + 'procurement/contract/wizard/createContractFromResourceRequisitions2';

			if (hireContractData.wizardData.creationType === 'procurement.contract') {
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
			} else if (hireContractData.wizardData.creationType === 'procurement.requisition') {
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

		function showMessage(req, result) {
			let bodyTextKey;
			let headerTextKey;
			let iconClass = 'ico-error'; // error
			if (result && result.success === true) {
				headerTextKey = 'cloud.common.creationSuccess';
				iconClass = 'ico-info';
				bodyTextKey = headerTextKey;
			} else if (!req) {
				headerTextKey = 'cloud.common.requisitionHire.creationErrorNoRequisitionSelectedTitle';
				bodyTextKey = 'cloud.common.requisitionHire.creationErrorNoRequisitionSelected';
			} else {
				headerTextKey = 'cloud.common.requisitionHire.creationErrorNoRequisitionSelectedTitle';
				bodyTextKey = 'cloud.common.requisitionHire.creationErrorNoRequisitionSelected';
			}
			platformModalService.showMsgBox(bodyTextKey, headerTextKey, iconClass);
		}
		this.changeRequisitionRequestedDate = function changeRequisitionRequestedDate() {
			let requisitionSelected = resourceRequisitionDataService.getSelected();
			let changeRequisition = {};
			if(requisitionSelected !== null){
				changeRequisition["wizardData"]  = {
					selections: {
						RequisitionFk: requisitionSelected.Id,
						Code:requisitionSelected.Code,
						RequestedFrom: requisitionSelected.RequestedFrom,
						RequestedFromOld: requisitionSelected.RequestedFrom
				}};
				let wzConfig = {
					title: 'Generate Resource Requisition from Estimate',
					title$tr$: 'resource.requisition.changeRequisitionRequestedDateWzd.title',
					width: '80%',
					height: '500px',
					steps: [
						{
							id: 'filter',
							title: 'Inputs',
							title$tr$: 'resource.requisition.changeRequisitionRequestedDateWzd.inputSection.title',
							form: {
								fid: 'wzExample.nameForm',
								version: '1.0.0',
								showGrouping: true,
								skipPermissionsCheck: true,
								groups: [
									{
										gid: 'selections',
										header: 'Selections',
										header$tr$: 'resource.project.genRequisitionWiz.inputSection.selectionsGroup',
										isOpen: true
									},
									{
										gid: 'inputs',
										header: 'Inputs',
										header$tr$: 'resource.project.genRequisitionWiz.inputSection.inputsGroup',
										isOpen: true
									}],
								rows: [
									{
										gid: 'inputs',
										rid: 'NewStartDate',
										label: 'New Start Date',
										label$tr$: 'resource.project.genRequisitionWiz.inputSection.entityNewStartDate',
										type: 'dateutc',
										model: 'wizardData.selections.RequestedFrom',
										sortOrder: 1
									},
									{
										gid: 'selections',
										rid: 'OldStartDate',
										label: 'Previous Start Date',
										label$tr$: 'resource.project.genRequisitionWiz.inputSection.entityOldStartDate',
										type: 'dateutc',
										model: 'wizardData.selections.RequestedFromOld',
										sortOrder: 2,
										readonly:true
									},
									{
										gid: 'selections',
										rid: 'StartDate',
										label: 'Selected Requisition',
										label$tr$: 'cloud.common.code',
										type: 'code',
										model: 'wizardData.selections.Code',
										sortOrder: 1,
										readonly:true
									},
								]
							}
						},
						{
							id: 'proccessing',
							title: 'Proccessing...',
							title$tr$: 'resource.requisition.changeRequisitionRequestedDateWzd.proccessingSection.title',
							disallowNext: true,
							disallowBack: true,
							prepareStep: function (info) {
								$http.post(globals.webApiBaseUrl + 'resource/requisition/changerequesteddate', info.model.wizardData.selections
								).then(function (result) {
									var completition = _.find(info.wizard.steps, function (step) {
										return step.id === 'completition';
									});
									completition.message = $translate.instant('resource.requisition.changeRequisitionRequestedDateWzd.completition.message').replace('{0}', result.data.length);
									info.step.disallowNext = false;
									info.commands.goToNext();
								});
							}
						},
						{
							id: 'completition',
							title: 'Completion',
							title$tr$: 'resource.requisition.changeRequisitionRequestedDateWzd.completition',
							message: 'Done!',
							disallowBack: true,
							canFinish: true
						}
					]
				};
				platformWizardDialogService.translateWizardConfig(wzConfig);
				platformWizardDialogService.showDialog(wzConfig, changeRequisition).then(function (result) {
					if (result.success) {
						// console.log(result.data.firstName + ' ' + result.data.middleName + ' ' + result.data.lastName + ', ' + result.data.age);
					}
				});
			}
			else{
				showErrorMessage("resource.project.genRequisitionWiz.title","No Estimate Header selected")
			}
		};
	}

})(angular);
