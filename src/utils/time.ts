/* eslint-disable @typescript-eslint/no-magic-numbers */

export const formatTime = (attrs: Array<Array<number | string>>) => {
	const MIN_TIME = 0;
	const MIN_INDEX = 0;

	let time = "";
	attrs.forEach(([name, value], index) => {
		if (value > MIN_TIME) {
			const hasS = value > 1 ? "s" : "";
			const hasE = index + 1 === attrs.length ? "e" : "";
			const hasTrailingSpace = time.length > MIN_INDEX ? " " : "";

			time += `${hasTrailingSpace}${hasE} ${value} ${name}${hasS}`;
		}
	});

	return time;
};
