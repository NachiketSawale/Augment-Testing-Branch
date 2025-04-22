/*
 * Copyright(c) RIB Software GmbH
 */

import {firstValueFrom, Subject} from 'rxjs';
import {inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PlatformConfigurationService, IIdentificationData} from '@libs/platform/common';
import {IDimensionGroupEntity} from '../model/interfaces/dimension-group-entity.interface';
import {ModelSharedDrawingViewerService} from './drawing-viewer.service';
import {IDimensionServiceConfig} from '../model/interfaces/dimension-service-config.interface';
import {IDimensionContext, IDimensionDeleteFlow} from '../model/interfaces/dimension-context.interface';
import {IDimensionService, IDimensionUpdateOptions} from '../model/interfaces/dimension-service.interface';
import {IDimensionEntity} from '../model/interfaces/dimension-entity.interface';
import {IObjectTemplate} from '../model/interfaces/object-template.interface';
import {DimensionEntity} from '../model/dimension-entity';

/**
 * The service used to interact with dimension.
 */
export abstract class ModelSharedDimensionServiceBase implements IDimensionService {
    private http = inject(HttpClient);
    private drawingService = inject(ModelSharedDrawingViewerService);
    private configService = inject(PlatformConfigurationService);

    private object2DWebApiBaseUrl = this.configService.webApiBaseUrl + 'model/main/object2d/';
    public onDimensionUpdated = new Subject<IDimensionEntity>();
    public onDimensionsUpdated = new Subject<IDimensionEntity[]>();

    protected abstract config: IDimensionServiceConfig;

    /**
     * load dimension groups.
     * @param modelId
     */
    public async loadDimensionGroups(modelId: number) {
        const url = this.configService.webApiBaseUrl + 'constructionsystem/main/dimgroup/list';
        const entities = await firstValueFrom(this.http.get(url, {
            params: {
                modelId: modelId
            }
        })) as IDimensionGroupEntity[];
        return entities.map(e => this.convertDimensionGroup(e));
    }

    private convertDimensionGroup(dimensionGroup: IDimensionGroupEntity) {
        let str = dimensionGroup.dimensionGroupId;

        while (str.length < 12) {
            str = '0' + str;
        }

        dimensionGroup.dimensionGroupId = '{00000000-0000-0000-0000-' + str + '}';
        dimensionGroup.negativeConfig.colour = this.convertColor(dimensionGroup.negativeConfig.colour as number);
        dimensionGroup.positiveConfig.colour = this.convertColor(dimensionGroup.positiveConfig.colour as number);

        return dimensionGroup;
    }

    private convertColor(intValue: number) {
        let rgb = intValue.toString(16);

        while (rgb.length < 6) {
            rgb = '0' + rgb;
        }

        return '#' + rgb;
    }

    public async loadDimensions(modelId: number, layoutId: string): Promise<IDimensionEntity[]> {
        const context = await this.getContext(modelId, layoutId);
        return await firstValueFrom(this.http.post(this.object2DWebApiBaseUrl + 'list', context)) as IDimensionEntity[];
    }

    protected async getContext(modelId: number, layoutId?: string): Promise<IDimensionContext> {
        const modelConfig = await this.drawingService.loadModelConfig(modelId);

        const context: IDimensionContext = {
            UsageContract: this.config.objectUsageContract,
            TemplateContract: this.config.objectTemplateContract,
            IsHeaderModelObject: this.config.isHeaderModelObject,
            HeaderId: null,
            HeaderIds: [],
            ValidHeaderIds: [],
            ModelId: modelId,
            FilterByHeader: false,
            BaseUnitId: null,
            Layout: layoutId,
            IsFromWde: false
        };

        if (layoutId) {
            const layoutConfig = modelConfig.getLayoutConfig(layoutId);
            context.BaseUnitId = layoutConfig.uomFk;
        }
        if (!this.config.disableHeaderFilter) {
            context.HeaderId = this.getHeaderId();
            context.HeaderIds = this.getHeaderIds();
            context.ValidHeaderIds = this.getValidHeaderIds();
        }

        return context;
    }

    protected getHeaderId():IIdentificationData | null {
        return null;
    }

    protected getHeaderIds():IIdentificationData[] {
        return [];
    }

    protected getValidHeaderIds():IIdentificationData[] {
        return [];
    }

    public async getObjectTemplate(): Promise<IObjectTemplate> {
        throw new Error('getObjectTemplate$ is not implemented!');
    }

    public newEntity(modelId: number): IDimensionEntity {
        return new DimensionEntity(modelId);
    }

