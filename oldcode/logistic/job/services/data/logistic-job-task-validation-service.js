/**
 * Created by welss on 12.04.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.job';

	/**
	 * @ngdoc service
	 * @name logisticJobTaskValidationService
	 * @description provides validation methods for logistic job task entities
	 */
	angular.module(moduleName).service('logisticJobTaskValidationService', LogisticJobTaskValidationService);

	LogisticJobTaskValidationService.$inject = ['$injector','platformValidationServiceFactory', 'platformDataValidationService', 'logisticJobTaskDataService'];

	function LogisticJobTaskValidationService($injector, platformValidationServiceFactory, platformDataValidationService, logisticJobTaskDataService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface({
			typeName: 'JobTaskDto',
			moduleSubModule: 'Logistic.Job'
		},
		{
			mandatory: ['JobTaskTypeFk','ArticleFk']
		},
		self,
		logisticJobTaskDataService);

		self.validateAdditionalJobTaskTypeFk = function (entity, value) {
			logisticJobTaskDataService.typeChanged(null, value);
		};

		self.validateAdditionalArticleFk = function (entity, value) {
			logisticJobTaskDataService.articleChanged(entity, value);
		};

		self.validateContractHeaderFk = function (entity, value) {
			if(value){
				var businessPartnerFk = $injector.get('basicsLookupdataLookupDescriptorService').getItemByIdSync(value,{lookupType:'ConHeaderView'}).BusinessPartnerFk;
				entity.BusinessPartnerFk = businessPartnerFk !== null ? businessPartnerFk : entity.BusinessPartnerFk;
			}
		};

		self.validateInvHeaderFk = function (entity, value) {
			if(value && entity.JobTaskTypeFk === 2){
				var invoiceItem = $injector.get('basicsLookupdataLookupDescriptorService').getItemByIdSync(value,{lookupType:'InvHeaderChained'});
				entity.BusinessPartnerFk = invoiceItem.BusinessPartnerFk !== null ? invoiceItem.BusinessPartnerFk : entity.BusinessPartnerFk;
				entity.ContractHeaderFk = invoiceItem.ConHeaderFk !== null ? invoiceItem.ConHeaderFk : entity.ContractHeaderFk;
			}
		};
		self.validateJobCardAreaFk = function (entity) {
			var service = $injector.get('basicsLookupdataSimpleLookupService');
			var jobCardAreaLookup = service.getData({
				lookupModuleQualifier: 'basics.customize.jobcardarea',
				displayMember: 'Description',
				valueMember: 'Id'
			});
			var defaultEntity = _.find(jobCardAreaLookup, function (item) {return item.isDefault;});
			entity.JobCardAreaFk = defaultEntity.Id;
		};
	}

})(angular);
