/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { ICostCodesUsedCompanyEntity } from './models';

export class BasicsCostCodesCompanyComplete implements CompleteIdentification<ICostCodesUsedCompanyEntity>{

	public Id: number = 0;

	public Companies: ICostCodesUsedCompanyEntity[] | null = [];

	
}
