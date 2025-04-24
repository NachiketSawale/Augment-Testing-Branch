(function (angular) {
	'use strict';

	/* global globals, _ */
	let moduleName = 'productionplanning.header';

	angular.module(moduleName).factory('ppsHeaderCreatePreliminaryItemWizardDataService', CreatePreliminaryItemWizardDataService);

	CreatePreliminaryItemWizardDataService.$inject = ['$http', '$q', '$injector', 'platformTranslateService',
		'platformModalService', '$translate', 'moment',
		'ppsHeaderPreviewPreliminaryItemDataService',
		'platformGridAPI'];

	function CreatePreliminaryItemWizardDataService($http, $q, $injector, platformTranslateService,
													platformModalService, $translate, moment,
													previewDataService,
													platformGridAPI) {
		let service = {};
		let selectedHeader = {};
		let dataItem = {};
		let scope = {};

		service.getFormConfig = () => {
			const config = {
				title: $translate.instant('productionplanning.header.wizard.createPreliminaryItem.title'),
				dataItem: null,
				formConfiguration: {
					fid: 'productionplanning.header.wizard.createPreliminaryItem',
					version: '1.0.0',
					showGrouping: false,
					addValidationAutomatically: true,
					groups: [{gid: 'baseGroup'}],
					rows: [
						{
							gid: 'baseGroup',
							rid: 'ppsheaderfk',
							model: 'PpsHeaderFk',
							sortOrder: 1,
							label: '*Production Header',
							label$tr$: 'productionplanning.header.entityHeader',
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							readonly: true,
							options: {
								lookupDirective: 'productionplanning-Header-Dialog-Lookup',
								descriptionMember: 'DescriptionInfo.Translated',
							}
						}, {
							gid: 'baseGroup',
							rid: 'jobfk',
							model: 'JobFk',
							sortOrder: 2,
							label: '*Job',
							label$tr$: 'logistic.job.entityJob',
							readonly: true,
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'logistic-job-paging-extension-lookup',
								descriptionMember: 'DescriptionInfo.Translated',
								lookupOptions: {
									showClearButton: true
								}
							}
						}, {
							gid: 'baseGroup',
							rid: 'earliestStart',
							model: 'EarliestStart',
							sortOrder: 3,
							label: '*Earliest Production Date',
							label$tr$: 'productionplanning.header.wizard.createPreliminaryItem.earliestStart',
							type: 'dateutc',
							change: function (entity) {
								let startCopy = angular.copy(entity.EarliestStart);
								service.updateDataItem(entity);
							}
						}, {
							gid: 'baseGroup',
							rid: 'LatestEnd',
							model: 'LatestEnd',
							sortOrder: 4,
							label: '*Latest Production Date',
							label$tr$: 'productionplanning.header.wizard.createPreliminaryItem.latestEnd',
							type: 'dateutc'
						}, {
							gid: 'baseGroup',
							rid: 'duration',
							model: 'Duration',
							sortOrder: 5,
							label: '*Max Product Duration(weeks)',
							label$tr$: 'productionplanning.header.wizard.createPreliminaryItem.maxDuration',
							type: 'integer'
						}, {
							gid: 'baseGroup',
							rid: 'threshold',
							model: 'Threshold',
							sortOrder: 6,
							label: '*Threshold of Site Capacity',
							label$tr$: 'productionplanning.header.wizard.createPreliminaryItem.siteThreshold',
							type: 'integer'
						}, {
							gid: 'baseGroup',
							rid: 'probability',
							model: 'Probability',
							sortOrder: 7,
							label: '*Probability',
							label$tr$: 'productionplanning.header.wizard.createPreliminaryItem.probability',
							type: 'integer'
						}],
					change: (entity, model, row) => {
						scope.filterRequestChanged = true;
					},
				}
			};
			platformTranslateService.translateFormConfig(config.formConfiguration);
			return config;
		};

		service.init = ($scope, ppsHeader) => {
			scope = $scope;
			scope.filterRequestChanged = true;
			selectedHeader = ppsHeader;
			dataItem.JobFk = selectedHeader.LgmJobFk;
			dataItem.PpsHeaderFk = selectedHeader.Id;
			dataItem.EarliestStart = $scope.workflowSet !== null ? $scope.workflowSet.EarliestStart : moment();
			dataItem.LatestEnd = $scope.workflowSet !== null ? $scope.workflowSet.LatestEnd : moment().add(6, 'months');
			dataItem.Duration = $scope.workflowSet !== null ? $scope.workflowSet.Duration : 4;
			dataItem.Threshold = $scope.workflowSet !== null ? $scope.workflowSet.Threshold :
			  (ppsHeader.Threshold !== null ? ppsHeader.Threshold : 120);
			dataItem.Probability =  $scope.workflowSet !== null ? $scope.workflowSet.Probability :
			  (ppsHeader.Probability !== null ? ppsHeader.Probability : 50);

			service.updateDataItem(dataItem);
			previewDataService.initGrid(scope, []);
		};

		service.calculationPreliminaryItems = () => {
			service.setBusy(true);
			let request = {
				HeaderId: selectedHeader.Id,
				Threshold: dataItem.Threshold,
				EarliestStart: dataItem.EarliestStart,
				LatestEnd: dataItem.LatestEnd,
				Duration: dataItem.Duration
			};

			if (previewDataService.getPreliminaryItems().length > 0 && (service.hasSiteChanged() || service.hasFilterChanged())) {
				if (service.hasFilterChanged()) {
					request.changedItems = _.filter(previewDataService.getPreliminaryItems(), (item) => {
						return item.SiteFk !== 0;
					});
				} else if (service.hasSiteChanged()) {
					request.changedItems = _.filter(previewDataService.getPreliminaryItems(), (item) => {
						return item.SiteFk !== 0 && item.SiteFk !== item.InitSiteFk;
					});
				}
				$http.post(globals.webApiBaseUrl + 'productionplanning/item/wizard/recalculation', request).then(function (response) {
					if (response.data.Items !== null) {
						previewDataService.initData(scope, response.data);
						previewDataService.updatePreliminaryItems(response.data.Items);
					}
				}).finally(() => {
					service.setBusy(false);
					service.resetFilterState();
					previewDataService.gridRefresh(scope);
				});
			} else {
				$http.post(globals.webApiBaseUrl + 'productionplanning/item/wizard/getpreliminaryitems', request).then(function (response) {
					if (response.data.Message !== null && response.data.Message.length !== 0) {
						platformModalService.showErrorBox(response.data.Message,
						  'productionplanning.header.wizard.createPreliminaryItem.title', 'warning');
					} else if (response.data.Items !== null) {
						previewDataService.initData(scope, response.data);
						previewDataService.setPreliminaryItems(response.data.Items);
						previewDataService.setSitesInfo(response.data.SitesInfo);
						previewDataService.setItems(scope, response.data.Items);
					}
				}).finally(() => {
					service.setEarliestStart();
					service.setBusy(false);
					service.resetFilterState();
					previewDataService.gridRefresh(scope);
				});
			}
		};

		service.updateDataItem = (data) => {
			scope.dataItem = data;
		};

		service.setBusy = (isBusy) => {
			scope.isBusy = isBusy;
		};

		service.handleOK = () => {
			platformGridAPI.grids.commitEdit(scope.preliminaryItemGrid.id); // commit changes
			let request = {
				PreliminaryItems: _.filter(previewDataService.getPreliminaryItems(), {'IsLive': true}),
				Threshold: dataItem.Threshold,
				Probability: dataItem.Probability
			};
			return $http.post(globals.webApiBaseUrl + 'productionplanning/item/wizard/savepreliminaryitems', request).then(function (response) {
				return response.data;
			});
		};

		service.hasSiteChanged = () => {
			return previewDataService.getSiteChangedState(scope);
		};

		service.hasFilterChanged = () => {
			return scope.filterRequestChanged;
		};

		service.hasNewPreliminaryItem = () => {
			return _.some(previewDataService.getPreliminaryItems(), {IsLive: true});
		};

		service.resetFilterState = () => {
			scope.filterRequestChanged = false;
		};

		service.setEarliestStart = () => {
			let items = previewDataService.getPreliminaryItems();
			let existedItems = _.filter(items, (item) => {
				return item.Version > 0 && item.ProductionStart !== null;
			});
			if (existedItems) {
				const startDate = angular.copy(moment.min(_.map(existedItems, 'ProductionStart').concat([dataItem.EarliestStart])));
				dataItem.EarliestStart = angular.copy(startDate);
				service.updateDataItem(dataItem);
			}
		};

		service.clearContext = () => {
			scope.dataItem = {};
			previewDataService.clearContext(scope);
		};

		return service;
	}

})(angular);