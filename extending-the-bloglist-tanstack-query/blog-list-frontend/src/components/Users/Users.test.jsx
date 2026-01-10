import { beforeEach, describe, expect, it } from 'vitest';
import { getByText, render, screen } from '@testing-library/react';
import Users from './Users';

describe('Users component test', () => {
  const mockUsers = [
    {
      id: '69620ffcb59b0b6acc31d32d',
      username: 'foxy',
      name: 'FOX',
      blogs: [
        {
          id: '69620ffdb59b0b6acc31d337',
          title: 'A blog by USAGI',
          author: 'Usagi',
          url: 'https://www.usagi-blog.com',
        },
        {
          id: '69620ffeb59b0b6acc31d33d',
          title: 'A blog by KUMA',
          author: 'Kuma-kun',
          url: 'https://www.kuma-blog.com',
        },
      ],
    },
    {
      id: '69620ffcb59b0b6acc31d32f',
      username: 'shiba',
      name: 'SHIBA-CHAN',
      blogs: [],
    },
    {
      id: '69620ffcb59b0b6acc31d331',
      username: 'kuma',
      name: 'KUMA-KUN',
      blogs: [],
    },
  ];

  beforeEach(() => {
    render(<Users users={mockUsers} />);
  });

  it('Display a table with correct header', () => {
    screen.debug();
    expect(screen.getByText(/blogs created/i)).toBeInTheDocument();
  });

  it('Renders table with correct rows for the amount of users', () => {
    const rows = screen.getAllByRole('row');

    // Expect to have rows + 1 due to header row
    expect(rows).toHaveLength(4);
  });

  it('Display correct name and blog count', () => {
    expect(screen.getByText('FOX')).toBeInTheDocument();
    expect(screen.getByText('SHIBA-CHAN')).toBeInTheDocument();
    expect(screen.getByText('KUMA-KUN')).toBeInTheDocument();
  });
});
