/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import {
	DataServiceFlatLeaf, ServiceRole,
	IDataServiceChildRoleOptions, IDataServiceEndPointOptions,
	IDataServiceOptions
} from '@libs/platform/data-access';
import { BasicsMaterialRecordDataService } from '../material/basics-material-record-data.service';
import { IMaterialEntity } from '@libs/basics/interfaces';
import { IMaterial2CertificateEntity } from '../model/entities/material-2-certificate-entity.interface';
import { MaterialComplete } from '../model/complete-class/material-complete.class';
import { BasicsMaterialCertificatesValidationService } from './basics-material-certificates-validation.service';
import { BasicsSharedNewEntityValidationProcessorFactory } from '@libs/basics/shared';

/**
 * The Basics Material Certificates data service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsMaterialCertificatesDataService extends DataServiceFlatLeaf<IMaterial2CertificateEntity, IMaterialEntity, MaterialComplete> {
	private readonly validationProcessor = inject(BasicsSharedNewEntityValidationProcessorFactory);

	public constructor(private parentService: BasicsMaterialRecordDataService) {
		const options: IDataServiceOptions<IMaterial2CertificateEntity> = {
			apiUrl: 'basics/material/certificate',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false
			},
			createInfo: {endPoint: 'create', usePost: true},
			roleInfo: <IDataServiceChildRoleOptions<IMaterial2CertificateEntity, IMaterialEntity, MaterialComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Material2CertificateDto',
				parent: parentService
			}
		};

		super(options);
		this.processor.addProcessor([this.provideNewEntityValidationProcessor()]);
	}

	protected override provideLoadPayload(): object {
		const parent = this.getSelectedParent();
		if (parent) {
			return {
				mainItemId: parent.Id
			};
		} else {
			throw new Error('There should be a selected parent Material record to load the Certificates data');
		}
	}

	protected override onLoadSucceeded(loaded: object): IMaterial2CertificateEntity[] {
		return loaded as IMaterial2CertificateEntity[];
	}

	protected override onCreateSucceeded(loaded: object): IMaterial2CertificateEntity {
		const parent = this.getSelectedParent();
		const entity = loaded as IMaterial2CertificateEntity;
		if (entity && parent) {
			entity.MaterialFk = parent.Id;
		}
		return entity;
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(parentUpdate: MaterialComplete, modified: IMaterial2CertificateEntity[], deleted: IMaterial2CertificateEntity[]): void {
		if (modified && modified.some(() => true)) {
			parentUpdate.Material2CertificateToSave = modified;
		}
		if (deleted && deleted.some(() => true)) {
			parentUpdate.Material2CertificateToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: MaterialComplete): IMaterial2CertificateEntity[] {
		return (complete && complete.Material2CertificateToSave) ? complete.Material2CertificateToSave : [];
	}

	public override isParentFn(parentKey: IMaterialEntity, entity: IMaterial2CertificateEntity): boolean {
		return entity.MaterialFk === parentKey.Id;
	}

	private provideNewEntityValidationProcessor() {
		return this.validationProcessor.createProcessor(BasicsMaterialCertificatesValidationService, {
			moduleSubModule: 'Basics.Material',
			typeName: 'Material2CertificateDto',
		});
	}
}