    public async createEntity(modelId: number, entity: IDimensionEntity): Promise<IDimensionEntity> {
        const context = await this.getContext(modelId, entity.Layout);

        entity = await firstValueFrom(this.http.post(this.object2DWebApiBaseUrl + 'createtoheader', {
            Context: context,
            Item: entity
        })) as IDimensionEntity;

        this.onDimensionCreated(entity);

        return entity;
    }

    protected onDimensionCreated(entity: IDimensionEntity) {

    }

    public async createEntities(modelId: number, entities: IDimensionEntity[]): Promise<IDimensionEntity[]> {
        const context = await this.getContext(modelId);

        entities = await firstValueFrom(this.http.post(this.object2DWebApiBaseUrl + 'createdimensions', {
            Context: context,
            Items: entities
        })) as IDimensionEntity[];

        this.onDimensionsCreated(entities);

        return entities;
    }

    protected onDimensionsCreated(entities: IDimensionEntity[]) {

    }

    public async deleteEntityByUuids(modelId: number, uuids: string[]): Promise<boolean> {
        uuids = uuids.map(function (uuid) {
            return uuid.startsWith('{') ? uuid : ('{' + uuid + '}');
        });

        const context = await this.getContext(modelId);

        let deleteFlow = await firstValueFrom(this.http.post(this.object2DWebApiBaseUrl + 'deletetoheaderbyuuid', {
            Context: context,
            Uuids: uuids
        })) as IDimensionDeleteFlow;

        if (deleteFlow.Success) {
            this.onDimensionDelete(modelId, uuids);
            return true;
        }

        if (deleteFlow.IsObjectReferencedByLineItem) {
            context.DeleteFlow = {IsAutoDeleteLineItemObject: true};
            deleteFlow = await firstValueFrom(this.http.post(this.object2DWebApiBaseUrl + 'deletetoheaderbyuuid', {
                Context: context,
                Uuids: uuids
            })) as IDimensionDeleteFlow;

            if (deleteFlow.Success) {
                this.onDimensionDelete(modelId, uuids);
                return true;
            }
        }

        return false;
    }

    protected onDimensionDelete(modelId: number, uuid: string[] | number[]) {

    }

    public async deleteEntityByIds(modelId: number, modelObjectIds: number[]): Promise<boolean> {
        const context = await this.getContext(modelId);

        let deleteFlow = await firstValueFrom(this.http.post(this.object2DWebApiBaseUrl + 'deletetoheaderbyid', {
            Context: context,
            ModelObjectIds: modelObjectIds
        })) as IDimensionDeleteFlow;

        if (deleteFlow.Success) {
            this.onDimensionDelete(modelId, modelObjectIds);
            return true;
        }

        if (deleteFlow.IsObjectReferencedByLineItem) {
            context.DeleteFlow = {IsAutoDeleteLineItemObject: true};

            deleteFlow = await firstValueFrom(this.http.post(this.object2DWebApiBaseUrl + 'deletetoheaderbyid', {
                Context: context,
                ModelObjectIds: modelObjectIds
            }));

            if (deleteFlow.Success) {
                this.onDimensionDelete(modelId, modelObjectIds);
                return true;
            }
        }

        return false;
    }

    public async updateEntity(modelId: number, entity: IDimensionEntity, options?: IDimensionUpdateOptions): Promise<IDimensionEntity> {
        const context = await this.getContext(modelId);

        options = options || {};

        const onlyText = options.nameModified && !options.propModified;
        const onlyProperty = !options.nameModified && options.propModified;

        const updateEntity = await firstValueFrom(this.http.post(this.object2DWebApiBaseUrl + 'updatetoheader', {
            Context: context,
            Item: entity,
            OnlyText: onlyText
        })) as IDimensionEntity;

        this.onDimensionUpdate(modelId, updateEntity, onlyProperty);
        this.onDimensionUpdated.next(updateEntity);

        return updateEntity;
    }

    protected onDimensionUpdate(modelId: number, entity: IDimensionEntity, onlyProperty?: boolean) {

    }

    public async updateEntities(modelId: number, entities: IDimensionEntity[], options?: IDimensionUpdateOptions): Promise<IDimensionEntity[]> {
        const context = await this.getContext(modelId);

        options = options || {};

        const onlyText = options.nameModified && !options.propModified;
        const onlyProperty = !options.nameModified && options.propModified;

        const updateEntities = await firstValueFrom(this.http.post(this.object2DWebApiBaseUrl + 'updatedimensions', {
            Context: context,
            Items: entities,
            OnlyText: onlyText
        })) as IDimensionEntity[];

        this.onDimensionsUpdate(modelId, updateEntities, onlyProperty);
        this.onDimensionsUpdated.next(updateEntities);

        return entities;
    }

    protected onDimensionsUpdate(modelId: number, entities: IDimensionEntity[], onlyProperty?: boolean) {

    }
}