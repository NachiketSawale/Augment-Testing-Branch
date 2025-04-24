/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const moduleName = 'model.change';

	/**
	 * @ngdoc service
	 * @name modelChangeUIConfigurationService
	 * @function
	 */
	angular.module(moduleName).service('modelChangeUIConfigurationService', ModelChangeUIConfigurationService);

	ModelChangeUIConfigurationService.$inject = ['basicsLookupdataConfigGenerator'];

	function ModelChangeUIConfigurationService(basicsLookupdataConfigGenerator) {

		this.getModelChangeLayout = function () {
			return {
				fid: 'model.change.modelChangeform',
				version: '1.0.0',
				showGrouping: true,
				groups: [
					{
						'gid': 'baseGroup',
						'attributes': ['changetypefk', 'modelfk', 'modelcmpfk', 'objectfk', 'cpiid', 'objectcmpfk', 'cmpcpiid', 'propertykeyfk', 'value', 'valuecmp', 'locationfk', 'ischangeorder']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				overloads: {
					changetypefk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'modelChangeTypeLookupDataService',
						additionalColumns: false,
						enableCache: true,
						readonly: true
					}),
					modelfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'modelProjectModelTreeLookupDataService',
						enableCache: true,
						filter: function (item) {
							return item.ProjectId;
						},
						readonly: true
					}),
					modelcmpfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'modelProjectModelTreeLookupDataService',
						enableCache: true,
						filter: function (item) {
							return item.ProjectCmpId;
						},
						readonly: true
					}),
					objectfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'modelMainObjectLookupDataService',
						enableCache: true,
						filter: function (item) {
							return item.ModelFk;
						},
						additionalColumns: true,
						readonly: true
					}),
					cpiid: {
						readonly: true
					},
					objectcmpfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'modelMainObjectLookupDataService',
						enableCache: true,
						filter: function (item) {
							return item.ModelCmpFk;
						},
						additionalColumns: true,
						readonly: true
					}),
					cmpcpiid:{
						readonly: true
					},
					propertykeyfk: {
						readonly: true,
						grid: {
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'PropertyKey',
								displayMember: 'PropertyName',
								version: 3
							},
							width: 100
						},
						detail: {
							type: 'directive',
							directive: 'model-main-property-key-dialog',
							options: {
								descriptionMember: 'PropertyName'
							},
							readonly: true
						}
					},
					value: {
						formatter: 'dynamic',
						editor: 'dynamic',
						readonly: true,
						domain: function (item) {
							let domain;

							if (item && item.PropertyDto) {
								switch (item.PropertyDto.ValueType) {
									case 1:
										domain = 'remark';
										item.Value = item.PropertyDto.PropertyValueText;
										break;

									case 2:
										domain = 'decimal';
										item.Value = item.PropertyDto.PropertyValueNumber;
										break;

									case 3:
										domain = 'integer';
										item.Value = item.PropertyDto.PropertyValueLong;
										break;

									case 4:
										domain = 'boolean';
										item.Value = item.PropertyDto.PropertyValueBool;
										break;

									case 5:
										domain = 'dateutc';
										item.Value = item.PropertyDto.PropertyValueDate;
										break;

									default:
										item.Value = null;
								}
							}

							return domain || 'description';
						}
					},
					valuecmp: {
						formatter: 'dynamic',
						editor: 'dynamic',
						readonly: true,
						domain: function (item) {
							let domain;

							if (item && item.PropertyCmpDto) {
								switch (item.PropertyCmpDto.ValueType) {
									case 1:
										domain = 'remark';
										item.ValueCmp = item.PropertyCmpDto.PropertyValueText;
										break;

									case 2:
										domain = 'decimal';
										item.ValueCmp = item.PropertyCmpDto.PropertyValueNumber;
										break;

									case 3:
										domain = 'integer';
										item.ValueCmp = item.PropertyCmpDto.PropertyValueLong;
										break;

									case 4:
										domain = 'boolean';
										item.ValueCmp = item.PropertyCmpDto.PropertyValueBool;
										break;

									case 5:
										domain = 'dateutc';
										item.ValueCmp = item.PropertyCmpDto.PropertyValueDate;
										break;

									default:
										item.ValueCmp = null;
								}
							}

							return domain || 'description';
						}
					},
					locationfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'projectLocationLookupDataService',
						filter: function (item) {
							switch (item.ChangeTypeFk) {
								case 32: // location only in model 1
									return item.ProjectId;
								case 33: // location only in model 2
									return item.ProjectCmpId;
								default:
									return 0;
							}
						},
						enableCache: true,
						readonly: true
					})
				}
			};
		};
	}
})(angular);
