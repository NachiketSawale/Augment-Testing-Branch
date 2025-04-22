/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { IProcurementCommonWizardConfig } from '../procurement-common-wizard-config.interface';
import { DataServiceFlatRoot, DataServiceHierarchicalRoot } from '@libs/platform/data-access';
import { IPrcCommonReadonlyService } from '../prc-common-readonly-service.interface';

export interface IProcurementCommonChangeConfigWizardConfig<T extends IEntityIdentification, U extends CompleteIdentification<T>> extends IProcurementCommonWizardConfig<T, U> {
    rootDataService: (DataServiceHierarchicalRoot<T, U> | DataServiceFlatRoot<T, U>) & IPrcCommonReadonlyService<T>;
    moduleNameTranslationKey: string,
    moduleInternalName: string,
    getConfigurationFK: (entity: T) => number | undefined,
    getBillingSchemaFk?: (entity: T) => number | undefined,
    isUpdateHeaderTexts?: boolean,
    showBillingSchema?: boolean,
    rubricFk?: number,
}

export interface IChangeConfigureOptions {
    PrcConfigurationFk?: number,
    BillingSchemaFk?: number
}

export interface IChangeConfigureParams {
    MainItemId: number,
    PrcConfigurationFk: number,
    BillingSchemaFk?: number,
    Qualifier?: string
}