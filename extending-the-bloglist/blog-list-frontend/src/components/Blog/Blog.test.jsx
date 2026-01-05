import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { test, expect, describe, beforeEach, vi, assert } from 'vitest';
import Blog from './Blog';
import blogService from '../../services/blogs';
import BlogEditor from '../BlogEditor/BlogEditor';

describe('Test for blog component', () => {
  const blog = {
    title: 'SmackDown vs Raw',
    author: 'THQ',
    url: 'https://www.wwe.com',
    user: { id: 1 },
    likes: 0,
  };

  beforeEach(() => {
    render(<Blog blog={blog} />);
  });

  // Test for default case --------------------------------------------------------------
  test('render a blog title and author but no url and likes by default', () => {
    screen.getByText('SmackDown vs Raw THQ');
    expect(screen.queryByText('https://www.wwe.com')).toBeNull();
    expect(screen.queryByText('Likes')).toBeNull();
  });

  // Test when more detail button is clicked --------------------------------------------------------------
  test('when the button controlling the shown details is clicked, render url and likes', async () => {
    const user = userEvent.setup();

    const detailBtn = screen.getByTestId('detail-btn');
    // Check the button label before clicking to be 'View'
    expect(detailBtn).toHaveTextContent('View');

    // screen.debug(detailBtn);
    await user.click(detailBtn);

    // Button label changed to 'Hide' after clicking
    expect(detailBtn).toHaveTextContent('Hide');

    //https://vitest.dev/api/browser/locators.html#options
    expect(
      screen.getByRole('link', { name: 'https://www.wwe.com' })
    ).toBeVisible();

    const likes = screen.getByTestId('likes-count');
    expect(likes).toBeVisible();
  });

  // Test when the `like` button is clicked twice --------------------------------------------------------------
  test('when the `like` button is clicked twice, the event handler the component received as props is called twice', async () => {
    const user = userEvent.setup();

    const detailBtn = screen.getByTestId('detail-btn');

    await user.click(detailBtn);

    const likeBtn = screen.getByRole('button', { name: 'Like' });
    // screen.debug(likeBtn);

    // The `likeBtn` trigger `addLikes` on click which then call `update` from blogService,
    // we will track how many times `update` is  called.
    // https://vitest.dev/guide/mocking/functions.html
    // https://vitest.dev/api/mock.html#mockresolvedvalueonce
    const updateSpy = vi
      .spyOn(blogService, 'update')
      .mockResolvedValueOnce({ ...blog, likes: 1 })
      .mockResolvedValueOnce({ ...blog, likes: 2 });

    await user.dblClick(likeBtn);
    // Test for the function get called 2 times
    expect(updateSpy).toHaveBeenCalledTimes(2);

    // Test for the `Likes` count get updated correctly
    expect(screen.getByTestId('likes-count')).toHaveTextContent('Likes: 2');
  });
});

describe('Test for new blog form', () => {
  test('the form calls the event handler it received as props with the right detail when a new blog is created', async () => {
    const user = userEvent.setup();

    const addBlog = vi.fn();

    render(<BlogEditor createBlog={addBlog} />);

    // Get the input fields
    const titleInput = screen.getByRole('textbox', { name: 'Title' });
    const authorInput = screen.getByRole('textbox', { name: 'Author' });
    const urlInput = screen.getByRole('textbox', { name: 'Url' });

    // Get the submit button
    const submitBtn = screen.getByRole('button', { name: 'Create' });

    await user.type(titleInput, 'Kingdom');
    await user.type(authorInput, 'Downstait');
    await user.type(
      urlInput,
      'https://youtu.be/-wGXH7-ESaE?si=tVzD0qcRECJ_Va4W'
    );

    await user.click(submitBtn);

    expect(addBlog).toHaveBeenCalled();
    expect(addBlog.mock.calls).toHaveLength(1);

    assert.deepStrictEqual(addBlog.mock.calls[0][0], {
      title: 'Kingdom',
      author: 'Downstait',
      url: 'https://youtu.be/-wGXH7-ESaE?si=tVzD0qcRECJ_Va4W',
    });
  });
});
