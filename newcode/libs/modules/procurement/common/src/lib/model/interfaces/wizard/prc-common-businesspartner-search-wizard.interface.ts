/*
 * Copyright(c) RIB Software GmbH
 */
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { IProcurementCommonWizardConfig } from '../procurement-common-wizard-config.interface';
import { DataServiceFlatNode } from '@libs/platform/data-access';
import { IBusinessPartnerWizardInitialEntity } from '@libs/businesspartner/shared';


export interface IProcurementCommonBusinessPartnerSearchWizardConfig<T extends IEntityIdentification, U extends CompleteIdentification<T>, PT extends object, PU extends CompleteIdentification<PT>>
	extends IProcurementCommonWizardConfig<T, U> {
	url?: string,
	subDataService?: DataServiceFlatNode<PT, PU, T, U>;
	getWizardInitialEntity: (entity: T, subEntity: PT) => IBusinessPartnerWizardInitialEntity & { headerFk?: number },
}