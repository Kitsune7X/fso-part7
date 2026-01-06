import { test, describe, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Notification from './Notification';
import styles from './Notification.module.css';

describe('Notification component', () => {
  test('display correct message', async () => {
    render(<Notification message={'Hello Notification'} />);

    // screen.debug();
    expect(screen.getByText(/^hello notification$/i)).toBeInTheDocument();
  });

  test('does not apply error class when there is no error', () => {
    render(<Notification message={'No error'} />);

    // screen.debug();
    const div = screen.getByText(/no/i).parentElement;

    expect(div).toHaveClass(styles.notification);
  });

  test('apply error class when there is error', () => {
    render(<Notification message={'Oops'} isError={true} />);

    screen.debug();

    const notificationDiv = screen.getByText(/oops/i).parentElement;

    expect(notificationDiv).toHaveClass(styles.error);
  });
});
