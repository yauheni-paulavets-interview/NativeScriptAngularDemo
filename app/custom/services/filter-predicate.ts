//'Or', case-sensitive filter.
export class FilterPredicate {
	filter(records: Array<any>, filter): Array<any> {
		let filterIsEmpty = true;
		for (let key in filter) {
			if (typeof filter[key] === 'string' && filter[key].length) {
				filterIsEmpty = false;
				break;
			}
		}
		if (filterIsEmpty) {
			return records;
		} else {
			return records.filter((record) => {
				let result = false;
				for (let key in filter) {
					let filterValueTakesPlace = typeof filter[key] === 'string' && filter[key].length;
					let recordValueTakesPlace = typeof record[key] === 'string' && record[key].length;
					if (recordValueTakesPlace && filterValueTakesPlace && record[key].indexOf(filter[key]) > -1) {
						result = true;
						break;
					}
				}
				return result;
			});
		}
	}
}