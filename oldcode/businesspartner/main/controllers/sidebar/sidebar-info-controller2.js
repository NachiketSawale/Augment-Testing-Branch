/**
 * Created by wui on 4/7/2015.
 */

(function (angular) {
	'use strict';

	var moduleName = 'businesspartner.main';

	angular.module(moduleName).controller('businessPartnerMainInfoController2', ['_', '$scope', 'businesspartnerMainHeaderDataService',
		'businesspartnerMainContactDataService', 'basicsLookupdataLookupDescriptorService', 'businesspartnerMainContactPhotoDataService',
		'cloudDesktopSidebarInfoControllerService', 'basicsCommonUtilities', 'platformStatusIconService', '$timeout',
		'platformDataServiceSelectionExtension', 'businesspartnerMainPhotoDataService', '$translate',
		/* jshint -W072 */
		function (_, $scope, businesspartnerMainHeaderDataService, businesspartnerMainContactDataService, basicsLookupdataLookupDescriptorService,
			businesspartnerMainContactPhotoDataService, cloudDesktopSidebarInfoControllerService,
			basicsCommonUtilities, platformStatusIconService, $timeout, platformDataServiceSelectionExtension,
			businesspartnerMainPhotoDataService, $translate) {

			var dataConfig = [
				{
					dataService: businesspartnerMainHeaderDataService,
					selectedItem: 'bpItem'
				},
				{
					dataService: businesspartnerMainContactDataService,
					selectedItem: 'contactItem'
				},
				{
					dataService: businesspartnerMainContactPhotoDataService,
					selectedItem: 'contactPhotoItem'
				},
				{
					dataService: businesspartnerMainPhotoDataService,
					selectedItem: 'photoItem'
				}
			];

			$scope.config = [
				{
					panelType: 'image',
					header: 'getImageHeader()',
					model: 'photoItem',
					mainCSS: 'image-viewer-carousel',
					showSlider: true,
					dataService: 'businesspartnerMainPhotoDataService',
					picture: 'photoItem.Blob.Content',
					modelCommentText: 'CommentText'
				},
				{
					panelType: 'text',
					header: 'getBpHeader()',
					model: 'bpItem',
					items: [
						{
							model: 'bpStatusItem.Description',
							iconUrl: 'getBpStatusIconUrl()'
						},
						{
							itemType: 'location',
							model: 'SubsidiaryDescriptor.AddressDto.AddressLine'
						},
						{
							itemType: 'email',
							model: 'Email'
						},
						{
							itemType: 'phone',
							model: 'SubsidiaryDescriptor.TelephoneNumber1Dto.Telephone',
							description: '"Work"',
							description$tr$: 'cloud.common.sidebarInfoDescription.work'
						},
						{
							itemType: 'phone',
							model: 'SubsidiaryDescriptor.TelephoneNumberMobileDto.Telephone'
						},
						{
							itemType: 'fax',
							model: 'SubsidiaryDescriptor.TelephoneNumberTelefaxDto.Telephone'
						},
						{
							itemType: 'web',
							model: 'Internet'
						}
					]
				},
				{
					panelType: 'text',
					header: 'getContactHeader()',
					model: 'contactItem',
					showPicture: true,
					showSlider: true,
					dataService: 'businesspartnerMainContactDataService',
					picture: 'contactPhotoItem.Blob.Content',
					items: [
						{
							itemType: 'location',
							model: 'SubsidiaryDescriptor.Address'
						},
						{
							itemType: 'email',
							model: 'Email'
						},
						{
							itemType: 'phone',
							model: 'TelephoneNumberDescriptor.Telephone',
							description: '"Work"',
							description$tr$: 'cloud.common.sidebarInfoDescription.work'
						},
						{
							itemType: 'phone',
							model: 'MobileDescriptor.Telephone'
						},
						{
							itemType: 'fax',
							model: 'TeleFaxDescriptor.Telephone'
						},
						{
							itemType: 'web',
							model: 'Internet'
						}
					]
				},
				// first solution: OpenStreetMap -> no license
				{
					panelType: 'map',
					model: 'bpItem.SubsidiaryDescriptor.AddressDto'
				}
				/* {
					panelType: 'osm',
					model: 'bpItem.SubsidiaryDescriptor.AddressDto',
					longitude: 'bpItem.SubsidiaryDescriptor.AddressDto.Longitude',
					latitude: 'bpItem.SubsidiaryDescriptor.AddressDto.Latitude',
					city: 'bpItem.SubsidiaryDescriptor.AddressDto.City'

				} */
			];

			$scope.getBpHeader = function () {
				/** @namespace $scope.bpItem */
				if ($scope.bpItem) {
					// example: Abele Bau GmbH & Co Bauunternehmung und Klärwerk
					return basicsCommonUtilities.combineText([$scope.bpItem.BusinessPartnerName1, $scope.bpItem.BusinessPartnerName2], ' ');
				}
			};

			$scope.getContactHeader = function () {
				/** @namespace $scope.contactItem */
				if ($scope.contactItem) {
					return basicsCommonUtilities.combineText([$scope.contactItem.Title, $scope.contactItem.FirstName, $scope.contactItem.FamilyName], ' ');
				}
			};

			$scope.getBpStatusIconUrl = function () {
				return $scope.bpItem ? platformStatusIconService.select($scope.bpItem.bpStatusItem) : '';
			};

			$scope.getImageHeader = function () {
				return $translate.instant('businesspartner.main.info.ReferenceImages') || 'Reference Images';
			};

			cloudDesktopSidebarInfoControllerService.init($scope, dataConfig);

			businesspartnerMainContactDataService.registerListLoaded(handleContactLoaded);
			businesspartnerMainPhotoDataService.registerListLoaded(handlePhotoLoaded);

			// property changed.
			var unwatchBpStatus = $scope.$watchGroup(['bpItem', 'bpItem.BusinessPartnerStatusFk'], changeBpStatus);
			var unwatchSubsidiary = $scope.$watchGroup(['contactItem', 'contactItem.SubsidiaryFk'], changeSubsidiary);
			var unwatchContactBlobs = $scope.$watchGroup(['contactPhotoItem', 'contactPhotoItem.BlobsFk'], changeContactPhoto);
			var unwatchBlobs = $scope.$watchGroup(['photoItem', 'photoItem.BlobsFk'], changePhoto);

			$scope.$on('$destroy', function () {
				unwatchBpStatus();
				unwatchSubsidiary();
				unwatchContactBlobs();
				unwatchBlobs();
				businesspartnerMainContactDataService.unregisterListLoaded(handleContactLoaded);
				businesspartnerMainPhotoDataService.unregisterListLoaded(handlePhotoLoaded);
			});

			function changeBpStatus() {
				if ($scope.bpItem) {
					$scope.bpItem.bpStatusItem = basicsLookupdataLookupDescriptorService.getLookupItem('BusinessPartnerStatus', $scope.bpItem.BusinessPartnerStatusFk);
				}
			}

			function changeSubsidiary() {
				if ($scope.contactItem) {
					$scope.contactItem.SubsidiaryDescriptor = basicsLookupdataLookupDescriptorService.getLookupItem('Subsidiary', $scope.contactItem.SubsidiaryFk);
				}
			}

			function changeContactPhoto() {
				/** @namespace $scope.contactPhotoItem */
				/** @namespace $scope.contactPhotoItem.BlobsFk */
				if ($scope.contactPhotoItem && !$scope.contactPhotoItem.Blob && $scope.contactPhotoItem.BlobsFk) {
					var tempBlob = null;
					if (tempBlob) {
						$scope.contactPhotoItem.Blob = tempBlob;
					}
				}
			}

			function changePhoto() {
				/** @namespace $scope.photoItem */
				if ($scope.photoItem && !$scope.photoItem.Blob && $scope.photoItem.BlobsFk) {
					var tempBlob = null;
					if (tempBlob) {
						$scope.photoItem.Blob = tempBlob;
					}
				}
			}

			function handleContactLoaded() {
				$timeout(function () { // defer executing to make "businesspartnerMainContactDataService.goToFirst()" work.
					var selectedItem = businesspartnerMainContactDataService.getSelected();
					if (!platformDataServiceSelectionExtension.isSelection(selectedItem)) { // not exist selected item, show first item to side bar information when contacts loaded.
						if (!businesspartnerMainHeaderDataService.isBaseLine || businesspartnerMainContactDataService.checkDefaultContact()) {
							businesspartnerMainContactDataService.goToFirst();
						}
					}
				});
			}

			function handlePhotoLoaded() {
				$timeout(function () { // defer executing to make "businesspartnerMainContactDataService.goToFirst()" work.
					var selectedItem = businesspartnerMainPhotoDataService.getSelected();
					if (!platformDataServiceSelectionExtension.isSelection(selectedItem)) { // not exist selected item, show first item to side bar information when contacts loaded.
						businesspartnerMainPhotoDataService.goToFirst();
					}
				});
			}

		}
	]);
})(angular);