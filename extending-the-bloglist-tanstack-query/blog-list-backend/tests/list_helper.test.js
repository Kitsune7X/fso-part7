import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import listHelper from '../utils/list_helper.js';

test('dummy returns one', () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  assert.strictEqual(result, 1);
});

// ---------- Total Likes test ----------
describe('Total likes', () => {
  const blogs = [
    {
      _id: '64b11aa51b54a676234d1801',
      title: "Hustle, Loyalty, Respect: The Champion's Code",
      author: 'John Cena',
      url: 'https://wwe.com/articles/john-cena-code',
      likes: 28,
      __v: 0,
    },
    {
      _id: '64b11ab71b54a676234d1802',
      title: 'Art in Motion: The Charismatic Enigma',
      author: 'Jeff Hardy',
      url: 'https://wwe.com/articles/jeff-hardy-art-in-motion',
      likes: 22,
      __v: 0,
    },
    {
      _id: '64b11ac81b54a676234d1803',
      title: "Voices: The Apex Predator's Mind",
      author: 'Randy Orton',
      url: 'https://wwe.com/articles/randy-orton-apex-predator',
      likes: 17,
      __v: 0,
    },
    {
      _id: '64b11ad91b54a676234d1804',
      title: 'Flight of the Ultimate Underdog',
      author: 'Rey Mysterio',
      url: 'https://wwe.com/articles/rey-mysterio-underdog',
      likes: 19,
      __v: 0,
    },
    {
      _id: '64b11aea1b54a676234d1805',
      title: 'The Game: Mastering the Ring',
      author: 'Triple H',
      url: 'https://wwe.com/articles/triple-h-the-game',
      likes: 23,
      __v: 0,
    },
    {
      _id: '64b11afb1b54a676234d1806',
      title: 'Mind Games of The Deadman',
      author: 'The Undertaker',
      url: 'https://wwe.com/articles/undertaker-mind-games',
      likes: 26,
      __v: 0,
    },
  ];

  const oneBlog = [
    {
      _id: '64b11aa51b54a676234d1801',
      title: "Hustle, Loyalty, Respect: The Champion's Code",
      author: 'John Cena',
      url: 'https://wwe.com/articles/john-cena-code',
      likes: 28,
      __v: 0,
    },
  ];

  test('of empty list is zero', () =>
    assert.strictEqual(listHelper.totalLikes([]), 0));

  test('when list has only one blog, equal the likes of that', () =>
    assert.strictEqual(listHelper.totalLikes(oneBlog), 28));

  test('of a bigger list is calculated right', () =>
    assert.strictEqual(listHelper.totalLikes(blogs), 135));
});

// ---------- Favorite Blog test ----------
describe('Favorite Blog', () => {
  const blogs = [
    {
      _id: '64b11aa51b54a676234d1801',
      title: "Hustle, Loyalty, Respect: The Champion's Code",
      author: 'John Cena',
      url: 'https://wwe.com/articles/john-cena-code',
      likes: 28,
      __v: 0,
    },
    {
      _id: '64b11ab71b54a676234d1802',
      title: 'Art in Motion: The Charismatic Enigma',
      author: 'Jeff Hardy',
      url: 'https://wwe.com/articles/jeff-hardy-art-in-motion',
      likes: 22,
      __v: 0,
    },
    {
      _id: '64b11ac81b54a676234d1803',
      title: "Voices: The Apex Predator's Mind",
      author: 'Randy Orton',
      url: 'https://wwe.com/articles/randy-orton-apex-predator',
      likes: 17,
      __v: 0,
    },
    {
      _id: '64b11ad91b54a676234d1804',
      title: 'Flight of the Ultimate Underdog',
      author: 'Rey Mysterio',
      url: 'https://wwe.com/articles/rey-mysterio-underdog',
      likes: 19,
      __v: 0,
    },
    {
      _id: '64b11aea1b54a676234d1805',
      title: 'The Game: Mastering the Ring',
      author: 'Triple H',
      url: 'https://wwe.com/articles/triple-h-the-game',
      likes: 23,
      __v: 0,
    },
    {
      _id: '64b11afb1b54a676234d1806',
      title: 'Mind Games of The Deadman',
      author: 'The Undertaker',
      url: 'https://wwe.com/articles/undertaker-mind-games',
      likes: 26,
      __v: 0,
    },
  ];

  const oneBlog = [
    {
      _id: '64b11aa51b54a676234d1801',
      title: "Hustle, Loyalty, Respect: The Champion's Code",
      author: 'John Cena',
      url: 'https://wwe.com/articles/john-cena-code',
      likes: 28,
      __v: 0,
    },
  ];

  test('when the list is empty, display the message', () =>
    assert.strictEqual(listHelper.favoriteBlog([]), 'There is no spoon'));

  test('when list has only one blog, return the same blog', () =>
    assert.deepStrictEqual(listHelper.favoriteBlog(oneBlog), {
      _id: '64b11aa51b54a676234d1801',
      title: "Hustle, Loyalty, Respect: The Champion's Code",
      author: 'John Cena',
      url: 'https://wwe.com/articles/john-cena-code',
      likes: 28,
      __v: 0,
    }));

  test('when there any many blogs, return the blog with the most likes', () =>
    assert.deepStrictEqual(listHelper.favoriteBlog(blogs), {
      _id: '64b11aa51b54a676234d1801',
      title: "Hustle, Loyalty, Respect: The Champion's Code",
      author: 'John Cena',
      url: 'https://wwe.com/articles/john-cena-code',
      likes: 28,
      __v: 0,
    }));
});

