import { renderHook } from '@testing-library/react';

import { useDocumentTitle } from '../use-document-title';

describe(useDocumentTitle.name, () => {
  afterEach(() => {
    document.title = '';
  });

  test('sets document title on mount', () => {
    renderHook(() => useDocumentTitle('Home'));

    expect(document.title).toBe('Home');
  });

  test('updates title when argument changes', () => {
    const { rerender } = renderHook(
      ({ title }: { title: string }) => useDocumentTitle(title),
      { initialProps: { title: 'First' } }
    );

    rerender({ title: 'Second' });

    expect(document.title).toBe('Second');
  });

  test('restores previous title on unmount', () => {
    document.title = 'Before';
    const { unmount } = renderHook(() => useDocumentTitle('After'));

    unmount();

    expect(document.title).toBe('Before');
  });
});
