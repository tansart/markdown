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
  expect(parser(`Hello **world**!`)).toBe(`<p>Hello <strong>world</strong>!</p>`);
  expect(parser(`Hello ** world **!`)).toBe(`<p>Hello ** world **!</p>`);
  expect(parser(`Hello **bold** world! **bold**`)).toBe(`<p>Hello <strong>bold</strong> world! <strong>bold</strong></p>`);
});

test('can parse italic text', () => {
  expect(parser(`Hello *world*!`)).toBe(`<p>Hello <i>world</i>!</p>`);
  expect(parser(`Hello * world! *`)).toBe(`<p>Hello * world! *</p>`);
  expect(parser(`Hello *italic* world! *italic*`)).toBe(`<p>Hello <i>italic</i> world! <i>italic</i></p>`);
});

test('can parse images', () => {
  expect(parser(`![world!](https://maps.google.com)`)).toBe(`<div class="image-wrapper"><img src="https://maps.google.com" alt="world!" /></div>`);
  expect(parser(`Hello ![world!](https://maps.google.com)`)).toBe(`<div class="image-wrapper">Hello <img src="https://maps.google.com" alt="world!" /></div>`);
});

test('can parse urls', () => {
  expect(parser(`Hello [world!](https://maps.google.com)`)).toBe(`<p>Hello <a href="https://maps.google.com">world!</a></p>`);
});

test('can parse headers h1 to h6', () => {
  expect(parser(`# hello
## world
### hello
#### world
##### hello
###### world`)).toBe(`<h1>hello</h1>
<h2>world</h2>
<h3>hello</h3>
<h4>world</h4>
<h5>hello</h5>
<h6>world</h6>`)
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

test('can parse a mix ordered/unordered lists', () => {
  expect(parser(`Hello world
  * Hello
  * world
    1. Hello
    2. numbered
    3. list`)).toBe(`<p>Hello world</p>
<ul>
  <li>Hello</li>
  <li>world</li>
  <li>
    <ol>
      <li>Hello</li>
      <li>numbered</li>
      <li>list</li>
    </ol>
  </li>
</ul>`)
});

test('can parse code', () => {
  expect(parser(`\`\`\`
~function() {
  test('how meta...', () => {
    expect(this).toWork();
  })
}();\`\`\``)).toBe(`<code>
~function() {
  test('how meta...', () => {
    expect(this).toWork();
  })
}();</code>`)
});

test('can parse a mix of texts and lists', () => {
  expect(parser(`*Hello* **world**
  * **I'm bold**
  * *I'm italics*`)).toBe(`<p><i>Hello</i> <strong>world</strong></p>
<ul>
  <li><strong>I'm bold</strong></li>
  <li><i>I'm italics</i></li>
</ul>`)
});
