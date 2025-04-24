/**
 * Created by chi on 12.03.2021.
 */

(function (angular) {

	'use strict';

	let moduleName = 'procurement.rfq';

	angular.module(moduleName).factory('procurementRfqBusinessPartner2ContactLayout', procurementRfqBusinessPartner2ContactLayout);

	procurementRfqBusinessPartner2ContactLayout.$inject = [];

	function procurementRfqBusinessPartner2ContactLayout() {
		return {
			'fid': 'procurement.rfq.businesspartner.contact.detailform',
			'version': '1.0.0',
			'showGrouping': true,
			addValidationAutomatically: true,
			groups: [
				{
					'gid': 'basicData',
					'attributes': ['contactfk']
				},
				{
					'gid': 'entityHistory',
					'isHistory': true
				}
			],
			overloads: {
				'contactfk': {
					'detail': {
						'label': 'Last Name',
						'label$tr$': 'businesspartner.main.familyName',
						'type': 'directive',
						'directive': 'business-partner-main-contact-dialog-without-teams',
						'options': {
							displayMember: 'FamilyName',
							filterKey: 'procurement-rfq-businesspartner-contact-filter'
						}
					},
					'grid': {
						name: 'Last Name',
						name$tr$: 'businesspartner.main.familyName',
						editor: 'lookup',
						editorOptions: {
							directive: 'business-partner-main-contact-dialog-without-teams',
							lookupOptions: {
								filterKey: 'procurement-rfq-businesspartner-contact-filter',
								displayMember: 'FamilyName'
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'contact',
							displayMember: 'FamilyName'
						},
						width: 120
					}
				}
			},
			'addition': {
				'grid': [
					{
						lookupDisplayColumn: true,
						id: 'ContactFirstName',
						field: 'ContactFk',
						name: 'First Name',
						name$tr$: 'businesspartner.main.firstName',
						editor: 'lookup',
						editorOptions: {
							directive: 'business-partner-main-contact-dialog',
							lookupOptions: {
								filterKey: 'procurement-rfq-businesspartner-contact-filter',
								displayMember: 'FirstName'
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'contact',
							displayMember: 'FirstName'
						},
						width: 120,
						grouping: {
							// title: translationGrid.initial,
							title$tr$: 'procurement.rfq.rfqBusinessPartnerContactFirstName',
							getter: 'ContactFk',
							aggregators: [],
							aggregateCollapsed: true
						}
					}
				],
				'detail': [
					{
						lookupDisplayColumn: true,
						'rid': 'contactFirstName',
						'gid': 'basicData',
						'model': 'ContactFk',
						'label': 'First Name',
						'label$tr$': 'businesspartner.main.firstName',
						'type': 'directive',
						'directive': 'business-partner-main-contact-dialog',
						'options': {
							displayMember: 'FirstName',
							filterKey: 'procurement-rfq-businesspartner-contact-filter'
						}
					}
				]
			}
		};
	}

	angular.module(moduleName).factory('procurementRfqBusinessPartner2ContactUIStandardService', procurementRfqBusinessPartner2ContactUIStandardService);
	procurementRfqBusinessPartner2ContactUIStandardService.$inject = [
		'platformUIStandardConfigService',
		'platformSchemaService',
		'procurementRfqBusinessPartner2ContactLayout',
		'procurementRfqTranslationService',
		'platformUIStandardExtentService',
		'businessPartnerMainContactUIStandardService',
		'_',
		'procurementRfqBpContactExcludeModelValue'
	];

	function procurementRfqBusinessPartner2ContactUIStandardService(platformUIStandardConfigService,
		platformSchemaService,
		procurementRfqBusinessPartner2ContactLayout,
		procurementRfqTranslationService,
		platformUIStandardExtentService,
		businessPartnerMainContactUIStandardService,
		_,
		procurementRfqBpContactExcludeModelValue) {

		let BaseService = platformUIStandardConfigService;
		let domains = platformSchemaService.getSchemaFromCache({ typeName: 'RfqBusinessPartner2ContactDto', moduleSubModule: 'Procurement.RfQ' }).properties;
		let service = new BaseService(procurementRfqBusinessPartner2ContactLayout, domains, procurementRfqTranslationService);
		platformUIStandardExtentService.extend(service, procurementRfqBusinessPartner2ContactLayout.addition, domains);

		let contactColumns = angular.copy(businessPartnerMainContactUIStandardService.getStandardConfigForListView().columns);
		let contactDetailView = businessPartnerMainContactUIStandardService.getStandardConfigForDetailView();
		let contactRows = angular.copy(contactDetailView.rows);

		let columns = service.getStandardConfigForListView().columns;
		let detailView = service.getStandardConfigForDetailView();
		let groups = detailView.groups;
		let rows = detailView.rows;

		_.forEach(contactColumns, function (col) {
			if (!_.includes(procurementRfqBpContactExcludeModelValue, col.field)) {
				if (col.editor) {
					col.editor = null;
					if (col.editorOptions) {
						col.editorOptions = null;
					}
				}
				columns.push(col);
			}
		});

		let historyGroup = _.find(groups, {gid: 'entityHistory'});
		let historyIndex = _.indexOf(groups, historyGroup);
		_.forEach(contactRows, function (row) {
			if (!_.includes(procurementRfqBpContactExcludeModelValue, row.model) && row.gid !== 'entityHistory') {
				row.readonly = true;
				if (row.directive === 'basics-common-telephone-dialog' || row.directive === 'basics-common-address-dialog') {
					if (row.options) {
						row.options.showClearButton = false;
						if (row.options.lookupOptions) {
							row.options.lookupOptions.showClearButton = false;
						}
						row.options.hideEditButton = true;
					}
				}
				rows.push(row);

				if (!_.some(groups, {gid: row.gid})) {
					let group = _.find(contactDetailView.groups, {gid: row.gid});
					if (group) {
						let newGroup = angular.copy(group);
						newGroup.sortOrder = historyGroup.sortOrder;
						groups.splice(historyIndex++, 0, newGroup);
						historyGroup.sortOrder++;
					}
				}
			}
		});

		return service;
	}
})(angular);