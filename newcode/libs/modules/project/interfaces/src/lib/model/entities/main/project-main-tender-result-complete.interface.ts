/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IBiddingConsortiumEntity } from './project-main-bidding-consortium-entity.interface';
import { ITenderResultEntity } from './project-main-tender-result-entity.interface';

export interface ITenderResultComplete extends CompleteIdentification<ITenderResultEntity>{

 /*
  * BiddingConsortiumsToDelete
  */
  BiddingConsortiumsToDelete?: IBiddingConsortiumEntity[] | null;

 /*
  * BiddingConsortiumsToSave
  */
  BiddingConsortiumsToSave?: IBiddingConsortiumEntity[] | null;

 /*
  * CommentDataToSave
  */
	// TODO: Add this when ICommentDataEntity is available
  //CommentDataToSave?: ICommentDataEntity[] | null;

 /*
  * MainItemId
  */
  MainItemId?: number | null;

 /*
  * TenderResults
  */
  TenderResults?: ITenderResultEntity | null;
}
