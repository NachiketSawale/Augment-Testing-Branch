/*
 * Copyright(c) RIB Software GmbH
 */
import { CompleteIdentification } from '@libs/platform/common';
import { IAudContainerEntity } from './entities/aud-container-entity.interface';

/**
 * Basics Config Audit Container Complete class
 */
export class BasicsConfigAuditContainerComplete implements CompleteIdentification<IAudContainerEntity>{

	public Id: number = 0;

	public Datas: IAudContainerEntity[] | null = [];

	
}
