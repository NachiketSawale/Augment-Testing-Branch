/*
 * Copyright(c) RIB Software GmbH
 */

import { AllKeys, IEntityBase, PropertyPath, Translatable } from '@libs/platform/common';
import {
	BaseValidationService,
	EntityDomainType,
	IConcreteEntitySchemaProperty,
	IEntitySchema,
	IEntitySchemaSimpleProperty,
	isEntitySchemaSimpleProperty,
	isEntitySchemaStringProperty,
	isNumericDomainType, ValidationInfo
} from '@libs/platform/data-access';
import {
	ADDITIONAL_COLUMN_PROP_NAMES,
	ConcreteField,
	ConcreteFieldOverload,
	FieldOverloadSpec,
	FieldType, FieldValidator,
	getAdditionalConfigFieldsForType,
	IAdditionalColumnProperties,
	IField, IFieldOverloadSet,
	ILayoutConfiguration,
	ILayoutGroup, isActionFieldOverload,
	isColorFieldOverload,
	isCustomComponentFieldOverload,
	isDynamicFieldOverload,
	isFieldOverloadSet,
	isLookupFieldOverload,
	isLookupInputSelectFieldOverload,
	isNumericFieldOverload,
	isSelectFieldOverload,
	isStringFieldOverload,
	isTransientFieldSet,
	IStringField,
	isUntypedFieldOverload,
	ITransientFieldSet,
	NumericFieldType,
	StringFieldType
} from '@libs/ui/common';
import { COMMON_ENTITY_LABELS } from '../model/common-entity-labels.model';
import {
	ENTITY_DEFAULT_GROUP_ID,
	ENTITY_HISTORY_GROUP_ID
} from '../model/default-entity-ids.model';
import { get } from 'lodash';

function checkSchemaContainsProperty<T extends object>(schema: IEntitySchema<T>, propertyName: string, type: EntityDomainType, requireMandatory: boolean): boolean {
	if (propertyName in schema.properties) {
		const propName = <keyof T>propertyName;
		const prop = <IConcreteEntitySchemaProperty>schema.properties[propName];
		if (prop.domain === type) {
			if (!requireMandatory || prop.mandatory) {
				return true;
			}
		}
	}
	return false;
}

function isEntityBaseSchema<T extends object>(schema: IEntitySchema<T>): boolean {
	return (checkSchemaContainsProperty(schema, 'InsertedAt', EntityDomainType.Date, true) &&
		checkSchemaContainsProperty(schema, 'InsertedBy', EntityDomainType.Integer, true) &&
		checkSchemaContainsProperty(schema, 'UpdatedAt', EntityDomainType.Date, false) &&
		checkSchemaContainsProperty(schema, 'UpdatedBy', EntityDomainType.Integer, false) &&
		checkSchemaContainsProperty(schema, 'Version', EntityDomainType.Integer, true));
}

function isEntityBaseGroups<T extends object>(group: ILayoutGroup<T>[], schema: IEntitySchema<T>): group is ILayoutGroup<IEntityBase>[] {
	return isEntityBaseSchema(schema);
}

export abstract class UiBusinessBaseEntityFieldService {

	/**
	 * Copies additional configuration from field overload to field
	 * @param field
	 * @param fieldOverload
	 */
	private copyAdditionalConfig<T extends object>(field: IField<T>, fieldOverload: ConcreteFieldOverload<T> & Partial<IAdditionalColumnProperties>) {
		const fieldData = field as unknown as {
			[key: string]: unknown;
		};

		const fieldOverloadData = fieldOverload as unknown as {
			[key: string]: unknown;
		};

		for (const additionalField of getAdditionalConfigFieldsForType(field.type).concat(...ADDITIONAL_COLUMN_PROP_NAMES)) {
			if (Object.prototype.hasOwnProperty.call(fieldOverload, additionalField)) {
				fieldData[additionalField] = fieldOverloadData[additionalField];
			}
		}
	}

	/**
	 * Extracts a collection of fallback labels from the layout configuration and enriches it with defaults.
	 *
	 * @param layout The layout configuration object, if any.
	 *
	 * @returns The fallback labels.
	 */
	private extractFallbackLabels<T extends object>(layout?: ILayoutConfiguration<T>): {
		[key: string]: Translatable
			} {
		return {
			...COMMON_ENTITY_LABELS.labels,
			...(layout?.labels ?? {})
		};
	}

