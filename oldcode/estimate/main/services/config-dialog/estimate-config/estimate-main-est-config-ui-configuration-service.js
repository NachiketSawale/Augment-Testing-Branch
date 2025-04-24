/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global _ */
	'use strict';

	let modulename = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name
	 * @description
	 */
	angular.module(modulename).factory('estimateMainEstConfigUIConfigService', [
		function () {

			let service = {};

			let formConfig = {
				groups: [
					{ gid: 'estConfig', header: 'Estimate Config', header$tr$: 'estimate.main.estConfig', isOpen: true, visible: true, sortOrder: 1 }
				],
				rows: [
					{
						gid: 'estConfig', rid: 'estConfigType', label: 'Est Type', label$tr$: 'estimate.main.estConfigType',
						type: 'directive', model: 'estConfigTypeFk',
						directive: 'estimate-main-config-type',
						options: {
							serviceName: 'estimateMainEstConfigTypeService',// in customize module will be 'estimateMainCustomizeConfigTypeService'
							displayMember: 'Description',
							valueMember: 'Id'
						},
						readonly: false, disabled:false, visible: true, sortOrder: 1
					},
					{
						gid: 'estConfig', rid: 'editEstType', label: 'Edit Type', label$tr$: 'estimate.main.editEstType',
						type: 'boolean', model: 'isEditEstType', checked:false, disabled:false, visible: true, sortOrder: 2
					},
					{
						gid: 'estConfig', rid: 'estConfigDesc', label: 'Description', label$tr$: 'cloud.common.entityDescription',
						type: 'description', model: 'estConfigDesc', readonly: false, visible: true, sortOrder: 3
					},
					{
						gid: 'estConfig', rid: 'isColumnConfig', label: 'Is Column Config', label$tr$: 'estimate.main.isColumnConfigureActivated',
						type: 'boolean', model: 'isColumnConfig', checked:false, disabled:false, visible: true, sortOrder: 4
					},
					{
						gid: 'estConfig', rid: 'boqWicGroup', label: 'Default WIC-Group', label$tr$: 'estimate.main.boqWicGroup',
						type: 'directive', model: 'boqWicCatFk',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'estimate-main-est-wic-group-lookup',
							descriptionMember: 'DescriptionInfo.Translated',
							lookupOptions: {
								showClearButton: true,
								filterKey: 'estimate-main-wic-group-master-data-filter'
							}
						},
						readonly: false, disabled:false, visible: true, sortOrder: 6
					}
				]
			};


			/**
			 * @ngdoc function
			 * @name getFormConfig
			 * @function
			 * @methodOf estimateMainUIConfigService
			 * @description Builds and returns the form configuration for the estimate configuration dialog
			 */
			service.getFormConfig = function(customizeOnly, isAssemblies) {
				let deepCopiedFormConfiguration =  angular.copy(formConfig);
				if(customizeOnly) {
					// Remove the first row that holds the checkbox to make the structure a specific one different form estimate.
					_.remove(deepCopiedFormConfiguration.rows, function (row) {
						return row.rid === 'editEstType';
					});

					let configTypeItem = _.find(deepCopiedFormConfiguration.rows, {'rid': 'estConfigType'});
					if (configTypeItem) {
						configTypeItem.options.serviceName = 'estimateMainCustomizeConfigTypeService';
					}
				}

				if(isAssemblies){
					_.remove(deepCopiedFormConfiguration.rows, function (row) {
						return row.rid === 'boqWicGroup' || row.rid === 'isColumnConfig';
					});

					angular.forEach(deepCopiedFormConfiguration.groups, function(group){
						if(group.header === 'Estimate Config'){
							group.header$tr$ = 'estimate.assemblies.estConfig';
						}
					});

					angular.forEach(deepCopiedFormConfiguration.rows, function (row){
						if(row.rid === 'estConfigType'){
							row.label$tr$ = 'estimate.assemblies.estConfigType';
						}
						else if(row.rid === 'editEstType'){
							row.label$tr$ = 'estimate.assemblies.editEstType';
						}
					});
				}

				return deepCopiedFormConfiguration;
			};

			return service;
		}

	]);

})();
