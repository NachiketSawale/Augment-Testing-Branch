/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityDomainType, IConcreteEntitySchemaProperty, IEntitySchema } from '@libs/platform/data-access';
import { IBoqCompositeEntity } from '@libs/boq/interfaces';
import { ContainerLayoutConfiguration } from '@libs/ui/business-base';
import { AllKeys, IInitializationContext, prefixAllTranslationKeys, Translatable, TypedPropertyPath } from '@libs/platform/common';
import { FieldOverloadSpec, FieldType, ILayoutGroup } from '@libs/ui/common';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { IPrcBoqExtendedEntity } from '@libs/procurement/interfaces';
import { Injectable } from '@angular/core';

const includedField = {
    id: 'isIncluded',
    model: 'isIncluded',
    type: FieldType.Boolean,
    sortOrder: 0,
    label: { text: 'Is Included?', key: 'platform.wizard.isIncluded' },
    pinned: true
};

/**
 * Base class used to build schema and layout configuration for boq container in generic wizard.
 */
abstract class BoqCompositeConfigService<T extends IBoqCompositeEntity> {
    public getSchema(entityName: string): IEntitySchema<T> {
        return {
            schema: entityName,
            properties: {},
            additionalProperties: this.properties,
        } as IEntitySchema<T>;
    }

    protected abstract properties: { [key in AllKeys<IBoqCompositeEntity>]?: IConcreteEntitySchemaProperty };

    protected getBoqItemProperties(): { [key in AllKeys<T>]?: IConcreteEntitySchemaProperty } {
        const ret: { [key in AllKeys<IBoqCompositeEntity>]?: IConcreteEntitySchemaProperty } = {};

        ret['BoqRootItem.Reference'] = { domain: EntityDomainType.Description, mandatory: true };
        ret['BoqRootItem.ExternalCode'] = { domain: EntityDomainType.Description, mandatory: false };
        ret['BoqRootItem.BriefInfo'] = { domain: EntityDomainType.Translation, mandatory: false };
        return ret;
    }

    protected getBoqHeaderProperties(): { [key in AllKeys<T>]?: IConcreteEntitySchemaProperty } {
        const ret: { [key in AllKeys<IBoqCompositeEntity>]?: IConcreteEntitySchemaProperty } = {};
        ret['BoqHeader.BoqStatusFk'] = { domain: EntityDomainType.Integer, mandatory: false };
        return ret;
    }

    protected getOverloads(): { [key in AllKeys<T>]?: FieldOverloadSpec<T> } {
        return {
            'BoqHeader.BoqStatusFk': BasicsSharedCustomizeLookupOverloadProvider.provideBoqStatusLookupOverload(false),
            'PrcBoq.PackageCode': {
                type: FieldType.Integer,
                valueAccessor: 'PrcBoq.PackageFk'
            }
        } as { [key in AllKeys<T>]?: FieldOverloadSpec<T> };
    }

    protected getLayoutGroups(): ILayoutGroup<T>[] {
        const attribs: string[] = [];
        for (const prop in this.properties) {
            attribs.push(prop);
        }

        return [
            {
                gid: 'default-group',
                attributes: [],
                additionalAttributes: attribs as TypedPropertyPath<T>[]
            }
        ];
    }

    protected getLabels(): { [key: string]: Translatable } {
        return {
            ...prefixAllTranslationKeys('boq.main.', {
                'BoqRootItem.Reference': 'Reference',
                'BoqRootItem.BriefInfo': 'BriefInfo',
                'BoqRootItem.ExternalCode': 'ExternalCode',
                'BoqHeader.BoqStatusFk': 'BoqStatusFk',
            }),
        };
    }
}

/**
 * Service used to get entity schema and layout configuration for the generic wizard boq container.
 */
@Injectable({
    providedIn: 'root'
})
export class GenericWizardBoqConfigService extends BoqCompositeConfigService<IPrcBoqExtendedEntity> {

    protected properties = {
        ...this.getBoqItemProperties(),
        ...this.getBoqHeaderProperties(),
        ...{
            'PrcBoq.PackageCode': { domain: EntityDomainType.Integer, mandatory: false },
            'PrcBoq.MdcControllingunitFk': { domain: EntityDomainType.Integer, mandatory: false },
        }
    };

    protected override getLabels(): { [key: string]: Translatable } {
        return {
            ...super.getLabels(),
            ...prefixAllTranslationKeys('cloud.common.', {
                'PrcBoq.PackageCode': 'entityPackageCode',
                'PrcBoq.MdcControllingunitFk': 'entityControllingUnitCode'
            }),
        };
    }

    /**
     * Get layout configuration for boq container.
     * @param ctx context.
     * @returns ContainerLayout configuration
     */
    public getLayoutConfiguration(ctx: IInitializationContext): ContainerLayoutConfiguration<IPrcBoqExtendedEntity> {
        return {
            groups: this.getLayoutGroups(),
            labels: this.getLabels(),
            additionalOverloads: {
                ...this.getOverloads(),
                // Todo-BOQ:
                // 'PrcBoq.PackageFk':
                // 'PrcBoq.MdcControllingunitFk':
            },
            transientFields: [
                includedField,
                {
                    id: 'requisitionDescription',
                    model: 'RequisitionDescription',
                    type: FieldType.Description,
                    sortOrder: 0,
                    label: { key: 'procurement.rfq.sendRfqBoq.requisitionDescription' }
                },
                {
                    id: 'boqItemCount',
                    model: 'ItemCount',
                    type: FieldType.Integer,
                    sortOrder: 1,
                    label: { key: 'procurement.rfq.sendRfqBoq.itemCount' }
                }
            ]
        };
    }
}