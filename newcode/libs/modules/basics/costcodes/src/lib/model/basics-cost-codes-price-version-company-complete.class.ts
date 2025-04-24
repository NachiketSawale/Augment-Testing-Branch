/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { ICostCodeCompanyEntity } from './models';

export class BasicsCostCodesPriceVersionCompanyComplete implements CompleteIdentification<ICostCodeCompanyEntity>{

	public Id: number = 0;

	public Companies: ICostCodeCompanyEntity [] | null = [];

	
}
