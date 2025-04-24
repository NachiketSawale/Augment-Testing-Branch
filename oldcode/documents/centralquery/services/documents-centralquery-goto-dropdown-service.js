(function () {
	'use strict';
	/* global _ */

	var moduleName = 'documents.centralquery';
	angular.module(moduleName).factory('documentsCentralQuaryGotoDropDown', [
		'$translate',
		'$http',
		'$injector',
		'$state',
		'cloudDesktopSidebarService',
		'platformModuleNavigationService',
		'documentsProjectDocumentModuleContext',
		'documentsProjectDocumentDataService',
		function (
			$translate,
			$http,
			$injector,
			$state,
			cloudDesktopSidebarService,
			naviService,
			documentsProjectDocumentModuleContext,
			documentsProjectDocumentDataService
		) {
			var gotoModules = [
				'project.main',
				'businesspartner.main',
				'procurement.package',
				'procurement.requisition',
				'procurement.rfq',
				'procurement.quote',
				'procurement.contract',
				'procurement.pes',
				'procurement.invoice',
				'sales.wip',
				'sales.billing',
				'qto.main',
				'estimate.main',
				'controlling.structure',
				'basics.materialcatalog',
				'basics.procurementstructure',
				'businesspartner.certificate',
				'model.main',
				'logistic.job',
				'logistic.dispatching',
				'change.main',
				'logistic.settlement',
				'businesspartner.contact'
			];
			var moduleDisplayNames = [
				'moduleDisplayNameProjectMain',
				'moduleDisplayNameBusinessPartner',
				'moduleDisplayNamePackage',
				'moduleDisplayNameRequisition',
				'moduleDisplayNameRfQ',
				'moduleDisplayNameQuote',
				'moduleDisplayNameContract',
				'moduleDisplayNamePerformanceEntrySheet',
				'moduleDisplayNameInvoice',
				'moduleDisplayNameWip',
				'moduleDisplayNameBilling',
				'moduleDisplayNameQTO',
				'moduleDisplayNameEstimate',
				'moduleDisplayNameControllingUnits',
				'moduleDisplayNameMaterialCatalog',
				'moduleDisplayNameProcurementStructure',
				'moduleDisplayNameCertificate',
				'moduleDisplayNameModel',
				'moduleDisplayNameLogisticJob',
				'moduleDisplayNameLogisticDispatching',
				'moduleDisplayNameChangeMain',
				'moduleDisplayNameLogisticSettlement',
				'moduleDisplayNameBusinessContact'
			];
			var relatedFks = [
				'PrjProjectFk',
				'BpdBusinessPartnerFk',
				'PrcPackageFk',
				'ReqHeaderFk',
				'RfqHeaderFk',
				'QtnHeaderFk',
				'ConHeaderFk',
				'PesHeaderFk',
				'InvHeaderFk',
				'WipHeaderFk',
				'BilHeaderFk',
				'QtoHeaderFk',
				'EstHeaderFk',
				'MdcControllingUnitFk',
				'MdcMaterialCatalogFk',
				'PrcStructureFk',
				'BpdCertificateFk',
				'ModelFk',
				'LgmJobFk',
				'LgmDispatchHeaderFk',
				'PrjChangeFk',
				'LgmSettlementFk',
				'BpdContactFk'
			];
			var gotoModulesIcons = [
				'ico-project',
				'ico-business-partner',
				'ico-package',
				'ico-requisition',
				'ico-rfq',
				'ico-quote',
				'ico-contracts',
				'ico-pes',
				'ico-invoice',
				'ico-sales-wip',
				'ico-sales-billing',
				'ico-qto',
				'ico-estimate',
				'ico-controlling-units',
				'ico-material-catalog',
				'ico-procurement-structure',
				'ico-certificate',
				'ico-model',
				'ico-logistic-job',
				'ico-dispatching',
				'ico-change-management',
				'ico-invoicing',
				'ico-contacts'
			];

			function createNavItem(scope) {
				var navItem = _.find(scope.tools.items, {id: 't-navigation-to'});
				if (navItem) {
					return null;
				}

				var navItemList = [];

				_.forEach(gotoModules, function (val, key) {
					var iconClass = gotoModulesIcons[key];
					var caption = $translate.instant('cloud.desktop.' + moduleDisplayNames[key]);
					navItemList[key] = createNavListItem(val, caption, iconClass);
				});

				navItem = {
					id: 't-navigation-to',
					caption: 'cloud.common.Navigator.goTo',
					type: 'dropdown-btn',
					iconClass: 'tlb-icons ico-goto ' + _.uniqueId('_navigator'),
					list: {
						showImages: true,
						cssClass: 'dropdown-menu-right',
						items: navItemList
					},
					disabled: function () {
						var config = documentsProjectDocumentModuleContext.getConfig();
						var dataService = documentsProjectDocumentDataService.getService(config);
						var maiItem = dataService.getSelected();
						var items = this.list.items;
						if(maiItem !== null && maiItem !== undefined){
							_.forEach(gotoModules, function (val, key) {
								var relatedItem = _.find(items, {id: 't-navigation-to-' + val});
								var relatedFk =  maiItem[relatedFks[key]];
								if (relatedItem) {
									updateNavListItem(relatedItem, val, relatedFk, maiItem, relatedFks[key]);
								}
							});
						}
						var visiableItem = _.find(this.list.items, {hideItem: false});
						if (!visiableItem) {
							return true;
						}
						return !(maiItem && _.has(maiItem, 'Id') && maiItem.Version > 0) || (scope.tools !== null && scope.tools.navigationUpdating);
					}
				};

				return navItem;
			}

			function updateNavItem(scope) {
				var config = documentsProjectDocumentModuleContext.getConfig();
				var dataService = documentsProjectDocumentDataService.getService(config);
				var docSelected = dataService.getSelected();
				if(scope.tools === null || scope.tools === undefined){
					return;
				}
				if (scope && docSelected) {
					var gotoButton = _.find(scope.tools.items, {id: 't-navigation-to'});

					if (gotoButton && gotoButton.list && gotoButton.list.items) {
						scope.tools.navigationUpdating = true;

						_.forEach(gotoModules, function (val, key) {
							var relatedItem = _.find(gotoButton.list.items, {id: 't-navigation-to-' + val});
							var relatedFk =  docSelected[relatedFks[key]];
							if (relatedItem) {
								updateNavListItem(relatedItem, val, relatedFk, docSelected, relatedFks[key]);
							}
						});

						if (_.has(scope.tools, 'navigationUpdating')) {
							scope.tools.navigationUpdating = false;
						}
					}
				}
			}

			function createNavListItem(navigateTo, caption, iconClass, fn) {
				return {
					id: 't-navigation-to-' + navigateTo,
					type: 'item',
					hideItem: true,
					caption: caption,
					iconClass: 'app-small-icons ' + iconClass + ' ' + _.uniqueId('_navigator'),
					fn: fn === undefined ? function () {} : fn,
					disabled: false
				};
			}

			function updateNavListItem(item, navigateTo, fk, docSelected, fkString) {
				item.hideItem = !fk;
				item.fn = function () {
					if (navigateTo === 'controlling.structure' ||
						navigateTo === 'qto.main'
					) {
						naviService.navigate({moduleName: navigateTo}, docSelected, fkString);
					}
					else if (navigateTo === 'change.main') {
						naviService.navigate({
							moduleName: navigateTo
						}, fk, 'Id');
					}
					else if (navigateTo === 'logistic.job') {
						naviService.navigate({
							moduleName: navigateTo
						}, {Id: fk}, 'Id');
					}
					else if (navigateTo === 'estimate.main') {
						naviService.navigate({
							moduleName: navigateTo
						}, {EstHeaderFk: fk, ProjectFk: docSelected.PrjProjectFk}, 'EstHeaderFk');
					}
					else if (navigateTo === 'basics.procurementstructure') {
						naviService.navigate({
							moduleName: navigateTo
						}, docSelected, 'PrcStructureFk');
					}
					else if (navigateTo === 'model.main') {
						naviService.navigate({
							moduleName: navigateTo
						}, {Id: fk, ProjectFk: docSelected.PrjProjectFk}, 'Id');
					}
					else {
						naviService.navigate({
							moduleName: navigateTo
						}, {Id: fk}, 'Id');
					}
				};
			}

			return {
				createNavItem: createNavItem,
				updateNavItem: updateNavItem
			};
		}]);
})();