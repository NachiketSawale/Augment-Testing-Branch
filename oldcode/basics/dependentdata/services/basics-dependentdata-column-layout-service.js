/**
 * Created by reimer on 20.02.2015.
 */

(function () {

	'use strict';

	var moduleName = 'basics.dependentdata';

	/**
     * @ngdoc service
     * @name
     * @function
     *
     * @description
     *
     */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('basicsDependentDataColumnLayoutService', ['basicsDependentDataColumnLookupService', 'platformRuntimeDataService',

		function (basicsDependentDataColumnLookupService, platformRuntimeDataService) {

			var service = {};

			var layout =  {

				'fid': 'basics.dependentdata.dependentdatacolumn.layout',
				'version': '1.0.0',
				'showGrouping': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['id', 'descriptioninfo', 'databasecolumn', 'displaydomainfk', 'isvisible', 'modulefk', 'dependentdatacolumnfk','dependentcolparentfk' ]
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],

				'translationInfos': {

					'extraModules': ['basics.dependentdata'],

					'extraWords': {
						'ModuleFk': {location: 'basics.dependentdata', identifier: 'entityModuleFk', initial: 'Link to module'},
						'DatabaseColumn': {location: 'basics.dependentdata', identifier: 'entityDatabaseColumn', initial: 'Mapped column'},
						'DisplayDomainFk': {location: 'basics.dependentdata', identifier: 'entityDisplayDomainFk', initial: 'Domain type'},
						'IsVisible': {location: 'basics.dependentdata', identifier: 'entityIsVisible', initial: 'Visible'},
						'DependentDataColumnFk': {location: 'basics.dependentdata', identifier: 'entityDependentDataColumnFk', initial: 'Link parameter source'},
						'DependentcolParentFk': {location: 'basics.dependentdata', identifier: 'entityDependentcolParentFk', initial: 'Parent Column'}
					}
				},

				'overloads': {

					'id': {
						'readonly': true
					},

					'databasecolumn': {
						'mandatory': true       // seems to be ignored? Using therefore "Required" annotation in DTO. This works.
					},

					'displaydomainfk': {
						'detail': {
							'type': 'directive',
							'directive': 'basics-dependent-data-domain-combobox',
							'options': {
							}
						},
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'lookupDirective': 'basics-dependent-data-domain-combobox',
								'lookupOptions': {
									'events': [{
										name: 'onSelectedItemChanged',
										handler: function (e, args) {
											if (args.selectedItem.DomainName === 'url' || args.selectedItem.DomainName === 'filedownload') {   // link points to a new browser window instead of a module
												platformRuntimeDataService.readonly(args.entity, [{field: 'ModuleFk', readonly: true}, {field: 'DependentDataColumnFk', readonly: false}]);
												args.entity.ModuleFk = null;
												// platformRuntimeDataService.readonly(args.entity, [{field: 'ModuleFk', readonly: true}, {field: 'DependentDataColumnFk', readonly: false}]);
											}
											else
											{
												platformRuntimeDataService.readonly(args.entity, [{field: 'ModuleFk', readonly: false}]);
											}
										}
									}]
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'basicsDependentDataDomain',
								displayMember: 'DescriptionInfo.Translated' //'DomainName'
							}
						}
					},
					'modulefk': {
						'detail': {
							'type': 'directive',
							'directive': 'basics-dependent-data-module-combobox',
							'options': {
								// 'eagerLoad': true
							}
						},
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'lookupDirective': 'basics-dependent-data-module-combobox',
								'lookupOptions': {
									'showClearButton': true,
									'events': [{
										'name': 'onSelectedItemChanged',
										handler: function (e, args) {
											platformRuntimeDataService.readonly(args.entity, [{field: 'DependentDataColumnFk', readonly: args.entity.DisplayDomainFk !== 19 && args.selectedItem === null}]);
										}
									}]
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'basicsDependentDataModule',
								// displayMember: 'InternalName'
								displayMember: 'Description.Description'
							}
						}
					},

					'dependentdatacolumnfk': {
						'detail': {
							'type': 'directive',
							'directive': 'basics-dependent-data-column-combobox',
							'options': {
								'eagerLoad': true
							}
						},
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'lookupDirective': 'basics-dependent-data-column-combobox',
								'lookupOptions': {
									showClearButton: true
								}
							},
							// 'formatter': Slick.Formatters.LookupFormatter,
							'formatter': LinkParameterFormatter
							//'formatterOptions': {
							//	'lookupType': 'basicsDependentDataColumn',
							//	'displayMember': 'DatabaseColumn'
							//}
						}
					},
					'dependentcolparentfk': {
						'detail': {
							'type': 'directive',
							'directive': 'basics-dependent-data-column-combobox',
							'options': {
								'eagerLoad': true
							}
						},
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'lookupDirective': 'basics-dependent-data-column-combobox',
								'lookupOptions': {
									showClearButton: true
								}
							},
                            
							'formatter': LinkParameterFormatter
                           
						}
					},
				}
			};

			function LinkParameterFormatter(row, cell, value) {

				if (value) {

					var item = basicsDependentDataColumnLookupService.getItemByKey(value);
					if (item) {
						return item.DatabaseColumn;
					}
				}
				return value;
			}

			service.getLayout = function() {

				return layout;
			};

			return service;


		}]);
})(angular);

