/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global _ */
	'use strict';

	let modulename = 'estimate.main';

	/**
	 * @ngdoc estimateMainEstStructureUIConfigService
	 * @name
	 * @description
	 * This is the configuration service for estimate structure dialog.
	 */
	angular.module(modulename).factory('estimateMainEstStructureUIConfigService', [
		function () {

			let service = {};

			let formConfig = {
				groups: [
					{ gid: 'estStruct', header: 'Estimate Structure', header$tr$: 'estimate.main.estStructure', isOpen: true, visible: true, sortOrder: 4 }
				],
				rows: [
					{
						gid: 'estStruct', rid: 'estStructType', label: 'Est struct Type', label$tr$: 'estimate.main.estStructType',
						type: 'directive', directive: 'estimate-main-struct-config-type', model: 'estStructTypeFk',
						options: {
							serviceName: 'estimateMainEstStructureTypeService',
							displayMember: 'Description',
							valueMember: 'Id',
							showClearButton: true
						},
						readonly: false, disabled:false, visible: true, sortOrder: 1
					},
					{
						gid: 'estStruct', rid: 'editEstStructType', label: 'Edit Type', label$tr$: 'estimate.main.editEstStructType',
						type: 'boolean', model: 'isEditStructType', checked:false, disabled:false, visible: true, sortOrder: 2
					},
					{
						gid: 'estStruct', rid: 'estStructConfigDesc', label: 'Description', label$tr$: 'cloud.common.entityDescription',
						type: 'description', model: 'estStructConfigDesc', readonly: false, visible: true, sortOrder: 3
					},
					{
						gid: 'estStruct', rid: 'getQuantityTotalToStructure', label: 'getQuantityTotalToStructure', label$tr$: 'basics.customize.getQuantityTotalToStructure',
						type: 'boolean', model: 'getQuantityTotalToStructure', checked: false, disabled: false, visible: true, sortOrder: 3
					},
					{
						gid: 'estStruct', rid: 'estStructDetail', label: 'Estimate Structure Config Details', label$tr$: 'estimate.main.structConfigDetails',
						type: 'directive', model: 'estStructureConfigDetails', directive:'estimate-main-structure-config-detail',
						readonly: false, maxlength:5000, rows:20, visible: true, sortOrder: 4
					}
				]
			};

			/**
			 * @ngdoc function
			 * @name getFormConfig
			 * @function
			 * @methodOf estimateMainUIConfigService
			 * @description Builds and returns the estimate structure form configuration for the estimate configuration dialog
			 */
			service.getFormConfig = function(customizeOnly, isAssemblies) {
				let deepCopiedFormConfiguration =  angular.copy(formConfig);
				if(customizeOnly) {
					// Remove the first row that holds the checkbox to make the structure a specific one different form estimate.
					_.remove(deepCopiedFormConfiguration.rows, function (row) {
						return row.rid === 'editEstStructType';
					});
				}

				if(isAssemblies){
					_.remove(deepCopiedFormConfiguration.groups, function(group){
						return group.header === 'Estimate Structure';
					});
				}
				return deepCopiedFormConfiguration;
			};

			return service;
		}

	]);

})();
