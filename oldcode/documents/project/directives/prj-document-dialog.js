/**
 * Created by pel on 5/16/2019.
 */
(function (angular, globals) {
	'use strict';
	/* global ,globals */
	globals.lookups['PrjDocument'] = function ($injector) {
		var basicsLookupdataConfigGenerator = $injector.get('basicsLookupdataConfigGenerator');
		var documentStatusConfig = basicsLookupdataConfigGenerator.provideReadOnlyConfig('documents.project.documentstatus', null, {showIcon: true}).grid;
		var rubricCategoryConfig = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.lookup.rubriccategory', null, {showIcon: true}).grid;
		var documentTypeConfig = basicsLookupdataConfigGenerator.provideReadOnlyConfig('documents.project.basDocumenttype', null, {showIcon: true}).grid;
		return {
			lookupOptions: {
				version: 3,
				lookupType: 'ProjectDocument',
				valueMember: 'Id',
				displayMember: 'Description',
				dialogOptions: {
					width: '680px'
				},
				uuid: '3C9FC31DBD724A6CA061A659C7909393',
				columns: [
					{
						id: 'Description',
						field: 'Description',
						name: 'Description',
						width: 100,
						name$tr$: 'cloud.common.entityDescription'
					},

					{
						id: 'CommentText',
						field: 'CommentText',
						name: 'CommentText',
						name$tr$: 'documents.project.entityCommentText'
					},
					{
						id: 'projectNo',
						field: 'PrjProjectFk',
						name: 'projectNo',
						width: 120,
						name$tr$: 'cloud.common.entityProjectNo',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'project',
							displayMember: 'ProjectNo'
						},
						searchable: false
					},
					{
						id: 'Barcode',
						field: 'Barcode',
						name: 'Barcode',
						width: 200,
						name$tr$: 'documents.project.entityBarcode'
					},
					{
						id: 'RubricCategory',
						field: 'RubricCategoryFk',
						name: 'Rubric Category',
						name$tr$: 'documents.project.entityRubricCategory',
						formatter: rubricCategoryConfig.formatter,
						formatterOptions: rubricCategoryConfig.formatterOptions,
						searchable: false
					},

					{
						id: 'DocumentStatus',
						field: 'PrjDocumentStatusFk',
						name: 'Document Status',
						name$tr$: 'documents.project.entityPrjDocumentStatus',
						formatter: documentStatusConfig.formatter,
						formatterOptions: documentStatusConfig.formatterOptions,
						readonly: true,
						searchable: false
					},
					{
						id: 'DocumentType',
						field: 'DocumentTypeFk',
						name: 'Document Type',
						name$tr$: 'cloud.common.entityDocumentType',
						formatter: documentTypeConfig.formatter,
						formatterOptions: documentTypeConfig.formatterOptions,
						readonly: true,
						searchable: false
					}
				],
				title: {
					name: 'Assign documents project',
					name$tr$: 'documents.project.assignDocument'
				},
				pageOptions: {
					enabled: true
				}
			}
		};
	};

	/**
     * @ngdoc directive
     * @name basics.lookupdata.directive: basicsLookupDataProjectProjectDialog
     * @element
     * @restrict
     * @priority
     * @scope
     * @description
     * #
     *a dialog directive for prj_project.
     *
     */
	angular.module('documents.project').directive('projectDocumentLookupDialog', ['BasicsLookupdataLookupDirectiveDefinition','$injector',
		function (BasicsLookupdataLookupDirectiveDefinition,$injector) {
			var lookup = globals.lookups['PrjDocument']($injector);
			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', lookup.lookupOptions);
		}]);

})(angular, globals);

