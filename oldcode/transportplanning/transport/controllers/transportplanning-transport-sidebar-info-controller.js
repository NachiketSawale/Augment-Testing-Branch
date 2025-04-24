/**
 * Created by mik on 2/11/2018.
 */

(function () {
	'use strict';
	/*global _*/
	function transportPlanningTransportSidebarInfoController($scope,
															 $http,
															 $translate,
															 $injector,
															 transportplanningTransportMainService,
															 cloudDesktopSidebarInfoControllerService,
															 transportInfoConfigItems,
															 basicsLookupdataLookupDescriptorService,
															 platformModalFormConfigService,
															 platformTranslateService,
															 platformDataProcessExtensionHistoryCreator,
															 basicsLookupdataSimpleLookupService) {

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



		var dataConfig = [
			{
				dataService: transportplanningTransportMainService,
				selectedItem: 'transportCommonItem'
			}
		];

		$scope.config = transportInfoConfigItems;
		$scope.settings = {};
		$scope.settings.detailOptions = $injector.get('businessPartnerContactDetailOptions');

		//Header
		$scope.getFirstHeader = function () {
			if ($scope.transportCommonItem) {
				var header = 'Project';
				if($scope.transportCommonItem.Code !== '') {
					header = $scope.transportCommonItem.Code;
				}
				if($scope.transportCommonItem.DescriptionInfo.Description) {
					header += ' - ' + $scope.transportCommonItem.DescriptionInfo.Description;
				}
				return header;
			}
		};

		//Project
		$scope.$watch('transportCommonItem.ProjectDefFk', function() {
			if($scope.transportCommonItem) {
				$scope.transportCommonItem.ProjectItem = basicsLookupdataLookupDescriptorService.getLookupItem('Project', $scope.transportCommonItem.ProjectDefFk);
			}
		});

		//Job
		$scope.$watch('transportCommonItem.LgmJobFk', function() {
			if($scope.transportCommonItem && $scope.transportCommonItem.JobDefFk) {
				$http.get(globals.webApiBaseUrl + 'logistic/job/getbyid?jobId=' + $scope.transportCommonItem.JobDefFk).then(function (respond) {
					$scope.transportCommonItem.JobDefItem = respond.data;
				});
			}
		});

		// Waypoints
		$scope.$watch('transportCommonItem.Waypoints', function () {
			if($scope.transportCommonItem && $scope.transportCommonItem.Waypoints) {
				$.each($scope.transportCommonItem.Waypoints, function (idx,val) {
					if(val.IsDefaultDst) {
						$scope.transportCommonItem.Waypoints.IsDefaultDst = $scope.transportCommonItem.Waypoints[idx];
						$scope.transportCommonItem.BusinessPartnerItem = basicsLookupdataLookupDescriptorService.getLookupItem('businesspartner', $scope.transportCommonItem.Waypoints.IsDefaultDst.BusinessPartnerFk);
						if($scope.transportCommonItem.Waypoints.IsDefaultDst.PlannedTime) {
							var plannedTime = $scope.transportCommonItem.Waypoints.IsDefaultDst.PlannedTime.replace('T',' ');
							$scope.transportCommonItem.Waypoints.IsDefaultDst.PlannedTime = plannedTime.slice(0, plannedTime.lastIndexOf(':'));
						}
					}
				});
			}
		});

		$scope.getContactHeader = function () {
			if($scope.transportCommonItem && $scope.transportCommonItem.DeliveryAddressContactFk) {
				$scope.transportCommonItem.ContactItem = basicsLookupdataLookupDescriptorService.getLookupItem('contact', $scope.transportCommonItem.DeliveryAddressContactFk);
				$scope.transportCommonItem.BusinessPartnerItemOfDefJob = basicsLookupdataLookupDescriptorService.getLookupItem('businesspartner', $scope.transportCommonItem.BusinessPartnerFk); // add for HP-ALM #123232 by zwz on 2022/03/30
			}

			return $translate.instant('transportplanning.transport.contacts');
		};

		// Package Header
		$scope.getPackageHeader = function () {
			if ($scope.transportCommonItem && $scope.transportCommonItem.Package) {
				return ($scope.transportCommonItem.Package.Code !== '') ? $scope.transportCommonItem.Package.Code : 'Package';
			}
		};

		cloudDesktopSidebarInfoControllerService.init($scope, dataConfig);

		// business partner
		var businessPartnerIndex = 0;
		var businessPartnerMaxIndex = 0;
		var entityReference;
		var configBpContactRole = {
			valueMember: 'Id',
			displayMember: 'Description',
			lookupModuleQualifier: 'businesspartner.contact.role'
		};

		transportplanningTransportMainService.goToNext = function goToNext() {
			businessPartnerIndex = (businessPartnerIndex > businessPartnerMaxIndex) ? businessPartnerMaxIndex : businessPartnerIndex+1;
			entityReference.BusinessPartnerContact = entityReference.BusinessPartnerContacts[businessPartnerIndex];
			basicsLookupdataSimpleLookupService.getItemById(entityReference.BusinessPartnerContact.ContactRoleFk, configBpContactRole).then(function(item) {
				entityReference.BusinessPartnerContact.Role = item.Description;
			});
		};

		transportplanningTransportMainService.goToPrev = function goToPrev() {
			businessPartnerIndex = (businessPartnerIndex < 0) ? 0 : businessPartnerIndex-1;
			entityReference.BusinessPartnerContact = entityReference.BusinessPartnerContacts[businessPartnerIndex];
			basicsLookupdataSimpleLookupService.getItemById(entityReference.BusinessPartnerContact.ContactRoleFk, configBpContactRole).then(function(item) {
				entityReference.BusinessPartnerContact.Role = item.Description;
			});
		};

		transportplanningTransportMainService.disablePrev = function disablePrev() {
			return businessPartnerIndex <= 0;
		};

		transportplanningTransportMainService.disableNext = function disableNext() {
			return businessPartnerIndex >= businessPartnerMaxIndex;
		};

		function selectionChanged(e, entity) {
			if (!_.isNil(entity)) {
				// set businesspartner contacts
				entity.BusinessPartnerContact = [];
				if(!_.isUndefined(entity.BusinessPartnerFk) && !_.isNull(entity.BusinessPartnerFk)) {
					var pbContactParam = {Value: entity.BusinessPartnerFk, filter: ''};
					$http.post(globals.webApiBaseUrl + 'businesspartner/contact/listbybusinesspartnerid', pbContactParam).then(function (data) {
						if(data.data.Main) {
							businessPartnerIndex = 0;
							businessPartnerMaxIndex = data.data.Main.length - 1;

							var deliveryContactIndex =_.findIndex(data.data.Main, function(main) {
								return main.Id === entity.DeliveryAddressContactFk;
							});

							if(deliveryContactIndex > -1) {
								var deliveryContactItem = _.pullAt(data.data.Main, [deliveryContactIndex]);
								data.data.Main.unshift(deliveryContactItem[0]);
							}
							if(data.data.Main[0] && data.data.Main[0].ContactRoleFk) {
								basicsLookupdataSimpleLookupService.getItemById(data.data.Main[0].ContactRoleFk, configBpContactRole).then(function(item) {
									data.data.Main[0].Role = item.Description;
								});
							}
							entity.BusinessPartnerContact = data.data.Main[0];
							entity.BusinessPartnerContacts = data.data.Main;
							entityReference = entity;
						}
					});
				}
			}
		}

		// event register
		transportplanningTransportMainService.registerSelectionChanged(selectionChanged);

		// clear up
		$scope.$on('$destroy', function () {
			transportplanningTransportMainService.unregisterSelectionChanged(selectionChanged);
		});
	}

	var moduleName = 'transportplanning.transport';

	angular.module(moduleName).controller('transportPlanningTransportSidebarInfoController',
		['$scope', '$http', '$translate', '$injector',
			'transportplanningTransportMainService',
			'cloudDesktopSidebarInfoControllerService',
			'transportInfoConfigItems',
			'basicsLookupdataLookupDescriptorService',
			'platformModalFormConfigService',
			'platformTranslateService',
			'platformDataProcessExtensionHistoryCreator',
			'basicsLookupdataSimpleLookupService',
			transportPlanningTransportSidebarInfoController]).value('transportInfoConfigItems', [
		{
			panelType: 'text',
			header: 'getFirstHeader()',
			model: 'transportCommonItem',
			items: [
				{
					model: 'ProjectItem.ProjectName',
					iconClass: 'app-small-icons ico-project',
					description: '"Default Client Project"',
					description$tr$: 'transportplanning.transport.entityProjectDefFk',
					domain: 'text'
				},
				{
					model: 'ProjectItem.ProjectNo',
					iconClass: 'app-small-icons ico-project-boq',
					description: '"Default Client Project No"',
					description$tr$: 'transportplanning.transport.entityProjectDefNo',
					domain: 'text'
				},
				{
					model: 'JobDefItem.Code',
					iconClass: 'app-small-icons ico-logistic-job',
					description: '"Default Client Job"',
					description$tr$: 'transportplanning.transport.entityJobDefFk',
					domain: 'text'
				},
				{
					model: 'Waypoints.IsDefaultDst.PlannedTime',
					iconClass: 'tlb-icons ico-date',
					description: '"Planned Delivery"',
					description$tr$: 'transportplanning.transport.plannedDelivery',
					domain: 'text'
				}
			]
		},
		{
			panelType: 'text',
			header: 'getContactHeader()',
			model: 'transportCommonItem',
			showSlider: true,
			dataService: 'transportplanningTransportMainService',
			items: [
				{
					model: 'ContactItem.BpName1',
					iconClass: 'app-icons ico-business-partner',
					description: '"*Businesspartner"',
					description$tr$: 'transportplanning.transport.businesspartner',
					itemType: 'text'
				},
				// add email and phone number of businessPartner for HP-ALM #123232 by zwz on 2022/03/30
				{
					itemType: 'phone',
					model: 'BusinessPartnerItemOfDefJob.TelephoneNumber1',
					description: '"Work"',
					description$tr$: 'cloud.common.sidebarInfoDescription.work'
				},
				{
					itemType: 'email',
					model: 'BusinessPartnerItemOfDefJob.Email'
				},

				{
					model: 'BusinessPartnerContact.FullName',
					iconClass: 'app-icons ico-business-partner',
					description: '"*Contact"',
					description$tr$: 'transportplanning.transport.contact',
					itemType: 'text'
				},
				{
					itemType: 'phone',
					model: 'BusinessPartnerContact.TelephoneNumberDescriptor.Telephone',
					description: '"Work"',
					description$tr$: 'cloud.common.sidebarInfoDescription.work'
				},
				{
					itemType: 'email',
					model: 'BusinessPartnerContact.Email'
				},
				{
					model: 'BusinessPartnerContact.Role',
					iconClass: 'app-icons ico-business-partner',
					description: '"*Role"',
					description$tr$: 'transportplanning.transport.businesspartnerContactRole',
					itemType: 'text'
				},
				{
					itemType: 'location',
					model: 'Waypoints.IsDefaultDst.Address.Address'
				},
				{
					model: 'JobDefItem.Code',
					iconClass: 'app-small-icons ico-logistic-job',
					description: '"Default Job Waypoint"',
					description$tr$: 'transportplanning.transport.defaultJobWaypoint',
					domain: 'text'
				},
				{
					itemType: 'custom',
					model: 'ContactItem.Id',
					customTemplate: '<div class="marginBottom flex-box ng-scope"><button class="btn btn-default input-sm" ng-click="openDetailDialog(transportCommonItem)">'+
						'<div class="control-icons ico-input-lookup lookup-ico-dialog">&nbsp;</div>' +
						'</button></div>'
				},
			]
		},
		{
			panelType: 'map',
			model: 'transportCommonItem.Waypoints.IsDefaultDst.Address',
		},
		{
			panelType: 'text',
			header: 'getPackageHeader()',
			model: 'transportCommonItem',
			items: [
				{
					model: 'Package.Code',
					iconClass: 'control-icons ico-folder-root-pkg',
					description: '"Package Code"',
					description$tr$: 'transportplanning.transport.packageCode',
					domain: 'text'
				},
				{
					model: 'Package.CalcWeight',
					iconClass: 'app-small-icons ico-transport-package',
					description: '"Package Weight"',
					description$tr$: 'transportplanning.transport.packageWeight',
					domain: 'text'
				}
			]
		}
	]);
})();