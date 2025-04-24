/**
 * Created by rei on Oct.2017.
 */
/* globals app */  // jshint ignore:line

(function () {
	'use strict';

	/**
	 @ngdoc controller
	 * @name portalInvitationWizardDialogController
	 * @function
	 *
	 * @description
	 * Controller for Login dialog.
	 */
	angular.module('platform').controller('portalInvitationWizardDialogController',
		['$q', '$log', '$scope', 'globals', '_', 'platformContextService', 'platformTranslateService', '$translate',
			'$timeout', '$stateParams', 'platformPortalService', 'platformModalService', 'usermanagementPortalInvitationWizardService',
			'basicsWorkflowInstanceService',
			function platformPartialLogonDialogController($q, $log, $scope, globals, _, platformContextService, platformTranslateService, $translate, $timeout,
				$stateParams, platformPortalService, platformModalService, usermanagementPortalInvitationWizardService,
				basicsWorkflowInstanceService) { // jshint ignore:line

				var selInfo = usermanagementPortalInvitationWizardService.selectedItem();
				var contactId;
				var workflowTemplateId;
				if (selInfo && selInfo.selectedItem) {
					workflowTemplateId = selInfo.workflowTemplateId;
					contactId = selInfo.contactId;
				}
				var theClerk;

				$scope.dlgData = {
					contact: {},
					FrmPortalUserGroupFk: undefined,
					finishedinfo: true
				};
				$scope.portalAccessGroupOptions = {
					displayMember: 'Name', valueMember: 'Id',
					items: [],
					watchItems: true
				};
				$scope.invitationOptions = {
					loading: false,
					loadingInfo: $translate.instant('businesspartner.main.portal.wizard.loading'), //
					invitationInfoText: $translate.instant('businesspartner.main.portal.wizard.invitationDialogBody'),// 'Do you want to invite the following Contact as a Bidder for the iTWO4.0 Bidder Portal?<br><br>',
					canOk: function () {
						return !_.isNil($scope.dlgData.FrmPortalUserGroupFk);
					}
				};

				// loads or updates translated strings
				var loadTranslations = function () {
					// $log.debug('loadTranslations called', logonService.getUiLanguages());
					// load translation of tile-group definition
					$scope.text = platformTranslateService.instant({
						platform: [],
						'platform.portal': ['socialInfo', 'providerName', 'providerUserEmail', 'remark', 'companyName',
							'phone', 'street', 'zipCode', 'city', 'country', 'clerk', 'registerButton', 'backButton',
							'finishedinfo', 'confirmlabel',
							'contactName', 'bpdName', 'bpdAddress', 'email', 'accessGroup']
					});
				};
				// register translation changed event
				platformTranslateService.translationChanged.register(loadTranslations);

				// register a module - translation table will be reloaded if module isn't available yet
				if (!platformTranslateService.registerModule('app')) {
					// if translation is already available, call loadTranslation directly
					loadTranslations();
				}

				function closeDialogIfTrue(flag) {
					if (flag === true) {
						$scope.$close();
					}
				}

				function isStringwithContent(str) { // jshint ignore:line
					return (_.isString(str) && str.length > 0);
				}

				/**
				 * startupLoader()
				 */
				function startupLoader(params, contactId) {
					// console.log('Project Favorites Refresh pressed');
					$scope.invitationOptions.loading = true;

					var p3 = usermanagementPortalInvitationWizardService.checkClerktoLoginUser().then(function (clerkdto) {

						theClerk = clerkdto;
						if (_.isNil(theClerk)) {
							platformModalService.showErrorBox('businesspartner.main.portal.wizard.errClerkInvalidBody', 'businesspartner.main.portal.wizard.errClerkInvalidTitle');
							closeDialogIfTrue(true);
						}
					});

					var promise2;
					if (contactId) {
						promise2 = usermanagementPortalInvitationWizardService.getContactwithBpd(contactId).then(function (data) {
							$scope.dlgData.contact.id = contactId;
							$scope.dlgData.contact.email = data.contactEmail;
							$scope.dlgData.contact.contactFullName = data.contactFullName;
							$scope.dlgData.contact.bpdFullName = data.bpdFullName;
							$scope.dlgData.contact.bpdAddress = data.bpdAddress;
						});
					} else if (selInfo.userId) {
						promise2 = usermanagementPortalInvitationWizardService.getContactwithBpdFromUserId(selInfo.userId).then(function (data) {
							// var isValid = true;
							// var errMsg = [];
							if (!_.isNil(data)) {
								$scope.dlgData.contact.id = contactId;
								$scope.dlgData.contact.email = data.contactEmail;
								$scope.dlgData.contact.contactFullName = data.contactFullName;
								$scope.dlgData.contact.bpdFullName = data.bpdFullName;
								$scope.dlgData.contact.bpdAddress = data.bpdAddress;
							} else {
								platformModalService.showErrorBox('businesspartner.main.portal.wizard.errUsernotFoundBody', 'businesspartner.main.portal.wizard.errUsernotFoundTitle').then(
									function () {
										closeDialogIfTrue(true);
									});
							}
						});
					}

					var p1 = usermanagementPortalInvitationWizardService.readPortalAccessGroup().then(function (data) {
						if (data) {
							$scope.portalAccessGroupOptions.items.length = 0;
							_.forEach(data, function (val) {
								if(val.Sorting !== 0)
								{
									$scope.portalAccessGroupOptions.items.push(val);
									if (val.IsDefault) {
										$scope.dlgData.FrmPortalUserGroupFk = val.Id; // set default value
									}
								}
							});
						}
					}, function (reason) {
						$scope.invitationOptions.loading = false;
						platformModalService.showErrorBox('businesspartner.main.portal.wizard.errAccessGroupTitle', reason).then(
							function () {
								closeDialogIfTrue(true);
							});
					});

					$q.all([p1, promise2, p3]).then(function () {
						$scope.invitationOptions.loading = false;
					}, function (reason) {
						$scope.invitationOptions.loading = false;
						platformModalService.showErrorBox('businesspartner.main.portal.wizard.errSomeThingFailedTitle', reason).then(
							function () {
								closeDialogIfTrue(true);
							});
					});
				}

				/**
				 *
				 */
				function startInvitationWorkflow() {

					// following data will be available in workflow context as i.e Context.ContactId
					var jsonContext = {
						ContactId: contactId,  // .toFixed(0),,
						PortalAccessGroupId: $scope.dlgData.FrmPortalUserGroupFk, // .toFixed(0),
						EmailtoClerkAfterRegistration: $scope.dlgData.finishedinfo,
						PortalBaseUrl: globals.portalUrl
					};
					var ctxasString = JSON.stringify(jsonContext);
					basicsWorkflowInstanceService.startWorkflow(workflowTemplateId, null, ctxasString);

				}

				$scope.onOk = function onOk() {
					// start Workflow and process takes place...
					startInvitationWorkflow();
					closeDialogIfTrue(true);
				};

				$scope.onCancel = function onCancel() {
					closeDialogIfTrue(true);
				};

				// un-register on destroy
				$scope.$on('$destroy', function () {
					platformTranslateService.translationChanged.unregister(loadTranslations);
				});

				startupLoader($stateParams, contactId);
			}
		]);
})();
