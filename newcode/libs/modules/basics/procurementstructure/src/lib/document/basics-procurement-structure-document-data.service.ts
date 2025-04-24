import { IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { DocumentDataLeafService } from '@libs/documents/shared';
import { IPrcStructureDocEntity } from '../model/entities/prc-structure-doc-entity.interface';
import { IPrcStructureEntity } from '@libs/basics/interfaces';
import { PrcStructureComplete } from '../model/complete-class/prc-structure-complete.class';
import { BasicsProcurementStructureDataService } from '../procurement-structure/basics-procurement-structure-data.service';
import { Injectable } from '@angular/core';
import { BasicsUploadSectionType, BasicsUploadServiceKey } from '@libs/basics/shared';

/**
 * Procurement structure document entity data service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsProcurementStructureDocumentDataService extends DocumentDataLeafService<IPrcStructureDocEntity, IPrcStructureEntity, PrcStructureComplete> {
	protected constructor(private parentService: BasicsProcurementStructureDataService) {
		const options: IDataServiceOptions<IPrcStructureDocEntity> = {
			apiUrl: 'basics/procurementstructure/document',
			readInfo: {
				endPoint: 'listdocument',
				prepareParam: () => {
					return {
						mainItemId: this.getMainItemId(),
					};
				},
			},
			createInfo: {
				endPoint: 'createdocument',
				usePost: true,
				prepareParam: () => {
					return {
						PKey1: this.getMainItemId(),
					};
				},
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'deletedocument',
			},
			roleInfo: <IDataServiceChildRoleOptions<IPrcStructureDocEntity, IPrcStructureEntity, PrcStructureComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'PrcStructureDoc',
				parent: parentService,
			},
		};

		super(options, {
			uploadServiceKey: BasicsUploadServiceKey.ProcurementStructure,
			configs: {
				sectionType: BasicsUploadSectionType.ProcurementStructure,
			},
		});
	}

	public getMainItemId(): number {
		const parentEntity = this.parentService.getSelectedEntity();

		if (parentEntity) {
			return parentEntity.Id;
		}

		throw new Error('There should be one parent entity selected');
	}

	public override isParentFn(parentKey: IPrcStructureEntity, entity: IPrcStructureDocEntity): boolean {
		return entity.PrcStructureFk === parentKey.Id;
	}
}
