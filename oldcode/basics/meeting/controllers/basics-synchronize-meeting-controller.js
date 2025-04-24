/**
 * Created by chd on 04/02/2022.
 */
(function (angular) {
	'use strict';

	let moduleName = 'basics.meeting';

	angular.module(moduleName).controller('basicsSynchronizeMeetingController',
		['_', '$rootScope', '$scope', '$q', '$http', '$translate', 'moment', 'platformTranslateService', 'basicsMeetingSidebarWizardService',
			function (_, $rootScope, $scope, $q, $http, $translate, moment, platformTranslateService, basicsMeetingSidebarWizardService) {
				$scope.options = $scope.$parent.modalOptions;
				$scope.formOptions = {
					'fid': 'basics.meeting.synchronizeMeetingModal',
					'version': '1.1.0',
				};
				$scope.syncMeetingType = $translate.instant('basics.meeting.wizard.selectSyncMeetingType');
				$scope.syncMeetingTypeOptions = [
					{id: 1, value: $translate.instant('basics.meeting.msTeamMeeting')},
					{id: 2, value: $translate.instant('basics.meeting.msCalendarMeeting')}
				];
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
					syncMeetingType: '1',
					headerText: $translate.instant('basics.meeting.wizard.syncMeetingToExternal'),
					closeButtonText: $translate.instant('cloud.common.cancel'),
					actionButtonText: $translate.instant('cloud.common.ok')
				};

				$scope.modalOptions.ok = function onOK() {
					basicsMeetingSidebarWizardService.syncMeetingAsync($scope.modalOptions.syncMeetingType, $scope.options.selectedItem, $scope.options.noEmailUser);
					$scope.$close(false);
				};

				$scope.modalOptions.close = function onCancel() {
					$scope.$close(false);
				};
				$scope.modalOptions.cancel = $scope.modalOptions.close;

			}]);
})(angular);