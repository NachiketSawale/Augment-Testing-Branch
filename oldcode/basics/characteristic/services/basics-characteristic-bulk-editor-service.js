/**
 * Created by reimer on 08.05.2017.
 */

(function () {

	'use strict';

	var moduleName = 'basics.characteristic';

	/**
	 * @ngdoc service
	 * @name
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).factory('basicsCharacteristicBulkEditorService', [
		'$q',
		'$http',
		'$timeout',
		'platformModalService',
		'platformTranslateService',
		'platformSchemaService',
		'basicsCharacteristicCodeLookupService',
		'cloudDesktopSidebarService',
		'platformGridAPI',
		'$injector',
		function ($q,
		          $http,
		          $timeout,
		          platformModalService,
		          platformTranslateService,
		          platformSchemaService,
		          basicsCharacteristicCodeLookupService,
		          cloudDesktopSidebarService,
		          platformGridAPI,
		          $injector) {

			var service = {};

			// local buffers
			// var _params;
			var _gridId = '1cf32e710ad84d299c55ca404083b72e';  // selected codes grid
			var _busyStatus = false;

			service.busyStatusChanged = new Platform.Messenger();

			var getFilteredEntities = function(params) {

				return $http.post(globals.webApiBaseUrl + 'basics/characteristic/data/getfilteredentities', params)
					.then(function (response) {
						params.objectFks = response.data.objectFks;
						return;
					}, function (reason) {           /* jshint ignore:line */
						// error case will be handled by interceptor
					}).finally(function () {
						//setLoadingStatus(false);
					}
					);
			};

			var setBusyStatus = function (newStatus) {
				if (_busyStatus !== newStatus) {
					_busyStatus = newStatus;
					service.busyStatusChanged.fire(_busyStatus);
				}
			};

			service.showEditor = function(userParams, wizardParams) {

				var params = {};

				if (_.isString(wizardParams.parentService)) {
					params.parentService = $injector.get(wizardParams.parentService);
				}
				else {
					params.parentService = wizardParams.parentService;
				}

				params.sectionId = wizardParams.sectionId;
				params.moduleName = wizardParams.moduleName;
				params.userParams = userParams;

				_busyStatus = false;
				params.gridId = _gridId;

				// init data/lookups
				var schema = platformSchemaService.getSchemas([{ assemblyName: 'RIB.Visual.Basics.Characteristic.WebApi', typeName: 'CharacteristicDataDto', moduleSubModule: 'Basics.Characteristic'}]);
				var translation = platformTranslateService.registerModule(moduleName, true);
				basicsCharacteristicCodeLookupService.sectionId = params.sectionId;
				var codeLookup = basicsCharacteristicCodeLookupService.loadData(basicsCharacteristicCodeLookupService.sectionId);

				// extend params with current filter
				params.filter = cloudDesktopSidebarService.getFilterRequestParams();
				// extend params with selected entities
				var preview = getFilteredEntities(params);

				$q.all([schema, translation, codeLookup, preview]).then(function() {

					var modalOptions = {
						templateUrl: globals.appBaseUrl + 'basics.characteristic/templates/basics-characteristic-bulk-editor.html',
						backdrop: false,
						windowClass: 'form-modal-dialog',
						headerTextKey: 'basics.characteristic.bulkEditorPopup',
						lazyInit: true,
						resizeable: true,
						params: params
					};
					platformModalService.showDialog(modalOptions);

				});
			};

			service.setCharacteristics = function(params) {

				setBusyStatus(true);
				return $http.post(globals.webApiBaseUrl + 'basics/characteristic/data/setmany', params)
					.then(function () {
						return;
					}, function (reason) {           /* jshint ignore:line */
						// error case will be handled by interceptor
					}).finally(function () {
						setBusyStatus(false);
					}
					);
			};

			// needed for code lookup to get used codes
			service.getList = function() {
				return platformGridAPI.items.data(_gridId);
			};

			service.showSuccessMessage = function() {
				var modalOptions = {
					headerTextKey: 'basics.common.alert.info',
					bodyTextKey: 'basics.characteristic.successMessage',
					showOkButton: true,
					iconClass: 'ico-warning'
				};
				platformModalService.showDialog(modalOptions);
			};

			service.init = function() {
				angular.noop();
			};

			return service;

		}
	]);
})(angular);
