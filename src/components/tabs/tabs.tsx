import { useId, useRef } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

import { nextTabIndex } from './next-tab-index';
import { List, Root, Tab } from './tabs.styles';

export interface TabItem<T extends string> {
  id: T;
  label: ReactNode;
}

interface TabsProps<T extends string> {
  tabs: TabItem<T>[];
  value: T;
  onChange: (id: T) => void;
  'aria-label': string;
  /** Содержимое активного таба */
  children: ReactNode;
}

/**
 * Табы по паттерну WAI-ARIA: стрелки переключают и переводят фокус,
 * в порядке Tab — только активный таб; рендерится одна панель активного
 */
export const Tabs = <T extends string>({
  tabs,
  value,
  onChange,
  'aria-label': label,
  children,
}: TabsProps<T>) => {
  const prefix = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const tabId = (id: T) => `${prefix}-tab-${id}`;
  const panelId = (id: T) => `${prefix}-panel-${id}`;

  const handleKeyDown = (event: KeyboardEvent, index: number) => {
    const next = nextTabIndex(event.key, index, tabs.length);
    const tab = next === null ? undefined : tabs[next];
    if (next === null || tab === undefined) return;
    event.preventDefault();
    refs.current[next]?.focus();
    onChange(tab.id);
  };

  return (
    <Root>
      <List role="tablist" aria-label={label}>
        {tabs.map((tab, index) => {
          const selected = tab.id === value;
          return (
            <Tab
              key={tab.id}
              ref={(node) => {
                refs.current[index] = node;
              }}
              type="button"
              role="tab"
              id={tabId(tab.id)}
              aria-selected={selected}
              aria-controls={panelId(tab.id)}
              tabIndex={selected ? 0 : -1}
              onClick={() => onChange(tab.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
            >
              {tab.label}
            </Tab>
          );
        })}
      </List>
      <div role="tabpanel" id={panelId(value)} aria-labelledby={tabId(value)}>
        {children}
      </div>
    </Root>
  );
};
