/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	let modulename = 'estimate.main';

	/**
	 * @ngdoc estimateMainEstUppUIConfigService
	 * @name estimateMainEstUppUIConfigService
	 * @description
	 * This is the configuration service for estimate unit price portion(UPP) dialog.
	 */
	angular.module(modulename).factory('estimateMainEstUppUIConfigService', ['$injector',
		function ($injector) {

			let service = {};

			let formConfig = {
				groups: [
					{ gid: 'estUpp', header: 'Unit Rate Portion', header$tr$: 'estimate.main.unitPricePortion', isOpen: true, visible: true, sortOrder: 5 }
				],
				rows: [
					{
						gid: 'estUpp', rid: 'estUppType', label: 'URP Config Type', label$tr$: 'estimate.main.estUppType',
						type: 'directive', directive: 'estimate-main-upp-config-type', model: 'estUppConfigTypeFk',
						options: {
							serviceName: 'estimateMainEstUppConfigTypeService',
							displayMember: 'Description',
							valueMember: 'Id'
						},
						readonly: false, disabled:false, visible: true, sortOrder: 10
					},
					{
						gid: 'estUpp', rid: 'estUppConfigDesc', label: 'Description', label$tr$: 'cloud.common.entityDescription',
						type: 'description', model: 'estUppConfigDesc', readonly: false, visible: true, sortOrder: 20
					},
					{
						gid: 'estUpp', rid: 'estUppDetail', label: 'URP Configure Details', label$tr$: 'estimate.main.uppDetails',
						type: 'directive', model: 'estUpp2CostCodeDetails', directive:'estimate-main-upp2-costcode-detail',
						readonly: false, rows:20, visible: true, sortOrder: 30
					}
				]
			};


			/**
			 * @ngdoc function
			 * @name getFormConfig
			 * @function
			 * @methodOf estimateMainUIConfigService
			 * @description Builds and returns the Upp form configuration for the estimate configuration dialog
			 */
			service.getFormConfig = function() {
				return angular.copy(formConfig);
			};

			service.getEstBoqFormConfig = function (){
				let deepCopiedFormConfiguration =  angular.copy(formConfig);

				deepCopiedFormConfiguration.groups.unshift({
					gid: 'estFromBoq', header: 'Additional Options to update from Estimate To BoQ', header$tr$: 'estimate.main.estimateBoqConfigHeader', isOpen: true, visible: true, sortOrder: 2
				});

				deepCopiedFormConfiguration.groups.push({
					gid: 'estBoq', header: 'Estimate To BoQ', header$tr$: 'estimate.main.estConfigEstBoqUppGroup', isOpen: true, visible: true, sortOrder: 4
				});

				deepCopiedFormConfiguration.rows.push({
					rid: 'isDisabled',
					gid: 'estFromBoq',
					label: 'Update Flag Disabled',
					label$tr$: 'estimate.main.updateFlagDisabled',
					type: 'boolean',
					model: 'IsDisabled',
					sortOrder: 1,
					readonly: false,
					visible: true
				});

				deepCopiedFormConfiguration.rows.push({
					rid: 'isFixedPrice',
					gid: 'estFromBoq',
					label: 'Update Flag Fixed Price',
					label$tr$: 'estimate.main.updateFlagFixedPrice',
					type: 'boolean',
					model: 'IsFixedPrice',
					sortOrder: 2,
					readonly: false,
					visible: true
				});

				deepCopiedFormConfiguration.rows.push({
					rid: 'isAQOptionalItems',
					gid: 'estFromBoq',
					label: 'Update AQ for all Optional Items',
					label$tr$: 'estimate.main.updateAQforOptionalItems',
					type: 'boolean',
					model: 'IsAQOptionalItems',
					sortOrder: 3,
					readonly: false,
					visible: true
				});

				deepCopiedFormConfiguration.rows.push({
					rid: 'isDayWork',
					gid: 'estFromBoq',
					label: 'Update Flag Day Work',
					label$tr$: 'estimate.main.updateFlatDayWork',
					type: 'boolean',
					model: 'IsDayWork',
					sortOrder: 3,
					readonly: false,
					visible: true
				});

				deepCopiedFormConfiguration.rows.push({
					gid: 'estBoq', rid:'BoqId', label: 'Boq Header', label$tr$: 'estimate.main.boqContainer', type: 'directive',
					model: 'BoqId', required: true, directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'sales-common-base-boq-lookup',
						descriptionMember: 'BoqRootItem.BriefInfo.Translated',
						lookupOptions: {
							showClearButton: false,
							events: [
								{
									name: 'onSelectedItemChanged',
									handler: function (e, args) {
										if(args && args.selectedItem && args.selectedItem && args.selectedItem.BoqHeader){
											$injector.get('estimateMainBoqUppConfigService').reloadUrpConfig(args.selectedItem.BoqHeader.Id);
											args.entity.BoqHeaderId = args.selectedItem.BoqHeader.Id;
										}else{
											args.entity.BoqHeaderId = 0;
										}
									}
								}
							],
							onDataRefresh: function ($scope) {
								$injector.get('salesCommonBaseBoqLookupService').clearBaseBoqList();
								$injector.get('salesCommonBaseBoqLookupService').getSalesBaseBoqList().then(function (data) {
									$scope.refreshData(data);
								});
							}
						}
					}
				});

				deepCopiedFormConfiguration.rows.push({
					gid: 'estUpp', rid: 'estUppEditType', label: 'Edit Type', label$tr$: 'cloud.common.estUppEditType',
					type: 'boolean', model: 'isEditUppType', readonly: false, visible: true, sortOrder: 15
				});

				return deepCopiedFormConfiguration;
			};

			return service;
		}

	]);

})();
