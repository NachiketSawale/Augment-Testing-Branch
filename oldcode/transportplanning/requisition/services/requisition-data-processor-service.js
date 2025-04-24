/**
 * Created by zwz on 3/25/2021.
 */
(function (angular) {
    'use strict';
    var moduleName = 'transportplanning.requisition';
    /**
     * @ngdoc service
     * @name transportplanningRequisitionDataProcessorService
     * @description
     * A service to process requisition item
     *
     */
    angular.module(moduleName).service('transportplanningRequisitionDataProcessorService', Service);

    Service.$inject = ['platformDataServiceProcessDatesBySchemeExtension', 'platformRuntimeDataService', 'basicsLookupdataLookupDescriptorService', 'mountingTrsRequisitionStatusLookupService', 'basicsCompanyNumberGenerationInfoService', 'ppsCommonCodGeneratorConstantValue'];

    function Service(platformDataServiceProcessDatesBySchemeExtension, platformRuntimeDataService, basicsLookupdataLookupDescriptorService, trsReqStatusService, basicsCompanyNumberGenerationInfoService, ppsCommonCodGeneratorConstantValue) {

        this.getDataProcessors = function () {
            return [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
                typeName: 'RequisitionDto',
                moduleSubModule: 'TransportPlanning.Requisition'
            }), {
                processItem: processTrsRequisition,
                processItems: processTrsData
            }, {
                processItem: function (item) {
                    item.getType = function () {
                        return item.EventTypeFk;
                    };
                    if (item.Version > 0) {
                        platformRuntimeDataService.readonly(item, [{ field: 'DateshiftMode', readonly: true }]);
                        platformRuntimeDataService.readonly(item, [{ field: 'IsPickup', readonly: true }]);
	                    platformRuntimeDataService.readonly(item, [{field: 'Code', readonly: false}]);
                    }
                    else if(item.Version === 0){
                        var categoryId = ppsCommonCodGeneratorConstantValue.getCategoryFkviaEventType(item.EventTypeFk, ppsCommonCodGeneratorConstantValue.PpsEntityConstant.TransportRequisition);
                        if( categoryId !== null &&  basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('trsRequsitionNumberInfoService').hasToGenerateForRubricCategory(categoryId) )
                        {
                            item.Code = basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('trsRequsitionNumberInfoService').provideNumberDefaultText(categoryId);
	                        platformRuntimeDataService.readonly(item, [{field: 'Code', readonly: true}]);
                        }
                    }
                }
            }];
        };

        function processTrsRequisition(item) {

            var statusList = trsReqStatusService.getList();
            var status = _.find(statusList, {Id: item.TrsReqStatusFk});
            if(status.BackgroundColor) {
                item.BackgroundColor = status.BackgroundColor;
            }

            var fields = [];

            item.PlannedTimeDay = item.PlannedTime;

            if (!item.LgmJobFk) {
                fields.push({ field: 'BusinessPartnerFk', readonly: true });
                fields.push({ field: 'ContactFk', readonly: true });
            }
            else if (!item.BusinessPartnerFk) {
                fields.push({ field: 'ContactFk', readonly: true });
            }

            fields.push({ field: 'PlannedTimeDay', readonly: true });

            var result = isItemAccepted(item);
            fields.push({ field: 'PlannedTime', readonly: result });
            fields.push({ field: 'PlannedStart', readonly: result });
            fields.push({ field: 'PlannedFinish', readonly: result });
            fields.push({ field: 'EarliestStart', readonly: result });
            fields.push({ field: 'EarliestFinish', readonly: result });
            fields.push({ field: 'LatestStart', readonly: result });
            fields.push({ field: 'LatestFinish', readonly: result });

            if (fields.length > 0) {
                platformRuntimeDataService.readonly(item, fields);
            }

            // update JobDeliveryAddressRemark when job changed
            var jobId = item.LgmJobFk;
            Object.defineProperty(item, 'LgmJobFk', {
                get: function () {
                    return jobId;
                },
                set: function (value) {
                    if (value !== jobId) {
                        jobId = value;
                        if (!_.isNil(value)) {
                            var job = basicsLookupdataLookupDescriptorService.getLookupItem('logisticJobEx', value);
                            if (job) {
                                item.JobDeliveryAddressRemark = job.DeliveryAddressRemark;
                            }
                        } else {
                            item.JobDeliveryAddressRemark = null;
                        }
                    }
                }
            });
        }

        function processTrsData() {
        }


        function isItemAccepted(item) {
            if (!item) {
                return false;
            }

            var statusList = trsReqStatusService.getList();
            var status = _.find(statusList, {Id: item.TrsReqStatusFk});
            // var status = basicsLookupdataLookupDescriptorService.getLookupItem('TrsRequisitionStatus', item.TrsReqStatusFk);
            return status && status.IsAccepted;
        }

    }

})(angular);
