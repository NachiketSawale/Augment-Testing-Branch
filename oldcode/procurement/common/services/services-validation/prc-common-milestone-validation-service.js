(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	angular.module('procurement.common').factory('procurementCommonMilestoneValidationService',
		['platformDataValidationService', '$translate', 'basicsLookupdataLookupDescriptorService', 'platformRuntimeDataService',
			function (platformDataValidationService, $translate, lookupDescriptorService, platformRuntimeDataService) {
				return function (dataService) {
					var service = {};

					// validators
					service.validatePrcMilestonetypeFk = function validatePrcMilestonetypeFk(entity, value, model) {
						var result = platformDataValidationService.isUnique(dataService.getList(), 'PrcMilestonetypeFk', value, entity.Id);
						if(!result.valid){
							result.error$tr$param$ = { object: 'Milestone type'};
						}
						platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
						return result;
					};

					function onEntityCreated(e, item) {
						var result = service.validatePrcMilestonetypeFk(item, item.PrcMilestonetypeFk, 'PrcMilestonetypeFk');
						platformRuntimeDataService.applyValidationResult(result, item, 'PrcMilestonetypeFk');
						dataService.gridRefresh();
					}

					// validate after create new item
					dataService.registerEntityCreated(onEntityCreated);
					var isValidDate;

					service.validateMilestone = function MilestoneValidator(entity, value, model) {

						var result = isValidDate(entity, value);
						platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
						return result;
					};


					var toLocalDate = function toLocalDate(date) {
						date = !angular.isDate(date) ? new Date(date) : date;
						var utcString = date.toUTCString();
						return new Date(utcString);
					};

					isValidDate = function (item, date) {
						var validateResult = {valid: true, error: null, model: 'Milestone'};
						var dataSource = dataService.getList();
						var sourceDate = toLocalDate(date);

						var milestoneTypes = lookupDescriptorService.getData('MilestoneType');

						var sourceMilestone = _.filter(milestoneTypes, {Id: item.PrcMilestonetypeFk})[0];
						var curSortOrder = parseInt(sourceMilestone.Sorting);
						for (var i = 0; i < dataSource.length; i++) {
							var targetMilestone = _.filter(milestoneTypes, {Id: dataSource[i].PrcMilestonetypeFk})[0];
							var targetSortOrder = parseInt(targetMilestone.Sorting);
							if (dataSource[i].Milestone === null) {
								continue;
							}
							if (sourceDate < toLocalDate(dataSource[i].Milestone) && curSortOrder > targetSortOrder) {
								validateResult.valid = false;
								validateResult.error = $translate.instant('procurement.common.milestone.milestoneDateSmallError',
									{
										Source: sourceMilestone.DescriptionInfo.Translated,
										Target: targetMilestone.DescriptionInfo.Translated
									});
								return validateResult;
							} else if (sourceDate > toLocalDate(dataSource[i].Milestone) && curSortOrder < targetSortOrder) {
								validateResult.valid = false;
								validateResult.error = $translate.instant('procurement.common.milestone.milestoneDateBigError',
									{
										Source: sourceMilestone.DescriptionInfo.Translated,
										Target: targetMilestone.DescriptionInfo.Translated
									});
								return validateResult;
							}
						}
						return validateResult;
					};

					return service;
				};
			}
		]);
})(angular);