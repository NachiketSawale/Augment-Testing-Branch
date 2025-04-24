import {IControllingCommonPrcContractEntity} from '../model/entities/controlling-common-prc-contract-entity.interface';
import {prefixAllTranslationKeys} from '@libs/platform/common';
import {ILayoutConfiguration} from '@libs/ui/common';
import {inject, Injectable, Injector} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export  class ControllingCommonPrcContractLayoutService{
    private readonly injector = inject(Injector);
    public async generateLayout<T extends IControllingCommonPrcContractEntity>():Promise<ILayoutConfiguration<T>>{
        return <ILayoutConfiguration<T>>{
            groups: [
                {
                    gid: 'controllingprojectactual',
                    attributes: ['ControllingUnitCode', 'ControllingUnitDescription', 'ContrCostCodeCode', 'ContrCostCodeDescription',
                        'HeaderCode', 'HeaderDescription', 'HeaderTotal', 'ItemFilteredTotal',
                        'StatusFk', 'BusinessPartnerFk', 'DateOrdered', 'DateReported', 'DateCanceled',
                        'DateDelivery', 'DateCallofffrom', 'DateCalloffto', 'ConfirmationDate', 'DatePenalty', 'DateEffective',
                        'ExecutionStart', 'ExecutionEnd', 'ValidFrom', 'ValidTo']
                }
            ],
            labels:{
                ...prefixAllTranslationKeys('controlling.common.transferdatatobisExecutionReport.', {
                    ControllingUnitCode :{
                        key :'entityControllingUnitCode',
                        text:'Controlling Unit Code'
                    },
                    ControllingUnitDescription :{
                        key :'entityControllingUnitDesc',
                        text:'Controlling Unit Description'
                    },
                    ContrCostCodeCode :{
                        key :'contrCostCodeCode',
                        text:'Controlling Cost Code'
                    },
                    ContrCostCodeDescription :{
                        key :'contrCostCodeDescription',
                        text:'Controlling Cost Code Description'
                    },
                    HeaderCode :{
                        key :'Code',
                        text:'Code'
                    },
                    HeaderDescription :{
                        key :'Description',
                        text:'Description'
                    },
                    HeaderTotal :{
                        key :'headerTotal',
                        text:'Header Total'
                    },
                    ItemFilteredTotal :{
                        key :'ItemFilteredTotal',
                        text:'Item Filtered Total'
                    },
                    StatusFk :{
                        key :'StatusFk',
                        text:'StatusFk'
                    },
                    BusinessPartnerFk :{
                        key :'BusinessPartnerFk',
                        text:'Business Partner'
                    },
                    DateOrdered :{
                        key :'DateOrdered',
                        text:'Ordered'
                    },
                    DateReported :{
                        key :'DateReported',
                        text:'Reported'
                    },
                    DateCanceled :{
                        key :'DateCanceled',
                        text:'Canceled'
                    },
                    DateDelivery :{
                        key :'DateDelivery',
                        text:'Delivery Date'
                    },
                    DateCallofffrom :{
                        key :'DateCallofffrom',
                        text:'Call off from'
                    },
                    DateCalloffto :{
                        key :'DateCalloffto',
                        text:'Call off to'
                    },
                    ConfirmationDate :{
                        key :'ConfirmationDate',
                        text:'Confirmation Date'
                    },
                    DatePenalty :{
                        key :'DatePenalty',
                        text:'Date Penalty'
                    },
                    DateEffective :{
                        key :'DateEffective',
                        text:'Date Effective'
                    },
                    ExecutionStart :{
                        key :'ExecutionStart',
                        text:'Execution Start'
                    },
                    ExecutionEnd :{
                        key :'ExecutionEnd',
                        text:'Execution End'
                    },
                    ValidFrom :{
                        key :'ValidFrom',
                        text:'Valid From'
                    },
                    ValidTo :{
                        key :'ValidTo',
                        text:'Valid To'
                    }
                }),
            },
            overloads:{
                ControllingUnitCode : {readonly : true},
                ControllingUnitDescription : {readonly : true},
                ContrCostCodeCode : {readonly : true},
                ContrCostCodeDescription : {readonly : true},
                HeaderCode : {readonly : true},
                HeaderDescription : {readonly : true},
                HeaderTotal : {readonly : true},
                ItemFilteredTotal : {readonly : true},
                StatusFk : {readonly : true},
                BusinessPartnerFk : {readonly : true},
                DateOrdered : {readonly : true},
                DateReported : {readonly : true},
                DateCanceled : {readonly : true},
                DateDelivery : {readonly : true},
                DateCallofffrom : {readonly : true},
                DateCalloffto : {readonly : true},
                ConfirmationDate : {readonly : true},
                DatePenalty : {readonly : true},
                DateEffective : {readonly : true},
                ExecutionStart : {readonly : true},
                ExecutionEnd : {readonly : true},
                ValidFrom : {readonly : true},
                ValidTo : {readonly : true},


            }
        };
    }
}