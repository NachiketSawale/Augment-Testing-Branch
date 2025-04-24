/**
 * Created by baedeker on 2020-10-21
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc factory
	 * @name cloud.platform.services:platformProvideReducedLayoutService
	 * @description
	 * Provides functionality to create a reduced layout for a given data service by a provided filter
	 */
	angular.module('platform').service('platformProvideReducedLayoutService', PlatformProvideReducedLayoutService);

	PlatformProvideReducedLayoutService.$inject = ['_', 'platformLayoutByDataService', 'platformValidationByDataService',
		'platformTranslateService'];

	function PlatformProvideReducedLayoutService(_, platformLayoutByDataService, platformValidationByDataService,
		platformTranslateService) {

		var self = this;

		this.provideReducedFormLayoutFor = function provideReducedFormLayoutFor(conf) {
			var formLayout = platformLayoutByDataService.provideLayoutFor(conf.dataService);
			var myLayout = {
				fid: conf.layoutFid,
				version: '0.2.4',
				addValidationAutomatically: true,
				showGrouping: true,
				groups: [
					{
						gid: 'allData',
						header: conf.dataService.getTranslatedEntityName(),
						sortOrder: 1,
						isOpen: true,
						visible: true,
						attributes: []
					}],
				rows: []
			};

			var index = 1;
			var validationService = platformValidationByDataService.getValidationServiceByDataService(conf.dataService);
			_.forEach(formLayout.rows, function (row) {
				if (conf.isRequiredField(row)) {

					var newRow = self.provideFieldLayout(row, index, validationService);
					++index;

					myLayout.rows.push(newRow);
					myLayout.groups[0].attributes.push(row.rid);
				}
			});

			platformTranslateService.translateFormConfig(myLayout);

			return {
				title: platformTranslateService.instant('cloud.common.taskBarNewRecord', undefined, true),
				dataItem: conf.dataEntity,
				formConfiguration: myLayout
			};
		};

		this.provideFieldLayout = function provideFieldLayout(row, index, validationService) {
			var newRow = {};
			_.extend(newRow, row);
			newRow.sortOrder = index;
			newRow.gid = 'allData';

			var rowModel = row.model.replace(/\./g, '$');

			var syncName = 'validate' + rowModel;
			var asyncName = 'asyncValidate' + rowModel;

			if (validationService[syncName]) {
				newRow.validator = validationService[syncName];
			}

			if (validationService[asyncName]) {
				newRow.asyncValidator = validationService[asyncName];
			}

			return newRow;
		};
	}
})(angular);