	/**
	 * Extracts an object with optional field overloads.
	 *
	 * @param layout An optional layout configuration object.
	 *
	 * @returns The overloads object.
	 */
	private extractOverloads<T extends object>(layout?: ILayoutConfiguration<T>): {
		[key in keyof Partial<T>]: FieldOverloadSpec<T>;
	} {
		return layout?.overloads ? { ...layout?.overloads } : <{
			[key in keyof Partial<T>]: ConcreteFieldOverload<T>;
		}>{};
	}

	private extractAdditionalOverloads<T extends object>(layout?: ILayoutConfiguration<T>) : {
		[key in AllKeys<T>]?: FieldOverloadSpec<T>
	} {
		return layout?.additionalOverloads ? {...layout?.additionalOverloads} : < {
			[key in AllKeys<T>]?: ConcreteFieldOverload<T>
		}> {};
	}

	private normalizeGroups<T extends object>(layout: ILayoutConfiguration<T> | undefined, schema: IEntitySchema<T>): ILayoutGroup<T>[] {
		return (layout?.groups ? [...layout.groups.map(g => {
			return { ...g };
		})] : null) ?? [{
			gid: ENTITY_DEFAULT_GROUP_ID,
			attributes: (function collectAllAttributes(): (keyof T)[] {
				const propNames: (keyof T)[] = [];
				for (const propName in schema.properties) {
					switch (propName) {
						case 'InsertedAt':
						case 'InsertedBy':
						case 'UpdatedAt':
						case 'UpdatedBy':
						case 'Version':
							if (layout?.suppressHistoryGroup) {
								propNames.push(propName);
							}
							break;
						default:
							propNames.push(propName);
							break;
					}
				}
				return propNames;
			})()
		}];
	}

	/**
	 * Generates a normalized layout configuration object.
	 *
	 * @typeParam T The type edited in the form influenced by the layout configuration.
	 *
	 * @param layout The original layout configuration, if any.
	 * @param schema The schema definition.
	 *
	 * @returns The generated layout configuration, which is guaranteed to be a different
	 *   instance than `layout`.
	 */
	protected normalizeLayoutInfo<T extends object>(layout: ILayoutConfiguration<T> | undefined, schema: IEntitySchema<T>) {
		const groupsOverride = this.normalizeGroups(layout, schema);

		const result = {
			...layout,
			groups: groupsOverride,
			overloads: this.extractOverloads(layout),
			additionalOverloads: this.extractAdditionalOverloads(layout),
			labels: this.extractFallbackLabels(layout)
		};

		for (const g of result.groups) {
			g.title ??= result.labels[g.gid];
		}

		for (const g of result.groups) {
			g.attributes = g.attributes.concat(g.additionalAttributes as string[]);
		}

		this.addStandardFields(result, schema);

		this.removeExcludedAttributes(result);

		return result;
	}

