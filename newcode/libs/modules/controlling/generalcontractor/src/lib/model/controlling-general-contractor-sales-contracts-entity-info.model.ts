
import {
    ControllingGeneralContractorSalesContractsBehavior
} from '../behaviors/controlling-general-contractor-sales-contracts-behavior.service';
import {EntityInfo} from '@libs/ui/business-base';
import {prefixAllTranslationKeys} from '@libs/platform/common';

import {ISalesContractsEntity} from './entities/gcc-sales-contracts-entity.interface';
import {
    ControllingGeneralContractorSalesContractsDataService
} from '../services/controlling-general-contractor-sales-contracts-data.service';

export const ControllingGeneralContractorSalesContractsEntityInfo: EntityInfo = EntityInfo.create<ISalesContractsEntity> ({
    grid: {
        title: {text: 'Sales Contracts', key: 'controlling.generalcontractor.SalesContractsContainer'},
        behavior: ctx => ctx.injector.get(ControllingGeneralContractorSalesContractsBehavior),
    },
    dataService: ctx => ctx.injector.get(ControllingGeneralContractorSalesContractsDataService),
    dtoSchemeId: {moduleSubModule: 'Sales.Contract', typeName: 'OrdHeaderDto'},
    permissionUuid: '69601b8f4a7d4c519c8e2d7781a7aabc',
    layoutConfiguration: {
        groups: [{
            gid: 'baseGroup',
            attributes: ['Flag', 'Description', 'Code', 'Comment',
                'OrdStatusFk', 'PrjChangeFk', 'Total','BusinessPartnerFk','CustomerFk']
        }],
        labels: {
            ...prefixAllTranslationKeys('controlling.generalcontractor.', {
                Flag :{key:'flag',text:'Flag'},
                Description :{key:'Amount',text:'Amount'},
                Code :{key:'entityControllingUnit',text:'Controlling Unit'},
                Comment :{key:'ConHeaderFk',text:'Contract'},
                OrdStatusFk :{key:'prcPackageFk',text:'Package'},
                PrjChangeFk :{key:'Description',text:'Description'},
                Total :{key:'Comment',text:'Comment'},
                BusinessPartnerFk :{key:'Comment',text:'Comment'},
                CustomerFk :{key:'Comment',text:'Comment'}
            })
        },
        overloads: {
            Flag :{
                readonly:true
                //formatter to do ,LQ
            },
            Code :{ readonly:true},
            OrdStatusFk :{ readonly:true},
            PrjChangeFk :{ readonly:true},
            Total :{ readonly:true},
            CustomerFk :{
                readonly:true
                // LOOKUP TO DO CustomerFk LQ
            },
            Description :{readonly:true},
            Comment :{readonly:true}
        }
    }
});