/**
 * Created by leo on 16.01.2017.
 */
(function (angular) {
	/* global $ */
	'use strict';
	var moduleName = angular.module('logistic.dispatching');

	/**
	 * @ngdoc service
	 * @name logisticDispatchingSourceFilterService
	 * @function
	 *
	 * @description
	 *
	 */
	moduleName.service('logisticDispatchingSourceFilterService', LogisticDispatchingSourceFilterService);

	LogisticDispatchingSourceFilterService.$inject = ['_', 'platformTranslateService', 'basicsLookupdataConfigGenerator',
		'logisticDispatchingHeaderDataService', 'platformLayoutHelperService', 'platformRuntimeDataService'];

	function LogisticDispatchingSourceFilterService(_, platformTranslateService, basicsLookupdataConfigGenerator,
		logisticDispatchingHeaderDataService, platformLayoutHelperService, platformRuntimeDataService) {
		var self = this;
		var instances = {};

		this.getPerformingProject = function getPerformingProject() {
			var header = logisticDispatchingHeaderDataService.getSelected();
			if (!header || _.isNil(header.PerformingProjectFk)) {
				return 0;
			}

			return header.PerformingProjectFk;
		};

		this.provideStockRowConfig = function provideStockRowConfig() {
			return basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
				dataServiceName: 'projectStockLookupDataService',
				filter: function () {
					return {PKey1: self.getPerformingProject(), PKey2: null, PKey3: null};
				}
			}, {
				gid: 'selectionfilter',
				rid: 'stock',
				label: 'Stock',
				label$tr$: 'logistic.dispatching.entityStock',
				type: 'integer',
				model: 'stockFk',
				sortOrder: 1
			});
		};

		this.provideStorageRowConfig = function provideStorageRowConfig() {
			return {
				gid: 'selectionfilter',
				rid: 'storage',
				label: 'Storage Location',
				label$tr$: 'logistic.dispatching.entityStockLocation',
				model: 'storageFk',
				sortOrder: 2,
				type: 'directive',
				directive: 'basics-lookupdata-lookup-composite',
				options: {
					lookupDirective: 'project-stock-location-dialog-lookup',
					displayMember: 'Code',
					descriptionMember: 'DescriptionInfo.Translated',
					showClearButton: true,
					lookupOptions: {
						additionalFilters: [{
							'projectFk': 'ProjectFk',
							projectFkReadOnly: false,
							getAdditionalEntity: function () {
								let prj = self.getPerformingProject();
								let item = {
									'ProjectFk': prj ? prj : null
								};
								return item;
							}
						}, {
							'projectStockFk': 'stockFk',
							projectStockFkReadOnly: false,
							getAdditionalEntity: function (item) {
								return item;
							}
						}],
						showClearButton: true
					}
				}
			};
		};

		this.provideWorkOperationTypeConfig = function provideWorkOperationTypeConfig() {
			var ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
				dataServiceName: 'resourceWorkOperationTypeLookupDataService'
			}).detail;
			var conf = {
				gid: 'selectionfilter',
				rid: 'workoperationtype',
				label: 'Work Operation Type',
				label$tr$: 'basics.customize.workoperationtypefk',
				model: 'workOperationTypeFk',
				sortOrder: 2
			};

			return $.extend(conf, ovl);
		};

		this.provideJobRowConfig = function provideJobRowConfig() {
			var ovl = platformLayoutHelperService.provideJobLookupOverload().detail;
			var conf = {
				gid: 'selectionfilter',
				rid: 'job',
				label: 'Job',
				label$tr$: 'logistic.job.entityJob',
				model: 'jobFk',
				readonly: true,
				sortOrder: 1
			};
			return $.extend(conf, ovl);
		};

		this.createFilterParams = function createFilterParams(filter, uuid) {
			var params = instances[uuid];
			if(_.isNull(params) || _.isUndefined(params)) {
				params = self.provideFilterParams(filter, uuid);
				instances[uuid] = params;
			}

			return params;
		};

		this.handleFilter = function handleFilter(formConfig, entity, filter) {
			switch (filter) {
				case 'stockFk':
					formConfig.rows.push(self.provideStockRowConfig());
					entity.stockFk = null;
					break;
				case'storageFk':
					formConfig.rows.push(self.provideStorageRowConfig());
					entity.storageFk = null;
					break;
				case'workOperationTypeFk':
					formConfig.rows.push(self.provideWorkOperationTypeConfig());
					entity.workOperationTypeFk = null;
					break;
				case'jobFk':
					formConfig.rows.push(self.provideJobRowConfig());
					entity.jobFk = null;
					break;
			}
		};

		var entity = {};

		function onHeaderSelectionChanged(e, header) {
			entity.stockFk = null;
			entity.workOperationTypeFk = null;

			if(header !== null && header.Job1Fk > 0) {
				entity.jobFk = header.Job1Fk;
			}
			var fields = [
				{ field: 'jobFk', readonly: header && header.Version > 0}
			];
			platformRuntimeDataService.readonly(entity, fields);
		}

		var selectedHeader = logisticDispatchingHeaderDataService.getSelected();
		if (selectedHeader !== null && selectedHeader.Job1Fk > 0) {
			entity.jobFk = selectedHeader.Job1Fk;
		}
		logisticDispatchingHeaderDataService.registerSelectionChanged(onHeaderSelectionChanged);
		logisticDispatchingHeaderDataService.registerEntityCreated(onHeaderSelectionChanged);


		this.provideFilterParams = function provideFilterParams(filter, uuid) {
			var formConfig = {
				fid: 'logistic.dispatching.selectionfilter' + uuid,
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
					self.handleFilter(formConfig, entity, filter[i]);
				}
			} else {
				self.handleFilter(formConfig, entity, filter);
			}
			entity.uuid = uuid;
			return {entity: entity, config: platformTranslateService.translateFormConfig(formConfig)};
		};
	}
})(angular);