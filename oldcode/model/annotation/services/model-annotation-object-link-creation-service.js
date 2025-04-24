/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';
	const moduleName = 'model.annotation';

	/**
	 * @ngdoc service
	 * @name modelAnnotationObjectLinkCreationService
	 * @function
	 *
	 * @description
	 * Provides a dialog box and helper routines for creating new model annotation object links.
	 */
	angular.module(moduleName).factory('modelAnnotationObjectLinkCreationService',
		modelAnnotationObjectLinkCreationService);

	modelAnnotationObjectLinkCreationService.$inject = ['_', '$translate', '$q',
		'$http', 'platformTranslateService', 'platformModalFormConfigService',
		'platformRuntimeDataService', 'modelAnnotationDataService',
		'modelAnnotationObjectLinkDataService', '$injector'];

	function modelAnnotationObjectLinkCreationService(_, $translate, $q,
		$http, platformTranslateService, platformModalFormConfigService,
		platformRuntimeDataService, modelAnnotationDataService,
		modelAnnotationObjectLinkDataService, $injector) {

		const service = {};

		service.showDialog = function () {
			const newObjectLinkSettings = {
				Kind: 's'
			};

			const dlgConfig = {
				title: $translate.instant('model.annotation.createObjectLinkTitle'),
				dataItem: newObjectLinkSettings,
				formConfiguration: {
					fid: 'model.annotation.objectlink.new',
					showGrouping: false,
					groups: [{
						gid: 'default'
					}],
					rows: [{
						gid: 'default',
						rid: 'kind',
						model: 'Kind',
						type: 'radio',
						options: {
							valueMember: 'value',
							labelMember: 'label',
							items: [{
								value: 'o',
								label$tr$: 'model.annotation.objectLinkKindObject'
							}, {
								value: 's',
								label$tr$: 'model.annotation.objectLinkKindObjectSet'
							}]
						}
					}]
				}
			};

			platformTranslateService.translateFormConfig(dlgConfig.formConfiguration);
			return platformModalFormConfigService.showDialog(dlgConfig).then(function (result) {
				if (result.ok) {
					platformRuntimeDataService.clear(result.data);

					// cloning necessary due to the issue reported in ALM 111168
					return _.cloneDeep(result.data);
				} else {
					return $q.reject('No object link created.');
				}
			});
		};

		service.createObjectLinkWithDialog = function (creationData) {
			return service.showDialog().then(function (result) {
				_.assign(result, creationData);
				return $http.post(globals.webApiBaseUrl + 'model/annotation/objlink/create', result).then(function (response) {
					return response.data;
				}, function (reason) {
					return $q.reject(reason);
				});
			}, function (reason) {
				return $q.reject(reason);
			});
		};

		service.patchCreateButton = function (scope, customDataService) {
			if (_.isString(customDataService)) {
				customDataService = $injector.get(customDataService);
			}

			const parentDataService = _.isObject(customDataService) ? customDataService.getParentDataService() : modelAnnotationDataService;
			const dataService = customDataService || modelAnnotationObjectLinkDataService;

			scope.addTools([{
				id: 'create',
				type: 'item',
				iconClass: 'tlb-icons ico-rec-new',
				fn: function () {
					const creationData = {};
					if (!dataService.initializeCreationData(creationData)) {
						return;
					}

					return service.createObjectLinkWithDialog(creationData).then(function (item) {
						return dataService.addCustomCreatedItem(item);
					});
				},
				disabled: () => !parentDataService.getSelected()
			}]);
		};

		return service;
	}
})(angular);
