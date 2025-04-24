import { ContainerLayoutConfiguration } from '@libs/ui/business-base';
import { ITimekeepingBreakEntity } from '@libs/timekeeping/interfaces';
import { prefixAllTranslationKeys } from '@libs/platform/common';

export const TIMEKEEPING_RECORDING_BREAK_LAYOUT:ContainerLayoutConfiguration<ITimekeepingBreakEntity> ={
	groups: [
		{
			gid: 'default-group',
			attributes: ['Duration','FromTimeBreakDate','ToTimeBreakDate','FromTimeBreakTime','ToTimeBreakTime']
		}
	],
		overloads: {

},
	labels: {
	...prefixAllTranslationKeys('timekeeping.recording.', {
			FromTimeBreakDate: {key:'fromtimebreakdate'},
			FromTimeBreakTime: {key:'fromtimebreaktime'},
			ToTimeBreakDate: {key:'totimebreakdate'},
			ToTimeBreakTime: {key:'totimebreaktime'}
		}),
	...prefixAllTranslationKeys('timekeeping.common.', {
			Duration:{key:'duration'}
		})
	}
};