// ---------- Most Blogs test ----------
describe('Author with the most Blogs', () => {
  const blogs = [
    {
      _id: '64b31aa51b54a676234d2001',
      title: "The Game's Evolution",
      author: 'Triple H',
      url: 'https://wwe.com/articles/triple-h-evolution',
      likes: 22,
      __v: 0,
    },
    {
      _id: '64b31ab71b54a676234d2002',
      title: "Never Give Up: Cena's Mentality",
      author: 'John Cena',
      url: 'https://wwe.com/articles/cena-mentality',
      likes: 15,
      __v: 0,
    },
    {
      _id: '64b31ac81b54a676234d2003',
      title: 'Lucha Libre Heart',
      author: 'Rey Mysterio',
      url: 'https://wwe.com/articles/rey-heart',
      likes: 11,
      __v: 0,
    },
    {
      _id: '64b31ad91b54a676234d2004',
      title: 'RKO Psychology',
      author: 'Randy Orton',
      url: 'https://wwe.com/articles/orton-rko',
      likes: 18,
      __v: 0,
    },
    {
      _id: '64b31aea1b54a676234d2005',
      title: 'Pedigree: A Symbol of Authority',
      author: 'Triple H',
      url: 'https://wwe.com/articles/triple-h-pedigree',
      likes: 7,
      __v: 0,
    },
    {
      _id: '64b31afb1b54a676234d2006',
      title: 'Hustle, Loyalty, Respect',
      author: 'John Cena',
      url: 'https://wwe.com/articles/cena-hlr',
      likes: 20,
      __v: 0,
    },
    {
      _id: '64b31b0c1b54a676234d2007',
      title: "The Deadman's Aura",
      author: 'The Undertaker',
      url: 'https://wwe.com/articles/undertaker-aura',
      likes: 31,
      __v: 0,
    },
    {
      _id: '64b31b1d1b54a676234d2008',
      title: 'Charismatic Enigma Reflections',
      author: 'Jeff Hardy',
      url: 'https://wwe.com/articles/hardy-reflections',
      likes: 13,
      __v: 0,
    },
    {
      _id: '64b31b2e1b54a676234d2009',
      title: 'Rise of the Apex Predator',
      author: 'Randy Orton',
      url: 'https://wwe.com/articles/orton-apex',
      likes: 9,
      __v: 0,
    },
    {
      _id: '64b31b3f1b54a676234d2010',
      title: 'Master of the 619',
      author: 'Rey Mysterio',
      url: 'https://wwe.com/articles/rey-619',
      likes: 25,
      __v: 0,
    },
    {
      _id: '64b31b4f1b54a676234d2011',
      title: "The Game's Leadership",
      author: 'Triple H',
      url: 'https://wwe.com/articles/triple-h-leadership',
      likes: 12,
      __v: 0,
    },
    {
      _id: '64b31b5f1b54a676234d2012',
      title: 'Cena in the Spotlight',
      author: 'John Cena',
      url: 'https://wwe.com/articles/cena-spotlight',
      likes: 6,
      __v: 0,
    },
    {
      _id: '64b31b6f1b54a676234d2013',
      title: "The Apex Predator's Legacy",
      author: 'Randy Orton',
      url: 'https://wwe.com/articles/orton-legacy',
      likes: 14,
      __v: 0,
    },
    {
      _id: '64b31b7f1b54a676234d2014',
      title: 'Cena: From Prototype to Icon',
      author: 'John Cena',
      url: 'https://wwe.com/articles/cena-icon',
      likes: 7,
      __v: 0,
    },
    {
      _id: '64b31b8f1b54a676234d2015',
      title: 'The Cerebral Assassin',
      author: 'Triple H',
      url: 'https://wwe.com/articles/triple-h-cerebral',
      likes: 17,
      __v: 0,
    },
  ];

  const oneBlog = [
    {
      _id: '64b11aa51b54a676234d1801',
      title: "Hustle, Loyalty, Respect: The Champion's Code",
      author: 'John Cena',
      url: 'https://wwe.com/articles/john-cena-code',
      likes: 28,
      __v: 0,
    },
  ];

  test('when blog list is empty, display the message', () =>
    assert.strictEqual(listHelper.mostBlogs([]), 'There is no spoon'));

  test('when there is only one blog, return the author name and blog count of 1', () =>
    assert.deepStrictEqual(listHelper.mostBlogs(oneBlog), {
      author: 'John Cena',
      blogs: 1,
    }));

  test('where there are many blogs, return the correct author with most blogs', () =>
    assert.deepStrictEqual(listHelper.mostBlogs(blogs), {
      author: 'Triple H',
      blogs: 4,
    }));
});

