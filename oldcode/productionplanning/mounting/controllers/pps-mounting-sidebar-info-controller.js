/**
 * Created by hog on 14.12.2017.
 */
(function () {
	'use strict';

	function productionPlanningMountingSidebarInfoController($scope, $http, $translate, $q, $injector,
		mountingReservationService,
		cloudDesktopSidebarInfoControllerService,
		mountingReservationInfoConfigItems,
		basicsLookupdataLookupDescriptorService,
		basicsLookupdataSimpleLookupService,
		platformDataProcessExtensionHistoryCreator,
		platformModalFormConfigService,
		platformTranslateService) {

		$scope.settings = {};
		$scope.settings.detailOptions = $injector.get('businessPartnerContactDetailOptions');
		$scope.openDetailDialog = function (item) {
			if (!$scope.settings.detailOptions.uiStandardService) {
				return;
			}

			$scope.displayItem = item.BusinessPartnerContact;

			var uiStandardService = $scope.settings.detailOptions.uiStandardService;
			if (angular.isString(uiStandardService)) {
				uiStandardService = $injector.get(uiStandardService);
			}

			if (!uiStandardService) {
				return;
			}

			var isEditable = $scope.settings.detailOptions.isEditable;
			var config = {};
			config.title = $translate.instant('cloud.common.details');
			config.showCancelButton = isEditable;
			if ($scope.settings.detailOptions.detailConverter && _.isFunction($scope.settings.detailOptions.detailConverter)) {
				$scope.settings.detailOptions.detailConverter($scope.displayItem).then(function (item) {
					config.dataItem = item;
					openDetailFormDialog(config, uiStandardService, isEditable);
				});
			} else {
				config.dataItem = $scope.displayItem;
				openDetailFormDialog(config, uiStandardService, isEditable);
			}
		};

		/**
		 * @description: open detail form dialog view.
		 */
		function openDetailFormDialog(config, uiStandardService, isEditable) {
			platformDataProcessExtensionHistoryCreator.processItem(config.dataItem);
			config.formConfiguration = provideDetailForm(uiStandardService, !isEditable);
			platformModalFormConfigService.showDialog(config, false).then(function (result) {
				if (result.ok && isEditable) {
					var dataService = $scope.settings.detailOptions.dataService;
					if (angular.isString(dataService)) {
						dataService = $injector.get(dataService);
					}
					dataService.update(result.data);
				}
			});
		}

		function provideDetailForm(uiStandardService, readonly) {
			var formLayout = _.cloneDeep(uiStandardService.getStandardConfigForDetailView());
			var myLayout = {
				fid: 'data.service.detailForm',
				version: '0.0.1',
				showGrouping: true,
				groups: [],
				rows: []
			};

			_.forEach(formLayout.groups, function (group) {
				var newGroup = {};
				_.extend(newGroup, group);
				myLayout.groups.push(newGroup);
			});

			var index = 1;
			var readonlyFields = $scope.settings.detailOptions.readonlyFields;
			_.forEach(formLayout.rows, function (row) {
				var newRow = {};
				_.extend(newRow, row);
				newRow.sortOrder = index;
				newRow.readonly = row.readonly || readonly ||
					(_.findIndex(readonlyFields, function (f) {
						return f.toLowerCase() === row.rid;
					}) >= 0);
				++index;

				myLayout.rows.push(newRow);
			});

			platformTranslateService.translateFormConfig(myLayout);

			return myLayout;
		}

		// configs
		var dataConfig = [
			{
				dataService: mountingReservationService,
				selectedItem: 'mountingReservationCommonItem'
			}
		];

		var configBpContactRole = {
			valueMember: 'Id',
			displayMember: 'Description',
			lookupModuleQualifier: 'basics.customize.projectcontractroletype'
		};

		$scope.config = mountingReservationInfoConfigItems;

		// Header
		$scope.getFirstHeader = function () {
			if ($scope.mountingReservationCommonItem) {
				return $scope.mountingReservationCommonItem.Description;
			}
		};

		// Businesspartner Header
		$scope.getBusinessPartnerHeader = function () {
			return $translate.instant('productionplanning.mounting.contact');
		};

		// event register
		mountingReservationService.registerSelectionChanged(selectionChanged);

		// businesspartner slider
		var businessPartnerIndex = 0;
		var businessPartnerMaxIndex = 0;
		var entityReference;

		function selectionChanged(e, entity) {
			if (entity && entity.Requisition && entity.Requisition.Id) {
				entity.BusinessPartnerContactItems = [];

				let bizPartnerData = [], contactData = [], contact2BizArray = [];

				$q.all([$http.get(globals.webApiBaseUrl + 'productionplanning/mounting/requisition/getmntreqbyresreqid?ResReqFk=' + entity.Requisition.Id)])
					.then(function (response) {
						if (response[0].data && !_.isNull(response[0].data)) {
							return $q.all([$http.get(globals.webApiBaseUrl + 'productionplanning/common/bizpartner/list?projectId=' + response[0].data.ProjectFk + '&ppsHeaderId=' + response[0].data.PpsHeaderFk + '&mntreqId=' + response[0].data.Id)]);
						}
					})
					.then(function (bizResponse) {
						let promises = [];
						if (bizResponse && bizResponse[0].data && bizResponse[0].data.length > 0) {
							_.forEach(bizResponse[0].data, function (partner) {
								bizPartnerData.push(partner);
								promises.push($http.get(globals.webApiBaseUrl + 'productionplanning/common/contact/list?mainItemId=' + partner.Id));
							});
						}
						return $q.all(promises);
					})
					.then(function (contact2BizResponses) {
						let promises = [];
						if (contact2BizResponses) {
							_.forEach(contact2BizResponses, function (contact2BizResponse) {
								if (contact2BizResponse.data && contact2BizResponse.data.length > 0) {
									_.forEach(contact2BizResponse.data, function (contact2Biz) {
										contact2BizArray.push(contact2Biz);
										promises.push($http.get(globals.webApiBaseUrl + 'businesspartner/contact/getbyid?id=' + contact2Biz.ContactFk));
									});
								}
							});
						}
						return $q.all(promises);
					}).then(function (contacts){
						let promises = [];
						if (contacts) {
							_.forEach(contacts, function (contact) {
								contact.data.BusinessPartner = _.find(bizPartnerData, function (partner) {
									return partner.BusinessPartnerFk === contact.data.BusinessPartnerFk;
								});
								contact.data.ContactRoleTypeFk = contact2BizArray.filter(contact2Biz => contact2Biz.ContactFk === contact.data.Id)[0].RoleTypeFk;
								contactData.push(contact.data);
								promises.push(basicsLookupdataSimpleLookupService.getItemById(contact.data.ContactRoleTypeFk, configBpContactRole));
							});
						}
						return $q.all(promises);
					})
					.then(function (roles) {
						roles = roles.filter(r => r);
						_.forEach(contactData, function (contact) {
							let contactRole = _.find(roles, function (role) {
								return role.Id === contact.ContactRoleTypeFk;
							});
							contact.RoleType = !_.isUndefined(contactRole) ? contactRole.Description : null;
						});

						entity.BusinessPartnerContactItems = _.clone(contactData);

						businessPartnerIndex = 0;
						businessPartnerMaxIndex = entity.BusinessPartnerContactItems.length - 1;

						entity.BusinessPartnerContact = entity.BusinessPartnerContactItems[0];
						entityReference = entity;
						return entityReference;
					});
			}
		}

		mountingReservationService.goToNext = function goToNext() {
			businessPartnerIndex = (businessPartnerIndex > businessPartnerMaxIndex) ? businessPartnerMaxIndex : businessPartnerIndex + 1;
			entityReference.BusinessPartnerContact = entityReference.BusinessPartnerContactItems[businessPartnerIndex];
		};

		mountingReservationService.goToPrev = function goToPrev() {
			businessPartnerIndex = (businessPartnerIndex < 0) ? 0 : businessPartnerIndex - 1;
			entityReference.BusinessPartnerContact = entityReference.BusinessPartnerContactItems[businessPartnerIndex];
		};

		mountingReservationService.disablePrev = function disablePrev() {
			return businessPartnerIndex <= 0;
		};

		mountingReservationService.disableNext = function disableNext() {
			return businessPartnerIndex >= businessPartnerMaxIndex;
		};

		// init sidebar
		cloudDesktopSidebarInfoControllerService.init($scope, dataConfig);

		// clear up
		$scope.$on('$destroy', function () {
			mountingReservationService.unregisterSelectionChanged(selectionChanged);
		});
	}

	angular.module('productionplanning.mounting').controller('productionPlanningMountingSidebarInfoController', ['$scope', '$http', '$translate', '$q', '$injector',
		'mountingReservationService',
		'cloudDesktopSidebarInfoControllerService',
		'mountingReservationInfoConfigItems',
		'basicsLookupdataLookupDescriptorService',
		'basicsLookupdataSimpleLookupService',
		'platformDataProcessExtensionHistoryCreator',
		'platformModalFormConfigService',
		'platformTranslateService',
		'basicsLookupdataConfigGenerator',
		productionPlanningMountingSidebarInfoController])
		.value('mountingReservationInfoConfigItems', [
			{
				panelType: 'text',
				header: 'getFirstHeader()',
				model: 'mountingReservationCommonItem',
				items: [
					{
						model: 'Requisition.Project.ProjectName',
						iconClass: 'app-small-icons ico-project',
						description: '"Project Name"',
						domain: 'text'
					},
					{
						model: 'Requisition.Project.ProjectNo',
						iconClass: 'app-small-icons ico-project-boq',
						description: '"Project No"',
						domain: 'text',
						navigator: {
							moduleName: 'project.main',
							targetIdProperty: 'Id'
						}
					}, {
						model: 'RequisitionPrjAddress.Address',
						iconClass: 'app-small-icons ico-country',
						description: '"Project Address"',
						domain: 'text'
					},
					{
						model: 'Comment',
						iconClass: 'app-small-icons ico-estimate-rules',
						description: '"Comment Text"',
						domain: 'text'
					},
					{
						model: 'ReservedFrom',
						iconClass: 'tlb-icons ico-date',
						description: '"Reserved From"',
						domain: 'datetime'
					},
					{
						model: 'ReservedTo',
						iconClass: 'tlb-icons ico-date',
						description: '"Reserved To"',
						domain: 'datetime'
					},
					{
						model: 'QuantityWithUom',
						iconClass: 'tlb-icons ico-pie-chart',
						description: '"Reserved Quantity"',
						domain: 'text'
					},
					{
						model: 'Requisition.RequestedFrom',
						iconClass: 'tlb-icons ico-date',
						description: '"Requested From"',
						domain: 'datetime'
					},
					{
						model: 'Requisition.RequestedTo',
						iconClass: 'tlb-icons ico-date',
						description: '"Requested To"',
						domain: 'datetime'
					},
					{
						model: 'Requisition.QuantityWithUom',
						iconClass: 'tlb-icons ico-pie-chart',
						description: '"Requested Quantity"',
						domain: 'text'
					},
					{
						model: 'Requisition.CommentText',
						iconClass: 'app-small-icons ico-estimate-rules',
						description: '"Comment Text"',
						domain: 'comment'
					}
				]
			},
			{
				panelType: 'text',
				header: 'getBusinessPartnerHeader()',
				model: 'mountingReservationCommonItem',
				dataService: 'mountingReservationService',
				showSlider: true,
				items: [
					{
						model: 'BusinessPartnerContact.BusinessPartner.BusinessPartnerName1',
						iconClass: 'app-icons ico-business-partner',
						description: '"*Businesspartner"',
						description$tr$: 'productionplanning.mounting.businesspartner',
						itemType: 'text'
					},
					{
						model: 'BusinessPartnerContact.FullName',
						iconClass: 'app-icons ico-business-partner',
						description: '"*Contact"',
						description$tr$: 'productionplanning.mounting.contact',
						itemType: 'text'
					},
					{
						itemType: 'phone',
						model: 'BusinessPartnerContact.TelephoneNumberDescriptor.Telephone',
						description: '"Work"',
						description$tr$: 'cloud.common.sidebarInfoDescription.work'
					},
					{
						itemType: 'phone',
						model: 'BusinessPartnerContact.MobileDescriptor.Telephone',
						description: '"Mobile"',
						description$tr$: 'cloud.common.sidebarInfoDescription.mobile'
					},
					{
						itemType: 'email',
						model: 'BusinessPartnerContact.Email'
					},
					{
						model: 'BusinessPartnerContact.RoleType',
						iconClass: 'app-icons ico-employee',
						description: '"*Role Type"',
						description$tr$: 'productionplanning.header.entityContactRoleTypeFk',
						itemType: 'text'
					},
					{
						model: 'BusinessPartnerContact.Remark',
						iconClass: 'control-icons ico-domain-comment',
						description: '"*Remark"',
						description$tr$: 'productionplanning.mounting.businesspartnerContactRemark',
						itemType: 'text'
					},
					{
						itemType: 'custom',
						model: 'BusinessPartnerContact.Id',
						customTemplate: '<div class="marginBottom flex-box ng-scope"><button class="btn btn-default input-sm" ng-click="openDetailDialog(mountingReservationCommonItem)">' +
							'<div class="control-icons ico-input-lookup lookup-ico-dialog">&nbsp;</div>' +
							'</button></div>'
					}
				]
			}
		]);
})();