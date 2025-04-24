/**
 * Created by sandu on 09.06.2015.
 */
(function (angular) {
	'use strict';

	//noinspection JSAnnotator
	var mod = new angular.module('basics.reporting');

	mod.factory('basicsReportingReportDetailLayout', basicsReportingReportDetailLayout);
	basicsReportingReportDetailLayout.$inject = ['basicsLookupdataConfigGenerator'];
	function basicsReportingReportDetailLayout(basicsLookupdataConfigGenerator) {
		return {
			fid: 'basics.reporting.report.detailform',
			version: '1.0.0',
			addValidationAutomatically: true,
			showGrouping: true,
			groups: [
				{
					gid: 'basicData',
					attributes: ['name', 'description', 'filename', 'filepath', 'storeindocuments', 'documentcategoryfk', 'documenttypefk', 'rubriccategoryfk']
				},
				{
					gid: 'entityHistory',
					isHistory: true
				}
			],
			'translationInfos': {

				'extraModules': ['basics.reporting'],

				'extraWords': {
					'FileName': {location: 'basics.reporting', identifier: 'reportFileName', initial: 'File Name'},
					'FilePath': {location: 'basics.reporting', identifier: 'reportFilePath', initial: 'File Path'},
					'Description': {location: 'basics.reporting', identifier: 'description', initial: 'Description'},
					'Name': {location: 'basics.reporting', identifier: 'name', initial: 'Name'},
					'StoreInDocuments': {location: 'basics.reporting', identifier: 'storeindocuments', initial: 'Store in documents'},
					'DocumentCategoryFk': {location: 'basics.reporting', identifier: 'documentcategory', initial: 'Document Category'},
					'DocumentTypeFk': {location: 'basics.reporting', identifier: 'documenttype', initial: 'Document Type'},
					'RubricCategoryFk': {location: 'basics.reporting', identifier: 'rubriccategory', initial: 'Rubric Category'}
				}

			},
			'overloads': {

				'id': {
					'readonly': true
				},
				'filename': {
					'readonly': true
				},
				'filepath': {
					'readonly': true
				},
				documentcategoryfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.projectdocumentcategory'),
				documenttypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.projectdocumenttype'),
				rubriccategoryfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.rubriccategory')
			},
			'descriptioninfo': {
				'detail': {},
				'grid': {
					'searchable': true
				}
			}

		};
	}

	mod.factory('basicsReportingReportParameterDetailLayout', ['basicsReportingReportParameterService', function () {
		return {
			fid: 'basics.reporting.reportparameter.detailform',
			version: '1.0.0',
			showGrouping: true,
			groups: [
				{
					gid: 'basicData',
					attributes: ['descriptioninfo', 'parametername', 'datatype', 'syscontext', 'default', 'isvisible', 'sorting']
				},
				{
					gid: 'entityHistory',
					isHistory: true
				}
			],
			'translationInfos': {

				'extraModules': ['basics.reporting'],

				'extraWords': {
					'ParameterName': {
						location: 'basics.reporting',
						identifier: 'entityParameterName',
						initial: 'Parameter Name'
					},
					'DataType': {location: 'basics.reporting', identifier: 'entityDatatype', initial: 'Datatype'},
					'SysContext': {location: 'basics.reporting', identifier: 'entitySyscontext', initial: 'SysContext'},
					'IsVisible': {location: 'basics.reporting', identifier: 'entityIsVisible', initial: 'Is Visible'},
					'Default': {location: 'basics.reporting', identifier: 'entityDefault', initial: 'Default'},
					'Sorting': {location: 'basics.reporting', identifier: 'entitySorting', initial: 'Sort Order'}

				}

			},

			'overloads': {

				'id': {
					'readonly': true
				},
				'parametername': {
					'readonly': true
				},
				'datatype': {
					'readonly': true
				},

				syscontext: {
					grid: {
						editorOptions: {
							displayMember: 'description',
							valueMember: 'Id',
							items: 'basicsReportingSysContextItems'
						}

					}
				}
			}
		};
	}]);

	mod.value('basicsReportingReportParameterValuesDetailLayout', {
		fid: 'basics.reporting.reportparametervalues.detailform',
		version: '1.0.0',
		showGrouping: true,
		groups: [
			{
				gid: 'basicData',
				attributes: ['descriptioninfo', 'value', 'sorting']
			},
			{
				gid: 'entityHistory',
				isHistory: true
			}
		],
		'translationInfos': {

			'extraModules': ['basics.reporting'],

			'extraWords': {
				'Value': {location: 'basics.reporting', identifier: 'entityParameterValue', initial: 'Value'},
				'Sorting': {location: 'basics.reporting', identifier: 'entitySorting', initial: 'Sort Order'}
			}
		},

		'descriptioninfo': {
			'detail': {},
			'grid': {
				'searchable': true
			}
		},
		'overloads': {

			'id': {
				'readonly': true
			}
		}
	});

})(angular);