	/**
	 * Generates a field definition ready to for use.
	 *
	 * @param groupId The group ID.
	 * @param schema The underlying schema of the entity.
	 * @param layout The layout configuration object that may provide overloads or the actual definition.
	 * @param propName The property name to generate a field definition for.
	 * @param extractOverload A function that extracts a suitable overload (if any) from an overload set.
	 * @param extractTransientField A function that extracts a suitable field definition (if any) from a field set.
	 * @param validationService An optional validation service used to construct validation functions for the fields.
	 *
	 * @returns The generated field definition or `null` if no field should be shown.
	 */
	protected generateConcreteField<T extends object>(
		groupId: string,
		schema: IEntitySchema<T>,
		layout: ILayoutConfiguration<T>,
		propName: string | keyof T,
		extractOverload: (overloadSet: IFieldOverloadSet<T>) => ((ConcreteFieldOverload<T> & Partial<IAdditionalColumnProperties>) | undefined) = () => undefined,
		extractTransientField: (trFieldSet: ITransientFieldSet<T>) => ((ConcreteFieldOverload<T> & Partial<IAdditionalColumnProperties>) | undefined) = () => undefined,
		validationService?: BaseValidationService<T>
	): (ConcreteField<T> & Partial<IAdditionalColumnProperties>) | null {
		function isEntityPropName(propName: string | keyof T): propName is keyof T {
			return Object.prototype.hasOwnProperty.call(schema.properties, propName);
		}

		function isNestedEntityPropName(propName: string | keyof T): propName is keyof T {
			return schema.additionalProperties !== undefined && Object.prototype.hasOwnProperty.call(schema.additionalProperties, propName);
		}

		// WebStorm claims propName can never be a string here, but this is INACCURATE.
		// When running this code in a unit test, propName very much is actually a string.
		if (typeof propName === 'string') {
			let validator: FieldValidator<T> | undefined = undefined;
			if (validationService) {
				const vFunc = validationService.getValidationFunc(propName);
				validator = info => {
					return vFunc(new ValidationInfo<T>(info.entity, info.value, propName));
				};
			}

			const transientField = layout.transientFields?.find(spec => spec.id === propName);
			if (transientField) {
				// prop name is treated as a transient field
				const fieldData = (function normalizeFieldData() {
					if (isTransientFieldSet(transientField)) {
						const overload = extractTransientField(transientField);
						return {
							common: transientField.common,
							field: overload,
							exclude: overload?.exclude ?? false
						};
					} else {
						return {
							common: undefined,
							field: transientField,
							exclude: false
						};
					}
				})();

				if (fieldData.exclude) {
					return null;
				}

				const fallbackLabel = layout.labels ? layout.labels[propName] : undefined;

				const trField = <ConcreteField<T> & Partial<IAdditionalColumnProperties>>{
					id: transientField.id,
					required: false,
					readonly: false,
					label: fallbackLabel ?? {
						text: `[${propName}]`
					},
					visible: true,
					...fieldData.common,
					...fieldData.field,
					validator: validator
				};

				if (!trField.type) {
					return null;
				}

				return trField;
			}

			if (isEntityPropName(propName)) {
				// prop name is treated as an original property of the DTO
				const schemaProp = schema.properties[propName];
				if (schemaProp) {
					const layoutInfoSpec = layout.overloads ? layout.overloads[propName] : undefined;
					const layoutInfo: ConcreteFieldOverload<T> | undefined = isFieldOverloadSet(layoutInfoSpec) ? extractOverload(layoutInfoSpec) : layoutInfoSpec;
					return this.createConcreteField<T>(groupId, propName, schemaProp, layoutInfo, layout.labels, validator);
				}
			}

			if(isNestedEntityPropName(propName)) {
				const schemaProp = get(schema.additionalProperties, propName) as IEntitySchemaSimpleProperty;
				if(schemaProp) {
					const layoutInfoSpec = layout.additionalOverloads ? get(layout.additionalOverloads, propName) as FieldOverloadSpec<T> | undefined : undefined;
					const layoutInfo: ConcreteFieldOverload<T> | undefined = isFieldOverloadSet(layoutInfoSpec) ? extractOverload(layoutInfoSpec) : layoutInfoSpec;
					return this.createConcreteField<T>(groupId, propName, schemaProp, layoutInfo, layout.labels, validator);
				}
			}
		}

		return null;
	}

