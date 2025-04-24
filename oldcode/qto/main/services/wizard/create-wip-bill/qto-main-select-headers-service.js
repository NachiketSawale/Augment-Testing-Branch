/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/* global globals */

	let moduleName = 'qto.main';

	/**
	 * @ngdoc factory
	 * @name qtoMainSelectHeadersService
	 * @description
	 */
	angular.module(moduleName).factory('qtoMainSelectHeadersService', ['$http', 'platformGridAPI', 'QtoTargetType',
		function ($http, platformGridAPI, QtoTargetType) {
			let service = {};

			service.setGridId = function (value) {
				service.gridId = value;
			};

			service.setProjectId = function (value) {
				service.projectId = value;
			};

			service.setVisibleAdditionRows = function (value) {
				service.visibleAdditionRows = value;
			};

			service.setQtoHeaderSelected = function (value) {
				service.qtoHeaderSelected = value;
			};

			service.setPurposeType = function (value) {
				service.purposeType = value;
			};

			service.loadQtoHeaderItems = function () {
				if (service.gridId) {
					let postParam = {
						ProjectId: service.projectId
					};
					$http.post(globals.webApiBaseUrl + 'qto/main/header/list', postParam).then(function (response) {
						let items = [];
						if (response.data && response.data.length > 0) {
							let qtoHeaders = response.data;
							// filter the QtoTargetType mark the selected item as default
							items = qtoHeaders.filter(function (item) {
								if (item.QtoTargetType === QtoTargetType.WipOrBill) {
									if (service.qtoHeaderSelected && item.Id === service.qtoHeaderSelected.Id) {
										item.IsMarked = true;
									}

									return true;
								}
							});
						}
						platformGridAPI.items.data(service.gridId, items);
					});
				}
			};

			service.getIsMarkedIdList = function () {
				if (service.gridId) {
					let qtoHeaderList = platformGridAPI.items.data(service.gridId);
					if (qtoHeaderList && qtoHeaderList.length > 0) {
						return qtoHeaderList.filter(function (item) {
							return item.IsMarked;
						});
					}
				}
				return [];
			};

			return service;
		}
	]);
})(angular);