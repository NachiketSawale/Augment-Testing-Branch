/**
 * Created by zjo on 05/12/2022.
 */
(function (angular) {
	/* global globals */
	'use strict';

	let moduleName = 'basics.meeting';
	angular.module(moduleName).controller('basicsMeetingDeleteRecurrenceController',
		['_', '$rootScope', '$scope', '$q', '$http', '$translate', 'moment', 'platformTranslateService',
			function (_, $rootScope, $scope, $q, $http, $translate, moment, platformTranslateService) {
				$scope.options = $scope.$parent.modalOptions;
				$scope.formOptions = {
					'fid': 'basics.meeting.deleteRecurrencyMeetingModal',
					'version': '1.1.0',
				};
				// translate form config.
				platformTranslateService.translateFormConfig($scope.formOptions);
				$scope.formContainerOptions = {};
				$scope.formContainerOptions.formOptions = {
					configure: $scope.formOptions,
					showButtons: [],
				};

				$scope.setTools = function (tools) {
					$scope.tools = tools;
				};

				$scope.modalOptions = {
					headerText: $translate.instant('basics.meeting.recurrence.dialogTitle'),
					closeButtonText: $translate.instant('cloud.common.cancel'),
					currentButtonText: $translate.instant('basics.meeting.recurrence.currentOnly'),
					currentAndFutureButtonText: $translate.instant('basics.meeting.recurrence.currentAndFuture'),
					allMeetingButtonText: $translate.instant('basics.meeting.recurrence.allMeeting'),
					deleteTypeConfirmText:$translate.instant('basics.meeting.recurrence.deleteTypeConfirm')
				};

				function doDelete(type) {
					let dataService = $scope.options.dataService;
					let selectedItem = dataService.getSelected();
					let data = {mainItemId: selectedItem.Id, type: type};
					$http({
						method: 'POST',
						url: globals.webApiBaseUrl + 'basics/meeting/delete/recurrence',
						data: data,
					}).then(function (result) {
						if (result) {
							dataService.load();

							// If the Minutes text was modified but was not saved before deleting the meeting item,
							// set modifiedSpecification to null to avoid calling the 'update' API.
							let childServices = dataService.getChildServices();
							_.forEach(childServices, function (childService) {
								if (childService.setSpecificationAsModified) {
									childService.setSpecificationAsModified(null);
								}
							});
						}
					});
				}

				$scope.modalOptions.current = function onCurrent() {
					doDelete(1);
					$scope.$close(false);
				};
				$scope.modalOptions.currentAndFuture = function onCurrentAndFuture() {
					doDelete(2);
					$scope.$close(false);
				};
				$scope.modalOptions.allMeeting = function onaAllMeeting() {
					doDelete(3);
					$scope.$close(false);
				};
				$scope.modalOptions.close = function onCancel() {
					$scope.$close(false);
				};
				$scope.modalOptions.cancel = $scope.modalOptions.close;
			}]);
})(angular);