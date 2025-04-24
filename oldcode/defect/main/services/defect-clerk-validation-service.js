/**
 * Created by pel on 5/10/2019.
 */
/* global  _ */
(function (angular) {
	'use strict';

	var moduleName = 'defect.main';

	/**
     * @ngdoc service
     * @name defectProjectValidationService
     * @description provides validation methods for defect clerk entities
     */
	angular.module(moduleName).service('defectClerkValidationService', DefectClerkValidationService);

	DefectClerkValidationService.$inject = ['defectClerkService', 'platformDataValidationService', 'basicsCustomClerkRoleLookupDataService'];

	function DefectClerkValidationService(defectClerkService, platformDataValidationService, basicsCustomClerkRoleLookupDataService) {
		var self = this;

		function doIntersect(l, r) {
			return l.ValidFrom <= r.ValidFrom && l.ValidTo > r.ValidFrom || l.ValidFrom < r.ValidTo && l.ValidTo >= r.ValidTo || l.ValidFrom > r.ValidFrom && l.ValidTo < r.ValidTo;
		}

		this.validateClerkRoleFk = function validateClerkRoleFk(entity, value, model) {
			var res = true;
			if(!value) {
				res = {
					apply: false, valid: false, error: 'Clerk role must be set'
				};
			}
			else {
				var cr = basicsCustomClerkRoleLookupDataService.getItemById(value, { lookupType: 'basicsCustomClerkRoleLookupDataService' });
				if(cr && cr.Isunique) {
					var recsWithSameRole = _.filter(defectClerkService.getList(), function(cl) {
						return cl.ClerkRoleFk === value;
					});

					if(recsWithSameRole && recsWithSameRole.length) {
						if(entity.ValidFrom && entity.ValidTo) {
							var overlapping = _.filter(defectClerkService.getList(), function(cl) {
								return doIntersect(entity, cl);
							});

							if(overlapping && overlapping.length) {
								res = false;
							}
						}
						else {
							res = false;
						}
					}
				}

				if(!res) {
					res = {
						apply: true, valid: false, error: 'Clerk role must be unique'
					};
				}
			}

			return platformDataValidationService.finishValidation(res, entity, value, model, self, defectClerkService);
		};

		this.validateValidFrom = function validateValidFrom(entity, value, model) {
			return platformDataValidationService.validatePeriod(value, entity.ValidTo, entity, model, self, defectClerkService, 'ValidTo');
		};

		this.validateValidTo = function validateValidTo(entity, value, model) {
			return platformDataValidationService.validatePeriod(entity.ValidFrom, value, entity, model, self, defectClerkService, 'ValidFrom');
		};
	}
})(angular);

