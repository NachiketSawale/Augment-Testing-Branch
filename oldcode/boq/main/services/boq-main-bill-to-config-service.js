/**
 * Created by bh on 28.05.2020.
 */
(function (angular) {
	/* global _ */
	'use strict';

	var modulename = 'boq.main';

	/**
	 * @ngdoc service
	 * @name boqMainBillToConfigService
	 * @description
	 */
	angular.module(modulename).factory('boqMainBillToConfigService', ['platformLayoutHelperService', 'basicsLookupdataConfigGenerator',
		function (platformLayoutHelperService, basicsLookupdataConfigGenerator) {

			var service = {};

			function getCustomerOverload() {
				var overload = {
					grid: {
						editor: 'lookup',
						editorOptions: {
							directive: 'business-partner-main-customer-lookup',
							lookupOptions: {
								filterKey: 'project-main-bill-to-customer-filter'
							}
						},
						formatter: 'lookup',
						formatterOptions: {'lookupType': 'customer', 'displayMember': 'Code'},
						width: 125
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'business-partner-main-customer-lookup',
							descriptionField: 'CustomerDescription',
							descriptionMember: 'Description',
							lookupOptions: {
								filterKey: 'project-main-bill-to-customer-filter'
							}
						}
					}
				};
				return overload;
			}

			function getBranchOverload() {
				var overload =  {
					detail: {
						type: 'directive',
						directive: 'business-partner-main-subsidiary-lookup',
						options: {
							initValueField: 'SubsidiaryAddress',
							filterKey: 'project-main-project-subsidiary-filter',
							showClearButton: true,
							displayMember: 'AddressLine'
						}
					},
					grid: {
						editor: 'lookup',
						editorOptions: {
							directive: 'business-partner-main-subsidiary-lookup',
							lookupOptions: {
								showClearButton: true,
								filterKey: 'project-main-project-subsidiary-filter',
								displayMember: 'AddressLine'
							}
						},
						width: 125,
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Subsidiary',
							displayMember: 'AddressLine'
						}
					}
				};
				return overload;
			}

			function getBusinessPartnerOverload(){
				return platformLayoutHelperService.provideBusinessPartnerLookupOverload();
			}

			function getBillToConfig (options) {
				var config = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'boqMainBilltoLookupDataService',
					filter: function (/* item */) {
						return options.currentBoqMainBillToDataService.parentService().getSelectedProjectId();
					},
					additionalColumns: true,
					showClearButton: true
				}, {
					gid: 'baseGroup',
					rid: 'PrjBillToId',
					label: 'Bill To',
					label$tr$: 'boq.main.BoqBillToFk',
					model: 'PrjBillToId',
					type: 'lookup'
				});

				// 'provideDataServiceLookupConfig' delivers a config object with the following set of properties: 'grid.editorOptions.lookupOptions'
				// -> add the new property addGridColumns to it to restrict the expanded split quantity grid only by the given below defined column.
				// As reference for this behavior have a look at 'platformUiConfigAdditionalColumnService' and its function 'addAdditionalColumnsTo'.
				if(_.has(config, 'grid.editorOptions.lookupOptions')) {
					config.grid.editorOptions.lookupOptions.addGridColumns = [{
						id: 'Description',
						field: 'Description',
						name: 'Description',
						width: 200,
						formatter: 'description',
						name$tr$: 'cloud.common.entityDescription'
					}];
				}

				return config;
			}

			service.getLayout = function (options) {
				var config = {
					fid: 'boq.main.billto.config',
					version: '0.1.0',
					addAdditionalColumns: true,
					addValidationAutomatically: true,
					showGrouping: true,
					groups: [
						{
							gid: 'basicData',
							attributes: [
								'prjbilltoid', 'comment', 'remark', 'businesspartnerfk', 'customerfk', 'subsidiaryfk', 'quantityportion', 'totalquantity'
							]
						}
					],
					'translationInfos': {
						'extraWords': {
							CommentText: {location: modulename, identifier: 'CommentText', initial: 'Comment'},
							BoqBillToFk: {location: modulename, identifier: 'billToEntity', initial: ''}
						}
					},
					'overloads': {
						'prjbilltoid': getBillToConfig(options),
						'customerfk' : getCustomerOverload(),
						'businesspartnerfk' : getBusinessPartnerOverload(),
						'subsidiaryfk' : getBranchOverload(),
						'id': {
							'readonly': true
						}
					}
				};

				return config;
			};

			return service;
		}
	]);

})(angular);
