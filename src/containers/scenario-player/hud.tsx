import { styled } from 'styled-components';

import {
  Button,
  ButtonSize,
  ButtonVariant,
  Countdown,
  CountdownSize,
  MeterBar,
} from '@/components';
import {
  selectMeterViews,
  selectMetersVisible,
  selectRunScenario,
  useAppSelector,
} from '@/store';

import { useFullscreen } from './use-fullscreen';

const Root = styled.header`
  position: absolute;
  top: ${({ theme }) => theme.stage.hudInset};
  right: ${({ theme }) => theme.stage.hudInset};
  left: ${({ theme }) => theme.stage.hudInset};
  z-index: ${({ theme }) => theme.zIndices.hud};
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  pointer-events: none;

  & > * {
    pointer-events: auto;
  }
`;

const Group = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Title = styled.h1`
  margin: 0;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  font-family: ${({ theme }) => theme.fontFamilyDisplay};
  font-size: ${({ theme }) => theme.gameFontSizes.hudTitle};
  font-weight: 800;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.onAccent};
  background: ${({ theme }) => theme.colors.accentRed};
  border: ${({ theme }) => theme.borders.ink};
  box-shadow: ${({ theme }) => theme.shadows.navyMd};
  transform: rotate(-${({ theme }) => theme.tilts.md});
`;

interface HudProps {
  scenarioRemainingMs: number | null;
  onExit: () => void;
}

export const Hud = ({ scenarioRemainingMs, onExit }: HudProps) => {
  const scenario = useAppSelector(selectRunScenario);
  const meters = useAppSelector(selectMeterViews);
  const metersVisible = useAppSelector(selectMetersVisible);
  const fullscreen = useFullscreen();

  // После клика мышью кнопки снимают с себя фокус: иначе следующий
  // Enter/Space нажал бы их снова вместо перехода по сцене (use-player-keys)

  return (
    <Root>
      <Group>
        <Button
          variant={ButtonVariant.Secondary}
          size={ButtonSize.Sm}
          aria-label="Выйти"
          onClick={(event) => {
            event.currentTarget.blur();
            onExit();
          }}
        >
          ✕
        </Button>
        <Title>{scenario?.title}</Title>
      </Group>
      <Group>
        {metersVisible &&
          meters.map((meter) => (
            <MeterBar
              key={meter.id}
              label={meter.label}
              value={meter.value}
              min={meter.min}
              max={meter.max}
              threshold={meter.threshold}
            />
          ))}
        {scenarioRemainingMs !== null && (
          <Countdown
            remainingMs={scenarioRemainingMs}
            size={CountdownSize.Hud}
          />
        )}
        {fullscreen.supported && (
          <Button
            variant={ButtonVariant.Secondary}
            size={ButtonSize.Sm}
            aria-label="Во весь экран"
            aria-pressed={fullscreen.active}
            onClick={(event) => {
              event.currentTarget.blur();
              fullscreen.toggle();
            }}
          >
            {fullscreen.active ? '⤡' : '⤢'}
          </Button>
        )}
      </Group>
    </Root>
  );
};
