/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	/* global globals */
	let moduleName = 'estimate.assemblies';

	/**
	 * @ngdoc service
	 * @name estimateAssembliesMdcRuleRelationService
	 * @function
	 *
	 * @description
	 */
	angular.module(moduleName).factory('estimateAssembliesMdcRuleRelationService',
		['$http', '$injector', '$q',
			'estimateAssembliesMdcRuleRelationCommonService',
			function ($http, $injector, $q,
				estimateAssembliesMdcRuleRelationCommonService
			) {


				let localData = {
					serviceName: 'estimateAssembliesMdcRuleRelationService' // self service name
				};


				let serviceOption = {
					flatRootItem: {
						httpRead: {
							route: globals.webApiBaseUrl + 'estimate/rule/mdcrulelineitem/',
							endRead: 'listbyestheader'
						},
						httpCreate: {
							route: globals.webApiBaseUrl + 'estimate/rule/mdcrulelineitem/',
							endCreate: 'createitem'
						},
						httpUpdate: {
							route: globals.webApiBaseUrl + 'estimate/rule/mdcrulelineitem/',
							endUpdate: 'updateitem'
						},
						httpDelete: {
							route: globals.webApiBaseUrl + 'estimate/rule/mdcrulelineitem/',
							endDelete: 'deleteitem'
						}
					}

				};


				// extend the parent data
				let extendData = {
					mainEntityIdField: 'Id',
					relationTbRuleFkName: 'EstRuleFk',
					relationTbMainEntityFkName: 'EstLineItemFk',

					// to which entity the rule is related
					relationEntityServiceName: localData.serviceName, //

					serviceOption: serviceOption, //

					getListAsync: getListAsync
				};

				let commonFns = estimateAssembliesMdcRuleRelationCommonService.createService(extendData);


				// get all mdc relations by the current assembly headerFk
				// this is called right after the assemblies container data is loaded & before the grid is rendered
				function getListAsync(estHeaderFk) {
					return commonFns.loadListAsync(estHeaderFk);
				}

				let service = {
					getListAsync: getListAsync
				};
				return angular.extend(commonFns, service);

			}]);
})();
