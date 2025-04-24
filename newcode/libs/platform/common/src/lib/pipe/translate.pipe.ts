/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Pipe, PipeTransform } from '@angular/core';
import { Translatable } from '../model/translation/translatable.interface';
import { PlatformTranslateService } from '../services/platform-translate.service';

/**
 * Uses the appication's translation infrastructure to apply client-side translations.
 *
 * @group Translation
 */
@Pipe({
	name: 'platformTranslate',
	pure: false,
})
export class TranslatePipe implements PipeTransform {
	private translate = inject(PlatformTranslateService);

	public transform(query: Translatable, ...args: unknown[]): string {
		return this.translate.instant(query, this.getInterpolationParams(args)).text;
	}

	private getInterpolationParams(args: unknown[]): object | undefined {
		if (args.length && typeof args[0] !== 'undefined') {
			if (typeof args[0] === 'string' && args[0].length) {
				// we accept objects written in the template such as {n:1}, {'n':1}, {n:'v'}
				// which is why we might need to change it to real JSON objects such as {"n":1} or {"n":"v"}
				const validArgs: string = args[0]
					.replace(/(')?([a-zA-Z0-9_]+)(')?(\s)?:/g, '"$2":')
					.replace(/:(\s)?(')(.*?)(')/g, ':"$3"');
				try {
					return JSON.parse(validArgs);
				} catch (e) {
					throw new SyntaxError(`Wrong parameter in TranslatePipe. Expected a valid Object, received: ${args[0]}`);
				}
			} else if (Array.isArray(args[0])) {
				throw new SyntaxError('Wrong parameter in TranslatePipe. Expected a valid Object, received Array');
			} else if (typeof args[0] === 'object') {
				return args[0] === null ? undefined : args[0];
			}
		}

		return undefined;
	}
}
