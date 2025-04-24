/*
 * Copyright(c) RIB Software GmbH
 */

import { IBusinessPartnerAssignmentEntity, IContact2BasCompanyEntity, IContact2ExternalEntity, IContact2ExtRoleEntity, IContactEntity, IContactPhotoEntity } from '@libs/businesspartner/interfaces';
import { CompleteIdentification } from '@libs/platform/common';


/**
 * Business Partner complete which holds modification to save
 */
export interface IContactEntityComplete extends CompleteIdentification<IContactEntity> {
	MainItemId: number;
	/*
	only use in businesspartner no contact
	 */
	Contact?: IContactEntity | null;
	/*
	only use in contact no businesspartner
	 */
	Contacts?: IContactEntity[] | null;
	ContactPhotoToSave?: IContactPhotoEntity[] | null;
	ContactPhotoToDelete?: IContactPhotoEntity[] | null;
	BusinessPartnerAssignmentToSave?: IBusinessPartnerAssignmentEntity[] | null;
	BusinessPartnerAssignmentToDelete?: IBusinessPartnerAssignmentEntity[] | null;
	Contact2CompanyToSave?: IContact2BasCompanyEntity[] | null;
	Contact2CompanyToDelete?: IContact2BasCompanyEntity[] | null;
	Contact2ExternalToSave?: IContact2ExternalEntity[] | null;
	Contact2ExternalToDelete?: IContact2ExternalEntity[] | null;
	ContactExtRoleToSave?: IContact2ExtRoleEntity[] | null;
	ContactExtRoleToDelete?: IContact2ExtRoleEntity[] | null;
}
