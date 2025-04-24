/**
 * Created by chd on 4/27/2022.
 */
(function (angular) {
	'use strict';
	/* global Slick */

	/**
	 * @ngdoc controller
	 * @name basicsMeetingAttendeeLookupController
	 * @require $scope
	 * @description controller for basics meeting attendee lookup dialog
	 */
	angular.module('basics.meeting').controller('basicsMeetingAttendeeLookupController',
		['_', '$scope', 'globals', '$http', 'platformGridAPI', '$translate', 'lookupPageSizeService', 'basicsLookupdataLookupViewService', 'basicsLookupdataLookupDataService',
			'basicsMeetingCreateService', 'platformRuntimeDataService', 'platformGridDomainService', 'platformTranslateService',
			function (_, $scope, globals, $http, platformGridAPI, $translate, lookupPageSizeService, basicsLookupdataLookupViewService, lookupDataService,
				basicsMeetingCreateService, platformRuntimeDataService, platformGridDomainService, platformTranslateService) {

				let isLookupClerk = true;
				let page = null;
				let selectedItemIds = [];
				let options = $scope.options;
				let lookupType = options.lookupType;
				if (lookupType === 'contact') {
					isLookupClerk = false;
				}

				$scope.searchValue = '';
				$scope.isLoading = false;
				$scope.isLookupClerk = isLookupClerk;
				$scope.attendeeGridData = [];
				$scope.gridId = 'bb9914ec59264d00905329e72d8b510b';
				$scope.gridData = {
					state: $scope.gridId
				};

				$scope.modalOptions = {
					headerText: $translate.instant('basics.meeting.dialogTitleClerk'),
					copyFromContext: $translate.instant('basics.meeting.copyFromContext'),
					contactFromBp: $translate.instant('basics.meeting.contactFromBp'),
					fromCopyFromContext: false,
					clerkCheckText: $translate.instant('basics.meeting.entityClerk'),
					cancelButtonText: $translate.instant('cloud.common.cancel'),
					addButtonText: $translate.instant('basics.meeting.add'),
					isValid: function isValid() {
						return $scope.attendeeGridData.length > 0;
					}
				};

				if (!isLookupClerk) {
					$scope.modalOptions.headerText = $translate.instant('basics.meeting.dialogTitleContact');

					if ($scope.options.dataView === undefined) {
						$scope.options.dataView = new basicsLookupdataLookupViewService.LookupDataView();
						$scope.options.dataView.dataPage.size = 100;
						$scope.options.dataView.dataProvider = lookupDataService.registerDataProviderByType('contact');
					}
					page = $scope.options.dataView.dataPage;

					$scope.settings = {
						Bp: {
							selectedValue: -1,
							options: {
								items: [],
								valueMember: 'Id',
								displayMember: 'BusinessPartnerName1',
								inputDomain: 'description',
								selected: '',
								showClearButton: true
							}
						}};

					selectedItemIds = basicsMeetingCreateService.getSelectedContacts();
				}
				else {
					selectedItemIds = basicsMeetingCreateService.getSelectedClerks();
				}

				function getClerkColumns() {
					return [
						{
							id: 'code',
							name: 'Code',
							name$tr$: 'cloud.common.entityCode',
							field: 'Code',
							width: 100,
							sortable: true
						},
						{
							id: 'title',
							name: 'Title',
							name$tr$: 'basics.clerk.entityTitle',
							field: 'Title',
							width: 150,
							sortable: true
						},
						{
							id: 'description',
							name: 'Description',
							name$tr$: 'cloud.common.entityDescription',
							field: 'Description',
							width: 150,
							sortable: true
						},
						{
							id: 'firstname',
							name: 'First Name',
							name$tr$: 'cloud.common.contactFirstName',
							field: 'FirstName',
							width: 150,
							sortable: true
						},
						{
							id: 'familyname',
							name: 'Family Name',
							name$tr$: 'cloud.common.contactFamilyName',
							field: 'FamilyName',
							width: 150,
							sortable: true
						},
						{
							id: 'email',
							name: 'E-Mail',
							name$tr$: 'cloud.common.email',
							field: 'Email',
							width: 150,
							sortable: true
						},
						{
							id: 'telephonenumber',
							name: 'Phone Number',
							name$tr$: 'cloud.common.telephoneNumber',
							field: 'TelephoneNumber',
							width: 150,
							sortable: true
						},
						{
							id: 'telephonemobil',
							name: 'Mobile',
							name$tr$: 'cloud.common.mobile',
							field: 'TelephoneMobil',
							width: 150,
							sortable: true
						},
						{
							id: 'department',
							name: 'Department',
							name$tr$: 'cloud.common.entityDepartment',
							field: 'Department',
							width: 150,
							sortable: true
						},
						{
							id: 'company',
							name: 'Company',
							name$tr$: 'cloud.common.entityCompany',
							field: 'Company',
							width: 150,
							sortable: true
						},
						{
							id: 'address',
							name: 'Address',
							name$tr$: 'cloud.common.address',
							field: 'Address',
							width: 150,
							sortable: true
						},
						{
							id: 'signature',
							name: 'Signature',
							name$tr$: 'basics.clerk.entitySignature',
							field: 'Signature',
							width: 150,
							sortable: true
						},
						{
							id: 'remark',
							name: 'Remark',
							name$tr$: 'cloud.common.DocumentBackup_Remark',
							field: 'Remark',
							width: 150,
							sortable: true
						}
					];
				}

				function getContactColumns() {
					return [
						{
							id: 'FirstName',
							field: 'FirstName',
							name: 'FirstName',
							name$tr$: 'businesspartner.main.firstName',
							width: 100,
							sortable: true
						},
						{
							id: 'FamilyName',
							field: 'FamilyName',
							name: 'FamilyName',
							name$tr$: 'businesspartner.main.familyName',
							width: 100,
							sortable: true
						},
						{id: 'Title', field: 'Title', name: 'Title', name$tr$: 'businesspartner.main.title', width: 100,sortable: true},
						{
							id: 'Telephone1',
							field: 'Telephone1',
							name: 'Telephone',
							name$tr$: 'businesspartner.main.telephoneNumber',
							width: 100,
							sortable: true
						},
						{
							id: 'Telephone2',
							field: 'Telephone2',
							name: 'Other Tel.',
							name$tr$: 'businesspartner.main.telephoneNumber2',
							width: 100,
							sortable: true
						},
						{
							id: 'Telefax',
							field: 'Telefax',
							name: 'Telefax',
							name$tr$: 'businesspartner.main.telephoneFax',
							width: 100,
							sortable: true
						},
						{
							id: 'Mobile',
							field: 'Mobile',
							name: 'Mobile',
							name$tr$: 'businesspartner.main.mobileNumber',
							width: 100,
							sortable: true
						},
						{
							id: 'Internet',
							field: 'Internet',
							name: 'Internet',
							name$tr$: 'businesspartner.main.internet',
							width: 100,
							sortable: true
						},
						{id: 'Email', field: 'Email', name: 'Email', name$tr$: 'businesspartner.main.email', width: 100,sortable: true},
						{
							id: 'Description',
							field: 'Description',
							name: 'Description',
							name$tr$: 'cloud.common.entityDescription',
							width: 120,
							sortable: true
						},
						{
							id: 'AddressLine',
							field: 'AddressLine',
							name: 'Address',
							name$tr$: 'cloud.common.entityAddress',
							width: 120,
							sortable: true
						},
						{
							id: 'ContactRoleFk', field: 'ContactRoleFk', name: 'Role', name$tr$: 'businesspartner.main.role', width: 120,
							sortable: true,
							formatter: 'lookup',
							formatterOptions: {
								lookupSimpleLookup: true,
								lookupModuleQualifier: 'businesspartner.contact.role',
								displayMember: 'Description',
								valueMember: 'Id'
							}
						}
					];
				}

				let extraColumns = [
					{
						id: 'Selected',
						field: 'Selected',
						headerChkbox: true,
						name: 'Selected',
						name$tr$: 'cloud.common.entitySelected',
						editor: 'boolean',
						formatter: 'boolean',
						width: 80
					}
				];

				let layoutUIGridColumns = [];
				if (isLookupClerk) {
					layoutUIGridColumns = getClerkColumns();
				}else {
					layoutUIGridColumns = getContactColumns();
				}

				let columns = [];
				_.forEach(layoutUIGridColumns, function (item) {
					if (item.editor!=='select') {
						let column={
							id: item.id,
							field: item.field,
							formatter: item.formatter,
							formatterOptions: item.formatterOptions,
							name: item.name,
							name$tr$: item.name$tr$,
							name$tr$param$: item.name$tr$param$,
							readonly: true,
							grouping: item.grouping,
							sortable: item.sortable
						};
						columns.push(column);
					}
				});

				let gridColumns = _.concat(extraColumns, columns);
				let extendGridColumns = platformTranslateService.translateGridConfig(extendGrouping(gridColumns));
				let gridConfig = {
					columns: angular.copy(extendGridColumns),
					data: [],
					id: $scope.gridId,
					gridId: $scope.gridId,
					lazyInit: true,
					options: {
						skipPermissionCheck: true,
						tree: false,
						indicator: true,
						idProperty: 'Id',
						iconClass: '',
						grouping: true,
						multiSelect: false,
						enableDraggableGroupBy: true,
						enableModuleConfig: true,
						enableConfigSave: true,
						editorLock: new Slick.EditorLock()
					}
				};

				if (!platformGridAPI.grids.exist($scope.gridId)) {
					platformGridAPI.grids.config(gridConfig);
					platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);
					platformGridAPI.events.register($scope.gridId, 'onHeaderCheckboxChanged', checkAll);
				}else {
					platformGridAPI.columns.configuration($scope.gridId, angular.copy(gridColumns));
				}

				function setTools(tools) {
					$scope.tools = tools || {};
				}

				setTools(
					{
						showImages: true,
						showTitles: true,
						cssClass: 'tools',
						version: Math.random(),
						update: function () {
							$scope.tools.version += 1;
						},
						items: [
							{
								id: 't16',
								sort: 10,
								caption: 'cloud.common.taskBarGrouping',
								type: 'check',
								iconClass: 'tlb-icons ico-group-columns',
								fn: function () {
									platformGridAPI.grouping.toggleGroupPanel($scope.gridId, this.value);
								},
								value: platformGridAPI.grouping.toggleGroupPanel($scope.gridId),
								disabled: false
							},
							{
								id: 't111',
								sort: 111,
								caption: 'cloud.common.gridlayout',
								iconClass: 'tlb-icons ico-settings',
								type: 'item',
								fn: function () {
									platformGridAPI.configuration.openConfigDialog($scope.gridId);
								}
							}
						]
					});

				function checkAll(e) {
					$scope.$apply(function () {
						onCellChange(e.target.checked);
					});
				}

				function onCellChange() {
					$scope.attendeeGridData = [];
					let gridData = platformGridAPI.items.data($scope.gridId);

					let items = _.filter(gridData, function (item) {
						let isReadonlyItem = item.__rt$data && item.__rt$data.readonly && _.find(item.__rt$data.readonly, {field: 'Selected', readonly: true});
						if (isReadonlyItem) {  // If readonly, keep the item selected.
							item.Selected = true;
						}
						return item.Selected && !isReadonlyItem;
					});

					_.forEach(items, function (item) {
						$scope.attendeeGridData.push(item);
					});
				}

				function extendGrouping(gridColumns) {
					angular.forEach(gridColumns, function (column) {
						angular.extend(column, {
							grouping: {
								title: column.name$tr$, getter: column.field, aggregators: [], aggregateCollapsed: true
							}, formatter: column.formatter || platformGridDomainService.formatter('description')
						});
					});
					return gridColumns;
				}

				$scope.copyFromContext = function () {
					$scope.modalOptions.fromCopyFromContext = true;
					getSearchList();
				};

				$scope.onSearchInputKeydown = function (e,searchValue){
					if (e.keyCode !== 13) return;
					$scope.onSearch(searchValue);
				};

				$scope.onSearch = function (searchValue) {
					$scope.modalOptions.fromCopyFromContext = false;
					if (!isLookupClerk) {
						page.number = 0;
					}

					getSearchList(searchValue);
				};

				function getSearchList(searchValue) {
					$scope.isLoading = true;

					if (isLookupClerk) {
						let request = null;

						if ($scope.modalOptions.fromCopyFromContext) {
							let contextClerks = basicsMeetingCreateService.getClerkFromContext();
							request = {
								SearchValue: null,
								ClerkIds: contextClerks,
								IsFromContext: true
							};
						}else {
							request = {
								SearchValue: searchValue,
								ClerkIds: null,
								IsFromContext: false
							};
						}

						$http.post(globals.webApiBaseUrl + 'basics/meeting/wizard/attendeeclerklookup', request).then(function (res) {
							if (res.data) {
								setGridData(res.data);
								platformGridAPI.items.data($scope.gridId, res.data);
							}else {
								platformGridAPI.items.data($scope.gridId, []);
							}
							onCellChange();
							$scope.tools.update();
						}, function () {
							$scope.isLoading = false;
						}).finally(function () {
							$scope.isLoading = false;
						});

					}else {
						lookupPageSizeService.getPageSizeAsync().then(function (pageSize) {
							page.size = pageSize;

							let businessPartnerFk = null, contactContext = null, IsFilterByContext = false;
							if ($scope.modalOptions.fromCopyFromContext) {
								contactContext = basicsMeetingCreateService.getContactFromContext();
								$scope.settings.Bp.selectedValue = basicsMeetingCreateService.getBPFromContext();
								IsFilterByContext = true;
							}

							if ($scope.settings.Bp.selectedValue !== -1) {
								businessPartnerFk = $scope.settings.Bp.selectedValue;
							}
							let searchRequest = {
								AdditionalParameters: {BusinessPartnerFk: businessPartnerFk, ContactIds: contactContext, IsFilterByContext: IsFilterByContext},
								FilterKey: 'meeting-attendee-contact-filter',
								PageState: {PageNumber: page.number, PageSize: page.size},
								SearchFields: ['FullName', 'FirstName', 'FamilyName', 'Telephone1', 'Telephone2', 'Telefax', 'Mobile', 'Email', 'ContactRoleFk'],
								SearchText: searchValue,
								TreeState: {StartId: null, Depth: null},
								RequirePaging: page.enabled
							};

							$http.post(globals.webApiBaseUrl + 'basics/lookupdata/masternew/getsearchlist?lookup=contact', searchRequest).then(function (res) {
								let totalLength = res.data.RecordsFound;
								page.currentLength = page.totalLength = totalLength;
								page.count = Math.ceil(page.totalLength / page.size);

								if (res.data && res.data.SearchList) {
									setGridData(res.data.SearchList);
									platformGridAPI.items.data($scope.gridId, res.data.SearchList);
								}
								else {
									platformGridAPI.items.data($scope.gridId, []);
								}
								$scope.tools.update();
							}, function () {
								$scope.isLoading = false;
							}).finally(function () {
								$scope.isLoading = false;
							});
						}, function () {
							// TODO: react to error
							$scope.isLoading = false;
						});
					}
				}

				function setGridData(data) {
					setGridChecked(data, selectedItemIds);

					function setGridChecked(gridData, selectedItemIds) {
						let hasTrueValue = false;
						let hasFalseValue = false;

						_.forEach(gridData, function (gridItem) {
							if (selectedItemIds.includes(gridItem.Id)) {
								hasTrueValue = true;
								gridItem.Selected = true;
								platformRuntimeDataService.readonly(gridItem, [{
									field: 'Selected',
									readonly: true
								}]);
							} else {
								hasFalseValue = true;
								gridItem.Selected = false;
								platformRuntimeDataService.readonly(gridItem, [{
									field: 'Selected',
									readonly: false
								}]);
							}
						});

						let checkboxElement = document.querySelectorAll('[id^=chkbox_slickgrid]');
						if (checkboxElement.length === 1) {
							checkboxElement[0].checked = !hasFalseValue && gridData.length; // Whether all checkboxes are checked
							checkboxElement[0].indeterminate = hasTrueValue && hasFalseValue; // Whether some checkboxes are selected
						}
					}
				}

				$scope.pageUp = function () {
					if (page.number <= 0) {
						return;
					}
					page.number--;
					getSearchList($scope.searchValue);
				};

				$scope.canPageUp = function () {
					return page.number > 0;
				};

				$scope.getPageText = function () {
					let startIndex = page.number * page.size,
						endIndex = ((page.count - (page.number + 1) > 0 ? startIndex + page.size : page.totalLength));
					if ($scope.searchValueModified === undefined) {
						if (page.totalLength > 0) {
							return (startIndex + 1) + ' - ' + endIndex + ' / ' + page.totalLength;
						}
						return '';
					}
					if ($scope.isLoading) {
						return $translate.instant('cloud.common.searchRunning');
					}
					if (page.currentLength === 0) {
						return $translate.instant('cloud.common.noSearchResult');
					}
					return (startIndex + 1) + ' - ' + endIndex + ' / ' + page.totalLength;
				};

				$scope.pageDown = function () {
					if (page.count <= page.number) {
						return;
					}
					page.number++;
					getSearchList($scope.searchValue);
				};

				$scope.canPageDown = function () {
					return page.count > (page.number + 1);
				};

				$scope.modalOptions.add = function onAdd() {
					$scope.$close({
						isOk: true,
						selectedItem: $scope.attendeeGridData
					});
				};

				$scope.modalOptions.close = function onCancel() {
					$scope.$close(false);
				};

				$scope.modalOptions.cancel = $scope.modalOptions.close;

				$scope.$on('$destroy', function () {
					platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellChange);
					platformGridAPI.events.unregister($scope.gridId, 'onHeaderCheckboxChanged', checkAll);

					if (platformGridAPI.grids.exist($scope.gridId)) {
						platformGridAPI.grids.unregister($scope.gridId);
					}
				});
				$scope.ativeFromContextButtonForClerk = function ativeFromContextButtonForClerk () {
					return basicsMeetingCreateService.getClerkCopyFromContextStatus();
				};
				$scope.ativeFromContextButtonForContact = function ativeFromContextButtonForContact () {
					return basicsMeetingCreateService.getContactCopyFromContextStatus();
				};
			}]);
})(angular);