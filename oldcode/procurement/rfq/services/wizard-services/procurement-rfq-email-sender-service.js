(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,console */
	var moduleName = 'procurement.rfq';
	/**
	 * @ngdoc service
	 * @name procurementRfqEmailSenderService.js
	 * @function
	 * @requires platformDataServiceFactory
	 *
	 * @description
	 * #
	 *  to be filled
	 */
	angular.module(moduleName).factory('procurementRfqEmailSenderService', [
		'_',
		'platformDataServiceFactory',
		'$injector',
		'platformCreateUuid',
		'$translate',
		'$http',
		'$q',
		'platformUserInfoService',
		'platformContextService',
		'PlatformMessenger',
		function (_,
		          platformDataServiceFactory,
		          $injector,
		          platformCreateUuid,
		          $translate,
		          $http,
		          $q,
		          platformUserInfoService,
		          platformContextService,
		          PlatformMessenger) {

			let serviceOption = {
				flatRootItem: {
					module: angular.module(moduleName),
					serviceName: 'procurementRfqEmailSenderService',
					dataProcessor: [{
						processItem: function (sender) {
							console.log(sender);
						}
					}],
					modification: {multi: true},
					entityRole: {
						root: {
							itemName: platformCreateUuid()
						}
					},
					presenter: {
						list: {}
					}
				}
			};

			const emailTypes = {
				currentUserClerkEmail: 1,
				currentUserEmail: 2,
				projectClerkEmail: 3,
				projectEmail: 4,
				server2CompanyEmail: 5,
				companyInfoEmail: 6,
				outlookProfileEmail: 7
			}

			let container = platformDataServiceFactory.createNewComplete(serviceOption);

			container.service.emailTypes = emailTypes;

			container.service.onSendWithOwnMailAddressMessager = new PlatformMessenger();

			container.data.load = function () {
				console.log('load called');
			};

			container.data.getList = function () {
				return container.service.getSenderList();
			};

			container.service.getErrorList = function getErrorList() {
				return container.data.errorList || [];
			};

			let senderList = [];

			container.service.senderListCache = {};

			container.service.getSenderList = function () {
				return senderList;
			};

			container.service.setSenderList = function(list){
				senderList = list;
			}

			container.service.initialSenderList = function () {
				let companyId = platformContextService.getContext().clientId;

				// current clerk
				getCurrentClerk().then(function (startingClerk) {
					if (startingClerk && startingClerk.Email) {
						senderList = addEmailToList({
							Id: emailTypes.currentUserClerkEmail,
							Value: startingClerk.Email
						}, senderList);
					}
				});

				// user email
				let userEmail = platformUserInfoService.getCurrentUserInfo().Email;
				if (userEmail) {
					senderList = addEmailToList({
						Id: emailTypes.currentUserEmail,
						Value: userEmail
					}, senderList);
				}

				// project email
				let genWizService = $injector.get('genericWizardService');
				let genWizConfig = genWizService ? genWizService.config : null;
				let genWizProject = genWizConfig ? genWizConfig.project : null;

				if (genWizProject) {
					setProjectEmail(genWizProject);
				} else {
					const procurementRfqMainService = $injector.get('procurementRfqMainService');
					let mainItem = procurementRfqMainService.getSelected();
					if (mainItem && mainItem.ProjectFk) {
						getProjectEmail(mainItem.ProjectFk).then((project) => {
							setProjectEmail(project);
						});
					}
				}

				// get company email from customizing
				const emailServerConfigurationService = $injector.get('basicsCustomizeEmailServerConfigurationService');
				emailServerConfigurationService.readEmailServer2CompanyList().then(function (res) {
					let companyEmail = _.find(res.data, item => {
						return item.CompanyFk === companyId;
					});
					if (companyEmail && companyEmail.SenderEmail) {
						senderList = addEmailToList({
							Id: emailTypes.server2CompanyEmail,
							Value: companyEmail.SenderEmail
						}, senderList);
					}
				});

				// get company email from Company Info
				getCompanyById(companyId).then(function (companyInfo) {
					if (companyInfo && companyInfo.Email) {
						senderList = addEmailToList({
							Id: emailTypes.companyInfoEmail,
							Value: companyInfo.Email
						}, senderList);
					}
				});

				// outlook email
				const outlookMainService = $injector.get('cloudDesktopOutlookMainService');
				outlookMainService.readProfile()
					.then((profile) => {
						if (profile && profile.mail) {
							senderList = addEmailToList({
								Id: emailTypes.outlookProfileEmail,
								Value: profile.mail
							}, senderList);
						}
					});

				container.service.senderListCache = angular.copy(senderList);

				return senderList;
			};

			container.service.getDefaultEmail = function(emailList, sendWithOwnMailAddress){
				let email = emailList[0];
				if (sendWithOwnMailAddress){
					email = _.find(senderList, item => item.Id === emailTypes.currentUserClerkEmail || item.Id === emailTypes.currentUserEmail);
				} else if (isOutlookMode()){
					email = _.find(emailList, item => item.Id === emailTypes.projectEmail);
					if (!email){
						email = _.find(emailList, item => item.Id === emailTypes.outlookProfileEmail);
					}
				} else {
					email = _.find(emailList, item => item.Id === emailTypes.server2CompanyEmail);
				}
				return email;
			}

			function setProjectEmail(project) {
				if (project && project.ClerkEmail) {
					senderList = addEmailToList({
						Id: emailTypes.projectClerkEmail,
						Value: project.ClerkEmail
					}, senderList);
				}
				if (project && project.Email) {
					senderList = addEmailToList({
						Id: emailTypes.projectEmail,
						Value: project.Email
					}, senderList);
				}
			}

			function getProjectEmail(value) {
				let deferred = $q.defer();
				$http.get(globals.webApiBaseUrl + 'project/main/byid?id=' + value).then(function (response) {
					deferred.resolve(response.data);
				});

				return deferred.promise;
			}

			function getCompanyById(companyId) {
				let deferred = $q.defer();
				$http.get(globals.webApiBaseUrl + 'basics/company/getCompanyById?companyId=' + companyId)
					.then(function (response) {
						deferred.resolve(response.data);
					});
				return deferred.promise;
			}

			function getCurrentClerk() {
				let deferred = $q.defer();
				$http.post(globals.webApiBaseUrl + 'basics/workflow/getCurrentClerk')
					.then(function (response) {
						deferred.resolve(response.data);
					});
				return deferred.promise;
			}

			function addEmailToList(email, emailList) {
				return _.uniqBy(_.sortBy(_.concat(emailList, email), 'Id'), 'Value');
			}

			function isOutlookMode() {
				const outlookMainService = $injector.get('cloudDesktopOutlookMainService');
				let isShowOutlook = outlookMainService.getIsShowOutlookSync();
				let isOutlookLogout = false;
				if (isShowOutlook) {
					let profile = outlookMainService.getProfileSync();
					isOutlookLogout = !profile;
				}
				return isShowOutlook && !isOutlookLogout;
			}

			return container.service;

		}
	]);
})(angular);
