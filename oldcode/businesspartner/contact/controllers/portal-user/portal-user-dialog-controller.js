/**
 * Created by chi on 11/20/2017.
 */
(function () {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */

	let moduleName = 'businesspartner.contact';

	angular.module(moduleName).controller('businessPartnerContactPortalUserDialogController', businessPartnerContactPortalUserDialogController);

	businessPartnerContactPortalUserDialogController.$inject = ['$scope', '_', '$translate', 'platformGridAPI', 'platformTranslateService', 'basicsCommonHeaderColumnCheckboxControllerService'];

	function businessPartnerContactPortalUserDialogController($scope, _, $translate, platformGridAPI, platformTranslateService, basicsCommonHeaderColumnCheckboxControllerService) {
		let contacts = angular.copy($scope.modalOptions.contacts);
		let columns = angular.copy($scope.modalOptions.gridLayout).columns;
		let executeFunction = $scope.modalOptions.executeFunction;
		let gridId = 'bcc2cf9f45374c30a8dacab8490d4c3e';
		let canExecute = true;
		let isExecute = false;

		$scope.isLoading = false;
		$scope.contactData = {
			state: gridId
		};

		$scope.executeTypeTexts = {
			reactivate: $translate.instant('businesspartner.contact.reactivatePortalUser'),
			inactivate: $translate.instant('businesspartner.contact.inactivatePortalUser')
		};

		$scope.executeType = $scope.modalOptions.executeType;
		$scope.execute = execute;
		$scope.canExecuteFn = canExecuteFn;

		init();

		// ///////////
		function init() {
			_.forEach(contacts, function (contact) {
				contact.Selected = true;
			});
			setupGrid();
			updateGrid(contacts);
		}

		function setupGrid() {

			_.forEach(columns, function (column) {
				column.readonly = true;
				delete column.editor;
				delete column.editorOptions;
			});

			let selectCol = {
				id: 'selected',
				field: 'Selected',
				name: 'Selected',
				name$tr$: 'cloud.common.entitySelected',
				width: 80,
				editor: 'boolean',
				formatter: 'boolean',
				headerChkbox: true,
				cssClass: 'cell-center'
			};

			columns.splice(0, 0, selectCol);

			if (!platformGridAPI.grids.exist(gridId)) {
				let gridConfig = {
					columns: columns,
					data: [],
					id: gridId,
					lazyInit: true,
					options: {
						tree: false,
						indicator: true,
						idProperty: 'Id',
						iconClass: ''
					}
				};
				platformGridAPI.grids.config(gridConfig);
				platformTranslateService.translateGridConfig(gridConfig.columns);
			}

			let headerCheckBoxFields = ['Selected'];
			let headerCheckBoxEvents = [
				{
					source: 'grid',
					name: 'onHeaderCheckboxChanged',
					fn: function (e) {
						canExecute = (e.target.checked);
					}
				}
			];
			basicsCommonHeaderColumnCheckboxControllerService.setGridId(gridId);
			basicsCommonHeaderColumnCheckboxControllerService.init($scope, null, headerCheckBoxFields, headerCheckBoxEvents);
		}

		function updateGrid(data) {
			platformGridAPI.grids.invalidate(gridId);
			platformGridAPI.items.data(gridId, data);
		}

		function execute() {
			$scope.isLoading = true;
			isExecute = false;
			if (angular.isFunction(executeFunction)) {
				executeFunction(contacts, $scope.executeType)
					.then(function () {
						isExecute = true;
					})
					.finally(function () {
						$scope.isLoading = false;
						$scope.$close(isExecute);
					});
			}
		}

		function canExecuteFn() {
			let temp = _.filter(contacts, {Selected: true});
			return temp && temp.length > 0 && canExecute;
		}
	}

	angular.module(moduleName).controller('businesspartnerContactPortalUserManagementDialogController', [
		'$scope',
		'moment',
		'$translate',
		'$http',
		'platformModalService',
		'businesspartnerContactDataService',
		'businesspartnerMainHeaderDataService',
		'businesspartnerMainContactDataService',
		'usermanagementUserMainService',
		'$log',
		function ($scope,
			moment,
			$translate,
			$http,
			platformModalService,
			contactDataService,
			bpMainDataService,
			bpMainContactDataService,
			usermanagementUserMainService,
			$log) {

			$scope.selectedItem = angular.copy($scope.modalOptions.dataItem);

			// todo bad implementation: why don't you consume the selecteditem properties direct?
			$scope.infoText = $translate.instant('businesspartner.contact.infoText');
			$scope.okButtonText = $translate.instant('cloud.common.ok');
			$scope.closeButtonText = $translate.instant('cloud.common.cancel');
			$scope.unlinkButtonText = $translate.instant('businesspartner.contact.unlinkPortalUserButton');
			$scope.closeAct = closeButtonAct;
			$scope.okAct = okButtonAct;
			$scope.unlinkAct = unlinkButtonAct;
			$scope.stateChangeAct = stateChangeAct;
			$scope.haveProtalUser = ($scope.selectedItem.FrmUserExtProviderFk);    // todo typo
			$scope.disableUnlinkBtn = !$scope.haveProtalUser;
			$scope.disableOkBtn = !$scope.haveProtalUser;
			$scope.disableCancelBtn = false;

			$scope.selectedItem.Contact = $scope.selectedItem.FirstName ? $scope.selectedItem.FirstName + ' ' + $scope.selectedItem.FamilyName : $scope.selectedItem.FamilyName;
			$scope.selectedItem.SetInactiveDate = $scope.selectedItem.Setinactivedate ? moment.utc($scope.selectedItem.Setinactivedate).format('L | LTS') : null;

			if ($scope.selectedItem.PortalUserGroupFk) {
				$scope.selectedItem.PortalAccessGroup = $scope.selectedItem.PortalUserGroupFk;
			} else {
				if ($scope.selectedItem.FrmPortalUserGroup.length === 1) {
					$scope.selectedItem.PortalAccessGroup = $scope.selectedItem.FrmPortalUserGroup[0].Id;
				} else if ($scope.selectedItem.FrmPortalUserGroup.length > 1) {
					let defaultGroup = _.find($scope.selectedItem.FrmPortalUserGroup, {IsDefault: true});
					if (defaultGroup) {
						$scope.selectedItem.PortalAccessGroup = defaultGroup.Id;
					} else {
						$scope.selectedItem.PortalAccessGroup = $scope.selectedItem.FrmPortalUserGroup[0].Id;
					}
				}
			}

			$scope.selectedItem.portalUserGroupOptions = {
				displayMember: 'Name',
				valueMember: 'Id',
				items: $scope.selectedItem.FrmPortalUserGroup
			};
			$scope.selectedItem.stateOptions = {
				displayMember: 'Description',
				valueMember: 'Id',
				items: [
					{Id: 1, Description: $translate.instant('businesspartner.contact.active')}, // todo translation missing
					{Id: 2, Description: $translate.instant('businesspartner.contact.inactive')}]
			};

			function closeButtonAct() {
				$scope.$close(false);
			}

			function okButtonAct() {
				let comment = $scope.selectedItem.ProviderComment || '';
				let groupId = $scope.selectedItem.PortalAccessGroup || null;
				let SetInactiveDate = $scope.selectedItem.SetInactiveDate || '';
				$http.get(globals.webApiBaseUrl + 'usermanagement/main/portal/updateextprovider?extProviderId=' + $scope.selectedItem.FrmUserExtProviderFk + '&portalAccessGroupId=' + groupId + '&comment=' + comment + '&state=' + $scope.selectedItem.State + '&setInactiveDate=' + SetInactiveDate).then(function () {
					platformModalService.showMsgBox('businesspartner.contact.managePortalUserSucceessfully', 'businesspartner.contact.managePortalUserSucceessfully', 'info')
						.then(function () {
							refreshList();
							$scope.$close(false);
						});
				});

			}

			function unlinkButtonAct() {
				$scope.disableUnlinkBtn = true;
				$scope.disableOkBtn = true;
				$scope.disableCancelBtn = true;
				platformModalService.showYesNoDialog('businesspartner.contact.doYouUnlinkPortalUser', 'businesspartner.contact.unlinkPortalUserButton', 'no').then(function (result) {
					if (result.yes) {
						let contactIds = [$scope.selectedItem.Id];
						if ($scope.modalOptions.contextType === 'user') {
							$http.post(globals.webApiBaseUrl + 'usermanagement/main/portal/unlinkportalusersbyuserids/', contactIds).then(function (data) {
								refreshList();
								$scope.$close(false);
								return data.data;
							}, function (error) {
								$log.error(error);
							});
						} else if ($scope.modalOptions.contextType === 'contact' || $scope.modalOptions.contextType === 'bp') {
							$http.post(globals.webApiBaseUrl + 'usermanagement/main/portal/unlinkportalusersbycontactids/', contactIds).then(function (data) {
								refreshList();
								$scope.$close(false);
								return data.data;
							}, function (error) {
								$log.error(error);
							});
						}
					} else {
						$scope.disableUnlinkBtn = !$scope.haveProtalUser;
						$scope.disableOkBtn = !$scope.haveProtalUser;
						$scope.disableCancelBtn = false;
					}
				});
			}

			function stateChangeAct() {
				if ($scope.selectedItem.State === 1) {
					$scope.selectedItem.SetInactiveDate = null;
				} else if ($scope.selectedItem.State === 2) {
					$scope.selectedItem.SetInactiveDate = moment.utc().format('L | LTS');
				}
			}

			function refreshList() {
				if ($scope.modalOptions.contextType === 'contact') {
					contactDataService.refresh();
				} else if ($scope.modalOptions.contextType === 'bp') {
					let pbMainSeletedItem = bpMainDataService.getSelected();
					let pbMainContactSeletedItem = bpMainContactDataService.getSelected();
					let pbContactParam = {Value: pbMainSeletedItem.Id, filter: ''};
					$http.post(globals.webApiBaseUrl + 'businesspartner/contact/listbybusinesspartnerid', pbContactParam).then(function (data) {
						bpMainContactDataService.incorporateDataRead(data.data);
						bpMainContactDataService.setSelected(_.find(data.data.Main, {Id: pbMainContactSeletedItem.Id}));
					}, function () {
					});
				} else if ($scope.modalOptions.contextType === 'user') {
					usermanagementUserMainService.refresh();
				}
			}

		}
	]);
})();