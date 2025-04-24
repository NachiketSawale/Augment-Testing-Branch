/**
 * Created by baf on 04.09.2014.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsClerkMainService
	 * @function
	 *
	 * @description
	 * basicsClerkMainService is the data service for all clerk related functionality.
	 */
	var moduleName = 'basics.clerk';
	var clerkModule = angular.module(moduleName);
	clerkModule.factory('basicsClerkClerkFilterTypeForWorkflowComboboxService', ['$q','$translate', '$http', '_', 'platformTranslateService','PlatformMessenger',
		function ($q,$translate, $http, _, platformTranslateService,PlatformMessenger) {

			var service = {};

			var allIsTranslated = false;
			var translationLoaded = false;
			var options = [
				{
					Id: 0,
					Description: 'Current Project',
					IsTranslated: false,
					DescriptionTr: 'basics.clerk.filterTypeForWorkflow.currentProject'
				},
				{
					Id: 1,
					Description: 'Current Company',
					IsTranslated: false,
					DescriptionTr: 'basics.clerk.filterTypeForWorkflow.currentCompany'
				},
				{
					Id: 2,
					Description: 'Other Company',
					IsTranslated: false,
					DescriptionTr: 'basics.clerk.filterTypeForWorkflow.otherCompany'
				}
			];
			platformTranslateService.translationChanged.register(load);

			platformTranslateService.registerModule('basics.clerk', true).then(load);

			function load() {
				translationLoaded = true;
				translateAllItems();
				service.translationChanged.fire();
			}

			function translateAllItems() {
				if (allIsTranslated || !translationLoaded) {
					return;
				}

				angular.forEach(options, function (item) {
					translateItem(item);
				});
				allIsTranslated = true;
			}

			function translateItem(item) {
				if (!item || item.IsTranslated || !translationLoaded) {
					return;
				}
				item.Description = $translate.instant(item.DescriptionTr);
				item.IsTranslated = true;
			}

			service.getList = function () {
				if (!allIsTranslated) {
					translateAllItems();
				}
				return $q.when(options);
			};

			service.getItemByKey = function (key) {
				var item = _.find(options, {Id: key});
				translateItem(item);
				return $q.when(item);
			};

			service.translationChanged = new PlatformMessenger();

			return service;

		}]);
})(angular);
