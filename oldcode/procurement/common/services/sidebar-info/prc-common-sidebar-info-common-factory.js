/**
 * Created by lja on 2015/11/23.
 */
(function (angular) {
	'use strict';

	let moduleName = 'procurement.common';

	angular.module(moduleName).factory('procurementCommonSideBarInfoService', [
		'_',
		'globals',
		'basicsCommonUtilities',
		'basicsLookupdataLookupDescriptorService',
		'$http',
		'$translate',
		'platformStatusIconService',
		'cloudDesktopSidebarService',
		'$state',
		'procurementCommonSideBarInfoDataServiceFactory',
		'$timeout',
		'basicsCommonMapKeyService',
		'$window',
		'cloudDesktopNavigationPermissionService',
		function (
			_,
			globals,
			basicsCommonUtilities,
			basicsLookupdataLookupDescriptorService,
			$http,
			$translate,
			platformStatusIconService,
			cloudDesktopSidebarService,
			$state,
			procurementCommonSideBarInfoDataServiceFactory,
			$timeout,
			basicsCommonMapKeyService,
			$window,
			naviPermissionService) {

			/**
			 * basic info:
			 * headerItem's code description && clerkPrc's info && clerkReq's info
			 * @param $scope
			 * @param dataService
			 * @param moduleName
			 * @param headerItemFields
			 */
			function extend($scope, dataService, moduleName, headerItemFields) {

				if (!$scope || !moduleName) {
					return;
				}

				// set module status here
				let status = {
					requisition: {
						lookupName: 'ReqStatus',
						foreignKey: 'ReqStatusFk'
					},
					package: {
						lookupName: 'PackageStatus',
						foreignKey: 'PackageStatusFk'
					},
					rfq: {
						lookupName: 'RfqStatus',
						foreignKey: 'RfqStatusFk'
					},
					pes: {
						lookupName: 'PesStatus',
						foreignKey: 'PesStatusFk'
					},
					quote: {
						lookupName: 'QuoteStatus',
						foreignKey: 'StatusFk'
					},
					contract: {
						lookupName: 'ConStatus',
						foreignKey: 'ConStatusFk'
					},
					invoice: {
						lookupName: 'InvStatus',
						foreignKey: 'InvStatusFk'
					}
				};

				if (!status[moduleName]) {
					throw new Error('module status must be set!');
				}

				let responsible = $translate.instant('procurement.common.sidebar.responsible'),
					owner = $translate.instant('procurement.common.sidebar.owner'),
					statusLookupName = status[moduleName].lookupName,
					statusForeignKey = status[moduleName].foreignKey;

				function createConfig() {

					let config = [
						{
							panelType: 'text',
							header: 'getHeaderItem()',
							model: 'headerItem',
							items: []
						},
						{
							panelType: 'text',
							header: 'getClerkPrcHeaderItem()',
							model: 'headerItem.ClerkPrcItem',
							showPicture: true,
							picture: 'headerItem.ClerkPrcItem.Blob.Content',
							items: [
								{
									itemType: 'email',
									model: 'Email'
								},
								{
									itemType: 'phone',
									model: 'ClerkTelephone',
									description: '"Work"',
									description$tr$: 'cloud.common.sidebarInfoDescription.work'
								},
								{
									itemType: 'phone',
									model: 'ClerkTelephoneMobile'
								},
								{
									itemType: 'fax',
									model: 'ClerkTelephoneFax'
								}
							]
						},
						{
							panelType: 'text',
							header: 'getOwnerHeaderItem()',
							model: 'headerItem.ClerkReqItem',
							showPicture: true,
							picture: 'headerItem.ClerkReqItem.Blob.Content',
							items: [
								{
									itemType: 'email',
									model: 'Email'
								},
								{
									itemType: 'phone',
									model: 'ClerkTelephone',
									description: '"Work"',
									description$tr$: 'cloud.common.sidebarInfoDescription.work'
								},
								{
									itemType: 'phone',
									model: 'ClerkTelephoneMobile'
								},
								{
									itemType: 'fax',
									model: 'ClerkTelephoneFax'
								}
							]
						}];

					// add headerItemFields to config
					if (headerItemFields) {
						config[0].items = headerItemFields;
					}

					return config;
				}

				// noinspection JSUnusedLocalSymbols
				function onHeaderSelectionChanged(key, selectedItem) {
					$scope.headerItem = selectedItem;
				}

				function getClerkPrc() {
					getClerkById('ClerkPrcFk', 'ClerkPrcItem');
				}

				function getClerkReq() {
					getClerkById('ClerkReqFk', 'ClerkReqItem');
				}

				function getClerkById(id, key) {
					if ($scope.headerItem && $scope.headerItem[id]) {
						$scope.headerItem[key] = basicsLookupdataLookupDescriptorService.getLookupItem('Clerk', $scope.headerItem[id]);
						getClerkBlob(key);
						getClerkTelephone(key);
					}
				}

				function getClerkBlob(key) {
					if ($scope.headerItem && $scope.headerItem[key] && $scope.headerItem[key].BlobsPhotoFk) {
						let Id = $scope.headerItem[key].BlobsPhotoFk;
						$http.get(globals.webApiBaseUrl + 'cloud/common/blob/getblobbyid?id=' + Id).then(function (response) {

							let blob = response.data;
							if ($scope.headerItem && $scope.headerItem[key] && $scope.headerItem[key].BlobsPhotoFk === blob.Id) {
								$scope.headerItem[key].Blob = blob;
							}

						});
					}
				}

				function getClerkTelephone(key){
					// telephone number
					if ($scope.headerItem && $scope.headerItem[key] && $scope.headerItem[key].TelephoneNumberFk) {
						let Id = $scope.headerItem[key].TelephoneNumberFk;
						getTelephoneNumber(Id, key, 'ClerkTelephone', 'TelephoneNumberFk');
					}
					// mobile phone
					if ($scope.headerItem && $scope.headerItem[key] && $scope.headerItem[key].TelephoneMobilFk) {
						let Id = $scope.headerItem[key].TelephoneMobilFk;
						getTelephoneNumber(Id, key, 'ClerkTelephoneMobile', 'TelephoneMobilFk');
					}
					// fax number
					if ($scope.headerItem && $scope.headerItem[key] && $scope.headerItem[key].TelephoneTelefaxFk) {
						let Id = $scope.headerItem[key].TelephoneTelefaxFk;
						getTelephoneNumber(Id, key, 'ClerkTelephoneFax', 'TelephoneTelefaxFk');
					}
				}

				function getTelephoneNumber(id, key, telephoneKey, telephoneFk){
					$http.get(globals.webApiBaseUrl + 'basics/clerk/getclerktelephone?telephoneNumberId=' + id).then(function (response) {
						let telephoneNumber = response.data;
						if ($scope.headerItem && $scope.headerItem[key] && $scope.headerItem[key][telephoneFk] && $scope.headerItem[key][telephoneFk] === telephoneNumber.Id) {
							$scope.headerItem[key][telephoneKey] = telephoneNumber.Telephone;
						}
					});
				}

				function changeStatus() {
					if ($scope.headerItem && $scope.headerItem.Id && $scope.headerItem[statusForeignKey]) {
						$scope.headerItem[statusLookupName] = basicsLookupdataLookupDescriptorService
							.getLookupItem(statusLookupName, $scope.headerItem[statusForeignKey]);

						if ($scope.headerItem[statusLookupName] && $scope.headerItem[statusLookupName].DescriptionInfo && $scope.headerItem[statusLookupName].DescriptionInfo.Translated) {
							$scope.headerItem[statusLookupName].Description = $scope.headerItem[statusLookupName].DescriptionInfo.Translated;
						}
					}
				}

				function getClerkHeaderItem(key, title) {
					if ($scope.headerItem && $scope.headerItem[key]) {
						return basicsCommonUtilities.combineText([title, $scope.headerItem[key].Description], ': ');
					}
				}

				// header item selected change
				dataService.registerSelectionChanged(onHeaderSelectionChanged);

				$scope.getHeaderItem = function () {
					if ($scope.headerItem && $scope.headerItem.Id) {
						return basicsCommonUtilities.combineText([$scope.headerItem.Code, $scope.headerItem.Description], ' - ');
					}
				};

				$scope.getOwnerHeaderItem = function () {
					return getClerkHeaderItem('ClerkReqItem', owner);
				};

				$scope.getClerkPrcHeaderItem = function () {
					return getClerkHeaderItem('ClerkPrcItem', responsible);
				};

				$scope.getStatusIconUrl = function () {
					return $scope.headerItem && $scope.headerItem[statusLookupName] ? platformStatusIconService.select($scope.headerItem[statusLookupName]) : '';
				};

				// watcher headerItem change
				let unWatchHeader = $scope.$watch('headerItem', function () {
					onHeaderSelectionChanged(null, dataService.getSelected());
					getClerkPrc();
					getClerkReq();
					changeStatus();
				});

				$scope.$on('$destroy', function () {
					dataService.unregisterSelectionChanged(onHeaderSelectionChanged);
					unWatchHeader();
				});

				return createConfig();
			}

			/**
			 * show business partner info
			 * @param $scope
			 */
			function businessPartnerHandler($scope) {

				let businessPartner = $translate.instant('procurement.common.sidebar.businesspartner');

				function getBusinessPartner() {
					if ($scope.headerItem && $scope.headerItem.BusinessPartnerFk && $scope.headerItem.BusinessPartnerFk !== -1) {
						$scope.headerItem.BusinessPartner = basicsLookupdataLookupDescriptorService.getLookupItem('BusinessPartner', $scope.headerItem.BusinessPartnerFk);
						$scope.headerItem.Contact = null;
						$scope.headerItem.BusinessPartner.Contact = null;
						$scope.headerItem.BusinessPartner.ContactId = null;
						if ($scope.headerItem.ContactFk) {
							$scope.headerItem.Contact = basicsLookupdataLookupDescriptorService.getLookupItem('Contact', $scope.headerItem.ContactFk);
							if ($scope.headerItem.Contact) {
								$scope.headerItem.BusinessPartner.Contact = $scope.headerItem.Contact.FullName;
								$scope.headerItem.BusinessPartner.ContactId = $scope.headerItem.Contact.Id;
							}
						}
						$scope.headerItem.BusinessPartner.Address = {
							Address: basicsCommonUtilities.combineText([$scope.headerItem.BusinessPartner.Street, $scope.headerItem.BusinessPartner.City], '  '),
							Longitude: $scope.headerItem.BusinessPartner.Longitude,
							Latitude: $scope.headerItem.BusinessPartner.Latitude
						};

					}
				}

				function createConfig() {

					let customTemplateForBP = getBPItemCustomTemplate();
					let customTemplateForContact = getContactItemCustomTemplate();
					let customBPAddressTemplate = getBPAddressCustomTemplate();

					return {
						panelType: 'text',
						header: 'getBusinessPartnerHeader()',
						model: 'headerItem.BusinessPartner',
						items: [
							{
								itemType: 'custom',
								customTemplate: customTemplateForBP,
								model: 'BusinessPartnerName1',
								iconClass: 'app-icons ico-business-partner'
							},
							{
								itemType: 'custom',
								customTemplate: customBPAddressTemplate,
								model: 'Address',
								iconClass: 'control-icons ico-location'
							},
							{
								itemType: 'custom',
								customTemplate: customTemplateForContact,
								model: 'Contact',
								iconClass: 'app-small-icons ico-contacts',
								description: '"Contact"',
								description$tr$: 'procurement.contract.ConHeaderContact'
							},
							{
								itemType: 'email',
								model: 'Email'
							},
							{
								itemType: 'phone',
								model: 'TelephoneNumber1',
								description: '"Work"',
								description$tr$: 'cloud.common.sidebarInfoDescription.work'
							},
							{
								itemType: 'phone',
								model: 'Telephonenumber2',
								description: '"Work"',
								description$tr$: 'cloud.common.sidebarInfoDescription.work'
							},
							{
								itemType: 'phone',
								model: 'Mobile'
							},
							{
								itemType: 'phone',
								model: 'FaxNumber',
								description: '"Fax"',
								description$tr$: 'cloud.common.sidebarInfoDescription.fax'
							}
						]
					};

				}

				$scope.getBusinessPartnerHeader = function () {
					if ($scope.headerItem && $scope.headerItem.BusinessPartner) {
						return basicsCommonUtilities.combineText([businessPartner, $scope.headerItem.BusinessPartner.BusinessPartnerName1], ': ');
					}
				};

				$scope.gotoBPModule = function () {
					gotoModule('businesspartner.main', $scope.headerItem.BusinessPartner.Id);
				};

				$scope.gotoContactModule = function () {
					gotoModule('businesspartner.contact', $scope.headerItem.BusinessPartner.ContactId);
				};

				$scope.showMapToNewTabForBP = function () {
					basicsCommonMapKeyService.getMapOptions().then(function (data) {
						let url = '',
							address = $scope.headerItem.BusinessPartner.Address;

						switch (data.Provider) {
							case 'bingv8':
							case 'bing': {
								url = '//www.bing.com/maps';
							}
								break;
							case 'google': {
								url = '//maps.google.com';
							}
								break;
							case 'openstreet': {
								url = '//www.openstreetmap.org';
							}
								break;
						}

						if (address && address.Latitude && address.Longitude) {
							if (data.Provider === 'openstreet') {
								url += _.template(
									'/?mlat=<%=lat%>&mlon=<%=lon%>#map=15/<%=lat%>/<%=lon%>'
								)({
									lat: address.Latitude,
									lon: address.Longitude
								});
							} else {
								url = url + '/?q=' + address.Latitude + ',' + address.Longitude;
							}
						}
						$window.open(url, '_blank');
					});
				};

				let unWatchBp = $scope.$watch('headerItem', function () {
					getBusinessPartner();
				});

				$scope.$on('$destroy', function () {
					unWatchBp();
				});

				return createConfig();
			}

			/**
			 * show total info
			 * @param $scope
			 * @param dataService
			 */
			function totalHandler($scope, dataService) {

				let amount = $translate.instant('procurement.common.sidebar.amount.title'),
					descriptionTr = {
						ValueNet: $translate.instant('procurement.common.sidebar.amount.net'),
						Gross: $translate.instant('procurement.common.sidebar.amount.gross'),
						Vat: $translate.instant('procurement.common.sidebar.amount.vat')
					};

				let currentSelectedTotalKey = 'selectedTotal';

				let service = {}, unWatch, isCustom = false;

				function createService() {

					let service = new procurementCommonSideBarInfoDataServiceFactory.Create([]);

					// prev or next
					service.selectionChangedRegister(onTotalSelectionChange);

					return service;
				}

				function onTotalSelectionChange() {
					$scope[currentSelectedTotalKey] = service.getSelected();
				}

				function createConfig(service) {

					let totalTemplate = getTotalItemCustomTemplate();

					return {
						panelType: 'text',
						header: 'getTotalHeader()',
						model: currentSelectedTotalKey,
						showSlider: true,
						dataService: service,
						items: [
							{
								itemType: 'custom',
								customTemplate: totalTemplate,
								description: 'getTotalDescription()',
								model: 'val',
								domain: 'money'
							}
						]
					};
				}

				function getTotal(totalList) {
					let total = filterTotal(totalList);
					if (!total) {
						return [];
					}

					let result = [];
					['ValueNet', 'Gross', 'Vat'].forEach(function (key) {
						result.push({
							model: key,
							val: total[key]
						});
					});

					return result;
				}

				function filterTotal(totalList) {
					let len = totalList.length, i = 0;
					if (!len) {
						return;
					}

					// for pes and other custom data module
					if (totalList[0].isCustom) {
						return totalList[0];
					}

					let result, PRC_TOTAL_KIND_FK = 1;
					for (; i < totalList.length; i++) {
						let item = totalList[i], totalType = getTotalType(item.TotalTypeFk);
						if (totalType && totalType.PrcTotalKindFk === PRC_TOTAL_KIND_FK && $scope.headerItem && $scope.headerItem.TaxCodeFk) {
							item.Vat = getVat(item.ValueNet, $scope.headerItem.TaxCodeFk);
							result = item;
							break;
						}
					}

					return result;
				}

				function getVat(valueNet, taxCodeFk) {
					if (taxCodeFk) {
						let taxCode = basicsLookupdataLookupDescriptorService.getLookupItem('TaxCode', taxCodeFk);
						if (taxCode) {
							return valueNet * taxCode.VatPercent * 0.01;
						}
					}
					return 0;
				}

				function getTotalType(totalTypeFk) {
					return basicsLookupdataLookupDescriptorService.getLookupItem('PrcTotalType', totalTypeFk);
				}

				function getCurrency(currencyFk) {
					return basicsLookupdataLookupDescriptorService.getLookupItem('Currency', currencyFk);
				}

				$scope.getTotalHeader = function () {
					if ($scope.headerItem && $scope.headerItem.Id && $scope[currentSelectedTotalKey]) {
						let currency = getCurrency($scope.headerItem.CurrencyFk || $scope.headerItem.BasCurrencyFk);
						if (currency && currency.Description) {
							return basicsCommonUtilities.combineText([amount, '(' + currency.Description + ')'], ': ');
						}
					}
				};

				$scope.getTotalDescription = function () {
					return $scope[currentSelectedTotalKey] && $scope[currentSelectedTotalKey].model ? descriptionTr[$scope[currentSelectedTotalKey].model] : '';
				};

				function handleLoaded() {
					let totalList = dataService.getList();
					service.init(getTotal(totalList));
					$scope[currentSelectedTotalKey] = service.getSelected();
				}

				// todo: still look for a better solution
				function init() {
					service = createService();

					if (!dataService.registerListLoaded) {
						isCustom = true;

						// just for pes custom make module,
						// dataService is the data without any services, pure data
						unWatch = $scope.$watch('headerItem', function () {
							$timeout(function () {
								if (service) {
									service.init(getTotal(dataService));
									$scope[currentSelectedTotalKey] = service.getSelected();
								}
							});
						});

					} else {

						// for container, has own dataService
						dataService.registerListLoaded(handleLoaded);
						unWatch = angular.noop;
					}

				}

				init();

				$scope.$on('$destroy', function () {
					isCustom ? unWatch() : dataService.unregisterListLoaded(handleLoaded);// jshint ignore:line
					service = null;
				});

				return createConfig(service);
			}

			/**
			 * template for total item with goto module function
			 */
			function getTotalItemCustomTemplate() {
				return '<div class="marginBottom flex-box" data-ng-show="##model##" >' +
					'<div ##iconClass## ##iconUrl##></div>' +
					'<div class="flex-element">' +
					'<div class="col-sm-6">##description##</div>' +
					'<div class="col-sm-6" style="text-align: right;" data-ng-bind-html="##model##"></div>' +
					'</div></div>';
			}

			/**
			 * template for bp item with goto module function
			 */
			function getBPItemCustomTemplate() {
				let actionLinkTmpl = '<a data-ng-bind-html="##model##" style="cursor: pointer;" data-ng-click="gotoBPModule()"></a>';
				if (!naviPermissionService.hasPermissionForModule('businesspartner.main')) {
					actionLinkTmpl = '<div data-ng-bind-html="##model##"></div>';
				}
				return '<div class="marginBottom flex-box" data-ng-show="##model##"><div class="flex-element"><div>' + actionLinkTmpl + '</div></div></div>';
			}

			/**
			 * template for Contact item with goto module function
			 */
			function getContactItemCustomTemplate() {
				let actionLinkTmpl = '<a data-ng-bind-html="##model##" style="cursor: pointer;" data-ng-click="gotoContactModule()"></a>';
				if (!naviPermissionService.hasPermissionForModule('businesspartner.contact')) {
					actionLinkTmpl = '<div data-ng-bind-html="##model##"></div>';
				}
				return '<div class="marginBottom flex-box" data-ng-show="##model##" ><div class="##iconClass##"></div><div class="flex-element"><div>' + actionLinkTmpl + '</div>##description##</div></div>';
			}

			/**
			 * go to module
			 * @param theModule
			 * @param id
			 */
			function gotoModule(theModule, id) {
				let url = globals.defaultState + '.' + theModule.replace('.', '');
				$state.go(url).then(function () {
					cloudDesktopSidebarService.filterSearchFromPKeys([id]);
				});
			}

			function getBPAddressCustomTemplate() {
				return '<div class="marginBottom flex-box" data-ng-show="##model##">' +
					'<div class="control-icons ico-location"></div>' +
					'<div class="flex-element item">' +
					'<div class="ng-binding">' +
					'<a  data-ng-bind-html="headerItem.BusinessPartner.Address.Address" data-ng-click="showMapToNewTabForBP()"></a>' +
					'</div>' +
					'</div>' +
					'</div>';
			}

			return {
				extend: extend,
				businessPartnerHandler: businessPartnerHandler,
				totalHandler: totalHandler,
				getTotalItemCustomTemplate: getTotalItemCustomTemplate,
				getBPItemCustomTemplate: getBPItemCustomTemplate,
				gotoModule: gotoModule
			};
		}
	]);
})(angular);