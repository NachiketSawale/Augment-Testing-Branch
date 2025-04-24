/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IPrcConfigurationEntity } from '../entities/prc-configuration-entity.interface';
import { IPrcConfig2ConApprovalEntity } from '../entities/prc-config-2-con-approval-entity.interface';
import { IPrcConfig2documentEntity } from '../entities/prc-config-2-document-entity.interface';
import { IPrcConfig2ReportEntity } from '../entities/prc-config-2-report-entity.interface';
import { IPrcConfig2dataformatEntity } from '../entities/prc-config-2-dataformat-entity.interface';
import { IPrcConfiguration2Prj2TextTypeEntity } from '../entities/prc-configuration-2-prj--2text-type-entity.interface';
import { IPrcConfiguration2TextTypeItemEntity } from '../entities/prc-configuration-2-text-type-item-entity.interface';
import { IPrcConfiguration2TextTypeEntity } from '../entities/prc-configuration-2-text-type-entity.interface';

export class PrcConfigurationComplete implements CompleteIdentification<IPrcConfigurationEntity> {
	/**
	 * MainItemId
	 */
	public MainItemId: number = 0;

	/**
	 * PrcConfig2ConApprovalToDelete
	 */
	public PrcConfig2ConApprovalToDelete?: IPrcConfig2ConApprovalEntity[] | null = [];

	/**
	 * PrcConfig2ConApprovalToSave
	 */
	public PrcConfig2ConApprovalToSave?: IPrcConfig2ConApprovalEntity[] | null = [];

	/**
	 * PrcConfig2DocumentToDelete
	 */
	public PrcConfig2DocumentToDelete?: IPrcConfig2documentEntity[] | null = [];

	/**
	 * PrcConfig2DocumentToSave
	 */
	public PrcConfig2DocumentToSave?: IPrcConfig2documentEntity[] | null = [];

	/**
	 * PrcConfig2ReportToDelete
	 */
	public PrcConfig2ReportToDelete?: IPrcConfig2ReportEntity[] | null = [];

	/**
	 * PrcConfig2ReportToSave
	 */
	public PrcConfig2ReportToSave?: IPrcConfig2ReportEntity[] | null = [];

	/**
	 * PrcConfig2dataformatToDelete
	 */
	public PrcConfig2dataformatToDelete?: IPrcConfig2dataformatEntity[] | null = [];

	/**
	 * PrcConfig2dataformatToSave
	 */
	public PrcConfig2dataformatToSave?: IPrcConfig2dataformatEntity[] | null = [];

	/**
	 * PrcConfiguration
	 */
	public PrcConfiguration?: IPrcConfigurationEntity | null;

	/**
	 * PrcConfiguration2Prj2TextTypeToDelete
	 */
	public PrcConfiguration2Prj2TextTypeToDelete?: IPrcConfiguration2Prj2TextTypeEntity[] | null = [];

	/**
	 * PrcConfiguration2Prj2TextTypeToSave
	 */
	public PrcConfiguration2Prj2TextTypeToSave?: IPrcConfiguration2Prj2TextTypeEntity[] | null = [];

	/**
	 * PrcConfiguration2TextTypeItemToDelete
	 */
	public PrcConfiguration2TextTypeItemToDelete?: IPrcConfiguration2TextTypeItemEntity[] | null = [];

	/**
	 * PrcConfiguration2TextTypeItemToSave
	 */
	public PrcConfiguration2TextTypeItemToSave?: IPrcConfiguration2TextTypeItemEntity[] | null = [];

	/**
	 * PrcConfiguration2TextTypeToDelete
	 */
	public PrcConfiguration2TextTypeToDelete?: IPrcConfiguration2TextTypeEntity[] | null = [];

	/**
	 * PrcConfiguration2TextTypeToSave
	 */
	public PrcConfiguration2TextTypeToSave?: IPrcConfiguration2TextTypeEntity[] | null = [];

	public constructor(entity: IPrcConfigurationEntity | null) {
		if (entity) {
			this.MainItemId = entity.Id;
			this.PrcConfiguration = entity;
		}
	}
}
