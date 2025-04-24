/*
 * $Id: reporting-syscontext-value.js 598830 2020-08-06 12:24:26Z ffo $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	angular.module('basics.reporting').value('basicsReportingSysContextItems', [
		{Id: null, description$tr$: 'basics.reporting.contextNull'},
		{Id: 0, description$tr$: 'basics.reporting.syscontextNull'},
		{Id: 1, description$tr$: 'basics.reporting.syscontextCompany'},
		{Id: 2, description$tr$: 'basics.reporting.syscontextProfitCenter'},
		{Id: 3, description$tr$: 'basics.reporting.syscontextProjekt'},
		{Id: 4, description$tr$: 'basics.reporting.syscontextMainEntityId'},
		{Id: 5, description$tr$: 'basics.reporting.syscontextMainEntityIdArray'},
		{Id: 6, description$tr$: 'basics.reporting.syscontextUserId'},
		{Id: 7, description$tr$: 'basics.reporting.syscontextUserName'},
		{Id: 8, description$tr$: 'basics.reporting.syscontextUserDescription'},
		{Id: 9, description$tr$: 'basics.reporting.syscontextSelectedMainEntities'},
		{Id: 10, description$tr$: 'basics.reporting.syscontextWatchList'},
		{Id: 11, description$tr$: 'basics.reporting.syscontextDialogSection'}
	]);
})(angular);

