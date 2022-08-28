export const BG_FOLDER = '/assets/pfp-bg';
let templates: Template[] = [
	{
		key: 'wall',
		bg: 'wall.jpg',
		position: {
			top: 15,
		},
	},
	{
		key: 'plain-color',
		bg: 'plain-color.jpg',
	},
	{
		key: 'abstract',
		bg: 'abstract.jpg',
	},
	{
		key: 'sf',
		bg: 'sf.jpg',
	},
	{
		key: 'office-1',
		bg: 'office-1.jpg',
		position: {
			top: 10,
		},
	},
	{
		key: 'building',
		bg: 'building.jpg',
	},
	{
		key: 'office-2',
		bg: 'office-2.jpg',
	},
	{
		key: 'office-3',
		bg: 'office-3.jpg',
	},
	{
		key: 'building-2',
		bg: 'building-2.jpg',
	},
];

templates = templates.map((item) => {
	item.bg = BG_FOLDER.concat('/' + item.bg);
	return item;
});

export default templates;

export interface Position {
	top: number;
	left: number;
}

export interface Template {
	bg: string;
	key: string;
	position?: Partial<Position>;
}
