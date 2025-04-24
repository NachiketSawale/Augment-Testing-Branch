(function () {
	'use strict';

	var moduleName = 'transportplanning.requisition';
	angular.module(moduleName).service('trsRequisitionTrsGoodsFilterService', [
		'basicsLookupdataConfigGenerator',
		'platformTranslateService',
		'platformLayoutHelperService',
		'$translate',
		'productionplanningCommonLayoutHelperService',
		function (basicsLookupdataConfigGenerator,
				  platformTranslateService,
				  platformLayoutHelperService,
			$translate,
			ppsCommonLayoutHelperService) {
			var self = this;
			var instances = {};
			self.entity = {};
			Object.defineProperty(self.entity, 'isPickup', {
				get: function () {
					return self.entity.isPickupFake ? self.entity.isPickupFake.model : undefined;
				},
				set: angular.noop
			});

			self.createFilterParams = function createFilterParams(filter, uuid) {
				var params = instances[uuid];
				if (_.isNull(params) || _.isUndefined(params)) {
					params = provideFilterParams(filter, uuid);
					instances[uuid] = params;
				}
				return params;
			};

			self.setDate = function (value) {
				if (value) {
					if (!self.entity.date || self.entity.date.format('YYYY-MM-DD') !== value.format('YYYY-MM-DD')) {
						self.entity.date = value;
					}
				}
			};

			function provideFilterParams(filter, uuid) {
				var formConfig = {
					fid: 'trsrequisition.trsgoods.filter' + uuid,
					version: '1.0.0',
					showGrouping: false,
					groups: [
						{
							gid: 'selectionfilter',
							isOpen: true,
							visible: true,
							sortOrder: 1
						}
					],
					rows: []
				};

				if (angular.isArray(filter)) {
					for (var i = 0; i < filter.length; i++) {
						handleFilter(formConfig, self.entity, filter[i]);
					}
				} else {
					handleFilter(formConfig, self.entity, filter);
				}
				return {entity: self.entity, config: platformTranslateService.translateFormConfig(formConfig)};
			}

			var spaceString = _.repeat('&nbsp', 16);

			function handleFilter(formConfig, entity, filter) {
				var config;
				switch (filter) {
					case 'date':
						config = {
							gid: 'selectionfilter',
							rid: 'date',
							type: 'dateutc',
							model: 'date',
							label: 'Date',
							label$tr$: 'cloud.common.entityDate',
							sortOrder: 1,
							required: true
						};
						break;
					case 'jobId':
						config = ppsCommonLayoutHelperService.provideJobExtensionLookupOverload({
							jobType: 'external'
						}).detail;
						_.extend(config, {
							gid: 'selectionfilter',
							rid: 'jobId',
							model: 'jobId',
							label: 'Job',
							label$tr$: 'logistic.job.entityJob',
							sortOrder: 2
						});
						break;
					case 'isPickupFake':
						config = {
							gid: 'selectionfilter',
							rid: 'isPickup',
							model: 'isPickupFake',
							label: '',
							type: 'composite',
							sortOrder: 3,
							composite: [{
								model: 'model',
								type: 'radio',
								options: {
									labelMember: 'Description',
									valueMember: 'Value',
									groupName: 'isPickupGroup',
									items: [
										{
											Description: $translate.instant('transportplanning.requisition.trsGoods.isDelivery') + spaceString,
											Value: '1'
										}
									]
								}
							}, {
								model: 'model',
								type: 'radio',
								options: {
									labelMember: 'Description',
									valueMember: 'Value',
									groupName: 'isPickupGroup',
									items: [
										{
											Description: $translate.instant('transportplanning.requisition.trsGoods.isPickup') + spaceString,
											Value: '2'
										}
									]
								}
							}, {
								model: 'model',
								type: 'radio',
								fill: true,
								options: {
									labelMember: 'Description',
									valueMember: 'Value',
									groupName: 'isPickupGroup',
									items: [
										{
											Description: $translate.instant('transportplanning.requisition.trsGoods.both') + spaceString,
											Value: null
										}
									]
								}
							}
							]
						};
						break;
				}
				if (config) {
					formConfig.rows.push(config);
				}
			}
		}
	]);
})();