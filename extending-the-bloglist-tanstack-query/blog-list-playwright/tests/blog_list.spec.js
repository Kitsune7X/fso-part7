import { test, expect } from '@playwright/test';
import { loginWith, createBlog } from './helpers';

const { describe, beforeEach } = test;

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    // Empty the database
    await request.post('/api/testing/reset');

    // Create a new user
    const newUser = await request.post('/api/users', {
      data: {
        username: 'foxy',
        name: 'FOX',
        password: 'foxvillage',
      },
    });

    const body = await newUser.json();

    // console.log(body);

    await page.goto('/');
  });

  test('Login form is shown', async ({ page }) => {
    // Check that the login form is rendered
    await expect(
      page.getByText('Log in to applicationusernamepasswordLogin')
    ).toBeVisible();

    // Check that username input is rendered
    await expect(page.getByLabel('username')).toBeVisible();
    // Check that password input is rendered
    await expect(page.getByLabel('password')).toBeVisible();
    // Check that login button is rendered
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  });

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'foxy', 'foxvillage');

      await expect(
        page.getByText('You have successfully logged in')
      ).toBeVisible();

      await expect(page.getByText('FOX is logged in')).toBeVisible();
    });

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'foxy', 'wrongPassword');

      const errorNotification = page
        .locator('div')
        .filter({ hasText: /^Wrong username or password$/ });
      console.log(await errorNotification.innerHTML());

      await expect(errorNotification).toBeVisible();
      await expect(errorNotification).toContainText(
        'Wrong username or password'
      );
      await expect(errorNotification).toHaveCSS(
        'background-color',
        'rgb(164, 57, 57)'
      );
    });
  });

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'foxy', 'foxvillage');

      await createBlog(
        page,
        'A blog by USAGI',
        'Usagi',
        'https://www.usagi-blog.com'
      );

      await createBlog(
        page,
        'A blog by KUMA',
        'Kuma-kun',
        'https://www.kuma-blog.com'
      );
    });

    test('a new blog can be created', async ({ page }) => {
      await createBlog(
        page,
        'A blog by FOX',
        'Foxy',
        'https://www.fox-blog.com'
      );

      await expect(page.getByText('A blog by FOX FoxyView')).toBeVisible();
      await expect(page.getByText('A new blog A blog by FOX by')).toBeVisible();
    });

    describe('When blog detail is opened', () => {
      beforeEach(async ({ page }) => {
        // Get all the view button (data-testid='detail-btn')
        const detailBtn = page.getByTestId('detail-btn');

        // Get the button counts
        // https://playwright.dev/docs/api/class-locator#locator-count
        const count = await detailBtn.count();

        // Open the detail view of all the blogs by using for loop
        for (let i = 0; i < count; i++) {
          await detailBtn.nth(i).click();
        }
      });

      test('a blog can be liked', async ({ page }) => {
        const blogDetailDiv = page.getByText(
          'A blog by USAGI UsagiHidehttps://www.usagi-blog.comLikes: 0LikeUser: foxyRemove'
        );

        // Check for original like count
        await expect(blogDetailDiv.getByTestId('likes-count')).toHaveText(
          'Likes: 0'
        );

        await blogDetailDiv.getByRole('button', { name: 'Like' }).click();

        // Check that the like count get updated
        await expect(page.getByTestId('likes-count').nth(2)).toHaveText(
          'Likes: 1'
        );
      });

      test('a blog can be deleted', async ({ page }) => {
        const blogDetailDiv = page.getByText(
          'A blog by USAGI UsagiHidehttps://www.usagi-blog.comLikes: 0LikeUser: foxyRemove'
        );

        console.log(blogDetailDiv);
        page.on('dialog', async (dialog) => {
          await dialog.accept();
        });
        await page.getByRole('button', { name: 'Remove' }).first().click();

        await expect(
          page.getByText(
            'A blog by USAGI UsagiHidehttps://www.usagi-blog.comLikes: 0LikeUser: foxyRemove'
          )
        ).toBeHidden();

        await expect(
          page
            .locator('div')
            .filter({ hasText: /^A blog by USAGI has been deleted$/ })
        ).toBeVisible();
      });

      test('only the user who added the blog can see the blog delete button', async ({
        page,
      }) => {
        // Locate the blog that has `user`
        const blogWithUser = page.getByText(
          'A blog by USAGI UsagiHidehttps://www.usagi-blog.comLikes: 0LikeUser: foxyRemove'
        );

        // Locate the blog that is added by `helpers` and doesn't have `user`

        const blogWithoutUser = page.getByText(
          'Lucha Libre Heart Rey MysterioHidehttps://wwe.com/articles/rey-heartLikes:'
        );
        console.log(await blogWithoutUser.innerHTML());

        await expect(
          blogWithUser.getByRole('button', { name: 'Remove' })
        ).toBeVisible();

        await expect(
          blogWithoutUser.getByRole('button', { name: 'Remove' })
        ).toBeHidden();
      });

      test('blogs are arranged in descending likes order', async ({ page }) => {
        // Check that the blogs are sorted in descending likes order
        await expect(page.locator('#blog-container > div')).toContainText([
          'Likes: 15',
          'Likes: 11',
          'Likes: 0',
          'Likes: 0',
        ]);
      });
    });
  });
});
