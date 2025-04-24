/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	var modelAdministrationModule = angular.module('model.administration');

	/**
	 * @ngdoc service
	 * @name modelAdministrationPropertyKeyDynDdPathSegmentService
	 * @function
	 *
	 * @description
	 * Contains client-side code for dealing with property key dynamic Dd path segments.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	modelAdministrationModule.factory('modelAdministrationPropertyKeyDynDdPathSegmentService', ['_', '$q', '$translate',
		'platformModalFormConfigService', 'platformTranslateService',
		function (_, $q, $translate, platformModalFormConfigService, platformTranslateService) {
			var service = {};

			service.selectItem = function () {
				var pkSettings = {};

				var dlgConfig = {
					title: $translate.instant('model.administration.selectPropKey'),
					dataItem: pkSettings,
					formConfiguration: {
						fid: 'model.administration.propkey.bulk',
						showGrouping: false,
						groups: [{
							gid: 'default'
						}],
						rows: [{
							gid: 'default',
							rid: 'pk',
							label$tr$: 'model.administration.propertyKey',
							model: 'propertyKeyId',
							type: 'directive',
							directive: 'model-main-property-key-dialog',
							options: {
								descriptionMember: 'PropertyName'
							}
						}]
					},
					dialogOptions: {
						disableOkButton: function disableOkButton() {
							return !_.isInteger(pkSettings.propertyKeyId);
						}
					}
				};

				platformTranslateService.translateFormConfig(dlgConfig.formConfiguration);
				return platformModalFormConfigService.showDialog(dlgConfig).then(function (result) {
					if (result.ok) {
						return 'p' + pkSettings.propertyKeyId;
					} else {
						return $q.reject('user cancelled');
					}
				});
			};

			return service;
		}]);
})(angular);