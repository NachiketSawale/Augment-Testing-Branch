/**
 * Created by shen on 6/16/2021
 */

(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.worktimemodel';

	/**
	 * @ngdoc service
	 * @name timekeepingWorkTimeModelDtlValidationService
	 * @description provides validation methods for timekeeping work time model detail entities
	 */
	angular.module(moduleName).service('timekeepingWorkTimeModelDtlValidationService', TimekeepingWorkTimeModelDtlValidationService);

	TimekeepingWorkTimeModelDtlValidationService.$inject = ['_', 'platformValidationServiceFactory', 'timekeepingWorkTimeModelConstantValues', 'timekeepingWorkTimeModelDtlDataService','platformDataValidationService',
		'platformValidationRevalidationEntitiesFactory'];

	function TimekeepingWorkTimeModelDtlValidationService(_, platformValidationServiceFactory, timekeepingWorkTimeModelConstantValues, timekeepingWorkTimeModelDtlDataService,platformDataValidationService,
		platformValidationRevalidationEntitiesFactory) {
		let self = this;

		platformValidationServiceFactory.addValidationServiceInterface({ typeName: 'WorkTimeModelDtlDto', moduleSubModule: 'Timekeeping.WorkTimeModel'}, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties({ typeName: 'WorkTimeModelDtlDto', moduleSubModule: 'Timekeeping.WorkTimeModel'})
		},
		self,
		timekeepingWorkTimeModelDtlDataService);

		platformValidationRevalidationEntitiesFactory.addValidationServiceInterface(timekeepingWorkTimeModelConstantValues.schemes.dtl,  {
			customValidations: [
				{
					model: 'IsLive',
					validation: validateIsLive,
					revalidateGrid: [{ model: 'IsLive' }],
				}],
			globals: {
				revalidateCellIOnlyIfHasError: false,
				revalidateOnlySameEntity: false
			}
		},
		self,
		timekeepingWorkTimeModelDtlDataService);

		let changedIsLiveValue = false;

		function removeSeconds (dateString) {
			let splittedDateString = dateString.split(':');
			// remove the seconds and milliseconds from date
			return splittedDateString.slice(0,-1).join(':');
		}

		function validateIsLive(entity, value, model, itemList) {
			let selectedItem = timekeepingWorkTimeModelDtlDataService.getSelected();

			let res = {
				apply: true,
				valid: false,
				error: '...',
				error$tr$: ''
			};

			if (entity.Id === selectedItem.Id) {
				changedIsLiveValue = value;

				// TODO
				// For some reason the grid is updated with the old data if gridRefresh is called in the same thread...
				setTimeout(function () {
					timekeepingWorkTimeModelDtlDataService.gridRefresh();
				}, 1);
			}

			// Check if there are any active items left after the change

			let liveItems = _.filter(itemList, function (item) {
				return item.Id === selectedItem.Id ? changedIsLiveValue : item.IsLive;
			});

			if (liveItems.length < 1) {
				// There are no active items left after the change
				// Therefore all items are invalid

				res.error$tr$ = 'timekeeping.worktimemodel.errorNeedsOneIsLive';
			}
			else if (entity.Id === selectedItem.Id ? !changedIsLiveValue : !entity.IsLive) {
				// There is at least one active item left after the change and it's not the one that is currently being validated
				// Therefore the current item is valid

				res.valid = true;
			}
			else {
				// There is at least one active item left after the change
				// The item that is currently being validated is active
				// Therefore we should check if there are other active items with the same ValidFrom date

				let entityValidFromWithoutSeconds = removeSeconds(entity.ValidFrom._i);
				let itemsWithEqualValidFrom = _.filter(itemList, function (item) {
					return (item.Id === selectedItem.Id ? changedIsLiveValue : item.IsLive) && removeSeconds(item.ValidFrom._i) === entityValidFromWithoutSeconds;
				});

				if (itemsWithEqualValidFrom.length > 1) {
					// At least one other active item with the same ValidFrom date was found
					// Therefore the whole group is invalid

					res.error$tr$ = 'timekeeping.worktimemodel.errorOnlyOneIsLive';
				}
				else {
					// No other active items with the same ValidFrom date were found
					// Therefore the current item is valid

					res.valid = true;
				}
			}

			return platformDataValidationService.finishValidation(res, entity, value, model, self, timekeepingWorkTimeModelDtlDataService);
		}

	}
})(angular);
