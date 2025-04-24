/*
 * Copyright(c) RIB Software GmbH
 */

import { IProjectEntity } from './project-main-entity.interface';
import { CompleteIdentification } from '@libs/platform/common';
import { IGeneralEntity } from './general-entity.interface';
import { IKeyFigureEntity } from './key-figure-entity.interface';
import { IProjectStockEntity } from '../stock';
import { IProjectStockComplete } from '../stock';
import {IProjectMaterialComplate} from '../project-material-complete.interface';
import { ISaleEntity } from './project-main-sale-entity.interface';
import { IProject2SalesTaxCodeComplete } from './project-main-2-sales-tax-code-complete.interface';
import { IProject2SalesTaxCodeEntity } from './project-main-2-sales-tax-code-entity.interface';
import { ITenderResultEntity } from './project-main-tender-result-entity.interface';
import { ITenderResultComplete } from './project-main-tender-result-complete.interface';
import { ProjectMainCostGroupCatalogEntity } from './project-main-cost-group-catlog-entity.interface';
import { IProjectMainProjectReleaseEntity } from './project-main-project-release-entity.interface';
import { IProjectMainCurrencyRateEntity } from './project-main-currency-rate-entity.interface';
import { IProjectMainPrj2BPComplete } from './project-main-prj-2-business-partner-complete.interface';
import { IProjectMainPrj2BusinessPartnerEntity } from './project-main-prj-2-business-partner-entity.interface';
import { IProjectMainBillToEntity } from './project-main-bill-to-entity.interface';
import { IProjectMainCertificateEntity } from './project-main-certificate-entity.interface';
import { IProjectMainCostGroupCatalogComplete } from './project-main-cost-group-catalog-complete.class';
import { IProjectLocationEntity } from '../project-location-entity.interface';
import { IProjectCostCodesComplete } from '../costcodes/project-cost-codes-complete.interface';
import { IActionEntity } from './action-entity.interface';
import { IProjectMainActionComplete } from './project-main-action-complete.interface';
import { IProjectClerkRoleComplete } from './project-main-clerk-role-complete.interface';
import { IProjectRoleEntity } from './project-main-clerk-role-entity.interface';
import { IProjectAddressEntity } from './project-address-entity.interface';
import { IBasicsEfbsheetsEntity } from '@libs/basics/interfaces';

export interface IProjectComplete extends CompleteIdentification<IProjectEntity> {

	 MainItemID: number;

	 Projects: IProjectEntity[] | null;

	 LocationsToSave: IProjectLocationEntity[] | null;

	 LocationsToDelete: IProjectLocationEntity[] | null;

	 ProjectStocksToSave: IProjectStockComplete[] | null;

	 ProjectStocksToDelete: IProjectStockEntity[] | null;

	 PrjMaterialToSave: IProjectMaterialComplate[] | null;

	 GeneralsToSave: IGeneralEntity[] | null;

	 GeneralsToDelete: IGeneralEntity[];

	 KeyFiguresToSave: IKeyFigureEntity[] | null;

	 KeyFiguresToDelete: IKeyFigureEntity[];

	 ActionToSave: IProjectMainActionComplete[];

	 ActionToDelete: IActionEntity[];

	 SalesToSave: ISaleEntity[] | null;

	 SalesToDelete: ISaleEntity[] | null;

	TenderResultsToSave: ITenderResultComplete[] | null;

	TenderResultsToDelete: ITenderResultEntity[] | null;

	Project2SalesTaxCodesToSave: IProject2SalesTaxCodeComplete[] | null;

	Project2SalesTaxCodesToDelete: IProject2SalesTaxCodeEntity[] | null;

	CostGroupCatalogsToSave: IProjectMainCostGroupCatalogComplete[] |null;

	CostGroupCatalogsToDelete: ProjectMainCostGroupCatalogEntity[]| null;


	ReleasesToSave:IProjectMainProjectReleaseEntity[] | null;

	ReleasesToDelete:IProjectMainProjectReleaseEntity[] | null;

	CurrencyRatesToSave : IProjectMainCurrencyRateEntity[] | null;

	CurrencyRatesToDelete : IProjectMainCurrencyRateEntity[] | null;

	 BusinessPartnersToSave: IProjectMainPrj2BPComplete[] | null;

	 BusinessPartnersToDelete: IProjectMainPrj2BusinessPartnerEntity[] | null;

	BillTosToSave: IProjectMainBillToEntity[] | null;

	BillTosToDelete:  IProjectMainBillToEntity[] | null;

	CertificatesToSave: IProjectMainCertificateEntity[] | null;

	CertificatesToDelete: IProjectMainCertificateEntity[] | null;

	PrjCostCodesToSave : IProjectCostCodesComplete | null;

	ClerkRolesToSave: IProjectClerkRoleComplete[] | null;

	ClerkRolesToDelete: IProjectRoleEntity[] | null;

	ProjectAddressToSave: IProjectAddressEntity[] | null;

	ProjectAddressToDelete: IProjectAddressEntity[] | null;

	EstCrewMixToSave:IBasicsEfbsheetsEntity[] | null;

	EstCrewMixToDelete:IBasicsEfbsheetsEntity[] | null;
}