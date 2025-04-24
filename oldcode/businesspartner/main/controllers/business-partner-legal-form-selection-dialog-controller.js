/**
 * Created by chi on 9/17/2021.
 */

(function (angular) {
	'use strict';
	let moduleName = 'businesspartner.main';

	angular.module(moduleName).controller('businessPartnerMainLegalFormDialogController', businessPartnerMainLegalFormDialogController);

	businessPartnerMainLegalFormDialogController.$inject = [
		'$scope',
		'$translate',
		'$injector',
		'_',
		'basicsLookupdataConfigGenerator',
		'basicsLookupdataSimpleLookupService',
		'basicsLookupdataLookupFilterService'
	];

	function businessPartnerMainLegalFormDialogController(
		$scope,
		$translate,
		$injector,
		_,
		basicsLookupdataConfigGenerator,
		basicsLookupdataSimpleLookupService,
		basicsLookupdataLookupFilterService
	) {
		if (!$scope.modalOptions || !$scope.modalOptions.entity || !$scope.modalOptions.service) {
			throw new Error('modalOptions and entity should not be null.');
		}

		const options = $scope.modalOptions;
		options.headerText = $translate.instant('businesspartner.main.legalFormDialogTitle');
		options.cancel = cancel;
		options.ok = ok;
		let service = $injector.get(options.service);

		let formOptions = {
			showGrouping: false,
			skipPermissionCheck: true,
			groups: [{
				gid: '1',
				header: '',
				isOpen: true,
				sortOrder: 1
			}],
			rows: [
				buildCountryConfig(),
				buildLegalFormConfig()
			]
		};

		let filters = [
			{
				key: 'bp-legal-form-country-filter',
				fn: function (item) {
					if (!item) {
						return false;
					}

					let countryIds = getValidCountryIds();
					if (!angular.isArray(countryIds) || countryIds.length === 0) {
						return false;
					}

					var found = _.find(countryIds, function (id) {
						return item.Id === id;
					});

					return !!found;
				}
			},
			{
				key: 'bp-legal-form-legal-form-filter',
				fn: function (item, context) {
					if (!item || !context) {
						return false;
					}
					if (item.BasCountryFk) {
						return item.BasCountryFk === context.countryFk;
					} else {
						return !context.countryFk;
					}
				}
			}
		];

		_.each(filters, function (filter) {
			if (!basicsLookupdataLookupFilterService.hasFilter(filter.key)) {
				basicsLookupdataLookupFilterService.registerFilter(filter);
			}
		});

		$scope.item = {
			countryFk: getDefaultCountryFk(),
			legalFormFk: options.entity.LegalFormFk
		};

		$scope.selectionOptions = {
			configure: formOptions
		};

		// ///////////////////////////////

		function getDefaultCountryFk() {
			if (!options.entity.LegalFormFk) {
				let countryIds = getValidCountryIds();
				if (!angular.isArray(countryIds) || countryIds.length === 0) {
					return null;
				} else {
					if (options.entity.SubsidiaryDescriptor && options.entity.SubsidiaryDescriptor.AddressDto && options.entity.SubsidiaryDescriptor.AddressDto.CountryFk) {
						let tempCountryId = options.entity.SubsidiaryDescriptor.AddressDto.CountryFk;
						let found = _.find(countryIds, function (id) {
							return id === tempCountryId;
						});
						return found ? found.Id : null;
					}
				}
				return null;
			}

			let items = basicsLookupdataSimpleLookupService.getListSync({lookupModuleQualifier: 'businesspartner.legal.form', displayMember: 'Description', valueMember: 'Id'});
			if (angular.isArray(items)) {
				let legalForm = _.find(items, {Id: options.entity.LegalFormFk});
				if (legalForm) {
					return legalForm.BasCountryFk;
				}
			}

			return null;
		}

		function buildCountryConfig() {
			let config = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.lookup.country', null,
				{
					showClearButton: true,
					filterKey: 'bp-legal-form-country-filter'
				});
			let detail = config.detail;
			detail.gid = '1';
			detail.rid = 'legalFormSelectionCountryFk';
			detail.label = $translate.instant('cloud.common.entityCountry');
			detail.model = 'countryFk';
			detail.visible = true;
			detail.sortOrder = 1;
			detail.validator = 'validateCountryFk';
			return detail;
		}

		function buildLegalFormConfig() {
			let config = basicsLookupdataConfigGenerator.provideGenericLookupConfig('businesspartner.legal.form', null,
				{
					showClearButton: true,
					field: 'BasCountryFk',
					filterKey: 'bp-legal-form-legal-form-filter',
					customIntegerProperty: 'BAS_COUNTRY_FK'
				});
			let detail = config.detail;
			detail.gid = '1';
			detail.rid = 'legalFormSelectionLegalFormFk';
			detail.label = $translate.instant('businesspartner.main.legalForm');
			detail.model = 'legalFormFk';
			detail.visible = true;
			detail.sortOrder = 2;
			return detail;
		}

		// eslint-disable-next-line no-unused-vars
		function validateCountryFk(entity) {
			entity.legalFormFk = null;
			return true;
		}

		function cancel() {
			$scope.$close(false);
		}

		function ok() {
			if (!angular.isFunction(service.getSelected) || !angular.isFunction(service.markItemAsModified) || !angular.isFunction(service.gridRefresh)) {
				$scope.$close(false);
			}

			var selectedItem = service.getSelected();
			if (selectedItem) {
				selectedItem.LegalFormFk = $scope.item.legalFormFk;
				if (!options.isGrid) {
					service.markItemAsModified(selectedItem);
					service.gridRefresh();
				}
			}

			$scope.$close(false);
		}

		function getValidCountryIds() {
			let countryIds = [];
			let items = basicsLookupdataSimpleLookupService.getListSync({lookupModuleQualifier: 'businesspartner.legal.form', displayMember: 'Description', valueMember: 'Id'});
			if (angular.isArray(items)) {
				_.forEach(items, function (legalForm) {
					if (legalForm.BasCountryFk && !_.includes(countryIds, legalForm.BasCountryFk)) {
						countryIds.push(legalForm.BasCountryFk);
					}
				});
			}
			return countryIds;
		}
	}
})(angular);