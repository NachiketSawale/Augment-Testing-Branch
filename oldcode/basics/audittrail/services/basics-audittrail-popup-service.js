/**
 * Created by reimer on 23.03.2016.
 */

(function () {

	'use strict';

	var moduleName = 'basics.audittrail';

	/**
	 * @ngdoc service
	 * @name
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).factory('basicsAudittrailPopupService', [
		'$q',
		'$http',
		'$timeout',
		'platformModalService',
		'platformModuleStateService',
		'platformTranslateService',
		'platformSchemaService',
		'basicsDependentDataModuleLookupService',
		'basicsConfigAuditContainerLookupService',
		'$translate', '_',
		function ($q,
			$http,
			$timeout,
			platformModalService,
			platformModuleStateService,
			platformTranslateService,
			platformSchemaService,
			basicsDependentDataModuleLookupService,
			basicsConfigAuditContainerLookupService,
			$translate, _) {

			var service = {};

			// local buffers
			var _optionsBuffer = null;

			service.showAuditTrails = function (options) {

				_optionsBuffer = options;

				var schema = platformSchemaService.getSchemas([{assemblyName: 'RIB.Visual.Basics.AuditTrail.WebApi', typeName: 'LogEntityDto', moduleSubModule: 'Basics.AuditTrail'}]);
				var translation = platformTranslateService.registerModule(moduleName, true);

				$q.all([schema, translation]).then(function () {

					var modalOptions = {
						templateUrl: globals.appBaseUrl + 'basics.audittrail/templates/basics-audittrail-popup.html',
						backdrop: false,
						windowClass: 'form-modal-dialog',
						headerTextKey: 'cloud.common.audittrailPopupTitle',
						lazyInit: true,
						resizeable: true,
						height: '80%',
						width: '70%',
						onReturnButtonPress: _.noop(),
						options: options
					};
					platformModalService.showDialog(modalOptions);

				});
			};

			service.loadData = function (options) {

				var canceller = $q.defer();

				var cancel = function (reason) {
					canceller.resolve(reason);
				};

				var promise =
					$http.get(globals.webApiBaseUrl + 'basics/audittrail/list?moduleInternalName=' + options.moduleInternalName +
						'&tableName=' + options.tableName +
						'&objectFk=' + options.objectFk, {timeout: canceller.promise})
						.then(function (response) {
							return response.data;
						});

				return {
					promise: promise,
					cancel: cancel
				};

			};

			service.initAuditTrail = function ($scope, options) {

				$scope.addTools([
					{
						id: 'audit-trail-button',
						sort: 10,
						caption: 'cloud.desktop.navBarAuditTrailDesc',
						type: 'item',
						iconClass: 'tlb-icons ico-audit-trail',
						fn: function () {
							options.objectFk = $scope.selectedEntityID;
							service.showAuditTrails(options);
						},
						disabled: function () {
							return !options.dataService.getSelected();
						}
					}]
				);
			};

			service.supportsAuditTrail = function (moduleInternalName) {
				// return basicsDependentDataModuleLookupService.supportsAuditTrail(moduleInternalName);
				return true;
			};

			//
			service.getAuditTrailArdFk = function (moduleInternalName) {
				return basicsDependentDataModuleLookupService.getAuditTrailArdFk(moduleInternalName);
			};

			/**
			 * @ngdoc
			 * @name
			 * @function
			 *
			 * @description
			 *
			 */
			service.getOptions = function () {
				return _optionsBuffer;
			};

			return service;

		}
	]);
})(angular);
