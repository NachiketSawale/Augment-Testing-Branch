// DEV-31365 ALM:124051 & ALM:109277 break the code lookup lookup logic, so add a new one.
( function (angular) {

	'use strict';

	var moduleName = 'basics.characteristic';

	/**
	 * @ngdoc service
	 * @name basicsCharacteristicCodeLookup
	 * @function
	 *
	 * @description
	 * lookup for characteristic code combo with popup
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).directive('basicsCharacteristicCodeLookupByGroup',
		['basicsCharacteristicCodeLookupService',
			'$q',
			'platformModalService',
			'BasicsLookupdataLookupDirectiveDefinition',
			'$templateCache',
			'$injector',
			'basicsLookupdataLookupFilterService',
			'basicsCharacteristicPopupGroupService',
			'basicsCharacteristicMainService',
			'basicsCharacteristicCharacteristicService',
			function (basicsCharacteristicCodeLookupService,
				$q,
				platformModalService,
				BasicsLookupdataLookupDirectiveDefinition,
				$templateCache,
				$injector,
				basicsLookupdataLookupFilterService,
				basicsCharacteristicPopupGroupService,
				basicsCharacteristicMainService,
				parentService) {

				var defaults = {
					lookupType: 'basicsCharacteristicCodeLookup',
					valueMember: 'Id',
					displayMember: 'DescriptionInfo.Description',
					uuid: 'af78a8c028c246f898e8a3922b25f536',
					columns: [
						{ id: 'code', field: 'Code', name: 'Code', formatter: 'code', width: 80, name$tr$: 'cloud.common.entityCode' },
						{ id: 'desc', field: 'DescriptionInfo.Description', name: 'Description', width: 150, name$tr$: 'cloud.common.entityDescription' }
					],
					width: 500,
					height: 200,
					disableDataCaching : true
				};

				function getList() {

					var entity = basicsCharacteristicMainService.getSelected(); // group
					var groupId = (entity !== null) ? entity.Id : null;

					var parentEntity = parentService.getSelected(); // characteristic
					var parentId = (parentEntity !== null) ? parentEntity.Id : null;

					return basicsCharacteristicCodeLookupService.getListByGroup(groupId, parentId);

				}

				return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {

					dataProvider: {

						getList: getList,

						getItemByKey: function (value) {

							return basicsCharacteristicCodeLookupService.getById(value);

						},

						getSearchList: getList
					},
					/* jshint -W098*/
					controller: ['$scope', function ($scope) { // do external logic to specific lookup directive controller here.

						// region module vars

						var template = null;

						var init = function()  {
							$templateCache.loadTemplateFile('basics.characteristic/templates/basics-characteristic-code-popup.html').then(function() {
								// sectionId will be passed by basicsCharacteristicCodeLookupService setter!
								// pass the sectionId to the popup controller
								template = $templateCache.get('basics-characteristic-code-popup.html');
							});

						};
						init();

					}]
				});

			}
		]);
})(angular);
