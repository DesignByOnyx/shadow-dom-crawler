import { splitSelector } from '../src/util';

describe('splitSelector', () => {
	it('works with a single segment', () => {
		expect(splitSelector('foo-bar')).toEqual(['foo-bar']);
	});

	it('works with a descendant segment', () => {
		expect(splitSelector('foo bar')).toEqual(['foo', 'bar']);
	});

	it('works with an attribute selector (with nested spaces)', () => {
		expect(splitSelector('foo bar[bing = "baz"] buzz')).toEqual(['foo', 'bar[bing = "baz"]', 'buzz']);
	});

	['>', '+', '~'].forEach(combinator => {
		it(`works with "${combinator}" combinator`, () => {
			expect(splitSelector(`foo   ${combinator}   bar`)).toEqual(['foo', combinator, 'bar']);
			expect(splitSelector(`foo ${combinator} bar`)).toEqual(['foo', combinator, 'bar']);
			expect(splitSelector(`foo${combinator}bar`)).toEqual(['foo', combinator, 'bar']);
		});
	});
});
