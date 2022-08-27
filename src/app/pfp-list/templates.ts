let templates: Template[] = [
	{
		bg: 'wall.jpg',
		class: 'wall',
		styles: {
			top: '15%',
			transform: 'scale(1.15)',
		},
	},
	{
		class: 'plain-color',
		bg: 'plain-color.jpg',
		styles: {},
	},
	{
		class: 'abstract',
		bg: 'abstract.jpg',
		styles: {},
	},
	{
		class: 'sf',
		bg: 'sf.jpg',
		styles: {},
	},
	{
		class: 'office-1',
		bg: 'office-1.jpg',
		styles: {
			top: '10%',
			transform: 'scale(1)',
		},
	},
	{
		class: 'building',
		bg: 'building.jpg',
		styles: {},
	},
	{
		class: 'office-2',
		bg: 'office-2.jpg',
		styles: {},
	},
	{
		class: 'office-3',
		bg: 'office-3.jpg',
		styles: {},
	},
	{
		class: 'building-2',
		bg: 'building-2.jpg',
		styles: {},
	},
];
templates = templates.map((item, index) => ({ ...item, id: index + 1 }));

export default templates;

export interface Template {
	bg: string;
	class: string;
	styles: { [key: string]: string | number };
}
