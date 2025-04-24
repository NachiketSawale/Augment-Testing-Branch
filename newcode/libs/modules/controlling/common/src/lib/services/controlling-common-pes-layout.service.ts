import {Injectable} from '@angular/core';
import {IControllingCommonPesEntity} from '../model/entities/controlling-common-pes-entity.interface';
import {ILayoutConfiguration} from '@libs/ui/common';
import {prefixAllTranslationKeys} from '@libs/platform/common';


@Injectable({
    providedIn: 'root'
})export class ControllingCommonPesLayoutService{

    public async generateLayout<T extends IControllingCommonPesEntity>(): Promise<ILayoutConfiguration<T>>{
        return this.commonLayout() as ILayoutConfiguration<T>;
    }

    protected commonLayout():  ILayoutConfiguration<IControllingCommonPesEntity>{
        const pesCommonLayout ={
            groups: [
                {
                    gid: 'basicData',
                    title: {
                        'key': 'cloud.common.entityProperties',
                        'text': 'Basic Data'
                    },
                    attributes: [
                        'Code',
                        'Description',
                        'MdcControllingunitFk',
                        'PesStatusFk',
                        'PesValue',
                        'PrjChangeFk',
                        'ControllingUnitCode',
                        'ControllingUnitDescription',
                        'ContrCostCodeCode',
                        'ContrCostCodeDescription',
                        'HeaderId',
                        'HeaderCode',
                        'HeaderDescription',
                        'HeaderTotal',
                        'ItemFilteredTotal',
                        'StatusFk',
                        'BusinessPartnerFk',
                        'DocumentDate',
                        'DateDelivered',
                        'DateDeliveredFrom',
                        'DateEffective'
                    ]
                }
            ],
            labels: {
                ...prefixAllTranslationKeys('cloud.common.', {
                    'Code': {
                        'key': 'entityCode',
                        'text': 'Code'
                    },
                    'Description': {
                        'key': 'entityDescription',
                        'text': 'Description'
                    },
                    'PesValue': {
                        'key': 'entityTotal',
                        'text': 'Total'
                    },
                    'HeaderId': {
                        'key': 'entityCode',
                        'text': 'Code'
                    },
                    'HeaderCode': {
                        'key': 'entityCode',
                        'text': 'Code'
                    },
                    'HeaderDescription': {
                        'key': 'entityDescription',
                        'text': 'Description'
                    },
                    'StatusFk': {
                        'key': 'entityStatus',
                        'text': 'Status'
                    },
                    'BusinessPartnerFk': {
                        'key': 'entityBusinessPartner',
                        'text': 'Business Partner'
                    }
                }),
                ...prefixAllTranslationKeys('controlling.generalcontractor.', {
                    'MdcControllingunitFk': {
                        'key': 'entityControllingUnit',
                        'text': 'Controlling Unit'
                    },
                    'PesStatusFk': {
                        'key': 'pesStatusFk',
                        'text': 'Pes Status'
                    },
                    'PrjChangeFk': {
                        'key': 'prjChangeFk',
                        'text': 'Change'
                    }
                }),
                ...prefixAllTranslationKeys('controlling.structure.', {
                    'ControllingUnitCode': {
                        'key': 'controllingUnitCode',
                        'text': 'Controlling Unit Code'
                    },
                    'ControllingUnitDescription': {
                        'key': 'controllingUnitDescription',
                        'text': 'Controlling Unit Description'
                    },
                    'ContrCostCodeCode': {
                        'key': 'contrCostCodeCode',
                        'text': 'ContrCostCodeCode'
                    },
                    'ContrCostCodeDescription': {
                        'key': 'contrCostCodeDescription',
                        'text': 'Controlling Cost Code Description'
                    },
                    'HeaderTotal': {
                        'key': 'headerTotal',
                        'text': 'Header Total'
                    },
                    'ItemFilteredTotal': {
                        'key': 'itemFilteredTotal',
                        'text': 'Item Filtered Total'
                    }
                }),
                ...prefixAllTranslationKeys('procurement.pes.', {
                    'DocumentDate': {
                        'key': 'entityDocumentDate',
                        'text': 'Document Date'
                    },
                    'DateDelivered': {
                        'key': 'entityDateDelivered',
                        'text': 'Date Delivered'
                    },
                    'DateDeliveredFrom': {
                        'key': 'entityDateDeliveredFrom',
                        'text': 'Date Delivered From'
                    }
                }),
                ...prefixAllTranslationKeys('basics.common.', {
                    'DateEffective': {
                        'key': 'dateEffective',
                        'text': 'Date Effective'
                    }
                })
            },
            //base overLoad will do for next
            overloads:{
                Code: {readonly: true},
                Description: {readonly: true},
                PesValue: {readonly: true},
                MdcControllingunitFk: {readonly: true},
                PesStatusFk: {readonly: true},
                PrjChangeFk: {readonly: true}
            }
        };

        return pesCommonLayout;
    }
}