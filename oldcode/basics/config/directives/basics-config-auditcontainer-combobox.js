/**
 * Created by reimer on 16.01.2018.
 */

(function (angular) {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name
	 * @requires
	 * @description
	 */

	var moduleName = 'basics.config';

	angular.module(moduleName).directive('basicsConfigAuditContainerCombobox', [
		'$q',
		'BasicsLookupdataLookupDirectiveDefinition',
		'basicsConfigAuditContainerLookupService',
		'basicsConfigMainService',
		function ($q,
		          BasicsLookupdataLookupDirectiveDefinition,
		          dataService,
		          basicsConfigMainService) {

			var defaults = {
				lookupType: dataService.getlookupType(),
				valueMember: 'ContainerUuid',
				displayMember: 'DescriptionInfo.Description',
				uuid: '6f1b4270feb34780bb4643685cb79a6f',
				onDataRefresh: function () {
					dataService.refresh();
				}
			};

			var _selectedModule = null;   // buffer for currently selected module
			var onModuleChanged = function (p0, entity) {
				_selectedModule = entity.InternalName;   // e.g. scheduling.template
			};
			basicsConfigMainService.registerSelectionChanged(onModuleChanged);

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {

				dataProvider: {

					getList: function() {

						return dataService.getList(_selectedModule);
					},

					getItemByKey: function (value) {

						return dataService.getItemByKey(value);
					}

				}
			});
		}
	]);

})(angular);

