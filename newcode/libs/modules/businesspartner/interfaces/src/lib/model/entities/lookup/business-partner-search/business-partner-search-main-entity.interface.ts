/*
 * Copyright(c) RIB Software GmbH
 */

import { IBusinessPartnerEntity } from '../../main/business-partner-entity.interface';

/**
 * Business Partner Main interface
 */

export interface IBusinessPartnerSearchMainEntity extends IBusinessPartnerEntity {
    BpdStatusFk: number;
    BpdStatus2Fk: number;
    Description: string | '';
    Street: string;
    City: string;
    Iso2: string;
    County: string;
    CountryFk: number;
    ZipCode: string;
    TelephoneNumber1: string;
    Userdefined1: string;
    Userdefined2: string;
    Userdefined3: string;
    Userdefined4: string;
    Userdefined5: string;
    IsNationWide: number;
    SubsidiaryFk?: number | null;
    BasCommunicationChannelFk: number;
    CraftcooperativeDate: Date;
    Mobile: string;
    Telephonenumber2: string;
    FaxNumber: string;
    AddressLine: string;
    CountryVatFk: number;
    Inserted: Date;
    Updated: Date;
    CreateUserName: string;
    UpdateUserName: string;
}
