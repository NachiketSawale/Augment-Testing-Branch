import { IUserEntity } from '@libs/usermanagement/interfaces';

/**
 * Portal User Group Interface
 */
export interface IPortalUserGroup {
    Id: number;
    Name: string;
    Sorting: number;
    IsDefault: boolean;
}

/**
 * Portal User Dialog interface
 */
export interface IPortalUserDialog {
    User?: IUserEntity;
    FamilyName: string;
    BusinessPartnerName1?: string | null;
    Provider: string;
    ProviderId: string | null;
    ProviderEmail: string;
    SetInactiveDate?: string | null;
    ProviderComment: string;
    PortalAccessGroup: IPortalUserGroup[];
    State: number;
}
