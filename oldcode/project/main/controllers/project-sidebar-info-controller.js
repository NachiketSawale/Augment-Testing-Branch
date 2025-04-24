/**
 * Created by uestuenel on 29.06.2015.
 */
(function () {
	'use strict';

	function projectMainInfoController($scope, projectMainService, cloudDesktopSidebarInfoControllerService, projectMainInfoConfigItems, basicsLookupdataLookupDescriptorService, projectMainSalesResultService, $translate) {


		var dataConfig = [
			{
				dataService: projectMainService,
				selectedItem: 'projectMainCommonItem'
			},
			{
				dataService: projectMainSalesResultService,
				selectedItem: 'selectedSaleResult'
			}
		];

		$scope.config = projectMainInfoConfigItems;

		//Header
		$scope.getFirstHeader = function () {
			if ($scope.projectMainCommonItem) {
				return $scope.projectMainCommonItem.ProjectNo + ' - ' + $scope.projectMainCommonItem.ProjectName;
			}
		};

		//Status
		$scope.$watch('projectMainCommonItem.StatusFk', function () {
			if ($scope.projectMainCommonItem) {
				$scope.projectMainCommonItem.projectMainStatusItem = basicsLookupdataLookupDescriptorService.getLookupItem('project.main.status', $scope.projectMainCommonItem.StatusFk);
			}
		});

		//Business Partner
		$scope.$watch('projectMainCommonItem.BusinessPartnerFk', function () {
			if ($scope.projectMainCommonItem) {
				$scope.projectMainCommonItem.businessPartnerItem = basicsLookupdataLookupDescriptorService.getLookupItem('businesspartner', $scope.projectMainCommonItem.BusinessPartnerFk);
			}
		});

		//Address
		$scope.$watch('projectMainCommonItem.SubsidiaryFk', function () {
			if ($scope.projectMainCommonItem) {
				$scope.projectMainCommonItem.subsidiary = basicsLookupdataLookupDescriptorService.getLookupItem('subsidiary', $scope.projectMainCommonItem.SubsidiaryFk);
			}
		});

		$scope.$watch('selectedSaleResult', function () {
			if ($scope.selectedSaleResult && $scope.selectedSaleResult.CurrencyFk) {
				$scope.selectedSaleResult.CurrencyCode = basicsLookupdataLookupDescriptorService.getLookupItem('currency', $scope.selectedSaleResult.CurrencyFk).Currency;
			}
		});

		$scope.$watch('projectMainCommonItem.ContactFk', function () {
			if ($scope.projectMainCommonItem && $scope.projectMainCommonItem.ContactFk) {
				$scope.projectMainCommonItem.Contact = basicsLookupdataLookupDescriptorService.getLookupItem('contact', $scope.projectMainCommonItem.ContactFk);
			}
		});

		$scope.getSales = function () {
			if ($scope.selectedSaleResult) {
				return $translate.instant('project.main.salesContract');
			}
		};

		$scope.siteMapHeader = function () {
			if ($scope.selectedSaleResult) {
				return $translate.instant('project.main.siteMap');
			}
		};

		$scope.contactHeader = function () {
			return $translate.instant('project.main.projectContact');
		};

		cloudDesktopSidebarInfoControllerService.init($scope, dataConfig);

	}

	angular.module('project.main').controller('projectMainInfoController', ['$scope', 'projectMainService', 'cloudDesktopSidebarInfoControllerService', 'projectMainInfoConfigItems', 'basicsLookupdataLookupDescriptorService', 'projectMainSalesResultService', '$translate', projectMainInfoController])
		.value('projectMainInfoConfigItems', [
			{
				panelType: 'text',
				header: 'getFirstHeader()',
				model: 'projectMainCommonItem',
				items: [
					{
						model: 'projectMainStatusItem.Description',
						description: '"Status"'
					},
					{
						model: 'StartDate',
						iconClass: 'app-icons ico-calendar',
						description: '"Start"',
						domain: 'date'
					},
					{
						model: 'EndDate',
						iconClass: 'tlb-icons ico-date',
						description: '"Finish"',
						domain: 'date'
					},
					{
						model: 'businessPartnerItem.BusinessPartnerName1',
						iconClass: 'app-icons ico-business-partner'
					},
					{
						itemType: 'location',
						model: 'subsidiary.Address'
					},
					{
						iconClass: 'control-icons ico-location-site',
						model: 'AddressEntity.Address'
					}
				]
			},
			{
				panelType: 'text',
				header: 'contactHeader()',
				model: 'projectMainCommonItem.Contact',
				items: [
					{
						model: 'FullName',
						iconClass: 'app-icons ico-business-partner'
					},
					{
						model: 'Email',
						itemType: 'email'
					},
					{
						model: 'Mobile',
						itemType: 'phone'
					}
				]
			},
			{
				panelType: 'map',
				header: 'siteMapHeader()',
				model: 'projectMainCommonItem.AddressEntity'
			},
			{
				panelType: 'text',
				header: 'getSales()',
				model: 'selectedSaleResult',
				showSlider: true,
				dataService: 'projectMainSalesResultService',
				items: [
					{
						model: 'Code',
						iconClass: 'app-icons ico-sales-contract',
						domain: 'code'
					},
					{
						model: 'DateEffective',
						iconClass: 'app-icons ico-calendar',
						domain: 'date'
					},
					{
						model: 'CurrencyCode',
						iconClass: 'app-icons ico-currency',
					},
					{
						iconClass: 'app-icons ico-billing-schema',
						model: 'NetTotal',
						domain: 'money'
					}]
			}
		]);
})();