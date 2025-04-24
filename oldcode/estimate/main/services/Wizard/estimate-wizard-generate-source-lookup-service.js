/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	/* global _ */
	'use strict';
	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateWizardGenerateSourceLookupService',
		['$q','$injector', 'basicsLookupdataLookupDescriptorService', 'estimateMainGroupSettingService',
			function ($q, $injector, lookupDescriptorService, estimateMainGroupSettingService) {

				let IsCXBM = false;
				let lookupType = 'EstimateGenerate4LeadingSource';
				let service = {
					setList: setList,
					getList: getList,
					getItemByIdAsync: getItemByIdAsync,
					getItemByKey: getItemByKey,
					getItemById: getItemById
				};

				function setList(data) {
					data = IsCXBM ? _.filter(data, {'IsCostGroupCat': true}) : data;
					lookupDescriptorService.removeData(lookupType);
					lookupDescriptorService.updateData(lookupType, data);
					let list = IsCXBM ? filterGroupSettings(data) : data;
					return list;
				}

				function getList() {
					let defer = $q.defer();
					let list = lookupDescriptorService.getData(lookupType);
					if (IsCXBM) {
						list = filterGroupSettings(list);
					}
					defer.resolve(_.values(list));
					return defer.promise;
				}

				function filterGroupSettings(list) {
					let groupSettingList = estimateMainGroupSettingService.getList();
					if(groupSettingList) {
						list = _.filter(list, function (item) {
							let existItem = _.find(groupSettingList, {'GroupStructureId': item.Id});
							return !existItem;
						});
					}

					return list;
				}

				function getItemByKey(key) {
					return lookupDescriptorService.getLookupItem(lookupType, key);
				}

				function getItemByIdAsync(id) {
					let defer = $q.defer();
					defer.resolve(getItemByKey(id));
					return defer.promise;
				}

				service.refresh = function refresh(){
					let estimateMainSidebarWizardService = $injector.get('estimateMainSidebarWizardService');
					if(estimateMainSidebarWizardService){
						return estimateMainSidebarWizardService.refreshGenerateLineItemsByLS();
					}
				};

				service.setIsCXBM = function(value){
					IsCXBM = value;
				};

				function getItemById(value){
					getItemByKey(value);
				}

				return service;
			}
		]);
})(angular);
