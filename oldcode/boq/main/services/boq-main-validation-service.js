/**
 * Created by sprotte on 26.05.2014.
 */

(function () {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name boqMainElementValidationService
	 * @description provides validation methods for a BoqItem
	 */
	angular.module('boq.main').factory('boqMainElementValidationService', ['$injector',
		'platformDataValidationService',
		'platformModalService',
		'$q',
		'$http',
		function ($injector,
			platformDataValidationService,
			platformModalService,
			$q,
			$http) {

			var service = {};

			service.validateBoqLineTypeFk = function (entity, value, model) {

				var platformRuntimeDataService = $injector.get('platformRuntimeDataService');
				var boqMainCommonService = $injector.get('boqMainCommonService');
				var boqMainLineTypes = $injector.get('boqMainLineTypes');
				var boqMainService = $injector.get('boqMainService'); // TODO BH: Get the dataService from the grid controller to have a general approach that works for all boqMainService instances
				var result = true;

				// The referemce number of the root item is currently always regarded as valid and not checked against any rules
				if (boqMainCommonService.isRoot(entity)) {
					return true;
				}

				if (value !== entity.BoqLineTypeFk) {

					// Check if the line type has been changed to a subdescription
					if (boqMainCommonService.isSubDescriptionType(value)) {
						// Bingo, a subdescription is set.
						// For a subdescription needs a lead description as parent we look for it in the predecessing items of the subdescription on
						// the current hierarchy level. If we can find a lead description of position everything is fine, i.e. validation succeeds if not the validation fails.
						var searchConfig = {
							searchPreviousOnly: true,
							searchSameLevelOnly: true,
							includeSelectedItem: false
						};

						if (!boqMainService.findFittingItem(entity, boqMainLineTypes.position, searchConfig)) {
							// TODO BH: Notify the user.
							result = platformDataValidationService.createErrorObject('boq.main.invalidReference', {});// jshint ignore:line
							result.apply = false;
							result.valid = true;
						}
					}
				}

				platformRuntimeDataService.applyValidationResult(result, entity, 'BoqLineTypeFk');
				return platformDataValidationService.finishValidation(result, entity, value, model, service, boqMainService);
			};

			service.scanBoq = function (root, gaebExt) {

				// var gaebPhase = boqMainGaebHelperService.getGaebPhaseByExt(gaebExt);
				var gaebPhase = gaebExt;   // some validation depends also on the
				return $http.get(globals.webApiBaseUrl + 'boq/main/scanboq?boqHeaderId=' + root.BoqHeaderFk + '&gaebPhase=' + gaebPhase).then(function (response) {
					return response.data;
				});
			};

			service.scanBoqAndShowResult = function (root, defaultGaebExt, supressNoErrDialog) {

				var params = {};

				return selectGaebFormat(defaultGaebExt).then(function (gaebType) {

					if (gaebType) {

						service.scanBoq(root, gaebType).then(function (errs) {

							params.data = errs;
							if (!(params.data.length === 0 && supressNoErrDialog)) {
								var modalOptions = {
									templateUrl: globals.appBaseUrl + 'boq.main/templates/boq-main-scan-result.html',
									windowClass: 'form-modal-dialog',
									headerTextKey: 'boq.main.scanResultPopup',
									lazyInit: true,
									resizeable: true,
									params: params,
									showSuccessMsg: params.data.length === 0
								};
								return platformModalService.showDialog(modalOptions);
							}
						});
					}
				});
			};

			function selectGaebFormat(defaultGaebExt) {

				var modalOptions = {
					templateUrl: globals.appBaseUrl + 'boq.main/templates/boq-validate-gaeb.html',
					windowClass: 'form-modal-dialog',
					headerTextKey: 'boq.main.validateGaebExport',
					options: defaultGaebExt
				};
				return platformModalService.showDialog(modalOptions);
			}

			service.scanBoqBeforeExport2Gaeb = function (root, gaebExt) {

				var deferred = $q.defer();
				var params = {};

				if (!gaebExt) {     // todo: open user dialog to select gaebExt
					gaebExt = '.x83';
				}

				service.scanBoq(root, gaebExt).then(function (errs) {

					params.data = errs;
					if (params.data.length === 0) {
						deferred.resolve(true);
					} else {

						var modalOptions = {
							templateUrl: globals.appBaseUrl + 'boq.main/templates/boq-main-scan-result.html',
							windowClass: 'form-modal-dialog',
							headerTextKey: 'boq.main.scanResultPopup',
							lazyInit: true,
							resizeable: true,
							params: params,
							showSuccessMsg: params.data.length === 0
						};
						platformModalService.showDialog(modalOptions).then(function (result) {
							deferred.resolve(result);
						}
						);
					}
				});

				return deferred.promise;

			};

			return service;
		}

	]);

})();
