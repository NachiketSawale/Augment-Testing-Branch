/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification, IEntityIdentification, PlatformConfigurationService } from '@libs/platform/common';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { IReadonlyParentService } from '@libs/procurement/shared';
import { IPrcHeaderContext, IPrcModuleValidatorService } from '../model/interfaces';
import { EntityReadonlyProcessorBase, MainDataDto } from '@libs/basics/shared';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PrcCreateContext, PrcLoadContext } from '../model/interfaces/prc-common-context.interface';
import { Subject } from 'rxjs';


/**
 * The basic data service for procurement base entity
 */
export abstract class ProcurementCommonDataServiceFlatLeaf<T extends object, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>>
    extends DataServiceFlatLeaf<T, PT, PU> {

    protected readonly http = inject(HttpClient);
    protected readonly configurationService = inject(PlatformConfigurationService);

	 public entityCreated$ = new Subject<T>();

    protected constructor(
        public parentService: IPrcModuleValidatorService<PT, PU> & IReadonlyParentService<PT, PU>,
        protected dataConfig: { apiUrl: string, itemName: string, endPoint?: string }) {
        const {apiUrl, itemName, endPoint = 'list'} = dataConfig;
        const options: IDataServiceOptions<T> = {
            apiUrl: apiUrl,
            readInfo: {
                endPoint: endPoint,
                usePost: false
            },
            roleInfo: <IDataServiceChildRoleOptions<T, PT, PU>>{
                role: ServiceRole.Leaf,
                itemName: itemName,
                parent: parentService
            }
        };
        super(options);
    }

    public override canDelete(): boolean {
        if (this.parentService.isValidForSubModule()) {
            return true;
        }

        //todo procurementContextService.isReadOnly lcn
        const moduleContext = {isReadOnly: false};
        return !moduleContext.isReadOnly;
    }

    public override canCreate(): boolean {
        if (this.parentService.isValidForSubModule()) {
            return true;
        }

        //todo procurementContextService.isReadOnly lcn
        const moduleContext = {isReadOnly: false};
        return !moduleContext.isReadOnly && !!this.parentService.getSelectedEntity();
    }

    protected override onCreateSucceeded(created: object): T {
        const entity = created as T;
        const readonlyProcessor = this.processor.getProcessors().find((p) => p instanceof EntityReadonlyProcessorBase);
        if (readonlyProcessor) {
            readonlyProcessor.process(entity);
        }

		  this.entityCreated$.next(entity);

        return entity;
    }

    protected override provideCreatePayload(): PrcCreateContext{

        const headerContext = this.getHeaderContext() as unknown as IPrcHeaderContext;
        return {
            MainItemId: headerContext.prcHeaderFk,
            PrcConfigFk: headerContext.prcConfigFk,
            StructureFk: headerContext.structureFk
        };
    }


    protected override provideLoadPayload(): PrcLoadContext | object  {
        const headerContext = this.getHeaderContext() as unknown as IPrcHeaderContext;
        return {
            MainItemId: headerContext.prcHeaderFk,
            ProjectId: headerContext.projectFk,
            moduleName: this.parentService.getInternalModuleName()
        };
    }
    protected override onLoadSucceeded(loaded: object): T[] {
        const dataDto = new MainDataDto<T>(loaded);
        return dataDto.Main;
    }

	public getHeaderContext():IPrcHeaderContext{
		return {} as IPrcHeaderContext;
	}
}