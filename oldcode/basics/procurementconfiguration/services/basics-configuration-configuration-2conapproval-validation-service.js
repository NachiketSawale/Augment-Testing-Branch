/**
 * Created by lvy on 9/23/2020.
 */
(function () {
	'use strict';
	/*global _*/

	var modName = 'basics.procurementconfiguration';
	angular.module(modName).service('basPrcConfig2ConApprovalValidationService', [
		'$translate',
		'basicsCustomClerkRoleLookupDataService',
		'basPrcConfig2ConApprovalDataService',
		'platformDataValidationService',
		'platformRuntimeDataService',
		function(
			$translate,
			basicsCustomClerkRoleLookupDataService,
			dataService,
			platformDataValidationService,
			platformRuntimeDataService
		) {
			var self = this;

			function doIntersect(l, r) {
				return l.ValidFrom <= r.ValidFrom && l.ValidTo > r.ValidFrom || l.ValidFrom < r.ValidTo && l.ValidTo >= r.ValidTo || l.ValidFrom > r.ValidFrom && l.ValidTo < r.ValidTo;
			}

			function doValidateClerkAndRole(entity, value, model, compositeModel, compositeValue, message1){
				var res = true;
				if (!value) {
					res = true;
				} else {
					var roleFkValue = model === 'ClerkRoleFk' ? value : compositeValue;
					var cr = basicsCustomClerkRoleLookupDataService.getItemById(roleFkValue, {lookupType: 'basicsCustomClerkRoleLookupDataService'});
					if (cr && cr.IsUnique) {
						var recsWithSameRole = _.filter(dataService.getList(), function (cl) {
							return cl[model] === value && cl[compositeModel] === compositeValue;
						});

						if (recsWithSameRole && recsWithSameRole.length) {
							if (entity.ValidFrom && entity.ValidTo) {
								var overlapping = _.filter(dataService.getList(), function (cl) {
									return doIntersect(entity, cl);
								});

								if (overlapping && overlapping.length) {
									res = false;
								}
							} else {
								res = false;
							}
						}
					}

					if (!res) {
						res = {
							apply: true, valid: false, error: message1
						};
					} else {
						platformDataValidationService.removeFromErrorList(entity, compositeModel, self, dataService);
						platformRuntimeDataService.applyValidationResult(true, entity, compositeModel);
					}
				}

				return platformDataValidationService.finishValidation(res, entity, value, model, self, dataService);
			}

			self.validateClerkRoleFk = function validateClerkRoleFk(entity, value, model) {
				var notUniqueMessage = $translate.instant('basics.common.clerkRoleMustBeUnique');
				return doValidateClerkAndRole(entity, value, model,'ClerkFk', entity.ClerkFk, notUniqueMessage);
			};
		}
	]);
})();