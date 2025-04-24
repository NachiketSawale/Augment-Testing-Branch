/**
 * Class for helping function on collections
 */
export class CollectionHelper {

	public static AsArray<T>(elements: T[] | T | undefined | null): T[] {
		return (elements !== null && elements !== undefined) ?
			elements instanceof Array ? elements : [elements]:
			[];
	}

	public static Flatten<T>(elements: T[] | T, getChildren: (parent: T) => T[]): T[] {
		const parents = CollectionHelper.AsArray(elements);

		const flattened = [] as T[];
		parents.forEach(parent => {
			flattened.push(parent);
			flattened.push(...CollectionHelper.Flatten(getChildren(parent), getChildren));
		});

		return flattened;
	}

	/**
	 * Method for type safe appending an item or a list (toAdd) of items to appendTo
	 * @param appendTo array of T where appending additional content
	 * @param toAdd content to add
	 */
	public static AppendTo<T>(toAdd: T[] | T, appendTo: T[]): void {
		if (toAdd) {
			if (toAdd instanceof Array) {
				appendTo.push(...toAdd);
			} else {
				appendTo.push(toAdd);
			}
		}
	}

	public static RemoveFrom<T>(removables: T[] | T, removeFrom: T[]) {

		if (removables) {
			if (removables instanceof Array) {
				removeFrom.filter(ar => !removables.find(rm => rm == ar));
			} else {
				removeFrom.filter(ar => ar === removables);
			}
		}
	}

	public static RemoveFromWithComparer<T>(removables: T[] | T, removeFrom: T[], compareEntities: (left: T, right: T) => number): void {
		if (removables) {
			if (removables instanceof Array) {
				removables.forEach((removeable) => {
					CollectionHelper.RemoveSingleEntityFrom(removeable, removeFrom, compareEntities);
				});
			} else {
				CollectionHelper.RemoveSingleEntityFrom(removables, removeFrom, compareEntities);
			}
		}
	}

	private static RemoveSingleEntityFrom<T>(removable: T, removeFrom: T[], compareEntities: (left: T, right: T) => number): void {
		const index = removeFrom.findIndex((candidate: T) => {
			return compareEntities(candidate, removable) === 0;
		});

		if (index > -1) {
			removeFrom.splice(index, 1);
		}
	}

	public static UpdateEntitiesWithComparer<T extends object>(updated: T[] | T, entities: T[], compareEntities: (left: T, right: T) => number): void {
		if (updated) {
			if (updated instanceof Array) {
				let index = -1;
				for (let i = 0; i < updated.length; i++) {
					const toUpdate = updated[i];
					index = entities.findIndex(rm => compareEntities(rm, toUpdate) === 0);
					if (index >= 0) {
						Object.assign(entities[index], toUpdate);
					}
				}
			} else {
				const index = entities.findIndex(rm => compareEntities(rm, updated) === 0);
				if (index >= 0) {
					Object.assign(entities[index], updated);
				}
			}
		}
	}
	public static FindOrDefault<O>(items: O[], selector: (item : O) => boolean, defaultValue: O): O {
		const item = items.find(selector);
		return item !== undefined ? item : defaultValue;
	}
}