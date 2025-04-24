/**
 * Created by reimer on 10.12.2014.
 */

(function (angular) {
	'use strict';

	const mod = angular.module('basics.userform');

	// Layout specs
	mod.value('basicsUserformFormDetailLayout', {
		'fid': 'basics.userform.form.detailform',
		'version': '1.0.0',
		'showGrouping': true,
		// 'validatorService': 'basicsUserformFieldValidationService',
		// 'validator': 'validateEntity',
		'addValidationAutomatically': true,
		'groups': [
			{
				'gid': 'basicData',
				'attributes': ['id', 'rubricfk', 'descriptioninfo', 'htmltemplatefilename', 'windowparameter', 'workflowtemplatefk', 'validfrom', 'validto', 'iscontainer']
			},
			{
				'gid': 'entityHistory',
				'isHistory': true
			}
		],

		'translationInfos': {

			'extraModules': ['basics.userform'],

			'extraWords': {
				'ValidFrom': {location: 'basics.userform', identifier: 'entityValidFrom', initial: 'Valid from'},
				'ValidTo': {location: 'basics.userform', identifier: 'entityValidTo', initial: 'Valid to'},
				'WorkflowTemplateFk': {location: 'basics.userform', identifier: 'entityWorkflowTemplateFk', initial: 'Trigger Workflow'},
				'RubricFk': {location: 'basics.userform', identifier: 'entityRubricFk', initial: 'Rubric'},
				'HtmlTemplateFileName': {location: 'basics.userform', identifier: 'entityHtmlTemplateFileName', initial: 'Html template'},
				'WindowParameter': {location: 'basics.userform', identifier: 'entityWindowParameter', initial: 'Window options'},
				'FieldName': {location: 'basics.userform', identifier: 'entityFieldName', initial: 'Fieldname'},
				'VisibleName': {location: 'basics.userform', identifier: 'entityVisibleName', initial: 'Visiblename:'},
				'DataSource': {location: 'basics.userform', identifier: 'entityDataSource', initial: 'Datasource'},
				'LookupQualifier': {location: 'basics.userform', identifier: 'entityLookupQualifier', initial: 'Lookup Source'},
				'SqlQuery': {location: 'basics.userform', identifier: 'entitySqlQuery', initial: 'SQL Query'},
				'ProcessingType': {location: 'basics.userform', identifier: 'entityProcessingType', initial: 'Processing type'},
				'FieldType': {location: 'basics.userform', identifier: 'entityFieldType', initial: 'Field type'},
				'IsContainer': {location: 'basics.userform', identifier: 'entityIsContainer', initial: 'Is Container'}
			}

		},

		'overloads': {

			'id': {
				'readonly': true
			},
			'rubricfk': {
				'detail': {
					'type': 'directive',
					'directive': 'basics-userform-rubric-combobox',
					'options': {
						'eagerLoad': true,
						'events': [
							{
								name: 'onSelectedItemChanged', // register event and event handler here.
								handler: function (/* e, args */) {
									// console.log(args.selectedItem);
								}
							}
						]
					}
				},
				'grid': {
					editor: 'lookup',
					editorOptions: {
						lookupDirective: 'basics-userform-rubric-combobox',
						'lookupOptions': {
							'showClearButton': true
							// 'disableDataCaching': true
						}
					},
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'basicsUserformRubricLookup',
						displayMember: 'Description'
					}
				}
			},
			'workflowtemplatefk': {
				'detail': {
					'type': 'directive',
					'directive': 'basics-userform-workflow-template-combobox',
					'options': {
						'eagerLoad': true
					}
				},
				'grid': {
					'editor': 'lookup',
					'editorOptions': {
						'lookupDirective': 'basics-userform-workflow-template-combobox',
						'lookupOptions': {
							'showClearButton': true
							// 'disableDataCaching': true
						}
					},
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'basicsUserformWorkflowTemplateLookup',
						displayMember: 'Description'
					}
				}
			},
			'htmltemplatefilename': {

				// 'readonly': true,
				'readonly': false,
				'detail': {
					'type': 'directive',
					'directive': 'basics-userform-upload-input',
					'options': {
						contentFieldName: 'HtmlTemplateContent'
					}
				},
				'grid': {
					'editor': 'directive',
					'editorOptions': {
						'directive': 'basics-userform-upload-input',
						'contentFieldName': 'HtmlTemplateContent'
					},
					'formatter': 'description'
				}
			},

			'descriptioninfo': {
				'detail': {},
				'grid': {
					'searchable': true
				}
			}

		}
	});

})(angular);


