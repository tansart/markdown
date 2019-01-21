import parser from './parser';

test('can parse paragraphs', () => {
	expect(parser(`Hello world!`)).toBe(`<p>Hello world!</p>`);
	expect(parser(`Hello world!
Hello other world!`)).toBe(`<p>Hello world!
Hello other world!</p>`);
	expect(parser(`Hello world!

Hello other world!`)).toBe(`<p>Hello world!</p>
<p>Hello other world!</p>`);
});

test('can parse bold text', () => {
	expect(parser(`Hello **world**!`)).toBe(`<p>Hello <strong>world</strong></p>`);
	expect(parser(`Hello ** world **!`)).toBe(`<p>Hello ** world **!</p>`);
	expect(parser(`Hello **bold** world! **bold**`)).toBe(`<p>Hello <strong>bold</strong> world! <strong>bold</strong></p>`);
});

test('can parse italic text', () => {
	expect(parser(`Hello *world*!`)).toBe(`<p>Hello <i>world</i>!</p>`);
	expect(parser(`Hello * world! *`)).toBe(`<p>Hello * world! *</p>`);
	expect(parser(`Hello *italic* world! *italic*`)).toBe(`<p>Hello <i>italic</i> world! <i>italic</i></p>`);
});

test('can parse urls', () => {
	expect(parser(`Hello  [world!](https://maps.google.com)`)).toBe(`<p>Hello <a href="https://maps.google.com">world!</a></p>`);
});

test('can parse ordered lists', () => {
	expect(parser(`Hello world
  1. Hello
  2. world
  3. !`)).toBe(`<p>Hello world</p>
<ol>
  <li>Hello</li>
  <li>world</li>
  <li>!</li>
</ol>`)
});


test('can parse ordered lists', () => {
	expect(parser(`Hello world
  * Hello
    - world
      * !
    - :)`)).toBe(`<p>Hello world</p>
<ul>
  <li>Hello</li>
  <li>
    <ul>
      <li>world</li>
      <li>
        <ul>
          <li>!</li>
        </ul>
      </li>
      <li>:)</li>
    </ul>
  </li>
</ul>`)
});