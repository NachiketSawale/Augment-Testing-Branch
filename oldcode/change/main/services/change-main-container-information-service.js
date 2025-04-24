(function (angular) {

	'use strict';
	var changeMainModule = angular.module('change.main');

	/**
	 * @ngdoc service
	 * @name changeMainContainerInformationService
	 * @function
	 *
	 * @description
	 *
	 */
	changeMainModule.service('changeMainContainerInformationService', ChangeMainContainerInformationService);

	ChangeMainContainerInformationService.$inject = ['_', '$injector', 'platformLayoutHelperService', 'basicsLookupdataConfigGenerator',
		'basicsLookupdataLookupFilterService', 'changeMainConstantValues', 'changeMainService','changeCommonDragDropService'];

	function ChangeMainContainerInformationService(_, $injector, platformLayoutHelperService, basicsLookupdataConfigGenerator,
		basicsLookupdataLookupFilterService, changeMainConstantValues, changeMainService, changeCommonDragDropService) {
		var dynamicConfigurations = {};
		var containerUuids = changeMainConstantValues.uuid.container;
		var self = this;

		(function initialize(filterService) {
			filterService.registerFilter([
				{
					key: 'change-main-rubric-category-by-rubric-filter',
					fn: function (rc) {
						return rc.RubricFk === 14;
					}
				},
				{
					key: 'change-main-type-by-rubric-category-filter',
					fn: function (item, entity) {
						return entity.Version === 0 || item.RubricCategoryFk === entity.RubricCategoryFk;
					}
				},
				{
					key: 'change-main-by-rubric-category-filter',
					fn: function (item, entity) {
						return item.RubricCategoryFk === entity.RubricCategoryFk;
					}
				},
				{
					key: 'change-main-rubric-category-by-rubric-and-islive-filter',
					fn: function (rc) {
						return rc.RubricFk === 14 && rc.isLive === true;
					}
				},
			]);
		})(basicsLookupdataLookupFilterService);

		this.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			var config = {};
			switch (guid) {
				case containerUuids.changeList: // changeMainListController
					self.addGridLayout(config, 'changeMainConfigurationService');
					// config.listConfig.pinningContext =  {required: ['project']};
					config.listConfig = { initCalled: false, columns: [], dragDropService: changeCommonDragDropService, type: 'change.main' };
					self.addChangeServices(config);
					break;
				case containerUuids.changeDetail: // changeMainDetailController
					self.addDetailLayout(config, 'changeMainConfigurationService');
					self.addChangeServices(config);
					break;
				case containerUuids.changeReferenceList: // changeMainReferenceListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getChangeMainReferenceServiceInfos(),self.getChangeMainReferenceLayout);
					break;
				case containerUuids.changeReferenceDetail: // changeMainReferenceDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getChangeMainReferenceServiceInfos(),self.getChangeMainReferenceLayout);
					break;
				case containerUuids.changeTotalList: // changeTotalsViewListController
					self.addGridLayout(config, 'changeTotalsViewConfigurationService');
					self.addChangeTotalServices(config);
					break;
				case containerUuids.changeTotalDetail: // changeTotalsViewDetailController
					self.addDetailLayout(config, 'changeTotalsViewConfigurationService');
					self.addChangeTotalServices(config);
					break;
				case containerUuids.changeTotalGroupedList: // changeTotalsGroupedViewListController
					self.addGridLayout(config, 'changeTotalsGroupedViewConfigurationService');
					self.addChangeTotalGroupedServices(config);
					break;
				case containerUuids.changeTotalGroupedDetail: // changeTotalsGroupedViewDetailController
					self.addDetailLayout(config, 'changeTotalsGroupedViewConfigurationService');
					self.addChangeTotalGroupedServices(config);
					break;
				case containerUuids.change2ExternalList:// changeMainChange2ExternalListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getChange2ExternalDefaultServiceInfos(),self.getChange2ExternalDefaultLayout);
					break;
				case containerUuids.change2ExternalDetail:// changeMainChange2ExternalDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getChange2ExternalDefaultServiceInfos(),self.getChange2ExternalDefaultLayout);
					break;

				default: config = self.hasDynamic(guid) ? dynamicConfigurations[guid] : {}; break;
			}

			return config;
		};

		this.getChangeMainReferenceServiceInfos = function getChangeMainReferenceServiceInfos() {
			return {
				standardConfigurationService: 'changeMainReferenceLayoutService',
				dataServiceName: 'changeMainReferenceDataService',
				validationServiceName: 'changeMainReferenceValidationService'
			};
		};

		this.getChangeMainReferenceLayout = function getChangeMainReferenceLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'change.main.changereference',
				['changeassignmentfk', 'commenttext']
			);
			res.overloads = platformLayoutHelperService.getOverloads(['changeassignmentfk'], self);
			return res;
		};

		this.getChange2ExternalDefaultServiceInfos = function getChange2ExternalDefaultServiceInfos() {
			return {
				standardConfigurationService: 'changeMainChange2ExternalLayoutService',
				dataServiceName: 'changeMainChange2ExternalDataService',
				validationServiceName: 'changeMainChange2ExternalValidationService'
			};
		};

		this.getChange2ExternalDefaultLayout = function getChange2ExternalDefaultLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'change.main.change2external',
				['projectfk', 'externalsourcefk', 'extguid', 'extname', 'extpath']
			);
			res.overloads = platformLayoutHelperService.getOverloads(['externalsourcefk', 'projectfk'], self);
			return res;
		};

		this.addChangeServices = function addChangeServices(config) {
			config.standardConfigurationService = 'changeMainConfigurationService';
			config.dataServiceName = 'changeMainService';
			config.validationServiceName = 'changeMainValidationService';
		};

		this.addChangeTotalServices = function addChangeTotalServices(config) {
			config.standardConfigurationService = 'changeTotalsViewConfigurationService';
			config.dataServiceName = 'changeTotalsViewService';
			config.validationServiceName = '';
		};

		this.addChangeTotalGroupedServices = function addChangeTotalGroupedServices(config) {
			config.standardConfigurationService = 'changeTotalsGroupedViewConfigurationService';
			config.dataServiceName = 'changeTotalsGroupedViewService';
			config.validationServiceName = '';
		};

		this.addGridLayout = function addGridLayout(config, layoutServiceName) {
			var layServ = $injector.get(layoutServiceName);
			config.layout = layServ.getStandardConfigForListView();
			config.ContainerType = 'Grid';
			config.listConfig = { initCalled: false, columns: [], pinningContext: {required: ['project']}};
		};

		this.addDetailLayout = function addDetailLayout(config, layoutServiceName) {
			var layServ = $injector.get(layoutServiceName);
			config.layout = layServ.getStandardConfigForDetailView();
			config.ContainerType = 'Detail';
		};

		this.hasDynamic = function hasDynamic(guid) {
			return !_.isNull(dynamicConfigurations[guid]) && !_.isUndefined(dynamicConfigurations[guid]);
		};

		this.takeDynamic = function takeDynamic(guid, config) {
			dynamicConfigurations[guid] = config;
		};

		function getProjectChangeLookupOverload() {
			let lookupInfo = {};
			lookupInfo[0] = {
				column: 'ChangeFk',
				lookup: {
					readonly: true,
					directive: 'project-change-dialog',
					options: {
						descriptionMember: 'Description',
						showClearButton: false,
						displayMember: 'Code',
						lookupType: 'projectchange',
					}
				}
			};
			lookupInfo[1] = {
				column: 'ChangeReferenceFk',
				lookup: {
					directive: 'project-change-dialog',
					options: {
						descriptionMember: 'Description',
						showClearButton: false,
						displayMember: 'Code',
						lookupType: 'projectchange',
						hideAddButton: true,
						filterOptions: {
							serverKey: 'change-main-lookup-for-reference-filter',
							serverSide: true,
							fn: function (dataContext) {
								var selChange = changeMainService.getItemById(dataContext.ParentFk);
								return {
									ProjectFk: selChange.ProjectFk,
									RubricCategoryFk: selChange.RubricCategoryFk
								};
							}
						},
						addGridColumns: [{
							id: 'description',
							field: 'Description',
							name: 'Description',
							name$tr$: 'cloud.common.entityDescription',
							formatter: 'description'
						}]
					}
				}
			};

			return {
				detail: {
					type: 'directive',
					directive: 'dynamic-grid-and-form-lookup',
					options: {
						isTextEditable: false,
						dependantField: 'AssignmentType',
						lookupInfo: lookupInfo,
						grid: false,
						dynamicLookupMode: true,
						showClearButton: false,
						hideAddButton: true
					}
				},
				grid: {
					editor: 'directive',
					editorOptions: {
						directive: 'dynamic-grid-and-form-lookup',
						dependantField: 'AssignmentType',
						lookupInfo: lookupInfo,
						isTextEditable: false,
						dynamicLookupMode: true,
						grid: true,
						showClearButton: false,
						hideAddButton: true
					},
					formatter: 'dynamic',
					domain: function (item, column, flag) {
						var info = lookupInfo[item.AssignmentType];
						if (info) {
							var prop = info.lookup.options;
							column.formatterOptions = {
								lookupType: prop.lookupType,
								displayMember: prop.displayMember,
								dataServiceName: prop.dataServiceName,
							};
							if (prop.version) {
								column.formatterOptions.version = prop.version;// for new lookup master api, the value of version should be greater than 2
							}
						} else {
							column.formatterOptions = null;
						}

						return flag ? 'directive' : 'lookup';
					}
				}
			};
		}

		this.getOverload = function getOverload(overload) {
			var ovl = null;

			switch (overload) {
				 case 'changeassignmentfk':
					 ovl = getProjectChangeLookupOverload();
				 break;
				case 'externalsourcefk':
					ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.externalsource');
					break;
				case 'projectfk':
					ovl = platformLayoutHelperService.provideProjectLookupReadOnlyOverload('change.main.change2ExternalCategory');
					break;
			}
			return ovl;
		};
	}

})(angular);