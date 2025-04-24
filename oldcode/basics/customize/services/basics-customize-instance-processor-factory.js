/**
 * Created by Frank Baedeker on 2020-01-23
 */
(function () {
	'use strict';
	var moduleName = 'basics.customize';
	var basicsCustomizeModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name basicsCustomizeInstanceDataService
	 * @function
	 *
	 * @description
	 * basicsCustomizeInstanceDataService is the data service for all entity type descriptions
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	basicsCustomizeModule.service('basicsCustomizeInstanceProcessorFactory', BasicsCustomizeInstanceProcessorFactory);

	BasicsCustomizeInstanceProcessorFactory.$inject = ['platformDataServiceProcessDatesBySchemeExtension', 'platformRuntimeDataService',
		'basicsCustomizeTypeDataService',	'basicsCustomizeInstanceSchemeService', 'basicsCustomizeLogisticJobTypeProcessor', 'basicsCustomizeWageGroupProcessor'];

	function BasicsCustomizeInstanceProcessorFactory(platformDataServiceProcessDatesBySchemeExtension, platformRuntimeDataService,
	   basicsCustomizeTypeDataService, basicsCustomizeInstanceSchemeService, basicsCustomizeLogisticJobTypeProcessor, basicsCustomizeWageGroupProcessor) {

		const self = this;
		let curTypeDBTable = '';
		let curDateProcessor = null;
		let curReadOnlyProcessor = null;

		this.initializeCurrentProcessor = function initializeCurrentProcessor() {
			var sel = basicsCustomizeTypeDataService.getSelected();

			if(curTypeDBTable === '' || sel.DBTableName !== curTypeDBTable || curDateProcessor === null) {
				curTypeDBTable = sel.DBTableName;
				curDateProcessor = platformDataServiceProcessDatesBySchemeExtension.createProcessorFromScheme({
					properties: basicsCustomizeInstanceSchemeService.getSchemaForType(sel)
				});

				switch(curTypeDBTable) {
					case 'BAS_DISPLAYDOMAIN': self.initializeCurrentDisplayDomainProcessor(); break;
					case 'PRJ_CAT_CONFIGTYPE': self.initializeCurrentProjectCatalogConfigTypeProcessor(); break;
					case 'LGM_JOBTYPE': self.initializeCurrentLogisticJobTypeProcessor(); break;
					case 'LGM_RECORD_TYPE': self.initializeCurrentDispatchRecordTypeProcessor(); break;
					case 'MDC_WAGE_GROUP': self.initializeCurrentWageGroupProcessor(); break;
					default: curReadOnlyProcessor = null; break;
				}
			}
		};

		this.getCurrentDateProcessor = function getCurrentDateProcessor() {
			return curDateProcessor;
		};

		this.getCurrentReadOnlyProcessor = function getCurrentReadOnlyProcessor() {
			return curReadOnlyProcessor;
		};

		this.initializeCurrentDisplayDomainProcessor = function initializeCurrentDisplayDomainProcessor() {
			curReadOnlyProcessor = {
				processItem: function processDisplayDomain(item) {
					platformRuntimeDataService.readonly(item, [{ field: 'DomainName', readonly: true}]);
				}
			};
		};

		this.initializeCurrentProjectCatalogConfigTypeProcessor = function initializeCurrentProjectCatalogConfigTypeProcessor() {
			curReadOnlyProcessor = {
				processItem: function processProjectCatalogConfigType(item) {
					platformRuntimeDataService.readonly(item, [{ field: 'LineitemcontextFk', readonly: item.Version >= 1}]);
				}
			};
		};

		this.initializeCurrentLogisticJobTypeProcessor = function initializeCurrentLogisticJobTypeProcessor() {
			curReadOnlyProcessor = basicsCustomizeLogisticJobTypeProcessor;
		};

		this.initializeCurrentWageGroupProcessor = function initializeCurrentWageGroupProcessor() {
			curReadOnlyProcessor = basicsCustomizeWageGroupProcessor;
		};

		this.initializeCurrentDispatchRecordTypeProcessor = function initializeCurrentDispatchRecordTypeProcessor() {
			curReadOnlyProcessor = {
				processItem: function processDispatchRecordType(item) {
					platformRuntimeDataService.readonly(item, [{ field: 'IsLive', readonly: item.Id === 1 || item.Id === 5}]);
				}
			};
		};
	}
})();
