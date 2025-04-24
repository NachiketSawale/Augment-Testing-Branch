(function (angular) {
	/* global globals */
	'use strict';
	const modName = 'change.main';
	angular.module(modName).service('changeMainContributionConfigService', ChangeMainContributionConfigService);

	ChangeMainContributionConfigService.$inject = ['_', 'basicsLookupdataSimpleLookupService', 'platformStatusIconService'];

	function ChangeMainContributionConfigService(_, simpleLookupService, iconService) {
		let self = this;
		const simpleLookupQualifier = 'basics.customize.projectchangecontributiontype';

		function getConfigurationStates() {
			let states = simpleLookupService.getListSync({ lookupModuleQualifier: simpleLookupQualifier });
			return _.filter(states, function (state) {
				return state.isLive;
			});
		}

		self.getConfig = function () {


			return {
				lastUrl: globals.webApiBaseUrl + 'change/main/changecontribution/last',
				remainUrl: globals.webApiBaseUrl + 'change/main/changecontribution/remain',
				createUrl: globals.webApiBaseUrl + 'change/main/changecontribution/createContribution',

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
						field: 'ChangeContributionTypeFk',
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
						if (parentItem.ChangeContributionTypeFk === 1) {
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
