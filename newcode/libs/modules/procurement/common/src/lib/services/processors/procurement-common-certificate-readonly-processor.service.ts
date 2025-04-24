/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { IPrcCertificateEntity } from '@libs/procurement/interfaces';
import { EntityReadonlyProcessorBase, ReadonlyFunctions, ReadonlyInfo } from '@libs/basics/shared';
import { ProcurementCommonCertificateDataService } from '../procurement-common-certificate-data.service';

/**
 * Procurement Certificate entity readonly processor
 */
export class ProcurementCommonCertificateReadonlyProcessor<T extends IPrcCertificateEntity,
    PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> extends EntityReadonlyProcessorBase<T> {

    /**
     *The constructor
     */
    public constructor(protected dataService: ProcurementCommonCertificateDataService<T, PT, PU>) {
        super(dataService);
    }


    public generateReadonlyFunctions(): ReadonlyFunctions<T> {
        return {
            RequiredAmount: e => !!e.item.IsValued,
            BPName1: {
                shared: [
                    'BpdCertificateTypeFk',
                    'BpdCertificateFk',
                    'BusinessPartnerFk',
                    'Code',
                    'Description',
                    'ExpirationDate',
                    'IsRequired',
                    'IsMandatory',
                    'IsRequiredSubSub',
                    'IsMandatorySubSub',
                    'IsValued',
                    'RequiredBy',
                    'CommentText',
                    'GuaranteeCost',
                    'GuaranteeCostPercent',
                    'ValidFrom',
                    'ValidTo'
                ],
                readonly: this.readonlyByParent
            }
        };
    }

    protected readonlyByParent(info: ReadonlyInfo<T>) {
        return !this.dataService.parentService.isValidForSubModule();
    }
}