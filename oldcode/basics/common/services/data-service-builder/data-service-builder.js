/**
 * Created by waz on 2/9/2018.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc factory
	 * @name basicsCommonBaseDataServiceBuilder
	 * @description
	 * A dataService builder base on platformDataServiceFactory, it try to handle the problem of the data service common configuration,
	 * the best practice is try to inherit this class with your own data service builder and use this data serivce builder to generate
	 * some data services have a lot of same features.
	 */
	const moduleName = 'basics.common';
	const module = angular.module(moduleName);

	module.factory('basicsCommonBaseDataServiceBuilder', BaseDataServiceBuilder);
	BaseDataServiceBuilder.$inject = [
		'basicsCommonBaseDataServiceBasicExtension',
		'basicsCommonBaseDataServiceRoleAssignExtension',
		'basicsCommonBaseDataServiceModificationMonitorExtension',
		'basicsCommonBaseDataServiceReferenceActionExtension',
		'platformDataServiceFactory',
		'_'];

	function BaseDataServiceBuilder(
		basicExtension,
		roleAssignExtension,
		monitorExtension,
		referenceActionExtension,
		platformDataServiceFactory,
		_) {

		/**
		 * Builder constructor
		 * @param mainOptionsType
		 * main options type, reference: 'flatRootItem', 'flatNodeItem', 'hierarchicalRootItem', 'hierarchicalItem'
		 * @constructor
		 */
		const Builder = function (mainOptionsType) {
			this.mainOptionsType = mainOptionsType ? mainOptionsType : 'flatRootItem';
			this.serviceOptions = {};
			this.serviceOptions[mainOptionsType] = {};
			this.validationService = '';
			this.serviceContainer = null;
		};

		/**
		 * Set dataService info
		 * @param info
		 * DataService info
		 * @returns {Builder}
		 */
		Builder.prototype.setServiceInfo = function (info) {
			mergeConfig(this.serviceOptions[this.mainOptionsType], info);
			return this;
		};

		/**
		 * Set validation service
		 * @param service
		 * @returns {Builder}
		 */
		Builder.prototype.setValidationService = function (service) {
			this.validationService = service;
			return this;
		};

		/**
		 * Set http resource
		 * @param httpResource
		 * @returns {Builder}
		 */
		Builder.prototype.setHttpResource = function (httpResource) {
			this.serviceOptions[this.mainOptionsType].httpCRUD =
				this.serviceOptions[this.mainOptionsType].httpCRUD ? this.serviceOptions[this.mainOptionsType].httpCRUD : {};

			const httpConfig = this.serviceOptions[this.mainOptionsType].httpCRUD;
			mergeConfig(httpConfig, httpResource);
			return this;
		};

		/**
		 * Set entity role
		 * @param enityRole
		 * @returns {Builder}
		 */
		Builder.prototype.setEntityRole = function (enityRole) {
			this.serviceOptions[this.mainOptionsType].entityRole = enityRole;
			return this;
		};

		/**
		 * Set container data changed monitor
		 * @param {Object} monitor
		 * @returns {Builder}
		 */
		Builder.prototype.setMonitor = function (monitor) {
			this.serviceOptions[this.mainOptionsType].monitor = monitor;
			return this;
		};

		/**
		 * Set actions
		 * @param actions
		 * @returns {Builder}
		 */
		Builder.prototype.setActions = function (actions) {
			const defaultActions = this.serviceOptions[this.mainOptionsType].actions;
			if (actions && defaultActions) {
				actions.canDeleteCallBackFunc = actions.canDeleteCallBackFunc ?
					actions.canDeleteCallBackFunc :
					defaultActions.canDeleteCallBackFunc;
			}
			this.serviceOptions[this.mainOptionsType].actions = actions;
			return this;
		};

		/**
		 * Set sidebarSearch
		 * @param sidebarSearch
		 * @returns {Builder}
		 */
		Builder.prototype.setSidebarSearch = function (sidebarSearch) {
			this.serviceOptions[this.mainOptionsType].sidebarSearch = sidebarSearch;
			return this;
		};

		/**
		 * Set presenter
		 * @param presenter
		 * @returns {Builder}
		 */
		Builder.prototype.setPresenter = function (presenter) {
			const type = _.keys(presenter)[0];
			if (!type) {
				return;
			}
			// initCreationData

			this.serviceOptions[this.mainOptionsType].presenter =
				this.serviceOptions[this.mainOptionsType].presenter ? this.serviceOptions[this.mainOptionsType].presenter : {};

			this.serviceOptions[this.mainOptionsType].presenter[type] =
				this.serviceOptions[this.mainOptionsType].presenter[type] ? this.serviceOptions[this.mainOptionsType].presenter[type] : {};

			const originPresenterOptions = _.cloneDeep(this.serviceOptions[this.mainOptionsType].presenter);
			this.serviceOptions[this.mainOptionsType].presenter = presenter;

			const presenterOptions = this.serviceOptions[this.mainOptionsType].presenter;
			presenterOptions[type].handleCreateSucceeded = presenter[type].handleCreateSucceeded ?
				presenter[type].handleCreateSucceeded :
				originPresenterOptions[type].handleCreateSucceeded;
			presenterOptions[type].incorporateDataRead = presenter[type].incorporateDataRead ?
				presenter[type].incorporateDataRead :
				originPresenterOptions[type].incorporateDataRead;
			presenterOptions[type].initCreationData = presenter[type].initCreationData ?
				presenter[type].initCreationData :
				originPresenterOptions[type].initCreationData;
			return this;
		};

		/**
		 * Used to init serviceOptions before build
		 * @param serviceOptions
		 */
		Builder.prototype.onBuildStarted = function (serviceOptions) {
		};

		/**
		 * Setup data service container, call after the build function finished
		 * @param serviceContainer
		 */
		Builder.prototype.setupServiceContainer = function (serviceContainer) {
		};

		/**
		 * Setup data processor, call after the build function finished
		 * @param dataProcessor
		 */
		Builder.prototype.setDataProcessor = function (dataProcessor) {
			this.serviceOptions[this.mainOptionsType].dataProcessor = dataProcessor;
			return this;
		};

		/**
		 * Build data service container
		 * @returns {null|*}
		 */
		Builder.prototype.build = function () {
			const self = this;

			function initServiceContainer(serviceContainer) {

				basicExtension.addBasics(serviceContainer);

				const role = _.keys(self.serviceOptions[self.mainOptionsType].entityRole)[0];
				const assignOptions = self.serviceOptions[self.mainOptionsType].entityRole[role].assign;
				roleAssignExtension.addRoleAssign(serviceContainer, assignOptions);

				const monitorOptions = self.serviceOptions[self.mainOptionsType].monitor;
				monitorExtension.addModificationMonitor(serviceContainer, monitorOptions);

				const actions = self.serviceOptions[self.mainOptionsType].actions;
				referenceActionExtension.addReferenceActions(serviceContainer, actions);
			}

			this.onBuildStarted(this.serviceOptions);
			this.serviceContainer = platformDataServiceFactory.createNewComplete(this.serviceOptions);
			initServiceContainer(this.serviceContainer);
			this.setupServiceContainer(this.serviceContainer);
			return this.serviceContainer;
		};

		function mergeConfig(originConfig, newConfig) {
			_.merge(originConfig, newConfig);
		}

		return Builder;
	}
})(angular);