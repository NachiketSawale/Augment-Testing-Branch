(function (angular) {
	'use strict';
	/* global _, globals */
	let moduleName = 'basics.clerk';
	angular.module(moduleName).service('basicsClerkCreateClerksFromUsersWizardService', BasicsClerkCreateClerksFromUsersWizardService);

	BasicsClerkCreateClerksFromUsersWizardService.$inject = [
		'$http', '$q', '$injector', 'platformModalService', 'platformWizardDialogService', 'platformUIConfigInitService',
		'platformSchemaService','$translate'
	];

	function BasicsClerkCreateClerksFromUsersWizardService(
		$http, $q, $injector, platformModalService, platformWizardDialogService, platformUIConfigInitService,
		platformSchemaService, $translate
	) {
		this.createClerksFromUsers = function createClerksFromUsers() {

			let createClerkFromUserData = {
				wizardData: {
					selection: [],
					resultList: []
				}
			};

			let wzConfig = {
				title: $translate.instant('basics.clerk.createClerksFromUsersWizard.title'),
				width: '50%',
				height: '600px',
				steps: [
					createGridStep(),
					createResultGridStep(),
				]
			};

			function createGridStep() {
				let title = '';
				let topDescription = $translate.instant('basics.clerk.createClerksFromUsersWizard.selectUsersDescription');
				let config = { title, useSearchButton: true, searchDirective: 'basics-clerk-text-with-search-button', topDescription: topDescription, requireSelection: true, suppressFilter: false, model: 'wizardData.listModel', stepId:'selection' };

				createClerkFromUserData.wizardData.listModel = {
					items: createClerkFromUserData.wizardData.selection,
					selectedId: null,
					id: 'selection',
					selectionListConfig: {
						selectedIdProperty: 'selectedId',
						idProperty: 'Id',
						columns: [{id: 'name', field: 'Name', name: 'Name', name$tr$: 'usermanagement.user.userName'},
							{id: 'description', field: 'Description', name: 'Description', name$tr$: 'usermanagement.user.userDescription'},
							{id: 'logonName', field: 'Logonname', name: 'Logon Name', name$tr$: 'usermanagement.user.userLogonName'},
							{id: 'email', field: 'Email', name: 'E-Mail', name$tr$: 'usermanagement.user.userEmail'}],
						multiSelect: true,
					}
				};
				let gridStep = platformWizardDialogService.createListStep(config, topDescription, 'wizardData.listModel', 'selection');
				gridStep.cssClass = 'form-without-label';
				gridStep.requireSelection = true;
				gridStep.disallowNext = false;
				return gridStep;
			}

			function createResultGridStep() {
				let title = $translate.instant('basics.clerk.createClerksFromUsersWizard.finishTitle');
				let topDescription = '';
				createClerkFromUserData.wizardData.resultListModel = {
					items: [],//createClerkFromUserData.wizardData.resultList,
					selectedId: null,
					id: 'result',
					selectionListConfig: {
						idProperty: 'Id',
						columns: _.cloneDeep($injector.get('basicsClerkUIStandardService').getStandardConfigForListView().columns),
						options: {
							readonly: true,
						}
					}
				};
				let gridStep = platformWizardDialogService.createListStep(title, topDescription, 'wizardData.resultListModel', 'result');
				gridStep.cssClass = 'form-without-label';
				gridStep.disallowNext = true;
				gridStep.disallowBack = true;
				gridStep.disallowCancel = true;
				gridStep.canFinish = true;
				gridStep.prepareStep = function prepareSelectionHandle(info) {
					const selectedItems = [];
					_.forEach(info.model.wizardData.selection, function (userEntity) {
						if (userEntity.rt$isIncluded) {
							selectedItems.push(userEntity);
						}
					});

					// check any user is selected!
					if (selectedItems.length > 0) {
						return $http.post(globals.webApiBaseUrl + 'basics/clerk/createclerksfromusers/', selectedItems).then(function (result) {

							_.forEach(result.data, function (item) {
								$injector.get('platformRuntimeDataService').readonly(item, true);
							});

							createClerkFromUserData.wizardData.resultListModel.items = result.data;
						});
					} else {
						showModalDialog('basics.clerk.createClerksFromUsersWizard.infoTitle',
							'basics.clerk.createClerksFromUsersWizard.noSelectedUserInfo');
						info.commands.goToPrevious();
					}
				};

				return gridStep;
			}

			// before opening the wizard-dialog fetch users to selected, to the grid-view-data
			return $http.get(globals.webApiBaseUrl + 'basics/clerk/getusers').then(function (result) {
				if(result.data.length > 0){
					createClerkFromUserData.wizardData.selection.push(...result.data);

					platformWizardDialogService.showDialog(wzConfig, createClerkFromUserData);
				}else{
					showModalDialog('basics.clerk.createClerksFromUsersWizard.infoTitle',
						'basics.clerk.createClerksFromUsersWizard.allUsersGeneratedInfo');
				}
			});

		};

		function showModalDialog(title, message) {
			let modalOptions = {
				headerText: $translate.instant(title),
				bodyText: $translate.instant(message),
				iconClass: 'ico-info'
			};
			return platformModalService.showDialog(modalOptions);
		}

	}
})(angular);