// ---------- Most likes test ----------
describe('Author with the most likes', () => {
  const blogs = [
    {
      _id: '64b31aa51b54a676234d2001',
      title: "The Game's Evolution",
      author: 'Triple H',
      url: 'https://wwe.com/articles/triple-h-evolution',
      likes: 22,
      __v: 0,
    },
    {
      _id: '64b31ab71b54a676234d2002',
      title: "Never Give Up: Cena's Mentality",
      author: 'John Cena',
      url: 'https://wwe.com/articles/cena-mentality',
      likes: 15,
      __v: 0,
    },
    {
      _id: '64b31ac81b54a676234d2003',
      title: 'Lucha Libre Heart',
      author: 'Rey Mysterio',
      url: 'https://wwe.com/articles/rey-heart',
      likes: 11,
      __v: 0,
    },
    {
      _id: '64b31ad91b54a676234d2004',
      title: 'RKO Psychology',
      author: 'Randy Orton',
      url: 'https://wwe.com/articles/orton-rko',
      likes: 18,
      __v: 0,
    },
    {
      _id: '64b31aea1b54a676234d2005',
      title: 'Pedigree: A Symbol of Authority',
      author: 'Triple H',
      url: 'https://wwe.com/articles/triple-h-pedigree',
      likes: 7,
      __v: 0,
    },
    {
      _id: '64b31afb1b54a676234d2006',
      title: 'Hustle, Loyalty, Respect',
      author: 'John Cena',
      url: 'https://wwe.com/articles/cena-hlr',
      likes: 20,
      __v: 0,
    },
    {
      _id: '64b31b0c1b54a676234d2007',
      title: "The Deadman's Aura",
      author: 'The Undertaker',
      url: 'https://wwe.com/articles/undertaker-aura',
      likes: 31,
      __v: 0,
    },
    {
      _id: '64b31b1d1b54a676234d2008',
      title: 'Charismatic Enigma Reflections',
      author: 'Jeff Hardy',
      url: 'https://wwe.com/articles/hardy-reflections',
      likes: 13,
      __v: 0,
    },
    {
      _id: '64b31b2e1b54a676234d2009',
      title: 'Rise of the Apex Predator',
      author: 'Randy Orton',
      url: 'https://wwe.com/articles/orton-apex',
      likes: 9,
      __v: 0,
    },
    {
      _id: '64b31b3f1b54a676234d2010',
      title: 'Master of the 619',
      author: 'Rey Mysterio',
      url: 'https://wwe.com/articles/rey-619',
      likes: 25,
      __v: 0,
    },
    {
      _id: '64b31b4f1b54a676234d2011',
      title: "The Game's Leadership",
      author: 'Triple H',
      url: 'https://wwe.com/articles/triple-h-leadership',
      likes: 12,
      __v: 0,
    },
    {
      _id: '64b31b5f1b54a676234d2012',
      title: 'Cena in the Spotlight',
      author: 'John Cena',
      url: 'https://wwe.com/articles/cena-spotlight',
      likes: 6,
      __v: 0,
    },
    {
      _id: '64b31b6f1b54a676234d2013',
      title: "The Apex Predator's Legacy",
      author: 'Randy Orton',
      url: 'https://wwe.com/articles/orton-legacy',
      likes: 14,
      __v: 0,
    },
    {
      _id: '64b31b7f1b54a676234d2014',
      title: 'Cena: From Prototype to Icon',
      author: 'John Cena',
      url: 'https://wwe.com/articles/cena-icon',
      likes: 7,
      __v: 0,
    },
    {
      _id: '64b31b8f1b54a676234d2015',
      title: 'The Cerebral Assassin',
      author: 'Triple H',
      url: 'https://wwe.com/articles/triple-h-cerebral',
      likes: 17,
      __v: 0,
    },
  ];

  const oneBlog = [
    {
      _id: '64b11aa51b54a676234d1801',
      title: "Hustle, Loyalty, Respect: The Champion's Code",
      author: 'John Cena',
      url: 'https://wwe.com/articles/john-cena-code',
      likes: 28,
      __v: 0,
    },
  ];

  test('when blog list is empty, display the message', () => {
    assert.strictEqual(listHelper.mostLikes([]), 'There is no spoon');
  });

  test('when there is only one blog, return that author and likes', () => {
    assert.deepStrictEqual(listHelper.mostLikes(oneBlog), {
      author: 'John Cena',
      likes: 28,
    });
  });

  test('when there are many blogs, return the correct author with most likes', () => {
    assert.deepStrictEqual(listHelper.mostLikes(blogs), {
      author: 'Triple H',
      likes: 58,
    });
  });
});
