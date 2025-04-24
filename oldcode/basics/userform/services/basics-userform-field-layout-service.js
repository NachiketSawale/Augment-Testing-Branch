/**
 * Created by reimer on 21.07.2015.
 */

(function () {

	'use strict';

	var moduleName = 'basics.userform';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('basicsUserformFieldLayoutService', [
		'platformRuntimeDataService',
		function (platformRuntimeDataService) {

			var service = {};

			var layout = {

				'fid': 'basics.userform.form.field.detailform',
				'version': '1.0.0',
				'showGrouping': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['id', 'fieldname', 'visiblename', 'datasource', 'lookupqualifier', 'sqlquery', 'processingtype', 'fieldtype']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],

				'overloads': {

					'id': {
						'readonly': true
					},

					'sqlquery': {
						validator: 'sqlQueryValidator'
					},

					'datasource': {

						'detail': { // not used
						},
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								lookupDirective: 'basics-userform-rubric-data-source-combobox',
								'lookupOptions': {
									'showClearButton': true,
									'disableDataCaching': true,
									'events': [{
										name: 'onSelectedItemChanged',
										handler: function (e, args) {
											if (args.selectedItem && args.selectedItem.description === '[SQL Query]') {
												platformRuntimeDataService.readonly(args.entity, [{field: 'LookupQualifier', readonly: true}, {field: 'SqlQuery', readonly: false}]);
											} else {
												platformRuntimeDataService.readonly(args.entity, [{field: 'LookupQualifier', readonly: false}, {field: 'SqlQuery', readonly: true}]);
											}
											args.entity.LookupQualifier = null;
										}
									}]

								}
							},
							'formatter': 'description'
						}

					},

					'lookupqualifier': {

						'detail': { // not used
						},
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								lookupDirective: 'basics-userform-lookup-qualifier-combobox',
								'lookupOptions': {
									'showClearButton': true,
									'disableDataCaching': true,
									'events': [{
										name: 'onSelectedItemChanged',
										handler: function (e, args) {
											if (args.selectedItem && args.selectedItem.description === '[SQL Query]') {
												platformRuntimeDataService.readonly(args.entity, [{field: 'SqlQuery', readonly: false}]);
											} else {
												platformRuntimeDataService.readonly(args.entity, [{field: 'SqlQuery', readonly: true}]);
											}
										}
									}]
								}
							},
							'formatter': 'description'
						}
					},

					'processingtype': {

						'detail': {    // not used
						},
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								lookupDirective: 'basics-userform-processingtype-combobox',
								'lookupOptions': {
									'showClearButton': false,
									'disableDataCaching': true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'basicsUserformProcessingTypeLookup',
								displayMember: 'Description'
							}
						}

					},
					'fieldtype': {
						'detail': {
							'type': 'directive',
							'directive': 'basics-userform-fieldtype-combobox',
							'options': {
								displayMember: 'Description',
								valueMember: 'Id'
							}
						},
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								lookupDirective: 'basics-userform-fieldtype-combobox',
								'lookupOptions': {
									'showClearButton': false,
									'disableDataCaching': true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'basicsUserformFieldTypeLookup',
								displayMember: 'Description',
								valueMember: 'Id'
							}
						}
					}
				}
			};

			service.getLayout = function () {

				return layout;
			};

			return service;

		}]);
})(angular);

