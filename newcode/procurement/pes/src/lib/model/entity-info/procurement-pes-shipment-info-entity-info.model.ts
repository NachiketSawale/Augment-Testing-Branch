/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';
import { ProcurementModule } from '@libs/procurement/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IPesShipmentinfoEntity } from '../entities/pes-shipmentinfo-entity.interface';
import { ProcurementPesShipmentInfoDataService } from '../../services/procurement-pes-shipment-info-data.service';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';

/**
 * procurement pes shipment EntityInfo
 */
export const PROCUREMENT_PES_SHIPMENT_INFO_ENTITY_INFO: EntityInfo = EntityInfo.create<IPesShipmentinfoEntity>({
    grid: false,
    form: {
        title: { key: 'procurement.pes.shipmentInfoDetailContainerTitle' },
        containerUuid: '50235862FA2148B8A93AF36E77EE8BAC',
    },
    dataService: ctx => ctx.injector.get(ProcurementPesShipmentInfoDataService),
    dtoSchemeId: { moduleSubModule: ProcurementModule.Pes, typeName: 'PesShipmentinfoDto' },
    permissionUuid: '912b0a2b8c434dbdb8d267e447aef250',
    layoutConfiguration: {
        groups: [
            {
                gid: 'baseGroup',
                title: {
                    key: 'cloud.common.entityProperties',
                    text: 'Basic Data',
                },
                attributes: [
                    'Shipmentnumber', 'Packinglistnumber', 'BasCountryFk', 'Totaldimension', 'Totalweight'
                ],
            },
            {
                gid: 'Carrier',
                title: {
                    key: 'procurement.pes.groupCarrier',
                    text: 'Carrier',
                },
                attributes: [
                    'Trackingnumber', 'Carriername', 'Carrierlink', 'Logistics'
                ],
            },
        ],
        overloads: {
            BasCountryFk: BasicsSharedLookupOverloadProvider.provideCommonCountryLookupOverload(false, true),
            'Logistics': {
                maxLength: 16
            },

        },
        labels: {
            ...prefixAllTranslationKeys('procurement.pes.', {
                Shipmentnumber: {
                    key: 'entityShipmentnumber',
                    text: 'Shipment Number',
                },
                Packinglistnumber: {
                    key: 'entityPackinglistnumber',
                    text: 'Packinglist Number',
                },
                BasCountryFk: {
                    key: 'entityBasCountryFk',
                    text: 'Country of Origin',
                },
                Totaldimension: {
                    key: 'entityTotaldimension',
                    text: 'Total Dimension',
                },
                Totalweight: {
                    key: 'entityTotalweight',
                    text: 'Total Weight',
                },
                Trackingnumber: {
                    key: 'entityTrackingnumber',
                    text: 'Tracking Number',
                },
                Carriername: {
                    key: 'entityCarriername',
                    text: 'Carrier Name',
                },
                Carrierlink: {
                    key: 'entityCarrierlink',
                    text: 'Carrier Link',
                },
                Logistics: {
                    key: 'entityLogistics',
                    text: 'Logistics',
                },
            }),
        },
    }
} as IEntityInfo<IPesShipmentinfoEntity>);