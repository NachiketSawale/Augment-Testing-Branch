(function(angular){
	'use strict';

	angular.module('estimate.main').factory('estimateMainAllowanceBoqAreaAssignmentConfigService', ['platformUIStandardConfigService', 'platformSchemaService',
		'estimateMainTranslationService',function(platformUIStandardConfigService, platformSchemaService, estimateMainTranslationService){
			let layout = {
				'fid': 'estimate.main.boqAreaAssignment',
				'version': '1.0.1',
				'showGrouping': false,
				'addValidationAutomatically' : true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': [ 'fromboqheaderfk', 'fromboqitemfk', 'toboqheaderfk', 'toboqitemfk']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'overloads': {
					'fromboqheaderfk': {
						'readonly': true,
						'detail': {
							type: 'directive',
							directive: 'estimate-main-root-boq-item',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'estBoqHeaders',
								displayMember: 'Reference',
								dataServiceName: 'estimateMainBoqHeaderService',
								mainServiceName:'estimateMainAllowanceBoqAreaAssigmentService'
							},
							bulkSupport: false
						},
						'grid': {
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'estBoqHeaders',
								displayMember: 'Reference',
								dataServiceName: 'estimateMainBoqHeaderService',
								mainServiceName:'estimateMainAllowanceBoqAreaAssigmentService'
							},
							bulkSupport: false
						}
					},
					'fromboqitemfk': {
						'detail': {
							'type': 'directive',
							'directive': 'estimate-main-allowance-boq-item-lookup',
							'options': {
								'eagerLoad': true,
								'showClearButton': true
							}
						},
						'grid': {
							editor: 'lookup',
							required : true,
							editorOptions: {
								directive: 'estimate-main-allowance-boq-item-lookup',
								lookupOptions: {
									events: [{
										name: 'onSelectedItemChanged', handler: function selectedWicGroupChanged(e, args) {
											fromBoqItemFkChange(e,args);
										}
									}],
									'showClearButton': true,
									'additionalColumns': true,
									'displayMember': 'Reference',
									'addGridColumns': [
										{
											id: 'brief',
											field: 'BriefInfo',
											name: 'Brief',
											width: 120,
											toolTip: 'Brief',
											formatter: 'translation',
											name$tr$: 'estimate.main.briefInfo'
										}
									]
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'estboqitems',
								displayMember: 'Reference',
								dataServiceName:'estimateMainBoqItemService',
								mainServiceName:'estimateMainAllowanceBoqAreaAssigmentService'
							}
						}
					},
					'toboqheaderfk': {
						'readonly': true,
						'detail': {
							type: 'directive',
							directive: 'estimate-main-root-boq-item',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'estBoqHeaders',
								displayMember: 'Reference',
								dataServiceName: 'estimateMainBoqHeaderService',
								mainServiceName:'estimateMainAllowanceBoqAreaAssigmentService'
							},
							bulkSupport: false
						},
						'grid': {
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'estBoqHeaders',
								displayMember: 'Reference',
								dataServiceName: 'estimateMainBoqHeaderService',
								mainServiceName:'estimateMainAllowanceBoqAreaAssigmentService'
							},
							bulkSupport: false
						}
					},
					'toboqitemfk': {
						'detail': {
							'type': 'directive',
							'directive': 'estimate-main-allowance-boq-item-lookup',
							'options': {
								'eagerLoad': true,
								'showClearButton': true
							}
						},
						'grid': {
							editor: 'lookup',
							required : true,
							editorOptions: {
								directive: 'estimate-main-allowance-boq-item-lookup',
								lookupOptions: {
									events: [{
										name: 'onSelectedItemChanged', handler: function selectedWicGroupChanged(e, args) {
											toBoqItemFkChange(e,args);
										}
									}],
									'showClearButton': true,
									'additionalColumns': true,
									'displayMember': 'Reference',
									'addGridColumns': [
										{
											id: 'brief',
											field: 'BriefInfo',
											name: 'Brief',
											width: 120,
											toolTip: 'Brief',
											formatter: 'translation',
											name$tr$: 'estimate.main.briefInfo'
										}
									]
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'estboqitems',
								displayMember: 'Reference',
								dataServiceName:'estimateMainBoqItemService',
								mainServiceName:'estimateMainAllowanceBoqAreaAssigmentService'
							}
						}
					}
				}
			};

			function fromBoqItemFkChange(e, args){
				let selectedLineItem = args.entity;
				let lookupItem = args.selectedItem;

				// clear all items
				if(e && e.target && e.target.className && e.target.className.indexOf('ico-input-delete') !== -1){
					selectedLineItem.FromBoqHeaderFk = null;
					selectedLineItem.FromBoqItemFk = null;
				}
				// add item
				else if (lookupItem !== null) {
					selectedLineItem.FromBoqHeaderFk = lookupItem.BoqHeaderFk;
				}
			}

			function toBoqItemFkChange(e, args){
				let selectedLineItem = args.entity;
				let lookupItem = args.selectedItem;

				// clear all items
				if(e && e.target && e.target.className && e.target.className.indexOf('ico-input-delete') !== -1){
					selectedLineItem.ToBoqHeaderFk = null;
					selectedLineItem.ToBoqItemFk = null;
				}
				// add item
				else if (lookupItem !== null) {
					selectedLineItem.ToBoqHeaderFk = lookupItem.BoqHeaderFk;
				}
			}

			let BaseService = platformUIStandardConfigService;

			let attributeDomains = platformSchemaService.getSchemaFromCache({
				typeName: 'EstAllAreaBoqRangeDto',
				moduleSubModule: 'Estimate.Main'
			});

			function DashboardUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			DashboardUIStandardService.prototype = Object.create(BaseService.prototype);
			DashboardUIStandardService.prototype.constructor = DashboardUIStandardService;

			return new BaseService(layout, attributeDomains.properties, estimateMainTranslationService);
		}]);
})(angular);