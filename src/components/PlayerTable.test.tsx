import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PlayerTable from './PlayerTable';

afterEach(() => {
  cleanup();
});

describe('PlayerTable', () => {
  test('renders initial players', () => {
    render(<PlayerTable />);
    const rows = screen.getAllByRole('row');
    // 1 header row + 10 player rows
    expect(rows).toHaveLength(11);
  });

  test('adds a new player', async () => {
    const dom = render(<PlayerTable />);
    const addButton = await waitFor(() => dom.container.querySelector('#add-player-button') as HTMLElement);
    expect(addButton).toBeInTheDocument();
    fireEvent.click(addButton);
    const rows = screen.getAllByRole('row');
    // 1 header row + 11 player rows
    expect(rows).toHaveLength(12);
  });

  test('removes a player', async () => {
    const dom = render(<PlayerTable />);
    const addButton = await waitFor(() => dom.container.querySelector('#add-player-button') as HTMLElement);
    expect(addButton).toBeInTheDocument();
    fireEvent.click(addButton);
    const deleteButton = await waitFor(() => dom.container.querySelector('#delete-player-1') as HTMLElement);
    expect(deleteButton).toBeInTheDocument();
    fireEvent.click(deleteButton);
    const row = dom.container.querySelector('#player-row-1');
    expect(row).not.toBeInTheDocument();
  });

  test('edits a player name', async () => {
    const dom = render(<PlayerTable />);
    const nameCell = await waitFor(() => dom.container.querySelector('#edit-player-name-1') as HTMLElement);
    expect(nameCell).toBeInTheDocument();
    fireEvent.click(nameCell);

    // player-name-1の取得を待つ
    const input = await waitFor(() => dom.container.querySelector('#player-name-1') as HTMLInputElement);

    fireEvent.change(input, { target: { value: 'New Name' } });
    fireEvent.blur(input);
    const span = await waitFor(() => dom.container.querySelector('#edit-player-name-1') as HTMLElement);
    expect(span).toHaveTextContent('New Name');
  });

  test('edits a player played count', async () => {
    const dom = render(<PlayerTable />);
    const playedCell = await waitFor(() => dom.container.querySelector('#edit-player-playedCount-1') as HTMLElement);
    expect(playedCell).toBeInTheDocument();
    fireEvent.click(playedCell);

    // player-playedCount-1の取得を待つ
    const input = await waitFor(() => dom.container.querySelector('#player-playedCount-1') as HTMLInputElement);

    fireEvent.change(input, { target: { value: '5' } });
    fireEvent.blur(input);
    const span = await waitFor(() => dom.container.querySelector('#edit-player-playedCount-1') as HTMLElement);
    expect(span).toHaveTextContent('5');
  });
});