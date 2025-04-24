(function (angular) {
	/* global globals */
	'use strict';
	const modName = 'project.inforequest';
	angular.module(modName).service( 'projectInfoRequestContributionConfigService', ProjectInfoRequestContributionConfigService);

	ProjectInfoRequestContributionConfigService.$inject = ['_', 'basicsLookupdataSimpleLookupService', 'platformStatusIconService', 'projectInfoRequestDataService'];

	function ProjectInfoRequestContributionConfigService(_, simpleLookupService, iconService, projectInfoRequestDataService) {
		let self = this;
		const simpleLookupQualifier = 'basics.customize.rficontributiontype';

		function getConfigurationStates() {
			let states = simpleLookupService.getListSync({ lookupModuleQualifier: simpleLookupQualifier });
			return _.filter(states, function (state) {
				return state.isLive;
			});
		}

		self.getConfig = function () {
			let currentInfoRequestItems = projectInfoRequestDataService.getSelectedEntities();
			let isPinBoardReadonly = currentInfoRequestItems.some(function (e) {
				return e.IsStatusReadOnly;
			});

			return {
				lastUrl: globals.webApiBaseUrl + 'project/rfi/requestcontribution/last',
				remainUrl: globals.webApiBaseUrl + 'project/rfi/requestcontribution/remain',
				createUrl: globals.webApiBaseUrl + 'project/rfi/requestcontribution/createContribution',
				deleteUrl: globals.webApiBaseUrl + 'project/rfi/requestcontribution/deleteContribution',

				isPinBoardReadonly,

				columns: [
					{
						id: 'indicator',
						field: 'ClerkFk'
					},
					{
						id: 'header',
						field: 'ClerkFk'
					},
					{
						id: 'body',
						field: 'Specification'
					},
					{
						id: 'date',
						field: 'InsertedAt'
					},
					{
						id: 'status',
						field: 'RequestContributionTypeFk',
						converter: function (field, value) {
							if (value) {
								// works because items are load in module resolver
								let item = simpleLookupService.getItemByIdSync(value, {
									lookupModuleQualifier: simpleLookupQualifier,
									displayMember: 'Description',
									valueMember: 'Id'
								});
								let src = iconService.select(item);

								return iconService.isCss() ? '<i class="block-image ' + src + '" style="margin-right: 3px;"></i>' : '<img class="block-image" style="margin-right: 3px;"  src="' + src + '" />';
							}
						}
					}
				],
				entityName: 'Contributions',
				dateProp: 'InsertedAt',
				statusOptions: {
					// works because items are load in module resolver
					items: getConfigurationStates(),
					valueMember: 'Id',
					labelMember: 'Description',
					showImage: true,
					viewValue: 1,
					statusViewValueHandler: function (parentItem) {
						// offers a answer when parent is a question
						if (parentItem.RequestContributionTypeFk === 1) {
							return 2;
						}
						return 1;
					}
				},
				saveParentBefore: true
			};
		};
	}
})(angular);
