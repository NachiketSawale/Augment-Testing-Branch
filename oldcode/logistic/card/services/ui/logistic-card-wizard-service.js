(function (angular) {
	/* global globals */
	'use strict';

	angular.module('logistic.card').service('logisticCardSidebarWizardService', LogisticCardSidebarWizardService);

	LogisticCardSidebarWizardService.$inject = ['_', '$http', '$translate', '$q', 'platformModalService', 'platformTranslateService',
		'platformModalFormConfigService', 'basicsLookupdataSimpleLookupService', 'basicsCommonChangeStatusService',
		'basicsLookupdataConfigGenerator', 'logisticCardDataService'];

	function LogisticCardSidebarWizardService(_, $http, $translate, $q, platformModalService, platformTranslateService,
		platformModalFormConfigService, basicsLookupdataSimpleLookupService, basicsCommonChangeStatusService,
		basicsLookupdataConfigGenerator, logisticCardDataService) {
		let self = this;
		this.post = function (address, arg) {
			return $http.post(globals.webApiBaseUrl + address, arg).then(function (response) {
				return response.data;
			});
		};
		this.reserveMaterialAndStock = function reserveMaterialAndStock() {
			var okDisable = false;
			var validationCheck = function () {
				return okDisable === false;
			};


			var title = 'logistic.card.titelreservematerialandstock';
			if(logisticCardDataService.getSelected() !== null) {
				let selectedJobCard = logisticCardDataService.getSelected();
				if (selectedJobCard.JobPerformingFk !== null) {
					$http.get(globals.webApiBaseUrl + 'logistic/job/getbyid?jobId=' + selectedJobCard.JobPerformingFk).then(function (response) {
						if (response && response.data) {
							let performingJob = response.data;
							self.post('project/stock/instances', { PKey1: performingJob.ProjectFk }).then(function (projectStocks) {
								let projectStock = _.some(projectStocks) ? _.first(projectStocks) : null;
								let modalCreateConfig = {
									title: title,
									dataItem: {
										ProjectFk: performingJob.ProjectFk,
										PrjStockFk: !_.isNull(projectStock) ? projectStock.Id : null,
										PrjStockLocationFk: null
									},
									formConfiguration: {
										fid: 'logistic.card.reservematerialandstock',
										version: '0.2.4',
										showGrouping: false,
										groups: [
											{
												gid: 'baseGroup',
												attributes: ['PrjStockFk']
											}
										],
										rows: [
											basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
												dataServiceName: 'projectStockLookupDataService',
												enableCache: true,
												filter: function (item) {
													var prj = { PKey1: null };
													if (item) {
														prj.PKey1 = item.ProjectFk;
														okDisable = true;
													}
													return prj;
												}
											}, {
												gid: 'baseGroup',
												rid: 'prjStock',
												label: 'Project Stock',
												label$tr$: 'logistic.card.entityProjectStock',
												type: 'lookup',
												model: 'PrjStockFk',
												sortOrder: 1,
												validator: function (item, value, model) {
													if (item[model] !== value) {
														item.PrjStockLocationFk = null;
													}
												}
											}),
											basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
												dataServiceName: 'projectStockLocationLookupDataService',
												enableCache: true,
												filter: function (item) {
													var prj = { PKey1: null };
													if (item) {
														prj.PKey1 = item.PrjStockFk;
														okDisable = true;
													}
													return prj;
												}
											}, {
												gid: 'baseGroup',
												rid: 'prjStockLocation',
												label: 'Stock',
												label$tr$: 'logistic.card.entityStock',
												type: 'lookup',
												model: 'PrjStockLocationFk',
												sortOrder: 1
											})
										]
									},
									handleOK: function handleOK(result) {
										var data = {
											ProjectStockId: result.data.PrjStockFk,
											Cards: [logisticCardDataService.getSelected()]
										};
										$http.post(globals.webApiBaseUrl + 'logistic/card/card/reservematerial', data).then(function (response) {
											if (response && response.data && response.data.Message) {
												return platformModalService.showDialog(
													{
														headerTextKey: 'Reserve material in stock',
														iconClass: 'ico-info',
														bodyTextKey: response.data.Message,
														showCancelButton: false
													});
											}
										});
									},
									dialogOptions: {
										disableOkButton: validationCheck
									}
								};
								platformTranslateService.translateFormConfig(modalCreateConfig.formConfiguration);
								platformModalFormConfigService.showDialog(modalCreateConfig);
							});
						}
					});
				}
				else {
					// Error MessageText
					var modalOptions = {
						headerText: $translate.instant(title),
						bodyText: $translate.instant('logistic.card.performingJobinfmissing'),
						iconClass: 'ico-info'
					};
					platformModalService.showDialog(modalOptions);

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

		function changeCardStatus() {
			return basicsCommonChangeStatusService.provideStatusChangeInstance({
				refreshMainService: false,
				mainService: logisticCardDataService,
				statusField: 'JobCardStatusFk',
				codeField: 'Code',
				descField: 'Description',
				projectField: '',
				statusDisplayField: 'Description',
				title: 'logistic.card.changeStatus',
				statusName: 'logisticcardstatus',
				statusProvider: function () {
					var currentCard = logisticCardDataService.getSelected();
					return basicsLookupdataSimpleLookupService.getList({
						valueMember: 'Id',
						displayMember: 'Description',
						lookupModuleQualifier: 'basics.customize.jobcardstatus',
						filter: {
							customIntegerProperty: 'BAS_RUBRIC_CATEGORY_FK',
							customBoolProperty: 'ISREADYFORDISPATCHING'
						}
					}).then(function (respond) {
						return _.filter(respond, function (item) {
							return item.BasRubricCategoryFk === currentCard.RubricCategoryFk && item.isLive === true;
						});
					});
				},
				updateUrl: 'logistic/card/card/changestatus',
				id: 1
			});
		}

		this.changeCardStatus = changeCardStatus().fn;
	}
})(angular);


