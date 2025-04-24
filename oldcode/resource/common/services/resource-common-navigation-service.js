/**
 * Created by shen on 5/5/2022
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-unused-vars
	/* global _,globals */

	let moduleName = 'resource.common';
	angular.module(moduleName).factory('resourceCommonNavigationService', [
		'$translate',
		'$http',
		'$injector',
		'$state',
		'_',
		'cloudDesktopSidebarService',
		'platformModuleNavigationService',
		function (
			$translate,
			$http,
			$injector,
			$state,
			_,
			cloudDesktopSidebarService,
			naviService
		) {
			const resModules = {
				'resource.master': {icon: 'ico-resource-master', ids: []},
				'resource.equipment': {icon: 'ico-equipment', ids: []},
				'resource.reservation': {icon: 'ico-resource-reservation', ids: []},
				'resource.requisition': {icon: 'ico-resource-requisition', ids: []},
				'transportplanning.requisition': {icon: 'ico-transport-requisition', ids: []},
				'businesspartner.main': {icon: 'ico-business-partner', ids: []},
			};

			function createNavigationItem() {
				const navItem = {
					id: 't-navigation-to',
					caption: 'cloud.common.Navigator.goTo',
					type: 'dropdown-btn',
					iconClass: 'tlb-icons ico-goto ' + _.uniqueId('_navigator'),
					list: {
						showImages: true,
						cssClass: 'dropdown-menu-right',
						items: []
					},
					disabled: function () {
						return false;
					//	let maiItem = dataService.getSelected();
					//	return !(maiItem && _.has(maiItem, 'Id') && maiItem.Version > 0) || scope.tools.navigationUpdating;
					}
				};

				_.forEach(resModules, function ({icon, ids}, module) {
					let caption = $injector.get('platformModuleInfoService').getI18NName(module) || module;
					if (ids.length > 0) {
						caption += ` (${ids.length})`;
					}

					navItem.list.items.push({
						id: 't-navigation-to-' + module,
						type: 'item',
						caption: caption,
						iconClass: 'app-small-icons ' + icon + ' ' + _.uniqueId('_navigator'),
						fn: function () {
							naviService.navigate({
								moduleName: module
							}, {FromGoToBtn: true, Ids: ids.join(',')}, 'Ids');
						},
						disabled: () => !ids || ids.length === 0
					});
				});

				return navItem;
			}

			function updateNavigationItem(planningBoardSource, supplierDataService, assignmentDataService, demandDataService) {
				/**/
				// resource master
				const selectedSuppliers = supplierDataService.getSelectedEntities() || [];
				resModules['resource.master'].ids.length = 0;
				resModules['resource.master'].ids.push(...selectedSuppliers.map((e) => e.Id));

				// plant
				if(selectedSuppliers.length > 0){
					$http.get(globals.webApiBaseUrl + 'resource/equipment/plant/getplantbyresource?resId=' + selectedSuppliers[0].Id).then(function (response){
						if(response && response.data){
							resModules['resource.equipment'].ids.length = 0;
							resModules['resource.equipment'].ids.push(...response.data);
						}
					});
				}

				// business partner
				if(selectedSuppliers.length > 0 &&  selectedSuppliers[0].BusinessPartnerFk !== null && typeof selectedSuppliers[0].BusinessPartnerFk !== 'undefined'){
					resModules['businesspartner.main'].ids.length = 0;
					resModules['businesspartner.main'].ids.push(...selectedSuppliers.map((e) => e.BusinessPartnerFk));
				}

				// resource reservation
				const assignments = assignmentDataService.getSelectedEntities() || [];
				resModules['resource.reservation'].ids.length = 0;
				resModules['resource.reservation'].ids.push(...assignments.map((e) => e.Id));

				// resource requisition
				if(assignments.length > 0 && assignments[0].RequisitionFk !== null && typeof assignments[0].RequisitionFk !== 'undefined'){
					resModules['resource.requisition'].ids.length = 0;
					resModules['resource.requisition'].ids.push(...assignments.map((e) => e.RequisitionFk));
				}

				// transport
				if(assignments.length > 0){
					$http.get(globals.webApiBaseUrl + 'transportplanning/requisition/gettrsreqbyreservation?reservationId=' + assignments[0].Id).then(function (response){
						if(response && response.data){
							resModules['transportplanning.requisition'].ids.length = 0;
							resModules['transportplanning.requisition'].ids.push(...response.data);
						}
					});
				}

				console.log({
					planningBoardSource,
					resModules,
				});
			}

			return {
				createNavigationItem: createNavigationItem,
				updateNavigationItem: updateNavigationItem,
			};
		}]);
})(angular);
