/*
 * Copyright(c) RIB Software GmbH
 */

import { IContactEntity } from '../contact';



export interface IKeyAndContactsResponseGenerated {

  /**
   * Contacts
   */
  Contacts?: IContactEntity[] | null;

  /**
   * Key
   */
  Key: number;
}
