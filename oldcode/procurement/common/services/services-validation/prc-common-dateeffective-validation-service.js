(function (angular) {
	'use strict';
	/* global _, globals */
	var moduleName = 'procurement.common';

	angular.module(moduleName).service('procurementCommonDateEffectiveValidateService', [
		'$q',
		'$http',
		'$timeout',
		'$injector',
		'$translate',
		'platformModuleStateService',
		'platformRuntimeDataService',
		'platformDataValidationService',
		'platformModalService',
		function (
			$q,
			$http,
			$timeout,
			$injector,
			$translate,
			platformModuleStateService,
			platformRuntimeDataService,
			platformDataValidationService,
			platformModalService
		) {
			var self = this;

			/**
			 * asyncModifyDateEffectiveAndUpdateBoq
			 * @param entity
			 * @param value
			 * @param model
			 * @param boqDataService
			 * @param dataService
			 * @param validateService
			 * @param headerData
			 * @returns {*}
			 */
			self.asyncModifyDateEffectiveAndUpdateBoq = function asyncModifyDateEffectiveAndUpdateBoq(entity, value, model, boqDataService, dataService, validateService, headerData) {

				var defer = $q.defer();

				var originalDateEffective = entity[model];

				if (entity.version === 0 || entity.Version === 0) {
					defer.resolve(true);
					return defer.promise;
				} else {
					if (originalDateEffective.valueOf() === value.valueOf()) {
						defer.resolve(true);
						return defer.promise;
					}
					entity[model] = value;
					var yseResult = {apply: false, valid: true};

					platformRuntimeDataService.applyValidationResult(yseResult, entity, model);

					platformDataValidationService.finishValidation(yseResult, entity, value, model, validateService, dataService);

					defer.promise = platformModalService.showYesNoDialog('procurement.common.changeDateEffectiveConConfirm', 'procurement.common.changeDateEffectiveHead').then(function (result) {
						if (result.yes) {
							//dataService.markItemAsModified(entity);
							dataService.update().then(function () {
								let postData = _.assign({
									ProjectId: -1,
									BoqHeaderId: null,
									Module: 'boq.main',
									HeaderId: null,
									ExchangeRate: null,
									IsBaseOnCorrectedUPGross: false
								}, headerData);
								$http.post(globals.webApiBaseUrl + 'boq/main/updateboqbydateeffective', postData).then(function () {
									if (_.isFunction(dataService.refresh)) {
										dataService.refresh();
									}
								});
							});
						}
						return true;
					});
					return defer.promise;
				}
			};
		}
	]);
})(angular);