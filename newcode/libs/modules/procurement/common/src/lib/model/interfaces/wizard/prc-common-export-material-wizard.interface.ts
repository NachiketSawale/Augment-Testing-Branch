/*
 * Copyright(c) RIB Software GmbH
 */
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { IProcurementCommonWizardConfig } from '../procurement-common-wizard-config.interface';
import { IEntitySelection } from '@libs/platform/data-access';
import { IMaterialExportParameters } from '../export-material-wizard.interface';

/**
 * Interface for procurement common export material wizard config
 */
export interface IProcurementCommonExportMaterialWizardConfig<TRootEntity extends IEntityIdentification, U extends CompleteIdentification<TRootEntity>, TEntity extends object>
	extends IProcurementCommonWizardConfig<TRootEntity, U> {
	currentSelectionSvc: IEntitySelection<TEntity>;
	GetExportParameters: (entity: TEntity, rootEntity: TRootEntity) => IMaterialExportParameters,
}