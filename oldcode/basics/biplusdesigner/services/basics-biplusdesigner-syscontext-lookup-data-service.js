/*
 * $Id: basics-biplusdesigner-syscontext-lookup-data-service.js 624902 2021-02-24 17:57:50Z kh $
 * Copyright (c) RIB Software SE
 */

((angular) => {
	'use strict';

	angular.module('basics.biplusdesigner').factory('basicsBiPlusDesignerSysContextItemsLookupDataService', basicsBiPlusDesignerSysContextItemsLookupDataService);

	basicsBiPlusDesignerSysContextItemsLookupDataService.$inject = ['$q','platformTranslateService'];

	function basicsBiPlusDesignerSysContextItemsLookupDataService($q, platformTranslateService) {
		let service = {};
		const contextItems = [
			{Id: 0, description$tr$: 'basics.biplusdesigner.syscontextNull'},
			{Id: 1, description$tr$: 'basics.biplusdesigner.syscontextCompany'},
			{Id: 2, description$tr$: 'basics.biplusdesigner.syscontextProfitCenter'},
			{Id: 3, description$tr$: 'basics.biplusdesigner.syscontextProject'},
			{Id: 4, description$tr$: 'basics.biplusdesigner.syscontextMainEntityId'},
			{Id: 5, description$tr$: 'basics.biplusdesigner.syscontextMainEntityIdArray'},
			{Id: 6, description$tr$: 'basics.biplusdesigner.syscontextUserId'},
			{Id: 7, description$tr$: 'basics.biplusdesigner.syscontextUserName'},
			{Id: 8, description$tr$: 'basics.biplusdesigner.syscontextUserDescription'},
			{Id: 9, description$tr$: 'basics.biplusdesigner.syscontextSelectedMainEntities'}
		];

		platformTranslateService.translateObject(contextItems, ['description']);

		service.getList = function () {
			return $q.when(contextItems);
		};

		service.getItemById = function getItemById(id) {
			return _.find(contextItems, function (item) {
				return item.Id === id;
			});
		};

		service.getItemByKey = function getItemByKey(key) {
			return $q.when(service.getItemById(key));
		};

		service.getItemByIdAsync = function getItemByIdAsync(value) {
			return service.getItemByKey(value);
		};

		service.getSearchList = function () {
			return service.getList();
		};

		return service;
	}
})(angular);

