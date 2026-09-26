import { styled } from 'styled-components';

import {
  Button,
  ButtonLink,
  ButtonSize,
  ButtonVariant,
} from '@/components/button';
import { BackdropVariant, ComicBackdrop } from '@/components/comic-backdrop';
import { listReset } from '@/styles/mixins';
import type { Scenario } from '@/types';
import { formatTimeLimit, topicLabel } from '@/utils';
import type { BackLink } from '@/utils';

import { meterThresholds } from './meter-thresholds';
import { Screen } from './scenario-player.styles';

const Back = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.stage.hudInset};
  left: ${({ theme }) => theme.stage.hudInset};
  z-index: ${({ theme }) => theme.zIndices.hud};
`;

const Content = styled.div`
  position: absolute;
  inset: 0;
  z-index: ${({ theme }) => theme.zIndices.slots};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: 0 ${({ theme }) => theme.stage.introPadding};
`;

const Kicker = styled.span`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  font-family: ${({ theme }) => theme.fontFamilyDisplay};
  font-size: ${({ theme }) => theme.gameFontSizes.introKicker};
  font-weight: 800;
  text-transform: uppercase;
  background: ${({ theme }) => theme.colors.ink};
  transform: rotate(-${({ theme }) => theme.tilts.md});
`;

const Title = styled.h1`
  max-width: 75%;
  margin: 0;
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  font-family: ${({ theme }) => theme.fontFamilyDisplay};
  font-size: ${({ theme }) => theme.gameFontSizes.introTitle};
  font-weight: 900;
  line-height: 1.05;
  text-transform: uppercase;
  background: ${({ theme }) => theme.colors.accentRed};
  border: ${({ theme }) => theme.borders.ink};
  box-shadow: ${({ theme }) => theme.shadows.inkLg};
  transform: rotate(-${({ theme }) => theme.tilts.md});
`;

const Description = styled.p`
  max-width: ${({ theme }) => theme.stage.introTextWidth};
  margin: 0;
  font-size: ${({ theme }) => theme.gameFontSizes.introText};
  line-height: 1.45;
  color: ${({ theme }) => theme.colors.onAccentMuted};
`;

const Chips = styled.ul`
  ${listReset}
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Chip = styled.li`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  font-size: ${({ theme }) => theme.gameFontSizes.chip};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.ink};
  background: ${({ theme }) => theme.colors.bgBase};
  border: ${({ theme }) => theme.borders.ink};
  box-shadow: ${({ theme }) => theme.shadows.redSm};

  & b {
    font-family: ${({ theme }) => theme.fontFamilyDisplay};
    font-weight: 800;
  }
`;

interface IntroProps {
  scenario: Scenario.Definition;
  /** Куда ведёт «назад»: курс из `course` или каталог на главной */
  back: BackLink;
  onStart: () => void;
}

export const Intro = ({ scenario, back, onStart }: IntroProps) => {
  const topic = scenario.topics[0];
  const thresholds = meterThresholds(scenario);

  return (
    <Screen>
      <ComicBackdrop variant={BackdropVariant.Intro} />
      <Back>
        <ButtonLink
          to={back.to}
          variant={ButtonVariant.Secondary}
          size={ButtonSize.Sm}
        >
          ◂ {back.label}
        </ButtonLink>
      </Back>
      <Content>
        {topic !== undefined && <Kicker>{topicLabel(topic)}</Kicker>}
        <Title>{scenario.title}</Title>
        <Description>{scenario.description}</Description>
        {(scenario.timeLimitSec !== undefined || thresholds.length > 0) && (
          <Chips>
            {scenario.timeLimitSec !== undefined && (
              <Chip>
                Лимит <b>{formatTimeLimit(scenario.timeLimitSec)}</b>
              </Chip>
            )}
            {thresholds.map((threshold) => (
              <Chip key={threshold.id}>
                {threshold.label} — не ниже <b>{threshold.value}</b>
              </Chip>
            ))}
          </Chips>
        )}
        <Button size={ButtonSize.Lg} onClick={onStart}>
          ▶ Начать
        </Button>
      </Content>
    </Screen>
  );
};
