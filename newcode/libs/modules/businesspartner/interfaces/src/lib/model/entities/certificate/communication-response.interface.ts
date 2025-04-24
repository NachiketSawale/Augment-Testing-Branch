/*
 * Copyright(c) RIB Software GmbH
 */

import { IRecipient } from './send-email-or-fax-dialog-model.interface';

export interface ICommunicationResponse {
	Receivers: IRecipient[];
	Sender: string
}