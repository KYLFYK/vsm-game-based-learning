import { styled } from 'styled-components';

import { Countdown, CountdownSize } from '@/components/countdown';
import { listReset, pressableStyles } from '@/styles/mixins';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const TimerRow = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const List = styled.ol`
  ${listReset}
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Option = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  font: inherit;
  font-size: ${({ theme }) => theme.gameFontSizes.text};
  font-weight: 600;
  text-align: left;
  color: ${({ theme }) => theme.colors.ink};
  background: ${({ theme }) => theme.colors.bgBase};
  border: ${({ theme }) => theme.borders.ink};
  box-shadow: ${({ theme }) => theme.shadows.navyMd};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.redMd};
  }

  ${pressableStyles}
`;

const Index = styled.span`
  flex: none;
  display: grid;
  place-items: center;
  width: ${({ theme }) => theme.stage.choiceIndexSize};
  height: ${({ theme }) => theme.stage.choiceIndexSize};
  font-family: ${({ theme }) => theme.fontFamilyDisplay};
  font-size: ${({ theme }) => theme.gameFontSizes.choiceNumber};
  font-weight: 900;
  color: ${({ theme }) => theme.colors.onAccent};
  background: ${({ theme }) => theme.colors.accentNavy};
  border: ${({ theme }) => theme.borders.inkThin};
  transform: rotate(-${({ theme }) => theme.tilts.lg});
`;

interface ChoiceListProps {
  options: { id: string; text: string }[];
  onChoose: (id: string) => void;
  remainingMs?: number;
}

export const ChoiceList = ({
  options,
  onChoose,
  remainingMs,
}: ChoiceListProps) => (
  <Root>
    {remainingMs !== undefined && (
      <TimerRow>
        <Countdown remainingMs={remainingMs} size={CountdownSize.Inline} />
      </TimerRow>
    )}
    <List>
      {options.map((option, index) => (
        <li key={option.id}>
          <Option
            type="button"
            aria-keyshortcuts={String(index + 1)}
            onClick={() => onChoose(option.id)}
          >
            <Index aria-hidden="true">{index + 1}</Index>
            {option.text}
          </Option>
        </li>
      ))}
    </List>
  </Root>
);
