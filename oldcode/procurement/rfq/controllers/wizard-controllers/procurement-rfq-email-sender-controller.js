/**
 * Created by noom on 9/13/2023.
 */
(function (angular) {
	'use strict';
	let moduleName = 'procurement.rfq';
	/**
	 * @ngdoc controller
	 * @name procurementRfqEmailRecipientController
	 * @requires []
	 * @description
	 * #
	 * Controller for wizard 'send email' dialog form group 'recipient'.
	 */
	angular.module(moduleName).controller('procurementRfqEmailSenderController', [
		'_',
		'$scope',
		'$translate',
		'$injector',
		'$http',
		'$q',
		'$timeout',
		'platformUserInfoService',
		'platformContextService',
		'procurementRfqEmailFaxWizardService',
		'procurementRfqEmailSenderService',
		function (_,
			$scope,
			$translate,
			$injector,
			$http,
			$q,
			$timeout,
			platformUserInfoService,
			platformContextService,
			procurementRfqEmailFaxWizardService,
			senderService) {

		 	const emailTypes = senderService.emailTypes;

			$scope.selectOptions = {
				items: [],
				displayMember: 'Value',
				valueMember: 'Id'
			};

			$scope.entity = {};

			$scope.sendWithOwnMailAddress = false;

			$scope.onSelectedChanged = function () {
				procurementRfqEmailFaxWizardService.setSelectedSenderEmail($scope.entity.Value);
			};

			function onSendWithOwnMailAddress(sendWithOwnMailAddress, senderList, selectedEmail){
				$scope.sendWithOwnMailAddress = sendWithOwnMailAddress;
				$scope.selectOptions.items = senderList;
				if (selectedEmail){
					$scope.entity = selectedEmail;
				}
				else {
					let clerkEmail = $scope.selectOptions.items[0];
					if (sendWithOwnMailAddress){
						clerkEmail = _.find($scope.selectOptions.items, item => item.Id === emailTypes.currentUserClerkEmail || item.Id === emailTypes.currentUserEmail);
					}
					else {
						clerkEmail = senderService.getDefaultEmail(senderList, sendWithOwnMailAddress);
					}
					$scope.entity = clerkEmail;
				}
				procurementRfqEmailFaxWizardService.setSelectedSenderEmail($scope.entity.Value);
			}

			initialize();

			function initialize() {
				$scope.selectOptions.items = senderService.initialSenderList();
				$timeout(function () {
					$scope.selectOptions.items = senderService.getSenderList();
					if ($scope.sendWithOwnMailAddress){
						$scope.selectOptions.items = angular.copy(_.filter($scope.selectOptions.items, item => item.Id === emailTypes.currentUserClerkEmail || item.Id === emailTypes.currentUserEmail));
					}
					if ($scope.selectOptions.items && $scope.selectOptions.items.length > 0) {
						$scope.selectOptions.items = _.orderBy($scope.selectOptions.items, 'Id');
						$scope.entity = senderService.getDefaultEmail($scope.selectOptions.items, $scope.sendWithOwnMailAddress);
						procurementRfqEmailFaxWizardService.setSelectedSenderEmail($scope.entity.Value);
					}
				}, 3000);

				senderService.onSendWithOwnMailAddressMessager.register(onSendWithOwnMailAddress);
			}

			$scope.$on('$destroy', function () {
				senderService.setSenderList([]);
				senderService.onSendWithOwnMailAddressMessager.unregister(onSendWithOwnMailAddress);
			});
		}
	]);
})(angular);