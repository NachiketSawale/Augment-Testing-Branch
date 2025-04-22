/*
 * Copyright(c) RIB Software GmbH
 */

import { map } from 'rxjs';
import { get, padStart, isNil, isEmpty, escape } from 'lodash';
import { Injectable, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { IDescriptionInfo, IIdentificationData, PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { ILookupConfig } from '../model/interfaces/lookup-options.interface';
import { ILookupContext, ILookupEntity } from '../model/interfaces/lookup-context.interface';
import { ILookupImageSelector, LookupImageIconType, LookupSvgBgColorType } from '../model/interfaces/lookup-image-selector.interface';
import { ILookupReadonlyDataService } from '../model/interfaces/lookup-readonly-data-service.interface';
import { LookupIdentificationData } from '../model/lookup-identification-data';


/**
 * Lookup formatter service, used to format lookup field.
 */
@Injectable({
	providedIn: 'root'
})
export class LookupFormatterService {
	private readonly sanitizer = inject(DomSanitizer);
	private readonly configService = inject(PlatformConfigurationService);
	private readonly translateService = inject(PlatformTranslateService);

	/**
	 * Provide a type formatter for translate-able display member
	 * @param getDescriptionInfoFn function for getting the description info from the lookup item selected
	 */
	public createTranslationFormatter<TItem extends object, TEntity extends object>(getDescriptionInfoFn: (item: TItem) => IDescriptionInfo | undefined) {
		return {
			format(item: TItem, config: ILookupContext<TItem, TEntity>): string {
				const translated = getDescriptionInfoFn(item);

				return translated ? translated.Translated : '';
			}
		};
	}

	/**
	 * Get property text string
	 * @param dataItem
	 * @param propertyPath
	 * @param doTranslate
	 */
	public getPropertyText<TItem extends object>(dataItem: TItem, propertyPath: string, doTranslate?: boolean): string {
		const value = get(dataItem, propertyPath, '');

		if (value && doTranslate) {
			return this.translateService.instant(value).text;
		}

		if ((value as IDescriptionInfo)?.Translated !== undefined) {
			return (value as IDescriptionInfo).Translated;
		}

		return value as string;
	}

	/**
	 * Get text string of display member
	 * @param dataItem
	 * @param config
	 */
	public getDisplayText<TItem extends object, TEntity extends object>(dataItem: TItem, config: ILookupConfig<TItem, TEntity>): string {
		return escape(this.getPropertyText(dataItem, config.displayMember, config.translateDisplayMember));
	}

	/**
	 * Get plain text string
	 * @param dataItem
	 * @param context
	 */
	public getPlainText<TItem extends object, TEntity extends object>(dataItem: TItem, context: ILookupContext<TItem, TEntity>) {
		let value = this.getDisplayText(dataItem, context.lookupConfig);

		if (!context.lookupConfig.showCustomInputContent && context.lookupConfig.formatter) {
			value = context.lookupConfig.formatter.format(dataItem, context);
		}

		return value;
	}

	/**
	 * Get formatted text usually with html string
	 * @param dataItem
	 * @param context
	 */
	public getFormattedText<TItem extends object, TEntity extends object>(dataItem: TItem, context: ILookupContext<TItem, TEntity>) {
		const config = context.lookupConfig;
		let displayText = this.getDisplayText(dataItem, config);

		if (config.formatter) {
			displayText = config.formatter.format(dataItem, context);
		}

		if (config.imageSelector) {
			displayText = this.getImageResult(dataItem, context, config.imageSelector, displayText);
		}

		// if custom content is empty, show placeholder.
		if (!displayText) {
			displayText = this.getPlaceholder(config);
		}

		return config.showCustomInputContent ? this.sanitizer.bypassSecurityTrustHtml(displayText) : displayText;
	}

	/**
	 * Get placeholder content if existing
	 * @param config
	 */
	public getPlaceholder<TItem extends object, TEntity extends object>(config: ILookupConfig<TItem, TEntity>) {
		if (config.placeholder) {
			return '<div style="color: #888;font-style: italic;cursor: default;">' + config.placeholder + '</div>';
		}
		return '';
	}

	/**
	 * Get formatted text by foreign key.
	 * @param key
	 * @param service
	 * @param context
	 */
	public getFormattedTextByKey<TItem extends object, TEntity extends object>(key: number | string | IIdentificationData, service: ILookupReadonlyDataService<TItem, TEntity>, context: ILookupContext<TItem, TEntity>) {
		const data = LookupIdentificationData.create(key, context);

		return service.getItemByKey(data, context).pipe(map(e => {
			if (!e) {
				// lookup entity is not found, return id string to identify it.
				return data.key.toString();
			}
			return this.getFormattedText(e, context);
		}));
	}

	private getImageResult<TItem extends object, TEntity extends object>(dataItem: TItem, context: ILookupContext<TItem, TEntity>, imageSelector: ILookupImageSelector<TItem, TEntity>, displayText: string) {
		let result = '';
		const imgSrc = imageSelector.select(dataItem, context);
		const iconType = imageSelector.getIconType ? imageSelector.getIconType() : LookupImageIconType.Url;

		//add img-tag if src-path enabled[FireFox].
		if (imgSrc) {
			switch (iconType) {
				case LookupImageIconType.Css:
					result = '<i class="block-image ' + imgSrc + '"></i>';
					break;
				case LookupImageIconType.Svg: {
					const svgConfig = imageSelector.svgConfig;

					if (!svgConfig) {
						throw new Error('Svg config is missing');
					}

					result = '<img src="' + imgSrc + '">';
					const entity = context.entity || {};
					const iconColors = this.getSvgColorProperty((entity as ILookupEntity)[svgConfig.backgroundColor], svgConfig.backgroundColorType, svgConfig.backgroundColorLayer);
					result = this.getSvgIconWrapper(iconColors, imgSrc);
					break;
				}
				case LookupImageIconType.Url:
				default:
					result = '<img src="' + imgSrc + '" class="block-image" />';
					break;
			}
		}

		if (result) {
			result += '<span class="pane-r">' + displayText + '</span>';
		}

		return result;
	}

	private getSvgColorProperty(color: unknown, type: LookupSvgBgColorType, layer: number[]) {
		let iconColors = '';
		let svgBackground = '';

		if (color && type && !isNil(layer) && !isEmpty(layer)) {
			iconColors = ' style="';
			switch (type) {
				case LookupSvgBgColorType.Dec:
					svgBackground = this.decToHexColor(color as number);
					break;
				case LookupSvgBgColorType.Hex: // the implementation of hex format hasn't been yet defined -> needs to be in string format with '#' at first position
				case LookupSvgBgColorType.String:
					svgBackground = color as string;
					break;
				default:
					break;
			}
			layer.forEach(l => iconColors += `--icon-color-${l}: ${svgBackground}; `);

			iconColors += '"';

		}
		return iconColors;
	}

	private getSvgIconWrapper(iconColors: string, imageUrl: string) {
		const svgUrl = `${imageUrl.split(' ')[0]}.svg#${imageUrl.split(' ')[1]}`;

		return `<svg class='block-image'${iconColors}>
							<use href='${this.configService.clientUrl}cloud.style/content/images/${svgUrl}' class='block-image ${imageUrl}'></use>
						</svg>`;
	}

	private decToHexColor(c: number) {
		return padStart(c.toString(16), 7, '#000000');
	}
}