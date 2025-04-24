
(function (angular) {
	'use strict';
	angular.module('basics.company').controller('basicsCompanyCopyCompanyContainerController', [
		'$translate',
		'$scope',
		'$http',
		'platformGridAPI',
		'basicsCompanyCopyCompanyFirstGridDataService',
		'basicsCompanyCopyCompanySecondGridDataService',
		'platformModalService',
		'basicsCompanyMainService',
		'_',
		'globals',
		function ($translate,
			$scope,
			$http,
			platformGridAPI,
			basicsCompanyCopyCompanyFirstGridDataService,
			basicsCompanyCopyCompanySecondGridDataService,
			platformModalService,
			basicsCompanyMainService,
			_,
			globals
		) {
			$scope.soureCompany = basicsCompanyMainService.getSelected();
			$scope.title = $translate.instant('basics.company.copyCompany.title');
			$scope.steps = [
				{
					number: 0,
					identifier: 'basic',
					name: 'copyCompanyBasic',
					disallowBack: true,
					disallowNext: false,
					canFinish: false,
					disallowCancel: false
				},
				{
					number: 1,
					identifier: 'second',
					name: 'copyCompanySecond',
					disallowBack: false,
					disallowNext: true,
					canFinish: true,
					disallowCancel: false
				}
			];
			$scope.modalOptions = {
				headerText: $scope.title,
				cancel: function () {
					$scope.$close(false);
				}
			};
			$scope.dataFristPage = null;
			$scope.dataSecondPage = null;
			$scope.isReadying = false;
			$scope.selectStep = angular.copy($scope.steps[0]);
			$scope.disabledNext=function ()
			{
				let dataSelected = basicsCompanyCopyCompanyFirstGridDataService.getSelectedData();
				if (_.isEmpty(dataSelected)) {
					return true;
				}
				// judge group type company data
				/* let dataFind = _.find(dataSelected, function (item) {
					return item.CompanyTypeFk !== 2;
				});
				if (!dataFind) {
					return false;
				} */

				return false;
			};


			$scope.disabledFinsh=function ()
			{
				let dataSelected = basicsCompanyCopyCompanySecondGridDataService.getSelectedData();
				if (_.isEmpty(dataSelected)) {
					return true;
				}
				// judge only rubric data
				let dataFind = _.find(dataSelected, function (value) {
					if (value.RubricCategoryId || value.IndexId) {
						return true;
					}
				});
				if (!dataFind) {
					return true;
				}
				return false;
			};
			$scope.wizardCommands = {
				goToNext: function () {
					stepCheck($scope.selectStep);
					setCurrentStep($scope.selectStep.number + 1);
				},
				goToPrevious: function () {
					let gotoStep = $scope.selectStep.number - 1;
					setCurrentStep(gotoStep);
				},
				finish: function () {
					stepCheck($scope.selectStep);
					// get company data
					let targetCompany = _.map($scope.dataFristPage, function (vaule) {
						if (!_.isEmpty(vaule)) {
							return vaule.Id;
						}
					});
					// select data
					let listRubricIdData = [];
					_.forEach($scope.dataSecondPage, function (vaule) {
						if (!_.isEmpty(vaule) && (vaule.IndexId || vaule.RubricCategoryId)) {
							let rubricIdData = {
								RubricId: vaule.RubricId,
								IndexId: vaule.IndexId,
								RubricCategoryId: vaule.RubricCategoryId
							};
							listRubricIdData.push(rubricIdData);
						}
					});
					// send data
					let data = {
						SourceCompany: $scope.soureCompany.Id,
						TargetCompany: targetCompany,
						ListRubric: listRubricIdData
					};
					$http.post(globals.webApiBaseUrl + 'basics/company/copyCompanySetting', data).then(function (response) {
						if (response && response.data) {
							if (response.data.Result === 0) {
								// success
								platformModalService.showMsgBox(response.data.Message, $scope.title, 'info');
								$scope.$close(false);
								// error
							} else if (response.data.Result === -1) {
								platformModalService.showMsgBox(response.data.Message, $scope.title, 'error');
							}
							// necessary information error
							else if (response.data.Result === -2) {
								platformModalService.showMsgBox(response.data.Message, $scope.title, 'info');
							}
						}
					});
				}
			};
			function stepCheck(step) {
				let dataSelected=null;
				switch (step.number)
				{
					case 0:
						dataSelected= basicsCompanyCopyCompanyFirstGridDataService.getSelectedData();
						$scope.dataFristPage = dataSelected;
						break;
					case 1:
						 dataSelected = basicsCompanyCopyCompanySecondGridDataService.getSelectedData();
						$scope.dataSecondPage = dataSelected;
						break;
				}
			}
			function setCurrentStep(step) {
				$scope.selectStep = angular.copy($scope.steps[step]);
			}
			$scope.wzStrings = {
				back: function () {
					if ($scope.selectStep.number === 0) {
						$scope.selectStep.disallowBack = true;
					} else if ($scope.selectStep.number === 1) {
						$scope.selectStep.disallowBack = false;
					}
					return $translate.instant('platform.wizard.back');
				},
				next: $translate.instant('platform.wizard.next'),
				cancel: $translate.instant('cloud.common.cancel'),
				finish: $translate.instant('cloud.common.ok')
			};
		}
	]);
})(angular);
