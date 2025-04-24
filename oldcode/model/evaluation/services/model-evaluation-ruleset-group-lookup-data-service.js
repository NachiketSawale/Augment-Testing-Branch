/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	const moduleName = 'model.evaluation';

	const serviceName = 'modelEvaluationRulesetGroupLookupDataService';

	/**
	 * @ngdoc service
	 * @name modelEvaluationRulesetGroupLookupDataService
	 * @function
	 *
	 * @description
	 * Provides access to model evaluation rule set groups for a lookup.
	 */
	angular.module(moduleName).factory(serviceName,
		modelEvaluationRulesetGroupLookupDataService);

	modelEvaluationRulesetGroupLookupDataService.$inject = ['_', 'platformLookupDataServiceFactory',
		'basicsLookupdataConfigGenerator', 'basicsCommonConfigLocationListService',
		'ServiceDataProcessArraysExtension'];

	function modelEvaluationRulesetGroupLookupDataService(_, platformLookupDataServiceFactory,
		basicsLookupdataConfigGenerator, basicsCommonConfigLocationListService,
		ServiceDataProcessArraysExtension) {

		basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec(serviceName, {
			dispMember: 'DescriptionInfo.Translated',
			valMember: 'Id',
			columns: [{
				id: 'Description',
				field: 'DescriptionInfo.Translated',
				name: 'Description',
				formatter: 'description',
				width: 150,
				name$tr$: 'cloud.common.entityDescription'
			}],
			uuid: '11246b9d20de4001bfa5fa396b9173ff'
		});

		const config = {
			httpRead: {
				route: globals.webApiBaseUrl + 'model/evaluation/group/',
				endPointRead: 'all'
			},
			dataProcessor: [new ServiceDataProcessArraysExtension(['Children'])],
			tree: {
				parentProp: 'ModelRulesetGroupParentFk',
				childProp: 'Children'
			}
		};

		const container = platformLookupDataServiceFactory.createInstance(config);

		container.service.getlookupType = function () {
			return serviceName;
		};

		return container.service;
	}
})(angular);
