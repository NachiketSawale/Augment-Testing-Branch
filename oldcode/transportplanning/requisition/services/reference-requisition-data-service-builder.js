/**
 * Created by waz on 5/8/2018.
 */
(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.requisition';

	angular.module(moduleName).factory('transportplanningRequisitionReferenceDataServiceBuilder', ReferenceDataServiceBuilder);
	ReferenceDataServiceBuilder.$inject = [
		'$http',
		'$injector',
		'basicsLookupdataLookupDescriptorService',
		'transportplanningRequisitionDataServiceBuilder'];

	function ReferenceDataServiceBuilder($http,
	                                     $injector,
	                                     basicsLookupdataLookupDescriptorService,
	                                     BaseDataServiceBuilder) {
		var Builder = function (mainOptionsType) {
			BaseDataServiceBuilder.call(this, mainOptionsType);
			initOptions(this);
		};

		Builder.prototype = Object.create(BaseDataServiceBuilder.prototype);
		var base = BaseDataServiceBuilder.prototype;

		Builder.prototype.setupServiceContainer = function (serviceContainer) {
			var self = this;

			base.setupServiceContainer.call(this, serviceContainer);

			var canCreateReference = {
				'MntActivityFk': function () {
					return true;
				}
			};
			var canDeleteReference = {
				'MntActivityFk': function () {
					return !serviceContainer.service.isSelectedItemAccepted();
				}
			};

			// get the type of parent service by referenceForeignKeyProperty
			if (this.serviceOptions[this.mainOptionsType].actions.createReference) {
				serviceContainer.service.canCreateReference = function () {
					return canCreateReference[self.serviceOptions[self.mainOptionsType].actions.referenceForeignKeyProperty]();
				};
			}
			if (this.serviceOptions[this.mainOptionsType].actions.deleteReference) {
				serviceContainer.service.canDeleteReference = function () {
					return canDeleteReference[self.serviceOptions[self.mainOptionsType].actions.referenceForeignKeyProperty]();
				};
			}
		};

		function initOptions() {
		}

		return Builder;
	}
})(angular);