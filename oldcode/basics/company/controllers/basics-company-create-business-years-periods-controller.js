(function () {
	'use strict';
	/* global globals, angular, _, moment */
	var moduleName = 'basics.company';
	angular.module(moduleName).controller('companyCreateBusinessYearsPeriodsController', [
		'$translate',
		'$scope',
		'$http',
		'basicsCompanyYearService',
		'platformModalService',
		function (
			$translate,
			$scope,
			$http,
			basicsCompanyYearService,
			platformModalService
		) {
			$scope.modalOptions.headerText = $translate.instant('basics.company.createBusinessYearsPeriods.title');
			$scope.title = $translate.instant('basics.company.createBusinessYearsPeriods.title');
			$scope.entity = {
				CompanyFk: $scope.modalOptions.company.Id,
				StartYear: null,
				EndYear: null,
				StartDate: null,
				Frequency: null,
				DaysOfPerPeriods: null
			};

			let currentYear = new Date().getFullYear();
			let showYearNum = 30;
			let yearList = [];
			for (let i = 0; i < showYearNum; i++) {
				yearList.push({ Id: currentYear + i, Description: currentYear + i});
			}
			$scope.yearOptions = {
				items: yearList,
				valueMember: 'Id',
				displayMember: 'Description',
				popupOptions: {
					height: 160
				}
			};

			let frequencyObj = {
				'Weekly': 'Weekly',
				'TwiceAMonth': 'Twice a Month',
				'Monthy': 'Monthy',
				'Quarterly': 'Quarterly',
				'UserSpecified': 'User Specified'
			};
			let frequencyList = [];
			_.forEach(frequencyObj, function (val, key) {
				frequencyList.push({Id: key, Description: val});
			});
			$scope.frequencyOptions = {
				items: frequencyList,
				valueMember: 'Id',
				displayMember: 'Description',
				popupOptions: {
					height: 160
				}
			};

			$scope.yearHasError = false;
			$scope.yearError = $translate.instant('basics.company.createBusinessYearsPeriods.endYearGreaterStartYear');
			$scope.dateError = $translate.instant('basics.company.createBusinessYearsPeriods.startDateYearSameAsTradingYear');
			$scope.startYearConfig = {
				model: 'StartYear',
				validator: function (entity, value) {
					let result = {apply: true, valid: true};
					if (entity.EndYear && entity.EndYear < value) {
						result.valid = false;
						$scope.yearHasError = true;
						entity.StartDate = moment(value + '/01/01 12:00');
					}
					else {
						$scope.yearHasError = false;
						entity.StartDate = moment(value + '/01/01 12:00');
					}
					if (!entity.EndYear) {
						entity.EndYear = value;
					}
					if (_.has($scope.entity, '__rt$data.errors.StartDate')) {
						$scope.entity.__rt$data.errors.StartDate = null;
					}
					return result;
				}
			};

			$scope.endYearConfig = {
				model: 'EndYear',
				validator: function (entity, value) {
					let result = {apply: true, valid: true};
					if (value < entity.StartYear) {
						result.valid = false;
						$scope.yearHasError = true;
					}
					else {
						$scope.yearHasError = false;
					}
					return result;
				}
			};

			$scope.startDateConfig = {
				model: 'StartDate',
				validator: function (entity, value) {
					let startDateYear = value.year();
					let result = {apply: true, valid: true};
					if (startDateYear !== entity.StartYear) {
						result.valid = false;
						result.error = $translate.instant('basics.company.createBusinessYearsPeriods.startDateYearSameAsTradingYear');
					}
					return result;
				}
			};

			$scope.disableOk = function disableOk() {
				return !(
					$scope.entity.StartYear &&
					$scope.entity.EndYear &&
					$scope.entity.StartDate &&
					(($scope.entity.Frequency && $scope.entity.Frequency !== 'UserSpecified') || ($scope.entity.Frequency && $scope.entity.Frequency === 'UserSpecified' && $scope.entity.DaysOfPerPeriods)) &&
					!$scope.yearHasError &&
					!(_.has($scope.entity, '__rt$data.errors.StartDate.error')));
			};

			$scope.onOk = function onOk() {
				$http.post(globals.webApiBaseUrl + 'basics/company/year/createbusinessyearsbywizard', $scope.entity).then(function (res) {
					let createdYear = _.find(res.data, {Version: 1});

					var msg;
					if (!createdYear) {
						msg = $translate.instant('basics.company.createBusinessYearsPeriods.yearWastModified', { yearStr: $scope.entity.StartYear });
					}
					else {
						msg = $translate.instant('basics.company.createBusinessYearsPeriods.yearWasCreated', { yearStr: createdYear.TradingYear });
					}

					platformModalService.showMsgBox(msg, $translate.instant('basics.company.createBusinessYearsPeriods.title'), 'info').finally(
						function () {
							basicsCompanyYearService.load();
						});
					$scope.$close(false);
				});
			};
		}
	]);
})();
