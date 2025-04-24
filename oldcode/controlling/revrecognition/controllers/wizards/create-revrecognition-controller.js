(function (angular) {
	'use strict';

	var moduleName = 'controlling.revrecognition';

	angular.module(moduleName).controller('controllingRevenuerecognitionCreateRevrecognitionController',
		['globals', '$scope', '$http', '$injector', '$translate', 'platformRuntimeDataService', 'basicsLookupdataLookupFilterService', '_', 'platformDialogService', 'cloudDesktopSidebarService', 'platformModalService', 'platformModuleNavigationService',
			function (globals, $scope, $http, $injector, $translate, platformRuntimeDataService, basicsLookupdataLookupFilterService, _, dialogService, cloudDesktopSidebarService, platformModalService, navigationService) {

				$scope.options = $scope.$parent.modalOptions;

				$scope.currentItem = {
					CompanyFk: null,
					CompanyYearFk: -1,
					CompanyPeriodFk: -1,
					ProjectFk: null
				};
				$scope.additionOption = {
					createByCurrentResultSet: false,
					createBySelectResultSet: false
				};
				$scope.createFromWiard = $scope.options.createFromWiard || false;

				$scope.options.headerText = $translate.instant('controlling.revrecognition.createRevenueRecognition.title');

				var formConfig = {
					'fid': 'controlling.revrecognition.create.revrecognition',
					'version': '1.0.0',
					'showGrouping': false,
					'groups': [
						{
							'gid': 'basicData',
							'header$tr$': 'controlling.revrecognition.wizard.createRevenueRecognition.title',
							'isOpen': true,
							'visible': true,
							'sortOrder': 1
						}
					],
					'rows': [{
						'rid': 'companyfk',
						'gid': 'basicData',
						'label$tr$': 'controlling.revrecognition.createRevenueRecognition.company',
						'label': 'Company',
						'type': 'directive',
						'model': 'CompanyFk',
						'directive': 'basics-company-company-lookup',
						'readonly': true,
						'options': {
							'lookupType': 'company',
							'displayMember': 'Code'
						}
					}, {
						'rid': 'companyyearfk',
						'gid': 'basicData',
						'label$tr$': 'controlling.revrecognition.createRevenueRecognition.businessYear',
						'label': 'Business Year',
						'type': 'directive',
						'model': 'CompanyYearFk',
						'directive': 'controlling-revenue-recognition-company-year-combobox',
						'options': {
							'lookupType': 'companyyear',
							'displayMember': 'TradingYear',
							'filterKey': 'company-year-filter'
						}
					}, {
						'rid': 'companyperiodfk',
						'gid': 'basicData',
						'label$tr$': 'controlling.revrecognition.createRevenueRecognition.businessPeriod',
						'label': 'Business Period',
						'type': 'directive',
						'model': 'CompanyPeriodFk',
						'directive': 'controlling-revenue-recognition-company-period-combobox',
						'options': {
							'lookupType': 'companyperiod',
							'displayMember': 'TradingPeriod',
							'filterKey': 'company-period-filter'
						}
					}, {
						'rid': 'prjprojectfk',
						'gid': 'basicData',
						'label$tr$': 'cloud.common.entityProjectNo',
						'label': 'Project No.',
						'type': 'directive',
						'model': 'ProjectFk',
						'directive': 'basics-lookupdata-lookup-composite',
						'options': {
							'lookupDirective': 'basics-lookup-data-project-project-dialog',
							'descriptionMember': 'ProjectName',
							'lookupOptions': {
								'filterKey': 'revecognition-project-filter',
								'initValueField': 'ProjectNo',
								'readOnly': false,
								'disableInput': false,
								'showClearButton': true
							}
						}
					}
					]
				};

				var filters = [
					{
						key: 'revecognition-project-filter',
						serverSide: true,
						serverKey: 'project-with-status-filter',
						fn: function (/* entity */) {
							return {};
						}
					}
				];
				basicsLookupdataLookupFilterService.registerFilter(filters);

				$scope.formContainerOptions = {};
				$scope.formContainerOptions.formOptions = {
					configure: formConfig,
					showButtons: [],
					validationMethod: function () {
					}
				};

				function initData() {
					$http.get(globals.webApiBaseUrl + 'controlling/RevenueRecognition/getdefaultvalues').then(function (response) {
						var resItem = response.data;
						$scope.currentItem.CompanyFk = resItem.CompanyFk;
						$scope.currentItem.CompanyYearFk = resItem.CompanyYearFk;
						$scope.currentItem.CompanyPeriodFk = resItem.CompanyPeriodFk;
					});
				}

				initData();

				$scope.resultCheckboxChange = function () {
					if ($scope.additionOption.createByCurrentResultSet) {
						$scope.additionOption.createBySelectResultSet = false;
					}
				};

				$scope.selectCheckboxChange = function () {
					if ($scope.additionOption.createBySelectResultSet) {
						$scope.additionOption.createByCurrentResultSet = false;
					}
				};

				$scope.options.onOK = function () {
					var period = $scope.currentItem.CompanyPeriodFk;
					if (period < 0) {
						var strTitle = 'controlling.revrecognition.createRevenueRecognition.title';
						var strBody = 'controlling.revrecognition.createRevenueRecognition.selectPeriodRequire';
						dialogService.showMsgBox(strBody, strTitle, 'info');
						return false;
					}
					var createFromWiard = $scope.createFromWiard;
					var projectId = $scope.currentItem.ProjectFk;
					var projectIds = [];
					var filterRequest = null;
					var createByCurrentResultSet = $scope.additionOption.createByCurrentResultSet;
					var createBySelectResultSet = $scope.additionOption.createBySelectResultSet;
					var createByAddtion = !!(createByCurrentResultSet || createBySelectResultSet);
					if (createFromWiard && createByAddtion) {
						var projectMainService = $injector.get('projectMainService');
						if (createBySelectResultSet) {
							var selectProjects = projectMainService.getSelectedEntities();
							projectIds = _.map(selectProjects, 'Id');
						} else {
							filterRequest = cloudDesktopSidebarService.filterRequest;
						}
					} else {
						if (projectId) {
							projectIds.push(projectId);
						}
					}
					var param = {
						companyYearFk: $scope.currentItem.CompanyYearFk,
						companyPeriodFk: $scope.currentItem.CompanyPeriodFk,
						projectIds: projectIds,
						createFromWiard: createFromWiard,
						filterRequest: filterRequest,
						createByAddtion: createByAddtion
					};
					if (createFromWiard && createByAddtion) {
						if (projectIds.length === 0 && createBySelectResultSet) {
							var strTitle1 = 'controlling.revrecognition.createRevenueRecognition.title';
							var strBody1 = 'controlling.revrecognition.createRevenueRecognition.createRevenueRecognitionNoRecord';
							dialogService.showMsgBox(strBody1, strTitle1, 'info');
							return;
						}
						$scope.$close();
						$http.post(globals.webApiBaseUrl + 'controlling/RevenueRecognition/checkProjectCompany', param).then(function (response) {
							var res = response.data;
							if (res) {
								var strTitle = 'controlling.revrecognition.createRevenueRecognition.title';
								var strBody = 'controlling.revrecognition.createRevenueRecognition.differentCompanyTip';
								dialogService.showMsgBox(strBody, strTitle, 'info').then(function () {
									createRevenueRecognition(param);
								});
							} else {
								createRevenueRecognition(param);
							}

						});
					} else {
						createRevenueRecognition(param);
					}
				};

				function createRevenueRecognition(param) {
					$http.post(globals.webApiBaseUrl + 'controlling/RevenueRecognition/createRevenueRecognitionHeaderFromDialog', param).then(function (response) {
						var res = response.data;
						if (res) {
							var revrecognitionIds = _.map(res, function (item) {
								return item.Id;
							});
							var modalOptions = {
								headerTextKey: 'controlling.revrecognition.createRevenueRecognition.title',
								bodyTextKey: 'controlling.revrecognition.createRevenueRecognition.createRevenueRecognitionSuccess',
								showOkButton: true,
								showCancelButton: false,
								customButtons: [{
									id: 'goto',
									caption: $translate.instant('controlling.revrecognition.createRevenueRecognition.gotoRevrecognition'),
									cssClass: 'tlb-icons ico-goto navigator-button',
									fn: function (button, event, closeFn) {
										closeFn();
										$scope.navigate(revrecognitionIds);
									}
								}]
							};
							platformModalService.showDialog(modalOptions);
							var createFromWiard = param.createFromWiard;
							if (!createFromWiard && res.length > 0) {
								var headerService = $injector.get('controllingRevenueRecognitionHeaderDataService');
								headerService.refresh().then(function () {
									let headerData = res[0];
									let item = headerService.getItemById(headerData.Id);
									if (item) {
										headerService.setSelected(item);
									}
								});
							}
							$scope.$close();
						} else {
							var strTitle1 = 'controlling.revrecognition.createRevenueRecognition.title';
							var strBody1 = 'controlling.revrecognition.createRevenueRecognition.createRevenueRecognitionNoRecord';
							dialogService.showMsgBox(strBody1, strTitle1, 'info');
						}
					});
				}

				$scope.navigate = function (revrecognitionIds) {
					navigationService.navigate({
						moduleName: 'controlling.revrecognition'
					}, revrecognitionIds, 'Id');
				};

				$scope.modalOptions.onCancel = function () {
					$scope.$close();
				};

				$scope.$on('$destroy', function () {
					basicsLookupdataLookupFilterService.unregisterFilter(filters);
				});

			}]);
})(angular);
