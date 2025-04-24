/**
 * Created by bh on 08.06.2018
 */

(function () {
	/* global */
	'use strict';

	var modulename = 'boq.main';

	/**
	 * @ngdoc service
	 * @name
	 * @description
	 */
	angular.module(modulename).factory('boqMainRenumberDialogConfigService', [ /* '$translate', */
		function (/* $translate */) {

			var service = {};

			var formConfig = {
				showGrouping: true,
				change: 'change',
				groups: [
					{gid: '1', header: 'Selection', header$tr$: 'boq.main.renumberSelection', isOpen: true, visible: true, sortOrder: 1},
					{gid: '2', header: 'BoQ Structure', header$tr$: 'boq.main.Structure', isOpen: true, visible: true, sortOrder: 2}
				],
				rows: [
					{
						gid: '1', rid: 'selection', label: 'Selection', label$tr$: 'boq.main.renumberSelection',
						type: 'select', model: 'renumberMode',
						options: {
							displayMember: 'Description',
							valueMember: 'Id',
							inputDomain: 'description',
							select: 1,
							items: [
								{Id: 1, Description: ''}, // String is dynamically set in getFromConfig due to translation timing issue
								{Id: 2, Description: ''}  // s.o.
							]
						},
						readonly: false, disabled: false, visible: true, sortOrder: 1
					},
					{
						gid: '2', rid: 'structure details', label: 'Structure Details', label$tr$: 'boq.main.structDetails',
						type: 'directive', model: 'StructureDetails', directive: 'boq-main-boq-structure-details',
						readonly: false, maxlength: 5000, rows: 20, visible: true, sortOrder: 3
					}]
			};

			/**
			 * @ngdoc function
			 * @name getFormConfig
			 * @function
			 * @methodOf boqMainRenumberDialogConfigService
			 * @description Builds and returns the form configuration for the boq renumber dialog
			 * @param {String} renumberAllTranslated is translated string for ''boq.main.renumberModeAll'
			 * @param {String} renumberSelectedTranslated is translated string for ''boq.main.renumberModeSelected'
			 * @return {Object}: deep copy of the built form configuration
			 */
			service.getFormConfig = function (renumberAllTranslated, renumberSelectedTranslated) {

				// For we're in a service here we return a reference of the local variable formConfig in this function when simply returning it.
				// When there are changes done to this config (i.e. changing the readonly state of the rows in the form),
				// those changes are stored to this reference and survive the lifetime of the underlying controller.
				// To avoid this we return a deep copy of the form config so every time we get the same result when calling this function.

				formConfig.rows[0].options.items[0].Description = renumberAllTranslated;
				formConfig.rows[0].options.items[1].Description = renumberSelectedTranslated;

				var deepCopiedFormConfiguration = angular.copy(formConfig);

				return deepCopiedFormConfiguration;
			};

			return service;
		}

	]);

})();