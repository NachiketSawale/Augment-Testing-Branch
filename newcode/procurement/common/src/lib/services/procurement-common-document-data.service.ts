import {IPrcDocumentEntity} from '../model/entities/prc-document-entity.interface';
import {
    CompleteIdentification,
    IEntityIdentification,
    PlatformConfigurationService
} from '@libs/platform/common';
import {
    IDataServiceChildRoleOptions,
    IDataServiceEndPointOptions,
    IDataServiceOptions, ServiceRole
} from '@libs/platform/data-access';
import {inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IReadonlyParentService} from '@libs/procurement/shared';
import {DocumentDataLeafService} from '@libs/documents/shared';
import {get, set} from 'lodash';
import { IPrcHeaderDataService } from '../model/interfaces';
import { BasicsUploadSectionType, BasicsUploadServiceKey } from '@libs/basics/shared';


export abstract class ProcurementCommonDocumentDataService<T extends IPrcDocumentEntity,PT extends IEntityIdentification,PU extends CompleteIdentification<PT>> extends DocumentDataLeafService<T,PT,PU>{
    protected readonly http = inject(HttpClient);
    protected readonly configService = inject(PlatformConfigurationService);

    protected constructor(
        protected parentService: IReadonlyParentService<PT, PU> & IPrcHeaderDataService<PT, PU>,
        protected config: {
            apiUrl?: string,
            itemName?: string,
            readInfo?: IDataServiceEndPointOptions,
            createInfo?: IDataServiceEndPointOptions
        }
    ){
        config.itemName = config.itemName || 'PrcDocument';

        const options: IDataServiceOptions<T> = {
            apiUrl: config.apiUrl ?? 'procurement/common/prcdocument',
            readInfo: {
                endPoint: 'listbyparent',
                usePost: true,
                ...config.readInfo
            },
            createInfo: {
                endPoint: 'create',
                usePost: true,
                prepareParam: () => {
                    return {
                        PKey1: this.getMainItemId(),
                    };
                },
                ...config.createInfo
            },
            roleInfo: <IDataServiceChildRoleOptions<T, PT, PU>>{
                role: ServiceRole.Leaf,
                itemName: config.itemName,
                parent: parentService
            }
        };

        super(options,{
		    uploadServiceKey: BasicsUploadServiceKey.Procurement,
			    configs: {
			    sectionType: BasicsUploadSectionType.Procurement,
		    },
	    });
    }

	//get parent PrcHeaderFk
	public getMainItemId(): number{
		 return this.parentService.getHeaderContext().prcHeaderFk;
	}

    protected override provideLoadPayload(): object {
        return {
            PKey1: this.getMainItemId()
        };
    }

    protected override onLoadSucceeded(loaded: object): T[] {
        if (loaded) {
            return get(loaded, 'Main', []);
        }
        return [];
    }

    public override registerByMethod(): boolean {
        return true;
    }

    public override registerModificationsToParentUpdate(parentUpdate: PU, modified: T[], deleted: T[]): void {
        if (modified && modified.some(() => true)) {
            set(parentUpdate, `${this.config.itemName}ToSave`, modified);
        }

        if (deleted && deleted.some(() => true)) {
            set(parentUpdate, `${this.config.itemName}ToDelete`, deleted);
        }
    }
}