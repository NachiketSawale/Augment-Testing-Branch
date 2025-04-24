/**
 * Created by lja on 2015/11/4.
 */

(function (angular) {
	'use strict';
	var moduleName = 'procurement.rfq';
	// eslint-disable-next-line no-redeclare
	/* global angular */

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('procurementRfqSideBarInfoController',
		['$scope', 'procurementRfqMainService', 'basicsLookupdataLookupDescriptorService',
			'basicsCommonUtilities', '$translate', 'procurementRfqBusinessPartnerService',
			'$timeout', 'cloudDesktopSidebarInfoControllerService',
			'procurementCommonSideBarInfoService', 'platformStatusIconService',
			'procurementCommonSideBarInfoDependentDataUIService', 'globals',
			function ($scope, dataService, basicsLookupdataLookupDescriptorService,
				basicsCommonUtilities, $translate, procurementRfqBusinessPartnerService,
				$timeout, cloudDesktopSidebarInfoControllerService,
				procurementCommonSideBarInfoService, platformStatusIconService,
				procurementCommonSideBarInfoDependentDataUIService, globals) {

				var requestedBidders = $translate.instant('procurement.rfq.sidebar.requestedBidders');

				var headerItemFields = [
					{
						model: 'RfqStatus.Description',
						iconUrl: 'getStatusIconUrl()'
					},
					{
						model: 'DateRequested',
						description: '"Date Requested"',
						description$tr$: 'procurement.rfq.sidebar.dateRequested',
						domain: 'date',
						iconClass: 'tlb-icons ico-date'
					},
					{
						model: 'DateQuoteDeadline',
						description: '"Date Deadline"',
						description$tr$: 'procurement.rfq.sidebar.dateQuoteDeadline',
						domain: 'date',
						iconClass: 'tlb-icons ico-date'
					},
					{
						model: 'TimeQuoteDeadline',
						description: '"Time Deadline"',
						description$tr$: 'procurement.rfq.sidebar.timeQuoteDeadline',
						domain: 'time',
						iconClass: 'tlb-icons ico-date'
					},
					{
						model: 'LocaQuoteDeadline',
						description: '"Submission Location"',
						description$tr$: 'procurement.rfq.sidebar.locaQuoteDeadline'
					}
				];

				var theModule = 'rfq';

				$scope.gotoBPModule = function () {
					procurementCommonSideBarInfoService.gotoModule('businesspartner.main', $scope.bidderItem.BusinessPartner.Id);
				};

				$scope.getBidderHeader = function () {

					if ($scope.bidderItem && procurementRfqBusinessPartnerService.getList().length) {

						return basicsCommonUtilities.combineText([requestedBidders, '(' + procurementRfqBusinessPartnerService.getList().length + ')'], ' : ');
					}
					return '';
				};

				$scope.getRfqBpStatusIconUrl = function () {
					return ($scope.bidderItem && $scope.bidderItem.RfqBussinessPartnerStatus && $scope.bidderItem.RfqBussinessPartnerStatus.Icon) ?
						platformStatusIconService.select($scope.bidderItem.RfqBussinessPartnerStatus) : '';
				};

				function bidderSelectionChange(key, selectedItem) {// jshint ignore:line

					if (selectedItem) {
						$scope.bidderItem = selectedItem;
					}

				}

				function fillBidders(bidders) {

					var len = bidders.length,
						i = 0;

					for (; i < len; i++) {
						// var bidder = bidders[i];
						// bidder.BusinessPartner = getBusinessPartner(bidder.BusinessPartnerFk);
						// bidder.RfqBussinessPartnerStatus = getRfqStatus(bidder.RfqBusinesspartnerStatusFk);
						fillBidder(bidders[i]);
					}
				}

				function fillBidder(bidder) {
					bidder.BusinessPartner = getBusinessPartner(bidder.BusinessPartnerFk);
					bidder.RfqBussinessPartnerStatus = getRfqStatus(bidder.RfqBusinesspartnerStatusFk);
				}

				function getBusinessPartner(id) {
					return basicsLookupdataLookupDescriptorService
						.getLookupItem('BusinessPartner', id);
				}

				function getRfqStatus(id) {
					return basicsLookupdataLookupDescriptorService
						.getLookupItem('RfqBusinessPartnerStatus', id);
				}

				function getBidderConfig() {
					var findBidderCustomTemplate = procurementCommonSideBarInfoService.getBPItemCustomTemplate();
					return [
						{
							panelType: 'text',
							header: 'getBidderHeader()',
							model: 'bidderItem',
							showSlider: true,
							dataService: 'procurementRfqBusinessPartnerService',
							items: [
								{
									itemType: 'custom',
									customTemplate: findBidderCustomTemplate,
									model: 'BusinessPartner.BusinessPartnerName1',
									iconClass: 'app-icons ico-business-partner'
								},
								{
									model: 'RfqBussinessPartnerStatus.Description',
									iconUrl: 'getRfqBpStatusIconUrl()'
								},
								{
									itemType: 'email',
									model: 'BusinessPartner.Email'
								},
								{
									itemType: 'phone',
									model: 'BusinessPartner.TelephoneNumber1'
								}
							]
						}
					];
				}

				function reloadBidderSelectedItem() {
					var list = procurementRfqBusinessPartnerService.getList();
					if (list.length) {
						bidderSelectionChange(null, list[0]);
					}
				}

				function onBidderCreated(e, newItem) {
					fillBidder(newItem);
				}

				function initBidder() {

					cloudDesktopSidebarInfoControllerService.init($scope, [
						{
							dataService: procurementRfqBusinessPartnerService,
							selectedItem: 'bidderItem'
						}
					]);

					procurementRfqBusinessPartnerService.registerSelectionChanged(bidderSelectionChange);

					procurementRfqBusinessPartnerService.registerListLoaded(handleBidderLoaded);

					procurementRfqBusinessPartnerService.registerEntityCreated(onBidderCreated);

					procurementRfqBusinessPartnerService.registerItemModified(onPropertyChange);
				}

				function onPropertyChange(key, item) {
					if (item.BusinessPartnerFk && item.BusinessPartnerFk !== -1 && $scope.bidderItem) {
						$scope.bidderItem.BusinessPartner = getBusinessPartner(item.BusinessPartnerFk);
					}
				}

				function handleBidderLoaded() {
					fillBidders(procurementRfqBusinessPartnerService.getList());
					$timeout(function () {
						if (!procurementRfqBusinessPartnerService.hasSelection()) {
							procurementRfqBusinessPartnerService.goToFirst();
						}
					});
				}

				function init() {

					initBidder();

					reloadBidderSelectedItem();

					if (!globals.portal) {
						$scope.config = procurementCommonSideBarInfoService.extend($scope, dataService, theModule, headerItemFields)
							.concat(
								getBidderConfig(),
								procurementCommonSideBarInfoDependentDataUIService.createConfig($scope, theModule)
							);
					} else {
						$scope.config = procurementCommonSideBarInfoService.extend($scope, dataService, theModule, headerItemFields);
					}
				}

				init();

				$scope.$on('$destroy', function () {
					procurementRfqBusinessPartnerService.unregisterSelectionChanged(bidderSelectionChange);
					procurementRfqBusinessPartnerService.unregisterListLoaded(handleBidderLoaded);
					procurementRfqBusinessPartnerService.unregisterEntityCreated(onBidderCreated);
					procurementRfqBusinessPartnerService.unregisterItemModified(onPropertyChange);
				});

			}
		]);
})(angular);