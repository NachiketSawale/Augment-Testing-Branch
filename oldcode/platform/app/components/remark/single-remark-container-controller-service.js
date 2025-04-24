/**
 * Created by baf 2016-06-21
 */
(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name platformSingleRemarkControllerService
	 * @function
	 *
	 * @description
	 * Service to do the initializing of an single remark container controller
	 **/
	angular.module('platform').service('platformSingleRemarkControllerService', PlatformSingleRemarkControllerService);

	PlatformSingleRemarkControllerService.$inject = ['_', 'platformValidationByDataService'];

	function PlatformSingleRemarkControllerService(_, platformValidationByDataService) {
		function addValidation(configuration, remarkOption, validationService) {
			if (remarkOption.addValidationAutomatically) {
				var remarkModel = remarkOption.remark;

				var syncName = 'validate' + remarkModel;
				var asyncName = 'asyncValidate' + remarkModel;

				if (validationService[syncName]) {
					configuration.remark.validator = validationService[syncName];
				}

				if (validationService[asyncName]) {
					configuration.remark.asyncValidator = validationService[asyncName];
				}
			}
		}

		function createConfiguration(scope, remarkOption, validationService) {
			var configuration = {};
			_.extend(configuration, remarkOption);
			configuration.uuid = scope.getContainerUUID();

			configuration.remark = {
				model: remarkOption.model,
				type: 'remark',
				readonly: remarkOption.readonly || false,
				options: {
					type: 'resizable'
				}
			};
			addValidation(configuration, remarkOption, validationService);

			return configuration;
		}

		this.initController = function ($scope, itemService, validationService, remarkOption) {
			$scope.path = globals.appBaseUrl;
			$scope.currentEntity = itemService.getSelected();
			platformValidationByDataService.registerValidationService(validationService, itemService);
			var remarkConfig = createConfiguration($scope, remarkOption, validationService);

			if (itemService.markCurrentItemAsModified) {
				remarkConfig.dirty = function (entity, model, options) {
					if (!options.isTransient) {
						itemService.markCurrentItemAsModified();
					}
				};
			}

			$scope.remarkContainerOptions = {
				configure: remarkConfig,
				onPropertyChanged: function () {
					itemService.markCurrentItemAsModified();
				}
			};

			var navigationFunctions = {
				onFirstItem: function onFirstItem() {
					itemService.goToFirst();
				},
				onPrevItem: function onPrevItem() {
					itemService.goToPrev();
				},
				onNextItem: function onNextItem() {
					itemService.goToNext();
				},
				onLastItem: function onLastItem() {
					itemService.goToLast();
				}
			};

			if (itemService.isSubItemService()) {
				angular.extend($scope.remarkContainerOptions, navigationFunctions);
			}

			if (itemService.addUsingContainer) {
				itemService.addUsingContainer(remarkConfig.uuid);
			}

			function loadCurrentItem() {
				$scope.currentEntity = itemService.getSelected();

			}

			itemService.registerSelectionChanged(loadCurrentItem);

			// do not forget to unregister your subscription
			$scope.$on('$destroy', function () {
				itemService.unregisterSelectionChanged(loadCurrentItem);
				if (itemService.removeUsingContainer) {
					itemService.removeUsingContainer(remarkConfig.uuid);
				}
			});
		};
	}
})(angular);