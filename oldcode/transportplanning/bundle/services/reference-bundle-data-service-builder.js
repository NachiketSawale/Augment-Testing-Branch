/**
 * Created by waz on 5/4/2018.
 */
(function (angular) {
	'use strict';
	/*global _*/

	var moduleName = 'transportplanning.bundle';
	var BundleModul = angular.module(moduleName);

	/**
	 * @summary
	 * The reference-data-service-builder will build a data-service which need to assign bundles to parentService
	 */
	BundleModul.factory('transportplanningBundleReferenceDataServiceBuilder', ReferenceDataServiceBuilder);
	ReferenceDataServiceBuilder.$inject = [
		'$http',
		'$injector',
		'basicsCommonDataServiceChangeManager',
		'basicsLookupdataLookupDescriptorService',
		'transportplanningBundleDataServiceContainerBuilder',
		'transportplanningBundleLookupViewService'];

	function ReferenceDataServiceBuilder($http,
	                                     $injector,
	                                     basicsCommonDataServiceChangeManager,
	                                     basicsLookupdataLookupDescriptorService,
	                                     BaseDataServiceBuilder,
	                                     transportplanningBundleLookupViewService) {
		var Builder = function (mainOptionsType) {
			BaseDataServiceBuilder.call(this, mainOptionsType);
			initOptions(this);
		};

		Builder.prototype = Object.create(BaseDataServiceBuilder.prototype);
		var base = BaseDataServiceBuilder.prototype;

		Builder.prototype.setupServiceContainer = function (serviceContainer) {
			var self = this;

			base.setupServiceContainer.call(this, serviceContainer);
			serviceContainer.service.showReferencesSelectionDialog = showReferencesSelectionDialog;
			serviceContainer.service.registerReferenceCreated(refershBundleCalculation);
			serviceContainer.service.registerReferenceCreated(refershUnassignedBundleContainer);

			var canCreateReference = {
				'TrsPackageFk': function () {
					var packageItem = serviceContainer.service.parentService().getSelected();
					var status = basicsLookupdataLookupDescriptorService.getLookupItem('TrsPackageStatus', packageItem.TrsPkgStatusFk);
					return !status || status.Isinpackaging;
				},
				'TrsRequisitionFk': function () {
					return !serviceContainer.service.parentService().isSelectedItemAccepted();
				}
			};
			var canDeleteReference = {
				'TrsPackageFk': function () {
					var packageItem = serviceContainer.service.parentService().getSelected();
					var status = basicsLookupdataLookupDescriptorService.getLookupItem('TrsPackageStatus', packageItem.TrsPkgStatusFk);
					return !status || status.Isinpackaging;
				},
				'TrsRequisitionFk': function () {
					return !serviceContainer.service.parentService().isSelectedItemAccepted();
				}
			};

			// get the type of parent service by referenceForeignKeyProperty
			if (this.serviceOptions[this.mainOptionsType].actions.createReference) {
				serviceContainer.service.canCreateReference = function () {
					return canCreateReference[self.serviceOptions[self.mainOptionsType].actions.referenceForeignKeyProperty]();
				};
				if (self.serviceOptions[self.mainOptionsType].actions.referenceForeignKeyProperty === 'TrsRequisitionFk') {
					//register dateshift here!
					serviceContainer.service.registerReferenceCreated((e, items) => { chgTrsReqAssignment(items); });
				}
			}
			if (this.serviceOptions[this.mainOptionsType].actions.deleteReference) {
				serviceContainer.service.canDeleteReference = function () {
					return canDeleteReference[self.serviceOptions[self.mainOptionsType].actions.referenceForeignKeyProperty]();
				};

				if (self.serviceOptions[self.mainOptionsType].actions.referenceForeignKeyProperty === 'TrsRequisitionFk') {
					basicsCommonDataServiceChangeManager.registerEvent(
						serviceContainer.service,
						serviceContainer.service.parentService(),
						'registerReferenceDeleted',
						function (deletedItems) {
							var reqsBundleIds = {};
							var requisition = this.getSelected();
							var deleteItemIds = _.map(deletedItems, 'Id');
							reqsBundleIds[requisition.Id] = _.map(_.filter(serviceContainer.service.getList(), function (item) {
								return !_.includes(deleteItemIds, item.Id);
							}), 'Id');
							this.updateProductInfo(reqsBundleIds);
						});
					//register dateshift here!
					serviceContainer.service.registerReferenceDeleted((e, items) => { chgTrsReqAssignment(items, false); });
				}
			}

			function showReferencesSelectionDialog() {
				var currentService = getService(self.serviceOptions[self.mainOptionsType].serviceName);
				var listedItems = currentService.getList();
				// Todo: hardcode, need refactor
				var requisitionService = currentService.parentService();
				transportplanningBundleLookupViewService.showLookupDialog({
					targetDataService: self.serviceOptions[self.mainOptionsType].serviceName,
					referenceProperty: 'TrsRequisitionFk',
					jobId: requisitionService.getSelected().LgmJobFk,
					getReferencePropertyValue: function () {
						return requisitionService.getSelected().Id;
					},
					assignedBundles : _.map(listedItems, 'Id')
				});
			}

			function refershBundleCalculation(e, createItems) {
				if (!serviceContainer.service.parentService().updateProductInfo) {
					return;
				}

				var reqsBundleIds = {};
				var requisition = serviceContainer.service.parentService().getSelected();
				var assignBundleIds = _.flatten(_.map(createItems, 'Id'));
				var originBundleIds = _.map(serviceContainer.service.getList(), 'Id');
				reqsBundleIds[requisition.Id] = _.filter(_.uniq(_.concat(originBundleIds, assignBundleIds)),
					function (item) {
						return item !== null;
					});
				serviceContainer.service.parentService().updateProductInfo(reqsBundleIds);
			}

			function refershUnassignedBundleContainer(e, createItems) {
				if (!self.serviceOptions[self.mainOptionsType].actions.referenceSourceDataService) {
					return;
				}
				getService(self.serviceOptions[self.mainOptionsType].actions.referenceSourceDataService).notShowItems(createItems);
			}

			function chgTrsReqAssignment(bundles, add = true) {
				if (_.isFunction(serviceContainer.service.changeTrsRequisitionAssignment)) {
					serviceContainer.service.changeTrsRequisitionAssignment(bundles, add);
				}
			}
		};

		function getService(service) {
			return _.isObject(service) ? service : $injector.get(service);
		}

		function initOptions() {
		}

		return Builder;
	}
})(angular);
