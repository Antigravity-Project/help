export const getPlural = (
	word: string,
	plural: string,
	discriminant: number,
) => {
	const MIN_DISCRIMINANT_VALUE = 1;
	if (discriminant > MIN_DISCRIMINANT_VALUE) {
		return plural;
	}

	return word;
};