	/**
	 * Creates a concrete field based on schema and overload
	 * @param groupId The group ID.
	 * @param propName The property name.
	 * @param schemaProp The property definition from the schema.
	 * @param fieldOverload The field overload definition, if present.
	 * @param fallbackLabels An object with fallback labels.
	 * @param validator An optional validation function for the field.
	 * @returns The resulting field definition or `null` if no field is generated based on the settings.
	 */
	private createConcreteField<T extends object>(groupId: string, propName: (keyof T) & string, schemaProp?: IConcreteEntitySchemaProperty, fieldOverload?: ConcreteFieldOverload<T>, fallbackLabels?: {
		[key: string]: Translatable;
	}, validator?: FieldValidator<T>): (ConcreteField<T> & Partial<IAdditionalColumnProperties>) | null {
		fieldOverload ??= {};

		if (fieldOverload.exclude) {
			return null;
		}

		if (!schemaProp && isUntypedFieldOverload(fieldOverload)) {
			throw new Error(`No type information found for field ${propName}.`);
		}

		const fallbackLabel = fallbackLabels ? fallbackLabels[propName] : undefined;

		//TODO: Use configuration service to build baseField properties, only use fieldoverload when the field has to be overridden.
		const baseField = {
			groupId: groupId,
			id: propName.includes('.') ? propName.replace('.','') : propName,
			required: schemaProp?.mandatory ?? false,
			readonly: fieldOverload.readonly ?? false,
			model: fieldOverload.valueAccessor ?? (propName as (PropertyPath<T> | undefined)),
			label: fieldOverload?.label ?? fallbackLabel ?? {
				text: `[${propName}]`
			},
			visible: fieldOverload?.visible ?? true,
			tooltip: fieldOverload?.tooltip,
			validator: validator
		};

		let field: IField<T>;
		// Add field type based on schema domain
		if (isCustomComponentFieldOverload(fieldOverload)) {
			// target field type: custom component
			field = {
				type: FieldType.CustomComponent,
				...baseField
			};
		} else if (isColorFieldOverload(fieldOverload)) {
			// target field type: color
			field = {
				type: FieldType.Color,
				...baseField
			};
		} else if (isSelectFieldOverload(fieldOverload)) {
			// target field type: select/image select
			field = {
				type: fieldOverload.type ?? FieldType.Select,
				...baseField
			};
		} else if (isLookupFieldOverload(fieldOverload)) {
			field = {
				type: FieldType.Lookup,
				...baseField
			};
		} else if (isLookupInputSelectFieldOverload(fieldOverload)) {
			field = {
				type: FieldType.LookupInputSelect,
				...baseField
			};
		} else if (isDynamicFieldOverload(fieldOverload)) {
			field = {
				type: FieldType.Dynamic,
				...baseField
			};
		} else if (isActionFieldOverload(fieldOverload)) {
			field = {
				type: FieldType.Action,
				...baseField
			};
		} else if ((isUntypedFieldOverload(fieldOverload) && isEntitySchemaStringProperty(schemaProp)) || isStringFieldOverload(fieldOverload)) {
			// target field type: string
			field = {
				type: isStringFieldOverload(fieldOverload) ?
					fieldOverload.type! :
					(schemaProp!.domain as string as StringFieldType),
				...baseField
			};

			if (isEntitySchemaStringProperty(schemaProp)) {
				(field as IStringField<T>).maxLength = schemaProp.maxlen;
			}
		} else if ((isEntitySchemaSimpleProperty(schemaProp) && isNumericDomainType(schemaProp.domain) && isUntypedFieldOverload(fieldOverload)) || isNumericFieldOverload(fieldOverload)) {
			// target field type: number
			field = {
				type: isStringFieldOverload(fieldOverload) ?
					fieldOverload.type! :
					(schemaProp!.domain as string as NumericFieldType),
				...baseField
			};
		} else if (isEntitySchemaSimpleProperty(schemaProp)) {
			field = {
				type: schemaProp.domain as string as FieldType,
				...baseField
			};
		} else {
			throw new Error('This state is unreachable.');
		}

		this.copyAdditionalConfig(field, fieldOverload);
		return field as unknown as ConcreteField<T>;
	}

	/**
	 * Adds some standard fields to the fields collection.
	 *
	 * @typeParam T The object type to edit in the fields.
	 *
	 * @param layout The layout configuration object, if any.
	 * @param schema The schema definition.
	 */
	private addStandardFields<T extends object>(layout: ILayoutConfiguration<T>, schema: IEntitySchema<T>) {
		function createStandardGroupHeader(gid: string) {
			return {
				gid: gid,
				title: COMMON_ENTITY_LABELS.labels[gid]
			};
		}

		if (!layout?.suppressHistoryGroup) {
			if (isEntityBaseSchema(schema)) {
				if (layout.groups && isEntityBaseGroups(layout.groups, schema)) {
					layout.groups.push({
						...createStandardGroupHeader(ENTITY_HISTORY_GROUP_ID),
						attributes: ['InsertedAt', 'InsertedBy', 'UpdatedAt', 'UpdatedBy']
					});
				}

				const standardOverload: ConcreteFieldOverload<T> = {
					readonly: true
				};

				Object.assign(layout.overloads as object, <{
					[key: string]: ConcreteFieldOverload<T>
				}>{
					InsertedAt: standardOverload,
					InsertedBy: standardOverload,
					UpdatedAt: standardOverload,
					UpdatedBy: standardOverload,
					Version: standardOverload
				});
			}
		}
	}

	private removeExcludedAttributes<T extends object>(layout: ILayoutConfiguration<T>) {
		if (layout.excludedAttributes) {
			const excluded: {
				[key: string]: boolean
			} = {};
			for (const exclAttr of layout.excludedAttributes) {
				if (typeof exclAttr === 'string') {
					excluded[exclAttr] = true;
				}
			}

			for (const grp of layout.groups ?? []) {
				for (let i = grp.attributes.length - 1; i >= 0; i--) {
					const attrName = grp.attributes[i];
					if (typeof attrName === 'string') {
						if (excluded[attrName]) {
							grp.attributes.splice(i, 1);
						}
					}
				}
			}
		}
	}
}