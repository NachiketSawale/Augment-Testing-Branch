/*
 * Copyright(c) RIB Software GmbH
 */
import { BasicsSharedCurrencyLookupService, BasicsSharedCustomizeLookupOverloadProvider, CurrencyEntity } from '@libs/basics/shared';
import { AllKeys, Translatable, TypedPropertyPath, prefixAllTranslationKeys } from '@libs/platform/common';
import { DataServiceFlatNode, EntityDomainType, IConcreteEntitySchemaProperty, IDataServiceOptions, IEntitySchema } from '@libs/platform/data-access';
import { FieldOverloadSpec, FieldType, ILayoutGroup, createLookup } from '@libs/ui/common';
import { IBoqCompositeEntity } from '@libs/boq/interfaces';
import { IBoqCompositeCompleteEntity, IBoqParentCompleteEntity } from '../model/boq-parent-complete-entity.interface';
import { IBoqParentEntity } from '../model/boq-parent-entity.interface';
import { ContainerLayoutConfiguration } from '@libs/ui/business-base';

export abstract class BoqCompositeDataService<T extends IBoqCompositeEntity, U extends IBoqCompositeCompleteEntity, PT extends IBoqParentEntity, PU extends IBoqParentCompleteEntity> extends DataServiceFlatNode<T,U,PT,PU> {

	protected readOnly = false; // Add local variable for read only mode

	public constructor(options: IDataServiceOptions<T>) {
		super(options);
	}

	//  region CRUD operations
	// #region

	protected override onLoadSucceeded(loaded: T[]): T[] {
		return loaded;
	}

	public override registerByMethod(): boolean {
		return true;
	}

	// #endregion
	//  endregion

	protected createNextReferenceNumber(): string {
		// Increment the reference number of the boq root item
		const convertibleReferences = this.getList().map(composite => composite.BoqRootItem?.Reference).filter(function (reference) {
			if(reference) {
				return /^\d+$/.test(reference); // Make sure we only take the references that can be converted to integers
			}

			return false;
		});

		const convertedReferences = convertibleReferences.map(reference => {
			if(reference) {
				return parseInt(reference, 10); // Convert the strings to integers
			}

			return null;
		});

		let maxReference : number | null = null;
		if(convertedReferences) {
			maxReference = (convertedReferences && convertedReferences.length !== 0) ? Math.max(...convertedReferences as Array<number>) : null;
			if (maxReference) {
				maxReference = (maxReference + 1);
			}
		}

		return maxReference?.toString() || '1';
	}

	/**
	 * @ngdoc function
	 * @name setReadOnly
	 * @function
	 * @methodOf boqWicBoqService
	 * @description sets the read only mode of the service
	 * @param {Boolean} flag telling if read only is active or not
	 */
	public setReadOnly(flag: boolean) {
		this.readOnly = flag;
	}

	/**
	 * @ngdoc function
	 * @name getReadOnly
	 * @function
	 * @methodOf boqWicBoqService
	 * @description gets the read only mode of the service
	 * @returns {Boolean} flag telling if read only is active or not
	 */
	public getReadOnly(): boolean {
		return this.readOnly;
	}
}

export abstract class BoqCompositeConfigService<T extends IBoqCompositeEntity> {
	public getSchema(entityName: string): IEntitySchema<T> {
		return {
			schema: entityName,
			properties: {},
			additionalProperties: this.properties,
		} as IEntitySchema<T>;
	}

	public getLayoutConfiguration(): ContainerLayoutConfiguration<T> {
		return {
			groups:              this.getLayoutGroups(),
			additionalOverloads: this.getOverloads(),
			labels:              this.getLabels(),
		};
	}

	protected abstract properties: { [key in AllKeys<IBoqCompositeEntity>]?: IConcreteEntitySchemaProperty };

	protected getBoqItemProperties(includePrices: boolean = true): { [key in AllKeys<T>]?: IConcreteEntitySchemaProperty } {
		const ret: {[key in AllKeys<IBoqCompositeEntity>]?: IConcreteEntitySchemaProperty} = {};

		ret['BoqRootItem.Reference']    = { domain: EntityDomainType.Description, mandatory: true  };
		ret['BoqRootItem.ExternalCode'] = { domain: EntityDomainType.Description, mandatory: false };
		ret['BoqRootItem.BriefInfo']    = { domain: EntityDomainType.Translation, mandatory: false };

		if (includePrices) {
			ret['BoqRootItem.Finalprice']   = { domain: EntityDomainType.Integer, mandatory: false };
			ret['BoqRootItem.FinalpriceOc'] = { domain: EntityDomainType.Integer, mandatory: false };
			ret['BoqRootItem.Finalgross']   = { domain: EntityDomainType.Integer, mandatory: false };
			ret['BoqRootItem.FinalgrossOc'] = { domain: EntityDomainType.Integer, mandatory: false };
		}

		return ret;
	}

	protected getBoqHeaderProperties(includeBackups: boolean = false): { [key in AllKeys<T>]?: IConcreteEntitySchemaProperty } {
		const ret: {[key in AllKeys<IBoqCompositeEntity>]?: IConcreteEntitySchemaProperty} = {};

		ret['BoqHeader.BasCurrencyFk'] = { domain: EntityDomainType.Integer, mandatory: false  };
		ret['BoqHeader.IsGCBoq']       = { domain: EntityDomainType.Boolean, mandatory: true };
		ret['BoqHeader.BoqStatusFk']   = { domain: EntityDomainType.Integer, mandatory: false };

		if (includeBackups) {
			ret['BoqHeader.BackupDescription'] = { domain: EntityDomainType.Description, mandatory: false };
			ret['BoqHeader.BackupComment']     = { domain: EntityDomainType.Comment,     mandatory: false };
			ret['BoqHeader.BackupNumber']      = { domain: EntityDomainType.Integer,     mandatory: false };
		}

		return ret;
	}

	protected getOverloads(): { [key in AllKeys<T>]?: FieldOverloadSpec<T>} {
		return {
			'BoqHeader.BasCurrencyFk': {
				type: FieldType.Lookup,
				lookupOptions: createLookup<T, CurrencyEntity>({dataServiceToken: BasicsSharedCurrencyLookupService})
			},
			'BoqHeader.BoqStatusFk': BasicsSharedCustomizeLookupOverloadProvider.provideBoqStatusLookupOverload(false),
		} as { [key in AllKeys<T>]?: FieldOverloadSpec<T>};
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

	protected getLabels(): {[key: string]: Translatable} {
		return {
			...prefixAllTranslationKeys('cloud.common.', {
				'BoqHeader.BasCurrencyFk': 'entityCurrency'
			}),
			...prefixAllTranslationKeys('boq.main.', {
				'BoqRootItem.Reference': 'Reference',
				'BoqRootItem.BriefInfo': 'BriefInfo',
				'BoqRootItem.ExternalCode': 'ExternalCode',
				'BoqRootItem.Finalprice': 'Finalprice',
				'BoqRootItem.FinalpriceOc': 'FinalpriceOc',
				'BoqRootItem.Finalgross': 'Finalgross',
				'BoqRootItem.FinalgrossOc': 'FinalgrossOc',
				'BoqHeader.BoqStatusFk': 'BoqStatusFk',
				'BoqHeader.IsGCBoq': 'IsGCBoq',
				'BoqHeader.BackupDescription': 'Backup.Description',
				'BoqHeader.BackupComment': 'Backup.Comment',
				'BoqHeader.BackupNumber': 'Backup.Number',
			}),
		};
	}
}

