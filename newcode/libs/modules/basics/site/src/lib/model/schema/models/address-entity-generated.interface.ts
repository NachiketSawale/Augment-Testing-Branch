/*
 * Copyright(c) RIB Software GmbH
 */
import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IAddressEntityGenerated extends IEntityBase, IEntityIdentification  {
   Address?: string;
  AddressLine?: string;
   AddressModified?: boolean;
   City?: string;
   CountryDescription?: string;
  CountryFk?: number;
  CountryISO2?: string;
  County?: string;
  Culture?: string;
  Id: number;
  LanguageFk?: number;
  Latitude?: number;
  Longitude?: number;
  StateDescription?: string;
  StateFk?: number;
  Street?: string;
  Supplement?: string;
  ZipCode?: string;
}
