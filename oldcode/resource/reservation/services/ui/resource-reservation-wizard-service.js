(function (angular) {
	'use strict';

	var moduleName = 'resource.reservation';
	angular.module(moduleName).service('resourceReservationSidebarWizardService', ResourceReservationSidebarWizardService);

	ResourceReservationSidebarWizardService.$inject = ['_', 'resourceReservationDataService', 'basicsCommonChangeStatusService', '$http',
		'resourceReservationPlanningBoardReservationService', 'platformWizardDialogService', '$translate', 'basicsCommonWizardHelper',
		'basicsLookupdataConfigGenerator', 'platformModalService', 'basicsLookupdataLookupFilterService', '$injector', 'moment',
		'platformRuntimeDataService', 'platformSchemaService','resourceReservationPlanningBoardRequisitionService', 'platformPlanningBoardDataService'];

	function ResourceReservationSidebarWizardService(_, resourceReservationDataService, basicsCommonChangeStatusService, $http,
		resourceReservationPlanningBoardReservationService, platformWizardDialogService, $translate, basicsCommonWizardHelper,
		basicsLookupdataConfigGenerator, platformModalService, basicsLookupdataLookupFilterService, $injector, moment, platformRuntimeDataService,
		platformSchemaService, resourceReservationPlanningBoardRequisitionService, platformPlanningBoardDataService) {

		let getStatusIdCallBack = null;
		var wizardLookupFilter = [
			{
				key: 'filter-status-list-by-reservation-list',
				fn: function (lookupItem) {
					return getStatusIdCallBack().includes(lookupItem.Id);
				}
			},
			{
				key: 'dispatch-nodes-rubric-category-by-rubric-filter',
				fn: function (lookupItem) {
					return lookupItem.RubricFk === 34; // Logistic Dispatching Rubric
				}
			},
			{
				key: 'filter-project-list-by-reservation-list',
				fn: function (lookupItem) {
					return getProjectIdList().includes(lookupItem.Id);
				}
			},
			{
				key: 'jobs-by-project-filter',
				fn: function (lookupItem, entity) {
					var result = null;
					if (entity.wizardData.Filter.ProjectFk) {
						result = lookupItem.ProjectFk === entity.wizardData.Filter.ProjectFk;
					} else {
						result = getProjectIdList().includes(lookupItem.ProjectFk);
					}
					return result;
				}
			}
		];

		basicsLookupdataLookupFilterService.registerFilter(wizardLookupFilter);

		var translationNamespace = 'resource.reservation.reservation2dispatchHeaderWizard.';
		var setReservationStatus = function setReservationStatus() {
			return basicsCommonChangeStatusService.provideStatusChangeInstance(
				{
					refreshMainService: false,
					mainService: resourceReservationDataService,
					statusField: 'ReservationStatusFk',
					descField: 'Description',
					projectField: '',
					title: 'basics.customize.resreservationstatus',
					statusName: 'resreservationstatus',
					updateUrl: 'resource/reservation/changestatus',
					id: 1,
					supportMultiChange: true,
					doStatusChangePostProcessing: function (item){
						if(item){
							const boardEntity = resourceReservationPlanningBoardReservationService.getItemById(item.Id);
							if(boardEntity){
								boardEntity.ReservationStatusFk = item.ReservationStatusFk;
								boardEntity.IsReadOnly = item.IsReadOnly;
								if(item.IsReadOnly){
									resourceReservationDataService.setEntityReadOnlyAfterStatusChange(item);
									resourceReservationPlanningBoardReservationService.setEntityReadOnlyAfterStatusChange(boardEntity);
								}
								let pbDataService = platformPlanningBoardDataService.getPlanningBoardDataServiceByUUID('b1436d024b4b4ca592e58c8ea34384a7');
								pbDataService.planningBoardReDraw();
							}
						}
					}
				}
			);
		};

		this.setReservationStatus = setReservationStatus().fn;

		let changeRequisitionStatus = function changeRequisitionStatus() {
			return basicsCommonChangeStatusService.provideStatusChangeInstance(
				{
					refreshMainService: false,
					mainService: resourceReservationDataService,
					dataService: resourceReservationPlanningBoardRequisitionService,
					statusField: 'RequisitionStatusFk',
					descField: 'Description',
					projectField: '',
					title: 'resource.requisition.changeRequisitionStatusWizard.title',
					statusName: 'resrequisitionstatus',
					updateUrl: 'resource/requisition/changestatus',
					id: 1,
					supportMultiChange: true
				}
			);
		};
		this.changeRequisitionStatus = changeRequisitionStatus().fn;


		function createReservationToDispatchNodesWizard(reservations, reservationServiceName, reservationServiceNameAlternative, usePlanningBoardReservations) {

			var gid = 'group';

			const filterStepUuid = 'db39b40b25c24de2908b05542adf4a9a';
			const reservationStepUuid = '949858adbb7f47f78c476998a8944303';
			const dataStepUuid = '532a0eb09ca641c0b6be47855bfe3a3f';

			function getStatusIdList() {
				return _.union(_.map(reservations, function (reservation) {
					return reservation.ReservationStatusFk;
				}));
			}

			getStatusIdCallBack = getStatusIdList;

			function getProjectIdList() {
				return _.union(_.map(reservations, function (reservation) {
					return reservation.ProjectFk;
				}));
			}

			var reservationData = {
				wizardData: {
					Filter: {
						ReservationStatusFk: null,
						ProjectFk: null,
						AmountReservations: filterReservations(null, reservationServiceName).length,
						From: usePlanningBoardReservations ? moment.min(_.map(filterReservations(null, reservationServiceName), function (reservation) {
							return reservation.ReservedFrom;
						})) : null,
						To: usePlanningBoardReservations ? moment.max(_.map(filterReservations(null, reservationServiceName), function (reservation) {
							return reservation.ReservedTo;
						})) : null
					},
					//Reservations: [],
					Reservations: {
						ResultList: [],
					},
					Data:{
						IsDescDefaultedByRecJob: true,
						PerformingJobFk: null,//resourceReservationDataService.getSelected().JobPreferredFk,
						Description: null,
						RubricCategoryFk: null,
					},
					listModel: {},
					usePlanningBoardReservations: usePlanningBoardReservations,
					num : Math.random() * 10
				}
			};


			var resourceReservationUIStandardService = $injector.get('resourceReservationUIStandardService');

			var dispatchHeaderLayout = $injector.get('logisticDispatchingHeaderUIConfigurationService');

			dispatchHeaderLayout = _.cloneDeep(dispatchHeaderLayout.getStandardConfigForDetailView());

			var reserverationFormLayout = _.cloneDeep(resourceReservationUIStandardService.getStandardConfigForDetailView());

			var reserverationGridLayout = _.cloneDeep(resourceReservationUIStandardService.getStandardConfigForListView());


			_.each(dispatchHeaderLayout.rows, function (row) {
				row.gid = gid;
			});

			_.each(reserverationFormLayout.rows, function (row) {
				row.gid = gid;
			});

			_.each(reserverationGridLayout.columns, function (column) {
				column.readonly = true;
				column.editor = null;
			});

			var checkBoxColumn = {
				editor: 'boolean',
				editorOptions: {},
				field: 'isSelectedForDispatch',
				formatter: 'boolean',
				fixed: true,
				width: 150,
				formatterOptions: {},
				id: 'SelectedForDispatch-checkbox',
				name: translationNamespace + 'isSelectedForDispatch',
				name$tr$: translationNamespace + 'isSelectedForDispatch',
				toolTip: translationNamespace + 'isSelectedForDispatchToolTip',
				toolTip$tr$: translationNamespace + 'isSelectedForDispatchToolTip'
			};
			reserverationGridLayout.columns.unshift(checkBoxColumn);


			function createGridStep() {
				let title = translationNamespace + 'reservationStepList';
				let topDescription = translationNamespace + 'topDescription';
				let model = {
					items: reservationData.wizardData.Reservations.ResultList,
					selectedId: null,
					stepId: reservationStepUuid,
					selectionListConfig: {
						selectedIdProperty: 'SelectedId',
						idProperty: 'Id',
						columns: reserverationGridLayout.columns,
						multiSelect: false
					}
				};
				reservationData.wizardData.listModel = model;
				let listStep = platformWizardDialogService.createListStep($translate.instant(title), $translate.instant(topDescription), 'wizardData.listModel', reservationStepUuid);
				listStep.disallowNext = true;
				listStep.cssClass = '';
				listStep.prepareStep = function (info) {
					listStep.disallowNext = !isValidToEnterDataStep(info);
				};
				checkBoxColumn.validator = function validator(entity, value) {
					if (value){
						listStep.disallowNext = false;
					}
					else{
						if(_.some(reservationData.wizardData.Reservations.ResultList, reserv => reserv.isSelectedForDispatch && reserv.Id !== entity.Id)){
							listStep.disallowNext = false;
						}
						else{
							listStep.disallowNext = true;
						}
					}
				};
				return listStep;
			}

			var fieldList = [
				{
					model: 'wizardData.Filter.AmountReservations',
					tr: translationNamespace + 'amountReservations',
					domain: 'integer',
					options: {readonly: true}
				}, {
					model: 'wizardData.Filter.From',
					tr: translationNamespace + 'from',
					domain: 'dateutc'
				}, {
					model: 'wizardData.Filter.To',
					tr: translationNamespace + 'to',
					domain: 'dateutc'
				}];

			if (reservationServiceNameAlternative) {
				fieldList.unshift({
					model: 'wizardData.usePlanningBoardReservations',
					domain: 'boolean',
					tr: translationNamespace + 'usePlanningBoardReservations'
				});
			}

			let filterStep = basicsCommonWizardHelper.createStep(translationNamespace + 'filterStepTitle', fieldList, $translate.instant(translationNamespace + 'filterInfo'));
			let dataStep = basicsCommonWizardHelper.createStep(translationNamespace + 'dataStepTitle', [
				{
					model: 'wizardData.Data.IsDescDefaultedByRecJob',
					tr: translationNamespace + 'descriptionOption',
					domain: 'radio',
					options: {
						valueMember: 'value',
						labelMember: 'label',
						groupName: gid,
						items: [{
							value: true,
							label: $translate.instant(translationNamespace + 'defaultWithRecJob')
						}, {
							value: false,
							label: $translate.instant(translationNamespace + 'useCustomDescription')
						}]
					}
				},
				{
					model: 'wizardData.Data.Description',
					tr: translationNamespace + 'description',
					domain: 'description'
				},
				{
					model: 'wizardData.Data.RubricCategoryFk',
					tr: 'resource.reservation.rubricCategoryFk',
					domain: 'lookup',
					options: basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm(
						'basics.customize.rubriccategory',
						'Description',
						{
							gid: gid,
							rid: 'rubricCategoryFk',
							required: true,
							sortOrder: 1,
							label$tr$: translationNamespace + 'entityRubric',
							showClearButton: false
						},
						false,
						{
							field: 'RubricFk',
							filterKey: 'dispatch-nodes-rubric-category-by-rubric-filter',
							customIntegerProperty: 'BAS_RUBRIC_FK',
							showClearButton: false
						}
					),
				}]);

			filterStep.id = filterStepUuid;
			filterStep.prepareStep = function (info) {
				validateFilterStep(info);
			};
			dataStep.id = dataStepUuid;
			dataStep.prepareStep = function (info) {
				if (isValidToEnterDataStep(info)){
					info.model.wizardData.Data.PerformingJobFk = _.filter(info.model.wizardData.Reservations.ResultList, reserv => reserv.isSelectedForDispatch)[0].JobPreferredFk; // _.first doesn't work. to be rechecked
				}
				else{
					info.commands.goToPrevious();
					platformModalService.showErrorBox('resource.reservation.createDispatchNotesWizard.ErrorNoReservationSelected');
				}
			};

			var steps = [
				filterStep,
				createGridStep(),
				dataStep
			];

			var reservationStatus = _.find(reserverationFormLayout.rows, {model: 'ReservationStatusFk'});
			reservationStatus.model = 'wizardData.Filter.ReservationStatusFk';
			reservationStatus.readonly = false;
			reservationStatus.options.filterKey = 'filter-status-list-by-reservation-list';
			reservationStatus.options.showClearButton = true;

			var project = _.find(reserverationFormLayout.rows, {model: 'ProjectFk'});
			project.model = 'wizardData.Filter.ProjectFk';
			project.readonly = false;
			project.options.filterKey = 'filter-project-list-by-reservation-list';
			project.options.showClearButton = true;

			var performingJob = _.find(dispatchHeaderLayout.rows, {model: 'Job1Fk'});
			performingJob.model = 'wizardData.Data.PerformingJobFk';
			performingJob.readonly = false;
			performingJob.options.filterKey = 'jobs-by-project-filter';
			performingJob.label$tr$ = translationNamespace + 'performingJobFk';
			performingJob.options.showClearButton = true;

			steps[0].form.rows.push(reservationStatus, project);
			steps[2].form.rows.push(performingJob);
			let validateFilterStep = function validateFilterStep(info) {
				let filterStep = _.find(info.wizard.steps, {id: filterStepUuid});
				let reservations = filterReservations(info.model.wizardData, reservationServiceName);
				info.model.wizardData.Filter.AmountReservations = reservations.length;
				// keep the reference, so the watch on the items works
				info.model.wizardData.Reservations.ResultList.length = 0;
				_.each(reservations, resev => info.model.wizardData.Reservations.ResultList.push(resev));
			};

			let isValidToEnterDataStep = function (info) {
				return _.some(info.model.wizardData.Reservations.ResultList, reserv => reserv.isSelectedForDispatch);
			};

			var wizardConfig = {
				id: 'reservation2dispatchHeaderWizard',
				title: $translate.instant(translationNamespace + 'dialogTitle'),
				steps: steps,
				width: '50%',
				height: '500px',
				watches: [{
					expression: 'wizardData.Filter',
					fn: function (info) {
						validateFilterStep(info);
					},
					deep: true
				}, {
					expression: 'wizardData.Data',
					fn: function (info) {
						let dataStep = _.find(info.wizard.steps, {id: dataStepUuid});
						let data = info.model.wizardData;
						dataStep.canFinish = isDescriptionValid(data) && (data.Data.RubricCategoryFk > 0 && data.Data.PerformingJobFk > 0);
						handleDescription(dataStep, info.model);
					},
					deep: true
				}, {
					expression: 'wizardData.usePlanningBoardReservations',
					fn: function (info) {
						if (_.isBoolean(info.model.wizardData.usePlanningBoardReservations)) {
							info.commands.finish();
							info.model.wizardData.restarted = true;
							setTimeout(function () {
								var usePlanningBoardReservations = info.model.wizardData.usePlanningBoardReservations;
								if (usePlanningBoardReservations === false) {
									startWizard(reservationServiceNameAlternative, reservationServiceName, usePlanningBoardReservations);
								} else {
									startWizard(reservationServiceNameAlternative, reservationServiceName, usePlanningBoardReservations);
								}
							});
						}
					}
				}],
				onChangeStep: function () {
					handleDescription();
					reservationData.wizardData.num = Math.random() * 10;
				}
			};

			platformWizardDialogService.translateWizardConfig(wizardConfig);
			platformWizardDialogService.showDialog(wizardConfig, reservationData).then(function (result) {
				if (result.success && !result.data.wizardData.restarted) {
					// show wizard for filtering
					reservations = filterReservations(reservationData.wizardData, reservationServiceName, true);
					var reservationIdList = reservations.map(function (currentReservation) {
						return currentReservation.Id;
					});
					createDispatchNodesForReservations(reservationIdList, reservationData.wizardData);
				}
			});


			function handleDescription() {
				var readonly;
				var data = reservationData.wizardData;
				if (data.Data.IsDescDefaultedByRecJob === true) {
					data.Data.Description = null;
					readonly = true;
				} else {
					readonly = false;
				}
				platformRuntimeDataService.readonly(reservationData, [
					{
						field: 'wizardData.Data.Description',
						readonly: readonly
					}
				]);
			}
		}

		function isDescriptionValid(data) {
			var valid;
			if (data.Data.IsDescDefaultedByRecJob) {
				valid = true;
			} else {
				valid = !_.isEmpty(data.Data.Description);
			}
			return valid;
		}

		function filterReservations(filterObject, reservationServiceName, isFinalFiltering) {
			var reservations = determineReservationList(reservationServiceName);
			if (filterObject) {
				if (filterObject.Filter.ProjectFk) {
					reservations = _.filter(reservations, {ProjectFk: filterObject.Filter.ProjectFk});
				}

				if (filterObject.Filter.ReservationStatusFk) {
					reservations = _.filter(reservations, {ReservationStatusFk: filterObject.Filter.ReservationStatusFk});
				}

				if (filterObject.Filter.From && moment.isMoment(filterObject.Filter.From)) {
					reservations = _.filter(reservations, function (reservation) {
						return reservation.ReservedFrom >= filterObject.Filter.From;
					});
				}

				if (filterObject.Filter.To && moment.isMoment(filterObject.Filter.To)) {
					reservations = _.filter(reservations, function (reservation) {
						return reservation.ReservedTo <= filterObject.Filter.To;
					});
				}
				if (isFinalFiltering) {
					reservations = _.filter(reservations, function (reservation) {
						return reservation.isSelectedForDispatch === true;
					});
				}
			}

			return reservations;
		}

		function determineReservationList(reservationServiceName) {
			return $injector.get(reservationServiceName).getList();
		}

		function startWizard(reservationServiceName, reservationServiceNameAlternative, usePlanningBoardReservations) {
			var reservations = determineReservationList(reservationServiceName);
			return platformSchemaService.getSchemas([
				{typeName: 'DispatchHeaderDto', moduleSubModule: 'Logistic.Dispatching'}
			]).then(function () {
				createReservationToDispatchNodesWizard(reservations, reservationServiceName, reservationServiceNameAlternative, usePlanningBoardReservations);
			});
		}

		this.createDispatchNodesFromReservation = function createDispatchNodes() {
			startWizard('resourceReservationPlanningBoardReservationService', 'resourceReservationDataService', true);
		};

		this.createDispatchNodesFromEnterprise = function createDispatchNodes() {
			startWizard('resourceEnterprisePlanningBoardReservationService');
		};

		this.createDispatchNodesFromProject = function createDispatchNodes() {
			startWizard('resourceProjectPlanningBoardReservationService');
		};

		this.createDispatchNodesFromActivity = function createDispatchNodes() {
			startWizard('activityReservationService');
		};

		this.createDispatchNodesFromTransport = function createDispatchNodes() {
			startWizard('activityReservationService');
		};

		this.createDispatchNodesFromMounting = function createDispatchNodes() {
			startWizard('mountingReservationService');
		};

		this.createDispatchNodesFromEngineering = function createDispatchNodes() {
			startWizard('productionplanningEngineeringReservationService');
		};

		function createDispatchNodesForReservations(reservationsIdList, wizardData) {

			var payload = {
				ReservationIds: reservationsIdList,
				PerformingJobId: wizardData.Data.PerformingJobFk,
				IsDescDefaultedByRecJob: wizardData.Data.IsDescDefaultedByRecJob,
				Description: wizardData.Data.Description,
				RubricCategoryFk: wizardData.Data.RubricCategoryFk
			};

			return $http.post(globals.webApiBaseUrl + 'logistic/dispatching/header/dispatchnotefromreservations', payload).then(function (resonse) {
				var bodyTextKey;
				var headerTextKey;
				var iconClass;
				if (resonse.data) {
					headerTextKey = 'creationSuccess';
					iconClass = 'ico-info';
					bodyTextKey = resonse.data;
				} else {
					headerTextKey = 'creationError';
					iconClass = 'ico-error'; //error
					bodyTextKey = resonse.data;
				}
				platformModalService.showMsgBox(bodyTextKey, headerTextKey, iconClass);
			});
		}
	}

})(angular);
