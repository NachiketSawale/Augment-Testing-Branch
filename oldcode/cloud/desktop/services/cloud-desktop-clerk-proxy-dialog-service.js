(function (angular) {
	/* global angular */
	'use strict';

	var modulemodel = 'cloud.desktop';

	/**
	 * @ngdoc service
	 * @model cloudDesktopClerkProxyService
	 */
	angular.module(modulemodel).service('cloudDesktopClerkProxyService', CloudDesktopClerkProxy);

	function CloudDesktopClerkProxy($http, platformWizardDialogService, _, basicsLookupdataConfigGenerator, $translate, $rootScope, basicsClerkUtilitiesService, moment, basicsClerkAbsenceService, basicsClerkMainService, platformModalService, platformSchemaService, $injector, $q, basicsClerkAbsenceProxyService, platformRuntimeDataService, $timeout) {

		var self = this;

		self.createClerkProxy = function createClerkProxy() {
			$q.all([platformSchemaService.getSchemas([
				{
					typeName: 'ClerkAbsenceDto', moduleSubModule: 'Basics.Clerk'
				},
				{
					typeName: 'ClerkAbsenceProxyDto', moduleSubModule: 'Basics.Clerk'
				}])])
				.then(function () {
					var absenceData;
					basicsClerkUtilitiesService.getClientByUser().then(function (clerk) {
						if (!clerk) {
							platformModalService.showMsgBox('cloud.desktop.clerkProxy.noClerkFound', 'cloud.desktop.clerkProxy.dialogTitle', 'ico-error');
							return;
						}
						basicsClerkUtilitiesService.getClerkById(clerk.ClerkProxyFk).then(function (clerkProxy) {

							basicsClerkMainService.setSelected(clerk).then(function () {
								basicsClerkAbsenceService.loadSubItemList().then(function (absenceListForCurrentUser) {
									absenceListForCurrentUser = _.sortBy(absenceListForCurrentUser, ['AbsenceFrom']);
									var clerkAbsenceColumns = $injector.get('basicsClerkAbsenceUIStandardService').getStandardConfigForListView().columns;
									var configClerkAbsenceColumns = _.without(clerkAbsenceColumns, _.find(clerkAbsenceColumns, {
										id: 'clerkfk'
									}));
									absenceData = {
										absenceList: {
											items: setItemsReadonly(_.cloneDeep(absenceListForCurrentUser), ['AbsenceFrom', 'AbsenceTo', 'Description']),
											selectionListConfig: {
												multiSelect: false, idProperty: 'Id',
												columns: configClerkAbsenceColumns
											}
										},
										proxyList: {
											items: [],
											selectionListConfig: {
												multiSelect: false, idProperty: 'Id',
												columns: $injector.get('basicsClerkAbsenceProxyLayoutService').getStandardConfigForListView().columns
											}
										}
									};

									registerValidationAndUiServices();

									var absenceStep = platformWizardDialogService.createListStep({
										title: $translate.instant('cloud.desktop.clerkProxy.absenceListStepTitle'),
										stepId: 'cloud.desktop.clerkProxy.absenceListStepTitle',
										model: 'absenceList',
										topButtons: [
											{
												text: $translate.instant('cloud.desktop.clerkProxy.createAbsence'),
												fn: function buttonFn(step) {
													if (basicsClerkAbsenceService.canCreate()) {
														basicsClerkAbsenceService.createItem().then(function (absenceItem) {
															// watch needs an new ref to trigger
															absenceData.absenceList.items = absenceData.absenceList.items.concat([absenceItem]);
															absenceData.absenceList.selectedId = absenceItem.Id;
														});
														initAbsenceTopDescription(absenceStep, clerkProxy);
													} else {
														step.topDescription = $translate.instant('cloud.desktop.clerkProxy.errorCreateAbsence');
													}
												}
											},
											{
												text: $translate.instant('cloud.desktop.clerkProxy.deleteAbsence'),
												fn: function buttonFn(step) {
													if (basicsClerkAbsenceService.canDelete()) {
														var selectedAbsence = basicsClerkAbsenceService.getSelected();
														basicsClerkAbsenceService.deleteItem(selectedAbsence).then(function () {
															// watch needs an new ref to trigger
															_.remove(absenceData.absenceList.items, function (item) {
																return item.Id === selectedAbsence.Id;
															});
															absenceData.absenceList.items = _.cloneDeep(absenceData.absenceList.items);
														});
														initAbsenceTopDescription(absenceStep, clerkProxy);
													} else {
														step.topDescription = $translate.instant('cloud.desktop.clerkProxy.errorDeleteAbsence');
													}
												}
											}
										]
									});

									absenceStep.cssClass = '';
									absenceStep.prepareStep = function prepareStep() {
										$timeout(function () {
											basicsClerkAbsenceService.read().then(function (absenceItems) {
												let configAbsenceItems = [];
												let now = moment().utc().startOf('day');
												_.forEach(absenceItems, function (absenceItem) {
													if (now.isBefore(absenceItem.AbsenceTo)) {
														configAbsenceItems.push(absenceItem);
													}
												});
												absenceData.absenceList.items = _.cloneDeep(configAbsenceItems);
											});
										}, 1000);
									};

									var proxyStep = platformWizardDialogService.createListStep({
										title: $translate.instant('cloud.desktop.clerkProxy.proxyListStepTitle'),
										stepId: 'cloud.desktop.clerkProxy.proxyListStepTitle',
										model: 'proxyList',
										topButtons: [
											{
												text: $translate.instant('cloud.desktop.clerkProxy.createProxy'),
												fn: function buttonFn(/* step , scope */) {
													if (basicsClerkAbsenceProxyService.canCreate()) {
														basicsClerkAbsenceProxyService.createItem().then(function (absenceProxyItem) {
															absenceData.proxyList.selectedId = absenceProxyItem.Id;
															if (_.isNil(absenceData.proxyList.items)) {
																absenceData.proxyList.items = [];
															}
															absenceData.proxyList.items = absenceData.proxyList.items.concat([absenceProxyItem]);
														});
													}
												}
											},
											{
												text: $translate.instant('cloud.desktop.clerkProxy.deleteProxy'),
												fn: function buttonFn(step) {
													if (basicsClerkAbsenceProxyService.canDelete()) {
														var selectedAbsenceProxy = basicsClerkAbsenceProxyService.getSelected();
														basicsClerkAbsenceProxyService.deleteItem(selectedAbsenceProxy).then(function () {
															_.remove(absenceData.proxyList.items, function (item) {
																return item.Id === selectedAbsenceProxy.Id;
															});
															absenceData.proxyList.items = _.cloneDeep(absenceData.proxyList.items);
															initProxyTopDescription(proxyStep, absenceData);
														});
													} else {
														step.topDescription = $translate.instant('cloud.desktop.clerkProxy.errorDeleteProxy');
													}
												}
											}
										]
									});

									proxyStep.canFinish = true;
									proxyStep.cssClass = '';
									proxyStep.prepareStep = function () {
										var absence = _.find(basicsClerkAbsenceService.getList(), {Id: absenceData.absenceList.selectedId});
										return basicsClerkAbsenceService.setSelected(absence).then(function () {
											proxyStep.loadingMessage = $translate.instant('cloud.desktop.clerkProxy.loadingData');

											var loadFuntion = absence.Version > 0 ? basicsClerkAbsenceProxyService.load : basicsClerkAbsenceProxyService.loadListForOwnClerk;

											return loadFuntion().then(function (proxyList) {
												absenceData.proxyList.items = setItemsReadonly(_.cloneDeep(proxyList), ['ProjectFk', 'CompanyFk', 'ClerkRoleFk', 'CommentText', 'ClerkFk']);
												markItemsAsModified(absenceData.proxyList.items);
												proxyStep.loadingMessage = null;
												initProxyTopDescription(proxyStep, absenceData);
											});
										});
									};

									initAbsenceTopDescription(absenceStep, clerkProxy);

									function markItemsAsModified(absenceProxyList) {
										var areNewItems = true;
										if (_.isArray(absenceProxyList) && !_.isEmpty(absenceProxyList)) {
											_.each(absenceProxyList, function (proxy) {
												if (proxy.Version !== 0) {
													areNewItems = false;
													return areNewItems;
												}
											});
										}
										if (areNewItems) {
											basicsClerkAbsenceProxyService.setList(absenceProxyList);
										}
									}

									var steps = [
										absenceStep,
										proxyStep
									];

									var wizardConfig = {
										id: 'clerk-proxy',
										title: $translate.instant('cloud.desktop.clerkProxy.dialogTitle'),
										steps: steps,
										width: '50%',
										height: '75%',
										watches: [{
											expression: 'absenceList',
											fn: function (info) {
												var step = _.find(info.wizard.steps, {id: 'cloud.desktop.clerkProxy.absenceListStepTitle'});
												basicsClerkAbsenceService.setSelected(_.find(info.model.absenceList.items, {Id: info.model.absenceList.selectedId}));
												step.disallowNext = !info.model.absenceList.selectedId || !validateAbsences(info.model.absenceList.items);
												step.canFinish = validateAbsences(info.model.absenceList.items);
											},
											deep: true
										}, {
											expression: 'proxyList',
											fn: function (info) {
												var step = _.find(info.wizard.steps, {id: 'cloud.desktop.clerkProxy.proxyListStepTitle'});
												basicsClerkAbsenceProxyService.setSelected(_.find(info.model.proxyList.items, {Id: info.model.proxyList.selectedId}));
												step.canFinish = validateClerkProxies(info.model.proxyList.items);
												step.disallowBack = isNewDataCreated(info.model.proxyList.items);
											},
											deep: true
										}]
									};

									platformWizardDialogService.translateWizardConfig(wizardConfig);
									platformWizardDialogService.showDialog(wizardConfig, absenceData).then(function (result) {
										if (result.success) {
											basicsClerkMainService.updateOwnClerk().then(function () {
												basicsClerkMainService.clear();
											});
										} else {
											// cancel pressed
											basicsClerkMainService.clear();
										}
									});
								});
							});
						});
					});
				});
		};

		function validateClerkProxies(proxyList) {
			var valid = true;
			var proxyValidationService = $injector.get('basicsClerkAbsenceProxyValidationService');
			_.each(proxyList, function (proxy) {

				var result = proxyValidationService.validateClerkFk(proxy, proxy.ClerkFk, 'ClerkFk');
				platformRuntimeDataService.applyValidationResult(result, proxy, 'ClerkFk');
				if (!proxy.ClerkFk) {
					valid = false;
					return valid;
				}
			});
			return valid;
		}

		function validateAbsences(absenceList) {
			var valid = true;
			var platformDataValidationService = $injector.get('platformDataValidationService');
			_.each(absenceList, function (absence) {

				var result = platformDataValidationService.validatePeriodSimple(absence.AbsenceFrom, absence.AbsenceTo);
				if (!result.valid) {
					valid = false;
					return valid;
				}
			});
			return valid;
		}

		function isNewDataCreated(proxyList) {
			var isNewDataCreated = false;
			_.each(proxyList, function (proxy) {
				if (proxy.Version === 0) {
					isNewDataCreated = true;
					return isNewDataCreated;
				}
			});
			return isNewDataCreated;
		}

		function setItemsReadonly(itemList, fieldList) {
			_.each(itemList, function (item) {
				// only for existing Items
				if (item.Version !== 0) {
					_.each(fieldList, function (field) {
						platformRuntimeDataService.readonly(item, [
							{
								field: field,
								readonly: true
							}
						]);
					});
				}
			});
			// return for convenience
			return itemList;
		}

		function initAbsenceTopDescription(absenceStep, clerkProxy) {
			absenceStep.topDescription = $translate.instant('cloud.desktop.clerkProxy.currentProxy') + ' ' + (clerkProxy ? (clerkProxy.Code + ' ' + clerkProxy.Description) : $translate.instant('cloud.desktop.clerkProxy.noProxy'));
		}

		function initProxyTopDescription(proxyStep, absenceData) {
			var selectedAbsence = _.find(absenceData.absenceList.items, {Id: absenceData.absenceList.selectedId});
			proxyStep.topDescription = $translate.instant('cloud.desktop.clerkProxy.proxyForTimeSpan', {
				from: selectedAbsence.AbsenceFrom.format('L'),
				to: selectedAbsence.AbsenceTo.format('L'),
				description: selectedAbsence.Description
			});
		}

		function registerValidationAndUiServices() {
			$injector.get('platformLayoutByDataService').registerLayout($injector.get('basicsClerkAbsenceUIStandardService'), basicsClerkAbsenceService);
			$injector.get('platformLayoutByDataService').registerLayout($injector.get('basicsClerkAbsenceProxyLayoutService'), basicsClerkAbsenceProxyService);
			$injector.get('platformValidationByDataService').registerValidationService($injector.get('basicsClerkAbsenceValidationService'), basicsClerkAbsenceService);
			$injector.get('platformValidationByDataService').registerValidationService($injector.get('basicsClerkAbsenceProxyValidationService'), basicsClerkAbsenceProxyService);
		}
	}

	CloudDesktopClerkProxy.$inject = ['$http', 'platformWizardDialogService', '_', 'basicsLookupdataConfigGenerator', '$translate', '$rootScope', 'basicsClerkUtilitiesService', 'moment', 'basicsClerkAbsenceService', 'basicsClerkMainService', 'platformModalService', 'platformSchemaService', '$injector', '$q', 'basicsClerkAbsenceProxyService', 'platformRuntimeDataService', '$timeout'];

})(angular);
