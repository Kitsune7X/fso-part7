const dummy = (blogs) => {
  return 1;
};

// ---------- Total Likes function ----------
const totalLikes = (blogs) => {
  return blogs.length === 0
    ? 0
    : blogs.reduce((acc, curr) => acc + curr.likes, 0);
};

// ---------- Favorite Blogs function ----------
const favoriteBlog = (blogs) => {
  return blogs.length === 0
    ? 'There is no spoon'
    : blogs.toSorted((a, b) => a.likes - b.likes).at(-1);
};

// ---------- Find the author with most blog count function ----------
// Document the code so future me will understand
const mostBlogs = (blogs) => {
  if (blogs.length === 0) return 'There is no spoon';

  // Reduce the blog array into an object with `key` is the
  // author name and `value` is the blog counts
  // Initialize `acc` with an empty object {}, as `reduce` iterate through
  // the array, it will take `curr.author` as key. If it's not defined, it will become 1.
  // Increment the count when encounter the same object and return `acc` object at the end.
  const blogCountByAuthor = blogs.reduce((acc, curr) => {
    acc[curr.author] = ++acc[curr.author] || 1;
    return acc;
  }, {});

  // Turn `blogCountByAuthor` object into an array of [key, value] then reduce that array
  // to an object containing the author with the most blog count and blog count.
  // `reduce` method's note: initialize the `acc` with {} and destructure it. `author` becomes undefined
  // `blogs` becomes -Infinity as we assign it. Curr is the [key, value] array. Then comparison in the `if`
  // condition to find the largest value and return { author, blogs } object.
  return Object.entries(blogCountByAuthor).reduce(
    ({ author, blogs = -Infinity }, [currAuthor, currBlog]) => {
      if (currBlog > blogs) {
        blogs = currBlog;
        author = currAuthor;
      }

      return { author, blogs };
    },
    {}
  );
};

// ---------- Find the author with most likes function ----------
const mostLikes = (blogs) => {
  if (blogs.length === 0) return 'There is no spoon';

  // It's mostly the same as finding the
  const likesPerAuthor = blogs.reduce((acc, curr) => {
    acc[curr.author] = acc[curr.author] + curr.likes || curr.likes;
    return acc;
  }, {});

  return Object.entries(likesPerAuthor).reduce(
    ({ author, likes = -Infinity }, [currAuthor, currLikes]) => {
      if (currLikes > likes) {
        likes = currLikes;
        author = currAuthor;
      }
      return { author, likes };
    },
    {}
  );
};

export default { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };
