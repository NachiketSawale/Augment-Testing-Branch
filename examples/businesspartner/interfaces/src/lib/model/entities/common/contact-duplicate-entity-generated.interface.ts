/*
 * Copyright(c) RIB Software GmbH
 */

import { IContactEntity } from '../contact';


export interface IContactDuplicateEntityGenerated {

  /**
   * ContactDto
   */
  ContactDto?: IContactEntity | null;

  /**
   * LoadedClerkQty
   */
  LoadedClerkQty: number;

  /**
   * LoadedPhoto
   */
  LoadedPhoto: boolean;

  /**
   * RoleIds
   */
  //RoleIds?: number[] | null; //todo - genertaed from dto
  RoleIds: (number | undefined | null)[];
}

