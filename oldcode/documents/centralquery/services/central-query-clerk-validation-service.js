/**
 * Created by pel on 1/3/2020.
 */

(function (angular) {
	'use strict';
	/* global ,_ */
	var moduleName = 'documents.centralquery';

	/**
	 * @ngdoc service
	 * @name centralQueryClerkValidationService
	 * @description provides validation methods for project document clerk entities
	 */
	angular.module(moduleName).service('centralQueryClerkValidationService', CentralQueryClerkValidationService);

	CentralQueryClerkValidationService.$inject = ['centralQueryClerkService', 'platformDataValidationService', 'basicsCustomClerkRoleLookupDataService'];

	function CentralQueryClerkValidationService(centralQueryClerkService, platformDataValidationService, basicsCustomClerkRoleLookupDataService) {
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
					var recsWithSameRole = _.filter(centralQueryClerkService.getList(), function (cl) {
						return cl.ClerkRoleFk === value;
					});

					if (recsWithSameRole && recsWithSameRole.length) {
						if (entity.ValidFrom && entity.ValidTo) {
							var overlapping = _.filter(centralQueryClerkService.getList(), function (cl) {
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

			return platformDataValidationService.finishValidation(res, entity, value, model, self, centralQueryClerkService);
		};

		this.validateValidFrom = function validateValidFrom(entity, value, model) {
			return platformDataValidationService.validatePeriod(value, entity.ValidTo, entity, model, self, centralQueryClerkService, 'ValidTo');
		};

		this.validateValidTo = function validateValidTo(entity, value, model) {
			return platformDataValidationService.validatePeriod(entity.ValidFrom, value, entity, model, self, centralQueryClerkService, 'ValidFrom');
		};
	}
})(angular);

