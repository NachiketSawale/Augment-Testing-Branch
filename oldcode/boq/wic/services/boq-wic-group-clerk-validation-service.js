/**
 * Created by Helmut Buck on 27.03.2018.
 */

(function (angular) {
	/* global _ */
	'use strict';

	var moduleName = 'boq.wic';

	/**
	 * @ngdoc service
	 * @name boqWicGroupClerkValidationService
	 * @description provides validation methods for boq wic group clerk entities
	 */
	angular.module(moduleName).service('boqWicGroupClerkValidationService', BoqWicGroupClerkValidationService);

	BoqWicGroupClerkValidationService.$inject = ['boqWicGroupClerkService', 'platformDataValidationService', 'basicsCustomClerkRoleLookupDataService'];

	function BoqWicGroupClerkValidationService(boqWicGroupClerkService, platformDataValidationService, basicsCustomClerkRoleLookupDataService) {
		var self = this;

		function doIntersect(l, r) {
			return l.ValidFrom <= r.ValidFrom && l.ValidTo > r.ValidFrom || l.ValidFrom < r.ValidTo && l.ValidTo >= r.ValidTo || l.ValidFrom > r.ValidFrom && l.ValidTo < r.ValidTo;
		}

		this.validateClerkRoleFk = function validateClerkRoleFk(entity, value, model) {
			var res = true;
			if (!value) {
				res = {
					apply: false, valid: false, error: 'Clerk role must be set'
				};
			} else {
				var cr = basicsCustomClerkRoleLookupDataService.getItemById(value, {lookupType: 'basicsCustomClerkRoleLookupDataService'});
				if (cr && cr.Isunique) {
					var recsWithSameRole = _.filter(boqWicGroupClerkService.getList(), function (cl) {
						return cl.ClerkRoleFk === value;
					});

					if (recsWithSameRole && recsWithSameRole.length) {
						if (entity.ValidFrom && entity.ValidTo) {
							var overlapping = _.filter(boqWicGroupClerkService.getList(), function (cl) {
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
						apply: true, valid: false, error: 'Clerk role must be unique'
					};
				}
			}

			return platformDataValidationService.finishValidation(res, entity, value, model, self, boqWicGroupClerkService);
		};

		this.validateValidFrom = function validateValidFrom(entity, value, model) {
			return platformDataValidationService.validatePeriod(value, entity.ValidTo, entity, model, self, boqWicGroupClerkService, 'ValidTo');
		};

		this.validateValidTo = function validateValidTo(entity, value, model) {
			return platformDataValidationService.validatePeriod(entity.ValidFrom, value, entity, model, self, boqWicGroupClerkService, 'ValidFrom');
		};
	}
})(angular);
