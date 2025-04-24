import { CompleteIdentification } from '@libs/platform/common';
import { IProjectMainPrj2BusinessPartnerEntity } from './project-main-prj-2-business-partner-entity.interface';
import { IProjectMainPrj2BPContactEntity } from './project-main-prj-2-bpcontact-entity.interface';
import { IProjectMainBusinessPartnerSiteEntity } from './project-main-business-partner-site-entity.interface';

export interface IProjectMainPrj2BPComplete extends CompleteIdentification<IProjectMainPrj2BusinessPartnerEntity>{

	MainItemId: number;

	BusinessPartners: IProjectMainPrj2BusinessPartnerEntity | null;

	BusinessPartnerContactsToSave: IProjectMainPrj2BPContactEntity[] | null;

	BusinessPartnerContactsToDelete: IProjectMainPrj2BPContactEntity[] | null;

	BusinessPartnerSitesToSave: IProjectMainBusinessPartnerSiteEntity[] | null;

	BusinessPartnerSitesToDelete: IProjectMainBusinessPartnerSiteEntity[] | null;

}
