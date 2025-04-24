(function (angular) {
	'use strict';
	/* global _, globals */
	let moduleName = 'logistic.dispatching';
	angular.module(moduleName).service('logisticDispatchingCreateBackOrdersWizardService', LogisticDispatchingCreateBackOrdersWizardService);

	LogisticDispatchingCreateBackOrdersWizardService.$inject = [
		'$http', '$q', '$injector', 'platformModalService', 'platformWizardDialogService', 'platformUIConfigInitService',
		'logisticDispatchingContainerInformationService', 'logisticDispatchingConstantValues', 'logisticDispatchingTranslationService',
		'platformSchemaService', 'logisticDispatchingHeaderDataService', '$translate', 'platformLayoutHelperService', 'platformModuleNavigationService'
	];

	function LogisticDispatchingCreateBackOrdersWizardService(
		$http, $q, $injector, platformModalService, platformWizardDialogService,platformUIConfigInitService,
		logisticDispatchingContainerInformationService, logisticDispatchingConstantValues, logisticDispatchingTranslationService,
		platformSchemaService, logisticDispatchingHeaderDataService, $translate, platformLayoutHelperService, platformModuleNavigationService

	) {
		let self = this;

		let format = function format (format,replaces) {
			let result = format;
			let i = replaces.length;
			while (i--) {
				result = result.replace(new RegExp('\\{' + i + '\\}', 'gm'), replaces[i]);
			}
			return result;
		};

		this.createBackOrders = function createBackOrders() {
			let showModalDialog = function showModalDialog(title, message) {
				let modalOptions = {
					headerText: $translate.instant(title),
					bodyText: $translate.instant(message),
					iconClass: 'ico-info'
				};
				return platformModalService.showDialog(modalOptions);
			};
			let showDialogNoDispatchHeaderSelected = function showDialogNoDispatchHeaderSelected(){
				return showModalDialog(
					'logistic.dispatching.createBackOrdersWizard.title',
					'logistic.dispatching.createBackOrdersWizard.noDispatchHeaderSelected');
			};
			let showDialogNoRquisitionsLinked2DispatchHeader = function showDialogNoRquisitionsLinked2DispatchHeader(){
				return showModalDialog(
					'logistic.dispatching.createBackOrdersWizard.title',
					'logistic.dispatching.createBackOrdersWizard.noRequisitionLinked');
			};
			let createBackOrdersData = {
				selection:{

				},
				wizardData:{
					selection: [],
					resultList: []
				}
			};
			function createGridStep() {
				let title = $translate.instant('logistic.dispatching.createBackOrdersWizard.firstStepTitle');
				let topDescription = $translate.instant('logistic.dispatching.createBackOrdersWizard.firstStepTitle');
				createBackOrdersData.wizardData.listModel = {
					items: createBackOrdersData.wizardData.selection,
					selectedId: null,
					id: 'selection',
					selectionListConfig: {
						selectedIdProperty: 'selectedId',
						idProperty: 'UiId',
						columns: platformUIConfigInitService.provideConfigForListView(
							logisticDispatchingContainerInformationService.getLogisticDispatchingCreateBackOrderWizardsListLayout(),
							platformSchemaService.getSchemaFromCache(logisticDispatchingConstantValues.schemes.header2Requisition).properties,
							logisticDispatchingTranslationService).columns,
						parentProp: 'ParentUiId',
						childProp: 'RequisitionItems',
						options: {
						},
						multiSelect: true
					}
				};
				let gridStep = platformWizardDialogService.createListStep(title, topDescription, 'wizardData.listModel', 'selection');
				gridStep.watches = [];
				gridStep.cssClass = '';
				gridStep.disallowNext = false;
				return gridStep;
			}

			function createResultGridStep() {
				let title = $translate.instant('logistic.dispatching.createBackOrdersWizard.ResultTitle');
				let topDescription = $translate.instant('logistic.dispatching.createBackOrdersWizard.FollowingRequisitionTitle');
				createBackOrdersData.wizardData.resultListModel = {
					items: createBackOrdersData.wizardData.resultList,
					selectedId: null,
					id: 'result',
					selectionListConfig: {
						idProperty: 'Id',
						columns: _.cloneDeep($injector.get('logisticDispatchingCreateBackOrdersResultLayoutService').getStandardConfigForListView().columns),
						options: {
						}
					}
				};
				createBackOrdersData.wizardData.resultListModel.selectionListConfig.columns.push({
					id: 'action',
					field: 'Action',
					name: '',
					formatter: 'action',
					forceActionButtonRender: true,
					actionList: [{
						toolTip: function (entity) {
							return  format($translate.instant('logistic.dispatching.createBackOrdersWizard.HoverGotoBtn'),[entity.Description]);
						},
						icon: 'tlb-icons ico-goto',
						callbackFn: function (entity) {
							let navigator = platformModuleNavigationService.getNavigator('resource.requisition');
							platformModuleNavigationService.navigate(navigator, entity, 'ResRequisitionFk');
							entity.Info.commands.goToNext();
						},

					}],
					width: 100
				});
				let gridStep = platformWizardDialogService.createListStep(title, topDescription, 'wizardData.resultListModel', 'result');
				gridStep.watches = [];
				gridStep.disallowNext = true;
				gridStep.disallowBack = true;
				gridStep.disallowCancel = true;
				gridStep.canFinish = true;
				gridStep.cssClass = 'dispatch-create-backorder-wizard';
				return gridStep;
			}
			function proccesingStep (){
				let stepId = 'proccessing';
				return {
					id: stepId,
					title: 'Proccessing...',
					title$tr$: 'logistic.dispatching.createBackOrdersWizard.proccessingStepTitle',
					disallowNext: true,
					prepareStep: function prepareSelectionHandle(info) {
						_.forEach(info.model.wizardData.selection, function (header2req) {
							header2req.CreateBackOrder = header2req.rt$isIncluded;
							_.forEach(header2req.RequisitionItems, function (requisitionItem) {
								requisitionItem.CreateBackOrder = requisitionItem.rt$isIncluded;
							});
						});
						return $http.post(globals.webApiBaseUrl + 'logistic/dispatching/dispatchheader2requisition/createbackorders', info.model.wizardData.selection).then(function (result) {
							let resultStep = _.find(info.wizard.steps,step => step.id === 'result');

							let requisitionIds = result.data;
							requisitionIds.
								map(req => ({Id: req.Id, ResRequisitionFk: req.Id, Description:req.Description, Info: info})).
								forEach(item => info.model.wizardData.resultList.push(item));

							let processingStep = _.find(info.wizard.steps,step => step.id === stepId);
							processingStep.disallowNext = false;
							info.commands.goToNext();
						});
					}
				};
			}

			let wzConfig = {
				title: 'Create Back Orders for a Dispatch Note',
				title$tr$: 'logistic.dispatching.createBackOrdersWizard.title',
				width: '65%',
				height: '80%',
				// width: '80%',
				// height: '500px',
				steps: [
					createGridStep(),
					proccesingStep(),
					createResultGridStep()
				]
			};
			let selectedDispatchHeader = logisticDispatchingHeaderDataService.getSelected();
			if(!_.isNil(selectedDispatchHeader)){
				let promises = [
					$http.post(globals.webApiBaseUrl + 'logistic/dispatching/record/listbyparent', {
						Pkey1: selectedDispatchHeader.Id,
						PKey2: selectedDispatchHeader.CompanyFk
					}),
					$http.post(globals.webApiBaseUrl + 'logistic/dispatching/dispatchheader2requisition/listbyparentwithtransient', {Pkey1: selectedDispatchHeader.Id})
				];
				$q.all(promises).then(function (response) {
					let records = response[0].data;
					let requisitions = response[1].data;
					let uiId = 0;
					_.forEach(requisitions,function (requisition) {
						requisition.QuantityDelivered = _.sumBy(_.filter(records,r => r.MaterialFk === requisition.MaterialFk),r => r.DeliveredQuantity);
						requisition.Difference = requisition.Quantity - requisition.QuantityDelivered;
						requisition.UiId = ++uiId;
						_.forEach(requisition.RequisitionItems,function (RequisitionItem) {
							RequisitionItem.QuantityDelivered = _.sumBy(_.filter(records,r => r.MaterialFk === RequisitionItem.MaterialFk),r => r.DeliveredQuantity);
							RequisitionItem.Difference = RequisitionItem.Quantity - RequisitionItem.QuantityDelivered;
							RequisitionItem.UiId = ++uiId;
							RequisitionItem.ParentUiId = requisition.UiId;
						});
						createBackOrdersData.wizardData.selection.push(requisition);
						platformWizardDialogService.showDialog(wzConfig, createBackOrdersData);
					});
					if(!_.some(requisitions)){
						showDialogNoRquisitionsLinked2DispatchHeader();
					}
				});
			}
			else{
				showDialogNoDispatchHeaderSelected();
			}


		};
	}
})(angular);
