/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	/* global _ */
	'use strict';
	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainSplitLineItemMethodsLookupService',
		['$q', '$translate',
			function ($q, $translate) {

				let splitMethods = [
					{Id: 1, Description: $translate.instant('estimate.main.splitLineItemWizard.splitByLocation')},
					{Id: 2, Description: $translate.instant('estimate.main.splitLineItemWizard.splitByObjects')},
					{Id: 3, Description: $translate.instant('estimate.main.splitLineItemWizard.splitByCommissioningResources')},
					{Id: 4, Description: $translate.instant('estimate.main.splitLineItemWizard.splitByPercentAndQuantity')},
					{Id: 5, Description: $translate.instant('estimate.main.splitLineItemWizard.splitByResources')}
				];

				let service = {
					getList: getList,
					getItemByIdAsync: getItemByIdAsync,
					getItemByKey: getItemByKey,
					getItemById: getItemById
				};

				function getList() {
					return $q.when(splitMethods);
				}

				function getItemByKey(key) {
					return _.find(splitMethods, {Id: key});
				}

				function getItemByIdAsync(id) {
					return $q.when(getItemByKey(id));
				}

				service.refresh = function refresh(){
					return splitMethods;
				};

				function getItemById(value){
					getItemByKey(value);
				}

				return service;
			}
		]);
})(angular);
